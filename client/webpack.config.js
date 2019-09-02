const path = require('path');
const entryFile = path.resolve(__dirname, 'src', 'index.js');
const outputDir = path.resolve(__dirname, 'dist');

const webpack = require('webpack');

var secure;
if (process.env.NODE_ENV === 'production') {
  secure = true;
} else {
  secure = false;
}

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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __SECURE__: secure
    }),
    new webpack.DefinePlugin({
      'process.browser': 'true'
    }),
  ],
  node: {
    fs: 'empty'
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './dist',
    hot: true,
    proxy: {
      '/api/*': 'http://localhost:3000',
      '/socket.io/*': {
        target: 'http://localhost:3000',
        ws: true
      },
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
