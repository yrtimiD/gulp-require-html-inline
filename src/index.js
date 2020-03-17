'use strict'
const through = require('through2')
const fs = require('fs')
const path = require('path');
const minify = require('html-minifier').minify;
const PluginError = require('plugin-error');
const log = require('gulplog');
const PLUGIN_NAME = 'gulp-require-html-inline';

const requireHtmlRegexp = /require\(["'`](.*?\.html)["'`]\)/ig;

module.exports = function () {
	return through.obj(function (file, enc, cb) {

		if (file.isNull()) {
			cb(null, file)
			return
		}

		if (file.isStream()) {
			cb(new PluginError(PLUGIN_NAME, 'Streaming is not supported yet'));
			return;
		}

		const content = file.contents.toString();
		const updatedContent = content.replace(requireHtmlRegexp, function (match, requirePath) {
			const htmlFilePath = path.isAbsolute(requirePath) ? requirePath : path.join(path.dirname(file.path), requirePath);
			if (fs.existsSync(htmlFilePath)) {
				let htmlFileContent = fs.readFileSync(htmlFilePath, { encoding: enc });
				htmlFileContent = minify(htmlFileContent, {});
				log.debug(`Inlining ${requirePath}`);
				return "`" + htmlFileContent.replace(/`/g, '\\\`') + "`";
			} else {
				log.warn(`${PLUGIN_NAME}: Required file ${requirePath} (${htmlFilePath}) doesn't exists. Leaving unchanged.`);
				return match;
			}
		});

		file.contents = Buffer.from(updatedContent);
		cb(null, file)
	});
}
