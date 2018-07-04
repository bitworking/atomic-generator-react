const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = [
  {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.(png|jpg|gif|svg|css)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                emitFile: true,
                name: 'assets/[name].[ext]'
              }
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
    ]
  
  }
];