class Mystery2 extends Dialog {
  /**
   * constructor
   * CallSheet クラスの初期設定を行います
   * @param {string} selector 背景を表示する要素のセレクター文字列を指定します
   */
  constructor(selector) {
      console.log('[mystery2] constructor ');
      super(selector);

      this.nazoDialog = document.querySelector("#nazo_dialog");
      this.tips = document.querySelector(".tips_img"); // tips 変数に値を設定

      // ダイアログ内がクリックされたときの処理を追加
      this.nazoDialog.addEventListener('click', () => {
        if (this.nazoDialog.classList.contains('mystery2')) {
          console.log('mystery2');
          this.tips.src = 'img/mystery2/hint.png';

          // 画像の表示状態を取得
          const show = this.tips.style.display === 'block';

          // 画像の表示状態を切り替える
          if (show) {
            this.tips.style.display = 'none'; // 画像を非表示する
          } else {
            this.tips.style.display = 'block'; // 画像を表示する
          }
        }
        

      });
  }

/**
 * onStart
 */
onStart(e) {
  //console.log('[Dialog] onStart', e);

  // 画像ファイル名のリスト
  this.imageList = ['1.png', '3.png', '5.png', '6.png', '7.png', '8.png', '10.png']; 

  // ismystery が true のカットであるかの真偽値
  const nextOpenState = e.hasOwnProperty('ismystery2') && e.ismystery2;

  if (nextOpenState) {
    this.nazoDialog.classList.add('mystery2');
  } else {
    this.nazoDialog.classList.remove('mystery2');
  }

  // ダイアログ要素が存在するか
  if (this.dialog) {
    if (!this.isOpen && nextOpenState) {

      // ダイアログ内の画像を更新
      this.dialog.querySelector('.mystery_img').src = "img/mystery2/0.png"; // ここに新しい画像のパスを設定(初めに表示される画像)

      //BGM再生
      this.sound.thinking.play();
      this.sound.thinking.fade(0, 1, 3000);

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
    console.log('[mystery2] onReadRFID', e);
    this.ee.emit('select', e);
    this.id = e;
    this.imgElement = this.dialog.querySelector('.mystery_img');

    //ヒントが表示されていないとき、それぞれにあった画像に入れ替える
    if (this.tips.style.display === "block") {
      console.log("ヒントを表示")
    } else if (e === this.status[1].id) {
      this.sound.select_1.play();
      this.imgElement.src = "img/mystery2/" + this.imageList[0];
    } else if (e === this.status[3].id) {
      this.sound.select_3.play();
      this.imgElement.src = "img/mystery2/" + this.imageList[1];
    } else if (e === this.status[5].id) {
      this.sound.select_5.play();
      this.imgElement.src = "img/mystery2/" + this.imageList[2];
    } else if (e === this.status[6].id) {
      this.sound.select_6.play();
      this.imgElement.src = "img/mystery2/" + this.imageList[3];
    } else if (e === this.status[7].id) {
      this.sound.select_7.play();
      this.imgElement.src = "img/mystery2/" + this.imageList[4];
    } else if (e === this.status[8].id) {
      this.sound.select_8.play();
      this.imgElement.src = "img/mystery2/" + this.imageList[5];
    } else if (e === this.status[10].id) {
      this.sound.select_10.play();
      this.imgElement.src = "img/mystery2/" + this.imageList[6];
    }
  }
}

/**
 * onReadAccel
*/
onReadAccel(e) {
  // ダイアログが開いた状態であれば 加速度 の読み取りを行う
  if (this.isOpen) {
    console.log('[mystery2] onReadAccel', e);
    this.ee.emit('select', e);

    let accel = e.split(',')
    console.log(this.id);

    
    if (Math.abs(accel[0]) > 1.0 &&  this.tips.style.display === "block") {
      console.log("ヒント表示中（block）の時は何も起こらない")
    } else if (Math.abs(accel[0]) > 1.0 && this.imgElement.src.endsWith(this.imageList[3])) {
      console.log("正解かつヒントが表示されていない場合、進む")

      // 音が再生されていない場合にのみ音を再生
      if (!this.isClear) {
        this.sound.clear.play();
        this.isClear = true; // 音が再生されたことを記録
      }

      this.dialog.close();
      this.dialog.classList.remove('open');
      this.ee.emit('updateModal', { isOpen: false });
      this.isOpen = false
      //BGM停止
      this.sound.thinking.fade(1, 0, 1000);
    } else if (Math.abs(accel[0]) > 1.0 && !this.imgElement.src.endsWith(this.imageList[3]) && this.imgElement.src.endsWith("img/mystery2/0.png")) {
      console.log("選択されてない場合、振っても何も起こらない");
    } else if (Math.abs(accel[0]) > 1.0 && !this.imgElement.src.endsWith(this.imageList[3]) ) {

      // １つ前に選択したカード（ID）と違っていたらisMissをfalseにする
      if (this.select !== this.id){
        this.isMiss = false;
        // 音が再生されていない場合にのみ音を再生
        if (!this.isMiss) {
          //関係ないカード以外は不正解音を鳴らす
          if(this.id !== this.status[0].id && this.id !== this.status[2].id && this.id !== this.status[4].id && this.id !== this.status[9].id) {
            this.sound.miss.play();
            console.log("不正解の場合に音が鳴る");
            this.isMiss = true; // 音が再生されたことを記録
            this.select = this.id
          }
        }
      }
    } 

  }
}
}