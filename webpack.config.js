const path = require('path');
const entryFile = path.resolve(__dirname, 'client', 'src', 'index.js');
const outputDir = path.resolve(__dirname, 'client', 'dist');

const webpack = require('webpack');

module.exports = {
  entry: ['@babel/polyfill', entryFile],
  output: {
    publicPath: "/",
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
    contentBase: './client/dist',
    hot: true,
    proxy: {
      '/api/*': 'http://localhost:3000',
      '/login': 'http://localhost:3000',
      '/logout': 'http://localhost:3000',
      '/forgot': 'http://localhost:3000',
      '/signup': 'http://localhost:3000',
      '/admin': 'http://localhost:3000',
      '/reset': 'http://localhost:3000',
      '/reports': 'http://localhost:3000'
    }
  }
};
