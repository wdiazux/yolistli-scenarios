const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const { prodPath, srcPath, rootPath } = require('./path')

module.exports = {
    entry: './' + srcPath + '/index.ts',
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, prodPath),
        filename: 'yolistli.js',
        library: 'Yolistli',
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    devtool: 'source-map',
    devServer: {
        open: true,
        disableHostCheck: true,
        contentBase: path.join(__dirname, rootPath),
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/',
                        },
                    },
                ],
            },
            {
                test: /\.(sass|scss|css)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                includePaths: ['node_modules'],
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'yolistli.css',
        }),
        new CopyPlugin([
            {
                from: 'node_modules/axios/dist/*.min.*',
                to: './',
                flatten: true,
            },
        ]),
        new HtmlWebpackPlugin({
            inject: false,
            hash: false,
            template: './' + srcPath + '/index.html',
            filename: 'index.html',
        }),
    ],
}
