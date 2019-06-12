# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

ブロックハッシュの生成

``` bash terminal
npm i crypto-js
```

``` js block.js
const SHA256 = require('crypto-js/sha256');

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
    const hash = Block.hash(timestamp, lastHash, data);

    return new Block(timestamp,lastHash,hash,data);
  }

  static hash(timestmap, lastHash, data) {
    return SHA256(`${timestamp}${lastHash}${data}`).toString();
  }
}

module.exports = Block;
```

``` bash terminal 
npm run dev-test
```

``` bash terminal result
 fixer: ~/dev/lectures/20190613/t2/lesson005 [git:master] 
🌏 >npm run dev-test

> lesson002@1.0.0 dev-test /Users/tech/dev/lectures/20190613/t2/lesson005
> nodemon dev-test

[nodemon] 1.19.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node dev-test.js`
Block
      Timestamp : 1560377884330
      lastHash  : h4r0-h123
      hash      : 9e36d310d8
      data      : hoge
[nodemon] clean exit - waiting for changes before restart
```

## 補足解説

ブロックチェーンでは、ハッシュ値を使って、
ブロックを識別します。

ハッシュ値を例えていうと、サマリー、要するに何々
みたいなイメージです。

例えば、私、佐藤卓也と申します、生まれは１９８３年で
千葉県で生まれました、東京高専を卒業してまして、
２０年以上エンジニアのキャリアを重ねてきました。

みたいな自己紹介をされたとして、
要するにあの人は何々、例えば技術に詳しい人。

ここでいう技術に詳しい人がハッシュ値です。

かなり飛躍した例え話になりましたが、
コンピュータの世界でもこれと同じようなことを
していくことができるのがハッシュの生成です。

コンピュータでハッシュを生成する際には
色々なやり方があるのですが、今回はSHA256という
アルゴリズムを使って、生成する方法を採用しました。

これで、ブロックの内容は色々あるけど、
このブロックは要するにこのハッシュ、といった形で
ブロックを識別できるようになりました。

このレッスンは以上になります。

お疲れ様でした。


