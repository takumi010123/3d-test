const browserSync = require('browser-sync');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('./webpack.local');
const bundler = webpack(webpackConfig);

const webpackDevMiddlewareInstance = webpackDevMiddleware(bundler, {
  publicPath: webpackConfig.output.publicPath,
});

const server = browserSync({
  port: 3000,
  ghostMode: false,
  server: {
    middleware: [webpackDevMiddlewareInstance, webpackHotMiddleware(bundler)],
  },
  startPath: webpackConfig.output.publicPath,
  open: 'external',
  notify: false,
  files: [
    {
      // pugファイルを更新してもなぜかリロードしてくれないので手動で更新する
      match: ['./src/**/*.pug','./src/**/*.scss'],
      fn: (event, file) => {
        webpackDevMiddlewareInstance.waitUntilValid(() => {
          console.log('finish reload');
          server.reload();
        });
      },
    },
  ],
});
