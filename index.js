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
			// Conditionals {{{
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

				return options[Math.floor(randomGenerator.random() * options.length)];
			});
			// }}}

			// Formatters {{{
			handlebars.registerHelper('formatLowerCase', function(data) {
				if (_.isUndefined(data)) return 'FIXME:UNDEFINED!';
				return data.toLowerCase();
			});
			handlebars.registerHelper('formatNumber', function(data, dp) {
				if (_.isUndefined(data)) return 'FIXME:UNDEFINED!';
				return _.round(data, dp).toLocaleString();
			});
			handlebars.registerHelper('formatP', function(data) {
				if (_.isUndefined(data)) return 'FIXME:UNDEFINED!';
				return (
					data <= 0.00001 ? 'P < 0.00001' :
					data <= 0.0001 ? 'P < 0.0001' :
					data <= 0.001 ? 'P < 0.001' :
					data <= 0.01 ? 'P < 0.01' :
					data <= 0.05 ? 'P < 0.05' :
					'P = ' + data
				);
			});
			// }}}

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
				wrap: 0,
			}, next)
		})
		// }}}
		.end(function(err) {
			if (err) return finish(err);
			finish(null, this.result);
		});

};
