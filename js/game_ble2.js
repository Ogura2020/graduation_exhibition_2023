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
    'scenarios/scenario-13.json',
    'scenarios/scenario-14.json',
    'scenarios/scenario-15.json'
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

  $(".menu_btn").click(function () {//ボタンがクリックされたら
    console.log("ok")
    $(".menu_btn").toggleClass('is-active');//ナビゲーションにis-activeクラスを付与
    $(".menu_nav").toggleClass('is-active');//ナビゲーションにis-activeクラスを付与
  });

  const tutorial = new Tutorial('#nazo_dialog');
  const dialog = new Dialog('#nazo_dialog');
  const mystery1 = new Mystery1('#nazo_dialog');
  const mystery2 = new Mystery2('#nazo_dialog');
  const mystery3 = new Mystery3('#nazo_dialog');
  const mystery4 = new Mystery4('#nazo_dialog');
  const mystery5 = new Mystery5('#nazo_dialog');
  const mystery6 = new Mystery6('#nazo_dialog');
  const mystery7 = new Mystery7('#nazo_dialog');
  const mystery8 = new Mystery8('#nazo_dialog');
  const mystery9 = new Mystery9('#nazo_dialog');
  const mystery10 = new Mystery10('#nazo_dialog');
  const mystery11 = new Mystery11('#nazo_dialog');
  const mystery12 = new Mystery12('#nazo_dialog');
  const pocketwatch = new PocketWatch();
  const backlog = new Backlog();
  const callsheet1 = new CallSheet1('#select_dialog1');
  const callsheet2 = new CallSheet2('#select_dialog2');
  const callsheet3 = new CallSheet3('#select_dialog3');
  const sound = new Sound();

  //タイトルBGM
  sound.title.play();

  // イベントリスナーを登録する（各インスタンスを紐づける）
  // セリフが切り替わり始めた時の処理
  director.ee.on('start', (e) => {
    backlog.onStart(e)
    actors.forEach((actor) => {
      actor.onStart(e);
    });
    background.onStart(e);
    callsheet1.onStart(e);
    callsheet2.onStart(e);
    callsheet3.onStart(e);
    tutorial.onStart(e);
    dialog.onStart(e);
    mystery1.onStart(e);
    mystery2.onStart(e);
    mystery3.onStart(e);
    mystery4.onStart(e);
    mystery5.onStart(e);
    mystery6.onStart(e);
    mystery7.onStart(e);
    mystery8.onStart(e);
    mystery9.onStart(e);
    mystery10.onStart(e);
    mystery11.onStart(e);
    mystery12.onStart(e);
  });

  director.ee.on('complete', (e) => {
    //   // 別のシナリオに飛ばす処理を実行　Director.js下のほうに処理の記述ある
    //   //director.jumpToAnotherScenario();
  });

  // // //スタート画面とプロローグのアニメーション
  pocketwatch.ee.on('Connect', (e) => {
      console.log("スタートボタンが押されました")
      gsap.to(
        '#js-start',
       {
         duration:0.5,  //〇秒間かけて
         autoAlpha: 0,
       }
      )
      gsap.fromTo(
        ".prologue_text", // アニメーションさせる要素
        {
          autoAlpha: 0, // アニメーション開始前は透明
          //y: 30, // 20px下に移動
        },
        {
          duration:1.5,
          autoAlpha: 1, // アニメーション後は出現(透過率0)
          //y: 0, // 20px上に移動
          stagger: 3.5, // 4秒遅れて順番に再生 出てくる速さ
          ease: "power2.out",
          
          onComplete: () => {
            gsap.to(
              ".prologue",
              {
                duration: 4,
                autoAlpha: 0,
              }
            )
            sound.title.stop();
            sound.everyday.play();
            //sound.thinking.fade(0, 1, 5000);
          },
        }
      );
  });

  let yakataPlayed = false;

  director.ee.on('bgm', (sinairo , cut) => {
    console.log(sinairo, cut)
    if(!yakataPlayed && sinairo ==0 && cut === 164){
      sound.everyday.stop();
      sound.yakata.play();
      yakataPlayed = true;
    } else if (!yakataPlayed && sinairo ==0 && cut === 204){
      sound.everyday.stop();
      sound.yakata.play();
    }

    if(sinairo ==0 && cut === 6){
      sound.knock.play();
    } else if (sinairo ==0 && cut === 9){
      sound.knock.play();
    } else if (sinairo ==0 && cut === 12){
      sound.door.play();
    }
  });

  pocketwatch.ee.on('readRFID', (e) => {
    callsheet1.onReadRFID(e);
    callsheet2.onReadRFID(e);
    callsheet3.onReadRFID(e);
    tutorial.onReadRFID(e);
    dialog.onReadRFID(e);
    mystery1.onReadRFID(e);
    mystery2.onReadRFID(e);
    mystery3.onReadRFID(e);
    mystery4.onReadRFID(e);
    mystery5.onReadRFID(e);
    mystery6.onReadRFID(e);
    mystery7.onReadRFID(e);
    mystery8.onReadRFID(e);
    mystery9.onReadRFID(e);
    mystery10.onReadRFID(e);
    mystery11.onReadRFID(e);
    mystery12.onReadRFID(e);
  });

  pocketwatch.ee.on('readAccel', (e) => {
    tutorial.onReadAccel(e);
    dialog.onReadAccel(e);
    mystery1.onReadAccel(e);
    mystery2.onReadAccel(e);
    mystery3.onReadAccel(e);
    mystery4.onReadAccel(e);
    mystery5.onReadAccel(e);
    mystery6.onReadAccel(e);
    mystery7.onReadAccel(e);
    mystery8.onReadAccel(e);
    mystery9.onReadAccel(e);
    mystery10.onReadAccel(e);
    mystery11.onReadAccel(e);
    mystery12.onReadAccel(e);
  });

  // callSheet のダイアログの開閉状態が変わった時の処理
  callsheet1.ee.on('updateModal', (e) => {
    const isOpen = e.isOpen; // 開閉状態が真偽地で入っている
    director.updateLock(isOpen); // シナリオのロック状態を更新する
    pocketwatch.setDialogOpenStatus(isOpen)
  });

  // callSheet のダイアログが開いているときに RFID が読み取られた時の処理
  callsheet1.ee.on('select', (e) => {
    director.onSelect(e);
  });

  // callSheet2 のダイアログの開閉状態が変わった時の処理
  callsheet2.ee.on('updateModal', (e) => {
    const isOpen = e.isOpen; // 開閉状態が真偽地で入っている
    director.updateLock(isOpen); // シナリオのロック状態を更新する
    pocketwatch.setDialogOpenStatus(isOpen)
  });
  
  // callSheet2 のダイアログが開いているときに RFID が読み取られた時の処理
  callsheet2.ee.on('select', (e) => {
    director.onSelect(e);
  });

    // callSheet3 のダイアログの開閉状態が変わった時の処理
    callsheet3.ee.on('updateModal', (e) => {
      const isOpen = e.isOpen; // 開閉状態が真偽地で入っている
      director.updateLock(isOpen); // シナリオのロック状態を更新する
      pocketwatch.setDialogOpenStatus(isOpen)
    });
    
    // callSheet3 のダイアログが開いているときに RFID が読み取られた時の処理
    callsheet3.ee.on('select', (e) => {
      director.onSelect(e);
    });

  // tutorial のダイアログの開閉状態が変わった時の処理
  tutorial.ee.on('updateModal', (e) => {
    const isOpen = e.isOpen; // 開閉状態が真偽地で入っている
    director.updateLock(isOpen); // シナリオのロック状態を更新する
    pocketwatch.setDialogOpenStatus(isOpen)
    if(e.isOpen){
      sound.everyday.fade(1, 0, 1000);
    }else {
      sound.everyday.fade(0, 1, 1000);
    }
  });

  // tutorial のダイアログが開いているときに RFID が読み取られた時の処理
  tutorial.ee.on('select', (e) => {
    
  });

  // dialog のダイアログの開閉状態が変わった時の処理
  dialog.ee.on('updateModal', (e) => {
    const isOpen = e.isOpen; // 開閉状態が真偽地で入っている
    director.updateLock(isOpen); // シナリオのロック状態を更新する
    pocketwatch.setDialogOpenStatus(isOpen)
    if(e.isOpen){
      sound.everyday.fade(1, 0, 1000);
    }else {
      sound.everyday.fade(0, 1, 1000);
    }
  });

  // dialog のダイアログが開いているときに RFID が読み取られた時の処理
  dialog.ee.on('select', (e) => {

  });
  
  // mystery1 のダイアログの開閉状態が変わった時の処理
  mystery1.ee.on('updateModal', (e) => {
    const isOpen = e.isOpen; // 開閉状態が真偽地で入っている
    director.updateLock(isOpen); // シナリオのロック状態を更新する
    pocketwatch.setDialogOpenStatus(isOpen)
    if(e.isOpen){
      sound.yakata.fade(1, 0, 1000);
    }else {
      sound.yakata.fade(0, 1, 1000);
    }
  });

  // mystery1 のダイアログが開いているときに RFID が読み取られた時の処理
  mystery1.ee.on('select', (e) => {

  });

  // mystery2 のダイアログの開閉状態が変わった時の処理
  mystery2.ee.on('updateModal', (e) => {
    const isOpen = e.isOpen; // 開閉状態が真偽地で入っている
    director.updateLock(isOpen); // シナリオのロック状態を更新する
    pocketwatch.setDialogOpenStatus(isOpen)
    if(e.isOpen){
      sound.yakata.fade(1, 0, 1000);
    }else {
      sound.yakata.fade(0, 1, 1000);
    }
  });

  // mystery2 のダイアログが開いているときに RFID が読み取られた時の処理
  mystery2.ee.on('select', (e) => {
    
  });

  // mystery3 のダイアログの開閉状態が変わった時の処理
  mystery3.ee.on('updateModal', (e) => {
    const isOpen = e.isOpen; // 開閉状態が真偽地で入っている
    director.updateLock(isOpen); // シナリオのロック状態を更新する
    pocketwatch.setDialogOpenStatus(isOpen)
    if(e.isOpen){
      sound.yakata.fade(1, 0, 1000);
    }else {
      sound.yakata.fade(0, 1, 1000);
    }
  });

  // mystery3 のダイアログが開いているときに RFID が読み取られた時の処理
  mystery3.ee.on('select', (e) => {
    
  });

  // mystery4 のダイアログの開閉状態が変わった時の処理
  mystery4.ee.on('updateModal', (e) => {
    const isOpen = e.isOpen; // 開閉状態が真偽地で入っている
    director.updateLock(isOpen); // シナリオのロック状態を更新する
    pocketwatch.setDialogOpenStatus(isOpen)
    if(e.isOpen){
      sound.yakata.fade(1, 0, 1000);
    }else {
      sound.yakata.fade(0, 1, 1000);
    }
  });

  // mystery4 のダイアログが開いているときに RFID が読み取られた時の処理
  mystery4.ee.on('select', (e) => {

  });

  // mystery5 のダイアログの開閉状態が変わった時の処理
  mystery5.ee.on('updateModal', (e) => {
    const isOpen = e.isOpen; // 開閉状態が真偽地で入っている
    director.updateLock(isOpen); // シナリオのロック状態を更新する
    pocketwatch.setDialogOpenStatus(isOpen)
    if(e.isOpen){
      sound.yakata.fade(1, 0, 1000);
    }else {
      sound.yakata.fade(0, 1, 1000);
    }
  });

  // mystery5 のダイアログが開いているときに RFID が読み取られた時の処理
  mystery5.ee.on('select', (e) => {

  });

  // mystery6 のダイアログの開閉状態が変わった時の処理
  mystery6.ee.on('updateModal', (e) => {
    const isOpen = e.isOpen; // 開閉状態が真偽地で入っている
    director.updateLock(isOpen); // シナリオのロック状態を更新する
    pocketwatch.setDialogOpenStatus(isOpen)
    if(e.isOpen){
      sound.yakata.fade(1, 0, 1000);
    }else {
      sound.yakata.fade(0, 1, 1000);
    }
  });

  // mystery6 のダイアログが開いているときに RFID が読み取られた時の処理
  mystery6.ee.on('select', (e) => {

  });

  // mystery7 のダイアログの開閉状態が変わった時の処理
  mystery7.ee.on('updateModal', (e) => {
    const isOpen = e.isOpen; // 開閉状態が真偽地で入っている
    director.updateLock(isOpen); // シナリオのロック状態を更新する
    pocketwatch.setDialogOpenStatus(isOpen)
    if(e.isOpen){
      sound.yakata.fade(1, 0, 1000);
    }else {
      sound.yakata.fade(0, 1, 1000);
    }
  });

  // mystery7 のダイアログが開いているときに RFID が読み取られた時の処理
  mystery7.ee.on('select', (e) => {

  });

  // mystery8 のダイアログの開閉状態が変わった時の処理
  mystery8.ee.on('updateModal', (e) => {
    const isOpen = e.isOpen; // 開閉状態が真偽地で入っている
    director.updateLock(isOpen); // シナリオのロック状態を更新する
    pocketwatch.setDialogOpenStatus(isOpen)
    if(e.isOpen){
      sound.yakata.fade(1, 0, 1000);
    }else {
      sound.yakata.fade(0, 1, 1000);
    }
  });

  // mystery8 のダイアログが開いているときに RFID が読み取られた時の処理
  mystery8.ee.on('select', (e) => {

  });

  // mystery9 のダイアログの開閉状態が変わった時の処理
  mystery9.ee.on('updateModal', (e) => {
    const isOpen = e.isOpen; // 開閉状態が真偽地で入っている
    director.updateLock(isOpen); // シナリオのロック状態を更新する
    pocketwatch.setDialogOpenStatus(isOpen)
    if(e.isOpen){
      sound.yakata.fade(1, 0, 1000);
    }else {
      sound.yakata.fade(0, 1, 1000);
    }
  });

  // mystery9 のダイアログが開いているときに RFID が読み取られた時の処理
  mystery9.ee.on('select', (e) => {

  });

  // mystery10 のダイアログの開閉状態が変わった時の処理
  mystery10.ee.on('updateModal', (e) => {
    const isOpen = e.isOpen; // 開閉状態が真偽地で入っている
    director.updateLock(isOpen); // シナリオのロック状態を更新する
    pocketwatch.setDialogOpenStatus(isOpen)
    if(e.isOpen){
      sound.yakata.fade(1, 0, 1000);
    }else {
      sound.yakata.fade(0, 1, 1000);
    }
  });

  // mystery10 のダイアログが開いているときに RFID が読み取られた時の処理
  mystery10.ee.on('select', (e) => {

  });

  // mystery10 のダイアログの開閉状態が変わった時の処理
  mystery11.ee.on('updateModal', (e) => {
    const isOpen = e.isOpen; // 開閉状態が真偽地で入っている
    director.updateLock(isOpen); // シナリオのロック状態を更新する
    pocketwatch.setDialogOpenStatus(isOpen)
    if(e.isOpen){
      sound.yakata.fade(1, 0, 1000);
    }else {
      sound.yakata.fade(0, 1, 1000);
    }
  });

  // mystery10 のダイアログが開いているときに RFID が読み取られた時の処理
  mystery11.ee.on('select', (e) => {

  });

  // mystery12 のダイアログの開閉状態が変わった時の処理
  mystery12.ee.on('updateModal', (e) => {
    const isOpen = e.isOpen; // 開閉状態が真偽地で入っている
    director.updateLock(isOpen); // シナリオのロック状態を更新する
    pocketwatch.setDialogOpenStatus(isOpen)
    if(e.isOpen){
      sound.yakata.fade(1, 0, 1000);
    }else {
      sound.yakata.fade(0, 1, 1000);
    }
  });

  // mystery12 のダイアログが開いているときに RFID が読み取られた時の処理
  mystery12.ee.on('select', (e) => {
    
  });
})();