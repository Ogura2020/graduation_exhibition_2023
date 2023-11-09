/**
 * Backlog
 */
class Backlog {
    /**
     * constructor
     * Backlog クラスの初期設定を行います
     * @param {string} selector 背景を表示する要素のセレクター文字列を指定します
     */
    constructor(selector) {
      console.log('[Backlog] constructor');
  
      this.ee = new EventEmitter3();

      // メッセージの記録用配列
      this.log = [];
      this.logOpen = false;

      const back_btn = document.querySelector(".back_btn");
  
      // Connectボタンをクリックした時の処理をConnectbtn関数に移動します
      back_btn.addEventListener('click', this.toggleBacklog.bind(this));

      this.backlog = document.getElementById("backlog");
      this.logList = document.getElementById("logList");
    }
  
    // メッセージを記録するメソッド
    onStart(e) {
        console.log('[Backlog] onStart', e.text);
        console.log('バックログ', this.log);
        this.log.push(e.text);
    }

    // バックログを表示・非表示に切り替えるメソッド
    toggleBacklog() {
        if (this.backlogVisible) {
            this.hideBacklog();
        } else {
            this.showBacklog();
        }
    }

    // バックログを表示するメソッド
    showBacklog() {
        this.populateBacklog();
        this.backlog.style.display = "block";
        this.backlogVisible = true;
    }

    // バックログを非表示にするメソッド
    hideBacklog() {
        this.backlog.style.display = "none";
        this.backlogVisible = false;
    }

    // バックログをポップアップに表示するメソッド
    populateBacklog() {
        this.logList.innerHTML = "";

        this.log.forEach((text, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${text}`;
            this.logList.appendChild(listItem);
        });
    }
}