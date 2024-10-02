const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const isDev = false;
const baseConfig = require('./webpack.common').baseConfig;
const PUBLIC_URL = require('./webpack.common').PUBLIC_URL;
const globule = require('globule');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;	

const baseUrl = 'https://example.com/';
const isMinify = true; // HTMLを圧縮するorしない

const outputs = {
  srcDir: path.join(__dirname, 'src/pages'),
  distDir: path.join(__dirname, 'dist'),
};
const from = 'pug';
const to = 'html';
const htmlPluginConfig = globule
  .find([`**/*.${from}`, `!**/_*.${from}`], { cwd: outputs.srcDir })
  .reduce((accumulator, filename) => {
    const file = filename.replace(new RegExp(`.${from}$`, 'i'), `.${to}`).split('/');
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
    if (file[0] !== 'sd-sample') {
      const htmlWebpackPluginArray = new HtmlWebpackPlugin({
        filename: filename.replace(new RegExp(`.${from}$`, 'i'), `.${to}`).replace(/(\.\/)?pug/, '.'),
        template: `./src/pages/${filename}`,
        inject: false,
        dirPath: path,
        minify: isMinify,
        env: 'production',
        domain: baseUrl
      });
      accumulator.push(htmlWebpackPluginArray);
    }
    return accumulator;
  }, []);

const prodConfig = {
  mode: 'production',
  target: ['web', 'es5'],
  output: {
    path: path.resolve(__dirname, './dist' + PUBLIC_URL),
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
                  // minify
                  require('cssnano')({
                    preset: ['default',
                      // {
                      //   calc: true
                      // }
                    ],
                  }),
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
      IS_DEV: false,
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].css',
    }),
    // ビルド時にファイル容量を確認したいときはコメントアウトをはずす
    // new BundleAnalyzerPlugin()
  ],
  optimization: {
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
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
};

module.exports = merge(baseConfig, prodConfig);
