/* eslint-disable import/no-extraneous-dependencies */

const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const path = require('path');

const srcPath = path.resolve(__dirname, '..', 'src');

module.exports = {
  entry: {
    index: path.resolve(__dirname, '..', 'src', 'index.js'),
  },

  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, '..', 'dist'),
    assetModuleFilename: 'assets/[hash][ext][query]',
  },

  plugins: [
    new ESLintPlugin(),
    new Dotenv(),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new HtmlWebPackPlugin({
      title: 'Battleship',
    }),
  ],

  module: {
    rules: [
      {
        use: ['style-loader', 'css-loader'],
        include: srcPath,
        test: /\.css$/i,
      },

      {
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
        include: srcPath,
        exclude: /node_modules/,
        test: /\.m?js$/,
      },

      {
        test: /\.(png|svg|jpg|jpeg|gif|wav|mp3|json)$/i,
        include: srcPath,
        type: 'asset/resource',
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        include: srcPath,
        type: 'asset/resource',
      },
    ],
  },
};
