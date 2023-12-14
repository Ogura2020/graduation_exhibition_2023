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

      const back_btn = document.querySelector("#back_btn");
  
      // back_btnボタンをクリックした時の処理をback_btn関数に移動します
      back_btn.addEventListener('click', this.showBacklog.bind(this));

      this.backlog = document.getElementById("backlog");
      this.logList = document.getElementById("logList");

      this.backlog.addEventListener('click', this.hideBacklog.bind(this));
    }
  
    // メッセージを記録するメソッド
    onStart(e) {

        // e.text内の<br>タグを改行に変換
        const logText = e.text.replace(/<br>/g, '\n');

        console.log('[Backlog] onStart', e.name, logText);
        console.log('バックログ', this.log);
        const log = `${e.name}\n${logText}`;
    
        this.log.push(log);
    }

    // バックログを表示するメソッド
    showBacklog() {
        this.populateBacklog();
        this.backlog.style.display = "block";
        this.backlogVisible = true;

        // リストの最後の要素にスクロール
        this.logList.scrollTop = this.logList.scrollHeight;
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

            // クラス名を追加
            listItem.classList.add("log_list_text");
            this.logList.appendChild(listItem);
        });
    }
}