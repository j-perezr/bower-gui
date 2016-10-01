const gulp = require("gulp");
const gulpsync = require('gulp-sync')(gulp);
const gutil = require("gulp-util");
const config = require("./config");
gulp.task("backend-dist",gulpsync.sync([
    'backend-clean-dist',
    ["backend-typescript:build"]
]));


