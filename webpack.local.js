const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const isDev = true;
const baseConfig = require('./webpack.common').baseConfig;
const globule = require('globule');
const PUBLIC_URL = require('./webpack.common').PUBLIC_URL;

// const PUBLIC_URL = '/';

const baseUrl = 'http://192.168.100.192:3000/';

const outputs = {
  srcDir: path.join(__dirname, 'src/pages'),
};
const from = 'pug';
const to = 'html';
const htmlPluginConfig = globule.find([`**/*.${from}`, `!**/_*.${from}`], { cwd: outputs.srcDir }).map((filename) => {
  const file = filename.replace(new RegExp(`.${from}$`, 'i'), `.${to}`).split('/');
  console.log(filename);
  console.log(file);
  let path = ''
  if(file.length <= 1) {
    path = './'
  }else {
    console.log('length: ', file.length)
    for(let i=1; i<file.length; i++){
      path += '../'
    }
  }
  console.log('path', path)
  return new HtmlWebpackPlugin({
    filename: filename.replace(new RegExp(`.${from}$`, 'i'), `.${to}`).replace(/(\.\/)?pug/, '.'),
    template: `./src/pages/${filename}`,
    inject: false,
    dirPath: path,
    env: 'local',
    domain: baseUrl
  });
});

const localConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    publicPath: path.resolve(__dirname, PUBLIC_URL),
    filename: 'assets/js/[name].js',
  },
  stats: {	
    // webpackのエラー表示が具体的になる
    // errorDetails: true,	
    children: true	
  },
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
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: isDev,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                sourceMap: isDev,
                plugins: [
                  // PostCSS Custom Media
                  require('postcss-custom-media'),

                  // PostCSS Sorting
                  // プロパティの並び替え（一部のプレフィックス付きプロパティは誤って扱われる可能性がある）
                  /*
                  require('postcss-sorting')({
                    'order': [
                      'custom-properties',
                      'dollar-variables',
                      'declarations',
                      'at-rules',
                      'rules'
                    ],
                    'properties-order': 'alphabetical',
                    'unspecified-properties-position': 'bottom'
                  }),
                  */

                  // autoprefix
                  require('autoprefixer')({
                    overrideBrowserslist: ['last 2 version', '> 1%', 'ie 11'],
                    grid: true,
                  }),
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    ...htmlPluginConfig,
    new webpack.DefinePlugin({
      IS_DEV: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].css',
    }),
  ],
};

const margedConfig = merge(baseConfig, localConfig);

// entryにhot-middlewareを追加する
for (const key in margedConfig.entry) {
  const orgPath = margedConfig.entry[key];
  margedConfig.entry[key] = [
    'webpack-hot-middleware/client',
    'webpack/hot/dev-server',
    path.resolve(__dirname, orgPath),
  ];
}

module.exports = margedConfig;
