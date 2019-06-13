# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

Proof of Works

``` bash terminal
 code blockchain/block.js
```

``` js blockchain/block.js

const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY } = require('../config');

class Block {
  constructor(timestamp, lastHash, hash, data, nonce) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
  }

  toString() {
    return `Block
      Timestamp : ${this.timestamp}
      lastHash  : ${this.lastHash.substring(0,10)}
      hash      : ${this.hash.substring(0,10)}
      nonce     : ${this.nonce}
      data      : ${this.data}`;
  }

  static genesis() {
    return new this("timestamp", "----", "h4r0-h123", [], 0);
  }

  static mineBlock(lastBlock, data) {
    const lastHash = lastBlock.hash;
    let timestamp, hash;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      hash = Block.hash(timestamp, lastHash, data, nonce);
    } while (hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY))

    return new Block(timestamp, lastHash, hash, data, nonce);
  }

  static hash(timestamp, lastHash, data, nonce) {
    return SHA256(`${timestamp}${lastHash}${data}${nonce}`).toString();
  }

  static blockHash(block) {
    const {timestamp, lastHash, data, nonce } = block;
    return Block.hash(timestamp, lastHash, data, nonce);
  }
}

module.exports = Block;
```

``` bash terminal
code config.js
```

``` js config.js
const DIFFICULTY = 4;

module.exports = {DIFFICULTY};
```

``` bash terminal
code blockchain/block.js
```

``` js blockchain/block.js
const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY } = require('../config');
```

``` bash terminal
code blockchain/block.test.js
```

``` js blockchain/block.test.js
const Block = require('./block');
const { DIFFICULTY } = require('../config');

describe('Block', () => {

  let data, lastblock, block;

  beforeEach(()=>{
    data = "sato";
    lastblock = Block.genesis();
    block = Block.mineBlock(lastblock, data);
    // block = Block.mineBlock(lastblock, "yamada");
  });
  it('data test', ()=> {
    expect(block.data).toEqual(data);
  });

  it('hash test', () => {
    expect(block.lastHash).toEqual(lastblock.hash);
    // expect(block.lastHash).toEqual("suzuki");
  });

  it('指定難易度のハッシュ値生成テスト', () => {
    expect(block.hash.substring(0,DIFFICULTY)).toEqual('0'.repeat(DIFFICULTY));
    console.log(block.toString());
  })
});


```

``` bash terminal
npm run test
```

``` bash terminal result
 PASS  blockchain/block.test.js
  ● Console

    console.log blockchain/block.test.js:25
      Block
            Timestamp : 1560389022859
            lastHash  : h4r0-h123
            hash      : 0000c0eebc
            nonce     : 3254
            data      : sato

 PASS  blockchain/index.test.js
  ● Console

    console.log blockchain/index.js:41
      最新ブロックチェーンデータに更新します
    console.log blockchain/index.js:34
      ブロック数不足のため省略します


Test Suites: 2 passed, 2 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        3.486s
Ran all test suites.

Watch Usage
 › Press f to run only failed tests.
 › Press o to only run tests related to changed files.
 › Press p to filter by a filename regex pattern.
 › Press t to filter by a test name regex pattern.
 › Press q to quit watch mode.
 › Press Enter to trigger a test run.

```

## 補足解説

今回は、Proof of Workを取り扱いました。

Proof of Workとは、ざっくりいうと、
Dos攻撃やネットワーク上のスパムなど、
サービスの濫用を防止する手段です。

答えを導き出すことができる、
一定の計算処理をさせています。

今回は、時間とカウンタを組み合わせて、
hashの値が指定した先頭の桁数がゼロになる
値になるまで計算を繰り返すという処理を
要求するプログラムにしています。

このレッスンは以上になります。

お疲れ様でした。
