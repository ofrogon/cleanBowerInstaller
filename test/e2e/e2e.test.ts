"use strict";

/// <reference path="definitions/chai-js.d.ts" />

import * as bower from "bower";
import {expect} from "chai";
import {exec} from "child_process";
import * as fse from "fs-extra";
import {join} from "path";
import * as cbi from "../../src/api";
import CbiConfig from "../../src/bowerConfig/CbiConfig";
import testFolders from "./e2eData.test";
import {isDirectory, isFile, toSha1} from "./tool";

const cliPath = join(__dirname, "..", "..", "lib", "src", "index.js");
const cwd = join(__dirname, "..", "..", testFolders.folder);
const cbiConf = new CbiConfig({cwd});

const e2eTestEnvironmentFactory = (testNumber, done) => {
    testFolders[testNumber].bowerJson.name = testNumber;
    fse.remove(cwd, (removeError) => {
        if (removeError) {
            done(removeError);
        } else {
            fse.outputJson(join(cwd, "bower.json"), testFolders[testNumber].bowerJson, (outputJsonError) => {
                done(outputJsonError);
            });
        }
    });
};

describe("Test file without file type folder and verbose function at false", function() {
    beforeEach(function(done) {
        e2eTestEnvironmentFactory("test0", done);
    });

    it("API", function(done) {
        this.timeout(10000);

        cbi.install(cbiConf, (err, result) => {
            if (err) {
                done(err);
            } else {
                try {
                    expect(isFile(join(cwd, "bower.json"))).to.be.true;
                    expect(isDirectory(join(cwd, "bower_components", "angular"))).to.be.true;
                    expect(isFile(join(cwd, "dest", "angular.js"))).to.be.true;
                    expect(result).to.be.null;

                    done();
                } catch (e) {
                    done(e);
                }
            }
        });
    });

    it("CLI", function(done) {
        this.timeout(10000);

        exec(`node ${cliPath} -i --bower="${cwd}"`, (execError, result) => {
            if (execError) {
                done(execError);
            } else {
                expect(isFile(join(cwd, "bower.json"))).to.be.true;
                expect(isDirectory(join(cwd, "bower_components", "angular"))).to.be.true;
                expect(isFile(join(cwd, "dest", "angular.js"))).to.be.true;
                expect(result).to.equal("clean-bower-installer execution successfully done!\n");

                done();
            }
        });
    });
});

describe("Test the verbose function at true", function() {
    beforeEach(function(done) {
        e2eTestEnvironmentFactory("test1", done);
    });

    it("API", function(done) {
        this.timeout(10000);

        cbi.install(cbiConf, (err, result) => {
            if (err) {
                done(err);
            } else {
                try {
                    expect(isFile(join(cwd, "bower.json"))).to.be.true;
                    expect(isDirectory(join(cwd, "bower_components", "angular"))).to.be.true;
                    expect(isFile(join(cwd, "dest", "angular.js"))).to.be.true;
                    expect(result).to.have.lengthOf(1);
                    expect(result[0].from).match(/.*angular\.js$/);
                    expect(result[0].from).match(/.*angular\.js$/);

                    done();
                } catch (e) {
                    done(e);
                }
            }
        });
    });

    it("CLI", function(done) {
        this.timeout(10000);

        exec(`node ${cliPath} -i --bower="${cwd}"`, (err) => {
            if (err) {
                done(err);
            } else {
                expect(isFile(join(cwd, "bower.json"))).to.be.true;
                expect(isDirectory(join(cwd, "bower_components", "angular"))).to.be.true;
                expect(isFile(join(cwd, "dest", "angular.js"))).to.be.true;
                // expect(stdout).match(/.*clean-bower-installer execution successfully done!\n$/);

                done();
            }
        });
    });
});

