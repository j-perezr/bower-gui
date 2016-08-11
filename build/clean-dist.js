var config 		 = require('./config');
var gulp       = require('gulp');
var clean = require("gulp-clean");
gulp.task('clean-dist', function() {
    return gulp.src('./'+config.dist)
        .pipe(clean({force: true}));
});