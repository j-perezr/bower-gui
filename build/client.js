const gulp = require("gulp");
const gutil = require("gulp-util");
gulp.task("client",function(){
    const utils = require("./utils");
    const defaults = require("./webpack.config-defaults");
    const webpack = require("webpack-stream");
    const config = require("./config.js");
    let webpackConfig = require("./webpack.config-client");
    let clientConfig = utils.getConfig(defaults, webpackConfig);
    //webpackConfig.watch = true;
    return gulp.src('src/client/index.tsx')
        .pipe(webpack(clientConfig))
        .on('error', gutil.log)
        .pipe(gulp.dest(config.dist));
});

