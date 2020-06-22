var expect = require('chai').expect;
var fs = require('fs');
var handlebars = require('handlebars');
var mlog = require('mocha-logger');
var replicant = require('..');
var revman = require('revman');
var temp = require('temp');

describe('Replicant - generate abstract for antibiotics-for-sore-throat.rm5', ()=> {

	it('should parse string input', function(done) {
		this.timeout(30 * 1000);

		var tempPath = temp.path({prefix: 'replicant-', suffix: '.html'});

		replicant({
			revman: './test/data/antibiotics-for-sore-throat.rm5',
			grammar: './grammars/hal-en.html',
		}, (err, res) => {
			expect(err).to.not.be.ok;

			fs.writeFileSync(tempPath, res);
			mlog.log('written output to', tempPath);

			expect(res).to.be.a('string');

			console.log('PHRASES',
				[
					/After removing duplicates the number of/,
					/After removing duplicates the unique number of/,
					/Removal of duplicates left/,
					/Removal of duplicates left unique/,
				].filter(re => re.test(res))
			);

			expect(
				[
					/After removing duplicates the number of/,
					/After removing duplicates the unique number of/,
					/Removal of duplicates left (?!unique)/,
					/Removal of duplicates left unique/,
				].filter(re => re.test(res))
			).to.have.lengthOf(1, 'exactly one unique phrase');


			done();
		});
	});

	it('should parse an object input', function(done) {
		this.timeout(30 * 1000);

		revman.parseFile('./test/data/antibiotics-for-sore-throat.rm5', (err, revmanObject) => {
			expect(err).to.not.be.ok;
			expect(revmanObject).to.be.an('object');

			replicant({
				revman: revmanObject,
				grammar: './grammars/hal-en.html',
			}, (err, res) => {
				expect(err).to.not.be.ok;
				expect(res).to.be.a('string');
				done();
			});

		});
	});

});

describe('Generate consistant data when given the same number seed', ()=> {

	var revmanData;
	before('read the revman file', done => {
		revman.parseFile('./test/data/antibiotics-for-sore-throat.rm5', (err, revmanObject) => {
			expect(err).to.not.be.ok;
			expect(revmanObject).to.be.an('object');
			revmanData = revmanObject;
			done();
		});
	});

	[0, 1, 666, 1024, 999].forEach(seed => {
		it(`should return the same data with seed ${seed}`, done => {
			replicant({
				seed: seed,
				revman: revmanData,
				grammar: './grammars/hal-en.html',
			}, function(err, res1) {
				expect(err).to.not.be.ok;

				replicant({
					seed: seed,
					revman: revmanData,
					grammar: './grammars/hal-en.html',
				}, function(err, res2) {
					expect(err).to.be.not.ok;
					// expect(res1).to.equal(res2);
					done();
				});
			});
		});
	});

});

describe.skip('Generate SoF table text', ()=> {

	it('should generate basic SoF table output', function(done) {
		this.timeout(30 * 1000);

		replicant({
			revman: './test/data/antibiotics-for-sore-throat.rm5',
			grammar: './grammars/sof-en.html',
		}, (err, res) => {
			expect(err).to.not.be.ok;
			expect(res).to.be.a('string');
			console.log('OUTPUT', res);
			done();
		});
	});

});
