var _ = require('lodash');
var async = require('async-chainable');
var fs = require('fs');
var handlebars = require('handlebars');
var mersenneTwister = require('mersenne-twister');
var revman = require('revman');
var tidy = require('htmltidy2').tidy;

module.exports = function(options, finish) {
	var settings = _.defaults(options, {
		revman: null, //  to the revman file to use
		grammar: null, //  to the grammar file to use
		seed: undefined, // Random seed value to use (to get predictable output)
	});

	var randomGenerator = new mersenneTwister(settings.seed);

	async()
		// Sanity checks {{{
		.then(function(next) {
			if (!settings.revman) return next('No RevMan file path specified');
			if (!settings.grammar) return next('No Grammar file path specified');
			next();
		})
		// }}}
		// Read in all file contents {{{
		.parallel({
			grammar: next => fs.readFile(settings.grammar, 'utf-8', next),
			revman: function(next) {
				if (_.isObject(settings.revman)) return next(null, settings.revman); // Already an object
				revman.parseFile(settings.revman, next);
			},
		})
		// }}}
		// Setup handlebars helpers {{{
		.then(function(next) {
			handlebars.registerHelper('ifNone', function(data, node) {
				var comparitor;
				if (!data) {
					comparitor = 0;
				} else if (_.isArray(data)) {
					comparitor = data.length;
				} else {
					comparitor = data;
				}
				return (!comparitor) ? node.fn(this) : '';
			});
			handlebars.registerHelper('ifSingle', function(data, node) {
				var comparitor = _.isArray(data) ? data.length : data;
				return (comparitor == 1) ? node.fn(this) : '';
			});
			handlebars.registerHelper('ifMultiple', function(data, node) {
				var comparitor = _.isArray(data) ? data.length : data;
				return (comparitor > 1) ? node.fn(this) : '';
			});
			handlebars.registerHelper('ifValue', function(left, conditional, right, node) {
				switch (conditional) {
					case '=':
					case '==':
					case 'eq':
						return left == right ? node.fn(this) : '';
					case '<':
					case 'lt':
						return left < right ? node.fn(this) : '';
					case '<=':
					case 'lte':
						return left <= right ? node.fn(this) : '';
					case '>':
					case 'gt':
						return left > right ? node.fn(this) : '';
					case '>=':
					case 'gte':
						return left >= right ? node.fn(this) : '';
					case 'between': // Form: `{{ifValue FIELD 'between' '10 and 20'}}{{#/ifValue}}`
						var bits = right.split(/\s+AND\s+/i);
						return (left > bits[0] && left < bits[1]) ? node.fn(this) : '';
					default:
						throw new Error('Unknown ifValue conditional');
				}
			});

			handlebars.registerHelper('pick', function(node) {
				var options = _(node.fn(this))
					.split(/\s*\n\s*/)
					.filter()
					.map(i => _.trim(i))
					.value();

				return options[Math.round(randomGenerator.random() * options.length)];
			});
			next();
		})
		// }}}
		// Compile template {{{
		.then('result', function(next) {
			var template = handlebars.compile(this.grammar);
			next(null, template(this.revman));
		})
		// }}}
		// Tidy HTML {{{
		.then('result', function(next) {
			tidy(this.result, {
				doctype: 'html5',
				indent: true,
			}, next)
		})
		// }}}
		.end(function(err) {
			if (err) return finish(err);
			finish(null, this.result);
		});

};
