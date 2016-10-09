
// set default source and build directories
const gutil = require("gulp-util");
let config = {
    src:process.cwd()+"/src/client",
    dist:process.cwd()+"/dist/client",
    production: !!gutil.env.production,
    bower:[
        "src/bower_components/**/*.js",
        "src/bower_components/**/*.css",
        "src/bower_components/**/*.html",
        "src/bower_components/**/*.json",
        "src/bower_components/**/*.svg",
        "src/bower_components/**/*.jpg",
        "src/bower_components/**/*.png",
        "src/bower_components/**/*.gif",
        "src/bower_components/**/*.otf",
        "src/bower_components/**/*.ttf",
        "src/bower_components/**/*.woff",
        "src/bower_components/**/*.woff2",
        "src/bower_components/**/*.eot",
        "!src/bower_components/**/scss",
        "!src/bower_components/**/less",
        "!src/bower_components/**/test",
        "!src/bower_components/**/LICENSE",
        "!src/bower_components/**/CHANGELOG.md",
        "!src/bower_components/**/README.md",
        "!src/bower_components/**/.gitignore",
        "!src/bower_components/**/bower.json",
        "!src/bower_components/**/package.json"
    ],
    bowerAssets:[
        "src/bower_components/**/*.css",
        "src/bower_components/**/*.html",
        "src/bower_components/**/*.svg",
        "src/bower_components/**/*.json",
        "src/bower_components/**/*.jpg",
        "src/bower_components/**/*.png",
        "src/bower_components/**/*.gif",
        "src/bower_components/**/*.otf",
        "src/bower_components/**/*.ttf",
        "src/bower_components/**/*.woff",
        "src/bower_components/**/*.woff2",
        "src/bower_components/**/*.eot",
        "!src/bower_components/animate.css/source",
        "!src/bower_components/jquery/src",
        "!src/bower_components/jquery/external",
        "!src/bower_components/**/scss",
        "!src/bower_components/**/less",
        "!src/bower_components/**/test",
        "!src/bower_components/**/LICENSE",
        "!src/bower_components/**/CHANGELOG.md",
        "!src/bower_components/**/README.md",
        "!src/bower_components/**/.gitignore",
        "!src/bower_components/**/*.js",
        "!src/bower_components/**/bower.json",
        "!src/bower_components/**/package.json"
    ]
};

module.exports = config;