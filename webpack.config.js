const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HookShellScriptPlugin = require('hook-shell-script-webpack-plugin');

const COMPILE = [
  {
    key: '',
    entry: './src/behaviors.js',
    output: {
      filename: './dist/behaviors.js',
      publicPath: ''
    }
  }
];

module.exports = COMPILE.map(
  ({
    key,
    output,
    dir,
    file,
    cssdir = '',
    sassdir = '',
    plugins = [],
    relativepath = './',
    ...i
  }) => ({
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    output: {
      path: path.resolve(__dirname),
      ...output
    },
    devtool: 'source-map',
    target: 'node',
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: { presets: ['@babel/preset-env'] }
          }
        },
        {
          test: /\.s?css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new HookShellScriptPlugin({
        afterEmit: [ ]
      }),
      new MiniCssExtractPlugin({
        // filename: ({ chunk }) => `${chunk.name.replace("/js/", "/css/")}.css`,
        filename: `[name]${key}.css`,
        chunkFilename: '[id].css'
      })
    ],
    watchOptions: {
      aggregateTimeout: 500
    },
    ...i
  })
);
