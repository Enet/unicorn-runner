/* global module */

const UnicornWebpackConfig = require('./webpack.config.js');
module.exports = new UnicornWebpackConfig('game', 8080);
