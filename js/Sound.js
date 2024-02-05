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

    this.title = new Howl({
      src: ['audio/title.mp3'],
      loop: true,
      volume: 0.1,
    });

    //なぞ解きBGM
    this.thinking = new Howl({
      src: ['audio/thinking.mp3'],
      loop: true,
      volume: 0.3,
    });

    //BGM_事務所
    this.yakata = new Howl({
      src: ['audio/everyday.mp3'],
      loop: true,
    });
    
    //BGM_館
    this.everyday = new Howl({
      src: ['audio/yakata.mp3'],
      loop: true,
    });

    //正解
    this.clear = new Howl({
      src: ['audio/clear2.mp3'],
    });

    //不正解
    this.miss = new Howl({
      src: ['audio/miss.mp3'],
    });

    //カード選択音
    this.select_0 = new Howl({
      src: ['audio/select_0.mp3'],
      //volume: 1.5,
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
    this.select_4 = new Howl({
      src: ['audio/select_4.mp3'],
    });

    this.select_5 = new Howl({
      src: ['audio/select_5.mp3'],
    });

    this.select_6 = new Howl({
      src: ['audio/select_6.mp3'],
    });

    this.select_7 = new Howl({
      src: ['audio/select_7.mp3'],
    });

    this.select_8 = new Howl({
      src: ['audio/select_8.mp3'],
    });

    this.select_9 = new Howl({
      src: ['audio/select_9.mp3'],
    });

    this.select_10 = new Howl({
      src: ['audio/select_10.mp3'],
    });

    this.door = new Howl({
      src: ['audio/door.mp3'],
    });

    this.knock = new Howl({
      src: ['audio/knock.mp3'],
    });

    this.gasagoso = new Howl({
      src: ['audio/gasagoso.mp3'],
    });
  }
}