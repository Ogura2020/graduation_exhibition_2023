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
  
/*
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
  if(label == "なずな" && confidence >0.99) {
    image(img, 100, 100);
    console.log("画像表示")
  }else if(label == "一彩" && confidence >0.99){
    image(a, 100, 100);
    console.log("a")
  }
}

//let img_src = new Array("img/test/女の人.png","img/test/chopper.png")