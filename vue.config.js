vue.config.js

module.exports = {
    publicPath: '/',
    devServer: {
        port: 8080
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@components': path.resolve(__dirname, 'src/components')
        }
    }
}
