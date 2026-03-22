'use strict';

const { merge } = require('webpack-merge');

const webpackConfigBase = require('./webpackConfigBase');

module.exports = merge(
  webpackConfigBase,
  {
    devServer: {
      proxy: [
        {
          context: ['**'],
          target: 'http://localhost:3456'
        }
      ]
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  quietDeps: true
                }
              }
            }
          ]
        }
      ]
    }
  }
);
