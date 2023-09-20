/**
 * Director 
 * このクラスは gsap.min.js, SplitText.min.js, TextPlugin.min.js, eventemitter3.umd.min.js に依存します
 */

const dialog = new Dialog();

class Director {
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
                // 文字の表示スピード、台詞の文字列 x 0.07
                duration: cut.text.length * 0.07,
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
  
        document.body.addEventListener('click', this.onPlay.bind(this));
        this.ee.on('start', this.#onStart.bind(this));
  
        this.onPlay();
      }
    }
  
    // 別のシナリオに飛ばすメソッドを追加
    jumpToAnotherScenario() {
      // ここで別のシナリオに飛ばす処理を実装
      // 飛ばすシナリオの情報を設定して、onPlay メソッドを呼び出すなど
      const nextScenarioIndex = 1; // 別のシナリオのインデックスを設定
      const nextCutIndex = 0; // 別のシナリオの最初のカットを設定
      this.onPlay({ scenario: nextScenarioIndex, cut: nextCutIndex });
    }

    /**
     * #onStart
     */
    #onStart (e) {
      console.log('[Director] #onStart', e);
      console.log(e.cutIndex)

      //オーキャン用に最後のテキストまで行ったら最初に戻るように設定
      if(e.cutIndex >= 26){
        this.sequence.cut = 0;
      }
  
      while (this.nameBox.firstChild) {
        this.nameBox.removeChild(this.nameBox.firstChild);
      }
  
      [e.name];
  
      this.nameBox.insertAdjacentHTML('afterbegin', e.name);
    }
  
    /**
     * onPlay 引数に指定されたラベルの位置までアニメーションを再生するメソッド
     * @param {string} nextLabel 次のシーンのラベル
     */
    onPlay(nextSequence) {
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
      const hasNextCut = nextCut !== lastCut;
  
      this.timeline.seek(prevLabel).play().addPause(nextLabel);
  
      if (hasNextCut) {
        this.sequence.cut = nextCut;
      }
    }
  }