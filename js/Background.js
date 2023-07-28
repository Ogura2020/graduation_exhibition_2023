/**
 * Background
 */
class Background {
  /**
   * constructor
   * Background クラスの初期設定を行います
   * @param {string} selector 背景を表示する要素のセレクター文字列を指定します
   */
  constructor(selector) {
    console.log('[Background] constructor');

    this.el = document.querySelector(selector);
    this.images = {};
    this.current = undefined;

    window.CSS.registerProperty({
      name: '--js-background-cross-fade-0',
      syntax: '<percentage>',
      inherits: false,
      initialValue: '50%',
    });

    window.CSS.registerProperty({
      name: '--js-background-cross-fade-1',
      syntax: '<percentage>',
      inherits: false,
      initialValue: '100%',
    });

    if (this.el) {
      // 背景の初期設定
      this.el.style.backgroundSize = 'cover';
      this.el.style.backgroundPosition = 'center';
    }
  }

  /**
   * load
   *  @param {string[]} paths 背景画像ファイルまでのパスを表す文字列の配列です
   */
  async load(paths) {
    console.log('[Background] load');

    const promises = paths.map((path) =>
      fetch(path)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          return response.blob();
        })
        .then((blob) => {
          return { [path]: URL.createObjectURL(blob) };
        })
        .catch((error) => {
          console.error(
            'There was a problem with the fetch operation: ' + error.message
          );
        })
    );

    const results = await Promise.all(promises);

    this.images = results.reduce((acc, result) => {
      return { ...acc, ...result };
    }, {});

    return this;
  }

  /**
   * onStart
   */
  onStart(e) {
    console.log('[Background] onStart', e);

    const next = this.images[e.background];

    if (typeof this.current === 'undefined') {
      this.current = next;
    }

    if (this.el) {
      this.el.style.backgroundImage = `-webkit-cross-fade(url(${this.current}), url(${next}), var(--js-background-cross-fade-0))`;
      this.el.animate([
        { '--js-background-cross-fade-0': '0%' }, 
        { '--js-background-cross-fade-0': '100%' }
      ], {
        duration: 400,
        easing: 'ease-in',
        fill: 'forwards'
      });
    }

    this.current = next;
  }
}
