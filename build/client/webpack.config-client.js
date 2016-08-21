const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WriteFilePlugin = require('write-file-webpack-plugin');
module.exports = {
    entry: {
        app:["./src/client/App.tsx"]
    },
    output: {
        path: require("path").resolve("./dist"),
        filename: 'client.js'
    },
    devServer: {
        outputPath: 'dist/client.js'
    },
    watch:true,
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js",".css",".scss"]
    },
    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            {test: /\.tsx?$/, loader: "ts-loader"},
            {
                test: /\.html$/,
                loader: 'file?name=[name].[ext]'
            },
            {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
            {test: /\.scss$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader","sass-loader")}
        ],

        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {test: /\.js$/, loader: "source-map-loader"}
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {},
    plugins: [
        new ExtractTextPlugin("styles.css"),
        new WriteFilePlugin()
    ]
};