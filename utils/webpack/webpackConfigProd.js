'use strict';

const { merge } = require('webpack-merge');
const MiniCssExtractPlugin
  = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin
  = require('optimize-css-assets-webpack-plugin');

const webpackConfigBase = require('./webpackConfigBase');

module.exports = merge(
  webpackConfigBase,
  {
    plugins: [
      new MiniCssExtractPlugin(
        {
          filename: 'styles.css'
        }
      ),
      new OptimizeCssAssetsWebpackPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    }
  }
);
