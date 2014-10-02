var exec = require('child_process').exec;

var isWin = /^win/.test(process.platform);

// Because Windows don't support simlink we have to load locally the lib
if (isWin) {
	exec('npm install bower', function (error, stdout, stderr) {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});
} else {
	exec('npm link bower', function (error, stdout, stderr) {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});
}