# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

ブロックチェーンを検証する。

``` bash terminal
code blockchain.js
```

``` js blockchain.js
const Block = require("./block");
class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock(data) {
    const block = Block.mineBlock(this.chain[this.chain.length -1], data);

    this.chain.push(block);

    return block;
  }

  isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;
    
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i-1];

      if(block.lastHash !== lastBlock.hash || 
        block.hash !== Block.blockHash(block)) {
          return false;
      }
    }

    return true;
  }
}

module.exports = Blockchain;

```

``` bash terminal
code block.js
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

  static hash(timestamp, lastHash, data) {
    return SHA256(`${timestamp}${lastHash}${data}`).toString();
  }

  static blockHash(block) {
    const {timestamp, lastHash, data} = block;
    return Block.hash(timestamp, lastHash, data);
  }
}

module.exports = Block;


```

``` bash terminal
code blockchain.test.js
```

``` js blockchain.test.js
const Blockchain = require("./blockchain");
const Block = require("./block");

describe('Blockchain', () => {
  let bc,bc2;
  beforeEach( () => {
    bc = new Blockchain();
    bc2 = new Blockchain();
  });

  it('start genesis block', () => {
    expect(bc.chain[bc.chain.length - 1]).toEqual(Block.genesis());
  });

  it('add Block', () => {
    const data = "hoge";
    bc.addBlock(data);
    expect(bc.chain[bc.chain.length-1].data).toEqual(data);
  });

  it('validate a valid chain', () => {
    bc2.addBlock("hoge");

    expect(bc.isValidChain(bc2.chain)).toBe(true);
  });

  it('invalidate a chain with a corrupt genesis block', () => {
    bc2.chain[0].data = "Bad data";

    expect(bc.isValidChain(bc2.chain)).toBe(false);
  });

  it('invalidates a corrupt chain', () => {
    bc2.addBlock('foo');
    bc2.chain[1].data = 'Not foo';

    expect(bc.isValidChain(bc2.chain)).toBe(false);
  });
});
```

``` bash terminal
npm run test
```

``` bash terminal result
 PASS  ./blockchain.test.js
 PASS  ./block.test.js

Test Suites: 2 passed, 2 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        1.874s, estimated 2s
Ran all test suites.

Watch Usage: Press w to show more.
```

## 補足解説

今回はブロックチェーンの検証を取り扱いました。

ブロックチェーンは、一度追加されると、
過去のブロックは改編できないようにしています。

過去のブロックを改編すると、
ハッシュ値が変更されることになり、
次のブロックで保存しておいた、一つ前の
ハッシュ値と異なる値となって、不整合が起こります。

このようにして、ブロックチェーンでは、
データの信頼性を担保することができます。

このレッスンは以上になります。

お疲れ様でした。
