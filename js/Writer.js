/**
 * Writer
 */
class Writer {
  /**
   * constructor
   * Write クラスの初期設定を行います
   */
  constructor() {
    console.log('[Writer] constructor');

    /**
     * 読み込んだシナリオが追加される配列
     * @type {string[][][][]}
     */
    this.scenarios = [];
    this.cast = [];
  }

  /**
   * casting
   *  @param {string} path キャストの JSON ファイルまでのパスを表す文字列
   */
  async casting(path) {
    console.log('[Writer] casting');
    
    this.cast = await fetch(path)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.error(
          'There was a problem with the fetch operation: ' + error.message
        );
      });
    
    return this.cast;
  }

  /**
   * read
   *  @param {string[]} paths シナリオの JSON ファイルまでのパスを表す文字列の配列です
   */
  async read(paths) {
    console.log('[Writer] read');

    const promises = paths.map((path) =>
      fetch(path)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .catch((error) => {
          console.error(
            'There was a problem with the fetch operation: ' + error.message
          );
        })
    );

    this.scenarios = await Promise.all(promises);

    return this.scenarios;
  }
}
