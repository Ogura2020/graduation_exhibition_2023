/**
 * Sound
 */
class Sound {
    /**
     * constructor
     * Sound クラスの初期設定を行います
     * @param {string} selector 背景を表示する要素のセレクター文字列を指定します
     */
  constructor(selector) {
    console.log('[Sound] constructor');

    this.ee = new EventEmitter3();

    const sounds = new Howl({
      src: ['audio/load.mp3'],
      volume: 0.05,
    });

    sounds.play();

  }
}