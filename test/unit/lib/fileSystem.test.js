"use strict";

var chai = require("chai"),
	expect = chai.expect,
	path = require("path"),
	fileSystem = require("./../../../lib/fileSystem");

// Legacy support
var nodeVersion = process.versions.node.split(".");
var legacy = !!(Number(nodeVersion[0]) === 0 && nodeVersion[1] < 11);

/**
 * Test /lib/fileSystem.js
 */
describe("fileSystem", function() {
	var tempFolder = path.join(__dirname, "../../../", ".temp");

	/**
	 * Test the mkdirp method
	 */
	it("mkdirp", function(done) {
		var toCreate = path.join(tempFolder, "mkdirp/dept1/dept2");
		fileSystem.mkdirp(toCreate, 511, function() {
			expect(fileSystem.statSync(path.join(tempFolder, "mkdirp")).isDirectory()).to.be.true;
			expect(fileSystem.statSync(path.join(tempFolder, "mkdirp/dept1")).isDirectory()).to.be.true;
			expect(fileSystem.statSync(path.join(tempFolder, "mkdirp/dept1/dept2")).isDirectory()).to.be.true;
			done();
		});
	});

	/**
	 * Test the mkdirpQ method
	 */
	it("mkdirpQ", function(done) {
		var toCreate = path.join(tempFolder, "mkdirpQ/dept1/dept2");
		fileSystem.mkdirpQ(toCreate, 511).then(
			function() {
				expect(fileSystem.statSync(path.join(tempFolder, "mkdirpQ")).isDirectory()).to.be.true;
				expect(fileSystem.statSync(path.join(tempFolder, "mkdirpQ/dept1")).isDirectory()).to.be.true;
				expect(fileSystem.statSync(path.join(tempFolder, "mkdirpQ/dept1/dept2")).isDirectory()).to.be.true;
				done();
			},
			function(e) {
				done(e);
			}
		);
	});

	/**
	 * Test the copy method
	 */
	it("copy", function(done) {
		fileSystem.copy(__filename, path.join(tempFolder, "copy.js"), function() {
			expect(fileSystem.statSync(path.join(tempFolder, "copy.js")).isFile()).to.be.true;
			expect(fileSystem.readFileSync(path.join(tempFolder, "copy.js"), "utf8")).to.equal(fileSystem.readFileSync(__filename, "utf8"));
			done();
		});
	});

	/**
	 * Test the copyQ method
	 */
	it("copyQ", function(done) {
		fileSystem.copyQ(__filename, path.join(tempFolder, "copyQ.js")).then(
			function() {
				expect(fileSystem.statSync(path.join(tempFolder, "copyQ.js")).isFile()).to.be.true;
				expect(fileSystem.readFileSync(path.join(tempFolder, "copyQ.js"), "utf8")).to.equal(fileSystem.readFileSync(__filename, "utf8"));
				done();
			},
			function(e) {
				done(e);
			}
		);
	});

	/**
	 * Test the rmdirR method
	 */
	it("rmdirR", function(done) {
		this.timeout(2000);
		var toDelete = path.join(tempFolder, "mkdirp");

		setTimeout(function() {
			fileSystem.rmdirR(toDelete, function() {
				try {
					fileSystem.accessSync(path.join(tempFolder, "mkdirp/dept1/dept2"));
					fileSystem.accessSync(path.join(tempFolder, "mkdirp/dept1"));
					fileSystem.accessSync(path.join(tempFolder, "mkdirp"));
					done("not suppose to pass because the folder were suppose to be deleted");
				} catch (e) {
					if (legacy) {
						expect(e).to.be.an.instanceof(TypeError);
					} else {
						expect(e.code).to.equal("ENOENT");
					}

					done();
				}
			});
		}, 200);
	});

	/**
	 * Test the rmdirRQ method
	 */
	it("rmdirRQ", function(done) {
		this.timeout(2000);
		var toDelete = path.join(tempFolder, "mkdirpQ");

		setTimeout(function() {
			fileSystem.rmdirRQ(toDelete).then(
				function() {
					try {
						fileSystem.accessSync(path.join(tempFolder, "mkdirpQ/dept1/dept2"));
						fileSystem.accessSync(path.join(tempFolder, "mkdirpQ/dept1"));
						fileSystem.accessSync(path.join(tempFolder, "mkdirpQ"));
						done("not suppose to pass because the folder were suppose to be deleted");
					} catch (e) {
						if (legacy) {
							expect(e).to.be.an.instanceof(TypeError);
						} else {
							expect(e.code).to.equal("ENOENT");
						}
						done();
					}
				},
				function(e) {
					done(e);
				}
			);
		}, 400);
	});

	after(function() {
		fileSystem.unlinkSync(path.join(tempFolder, "copy.js"));
		fileSystem.unlinkSync(path.join(tempFolder, "copyQ.js"));
	});
});
