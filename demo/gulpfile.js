const gulp = require("gulp");
const htmlInline = require("../");
//const htmlInline = require("gulp-require-html-inline");

gulp.task("default", function () {
	return gulp.src("./file.js")
		.pipe(htmlInline())
		.pipe(gulp.dest("result"));
});