describe("Test the update method", function() {
    beforeEach(function(done) {
        e2eTestEnvironmentFactory("test1", done);
    });

    it("API", function(done) {
        this.timeout(10000);

        bower.commands
            .install(["angular#>=1.2.3 <1.3.8"], {save: true}, {cwd})
            .on("end", () => {
                try {
                    expect(isFile(join(cwd, "bower.json"))).to.be.true;
                    expect(isDirectory(join(cwd, "bower_components", "angular"))).to.be.true;
                    expect(isFile(join(cwd, "bower.json"))).to.be.true;
                } catch (e) {
                    done(e);
                }

                testFolders.test1.bowerJson.name = "test1";
                fse.outputJson(join(cwd, "bower.json"), testFolders.test1.bowerJson, (outputJsonError) => {
                    if (outputJsonError) {
                        done(outputJsonError);
                    } else {
                        cbi.update(cbiConf, (updateError, result) => {
                            if (updateError) {
                                done(updateError);
                            } else {
                                bower.commands
                                    .update([], {save: true}, {cwd})
                                    .on("end", (update) => {
                                        try {
                                            expect(isFile(join(cwd, "bower.json"))).to.be.true;
                                            expect(Object.keys(update).length).equal(0);
                                            expect(isDirectory(join(cwd, "bower_components", "angular"))).to.be.true;
                                            expect(isFile(join(cwd, "dest", "angular.js"))).to.be.true;
                                            expect(result).to.be.a("Array");
                                            expect(result.length).equal(1);

                                            done();
                                        } catch (e) {
                                            done(e);
                                        }
                                    })
                                    .on("error", (commandError) => {
                                        done(commandError);
                                    });
                            }
                        });
                    }
                });
            })
            .on("error", (err) => {
                done(err);
            });
    });

    it("CLI", function(done) {
        this.timeout(10000);

        bower.commands
            .install(["angular#>=1.2.3 <1.3.8"], {save: true}, {cwd})
            .on("end", () => {
                try {
                    expect(isDirectory(join(cwd, "bower_components", "angular"))).to.be.true;
                    expect(isFile(join(cwd, "bower.json"))).to.be.true;
                } catch (e) {
                    done(e);
                }

                testFolders.test0.bowerJson.name = "test0";
                exec(`node ${cliPath} -u --bower="${cwd}"`, (execError) => {
                    if (execError) {
                        done(execError);
                    } else {
                        bower.commands
                            .update([], {save: true}, cbiConf)
                            .on("end", (update) => {
                                try {
                                    expect(isFile(join(cwd, "bower.json"))).to.be.true;
                                    expect(Object.keys(update).length).equal(0);
                                    expect(isDirectory(join(cwd, "bower_components", "angular"))).to.be.true;
                                    expect(isFile(join(cwd, "dest", "angular.js"))).to.be.true;

                                    done();
                                } catch (e) {
                                    done(e);
                                }
                            })
                            .on("error", (commandError) => {
                                done(commandError);
                            });
                    }
                });
            })
            .on("error", (err) => {
                done(err);
            });
    });
});

describe("Test the run method", function() {
    beforeEach(function(done) {
        e2eTestEnvironmentFactory("test1", done);
    });

    it("API", function(done) {
        this.timeout(10000);

        bower.commands
            .install(["angular#>=1.2.3 <1.3.8"], {}, {cwd})
            .on("end", () => {
                cbi.run(cbiConf, (err, result) => {
                    if (err) {
                        done(err);
                    } else {
                        try {
                            expect(isFile(join(cwd, "bower.json"))).to.be.true;
                            expect(isDirectory(join(cwd, "bower_components", "angular"))).to.be.true;
                            expect(isFile(join(cwd, "dest", "angular.js"))).to.be.true;
                            expect(isFile(join(cwd, "bower.json"))).to.be.true;
                            expect(result[0].from).match(/.*\.testFolder.tmp.bower_components.angular.angular\.js$/);
                            expect(result[0].to).match(/.*\.testFolder.tmp.dest.angular\.js$/);

                            done();
                        } catch (e) {
                            done(e);
                        }
                    }
                });
            })
            .on("error", (err) => {
                done(err);
            });
    });

    it("CLI", function(done) {
        this.timeout(10000);

        bower.commands
            .install(["angular#>=1.2.3 <1.3.8"], {}, {cwd})
            .on("end", () => {
                exec(`node ${cliPath} --bower="${cwd}"`, (err) => {
                    if (err) {
                        done(err);
                    } else {
                        try {
                            expect(isFile(join(cwd, "bower.json"))).to.be.true;
                            expect(isDirectory(join(cwd, "bower_components", "angular"))).to.be.true;
                            expect(isFile(join(cwd, "dest", "angular.js"))).to.be.true;
                            expect(isFile(join(cwd, "bower.json"))).to.be.true;

                            done();
                        } catch (e) {
                            done(e);
                        }
                    }
                });
            })
            .on("error", (err) => {
                done(err);
            });
    });
});

