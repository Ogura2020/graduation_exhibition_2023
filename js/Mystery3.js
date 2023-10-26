class Mystery3 extends Dialog {
    /**
     * constructor
     * CallSheet クラスの初期設定を行います
     * @param {string} selector 背景を表示する要素のセレクター文字列を指定します
     */
    constructor(selector) {
        console.log('[Mystery3] constructor ');
        super(selector);
    }

  /**
   * onStart
   */
  onStart(e) {
    //console.log('[Dialog] onStart', e);

    // ismystery が true のカットであるかの真偽値
    const nextOpenState = e.hasOwnProperty('ismystery3') && e.ismystery3;

    // ダイアログ要素が存在するか
    if (this.dialog) {
      if (!this.isOpen && nextOpenState) {

        // ダイアログ内のテキストと画像を更新
        this.dialog.querySelector('.mystery_text').textContent = "3"; // ここに新しいテキストを設定
        //this.dialog.querySelector('.mystery_img').src = "新しい画像のパス"; // ここに新しい画像のパスを設定

        // ランダムな数字
        

        // 選択したランダムな数字を<img>要素のsrc属性に設定


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
      console.log('[Mystery3] onReadRFID', e);
      this.ee.emit('select', e);

        // 特定のIDをチェックしてダイアログを閉じる処理
        if (e === "46623b2c11190") {
          this.dialog.close();
          this.dialog.classList.remove('open');
          this.ee.emit('updateModal', { isOpen: false });
        }
    }
  }
}