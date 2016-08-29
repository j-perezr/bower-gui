const gulp = require("gulp");
const fs = require("fs");
const path = require("path");
const config = require("../config");
gulp.task("backend",function(){
    const webpack = require("webpack-stream");
    const fs = require('fs');
    let webpackConfig = require("./webpack.config-backend.js");
    let nodeModules = {};
    fs.readdirSync('node_modules')
        .filter(function(x) {
            return ['.bin'].indexOf(x) === -1;
        })
        .forEach(function(mod) {
            nodeModules[mod] = 'commonjs ' + mod;
        });
    webpackConfig.externals=nodeModules;
    return gulp.src(config.backend.entry)
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(config.dist));
});

