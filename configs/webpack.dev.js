const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const commonPaths = require('./paths');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: commonPaths.root,
        historyApiFallback: true,
    },
})
