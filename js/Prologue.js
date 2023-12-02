// 対象の要素を取得
const start = document.querySelector("#js-start");
//const js_start = document.querySelector("#js-start");
const js_prologue = document.querySelector("#js-prologue");

start.addEventListener("click", (e) => {
  console.log("スタートボタンが押されました")
  gsap.to(
    '#js-start',
   {
     duration:1,
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
      autoAlpha: 1, // アニメーション後は出現(透過率0)
      //y: 0, // 20px上に移動
      stagger: 5, // 3秒遅れて順番に再生
      
      onComplete: () => {
        gsap.to(
          ".prologue",
          {
            duration:5,
            autoAlpha: 0,
          }
        )
      },
    }
  );
});