const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = env => {

  const entry = process.env.NODE_ENV === 'serve' ? './src/dev.js' : './src/index.js';

  return {
    mode: 'development',
    entry: entry,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'assets/js/main.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [/node_modules/, /\.json$/],
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                emitFile: true,
                name: 'assets/img/[name].[ext]'
              }
            }
          ]
        },
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
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebPackPlugin({
        template: './src/index.html',
        filename: './index.html'
      })
    ],
    serve: {
      dev: {writeToDisk: false},
      hot: true,
      open: true
    }
  }
};