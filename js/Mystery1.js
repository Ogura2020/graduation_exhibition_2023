class Mystery1 extends Dialog {
    /**
     * constructor
     * CallSheet クラスの初期設定を行います
     * @param {string} selector 背景を表示する要素のセレクター文字列を指定します
     */
    constructor(selector) {
      console.log('[Mystery1] constructor ');
      super(selector);
    }

  /**
   * onStart
   */
  onStart(e) {
    //console.log('[Dialog] onStart', e);

    // 画像ファイル名のリスト
    this.imageList = ['paper1.png', 'paper2.png', 'paper3.png']; 
    
    // ismystery が true のカットであるかの真偽値
    const nextOpenState = e.hasOwnProperty('ismystery1') && e.ismystery1;

    // ダイアログ要素が存在するか
    if (this.dialog) {
      if (!this.isOpen && nextOpenState) {

        // ダイアログ内のテキストと画像を更新
        //this.dialog.querySelector('.mystery_text').textContent = "ばらばらになってしまった紙を元に戻したとき、中央にくる紙の番号は？"; // ここに新しいテキストを設定
        //this.dialog.querySelector('.mystery_img').src = "新しい画像のパス"; // ここに新しい画像のパスを設定

        // ランダムな画像ファイル名を選択
        this.randomImage = this.imageList[Math.floor(Math.random() * this.imageList.length)];

        // 選択したランダムな画像ファイル名を<img>要素のsrc属性に設定
        const imgElement = this.dialog.querySelector('.mystery_img');
        if (imgElement) {
          imgElement.src = "img/mystery1/" + this.randomImage;
        }

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
      console.log(this.status[1].id);
      this.ee.emit('select', e);

        // 特定のIDをチェックしてダイアログを閉じる処理
        if (this.randomImage === this.imageList[0] && e === this.status[1].id) {
          this.dialog.close();
          this.dialog.classList.remove('open');
          this.ee.emit('updateModal', { isOpen: false });
        } else if (this.randomImage === this.imageList[1] && e === "4da5fb2c11190") {
          this.dialog.close();
          this.dialog.classList.remove('open');
          this.ee.emit('updateModal', { isOpen: false });
        } else if (this.randomImage === this.imageList[2] && e === "421da9a6e5e81") {
          this.dialog.close();
          this.dialog.classList.remove('open');
          this.ee.emit('updateModal', { isOpen: false });
        }
    }
  }
}