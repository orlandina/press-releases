const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const PurifyCSSPlugin = require('purifycss-webpack');
const glob = require('glob');

const extractStyles = new ExtractTextPlugin({
  filename: 'public/assets/press/css/main.css'
});

module.exports = {
  entry: './themes/seo-pages-hugo-theme/js/main.js',
  output: {
    filename: 'public/assets/press/js/main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.scss$/,
        use: extractStyles.extract({
          use: [
            'raw-loader',
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                outputStyle: 'compressed'
              }
            },

          ]
        })
      }
    ]
  },
  plugins: [
    extractStyles,
    new webpack.optimize.UglifyJsPlugin(),
    new StylelintPlugin({files: 'themes/**/*.scss'}),
    new ExtractTextPlugin('[name].[contenthash].css'),
    new PurifyCSSPlugin({
      paths: glob.sync(path.join(__dirname,'themes/seo-pages-hugo-theme/layouts/**/*.html')),
      minimize: true
    })
  ]
};
