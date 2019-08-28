const path = require('path');
const entryFile = path.resolve(__dirname, 'src', 'index.js');
const outputDir = path.resolve(__dirname, 'dist');

const webpack = require('webpack');

module.exports = {
  entry: ['@babel/polyfill', entryFile],
  output: {
    publicPath: '/',
    filename: 'bundle.js',
    path: outputDir
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
          }
        ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: './dist',
    hot: true,
    proxy: {
      '/api/*': 'http://localhost:80',
      '/login': 'http://localhost:80',
      '/logout': 'http://localhost:80',
      '/forgot': 'http://localhost:80',
      '/signup': 'http://localhost:80',
      '/admin': 'http://localhost:80',
      '/reset': 'http://localhost:80',
      '/reports': 'http://localhost:80'
    }
  }
};
