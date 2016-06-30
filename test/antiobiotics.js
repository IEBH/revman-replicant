var expect = require('chai').expect;
var handlebars = require('handlebars');
var replicant = require('..');
var revman = require('revman');

describe('Replicant - generate abstract for antibiotics-for-sore-throat.rm5', function() {
	var data;

	before(function(next) {
		this.timeout(30 * 1000);

		replicant({
			revman: './test/data/antibiotics-for-sore-throat.rm5',
			grammar: './grammars/hal-en.html',
		}, function(err, res) {
			expect(err).to.be.not.ok;
			data = res;
			next();
		});
	});

	it('should parse the file', function() {
		expect(data).to.be.a.string;
	});

	it('XXX', function() {
		console.log(data);
	});
});


describe('Replicant - generate abstract for antibiotics-for-sore-throat (as an object)', function() {
	var data;

	before(function(next) {
		this.timeout(30 * 1000);

		revman.parseFile('./test/data/antibiotics-for-sore-throat.rm5', function(err, revmanObject) {
			expect(err).to.be.not.ok;
			expect(revmanObject).to.be.an.object;

			replicant({
				revman: revmanObject,
				grammar: './grammars/hal-en.html',
			}, function(err, res) {
				expect(err).to.be.not.ok;
				data = res;
				next();
			});

		});
	});

	it('should parse the file', function() {
		expect(data).to.be.a.string;
	});
});
