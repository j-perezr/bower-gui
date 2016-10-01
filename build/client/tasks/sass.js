'use strict';

const gulp = require('gulp');
const gutil = require("gulp-util");
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const path = require("path");
const config = require("./../config");
const scssFiles = path.resolve(config.src,'**/*.scss');
gulp.task('sass:build', function () {
    return gulp.src(scssFiles)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle:"expanded"}).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.src));
});

gulp.task('sass:watch', function () {
    gutil.log("Waiting for sass changes");
    gulp.watch(scssFiles, ['sass:build']);
});