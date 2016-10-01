const gulp = require('gulp');
const usemin = require('gulp-usemin');
const uglify = require('gulp-uglify');
const minifyCss = require('gulp-minify-css');
const rev = require('gulp-rev');
const config = require('./../config');
gulp.task('usemin:build', function () {
    return gulp.src(config.src + '/index.html')
        .pipe(usemin())
        .pipe(gulp.dest(config.dist));
});

gulp.task('usemin:dist', function () {
    return gulp.src(config.src + '/index.html')
        .pipe(usemin({
            js:[uglify(),rev()],
            jsVendor:[uglify(),rev()],
            css:[minifyCss(),rev()],
            cssVendor:[minifyCss(),rev()]
        }))
        .pipe(gulp.dest(confign.dist));
});