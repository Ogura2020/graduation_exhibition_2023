/**
 * Director 
 * このクラスは gsap.min.js, SplitText.min.js, TextPlugin.min.js, eventemitter3.umd.min.js に依存します
 */

class Director {
    static SCENARIO_INDEX = {
      '4b217b26e5e80': 0,
      '421da9a6e5e81': 1, //1メイド　シャロット・ウィンキソン
      '428d4b2c11190': 2, //2愛人　マリア・レイ・ローレ2
      '46623b2c11190': 3, //3助手　アズキ・シェレンベルガー
      '4da5fb2c11190': 4, //4刑事　ロンベル・ティガー
      '46f64b2c11190': 5, //5婚約者　アズマ　ユウイチ
      '41bc6b2c11190': 6, //6姉　ジキル・フォン・アヴリル
      '456a5b2c11190': 7, //7妹　ジキル・フォン・メアリ
      '45399b2c11191': 8, //8金持ち　ジキル・ウィックマン
      '41c5b2c11195': 9, //9私立探偵　グリフィス・S・マーティン
      '4bc8fb2c11190': 10, //10執事　サウス・リチャードソン
      '460c6b2c11190': 11, //0探偵　トーマス・ティム・ロシー
      'epi2': 12,
      'epi3': 13,
      'epi4': 14,
      'epi5': 15,
    };
  
