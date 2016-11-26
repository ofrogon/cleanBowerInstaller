#!/usr/bin/env node
"use strict";

import { cli } from "../lib/main";

const errorFct = (err: Error) => {
	console.error(err);
	process.exit(1);
};

if (require.main === module) {
	import * as program from "commander";
	import * as fs from "fs";

	fs.readFile("../package.json", {encoding: "utf8"}, (err: Error, data: string) => {
		if (err) {
			errorFct(err);
		} else {
			try {
				const pkg = JSON.parse(data);

				program
					.version(pkg.version, "-v, --version")
					.option("-i, --install", "Run bower install command", null, null)
					.option("-u, --update", "Run bower update command", null, null)
					.option("-b, --bower [path]", "Input the bower.json file path.", ".", null)
					.option("-m, --min", "Try to get .min file version first.", null, null)
					.option("-M, --renameMin", "Try to get .min file version first and keep the name specified in the bower.json file.", null, null)
					.option("-V, --verbose", "Get more information from the tool.", null, null)
					.option("-r, --removeAfter", "Remove the bower_components folder after execution.", null, null)
					.parse(process.argv);

				cli(program);
			} catch (e) {
				errorFct(e);
			}
		}
	});
} else {
	export { api };
}
