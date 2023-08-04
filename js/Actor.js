// 参考: https://codepen.io/SitePoint/pen/zxXrzP

/**
 * isObject
 */
const isObject = function (o) {
    return (
      typeof o === 'object' &&
      o !== null &&
      o.constructor &&
      Object.prototype.toString.call(o).slice(8, -1) === 'Object'
    );
  }
  
  /**
   * isNode
   */
  const isNode = function (node) {
    if (
      typeof window !== 'undefined' &&
      typeof window.HTMLElement !== 'undefined'
    ) {
      return node instanceof HTMLElement;
    }
    return node && (node.nodeType === 1 || node.nodeType === 11);
  };
  
  /**
   * extend
   */
  const extend = function (...args) {
    const to = Object(args[0]);
    const noExtend = ['__proto__', 'constructor', 'prototype'];
    for (let i = 1; i < args.length; i += 1) {
      const nextSource = args[i];
      if (
        nextSource !== undefined &&
        nextSource !== null &&
        !isNode(nextSource)
      ) {
        const keysArray = Object.keys(Object(nextSource)).filter(
          (key) => noExtend.indexOf(key) < 0
        );
        for (
          let nextIndex = 0, len = keysArray.length;
          nextIndex < len;
          nextIndex += 1
        ) {
          const nextKey = keysArray[nextIndex];
          const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            if (isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
              if (nextSource[nextKey].__swiper__) {
                to[nextKey] = nextSource[nextKey];
              } else {
                extend(to[nextKey], nextSource[nextKey]);
              }
            } else if (!isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
              to[nextKey] = {};
              if (nextSource[nextKey].__swiper__) {
                to[nextKey] = nextSource[nextKey];
              } else {
                extend(to[nextKey], nextSource[nextKey]);
              }
            } else {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
    }
    return to;
  };
  
  /**
   * Actor
   */
  class Actor {
    /**
     * constructor
     * Actor クラスの初期設定を行います
     */
    constructor(keyData = { id: undefined, selector: undefined,  }, options = {}) {
      console.log('[Actor] constructor');
  
      const defaults = {
        path: '',
        sheets: {},
      };
  
      this.id = keyData.id;
      
      if (typeof this.id === 'undefined') {
        throw new Error('ID not found');
      }
      
      this.el = document.querySelector(keyData.selector);
  
      if (this.el === null) {
        throw new Error('Element not found');
      }
  
      this.options = extend(defaults, options);
  
      // スプライトシートを納める要素のスタイルを設定する
      this.el.style.position = 'absolute';
      this.el.style.bottom = '0';
  
      this.animation = undefined;
      this.loaded = false;
      this.acts = {};
      this.defaultPosition = {
        aligh: 'left',
        value: '0',
      };
    }
  
    /**
     * load
     *  @param {string[]}
     */
    async load() {
      console.log('[Actor] load');
  
      const { path, acts } = this.options;
  
      const promises = acts.map(({ id, frame, loop, scale, sheet }) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
  
          img.onload = () => {
            const container = document.createElement('div');
  
            container.style.display = 'none';
            container.style.aspectRatio = `${img.width / frame} / ${img.height}`;
            container.style.overflow = 'hidden';
  
            img.style.width = `${100 * frame}%`;
            img.style.verticalAlign = 'top';
  
            container.appendChild(img);
            this.el.appendChild(container);
  
            this.acts[id] = { container, frame, img, loop, scale };
            this.loaded = true;
  
            resolve();
          };
  
          img.onerror = () => {
            reject(new Error(`Failed to load image at path: ${path}`));
          };
  
          img.src = `${path}${sheet}`;
        });
      });
  
      return Promise.all(promises);
    }
  
    /**
     * onStart
     */
    onStart(e) {
      console.log('[Actor] onStart', e);
      
      const { actorIdsArray, act } = e;
      // このキャラクターの ID がシナリオの登場人物（actorIdsArray）に含まれていれば 0 以上の数値が入る
      const index = actorIdsArray.indexOf(this.id);
  
      // 画像の読み込みが終わっていなければ何もしない
      if (!this.loaded) {
        return;
      }
  
      // すでに設定されているアニメーションがあれば削除する
      if (this.animation) {
        this.animation.cancel();
      }
  
      for (let key in this.acts) {
        if (this.acts.hasOwnProperty(key)) {
          const { container } = this.acts[key];
          container.style.display = 'none';
        }
      }
  
      if (index > -1) {
        // 演技すべきキャラクターであれば act の内容に沿ってアニメーションを実行する
        const { id, position } = act[index];
        const { container, frame, img, loop, scale } = this.acts[id];
        const { aligh, value } = extend(this.defaultPosition, position);
  
        // 座標をリセット
        this.el.style.width = null;
        this.el.style.left = null;
        this.el.style.right = null;
  
        // img 要素を含んでいる要素を表示する
        container.style.display = 'block';
  
        // コマ数が 1 以上あればアニメーションを設定する
        if (frame > 1) {
          const offset = loop ? 0 : 100 / frame;
          const n = loop ? frame : frame - 1;
  
          this.el.style.width = `${100 * scale}%`;
          this.el.style[aligh] = `${100 * value}%`;
  
          this.animation = img.animate(
            [
              { transform: 'translateX(0%)' },
              { transform: `translateX(${-100 + offset}%)` },
            ],
            {
              duration: 250 * n,
              easing: `steps(${n}, end)`,
              fill: 'forwards',
              iterations: loop ? Infinity : 1,
            }
          );
        }
      }
    }
  }