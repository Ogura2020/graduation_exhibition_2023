class Dialog {
    /**
     * constructor
     * CallSheet クラスの初期設定を行います
     * @param {string} selector 背景を表示する要素のセレクター文字列を指定します
     */
    constructor(selector) {
        console.log('[Dialog] constructor');
        this.ee = new EventEmitter3();
        this.dialog = document.querySelector(selector);
        this.isOpen = false;

        this.tips = null;
        this.sound = new Sound();

        this.status = [
          {
            name: "Tim",
            id: "460c6b2c11190",
            num: "0",
            color: "purple"
          },
          {
            name: "Chalotte",
            id: "421da9a6e5e81",
            num: "1",
            color: "green"
          }
          ,
          {
            name: "Maria",
            id: "428d4b2c11190",
            num: "2",
            color: "green"
          },
          {
            name: "Azuki",
            id: "46623b2c11190",
            num: "3",
            color: "green"
          },
          {
            name: "Ronbell",
            id: "4da5fb2c11190",
            num: "4",
            color: "green"
          },
          {
            name: "Azuma",
            id: "46f64b2c11190",
            num: "5",
            color: "green"
          },
          {
            name: "Avril",
            id: "41bc6b2c11190",
            num: "6",
            color: "green"
          },
          {
            name: "Mary",
            id: "456a5b2c11190",
            num: "7",
            color: "green"
          },
          {
            name: "Wickman",
            id: "45399b2c11191",
            num: "8",
            color: "green"
          },
          {
            name: "Griffith",
            id: "41c5b2c11195",
            num: "9",
            color: "green"
          },
          {
            name: "Richard",
            id: "4bc8fb2c11190",
            num: "10",
            color: "green"
          }
        ]
    }

  /**
   * onStart
   */
  onStart(e) {
    //console.log('[Dialog] onStart', e);

    // 画像ファイル名のリスト
    this.imageList = ['star.png', 'kasa.png', 'taiyou.png', 'clover.png']; 
    
    // ismystery が true のカットであるかの真偽値
    const nextOpenState = e.hasOwnProperty('ismystery0') && e.ismystery0;

    // ダイアログ要素が存在するか
    if (this.dialog) {
      if (!this.isOpen && nextOpenState) {

        // ダイアログ内の画像を更新
        this.dialog.querySelector('.mystery_img').src = "img/mystery0/0.png"; // ここに新しい画像のパスを設定

        // シナリオのカットのプロパティ ismystery が true ある場合
        // ダイアログを開く
        this.dialog.showModal();
        this.dialog.classList.add('open');
        this.ee.emit('updateModal', { isOpen: true });
      }
    }

    this.isOpen = nextOpenState;
  }

  /**
   * onReadRFID
  */
  onReadRFID(e) {
    // ダイアログが開いた状態であれば RFID の読み取りを行う
    if (this.isOpen) {
      console.log('[Dialog] onReadRFID', e);
      this.ee.emit('select', e);
      this.imgElement = this.dialog.querySelector('.mystery_img');

        // 特定のIDをチェックしてダイアログを閉じる処理
        if (e === this.status[0].id) {
          this.imgElement.src = "img/mystery0/" + this.imageList[0];
        } else if (e === this.status[1].id) {
          this.imgElement.src = "img/mystery0/" + this.imageList[1];
        } else if (e === this.status[2].id) {
          this.imgElement.src = "img/mystery0/" + this.imageList[2];
        } else if (e === this.status[3].id) {
          this.imgElement.src = "img/mystery0/" + this.imageList[3];
        }
    }
  }

  /**
   * onReadAccel
  */
  onReadAccel(e) {
    // ダイアログが開いた状態であれば 加速度 の読み取りを行う
    if (this.isOpen) {
      console.log('[Mystery1] onReadAccel', e);
      this.ee.emit('select', e);

      let accel = e.split(',')
      console.log(accel[0],accel[1]);

        // 特定のIDをチェックしてダイアログを閉じる処理
        if (Math.abs(accel[0]) > 1.0 && this.imgElement.src.endsWith(this.imageList[0])) {
          this.dialog.close();
          this.dialog.classList.remove('open');
          this.ee.emit('updateModal', { isOpen: false });

        }
    }
  }
}