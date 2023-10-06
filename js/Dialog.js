class Dialog {
    /**
     * constructor
     * CallSheet クラスの初期設定を行います
     * @param {string} selector 背景を表示する要素のセレクター文字列を指定します
     */
    constructor(selector) {
        console.log('[Dialog] constructor');
        this.ee = new EventEmitter3();
    }

    nazo_openDialog() {
        const dialog = document.getElementById("nazo_dialog");
        dialog.showModal();
        dialog.classList.add("open");


    }
    
    nazo_closeDialog() {
        const dialog = document.getElementById("nazo_dialog");
        dialog.close();
    }
}