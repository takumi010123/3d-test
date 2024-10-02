// pugのディレクトリ構成をそのままに出力してくれる代物
import '../../modules/importPug';

if (module.hot) {
  module.hot.accept(console.error);
  module.hot.dispose(() => {
    window.location.reload();
  });
}
