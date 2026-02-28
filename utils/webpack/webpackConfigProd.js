'use strict';

import webpackMerge from 'webpack-merge';
import MiniCssExtractPlugin 
  from 'mini-css-extract-plugin';
import OptimizeCssAssetsWebpackPlugin
  from 'optimize-css-assets-webpack-plugin';

import webpackConfigBase from './webpackConfigBase';

export default webpackMerge(
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
