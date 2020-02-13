const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const commonPaths = require('./paths')

module.exports = {
    entry: commonPaths.entryPath,
    output: {
        filename: '[name].js',
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
            /*
            {
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it uses publicPath in webpackOptions.output
                            // publicPath: "../",
                            publicPath: './src',
                            hmr: false
                        },
                    },
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                includePaths: [
                                    path.resolve(__dirname, '../node_modules/')
                                ]
                            }
                        },
                    }
                ]
            },
            */
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', 'json', '.scss'],
    },
    plugins: [
        //new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
        new CopyPlugin([
            {
                from: 'node_modules/axios/dist/*.min.*',
                to: './',
                flatten: true,
            },
        ]),
    ],
}
