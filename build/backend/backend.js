let gulp = require("gulp");
let gutil = require("gulp-util");
gulp.task("backend",function(){
    let utils = require("./../common/utils.js");
    let defaults = require("./../webpack.config-defaults.js");
    let webpack = require("webpack-stream");
    let fs = require('fs');
    let webpackConfig = require("./webpack.config-backend.js");
    let nodeModules = {};
    fs.readdirSync('node_modules')
        .filter(function(x) {
            return ['.bin'].indexOf(x) === -1;
        })
        .forEach(function(mod) {
            nodeModules[mod] = 'commonjs ' + mod;
        });
    let config = utils.getConfig(defaults, webpackConfig);
    config.externals=nodeModules;
    return gulp.src('src/index.js')
        .pipe(webpack(config))
        .on('error', gutil.log)
        .pipe(gulp.dest('./'));
});