describe("Test the runMin method", function() {
    beforeEach(function(done) {
        e2eTestEnvironmentFactory("test1", done);
    });

    it("API", function(done) {
        this.timeout(10000);

        bower.commands
            .install(["angular#>=1.2.3 <1.3.8"], {}, {cwd})
            .on("end", () => {
                cbi.runMin(cbiConf, (err) => {
                    if (err) {
                        done(err);
                    } else {
                        try {
                            expect(isFile(join(cwd, "bower.json"))).to.be.true;
                            expect(isDirectory(join(cwd, "bower_components", "angular"))).to.be.true;
                            expect(isFile(join(cwd, "dest", "angular.min.js"))).to.be.true;

                            const minFileGated = fse.readFileSync(join(cwd, "dest", "angular.min.js"));
                            const minFileInBower = fse.readFileSync(
                                join(cwd, "bower_components", "angular", "angular.min.js")
                            );

                            expect(toSha1(minFileGated)).equal(toSha1(minFileInBower));

                            done();
                        } catch (e) {
                            done(e);
                        }
                    }
                });
            })
            .on("error", (err) => {
                done(err);
            });
    });

    it("CLI", function(done) {
        this.timeout(10000);

        bower.commands
            .install(["angular#>=1.2.3 <1.3.8"], {}, {cwd})
            .on("end", () => {
                exec(`node ${cliPath} -m --bower="${cwd}"`, (err) => {
                    if (err) {
                        done(err);
                    } else {
                        try {
                            expect(isFile(join(cwd, "bower.json"))).to.be.true;
                            expect(isDirectory(join(cwd, "bower_components", "angular"))).to.be.true;
                            expect(isFile(join(cwd, "dest", "angular.min.js"))).to.be.true;

                            const minFileGated = fse.readFileSync(join(cwd, "dest", "angular.min.js"));
                            const minFileInBower = fse.readFileSync(
                                join(cwd, "bower_components", "angular", "angular.min.js")
                            );

                            expect(toSha1(minFileGated)).equal(toSha1(minFileInBower));

                            done();
                        } catch (e) {
                            done(e);
                        }
                    }
                });
            })
            .on("error", (err) => {
                done(err);
            });
    });
});