    /**
     * Director クラスの初期設定を行います
     * @param {string} selectors シナリオを表示する要素のセレクター文字列を指定します
     * @param {string[][][][]} scenarios シナリオを表示する要素のセレクター文字列を指定します
     */
    constructor(
      selectors = {
        scenarioBox: undefined,
        nameBox: undefined,
      },
      scenarios
    ) {
      console.log('[Director] constructor');
      const startLabel = 'start';
  
      this.ee = new EventEmitter3();
      this.scenarioBox = document.querySelector(selectors.scenarioBox);
      this.nameBox = document.querySelector(selectors.nameBox);

      this.scenarios = scenarios;
      this.sequence = {
        scenario: 0,
        cut: 0,
      };
      // ユーザーからの進行に関する入力を受け付けないようにするかの真偽値
      this.isMode = false;
      this.labels = [];
      this.timeline = gsap.timeline({ repeat: -1, paused: true });
  
      // タイムラインをセットアップする
      this.timeline.addLabel(startLabel);
      this.labels.push(startLabel);

      this.part = 1;
      console.log("飛んだ" + this.part)
  
      // this.ee.on('complete', (e) => {
      //   // テキストが特定の条件を満たすかどうかを確認  "ここに書いたテキストに反応"
      //   if (e.text.includes(" ")) {
          
      //     // ダイアログを開く
      //     openDialog(); // dialog.js の関数を呼び出す
          
      //     // 別のシナリオに飛ばす処理を実行　下のほうに処理の記述ある
      //     //this.jumpToAnotherScenario();
      //   }
      // });

      if (this.scenarioBox && this.nameBox) {
        this.scenarios.forEach(({ actorIdsArray, cuts }, scenarioIndex) => {
          cuts.forEach((cut, cutIndex) => {
            const label = `${scenarioIndex}_${cutIndex}`;
  
            this.timeline.fromTo(
              this.scenarioBox,
              {
                text: '',
              },
              {
                // シナリオの text の文字列が空だと start イベントが発生しないので、仮想の1文字を足しておく
                duration: (cut.text.length + 1) * 0.05,
                ease: 'none',
                text: cut.text,
                onComplete: () => {
                  // アニメーションが完了した時の処理
                  // complete イベントを通知する、emit(イベント名 , 引数)でイベントが発動
                  this.ee.emit('complete', {
                    actorIdsArray,
                    ...cut,
                    scenarioIndex,
                    cutIndex,
                  });
                },
                onStart: () => {
                  // アニメーションが開始した時の処理
                  // start イベントを通知する
                  this.ee.emit('start', {
                    actorIdsArray,
                    ...cut,
                    scenarioIndex,
                    cutIndex,
                  });
                },
              },
              this.labels.length > 0 ? `${label}+=0.001` : undefined
            );
  
            this.labels.push(label);
            this.timeline.addLabel(label);
          });
        });
  
        //テキストエリアをクリックするとテキストが進む
        const text = document.querySelector(".screen");
        text.addEventListener('click', this.onPlay.bind(this));
        this.ee.on('start', this.#onStart.bind(this));
  
        // スキップボタンをクリックで謎解きやキャラ選択まで移動する
        const skip = document.getElementById("skip");
        skip.addEventListener('click', auto.bind(this));

        // テキストをオートで進める関数
        function auto() {
          console.log("スキップボタンクリック")
          // ここにオートモードでのテキスト進行処理を実装します
          // カットごとにテキストを進める処理を行います
          const nowScenario = this.scenarios[this.sequence.scenario];
          const nowCutIndex = this.sequence.cut;
          // console.log(nowScenario)
          // console.log(nowCutIndex)

          // 現在のカットから条件を検証し、該当するカットまでシナリオを進める
          //謎解き、キャラ選択のひとつ前のテキストまで飛ばす
          for (let i = nowCutIndex; i < nowScenario.cuts.length; i++) {
              const cut = nowScenario.cuts[i];
              //console.log(cut)

            //謎解き分増やすの忘れない
            if (cut.tutorial || cut.ismystery0 || cut.ismystery1 || cut.ismystery2 || cut.ismystery3 || cut.ismystery4 || cut.ismystery5 || cut.ismystery6 || cut.ismystery7 || cut.ismystery8 || cut.ismystery9 || cut.ismystery10 || cut.ismystery11 || cut.ismystery12 || cut.isCallSheet1 || cut.isCallSheet2|| cut.isCallSheet3) {
              this.onPlay({ cut: i - 1}); // +1 することで次のカットに進みます
              break; // 条件が満たされたらループを抜けます
            }
          }
        }

        this.onPlay();

      }

      // 選択済みのシナリオのセット
      this.selectedScenarios = new Set();
    }
  
    // 別のシナリオに飛ばすメソッドを追加
    jumpToAnotherScenario(nextScenarioIndex) {
      // ここで別のシナリオに飛ばす処理を実装
      // 飛ばすシナリオの情報を設定して、onPlay メソッドを呼び出すなど
      const nextCutIndex = 0; // 別のシナリオの最初のカットを設定
      this.onPlay({ scenario: nextScenarioIndex, cut: nextCutIndex });
    }
    
    /**
     * #onStart
     */
    #onStart (e) {
      console.log('[Director] #onStart', e);
      console.log(this.selectedScenarios.size);
      console.log(this.sequence.cut);
      console.log(this.scenarios[this.sequence.scenario].cuts.length);
      console.log("現在のシナリオ"+this.sequence.scenario);

      //BGMやSE
      this.ee.emit('bgm', this.sequence.scenario, this.sequence.cut);

      const nameBox_display = document.querySelector('#name_area');
      const textBox_display = document.querySelector('#text_area');

      //もし名前欄が空白だったら#name_areaを非表示、入力されていたら表示
      if (e.name === '　'){
        nameBox_display.style.display = 'none';
      } else {
        nameBox_display.style.display = 'block';
      }

      //もし名前欄が空白だったら#text_areaを非表示、入力されていたら表示
      if (e.text === '　'){
        textBox_display.style.display = 'none';
      } else {
        textBox_display.style.display = 'block';
      }

      // //オーキャン用に最後のテキストまで行ったら最初に戻るように設定
      // if(e.cutIndex == this.sequence.cut){

      //   // もし次のシナリオが存在するなら、それに飛ぶ
      //   if (this.scenarios[0]) {
      //     this.jumpToAnotherScenario(1);
      //   }
        
      // }

      while (this.nameBox.firstChild) {
        this.nameBox.removeChild(this.nameBox.firstChild);
      }
  
      // 特定の条件を満たす場合、特定のシナリオに飛ばす（例: 3つのシナリオに飛んだ場合）
      if (this.part === 1 && this.selectedScenarios.size === 2 && this.scenarios[this.sequence.scenario].cuts.length <= this.sequence.cut) {
        this.jumpToAnotherScenario(Director.SCENARIO_INDEX['epi2']);
        this.selectedScenarios = new Set();
        this.part = 2;
        console.log("飛んだ前半",this.selectedScenarios.size, this.selectedScenarios,this.part)
      } else if (this.part === 2 && this.selectedScenarios.size === 2 && this.scenarios[this.sequence.scenario].cuts.length <= this.sequence.cut) {
        this.jumpToAnotherScenario(Director.SCENARIO_INDEX['epi3']);
        this.part = 3;
        console.log("飛んだ後半",this.selectedScenarios.size, this.selectedScenarios,this.part)
      }

      // if(this.scenarios[12] && this.selectedScenarios.size === 2){

      // }

      //OC用、本番用に改良する。シナリオ1の最後まで行くとリロード
      // if(this.scenarios[this.sequence.scenario].cuts.length === this.sequence.cut){
      //   location.reload();
      // }

      this.nameBox.insertAdjacentHTML('afterbegin', e.name);
    }

