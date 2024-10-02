const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const globEntries = require('webpack-glob-entries');

const PUBLIC_URL = '/';

const baseConfig = {
  watchOptions: {
    ignored: /node_modules/,
  },
  entry: globEntries('./src/assets/js/*.js'),
  module: {
    /*
     * rulesの読み方
     * - test: どのタイプのファイルを変換対象とするかを文字列または正規表現で指定します。
     * - use: どのloaderを使用するかを指定します。
     * - exclude: 対象外ディレクトリ
     *
     * 配列を使って、loaderを複数指定することも可能。
     * この場合、末尾のloaderから順に適用される。
     * use: ['raw-loader', 'a-loader', 'c-loader']
     */
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', //loader名
          options: {
            //Babelの設定
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: ['last 2 versions', '> 1%', 'ie 11'],
                  useBuiltIns: 'usage',
                  corejs: 3,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-loader',
            options: {
              pretty: true,
              self: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: './public/',
          to: './',
          globOptions: {
            dot: false, // .***のファイルは除外
            gitignore: false, // falseじゃないとエラーになる。
            ignore: [
              '**/test/**', // test配下のhtmlは除外
              '**/sd-sample/**', // sd-sample配下のhtmlは除外
              '**/sample.html', // sample.htmlは除外
            ],
          },
        },
        // サイトマップを追加するときはコメントアウト解除
        // {
        //   from: './sitemap.xml',
        //   to: './',
        //   globOptions: {
        //     dot: false, // .***のファイルは除外
        //     gitignore: false, // falseじゃないとエラーになる。
        //     ignore: [
        //       '**/test/**', // test配下のhtmlは除外
        //       '**/sd-sample/**', // sd-sample配下のhtmlは除外
        //       '**/sample.html', // sample.htmlは除外
        //     ],
        //   },
        // },
      ],
    }),
    // new HtmlWebpackPlugin({
    //   template: './src/pages/index.pug',
    //   inject: false,
    // }),
    // // HTMLファイルを生成したい時は以下のように記入していく。
    // // new HtmlWebpackPluginがどんどん増える感じ
    // new HtmlWebpackPlugin({
    //   filename: 'sd-sample/index.html',
    //   template: './src/pages/sd-sample/index.pug',
    //   inject: false,
    // }),
    new webpack.DefinePlugin({
      'process.env.PUBLIC_URL': JSON.stringify(PUBLIC_URL),
    }),
  ],
};

module.exports = {
  baseConfig,
  PUBLIC_URL,
};