describe("Test the runMinR method", function() {
    beforeEach(function(done) {
        e2eTestEnvironmentFactory("test1", done);
    });

    it("API", function(done) {
        this.timeout(10000);

        bower.commands
            .install(["angular#>=1.2.3 <1.3.8"], {}, {cwd})
            .on("end", () => {
                cbi.runMinR(cbiConf, (err) => {
                    if (err) {
                        done(err);
                    } else {
                        try {
                            expect(isFile(join(cwd, "bower.json"))).to.be.true;
                            expect(isDirectory(join(cwd, "bower_components", "angular"))).to.be.true;
                            expect(isFile(join(cwd, "dest", "angular.js"))).to.be.true;

                            const minFileGated = fse.readFileSync(join(cwd, "dest", "angular.js"));
                            const minFileInBower = fse.readFileSync(
                                join(cwd, "bower_components", "angular", "angular.min.js")
                            );

                            expect(toSha1(minFileGated)).equal(toSha1(minFileInBower));

                            done();
                        } catch (e) {
                            done(e);
                        }
                    }
                });
            })
            .on("error", (err) => {
                done(err);
            });
    });

    it("CLI", function(done) {
        this.timeout(10000);

        bower.commands
            .install(["angular#>=1.2.3 <1.3.8"], {}, {cwd})
            .on("end", () => {
                exec(`node ${cliPath} -M --bower="${cwd}"`, (err) => {
                    if (err) {
                        done(err);
                    } else {
                        try {
                            expect(isFile(join(cwd, "bower.json"))).to.be.true;
                            expect(isDirectory(join(cwd, "bower_components", "angular"))).to.be.true;
                            expect(isFile(join(cwd, "dest", "angular.js"))).to.be.true;

                            const minFileGated = fse.readFileSync(join(cwd, "dest", "angular.js"));
                            const minFileInBower = fse.readFileSync(
                                join(cwd, "bower_components", "angular", "angular.min.js")
                            );

                            expect(toSha1(minFileGated)).equal(toSha1(minFileInBower));

                            done();
                        } catch (e) {
                            done(e);
                        }
                    }
                });
            })
            .on("error", (err) => {
                done(err);
            });
    });
});

describe("Test the removeAfter argument", function() {
    beforeEach(function(done) {
        e2eTestEnvironmentFactory("test2", done);
    });

    it("API", function(done) {
        this.timeout(10000);

        cbi.install(cbiConf, (err) => {
            if (err) {
                done(err);
            } else {
                try {
                    expect(isFile(join(cwd, "bower.json"))).to.be.true;
                    expect(isDirectory(join(cwd, "bower_components", "angular"))).to.be.false;
                    expect(isFile(join(cwd, "dest", "angular.js"))).to.be.true;

                    done();
                } catch (e) {
                    done(e);
                }
            }
        });
    });

    it("CLI", function(done) {
        this.timeout(10000);

        exec(`node ${cliPath} -ir --bower="${cwd}"`, (err) => {
            if (err) {
                done(err);
            } else {
                try {
                    expect(isFile(join(cwd, "bower.json"))).to.be.true;
                    expect(isDirectory(join(cwd, "bower_components", "angular"))).to.be.false;
                    expect(isFile(join(cwd, "dest", "angular.js"))).to.be.true;

                    done();
                } catch (e) {
                    done(e);
                }
            }
        });
    });
});

describe("Test the verbose override", function() {
    beforeEach(function(done) {
        e2eTestEnvironmentFactory("test0", done);
    });

    it("CLI", function(done) {
        this.timeout(10000);

        exec(`node ${cliPath} -iV --bower="${cwd}"`, (err, stdout) => {
            if (err) {
                done(err);
            } else {
                try {
                    expect(isFile(join(cwd, "bower.json"))).to.be.true;
                    expect(isDirectory(join(cwd, "bower_components", "angular"))).to.be.true;
                    expect(isFile(join(cwd, "dest", "angular.js"))).to.be.true;
                    expect(stdout).match(/.*clean-bower-installer execution successfully done!\n$/);

                    done();
                } catch (e) {
                    done(e);
                }
            }
        });
    });
});

describe("Test the file ignore", function() {
    beforeEach(function(done) {
        e2eTestEnvironmentFactory("test3", done);
    });

    it("API", function(done) {
        this.timeout(10000);

        cbi.install(cbiConf, (err) => {
            if (err) {
                done(err);
            } else {
                try {
                    expect(isFile(join(cwd, "bower.json"))).to.be.true;
                    // The "option.removeAfter" should have remove the bower_components folder
                    expect(isDirectory(join(cwd, "bower_components", "bootstrap"))).to.be.false;
                    // Test file to be ignore
                    expect(isFile(join(cwd, "dest", "fonts", "glyphicons-halflings-regular.svg"))).to.be.false;
                    // Test file that is suppose to be there
                    expect(isFile(join(cwd, "dest", "fonts", "glyphicons-halflings-regular.eot"))).to.be.true;

                    done();
                } catch (e) {
                    done(e);
                }
            }
        });
    });
});

