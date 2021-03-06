# Changelog

## 0.3.4 - 2016-07-02

- Switch the use of the module `cli` for `commander` after the security alert on `cli`.
- Update dependencies.

## 0.3.3 - 2016-04-30

- Fix issue #14
- Fix file renaming
- Update dependencies.
- Add test against Node.js v6.

## 0.3.2 - 2016-02-20

- Update dependencies.
- Change the way the e2e tests were done. Now we use Mocha instead of some custom tests runner.
- Simplify the usage of Grunt.
- Fix typos.
- Fix cInstall.option.default.folder not impacting the cInstall.folder paths.

## 0.3.1 - 2015-11-01

- Add support for coveralls.io for test coverage report.
- Remove useless dependencies.
- Switch blanket.js for istanbul.js as coverage test reporters.
- Update .travis.iml file to stop using legacy version of TravisCI.
- Add test against Node.js v5.

## 0.3.0 - 2015-09-15

- Enhance error handle in `api.js`.
- Accelerate the execution of the tool on an empty value of the field `cInstall` in the `bower.json` file.
- Update dependencies.
- Fix a possible error when using names with glob star.
- Deprecated the use of `automatic` in the API (was already marked as deprecated in the cmd module).
- Better deprecation throw, by using the Node.js `util` module.
- Start using version 1.4.x of q instead of version 2.x.x because it wasn't updated since 2014.

## 0.2.0 - 2015-05-29

- Asynchronous call to the file system and method.
- Clear the dependencies.
- Better configuration object.

## 0.1.2 - 2015-04-02

- Update the dependencies use by the tool.

## 0.1.1 - 2014-12-31

- Bug fixes: Error in the execution of the command "automatic".
- Bug fixes: Error when execute the tool using CLI.
- Bug fixes: Error when executing the command "automatic" or "install" twice in a row.
- Bug fixes: Repair bug with option bower in CLI.

## 0.1.0 - 2014-12-29

- Add new e2e tests.
- Complete the wiki.
- Bug fix.

## 0.0.8 - 2014-12-25

- Add option `removeAfter` to delete the bower_components folder after the tool execution.

## 0.0.7 - 2014-12-22

- Add option `verbose` to display/return more information from the tool execution.
- A lot of bug fixes.
- Change most of the method to be asynchronous.
- Now, the CLI commands call the API ones.
- Add some test for the default tools actions.

## 0.0.6 - 2014-11-25

- Hot fix for an error cause by the use of the option `ignoreExt` of `min`.
- Various regression fixes on the API.

## 0.0.5 - 2014-11-25

- Add new command `automatic` to let clean-bower-installer automatically selects between update or install action to ask bower to do.
- Now the API commands `automatically`, `install` and `update` no more return an output but execute the `run` command automatically.
- Now you can specify extension(s) to ignore when you call the `min` option.

## 0.0.4 - 2014-10-28

- Add way to ignore files.
- Repair documentation (missing documentation to use the `default` option in its new way).

## 0.0.3 - 2014-10-27

- Add option to get minimized version of bower dependencies.
- Add option to set a default folder for minimized files.
- Repair the CLI commands call. Before the CLI section was called as soon as we require the clean-bower-installer module, now it is not (as intended).

## 0.0.2 - 2014-10-08

- Add API.
- Remove error message when rewriting files.
- Mac’s compatibility restoration.
- Various bug fixes.

## 0.0.1 - 2014-10-04

- First module release.
