vue.config.js

const webpack = require('webpack')

module.exports = {
    publicPath: './',
    devServer: {
        port: 8080
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@components': path.resolve(__dirname, 'src/components')
        }
    },
    chainWebpack: config => {
        config.plugin('provide').use(webpack.ProvidePlugin, [{
            $: 'jquery',
            jquery: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }])
    }
}