describe("Test without option", function() {
    beforeEach(function(done) {
        e2eTestEnvironmentFactory("test4", done);
    });

    it("API", function(done) {
        this.timeout(10000);

        cbi.install(cbiConf, (err) => {
            if (err) {
                done(err);
            } else {
                try {
                    expect(isFile(join(cwd, "bower.json"))).to.be.true;
                    expect(isDirectory(join(cwd, "bower_components", "angular"))).to.be.true;
                    expect(isFile(join(cwd, "angular.js"))).to.be.true;

                    done();
                } catch (e) {
                    done(e);
                }
            }
        });
    });
});

describe("Test the runMin method with default.minFolder", function() {
    beforeEach(function(done) {
        e2eTestEnvironmentFactory("test6", done);
    });

    it("API", function(done) {
        this.timeout(10000);

        bower.commands
            .install(["angular#>=1.2.3 <1.3.8"], {}, {cwd})
            .on("end", () => {
                cbi.runMin(cbiConf, (err) => {
                    if (err) {
                        done(err);
                    } else {
                        try {
                            expect(isFile(join(cwd, "bower.json"))).to.be.true;
                            expect(isDirectory(join(cwd, "bower_components", "angular"))).to.be.true;
                            expect(isFile(join(cwd, "dest_Min", "angular.min.js"))).to.be.true;

                            const minFileGated = fse.readFileSync(join(cwd, "dest_Min", "angular.min.js"));
                            const minFileInBower = fse.readFileSync(
                                join(cwd, "bower_components", "angular", "angular.min.js")
                            );

                            expect(toSha1(minFileGated)).equal(toSha1(minFileInBower));

                            done();
                        } catch (e) {
                            done(e);
                        }
                    }
                });
            })
            .on("error", (err) => {
                done(err);
            });
    });

    it("CLI", function(done) {
        this.timeout(10000);

        bower.commands
            .install(["angular#>=1.2.3 <1.3.8"], {}, {cwd})
            .on("end", () => {
                exec(`node ${cliPath} -M --bower="${cwd}"`, (err) => {
                    if (err) {
                        done(err);
                    } else {
                        try {
                            expect(isFile(join(cwd, "bower.json"))).to.be.true;
                            expect(isDirectory(join(cwd, "bower_components", "angular"))).to.be.true;
                            expect(isFile(join(cwd, "dest_Min", "angular.js"))).to.be.true;

                            const minFileGated = fse.readFileSync(join(cwd, "dest_Min", "angular.js"));
                            const minFileInBower = fse.readFileSync(
                                join(cwd, "bower_components", "angular", "angular.min.js")
                            );

                            expect(toSha1(minFileGated)).equal(toSha1(minFileInBower));

                            done();
                        } catch (e) {
                            done(e);
                        }
                    }
                });
            })
            .on("error", (err) => {
                done(err);
            });
    });
});

describe("Test the option.min.get config", function() {
    beforeEach(function(done) {
        e2eTestEnvironmentFactory("test6", done);
    });

    it("API", function(done) {
        this.timeout(10000);

        cbi.install(cbiConf, (err) => {
            if (err) {
                done(err);
            } else {
                try {
                    expect(isFile(join(cwd, "bower.json"))).to.be.true;
                    expect(isDirectory(join(cwd, "bower_components", "angular"))).to.be.true;
                    expect(isFile(join(cwd, "dest_Min", "angular.min.js"))).to.be.true;

                    const minFileGated = fse.readFileSync(join(cwd, "dest_Min", "angular.min.js"));
                    const minFileInBower = fse.readFileSync(
                        join(cwd, "bower_components", "angular", "angular.min.js")
                    );

                    expect(toSha1(minFileGated)).equal(toSha1(minFileInBower));

                    done();
                } catch (e) {
                    done(e);
                }
            }
        });
    });
});

