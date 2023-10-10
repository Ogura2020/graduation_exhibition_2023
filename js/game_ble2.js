// ストーリー（キャラクター）選択モード
(async () => {
  // 背景を管理する Background クラスのインスタンスを作る
  const background = new Background('#js-screen');
  // シナリオを管理する Writer クラスのインスタンスを作る
  const writer = new Writer();

  // キャラクター情報を読み込む
  const cast = await writer.casting('scenarios/cast.json');
  // シナリオを読み込む
  const scenarios = await writer.read([
    'scenarios/scenario-0.json',
    'scenarios/scenario-1.json',
    'scenarios/scenario-2.json',
    'scenarios/scenario-3.json'
  ]);

  // キャラクターの初期設定をする
  const actors = cast.map(({ name, path, acts }, id) => {
    const actor = new Actor(
      {
        id,
        selector: `#js-actor-container-${name}`,
      },
      {
        acts,
        path,
      }
    );
    return actor;
  });

  // キャラクターの画像を読み込む
  await Promise.all(
    actors.map((actor) => {
      return actor.load();
    })
  );

  const backgroundPath = scenarios
    // 読み込んだすべてのシナリオの cuts フィールドを取り出しす
    .map(({ cuts }) => cuts)
    // 一次元の配列に変換する
    .flat()
    // 配列から background フィールドだけを取り出す
    .map((cuts) => cuts.background)
    // background フィールドの値の配列から重複を取り除く
    .filter((value, index, self) => self.indexOf(value) === index);

  // 背景画像を読み込む
  await background.load(backgroundPath);

  // 全体進行を管理する Director クラスのインスタンスを作る
  const director = new Director(
    {
      scenarioBox: '#js-scenario_Box',
      nameBox: '#js-name_Box',
    },
    scenarios
  );

  const dialog = new Dialog('#nazo_dialog');
  const pocketwatch = new PocketWatch();
  const callsheet = new CallSheet('#select_dialog');

  // イベントリスナーを登録する（各インスタンスを紐づける）
  // セリフが切り替わり始めた時の処理
  director.ee.on('start', (e) => {
    actors.forEach((actor) => {
      actor.onStart(e);
    });
    background.onStart(e);
    callsheet.onStart(e);
  });

  director.ee.on('complete', (e) => {
    // // テキストが特定の条件を満たすかどうかを確認  "ここに書いたテキストに反応"
    // //キャラクタ―選択ダイアログを開くときに反応するテキスト
    // if (e.text.includes("次は")) {

    //   // ダイアログを開く
    //   callsheet.select_openDialog();

    //   pocketwatch.ee.on("readRFID", (e) =>{
    //     console.log(e)
    //     const sound = new Sound();
    //     if(e =="4b217b26e5e80"){
    //       console.log("スキャン完了 シナリオ2へ移動")
    //       director.jumpToAnotherScenario(2);
    //       callsheet.select_closeDialog();
    //     } else if(e =="421da9a6e5e81"){
    //       console.log("スキャン完了 シナリオ3へ移動")
    //       director.jumpToAnotherScenario(3);
    //       callsheet.select_closeDialog();
    //     }
    //   })

    //   pocketwatch.ee.off("readRFID", e);

    //   pocketwatch.ee.on("readAccel", (e) =>{
    //     console.log(e)
    //   })

    // }

    //謎ダイアログを開くときに反応するテキスト
    // if (e.text.includes(" ")) {

    //   // ダイアログを開く
    //   dialog.nazo_openDialog();

    //   pocketwatch.ee.on("readRFID", (e) =>{
    //     console.log(e)
    //     const sound = new Sound();
    //     if(e =="4b217b26e5e80"){
    //       console.log("スキャン完了 ")

    //       dialog.nazo_closeDialog();
    //     } else if(e =="421da9a6e5e81"){
    //       console.log("スキャン完了 ")

    //       dialog.nazo_closeDialog();
    //     }
    //   })

    //   pocketwatch.ee.on("readAccel", (e) =>{
    //     console.log(e)
    //   })

    //   // 別のシナリオに飛ばす処理を実行　Director.js下のほうに処理の記述ある
    //   //director.jumpToAnotherScenario();
    // }
  });

  pocketwatch.ee.on('readRFID', (e) => {
    callsheet.onReadRFID(e);
  });

  // callSheet のダイアログの開閉状態が変わった時の処理
  callsheet.ee.on('updateModal', (e) => {
    const isOpen = e.isOpen; // 開閉状態が真偽地で入っている

    director.updateLock(isOpen); // シナリオのロック状態を更新する
  });

  // callSheet のダイアログが開いているときに RFID が読み取られた時の処理
  callsheet.ee.on('select', (e) => {
    director.onSelect(e);
  });

  // dialog のダイアログの開閉状態が変わった時の処理
  dialog.ee.on('updateModal', (e) => {
    const isOpen = e.isOpen; // 開閉状態が真偽地で入っている

    director.updateLock(isOpen); // シナリオのロック状態を更新する
  });

  // pocketwatch.ee.on("readAccel", (e) =>{
  //   console.log(e)
  // })
})();