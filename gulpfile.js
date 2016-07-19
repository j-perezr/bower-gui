var gulp = require('gulp');
var webpack = require('webpack');
gulp.task('build-backend', function(done) {
    let buildBackend = require("./build/backend");
    buildBackend.build(done);
});