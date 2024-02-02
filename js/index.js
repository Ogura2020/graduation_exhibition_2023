let tables = document.querySelectorAll(".chara_table_img");
var swiper = new Swiper(".swiper-main", {});

//使い方説明
var system_swiper = new Swiper(".system_swiper", {
    effect: "cards",
    grabCursor: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
});

//キャラプロフィール
tables.forEach((table, index) => {
    table.addEventListener('click', () => {
        swiper.slideTo(index)
    });
});
