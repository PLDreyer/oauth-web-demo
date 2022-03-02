const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: "./src/main.js",
  mode: "development",
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "./dist"),
    filename: "index_bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  devtool: "hidden-source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    https: {
      key: fs.readFileSync('./oidcclient.com-key.pem'),
      cert: fs.readFileSync('./oidcclient.com.pem'),
    },
    port: 6060,
    hot: true,
    historyApiFallback: true,
    allowedHosts: [
      "oidcclient.com"
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'My App',
      filename: 'index.html',
      template: './public/index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}