/**
 * Director 
 * このクラスは gsap.min.js, SplitText.min.js, TextPlugin.min.js, eventemitter3.umd.min.js に依存します
 */

class Director {
    static SCENARIO_INDEX = {
      '4b217b26e5e80': 0,
      '421da9a6e5e81': 1,
      '428d4b2c11190': 2,
      '46623b2c11190': 3,
      '4da5fb2c11190': 4,
      '46f64b2c11190': 5,
      '41bc6b2c11190': 6,
      '456a5b2c11190': 7,
      '45399b2c11191': 8,
      '41c5b2c11195': 9,
      '4bc8fb2c11190': 10,
      '460c6b2c11190': 11,
      'fb18d0f6': 12,
      'epilogue': 13,
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
                duration: (cut.text.length + 1) * 0.07,
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
        const text = document.querySelector(".text");
        text.addEventListener('click', this.onPlay.bind(this));
        this.ee.on('start', this.#onStart.bind(this));
  
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
      console.log(this.scenarios[this.sequence.scenario].cuts.length);

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
      if (this.selectedScenarios.size === 3 && this.scenarios[this.sequence.scenario].cuts.length <= this.sequence.cut) {
        this.jumpToAnotherScenario(Director.SCENARIO_INDEX['epilogue']);
      }
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

      // プロローグ以外で、かつまだ選択されていないシナリオの場合
      if (scenarioIndex !== 0 && !this.selectedScenarios.has(scenarioIndex)) {
        // シナリオを変更する
        this.selectedScenarios.add(scenarioIndex); // シナリオを選択済みに設定

        // ユーザーからの入力（キャラクター選択・謎解き）を受け付けないようにする
        this.isMode = false;
          // シナリオの最初のカットから再生を開始する
          this.onPlay({
            scenario: scenarioIndex,
            cut: 0,
          });
      }
      console.log(this.selectedScenarios.size, this.selectedScenarios)

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