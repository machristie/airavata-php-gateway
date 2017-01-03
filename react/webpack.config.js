const webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/index.js',
        jobStatus: './src/jobStatus.js',
        vendor: ["react", "react-dom"]
    },
    output: {
        path: './bin',
        filename: '[name].bundle.js',
        libraryTarget: 'var',
        library: "[name]"
    },
    externals: {
        // require("jquery") is external and available
        //  on the global var jQuery
        "jquery": "jQuery"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false,
        //     },
        //     output: {
        //         comments: false,
        //     },
        // }),
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
    ]
}
