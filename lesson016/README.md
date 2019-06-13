# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

Dynamic Proof of Works

``` bash terminal
code config.js
```

``` js config.js
const DIFFICULTY = 4;
const MINE_RATE = 3000;

module.exports = {DIFFICULTY, MINE_RATE};

```

``` js blockchain/block.js

const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY, MINE_RATE } = require('../config');

class Block {
  constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  toString() {
    return `Block
      Timestamp : ${this.timestamp}
      lastHash  : ${this.lastHash.substring(0,10)}
      hash      : ${this.hash.substring(0,10)}
      nonce     : ${this.nonce}
      difficulty: ${this.difficulty}
      data      : ${this.data}`;
  }

  static genesis() {
    return new this("timestamp", "----", "h4r0-h123", [], 0, DIFFICULTY);
  }

  static mineBlock(lastBlock, data) {
    const lastHash = lastBlock.hash;
    let { difficulty } = lastBlock;
    let timestamp, hash;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = this.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty))

    return new Block(timestamp, lastHash, hash, data, nonce, difficulty);
  }

  static hash(timestamp, lastHash, data, nonce, difficulty) {
    return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
  }

  static blockHash(block) {
    const {timestamp, lastHash, data, nonce, difficulty } = block;
    return Block.hash(timestamp, lastHash, data, nonce, difficulty);
  }

  static adjustDifficulty(lastBlock, currentTime) {
    let { difficulty } = lastBlock;
    difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
    return difficulty;
  }
}

module.exports = Block;
```

``` bash terminal
code blockchain/block.test.js
```

``` js blockchain/block.test.js
const Block = require('./block');

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
    expect(block.hash.substring(0,block.difficulty)).toEqual('0'.repeat(block.difficulty));
    console.log(block.toString());
  })

  it('低速ブロック採掘で難易度を下げるテスト', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 3600000)).toEqual(block.difficulty-1);
  })

  it('高速ブロック採掘で難易度を上げるテスト', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(block.difficulty+1);
  })
});


```

``` bash terminal
npm run test
```

``` bash terminal result
 PASS  blockchain/block.test.js
  ● Console

    console.log blockchain/block.test.js:24
      Block
            Timestamp : 1560391888898
            lastHash  : h4r0-h123
            hash      : 000ec93368
            nonce     : 4830
            difficulty: 3
            data      : sato

 PASS  blockchain/index.test.js
  ● Console

    console.log blockchain/index.js:41
      最新ブロックチェーンデータに更新します
    console.log blockchain/index.js:34
      ブロック数不足のため省略します


Test Suites: 2 passed, 2 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        3.899s
Ran all test suites.

Watch Usage
 › Press f to run only failed tests.
 › Press o to only run tests related to changed files.
 › Press p to filter by a filename regex pattern.
 › Press t to filter by a test name regex pattern.
 › Press q to quit watch mode.
 › Press Enter to trigger a test run.

```

``` bash terminal
code dev-test.js
```

``` js dev-test.js
const Blockchain = require('./blockchain');

const bc = new Blockchain();

for ( let i = 0; i < 10; i++) {
  console.log(bc.addBlock(`hello ${i}`).toString());
}

```

``` bash terminal
npm run dev-test
```

``` bash terminal result
fixer: ~/dev/lectures/20190613/t2/lesson016 [git:master] 
🌏 >npm run dev-test

> lesson002@1.0.0 dev-test /Users/tech/dev/lectures/20190613/t2/lesson016
> nodemon dev-test

[nodemon] 1.19.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node dev-test.js`
Block
      Timestamp : 1560392202768
      lastHash  : h4r0-h123
      hash      : 0004d3176f
      nonce     : 14589
      difficulty: 3
      data      : hello 0
Block
      Timestamp : 1560392203083
      lastHash  : 0004d3176f
      hash      : 0000d53a44
      nonce     : 27876
      difficulty: 4
      data      : hello 1
Block
      Timestamp : 1560392206114
      lastHash  : 0000d53a44
      hash      : 000a139309
      nonce     : 283225
      difficulty: 3
      data      : hello 2
Block
      Timestamp : 1560392206378
      lastHash  : 000a139309
      hash      : 0000a44b3f
      nonce     : 26705
      difficulty: 4
      data      : hello 3
Block
      Timestamp : 1560392206883
      lastHash  : 0000a44b3f
      hash      : 00000dc4cd
      nonce     : 54512
      difficulty: 5
      data      : hello 4
Block
      Timestamp : 1560392211126
      lastHash  : 00000dc4cd
      hash      : 0000c9efc4
      nonce     : 437393
      difficulty: 4
      data      : hello 5
Block
      Timestamp : 1560392211309
      lastHash  : 0000c9efc4
      hash      : 0000090881
      nonce     : 19495
      difficulty: 5
      data      : hello 6
Block
      Timestamp : 1560392215955
      lastHash  : 0000090881
      hash      : 00005e3f23
      nonce     : 476953
      difficulty: 4
      data      : hello 7
Block
      Timestamp : 1560392218860
      lastHash  : 00005e3f23
      hash      : 00000617f9
      nonce     : 305645
      difficulty: 5
      data      : hello 8
Block
      Timestamp : 1560392222285
      lastHash  : 00000617f9
      hash      : 000004d138
      nonce     : 366730
      difficulty: 4
      data      : hello 9
[nodemon] clean exit - waiting for changes before restart
```

## 補足解説

今回は、動的採掘難易度の最適化を取り扱いました。

ブロックのデータ構造が複雑になったりしてくると、
ハッシュ値の計算に時間がかかったりします。

システムが自動的に採掘難易度を最適化する
仕組みを導入することで、マイニング処理に
時間がかかりすぎるといったことを防ぐことが
できるようになります。

このレッスンは以上になります。

お疲れ様でした。
