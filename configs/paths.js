// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = {
    publicPath: '/',
    root: path.resolve(__dirname, '../'),
    context: path.resolve(__dirname, '../', 'common/src'),
    scenarios: path.resolve(__dirname, '../', 'scenarios/cihuatan'),
    outputPath: path.resolve(__dirname, '../', 'common/dist'),
    entryPath: path.resolve(__dirname, '../', 'common/src/yolistli.ts'),
}
