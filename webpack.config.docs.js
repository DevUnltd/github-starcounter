const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const getPackageJson = require('./scripts/getPackageJson');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const {
  version,
  name,
  license,
  repository,
  author,
} = getPackageJson('version', 'name', 'license', 'repository', 'author');

const banner = `
  ${name} v${version}
  ${repository.url}

  Copyright (c) ${author.replace(/ *<[^)]*> */g, " ")} and project contributors.

  This source code is licensed under the ${license} license found in the
  LICENSE file in the root directory of this source tree.
`;

module.exports = {
  mode: "production",
  devtool: 'source-map',
  entry: './src/demo/index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'docs'),
    library: "Starcounter",
    libraryTarget: 'umd',
    clean: true
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({ extractComments: false }),
      new CssMinimizerPlugin()
    ],
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
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(banner),
    new CopyPlugin({
      patterns: [
        { from: "./public", to: "./" },
      ],
    }),
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