describe("Test the option.min.get and config.min.rename config", function() {
    beforeEach(function(done) {
        e2eTestEnvironmentFactory("test7", done);
    });

    it("API", function(done) {
        this.timeout(10000);

        cbi.install(cbiConf, (err) => {
            if (err) {
                done(err);
            } else {
                try {
                    expect(isFile(join(cwd, "bower.json"))).to.be.true;
                    expect(isDirectory(join(cwd, "bower_components", "angular"))).to.be.true;
                    expect(isFile(join(cwd, "dest_Min", "angular.js"))).to.be.true;

                    const minFileGated = fse.readFileSync(join(cwd, "dest_Min", "angular.js"));
                    const minFileInBower = fse.readFileSync(
                        join(cwd, "bower_components", "angular", "angular.min.js")
                    );

                    expect(toSha1(minFileGated)).equal(toSha1(minFileInBower));

                    done();
                } catch (e) {
                    done(e);
                }
            }
        });
    });
});

describe("Test file rename, specify folder and ignore file", function() {
    beforeEach(function(done) {
        e2eTestEnvironmentFactory("test8", done);
    });

    it("API", function(done) {
        this.timeout(10000);

        cbi.install(cbiConf, (err) => {
            if (err) {
                done(err);
            } else {
                try {
                    expect(isFile(join(cwd, "bower.json"))).to.be.true;
                    expect(isDirectory(join(cwd, "bower_components", "bootstrap"))).to.be.true;
                    expect(isDirectory(join(cwd, "bower_components", "jquery"))).to.be.true;
                    expect(isFile(join(cwd, "public", "css", "bootstrap.css"))).to.be.true;
                    expect(isFile(join(cwd, "public", "fonts", "glyphicons-halflings-regular.eot"))).to.be.true;
                    expect(isFile(join(cwd, "public", "fonts", "glyphicons-halflings-regular.ttf"))).to.be.true;
                    expect(isFile(join(cwd, "public", "fonts", "glyphicons-halflings-regular.woff"))).to.be.true;
                    expect(isFile(join(cwd, "public", "js", "vendor", "banana.js"))).to.be.true;
                    expect(isFile(join(cwd, "public", "js", "vendor", "min", "bootstrap.min.js"))).to.be.true;
                    expect(isFile(join(cwd, "public", "thisPathIsGlobal", "bootstrap.min.css"))).to.be.true;

                    done();
                } catch (e) {
                    done(e);
                }
            }
        });
    });

    it("CLI", function(done) {
        this.timeout(10000);

        exec(`node ${cliPath} -i --bower="${cwd}"`, (err) => {
            if (err) {
                done(err);
            } else {
                try {
                    expect(isFile(join(cwd, "bower.json"))).to.be.true;
                    expect(isDirectory(join(cwd, "bower_components", "bootstrap"))).to.be.true;
                    expect(isDirectory(join(cwd, "bower_components", "jquery"))).to.be.true;
                    expect(isFile(join(cwd, "public", "css", "bootstrap.css"))).to.be.true;
                    expect(isFile(join(cwd, "public", "fonts", "glyphicons-halflings-regular.eot"))).to.be.true;
                    expect(isFile(join(cwd, "public", "fonts", "glyphicons-halflings-regular.ttf"))).to.be.true;
                    expect(isFile(join(cwd, "public", "fonts", "glyphicons-halflings-regular.woff"))).to.be.true;
                    expect(isFile(join(cwd, "public", "js", "vendor", "banana.js"))).to.be.true;
                    expect(isFile(join(cwd, "public", "js", "vendor", "min", "bootstrap.min.js"))).to.be.true;
                    expect(isFile(join(cwd, "public", "thisPathIsGlobal", "bootstrap.min.css"))).to.be.true;

                    done();
                } catch (e) {
                    done(e);
                }
            }
        });
    });
});

after(function(done) {
    fse.remove(cwd, (err) => {
        if (err) {
            done(err);
        } else {
            done();
        }
    });
});
