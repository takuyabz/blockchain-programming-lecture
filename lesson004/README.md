# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

マイニングについて今回は取り扱っていきましょう。

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

  static mineBlock(lastBlock, data) {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const hash ="fixme-hash";

    return new Block(timestamp,lastHash,hash,data);
  }
}

module.exports = Block;
```

``` bash terminal
code dev-test.js
```

``` js dev-test.js
const Block = require("./block");
const fooBlock = Block.mineBlock(Block.genesis(), "hoge");
console.log(fooBlock.toString());
```

``` bash terminal 
npm run dev-test
```

``` bash terminal result
 fixer: ~/dev/lectures/20190613/t2/lesson004 [git:master] 
🌏 >npm run dev-test

> lesson002@1.0.0 dev-test /Users/tech/dev/lectures/20190613/t2/lesson004
> nodemon dev-test

[nodemon] 1.19.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node dev-test.js`
Block
      Timestamp : 1560377220394
      lastHash  : h4r0-h123
      hash      : fixme-hash
      data      : hoge
[nodemon] clean exit - waiting for changes before restart
```

## 補足解説

今回はマイニングといっても、
ブロックチェーンを表現するために、
一つ前のブロックのハッシュ値を、
生成するブロックに保存するという処理を実装しました。

今回は最初のブロック(genesis)に`hoge`という
データが格納されたブロックを繋げるマイン処理
を実装してテストしたことになります。

これで、最小限のブロック、ブロックチェーン、
マイニングの流れを習得していただけた状態になります。

このレッスンは以上になります。

お疲れ様でした。


