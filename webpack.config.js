const envs = {
    development: 'dev',
    production: 'prod',
}
const env = envs[process.env.NODE_ENV || 'development']
module.exports = () => {
    console.log(`🛠️  running ${env} Mode using ./webpack/webpack.${env}.js 🛠️`)
    return require(`./webpack/webpack.${env}.js`)
}
