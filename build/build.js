const gulp = require("gulp");
gulp.task("build",["client-typescript:build","sass:build","pug:build","backend-typescript:build"]);


