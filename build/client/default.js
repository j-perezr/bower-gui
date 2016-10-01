const gulp = require("gulp");
gulp.task("client-default",["client-typescript:watch","sass:watch","pug:watch"]);


