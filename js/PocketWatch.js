/**
 * PocketWatch
 */
class PocketWatch {
  /**
   * constructor
   * PocketWatch クラスの初期設定を行います
   * @param {string} selector 背景を表示する要素のセレクター文字列を指定します
   */
  constructor(selector) {
    console.log('[PocketWatch] constructor');

    const btn = document.querySelector(".btn");

    // Connectボタンをクリックした時の処理をConnectbtn関数に移動します
    btn.addEventListener('click', Connectbtn);

  }
}

function Connectbtn(){
    // navigator.bluetooth.requestDeviceを呼び出す
    const port = navigator.bluetooth.requestDevice({
      filters: [{
      name: 'NimBLE-Arduino'
      }],
      optionalServices: [0x7A20] // 後でサービスにアクセスするために必要です。
    })
    .then(device => {
      // 人間が読み取れるデバイス名。
      console.log(device.name);
      
      // リモートGATTサーバーへの接続を試行。
      return device.gatt.connect();
    })
    .then(server => { 
      console.log(server)

      return server.getPrimaryService(0x7A20);
    })
    .then(service => {
      // Characteristic1を取得中...
      return Promise.all([
          service.getCharacteristic(0xCA00),
          service.getCharacteristic(0xAC0A),
      ]);
    })

    //.then(characteristic => characteristic.startNotifications())

    .then(characteristics => {
      const characteristic1 = characteristics[0];
      const characteristic2 = characteristics[1];

      // Characteristic1とCharacteristic2の処理を行う
      characteristic1.startNotifications();
      characteristic1.addEventListener('characteristicvaluechanged', handleCharacteristic1Changed);

      characteristic2.startNotifications();
      characteristic2.addEventListener('characteristicvaluechanged', handleCharacteristic2Changed);

      // Characteristic1とCharacteristic2の初期値を読み取る
      return Promise.all([
          characteristic1.readValue(),
          characteristic2.readValue()
      ]);
    })
    .then(values => {
      const value1 = values[0];
      const value2 = values[1];

      console.log(`Characteristic1 value: ${value1}`);
      console.log(`Characteristic2 value: ${value2}`);
    })
    .catch(error => { console.error(error); });
}

//カード番号
let answer = "";

function handleCharacteristic1Changed(event) {
    const value = event.target.value;
    const decoder = new TextDecoder('utf-8');
    const str = decoder.decode(value);
    // console.log(str);
    console.log(str);

    if(str == "4b217b26e5e80"){
        console.log("探偵");
        isMode = false;
        answer = str;
    } else if (str === "421da9a6e5e81") {
      console.log("メイド");
      isMode = false;
      answer = str;
      // document.body.classList.add('hide2');
      // closeModal();
    }
    console.log(answer);
    audio();

    if(str === "fb18d0f6" && answer === "421da9a6e5e81"){
      console.log("決定");
      console.log("正解！");
      closeModal();
      onPlay({
        scene: 1,
        cut: 1,
        line: 0,
      });
    } else {
      console.log("不正解！");
    }
}

function audio() {
  document.getElementById('btn_audio').currentTime = 0; //連続クリックに対応
  document.getElementById('btn_audio').play(); //クリックしたら音を再生
}

//加速度
function handleCharacteristic2Changed(event) {
  const value = event.target.value;
  const decoder = new TextDecoder('utf-8');
  const str = decoder.decode(value);
  console.log(str);
}



// function openModal() {
//   const dialog = document.querySelector("dialog");
//   dialog.showModal();
//   dialog.classList.add("open");
// }

// function closeModal() {
//   const dialog = document.querySelector("dialog");
//   dialog.close();
//   dialog.classList.remove("open");
// }
