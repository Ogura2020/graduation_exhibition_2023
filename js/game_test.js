window.addEventListener('load',function(){
  var mess_box = document.getElementById('text_area');
  var mess_text = document.getElementById('text_a');
  var mswin_flg = true;
  var stop_flg = false;
  var end_flg = false;
  var scene_cnt = 0;
  var line_cnt = 0;
  const interval = 30;//文字表示スピード
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
    "<select1 none><select2 2><select3 none><text1 新聞><text2 本棚><select>どこを調べよう？"
  ];

  text[1] = [
    "メイドaaaaaaaa"
  ];

  text[2] = [
    "お嬢iiiiiiiiii"
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
          break;
      case 'text1':
          select_text1.innerHTML = tagget_str[1];
          break;
      case 'text2':
          select_text2.innerHTML = tagget_str[1];
          break;
      case 'text3':
          select_text3.innerHTML = tagget_str[1];
          break;
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
    $('#textbox').trigger('click');
  }
  function selectNoneRemove(){
      $('#select1').removeClass('none');
      $('#select2').removeClass('none');
      $('#select3').removeClass('none');
  }
});

/*
// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/wZowLqYRE/';
  
// Video
let video;
// To store the classification
let label = "";

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
  img = loadImage('img/test/女の人.png');
  a = loadImage('img/test/chopper.png');
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
  //image(video, 0, 0);

  // Draw the label
  // fill(255, 255, 0);
  // textSize(50);
  // textAlign(CENTER);
  // text(label, width / 2, height / 2);

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
  label = results[0].label;
  confidence = results[0].confidence;
  // Classifiy again!
  classifier.classify(video, gotResult);
  //console.log(results[0].confidence)
  
/*ここ使わないかも
  if(label == "なずな" && confidence >0.99){
    console.log("nazuna");
    document.getElementById("img1").src=img_src[0];
    background(248, 237, 226);
    //document.getElementById("suji").innerText = "1";
  }else if(label == "一彩" && confidence >0.99){
    console.log("hiro");
    document.getElementById("img1").src=img_src[1];
    background(248, 237, 226);
    //document.getElementById("suji").innerText = "2";
  }
  */

 /*ここは使う
  if(label == "なずな" && confidence >0.99) {
    image(img, 100, 100);
    console.log("画像表示")
  }else if(label == "一彩" && confidence >0.99){
    image(a, 100, 100);
    console.log("a")
  }
}
*/
//let img_src = new Array("img/test/女の人.png","img/test/chopper.png")
