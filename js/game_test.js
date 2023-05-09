const ee = new EventEmitter3();
const scenarioBox = document.querySelector('#js-scenario_Box');
const timeline = gsap.timeline({ repeat: -1, paused: true  });
const labels = [];
const lines = [
  [
    [
      'ある日、事務所に手紙が届いた。', // 0_0_0
      '「・・・招待状の謎を解き、是非ご参加ください。」', // 0_0_1
      '選択画面', // 0_0_2
    ],
  ],
  [
    [
      'メイドメイドメイドメイドメイド0', // 1_0_0
      'メイドメイドメイドメイドメイド1', // 1_0_1
      'メイドメイドメイドメイドメイド2', // 1_0_2
    ],
    [
      'お嬢0', // 1_1_0
      'お嬢1', // 1_1_1
      'お嬢2', // 1_1_2
    ],
  ],
];

// これ更新する
const sequence = {
  scene: 0,
  cut: 0,
  line: 0,
};
let isMode = false; // false であればユーザーがクリックで操作を進められる

//カード認識
// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/wZowLqYRE/';
  
// Video
let video;

/**
 * onPlay
 */
const onPlay = (nextSequence) => {
  const defaults = { scene: undefined, cut: undefined, line: undefined };
  const options = Object.assign({}, defaults, nextSequence);

  sequence.scene = typeof options.scene === 'undefined' ? sequence.scene : options.scene;
  sequence.cut = typeof options.cut === 'undefined' ? sequence.cut : options.cut;
  sequence.line = typeof options.line === 'undefined' ? sequence.line : options.line;

  const prevLabel = labels[labels.indexOf(`${sequence.scene}_${sequence.cut}_${sequence.line}`) - 1];
  const { scene, cut, line } = sequence;
  const nextLabel = `${scene}_${cut}_${line}`;

  console.log(prevLabel, nextLabel);

  timeline.seek(prevLabel).play().addPause(nextLabel);

  if (sequence.line + 1 === lines[sequence.scene][sequence.cut].length) {
    sequence.scene = 0;
    sequence.cut = 0;
    sequence.line = 0;
  } else {
    // シーン（台詞）を進める
    sequence.line = (sequence.line + 1) % lines[sequence.scene][sequence.cut].length;
  }
};

gsap.registerPlugin(TextPlugin);

/**
 * onModelLoaded
 */
const onModelLoaded = () => {
  timeline.addLabel('start');
  labels.push('start');

  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      for (let k = 0; k < lines[i][j].length; k++) {
        const line = lines[i][j][k];
        const label = `${i}_${j}_${k}`;

        timeline.fromTo(
          scenarioBox,
          {
            text: '',
          },
          {
            // 一文字あたり 0.05 ms で表示する
            duration: line.length * 0.05,
            ease: 'none',
            text: line,
            onComplete: () => {
              ee.emit('complete', line, i, j, k);
            },
            onStart: () => {
              ee.emit('start', line, i, j, k);
            },
          },
          // すこし（0.001 ms）オフセットしないと意図した表示にならない
          labels.length > 0 ? `${label}+=0.001` : undefined
        );

        labels.push(label);
        timeline.addLabel(label);
      }
    }
  }

  // 台詞のボックスが押下された時のイベントリスナー
  scenarioBox.addEventListener('click', () => {
    if (!isMode) {
      onPlay();
    }
  });

  // 台詞の開始を検知するイベントリスナー
  ee.on('start', (line, i, j, k) => {
    // この中条件分岐を追加して、画像とか切り替えられると思う
    console.log(line, i, j, k);

    // 「選択画面」になったらユーザー操作（クリック）を無効にする
    if (line === '選択画面') {
      isMode = true;
    }
  });

  // 台詞の表示終了を検知するイベントリスナー
  ee.on('complete', (line, i, j, k) => {
    // この中条件分岐を追加して、画像とか切り替えられると思う
    console.log(line, i, j, k);

    // 「選択画面」が表示されたら画像の判定を開始する
    if (line === '選択画面') {
      classifier.classify(video, gotResult);
    }
  });
};

// Load the model first
function preload() {
  // classifier = ml5.imageClassifier(imageModelURL + 'model.json', onModelLoaded);
  classifier = ml5.imageClassifier(imageModelURL + 'model.json', onModelLoaded);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create the video
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // classifier.classify(video, gotResult);
}

function draw() {
  background(248, 237, 226);
  // Draw the video
  // image(video, 0, 0); //カメラ描画
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }

  console.log(isMode);

  if (isMode) {
    // The results are in an array ordered by confidence.
    // console.log(results[0]);
    const label = results[0].label;
    const confidence = results[0].confidence;

    if (confidence > 0.99) {
      if (label === 'なずな') {
        console.log('なずな');
        isMode = false;
        onPlay({
          scene: 1,
          cut: 0,
          line: 0,
        });
      } else if (label === '一彩') {
        console.log('一彩');
        isMode = false;
        onPlay({
          scene: 1,
          cut: 1,
          line: 0,
        });
      }
    }

    // Classifiy again!
    classifier.classify(video, gotResult);
  }
}