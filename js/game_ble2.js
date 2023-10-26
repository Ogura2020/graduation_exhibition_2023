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
    'scenarios/scenario-3.json',
    'scenarios/scenario-4.json',
    'scenarios/scenario-5.json',
    'scenarios/scenario-6.json',
    'scenarios/scenario-7.json',
    'scenarios/scenario-8.json',
    'scenarios/scenario-9.json',
    'scenarios/scenario-10.json',
    'scenarios/scenario-11.json',
    'scenarios/scenario-12.json',
    'scenarios/scenario-13.json'
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
  const mystery2 = new Mystery2('#nazo_dialog');
  const mystery3 = new Mystery3('#nazo_dialog');
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
    dialog.onStart(e);
    mystery2.onStart(e);
    mystery3.onStart(e);
  });

  director.ee.on('complete', (e) => {
    //   // 別のシナリオに飛ばす処理を実行　Director.js下のほうに処理の記述ある
    //   //director.jumpToAnotherScenario();
  });

  pocketwatch.ee.on('readRFID', (e) => {
    callsheet.onReadRFID(e);
    dialog.onReadRFID(e);
    mystery2.onReadRFID(e);
    mystery3.onReadRFID(e);
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

  // dialog のダイアログが開いているときに RFID が読み取られた時の処理
  dialog.ee.on('select', (e) => {
    //director.onSelect(e);
  });

  // mystery2 のダイアログの開閉状態が変わった時の処理
  mystery2.ee.on('updateModal', (e) => {
    const isOpen = e.isOpen; // 開閉状態が真偽地で入っている

    director.updateLock(isOpen); // シナリオのロック状態を更新する
  });

  // mystery2 のダイアログが開いているときに RFID が読み取られた時の処理
  mystery2.ee.on('select', (e) => {
    //director.onSelect(e);
  });

  // mystery3 のダイアログの開閉状態が変わった時の処理
  mystery3.ee.on('updateModal', (e) => {
    const isOpen = e.isOpen; // 開閉状態が真偽地で入っている

    director.updateLock(isOpen); // シナリオのロック状態を更新する
  });

  // mystery3 のダイアログが開いているときに RFID が読み取られた時の処理
  mystery3.ee.on('select', (e) => {
    //director.onSelect(e);
  });

  // pocketwatch.ee.on("readAccel", (e) =>{
  //   console.log(e)
  // })
})();