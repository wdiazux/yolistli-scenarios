const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const commonPaths = require('./paths');

module.exports = {
    entry: commonPaths.entryPath,
    output: {
        filename: 'yolistli.js',
        path: commonPaths.outputPath,
        publicPath: commonPaths.publicPath,
        library: 'Yolistli',
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    module: {
        rules: [
            {
                test: /\.(ts)$/,
                exclude: [/node_modules/],
                loader: 'babel-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', 'json'],
    },
    plugins: [
        //new CleanWebpackPlugin(),
        new CopyPlugin([
            {
                from: 'node_modules/axios/dist/*.min.*',
                to: './',
                flatten: true,
            },
        ]),
    ],
}
