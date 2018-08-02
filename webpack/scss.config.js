const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = env => {

  const entry = process.env.NODE_ENV === 'serve' ? './src/dev.js' : './src/index.js';

  return {
    mode: 'development',
    entry: './src/main.scss',
    module: {
      rules: [
        {
          test: /\.scss$/,
  	      use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].css',
                outputPath: 'assets/css'
              }
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader'
            }
          ]
        }
      ]
    },   
  }
};