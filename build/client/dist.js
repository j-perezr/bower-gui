const gulp = require("gulp");
const gulpsync = require('gulp-sync')(gulp);
const gutil = require("gulp-util");
const config = require("./config");
gulp.task("client-dist",gulpsync.sync([
    'client-clean-dist',
    ["client-typescript:build","sass:build",'pug:build','copy-bower-assets'],
    (config.production ? 'usemin:dist' : "usemin:build")
]));