    /**
     * onSelect 引数に指定された ID のシナリオに変更するメソッド
     * @param {string} rfid rfid の文字列
     */
    onSelect(rfid) {
      console.log('[Director] onSelect', rfid);
    
      const scenarioIndex = Director.SCENARIO_INDEX[rfid];
      console.log(this.scenarios[scenarioIndex].cuts.length);

      // カード0,4,7,8,9かつまだ選択されていないシナリオの場合、プロローグ以外で(scenarioIndex !== 0 && )
      if (this.part === 1 && !this.selectedScenarios.has(scenarioIndex) && ([11, 4, 7, 8, 9].includes(scenarioIndex))) {
        // シナリオを変更する
        this.selectedScenarios.add(scenarioIndex); // シナリオを選択済みに設定
        // ユーザーからの入力（キャラクター選択・謎解き）を受け付けないようにする
        this.isMode = false;
        // シナリオの最初のカットから再生を開始する
        this.onPlay({
          scenario: scenarioIndex,
          cut: 0,
        });
        console.log("飛んだ" + this.part)
      } else if(this.part === 2 && !this.selectedScenarios.has(scenarioIndex) && ([1, 2, 3, 5, 6, 10].includes(scenarioIndex))) {
        // シナリオを変更する
        this.selectedScenarios.add(scenarioIndex); // シナリオを選択済みに設定
        // ユーザーからの入力（キャラクター選択・謎解き）を受け付けないようにする
        this.isMode = false;
        // シナリオの最初のカットから再生を開始する
        this.onPlay({
          scenario: scenarioIndex,
          cut: 0,
        });
        console.log("飛んだ" + this.part)
      }

      if(this.sequence.scenario === 13 && rfid === "421da9a6e5e81") {
        this.seikai = 0;
        // ユーザーからの入力（キャラクター選択・謎解き）を受け付けないようにする
        this.isMode = false;
        // シナリオの最初のカットから再生を開始する
        this.onPlay({
          scenario: Director.SCENARIO_INDEX['epi4'],
          cut: 0,
        });
        console.log("飛んだ正解" + this.part)
      } else if(this.sequence.scenario === 13 && rfid !== "460c6b2c11190" && rfid !== "46623b2c11190" && rfid !== "45399b2c11191" && rfid !== "421da9a6e5e81") {
        this.seikai = 1;
        // ユーザーからの入力（キャラクター選択・謎解き）を受け付けないようにする
        this.isMode = false;
        // シナリオの最初のカットから再生を開始する
        this.onPlay({
          scenario: Director.SCENARIO_INDEX['epi5'],
          cut: 0,
        });
        console.log("飛んだ不正解" + this.part)
      }


      console.log(this.selectedScenarios.size, this.selectedScenarios, this.part)

      //console.log(this.selectedScenarios);
    }
  
    /**
    
     * onPlay 引数に指定されたラベルの位置までアニメーションを再生するメソッド
     * @param {string} nextLabel 次のシーンのラベル
     */
    onPlay(nextSequence) {
      // ユーザーからの入力（キャラクター選択・謎解き）を受け付けるモードではない場合はなにもしない
      if (this.isMode) {
        return;
      }
      console.log('[Director] onPlay');

      const defaults = {
        scenario: undefined,
        cut: undefined,
      };
      const options = Object.assign({}, defaults, nextSequence);
  
      this.sequence.scenario =
        typeof options.scenario === 'undefined'
          ? this.sequence.scenario
          : options.scenario;
      this.sequence.cut =
        typeof options.cut === 'undefined' ? this.sequence.cut : options.cut;
  
      // アニメーションを再生するラベル
      const nextLabel = `${this.sequence.scenario}_${this.sequence.cut}`;
      // nextSequence のひとつ前のラベルを取得する
      const prevLabel = this.labels[this.labels.indexOf(nextLabel) - 1];
      const nextCut = this.sequence.cut + 1;
      const lastCut = this.scenarios[this.sequence.scenario].cuts.length;
      const hasNextCut = nextCut <= lastCut;

      // 次のカットが存在するなら、シークして再生する

      if (hasNextCut) {
        this.timeline.seek(prevLabel).play().addPause(nextLabel);
        this.sequence.cut = nextCut;
      }
    }

    /**
     * lock シナリオの進行をロック・解除するメソッド
     * @param {boolean} isMode ロックするか解除するかの真偽値を指定します true であればシナリオの進行がロックされます
     */
    updateLock(isMode) {
      this.isMode = isMode;
    }
  }