function Connectbtn(){
    let btn =  document.querySelector(".btn")

    btn.addEventListener('click', function(event) {
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
    });
    
}

const ee = new EventEmitter3();//イベントが発生した時eeがトリガーになる
const screen = document.querySelector("#screen");
const scenarioBox = document.querySelector("#js-scenario_Box");
var mess_text = document.getElementById('js-scenario_Box');
const timeline = gsap.timeline({ repeat: -1, paused: true});
const labels = [];
const lines = [
  [
    [
      "<chara 1 0>謎解きサイトのプロトタイプです。",
      "この作品はカードを使って謎解きをします。",
      "今回は２枚のカードを使って謎を解いてみましょう。",
      "<chara 1 100> 答えだと思うカードをスキャンして下さい。",
    ],
  ],
  [
    [
      "<chara 1 1>不正解",
      "ヒント：「く」の前は？",
      "始めに戻ります。",
    ],
    [
      "<chara 1 2>正解！",
      "始めに戻ります。",
    ],
  ],
  [
    [
      "ううう",
      "ううう",
      "ううう",
      "ううう",
    ],
    [
      "えええ",
      "ええええ",
    ],
  ],
];

console.log(lines[1][1][1])

const sequence = {
  scene: 0,
  cut: 0,
  line: 0
};

let isMode = false;

//カード認識
// Classifier Variable
// let classifier;
// Model URL
//let imageModelURL = 'https://teachablemachine.withgoogle.com/models/EgHHvFILm/';データ変更した時URLコピペしてここ変えるだけでよし
//let imageModelURL = 'https://teachablemachine.withgoogle.com/models/_PDd7oeUD/';
  
// Video
//let video;

function main(){
  var tmp = split_chars.shift();
  if(tmp == '<'){
    let tagget_str = '';
    tmp = split_chars.shift();
    while(tmp != '>'){
      tagget_str += tmp;
      tmp = split_chars.shift();
    }
    tagget_str = tagget_str.split(/\s/);
    
    switch(tagget_str[0]){
      case 'stop':
        isMode = true;
        break;
      case 'break':
        scenarioBox.innerHTML += '<br>';
          break;
      case 'chara':
          document.getElementById('chara'+tagget_str[1]).src = 'img/chara' + tagget_str[2] +'.png';
          break;
    }
  }
  if(!isMode){
    if(tmp){
        if(tmp != '>') scenarioBox.innerHTML += tmp;
        setTimeout(main,timeline);
    }
  }else{
    scenarioBox.innerHTML += '<span class="blink-text"></span>';
  }
}

const onPlay = (nextSequence) => {
  const defaults = {scense: undefined, cut: undefined, line: undefined};
  const options = Object.assign({}, defaults, nextSequence);

  sequence.scene = typeof options.scene === "undefined" ? sequence.scene : options.scene;
  sequence.cut =  typeof options.cut === "undefined" ? sequence.cut : options.cut;
  sequence.line = typeof options.line === "undefined" ? sequence.line : options.line;

  const prevLabel = labels[labels.indexOf(`${sequence.scene}_${sequence.cut}_${sequence.line}`) - 1];//ここの-1とは？聞く
  const {scene, cut, line} = sequence;
  const nextLabel = `${scene}_${cut}_${line}`;

  console.log(prevLabel, nextLabel);

  timeline.seek(prevLabel).play().addPause(nextLabel);

  if(sequence.line + 1 === lines[sequence.scene][sequence.cut].length){
    sequence.scene = 0;
    sequence.cut = 0;
    sequence.line = 0;
  } else {
    // シーン（台詞）を進める
    sequence.line = (sequence.line + 1) % lines[sequence.scene][sequence.cut].length;
  }
  console.log(sequence.line)
};

gsap.registerPlugin(TextPlugin);

const onPreload = () => {
  timeline.addLabel("start");
  labels.push("start");

  for(let i = 0; i < lines.length; i++){
    for(let j = 0; j < lines[i].length; j++){
      for (let k = 0; k < lines[i][j].length; k++){
        const line = lines[i][j][k];
        const label = `${i}_${j}_${k}`;

        timeline.fromTo(
          scenarioBox,
          {
            text: "",
          },
          {
            duration: line.length * 0.05,//文字の表示スピード
            ease: "none",
            text: line,
            onComplete: () => {//アニメーションが完了した時
              ee.emit("complete", line, i, j, k);//emit(イベント名 , 引数)でイベントが発動
            },
            onStart: () => {//アニメーションが開始した時
              ee.emit("start", line, i, j, k);
            },
          },
          labels.length > 0 ? `${label}+=0.001` : undefined
        );

        labels.push(label);
        timeline.addLabel(label);
      }
    }
  }

  screen.addEventListener("click", () =>{
    if(!isMode){
      onPlay();
    }
  });

  ee.on("start", (line, i, j, k) =>{//on(イベント名 , listener ) startイベントに紐づけ、listenerを登録
    console.log(line, i, j, k);

    split_chars = (line).split("");
    scenarioBox.innerHTML='';
    main();
    
     // 「選択画面」になったらユーザー操作（クリック）を無効に
    if(line === "<chara 1 100> 答えだと思うカードをスキャンして下さい。"){
      isMode = true;
    }
  });

  // 台詞の表示終了を検知するイベントリスナー 　アニメーションが完了したら作動
  ee.on("complete", (line, i, j, k) =>{
    console.log(line, i, j, k);

    // 「選択画面」が表示されたら画像の判定を開始
    if(line === "<chara 1 100> 答えだと思うカードをスキャンして下さい。"){

    }
  });
};

// Load the model first
function preload() {
  onPreload();
}

function setup() {

}

function draw() {

}


function handleCharacteristic1Changed(event) {
    const value = event.target.value;
    const decoder = new TextDecoder('utf-8');
    const str = decoder.decode(value);
    console.log(str);

    if (scenarioBox.innerHTML.includes("答えだと思うカードをスキャンして下さい。")){
    if(str == "4b217b26e5e80"){
        console.log("探偵");
        isMode = false;
        onPlay({
          scene: 1,
          cut: 0,
          line: 0,
      });

    } else if (str === "421da9a6e5e81") {
      console.log("メイド");
      isMode = false;
      onPlay({
        scene: 1,
        cut: 1,
        line: 0,
      });
    }
  }
}
 
function handleCharacteristic2Changed(event) {
     const value = event.target.value;
     const decoder = new TextDecoder('utf-8');
     const str = decoder.decode(value);
     console.log(str);
}