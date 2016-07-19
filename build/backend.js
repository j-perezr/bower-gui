let utils = require("./utils");
let defaults = require("./defaults");
let webpack = require("webpack");
let path = require('path');
let fs = require('fs');

let nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });
let backendConfig = {
    entry: './src/index.js',
    target: 'node',
    output: {
        filename: 'dist/backend.js'
    },
    externals:nodeModules
};
let config = utils.getConfig(defaults, backendConfig);

let build = function(done,ok,fail){
    webpack(config).run(function(err, stats) {
        if(err) {
            console.log('Error', err);
            if(fail) {
                fail(err);
            }
        }
        else {
            console.log(stats.toString());
            if(ok) {
                ok(stats);
            }
        }
        if(done){
            done();
        }
    });
}
module.exports = {
    build:build
};
