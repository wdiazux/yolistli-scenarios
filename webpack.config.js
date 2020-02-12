const webpackMerge = require('webpack-merge')
const common = require('./configs/webpack.common')

const envs = {
    development: 'dev',
    production: 'prod',
}
const env = envs[process.env.NODE_ENV || 'development']
const envConfig = require(`./configs/webpack.${env}.js`)
module.exports = webpackMerge(common, envConfig)
