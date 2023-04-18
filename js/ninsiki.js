// Teachable MachineでアップロードしたモデルのURLに書き換える
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/wZowLqYRE/';

let classifier;
let video;
let label = "";

function preload() {
  //アップロードしたモデルを読み込み
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  //分類開始
  classifier.classify(video, gotResult);
}

function draw() {
  background(0);
  // ビデオを描画
  image(video, 0, 0);

  // ラベルを描画
  fill(255, 255, 0);
  textSize(64);
  textAlign(CENTER);
  text(label, width / 2, height / 2);
}

function gotResult(error, results) {
  // エラー処理
  if (error) {
    console.error(error);
    return;
  }
  // 分類結果を取得
  label = results[0].label;
  // 再度分類を開始
  classifier.classify(video, gotResult);
}