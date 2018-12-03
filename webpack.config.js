var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

var dev_mode = process.env.NODE_ENV === 'development';

var plugins = [
    dev_mode && new webpack.HotModuleReplacementPlugin()
].filter(Boolean);

var entry = [
    dev_mode && 'webpack-hot-middleware/client',
    './client/index.js'
].filter(Boolean);

var devtool = dev_mode ? 'inline-source-map' : '';

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    devtool: devtool,
    entry: entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    plugins: plugins,
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                }
            }
        },
        minimizer: [
            new UglifyJSPlugin({
                uglifyOptions: {
                    sourceMap: true,
                    compress: {
                        drop_console: true,
                        conditionals: true,
                        unused: true,
                        comparisons: true,
                        dead_code: true,
                        if_return: true,
                        join_vars: true,
                        warnings: false
                    },
                    output: {
                        comments: false
                    }
                }
            })
        ]
    }

}