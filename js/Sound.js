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

    this.sounds = new Howl({
      src: ['audio/load.mp3'],
      volume: 0.05,
    });

    //なぞ解きBGM
    this.thinking = new Howl({
      src: ['audio/thinking.mp3'],
      loop: true,
    });

    //BGM
    this.everyday = new Howl({
      src: ['audio/everyday.mp3'],
      loop: true,
    });

    //正解
    this.clear = new Howl({
      src: ['audio/clear.mp3'],
    });

    //不正解
    this.miss = new Howl({
      src: ['audio/miss.mp3'],
    });

    //カード選択音
    this.select_0 = new Howl({
      src: ['audio/select_0.mp3'],
    });

    this.select_1 = new Howl({
      src: ['audio/select_1.mp3'],
    });

    this.select_2 = new Howl({
      src: ['audio/select_2.mp3'],
    });

    this.select_3 = new Howl({
      src: ['audio/select_3.mp3'],
    });

  }
}