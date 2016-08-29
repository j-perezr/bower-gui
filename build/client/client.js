const gulp = require("gulp");
const fs = require("fs");
const path = require("path");
const config = require("../config");
gulp.task("client",function(){
    const webpack = require("webpack-stream");
    let webpackConfig = require("./webpack.config-client.js");
    return gulp.src(config.client.entry.app[0])
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(config.dist));
});

