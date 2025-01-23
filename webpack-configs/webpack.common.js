const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');

const paths = require('./paths.js');

module.exports = {
  entry: {
    ui: paths.uiIndex,
    plugin: paths.pluginIndex,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.vanilla\.css$/i,
        use: [
          // MiniCssExtractPlugin.loader,
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false, // Required as image imports should be handled via JS/TS import statements
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
        // exclude vanilla extract files:
        // https://github.com/webpack-contrib/css-loader/issues/672#issuecomment-362480828
        exclude: /\.vanilla\.css$/i,
      },
      {
        test: /\.(png|jpg|gif|webp|svg)$/,
        loader: 'url-loader',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    alias: {
      '@': paths.appPath + '/src',
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  output: {
    filename: '[name].js',
    path: paths.appBuild,
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CaseSensitivePathsPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: paths.uiHtml,
      filename: 'ui.html',
      inlineSource: '.(js)$',
      chunks: ['ui'],
    }),
    new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
    new VanillaExtractPlugin(),
  ],
};
