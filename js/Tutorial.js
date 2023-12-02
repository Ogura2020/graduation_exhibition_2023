class Tutorial extends Dialog {
    /**
     * constructor
     * CallSheet クラスの初期設定を行います
     * @param {string} selector 背景を表示する要素のセレクター文字列を指定します
     */
    constructor(selector) {
        console.log('[tutorial] constructor ');
        super(selector);

        this.nazoDialog = document.querySelector("#nazo_dialog");
        this.tips = document.querySelector(".tips_img"); // tips 変数に値を設定

        // ダイアログ内がクリックされたときの処理を追加
        this.nazoDialog.addEventListener('click', () => {
          if (this.nazoDialog.classList.contains('tutorial')) {
            this.tips.src = 'img/tutorial/hint.png';
          }
  

        });
    }

  /**
   * onStart
   */
  onStart(e) {
    //console.log('[Dialog] onStart', e);

    // 画像ファイル名のリスト
    this.imageList = ['white.png', 'blue.png', 'purple.png', 'red.png']; 

    // ismystery が true のカットであるかの真偽値
    const nextOpenState = e.hasOwnProperty('tutorial') && e.tutorial;

    if (nextOpenState) {
      this.nazoDialog.classList.add('tutorial');
    } else {
      this.nazoDialog.classList.remove('tutorial');
    }

    // ダイアログ要素が存在するか
    if (this.dialog) {
      if (!this.isOpen && nextOpenState) {

        // ダイアログ内の画像を更新
        this.dialog.querySelector('.mystery_img').src = "img/tutorial/0.png"; // ここに新しい画像のパスを設定



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

      //ヒントが表示されていないとき、それぞれにあった画像に入れ替える
      if (this.tips.style.display === "block") {
        console.log("ヒントを表示")
      } else if (e === this.status[0].id) {
        this.sound.select_0.play();
        this.imgElement.src = "img/tutorial/" + this.imageList[0];
      } else if (e === this.status[1].id) {
        this.sound.select_1.play();
        this.imgElement.src = "img/tutorial/" + this.imageList[1];
      } else if (e === this.status[2].id) {
        this.sound.select_2.play();
        this.imgElement.src = "img/tutorial/" + this.imageList[2];
      } else if (e === this.status[3].id) {
        this.sound.select_3.play();
        this.imgElement.src = "img/tutorial/" + this.imageList[3];
      }
    }
  }

  /**
   * onReadAccel
  */
  onReadAccel(e) {
    // ダイアログが開いた状態であれば 加速度 の読み取りを行う
    if (this.isOpen) {
      console.log('[tutorial] onReadAccel', e);
      this.ee.emit('select', e);

      let accel = e.split(',')
      console.log(accel[0]);

      
      if (Math.abs(accel[0]) > 1.0 &&  this.tips.style.display === "block") {
        console.log("ヒント表示中（block）の時は何も起こらない")
      } else if (Math.abs(accel[0]) > 1.0 && this.imgElement.src.endsWith(this.imageList[2])) {
        console.log("正解かつヒントが表示されていない場合、進む")
        this.sound.clear.play();
        this.dialog.close();
        this.dialog.classList.remove('open');
        this.ee.emit('updateModal', { isOpen: false });
      } else if (Math.abs(accel[0]) > 1.0 && !this.imgElement.src.endsWith(this.imageList[2]) && this.imgElement.src.endsWith("img/tutorial/0.png")) {
        console.log("選択されてない場合、振っても何も起こらない");
      } else if (Math.abs(accel[0]) > 1.0 && !this.imgElement.src.endsWith(this.imageList[2]) ) {
        this.sound.miss.play();
        console.log("不正解の場合に音が鳴る");
      } 

    }
  }

}