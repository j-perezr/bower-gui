const backendConfig = {
    entry: './src/index.js',
    target: 'node',
    output: {
        filename: 'dist/backend.js'
    },
    externals:null
};
module.exports = backendConfig;