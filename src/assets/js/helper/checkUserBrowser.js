/* IE判定関数を定義しておく */
export function isIE() {
  let userAgent = window.navigator.userAgent.toLowerCase();
  if ( userAgent.indexOf( 'msie' ) !== -1 || userAgent.indexOf( 'trident' ) !== -1 ) {
      return true;
  }
  return false;
}