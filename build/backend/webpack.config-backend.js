const path = require('path');
const config = require('../config');
module.exports = {
    devtool : 'source-map',
    target: 'node',
    watch: true,
    context: config.base,
    entry: config.backend.entry,
    output: {
        path: config.dist,
        filename: config.backend.dist
    },
    resolve: {
        extensions: ['', '.js', '.ts', '.tsx', '.css'],
    },
    module: {
        loaders: [
            { test: /\.tsx?$/, loaders: ['ts-loader']},
            { test: /\.json$/, loader: 'json-loader' }
        ]
    },
    externals:[],
    plugins: [],
    node: {
        console: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};