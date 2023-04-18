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
  }

  function setup() {
    createCanvas(320, 260);
    // Create the video
    video = createCapture(VIDEO);
    video.size(320, 240);
    video.hide();

    classifier.classify(video, gotResult);
  }

  function draw() {
    background(0);
    // Draw the video
    image(video, 0, 0);

    // Draw the label
    fill(255, 255, 0);
    textSize(16);
    textAlign(CENTER);
    text(label, width / 2, height / 2);
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
    // Classifiy again!
    classifier.classify(video, gotResult);
    //console.log(results[0].confidence)
    if(label == "なずな" && results[0].confidence >0.99) {
      console.log("ここで画面変わる")
    }else{
      console.log("a")
    }
  }