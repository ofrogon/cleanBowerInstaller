"use strict";

const chai = require("chai");
const expect = chai.expect;
const path = require("path");
const fileSystem = require("./../../../dist/lib/fileSystem");
const fse = require("fs-extra");

/**
 * Test /lib/fileSystem.js
 */
describe("fileSystem", function() {
	const tempFolder = path.join(__dirname, "../../../", ".testFolder/tempU");

	/**
	 * Test the mkdirp method
	 */
	it("mkdirp", function(done) {
		const toCreate = path.join(tempFolder, "mkdirp/dept1/dept2");

		fileSystem.mkdirp(toCreate, () => {
			expect(fse.statSync(path.join(tempFolder, "mkdirp")).isDirectory()).to.equal(true);
			expect(fse.statSync(path.join(tempFolder, "mkdirp/dept1")).isDirectory()).to.equal(true);
			expect(fse.statSync(path.join(tempFolder, "mkdirp/dept1/dept2")).isDirectory()).to.equal(true);
			done();
		});
	});

	/**
	 * Test the copy method
	 */
	it("copy", function(done) {
		fileSystem.copy(__filename, path.join(tempFolder, "copy.js"), () => {
			expect(fse.statSync(path.join(tempFolder, "copy.js")).isFile()).to.equal(true);
			expect(fse.readFileSync(path.join(tempFolder, "copy.js"), "utf8")).to.equal(fse.readFileSync(__filename, "utf8"));
			done();
		});
	});

	/**
	 * Test the rmdirR method
	 */
	describe("rmdirR", function() {
		it("no existing folder", function(done) {
			const toDelete = path.join(tempFolder, "mkdirp");

			fileSystem.rmdirR(toDelete, (err) => {
				if (err) {
					expect(err.code).to.equal("ENOENT");

					done();
				} else {
					done("not suppose to pass because the folder were suppose to be deleted");
				}
			});
		});

		it("existing folder", function(done) {
			const toDelete = path.join(tempFolder, "mkdirp");

			fse.mkdirs(toDelete, (err) => {
				if (err) {
					done(err);
				} else {
					fileSystem.rmdirR(toDelete, (err) => {
						done(err);
					});
				}
			});
		});
	});


	afterEach(function(done) {
		fse.remove(tempFolder, done);
	});
});
