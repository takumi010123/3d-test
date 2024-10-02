## UPDATE(2021/11/24)

- ie11 で正常に js が動作しないときの対応を記載

## Usage

### インストール

`$ npm install`

### ローカル開発時

`$ npm run dev`

- html, css は変更時に自動でブラウザリロード
- js は変更時に手動でブラウザリロードしてください

### テスト用 ファイル群出力

`$ npm run build:test`

- `webpack.dev.js`で sd-sample ディレクトリ配下を出力する or しないの設定ができます。デフォルトはしない(false)です。
  - `isBuildSample`

/dist_test/ 配下がテスト用に出力されたファイルです。

### 本番用 ファイル群出力

`$ npm run build:prod

- sd-sample ディレクトリ配下は出力されません。残したままでも大丈夫です。

## 開発時

- 基本的に相対パスでファイルの import などを行う。

### SEO 用の情報変更ファイル

- webpack.prod.js
  - ドメイン名
- layout.pug
  - テーマカラー
  - ogp 画像パス
  - sitename
  - その他 OGP 設定
- 各ページの index.js
  - title
  - description
  - ogp_title
  - ogp_type
  - ogp_url
  - ogp_description
- \_eventJson.pug
  - イベント用サイトなどで用いる構造化データ

### 画像の追加

`public/images/`に追加してください。  
build コマンドを行うことで`public/`配下が各出力先ディレクトリのほうに複製されます。

### 本番環境での console.log の表示

`webpack.prod.js` の `drop_console` を `false` にする。

```javascript
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
```

### ページ作成時(HTML ファイルを出力させたい時)

pages のディレクトリ構成のまま、index.html が出力されるようになります。

~~webpack.common.js の plugin の箇所に以下のように記入。~~  
~~逆に記入がなければ npm run dev で確認はできるが、html ファイルとしては出力されないという感じになる。~~

```javascript
new HtmlWebpackPlugin({
  filename: 'sd-sample/index.html',
  template: './src/pages/sd-sample/index.pug',
}),
```

↑ 不要になりました。

### サイトマップ

サイトマップの出力が可能です。  
デフォルトは OFF です。(設定されていない状態でアップされてしまうのを防ぐため)  
ON にしたい場合は `webpack.common.js`の`CopyPlugin`内の sitemap の箇所のコメントアウトを解除してください。

### 静的なディレクトリを dist 及び dist_test に追加したい時

`webpack.common.js`の`CopyPlugin`に追加で記述を行うことで可能です。  
仕組みとしてはディレクトリを dist/ , dist_test/内に複製を行っているだけです。  
public ディレクトリや sitemap ファイルなども同じ仕組みを使ってビルドされたディレクトリに格納されています。

```javascript
{
  from: './public/', // 格納させたいディレクトリ
  to: './', // 格納先(これでdist/, dist_test/になっている。)
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
```

## 納品時

`$ npm run build:prod`で出力された`dist/`を提出してください。以下のような処理が行われます。

- 本番用 URL への切り替え
- html, css, js ファイルの圧縮処理
  - 不要なコメントは削除される。
- js の共通で利用されるモジュールを vendor.js にまとめる。

## 仕様

- webpack は以下の使い分けが行われる。
  - ローカル開発
    - webpack.local.js
  - テストサーバーアップ
    - webpack.dev.js
  - 本番サーバーアップ
    - webpack.prod.js
  - モック更新及びアップ
    - webpack.mock.js
- `src/assets/js/` 直下の js ファイルは自動でエントリーポイントに
  - 複数の js ファイルを作りたい場合は main.js と同じ階層に js ファイルを作る
- js で sass のファイルを読み込むと、`[読み込んだjsの名前].css`として生成
  - main.js 内で読み込めば、main.css として吐き出される。
  - about.js 内で hoge.scss を読み込めば、about.css として吐き出される。
    - about ページだけで読み込ませたい css ファイルを作りたいなら、これを行う。
- `public` ディレクトリ内のリソースはそのまま納品ファイルにコピーされます。
  - 画像については webpack で処理を行っていないのでここへ
  - OGP, favicon, json ファイル等もあれば
- `webpack.common.js` 内の`PUBLIC_URL`で base path 変更
  - 下層ディレクトリへのパスなどがあれば追加する
- `src/pages/`配下の pug ファイルはディレクトリ構造を保ったまま html ファイルとして生成
  - page を増やす時はディレクトリを作成して index.pug を作成する

## その他

- `src/modules/`には開発時に利用するファイルなどを追加する

## 画像変換・圧縮

今後 webp や圧縮されている画像などを用意する手間を考慮し、プログラムで一発で行えるものを用意しました。  
圧縮・変換させたい画像を `/img_converter/targets/` に格納してください。  
変換された画像は `/img_converter/results/` に出力されるので、適宜ファイルを移動して利用してください。  
テンプレのほうで png と jpg のサンプル画像を格納しているので一度コマンドを入力してみるだけでも実感できるかもです。  
[参考 Qiita](https://qiita.com/YoshinoriKanno/items/18f59cd0ad5b802995bf)

- `npm run sharp`
  - png,jpg 画像の圧縮、png,jpg -> webp への変換
- `npm run sharp-webp`
  - png,jpg -> webp への変換
- `npm run sharp-jpg`
  - jpg 画像の圧縮
- `npm run sharp-png`
  - png 画像の圧縮

```
下記も加味して適宜変更してください。
* オプションの -q で PNG の圧縮率（0 - 9）を変えられます。（デフォルトは 9 です）
* オプションの -c で JPG の画質（1 - 99）を変えられます。（デフォルトは 80 です）
```

## トラブルシューティング

### IE11 で js が正常に動作しない。

`webpack.prod.js`の splitChunks をコメントアウトする。  
最適化させるために、js のライブラリやプラグインなどは vendor.js にまとめて出力されるようになっているのだが、これが IE11 だとうまくいかない場合がある。  
基本的には IE11 で使えないアロー関数などが出力ファイルに残っていることが原因だったりするので、出力ファイルは確認しても良さそう。

```js
optimization: {
  // 下記の配列をコメントアウトする
  // splitChunks: {
  //   cacheGroups: {
  //     vendor: {
  //       test: /node_modules/,
  //       name: 'vendor',
  //       chunks: 'initial',
  //       enforce: true,
  //     },
  //   },
  // },
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
```

### npm インストール時にエラーが出る(mac のみ)

npm インストール時に下記のようなエラーが出た場合、Command Line tools を再インストールする可能性があるので注意してください。  
OS をアップグレードした際に起こるのではないかなと思います。  
[参考サイト](https://qiita.com/hppRC/items/a01e33a5c890f7b2c125)

```shell
npm ERR! code 1
npm ERR! path /Users/superstaff/Desktop/work/sd/static-template/static-template/node_modules/sharp
npm ERR! command failed
npm ERR! command sh -c (node install/libvips && node install/dll-copy && prebuild-install --runtime=napi) || (node-gyp rebuild && node install/dll-copy)
npm ERR! info sharp Using cached /Users/superstaff/.npm/_libvips/libvips-8.9.1-darwin-x64.tar.gz
npm ERR! gyp info it worked if it ends with ok
npm ERR! gyp info using node-gyp@7.1.2
npm ERR! gyp info using node@15.14.0 | darwin | x64
npm ERR! gyp info find Python using Python version 2.7.16 found at "/System/Library/Frameworks/Python.framework/Versions/2.7/Resources/Python.app/Contents/MacOS/Python"
npm ERR! gyp info spawn /System/Library/Frameworks/Python.framework/Versions/2.7/Resources/Python.app/Contents/MacOS/Python
npm ERR! gyp info spawn args [
npm ERR! gyp info spawn args   '/Users/superstaff/Desktop/work/sd/static-template/static-template/node_modules/node-gyp/gyp/gyp_main.py',
npm ERR! gyp info spawn args   'binding.gyp',

...

npm ERR!   File "/Users/superstaff/Desktop/work/sd/static-template/static-template/node_modules/node-gyp/gyp/pylib/gyp/xcode_emulation.py", line 1511, in XcodeVersion
npm ERR!     version = CLTVersion()  # macOS Catalina returns 11.0.0.0.1.1567737322
# ↑のようにインストールされているOSと違うOSが記述されていると疑わしい。

...
```

## 今後

- `src/materials`に画像を格納して、webpack で圧縮処理などを介して出力できるようにする
- 内容を更新したら、sitemap の更新日も自動で変更して出力させたい。
- picture タグの mixin 化([参考](https://jackswim3411.hatenablog.com/entry/2020/08/30/003725))

## パフォーマンス、SEO 向上に向けて

- webp は使えるなら使っていくべし。picture タグでの振り分けを忘れず。
- 画像サイズは SP,PC それぞれで適したサイズにすること

```html
<picture>
  <source type="image/webp" media="(min-width: 768px)" srcset="image_path-pc.webp" />
  <source type="image/webp" media="(max-width: 767px)" srcset="image_path-sp.webp" />
  <source media="(min-width: 768px)" srcset="image-path-pc.png" />
  <img src="image_path-sp.png" alt="" decoding="async" />
</picture>
```

- 日付系の表記には`time`タグと`datetime`属性を付与するようにする。
  - https://developer.mozilla.org/ja/docs/Web/HTML/Element/time

```html
<time datetime="2020-09-18">2020.09.18</time>
```

- script タグ、defer 属性がついている場合は HTML のパースの処理に影響が無いので、head 内に入れておく。
  - むしろそのほうが早く開始できる。
  - https://developer.mozilla.org/ja/docs/Web/HTML/Element/script#attr-defer:~:text=%E3%81%8B%E3%81%A4
  - https://html.spec.whatwg.org/multipage/scripting.html#attr-script-async
  - https://qiita.com/phanect/items/82c85ea4b8f9c373d684

```html
<script src="./assets/js/main.js" defer></script>
```

- イベントものなどであれば、構造化データを埋め込んでおくといいかもしれない。
  https://developers.google.com/search/docs/data-types/event?hl=ja

## npm ライブラリのアップデート

`npm-check-updates`パッケージを利用する。  
参考: [npm install したパッケージの更新確認とアップデート(npm-check-updates)](https://dackdive.hateblo.jp/entry/2016/10/10/095800)

### 最新バージョン等の確認

`npx ncu`  
こんな感じで表示される。

```
 core-js                                ^3.6.5  →   ^3.10.0
 swiper                                 ^6.2.0  →    ^6.5.4
 @babel/cli                            ^7.11.6  →  ^7.13.14
 @babel/core                           ^7.11.6  →  ^7.13.14
 @babel/preset-env                     ^7.11.5  →  ^7.13.12
 @fortawesome/fontawesome-free         ^5.14.0  →   ^5.15.3
 @fortawesome/fontawesome-svg-core     ^1.2.30  →   ^1.2.35
 @fortawesome/free-regular-svg-icons   ^5.14.0  →   ^5.15.3
 @fortawesome/free-solid-svg-icons     ^5.14.0  →   ^5.15.3
 autoprefixer                           ^9.8.6  →   ^10.2.5
 babel-loader                           ^8.1.0  →    ^8.2.2
 browser-sync                         ^2.26.12  →  ^2.26.14
 copy-webpack-plugin                    ^6.1.0  →    ^8.1.1
 css-loader                             ^4.2.2  →    ^5.2.0
 cssnano                               ^4.1.10  →   ^4.1.11
 file-loader                            ^6.1.0  →    ^6.2.0
 html-loader                            ^1.3.0  →    ^2.1.2
 html-webpack-plugin                    ^4.4.1  →    ^5.3.1
 mini-css-extract-plugin               ^0.11.0  →    ^1.4.0
 node-sass                             ^4.14.1  →    ^5.0.0
 postcss-custom-media                   ^7.0.8  →    ^8.0.0
 postcss-loader                         ^4.0.0  →    ^5.2.0
 postcss-sorting                        ^5.0.1  →    ^6.0.0
 sass-loader                           ^10.0.2  →   ^11.0.1
 style-loader                           ^1.2.1  →    ^2.0.0
 webpack-cli                            ^4.0.0  →    ^4.6.0
 webpack-dev-middleware                 ^3.7.2  →    ^4.1.0
 webpack-dev-server                    ^3.11.0  →   ^3.11.2
 webpack-merge                          ^5.1.3  →    ^5.7.3
```

### 最新バージョンで package.json の更新を行う。

`npx ncu -u`  
パッケージ名や正規表現を利用して絞り込んでの更新も可能。

```console
# babel-xxx というパッケージのみ対象
$ ncu /babel-/
⸨░░░░░░░░░░░░░░░░░░⸩ ⠏ :
The following dependencies are satisfied by their declared version range, but the installed versions are behind. You can install the latest versions without modifying your package file by using npm update. If you want to update the dependencies in your package file anyway, use ncu -a/--upgradeAll.

 babel-core           ^6.7.2  →  ^6.17.0
 babel-loader         ^6.2.4  →   ^6.2.5
 babel-preset-es2015  ^6.6.0  →  ^6.16.0
 babel-preset-react   ^6.5.0  →  ^6.16.0
```

### 実際にアップデート

`npm update`

# SCSS(Dart Sass)
## ソースマップ
CSSにソースマップを出力するかの設定はwebpackの設定ファイル（webpack.dev.jsなど）で記載する `devtool` に依存します。
ソースマップを出力しない場合は `devtool` を行ごと削除してください。

## 演算
Dart Sassでは`/`(スラッシュ)のみの除算は非推奨で、将来的にできなくなる模様です。
これからはビルトインモジュールの **sass:math** にある `div()` を使うようにします。

変更前
```
.test-class { margin: (16px/2); }
```

変更後
```
@use "sass:math";

.test-class { margin: math.div(16px, 2); }
```

sass:mathモジュールは他にも関数があります。
https://sass-lang.com/documentation/modules/math
