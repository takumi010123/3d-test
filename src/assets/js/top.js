// swiper
// それぞれモジュールが別々になっているので、必要なものをインポートする。
// swiper.cssはscss/vendorに格納して使うこと
// 参考: https://swiperjs.com/api/#custom-build
import { Swiper, Navigation, Autoplay, EffectFade, Lazy } from 'swiper';

// css
import '../scss/top.scss';

document.addEventListener('DOMContentLoaded', () => {
  new Top();
});

class Top {
  constructor() {
    this.init();
  }
  init() {
    console.log('top.js');
  }
}
