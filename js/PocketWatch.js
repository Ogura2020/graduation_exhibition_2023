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

    this.ee = new EventEmitter3();

    this.dialogOpen = false; // ダイアログの初期状態は閉じている
    
    //const start = document.querySelector("#js-start");
    const ble_btn2 = document.querySelector("#ble_btn2");

    // Connectボタンをクリックした時の処理をConnectbtn関数に移動します
    //start.addEventListener('click', this.onConnect.bind(this));
    ble_btn2.addEventListener('click', this.onConnect.bind(this));
  }

  onConnect(){
    // navigator.bluetooth.requestDeviceを呼び出す
    const port = navigator.bluetooth.requestDevice({
      filters: [{
        name: '懐中時計'
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

        // ダイアログの開閉状態に応じて通信を開始
        //this.setDialogOpenStatus(true);
        console.log(this.dialogOpen)

        if (!this.dialogOpen) { // ダイアログが開いている場合のみ処理を行う
          console.log("ダイアログが開いたとき、通信を開始")
          // Characteristic1とCharacteristic2の処理を行う
          characteristic1.startNotifications();
          characteristic1.addEventListener('characteristicvaluechanged', this.handleCharacteristic1Changed.bind(this));
  
          characteristic2.startNotifications();
          characteristic2.addEventListener('characteristicvaluechanged', this.handleCharacteristic2Changed.bind(this));
        }

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
        // //ble通信開始を通知
        //this.ee.emit('Connect');
      })
      .catch(error => { console.error(error); });
  }

  handleCharacteristic1Changed(event) {
    if (!this.dialogOpen) {
      // ダイアログが閉じている場合、通知を無視
      return;
    }

    const value = event.target.value;
    const decoder = new TextDecoder('utf-8');
    const str = decoder.decode(value);
    // console.log(str);
    console.log(str);

    this.ee.emit('readRFID', str);
  }

  handleCharacteristic2Changed(event) {
    if (!this.dialogOpen) {
      // ダイアログが閉じている場合、通知を無視
      return;
    }

    const value = event.target.value;
    const decoder = new TextDecoder('utf-8');
    const str = decoder.decode(value);
    //console.log(str);

    this.ee.emit('readAccel', str);
  }

    // ダイアログの開閉状態を設定するメソッド
    setDialogOpenStatus(isOpen) {
      this.dialogOpen = isOpen;
      console.log(this.dialogOpen)
  
      // ダイアログが閉じた場合、通信を停止する
      if (!isOpen) {
        // Characteristic1とCharacteristic2の通信を停止
        console.log("ダイアログが閉じたとき、通信を停止")
        this.stopCharacteristicNotifications();
      }
    }
  
    // Characteristic1とCharacteristic2の通信を停止するメソッド
    stopCharacteristicNotifications() {
    // Characteristic1とCharacteristic2が存在する場合にのみ停止する
    if (this.characteristic1) {
      this.characteristic1.stopNotifications();
      this.characteristic1.removeEventListener('characteristicvaluechanged', this.handleCharacteristic1Changed.bind(this));
    }

    if (this.characteristic2) {
      this.characteristic2.stopNotifications();
      this.characteristic2.removeEventListener('characteristicvaluechanged', this.handleCharacteristic2Changed.bind(this));
    }
    }
}