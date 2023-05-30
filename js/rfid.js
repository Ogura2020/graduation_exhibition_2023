let chara_no = new Array(1,2)

const carriageReturnlRegex = new RegExp(/\r?\n|\r/, 'g');

async function onConnectButtonClick() {
    try {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });

        while (port.readable) {
            const textDecoder = new TextDecoderStream();
            const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
            const reader = textDecoder.readable
              .pipeThrough(new TransformStream(new LineBreakTransformer()))
              .getReader();

            try {
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) {
                        addSerial("Canceled\n");
                        break;
                    }
                    
                    addSerial(value);
                }
            } catch (error) {
                addSerial("Error: Read" + error + "\n");
            } finally {
                reader.releaseLock();
            }
        }
    } catch (error) {
        addSerial("Error: Open" + error + "\n");
    }
}

// /\r?\n|\r/;

function addSerial(msg) {
  var textarea = document.getElementById('outputArea');
  textarea.value += msg;
  textarea.scrollTop = textarea.scrollHeight;

  // メッセージを分割する
  const message = msg.split(',');

  // 加速度のメッセージであれば数値に変換する
  if (message.length === 4 && message[0] === 'acc') {
    for (let i = 1; i < message.length; i++) {
      message[i] = parseFloat(message[i], 10);
    }
  }

  // if(msg == "b2" || kasoku[2] > 0.5){
  //     console.log("探偵");
  //     document.getElementById("img").src = 'img/chara' + chara_no[0] +'.png';
  //     document.getElementById("suji").innerText = "1";
  // }else if(msg == "21" || kasoku[1] > 0.5){
  //     console.log("メイド");
  //     document.getElementById("img").src = 'img/chara' + chara_no[1] +'.png';
  //     document.getElementById("suji").innerText = "2";
  // }
  console.log(message);
}
