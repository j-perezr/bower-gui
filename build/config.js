const path = require("path");
let base = process.cwd();
const config = {
    base:base,
    dist:path.resolve(base,"./dist"),
    src:path.resolve(base,"./src"),
    backend:{
        entry:path.resolve(base,'./src/index.js'),
        dist:'backend.js'
    }
};
module.exports = config;
