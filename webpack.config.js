/* global module, __dirname */

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    context: __dirname,

    devtool: 'eval',

    resolve: {
        extensions: ['.js', '.jsx'],
        modules: ['source', 'node_modules']
    },

    entry: {
        index: path.resolve('source', 'index.jsx')
    },

    output: {
        path: path.resolve('output'),
        publicPath: '/',
        filename: path.join('bundles', '[name].js')
    },

    module: {
        rules: [{
            enforce: 'pre',
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: 'eslint-loader'
        }, {
            test: /\.jsx?$/,
            use: 'babel-loader'
        }, {
            enforce: 'pre',
            test: /\.styl$/,
            use: 'stylint-loader'
        }, {
            test: /\.styl$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'stylus-loader']
            })
        }, {
            test: /\.yaml$/,
            use: ['json-loader', 'yaml-loader']
        }, {
            test: /\.json$/,
            use: ['json-loader']
        }, {
            test: /\.(?:gif|png|jpe?g)$/i,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 0 * 1024,
                    outputPath: 'images',
                    name: '[name].[hash].[ext]'
                }
            }]
        }, {
            test: /\.(?:mp3)$/i,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 0 * 1024,
                    outputPath: 'sounds',
                    name: '[name].[hash].[ext]'
                }
            }]
        }]
    },

    plugins: [
        new ExtractTextPlugin(path.join('bundles', '[name].css')),

        new webpack.LoaderOptionsPlugin({
            options: {
                stylus: {
                    use: [require('nib')()],
                    import: [
                        '~nib/lib/nib/index.styl',
                        path.resolve(__dirname, 'source', 'styles', 'ui.styl')
                    ]
                }
            }
        })
    ],

    devServer: {
        contentBase: path.resolve('output')
    }
};
