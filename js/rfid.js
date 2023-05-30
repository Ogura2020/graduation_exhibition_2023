let port;

let chara_no = new Array(1,2)

async function onConnectButtonClick() {
    try {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });

        while (port.readable) {
            const reader = port.readable.getReader();

            try {
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) {
                        addSerial("Canceled\n");
                        break;
                    }
                    const inputValue = new TextDecoder().decode(value);
                    addSerial(inputValue);
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

function addSerial(msg) {
    // var textarea = document.getElementById('outputArea');
    // textarea.value += msg;
    // textarea.scrollTop = textarea.scrollHeight;

    let kasoku = msg.split(",")
    
    if(msg == "b2" || kasoku[2] > 0.5){
        console.log("探偵");
        document.getElementById("img").src = 'img/chara' + chara_no[0] +'.png';
        document.getElementById("suji").innerText = "1";
    }else if(msg == "21" || kasoku[1] > 0.5){
        console.log("メイド");
        document.getElementById("img").src = 'img/chara' + chara_no[1] +'.png';
        document.getElementById("suji").innerText = "2";
    }
    //console.log(msg)
    //console.log(kasoku[2]);
    console.log(msg)
}
