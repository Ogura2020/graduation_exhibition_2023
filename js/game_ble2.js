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
    'scenarios/scenario-0.json'
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

  // イベントリスナーを登録する（各インスタンスを紐づける）
  // セリフが切り替わり始めた時の処理
  director.ee.on('start', (e) => {
    actors.forEach((actor) => {
      actor.onStart(e);
    });
    background.onStart(e);
    console.log(e)
  });

  const pocketwatch = new PocketWatch();
  
  //カードが読み込まれたときに以下のコードが実行されます。
  pocketwatch.ee.on("readRFID", (e) =>{
    console.log(e)
    const sound = new Sound();
    // dialog.showModal();
  })
  // pocketwatch.ee.on("readAccel", (e) =>{
  //   console.log(e)
  // })

  
  // const sound = new Sound();
  const dialog = new Dialog();
})();