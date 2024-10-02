import { test } from './component/test'
// import { BackgroundLine } from './component/background_line';
// import { HamburgerMenu } from './component/hamburger_menu';

// css
import '../scss/styles.scss';

// font-awesome
// font-awesomeは不要なアイコンはjsファイルに組み込みたくないので、利用するアイコンだけをmportするようにしている。
// import { library, dom } from '@fortawesome/fontawesome-svg-core';
// import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
// library.add(faAngleLeft, faAngleRight);
// dom.i2svg();

document.addEventListener('DOMContentLoaded', () => {
  console.log('loaded...');
  new Main();
});

class Main {
  constructor() {
    this.init();
    // this.changeBackgroundBorder = new changeBackgroundBorder
  }

  /**
   * init
   */
  init() {
    // new HamburgerMenu('js-hamburger-menu', 'js-navigation-menu');
    // new BackgroundLine('js-background-element');
    test()
  }

  /**
   * click
   */
  // click() {
  //   this.headerElement = document.getElementById('js-hamburger-menu');
  //   this.headerElement.addEventListener('click', () => {
  //     this.number++;
  //     this.element.textContent = this.number;
  //   });
  // }
}
