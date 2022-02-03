const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  devtool: 'cheap-module-source-map',
  entry: './src/demo/index.ts',
  output: {
    filename: 'index.js'
  },
  optimization: {
    minimize: false,
  },
  devServer: {
    open: true,
    hot: true,
    host: "localhost",
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.(m|j|t)s$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./templates/index.html",
      inject: false
    }),
    new HtmlWebpackPlugin({
      filename: "badge.html",
      template: "./templates/badge.html",
      inject: false
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js', '.json']
  }
};