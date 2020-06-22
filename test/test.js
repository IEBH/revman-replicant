var expect = require('chai').expect;
var replicant = require('..');

describe('Replicant', ()=> {

	it('should parse {{#pick}} elements', done => {
		replicant({
			revman: './test/data/antibiotics-for-sore-throat.rm5',
			grammar: './grammars/test.html',
		}, (err, res) => {
			expect(err).to.not.be.ok;

			expect(res).to.be.a('string');

			expect(
				res.match(/Line \d/g)
			).to.have.lengthOf(1, 'pick one line');

			expect(
				res.match(/Inline \d/g)
			).to.have.lengthOf(1, 'pick one inline item');

			done();
		});
	});

});
