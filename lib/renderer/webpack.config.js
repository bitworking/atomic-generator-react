const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',  
  externals: [nodeExternals()],
  entry: './lib/renderer/renderer.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'rendered.js',
    libraryTarget: 'commonjs2'
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
              emitFile: false,
              name: 'assets/[name].[ext]'
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
              outputPath: 'assets/css/'
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
  plugins: []
};
