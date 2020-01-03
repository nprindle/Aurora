const path = require('path');

const ClosurePlugin = require('closure-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    main: './out/App.js',
    styles: './stylesheets/styles.css',
  },
  mode: 'production',
  optimization: {
    minimizer: [
      new ClosurePlugin({ mode: 'STANDARD', platform: 'javascript' }, {}),
    ],
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [ MiniCssExtractPlugin.loader, "css-loader" ]
      },
      {
        test: /\.html$/i,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
            },
          },
        ],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "[name].css" }),
    new FixStyleOnlyEntriesPlugin(),
    new OptimizeCssAssetsPlugin(),
    new HtmlWebpackPlugin({
      template: './template.html',
      inject: true,
      inlineSource: '.(js|css)$',
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new CleanWebpackPlugin({
      protectWebpackAssets: false,
      cleanAfterEveryBuildPatterns: [ "*.js", "*.css" ],
    }),
  ],
};
