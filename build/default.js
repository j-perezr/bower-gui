const gulp = require("gulp");
gulp.task("default",["client-typescript:watch","sass:watch","pug:watch","backend-typescript:watch"]);


