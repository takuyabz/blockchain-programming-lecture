# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

それでは最小限のブロックチェーンに
変更を加えていきます。

最初のブロックを構築するプログラムを
作っていきましょう。

``` bash terminal
code block.js
```

``` js block.js
class Block {
  constructor(timestamp, lastHash, hash, data) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  toString() {
    return `Block
      Timestamp : ${this.timestamp}
      lastHash  : ${this.lastHash.substring(0,10)}
      hash      : ${this.hash.substring(0,10)}
      data      : ${this.data}`;
  }

  static genesis() {
    return new this("timestamp", "----", "h4r0-h123", []);
  }
}

module.exports = Block;
```

``` bash terminal
code dev-test.js
```

``` js dev-test.js
const Block = require("./block");
const block = new Block("sato", "suzuki", "yamada", "kitagawa");
console.log(block.toString());
console.log(Block.genesis().toString());
```

``` bash terminal 
npm run dev-test
```

``` bash terminal result
 >npm run dev-test

> lesson002@1.0.0 dev-test /Users/tech/dev/lectures/20190613/t2/lesson003
> nodemon dev-test

[nodemon] 1.19.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node dev-test.js`
Block
      Timestamp : sato
      lastHash  : suzuki
      hash      : yamada
      data      : kitagawa
Block
      Timestamp : timestamp
      lastHash  : ----
      hash      : h4r0-h123
      data      : 
[nodemon] clean exit - waiting for changes before restart
```

## 補足解説

ブロックチェーンは、ブロックの繋げて
データを表現していくテクノロジーです。

最初のブロックの生成の仕方を今回学んでいただきました。

次回からは、ブロックの信頼性を評価する
マイニング処理の最小プログラムを構築していきます。

このレッスンは以上になります。

お疲れ様でした。


