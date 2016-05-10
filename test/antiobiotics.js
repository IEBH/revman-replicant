var expect = require('chai').expect;
var handlebars = require('handlebars');
var replicant = require('..');

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
