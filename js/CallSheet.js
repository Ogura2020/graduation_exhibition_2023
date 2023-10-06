/**
 * CallSheet キャラクター選択用の Class
 */
class CallSheet {
    /**
     * constructor
     * CallSheet クラスの初期設定を行います
     * @param {string} selector 背景を表示する要素のセレクター文字列を指定します
     */
    constructor(selector) {
      console.log('[CallSheet] constructor');
      this.ee = new EventEmitter3();
    }

    card() {
      let card = [
        {
          sirial: "4b217b26e5e80",
          name: "tim",
          color: "blue"
        },
        {
          sirial: "421da9a6e5e81",
          name: "made",
          color: "red"
        }
      ]
      console.log(card[1])
    }

    select_openDialog() {
      const dialog = document.getElementById("select_dialog");
      dialog.showModal();
      dialog.classList.add("open");
    }
  
    select_closeDialog() {
        const dialog = document.getElementById("select_dialog");
        dialog.close();
    }


    call() {

    }
}