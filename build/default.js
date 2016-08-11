const gulp = require("gulp");
const gulpsync = require("gulp-sync")(gulp);
gulp.task("default",gulpsync.sync([
    'clean-dist',
    ["backend","client"]
]));