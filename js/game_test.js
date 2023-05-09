var scene_cnt = 0;//text[0]の数字部分のカウント　シーンが切り替わるときに使用
var line_cnt = 0;//text[0]の中の配列のカウント

//ゲーム画面
window.addEventListener('load',function(){
  var mess_box = document.getElementById('text_area');
  var mess_text = document.getElementById('text_a');
  var mswin_flg = true;//trueの時文字送りの処理をする
  var stop_flg = false;//trueになると文字送りを止める（誤動作防止）
  var end_flg = false;//trueになると文字送り関連の処理を全て止める（シナリオの最後に動作させる）
  const interval = 30;//文字表示スピード　ミリ秒
  //この下消すかも
  var select1 = document.getElementById('select1');
  var select2 = document.getElementById('select2');
  var select3 = document.getElementById('select3');
  var select_text1 = document.getElementById('selectText1');
  var select_text2 = document.getElementById('selectText2');
  var select_text3 = document.getElementById('selectText3');

  var text = [];

  text[0] = [
    "",
    "ある日、事務所に手紙が届いた。",
    "「・・・招待状の謎を解き、是非ご参加ください。」",
    "<select1 1><select2 2><select> aaa"
  ];

  text[1] = [
    "メイドaaaaaaaa",
    "<stop>"
  ];

  text[2] = [
    "お嬢iiiiiiiiii",
    "<stop>"
  ];

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
          stop_flg = true;
          break;
        case 'select':
            $('.select').addClass('show');
            //gotResult();
            //test();
            // if (root_flg){
            //   scene_cnt = select_num1;
            //         line_cnt  = -1;
            //   $('.select').removeClass('show');
            //   textClick();
            // }
            //textClick();
            
            break;
        // case 'text1':　　　<text1 新聞>　新聞をselect_text1に代入する
        //     select_text1.innerHTML = tagget_str[1];
        //     break;
        // case 'text2':
        //     select_text2.innerHTML = tagget_str[1];
        //     break;
        // case 'text3':
        //     select_text3.innerHTML = tagget_str[1];
        //     break;
        case 'select1':
            if(tagget_str[1] === "none"){
                $('#select1').addClass('none');
            }else{
                select_num1 = tagget_str[1];
                select1.addEventListener('click',function(){
                    scene_cnt = select_num1;
                    line_cnt  = -1;
                    $('.select').removeClass('show');
                    selectNoneRemove();
                    textClick();
                });
            }
            break;
        case 'select2':
            if(tagget_str[1] === "none"){
                $('#select2').addClass('none');
            }else{
                select_num2 = tagget_str[1];
                select2.addEventListener('click',function(){
                    scene_cnt = select_num2;
                    line_cnt  = -1;
                    $('.select').removeClass('show');
                    selectNoneRemove();
                    textClick();
                });
            }
            break;
        case 'select3':
            if(tagget_str[1] === "none"){
                $('#select3').addClass('none');
            }else{
                select_num3 = tagget_str[1];
                select3.addEventListener('click',function(){
                    scene_cnt = select_num3;
                    line_cnt  = -1;
                    $('.select').removeClass('show');
                    selectNoneRemove();
                    textClick();
                });
            }
            break;
        case 'break':
            mess_text.innerHTML += '<br>';
            break;
        case 'skip':
            scene_cnt = tagget_str[1];
            line_cnt = -1;
            break;
        case 'chara':
            document.getElementById('chara'+tagget_str[1]).src = 'img/chara' + tagget_str[2] +'.png';
            break;
      }
    }
    if(!stop_flg){
      if(tmp){
          if(tmp != '>') mess_text.innerHTML += tmp;
          setTimeout(main,interval);
      }
    }else{
        mess_text.innerHTML += '<span class="blink-text"></span>';
    }
  }

  //クリックで文字送り
  mess_box.addEventListener('click',function(){
    if(end_flg)return;
      if(mswin_flg){
        if(!stop_flg){
          line_cnt++;
          if(line_cnt >= text[scene_cnt].length){
              line_cnt = 0;
          }
      }else if(scene_cnt>=text.length){
          end_flg = true;
          return;
      }
      split_chars=text[scene_cnt][line_cnt].split('');
      mess_text.innerHTML='';
      main();
    }
  });
  function textClick(){
    $('#text_area').trigger('click');
  }
  function selectNoneRemove(){
      $('#select1').removeClass('none');
      $('#select2').removeClass('none');
      $('#select3').removeClass('none');
  }
});

//カード認識
// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/wZowLqYRE/';
  
// Video
let video;
// To store the classification
// let name = "";

let root_flg = false

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create the video
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  classifier.classify(video, gotResult);
}

function draw() {
  background(248, 237, 226);
  // Draw the video
  //image(video, 0, 0);　//カメラ描画

}


// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  let name = results[0].label;
  let hiritu = results[0].confidence;
  // Classifiy again!
  classifier.classify(video, gotResult);
  //console.log(name)

  if(name == "なずな" && hiritu >0.99) {
    root_flg = true;
    console.log("なずな")
  }else if(name == "一彩" && hiritu >0.99){
    root_flg = true;
    console.log("ひいろ")
  }
  console.log(root_flg);
  //カード認識画面　認識したら分岐させる
  if (root_flg){
    // scene_cnt = tagget_str[1];
    // line_cnt = -1;
    $('.select').removeClass('show');
    root_flg = false;
  }
}


// function test(){
//   var programs = [
//     {name: "yamada", age: 20},
//     {name: "katou", age: 40},
//     {name: "takahasi", age: 60}
//   ];
//   console.log(programs[0].name);
//   if(programs[0].name == "yamada" && programs[0].age > 10) {
//     root_flg = true;
//     console.log("aaa")
//   }
// }

