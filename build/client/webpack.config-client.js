const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');
const config = require('../config');
const webpack = require("webpack");
module.exports = {
    devtool : 'source-map',
    watch: true,
    context: config.base,
    entry: config.client.entry,
    output: {
        path: config.dist,
        filename: config.client.dist
    },
    target: 'web',
    resolve: {
        modulesDirectories: [ 'node_modules' ],
        extensions: ['', '.js', '.ts', '.tsx', '.css', '.scss'],
    },
    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.html$/,
                loader: 'file?name=[name].[ext]'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader","sass-loader")
            }
        ],

        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },
    externals:[],
    plugins:[
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
        new ExtractTextPlugin("styles.css")
    ]
};