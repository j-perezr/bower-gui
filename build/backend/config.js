// set default source and build directories
const gutil = require("gulp-util");
let config = {
    src:process.cwd()+"/src/backend",
    dist:process.cwd()+"/dist/backend",
    production: !!gutil.env.production
};

module.exports = config;