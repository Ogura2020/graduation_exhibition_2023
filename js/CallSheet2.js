/**
 * CallSheet キャラクター選択用の Class
 */
class CallSheet2 {
  /**
   * constructor
   * CallSheet クラスの初期設定を行います
   * @param {string} selector 背景を表示する要素のセレクター文字列を指定します
   */
  constructor(selector) {
    console.log('[CallSheet2] constructor');
    this.ee = new EventEmitter3();
    this.dialog = document.querySelector(selector);
    this.isOpen = false;
  }

  /**
   * onStart
   */
  onStart(e) {
    console.log('[CallSheet2] onStart', e);

    // isCallSheet2 が true のカットであるかの真偽値
    const nextOpenState = e.hasOwnProperty('isCallSheet2') && e.isCallSheet2;

    // ダイアログ要素が存在するか
    if (this.dialog) {
      if (!this.isOpen && nextOpenState) {
        // シナリオのカットのプロパティ isCallSheet2 が true ある場合
        // ダイアログを開く
        this.dialog.showModal();
        this.dialog.classList.add('open');
        this.ee.emit('updateModal', { isOpen: true });
      } else if (this.isOpen && !nextOpenState) {
        // シナリオのカットのプロパティ isCallSheet2 が true からそれ以外に変わった場合
        // ダイアログを閉じる
        this.dialog.close();
        this.dialog.classList.remove('open');
        this.ee.emit('updateModal', { isOpen: false });
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
      console.log('[CallSheet2] onReadRFID', e);
      this.ee.emit('select', e);
    }
  }
}