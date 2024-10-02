import { isIE } from '../helper/checkUserBrowser';
import SmoothScroll from 'smooth-scroll';

export class HamburgerMenu {
  constructor(hamburgerElementIdName, navigationElementIdName) {
    this.hamburgerElement = document.getElementById(hamburgerElementIdName);
    this.navigationElement = document.getElementById(navigationElementIdName);
    this.hamburgerMenuActive = false;
    this.navigationActive = false;
    this.currentPositionY = 0;
    this.isIE = isIE();

    this.init();
    this.resize();
    this.orientationChange();
    this.headerClick();
    this.navigationClick();
  }

  init() {
    this.setHeightToNavigation();
  }

  setHeightToNavigation(orientation) {
    // 横向きの時、safariだとアドレスバーのせいで辛いので高さのとり方を分ける。
    const browseHeight = orientation === 'portrait' ? window.document.documentElement.clientHeight : window.innerHeight;
    this.navigationElement.style.height = `${browseHeight}px`;
  }

  orientationChange() {
    let _this = this;
    window.addEventListener('orientationchange', function () {
      if (window.innerHeight > window.innerWidth) {
        /* 縦画面時の処理 */
        _this.setHeightToNavigation('landscape');
      } else {
        /* 横画面時の処理 */
        _this.setHeightToNavigation('portrait');
      }
    });
  }

  resize() {
    let resizeTimeoutId; // リサイズイベントの頻度を減らす方法
    let _this = this;
    window.addEventListener(
      'resize',
      function () {
        // setTimeout()がセットされていたら無視
        if (resizeTimeoutId) return;
        resizeTimeoutId = setTimeout(function () {
          resizeTimeoutId = 0;

          // ----------- 処理内容 ----------- //
          if (window.innerHeight > window.innerWidth) {
            /* 縦画面時の処理 */
            _this.setHeightToNavigation('landscape');
          } else if (window.innerHeight < window.innerWidth) {
            /* 横画面時の処理 */
            _this.setHeightToNavigation('portrait');
          }

          // ----------- 処理内容ここまで ------------- //
        }, 500);
      },
      false,
    );
  }

  headerClick() {
    this.hamburgerElement.addEventListener('click', () => {
      this.hamburgerMenuActive = !this.hamburgerMenuActive;
      this.navigationActive = !this.navigationActive;
      if (this.navigationActive) {
        this.setHeightToNavigation();
      }
      this.toggleMenu();
    });
  }

  toggleMenu() {
    const hamburgerElement = this.hamburgerElement;
    const navigationElement = this.navigationElement;
    if (this.navigationActive && this.hamburgerMenuActive) {
      hamburgerElement.classList.add('hamburger-active');
      navigationElement.classList.add('navigation-active');

      this.currentPositionY = this.isIE ? document.documentElement.scrollTop : document.scrollingElement.scrollTop;
      this.fixedPosition();
    } else {
      hamburgerElement.classList.remove('hamburger-active');
      navigationElement.classList.remove('navigation-active');

      this.cancelFixedBackground();
      this.current_positionY = 0;
    }
  }

  fixedPosition() {
    let bodyElement = document.body;
    bodyElement.style.position = 'fixed';
    bodyElement.style.top = `${-1 * this.currentPositionY}px`;
    let mainElement = document.getElementsByTagName('main');
    mainElement[0].style.width = '100vw';
  }

  cancelFixedBackground() {
    let bodyElement = document.body;
    bodyElement.style.position = '';
    bodyElement.style.top = '';
    let mainElement = document.getElementsByTagName('main');
    mainElement[0].style.width = '';
    // fixed解除時に一番上へと移動してしまうので、open時に取得したスクロール位置まで移動させる。
    window.scrollTo(0, this.currentPositionY);
  }

  navigationClick() {
    this.scroll = new SmoothScroll();
    this.scrollOptions = new SmoothScroll('a[href*="#"]', {
      // speed: 500,
      // speedAsDuration: true,
    });

    const _this = this;
    const navigationLinkElementsArray = document.getElementsByClassName('js-scroll');
    const navigationLinkElements = [].slice.call(navigationLinkElementsArray);
    navigationLinkElements.forEach((element) => {
      element.addEventListener('click', () => {
        const scrollToArea = element.getAttribute('href');
        _this.hamburgerMenuActive = !_this.hamburgerMenuActive;
        _this.navigationActive = !_this.navigationActive;
        _this.toggleMenu();

        // _this.scroll.animateScroll(scrollToArea);
      });
    });
  }
}
