const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const isDev = true;
const baseConfig = require('./webpack.common').baseConfig;
const PUBLIC_URL = require('./webpack.common').PUBLIC_URL;
const globule = require('globule');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const baseUrl = 'https://sd-review.com/test/static-temp/';
// サンプルページを出力する必要があればtrue、不要ならfalse
const isBuildSample = false;

const outputs = {
  srcDir: path.join(__dirname, 'src/pages'),
  distDir: path.join(__dirname, 'dist_test'),
};
const from = 'pug';
const to = 'html';
const htmlPluginConfig = globule
  .find([`**/*.${from}`, `!**/_*.${from}`], { cwd: outputs.srcDir })
  .reduce((accumulator, filename) => {
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
    if (file[0] === 'sd-sample' && isBuildSample) {
      const htmlWebpackPluginArray = new HtmlWebpackPlugin({
        filename: filename.replace(new RegExp(`.${from}$`, 'i'), `.${to}`).replace(/(\.\/)?pug/, '.'),
        template: `./src/pages/${filename}`,
        inject: false,
        dirPath: path,
        env: 'development',
        domain: baseUrl
      });
      accumulator.push(htmlWebpackPluginArray);
    }
    if (file[0] !== 'sd-sample') {
      const htmlWebpackPluginArray = new HtmlWebpackPlugin({
        filename: filename.replace(new RegExp(`.${from}$`, 'i'), `.${to}`).replace(/(\.\/)?pug/, '.'),
        template: `./src/pages/${filename}`,
        inject: false,
        dirPath: path,
        env: 'development',
        domain: baseUrl
      });
      accumulator.push(htmlWebpackPluginArray);
    }
    return accumulator;
  }, []);

const devConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, './dist_test' + PUBLIC_URL),
    filename: 'assets/js/[name].js',
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
                  // メディアクエリをまとめる
                  require('postcss-sort-media-queries')({
                    sort: 'desktop-first',
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
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].css',
    }),
    // new BundleAnalyzerPlugin()
  ],
  optimization: {
    usedExports: true,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'initial',
          enforce: true,
        },
      },
    },
  },
};

module.exports = merge(baseConfig, devConfig);
