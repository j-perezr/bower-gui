const WriteFilePlugin = require('write-file-webpack-plugin');
const WebpackExecute = require("./WebpackExecute");
const backendConfig = {
    entry: './src/index.js',
    target: 'node',
    output: {
        filename: 'dist/backend.js'
    },
    devServer: {
        outputPath: 'dist/backend.js'
    },
    externals:null,
    plugins:[
        new WriteFilePlugin(),
        new WebpackExecute()
    ]
};
module.exports = backendConfig;