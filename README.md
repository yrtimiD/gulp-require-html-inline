# gulp-require-html-inline
Gulp plugin which inline html templates referenced using `require("path-to-file.html")` notation.
Internally uses [html-minifier](https://www.npmjs.com/package/html-minifier) to convert html file to string.

## Usage example
```sh
npm install --save-dev gulp-require-html-inline
```

[html-minifier](https://www.npmjs.com/package/html-minifier) is a peer dependency, so make sure to install it if it's not already in your `package.json`:

```sh
npm install --save-dev html-minifier
```

```js
//gulpfile.js:
const gulp = require("gulp");
const htmlInline = require("gulp-require-html-inline");

gulp.task("default", function () {
	return gulp.src("./file.js")
		.pipe(htmlInline())
		.pipe(gulp.dest("result"));
});
```

Assuming next files are in the working folder:
```js
//file.js
var a = require("./test.html");
```
```html
<!--test.html-->
<div>
	Some " text ' with ` special characters
</div>
```
Output will be single file:
```js
//result/file.js
var a = `<div>Some " text ' with \` special characters</div>`;
```
For more examples see `demo` folder and execute `npm run demo`

## Configuration
`htmlInline` function accepts optional [minifier options](https://github.com/kangax/html-minifier#options-quick-reference) object.

If not provided, default `{ collapseWhitespace: true }` is used to ensure resulting html is a single line (otherwise it can break commented out `require`s).

❗`collapseWritespace` option might have side effects, be sure to read [documentation](http://perfectionkills.com/experimenting-with-html-minifier/#collapse_whitespace)❗

## Implementation notes
- Require statements are detected using simple regex and no semantic code parsing is done. All kind of quotation marks are supports and both `.html` and `.htm` extensions are accepted. Some examples:
  - `require("a.html")`
  - `require('a.html')`
  - ``require(`a.html`)``
  - `require("a.htm")`
- Unresolved files will be skipped, logged and `require` will be untouched.
- Multiline html files might break commented out require statements. See [Configuration section](#configuration)
