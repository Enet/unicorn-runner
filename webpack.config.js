/* global module, __dirname */

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';

module.exports = function UnicornWebpackConfig (appName, port=8080) {
    return {
        context: __dirname,

        devtool: 'eval',

        resolve: {
            extensions: ['.js', '.jsx'],
            modules: [appName + '-source', 'game-source', 'node_modules'],
            alias: appName === 'editor' ? {
                game: path.resolve(__dirname, 'game-source')
            } : {}
        },

        entry: {
            index: path.resolve(appName + '-source', 'index.jsx')
        },

        output: {
            path: path.resolve(appName + '-output'),
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
                test: /\.png$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10 * 1024,
                        outputPath: 'images/',
                        name: '[name].[hash].[ext]'
                    }
                }, {
                    loader: 'image-webpack-loader',
                    options: {
                        optipng: {
                            enabled: IS_PRODUCTION
                        }
                    }
                }]
            }, {
                test: /\.(?:mp3)$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10 * 1024,
                        outputPath: 'sounds/',
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
                            path.resolve(__dirname, 'game-source', 'styles', 'ui.styl')
                        ]
                    }
                }
            }),

            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
            })
        ],

        devServer: {
            port,
            host: '0.0.0.0',
            contentBase: path.resolve(appName + '-output')
        }
    };
};
