/* eslint-disable import/no-extraneous-dependencies */

const { merge } = require('webpack-merge');
const path = require('path');
const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '..', 'dist'),
  },
});
