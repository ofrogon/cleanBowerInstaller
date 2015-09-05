var path = require("path"),
	srcDir1 = path.join(__dirname, "bin"),
	srcDir2 = path.join(__dirname, "lib");

require("blanket")({
	// Only files that match the pattern will be instrumented
	pattern: [srcDir1, srcDir2],
	"data-cover-reporter-options": {
		"relativepath": true
	}
});
