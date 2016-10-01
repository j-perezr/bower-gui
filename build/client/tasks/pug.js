const gulp = require("gulp");
const pug = require("gulp-pug");
const path = require("path");
const gutil = require("gulp-util");
const config = require("./../config");
const pugFiles = path.resolve(config.src,"**/*.pug");
gulp.task("pug:build", function () {
    return gulp.src(pugFiles)
        .pipe(pug({
            pretty:true
        }))
        .pipe(gulp.dest(config.src));
});
gulp.task('pug:watch', ['pug:build'], function() {
    gutil.log("Waiting for pug changes");
    gulp.watch(pugFiles, ['pug:build']);
});