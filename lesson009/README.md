# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

ブロックチェーンを更新する。

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

  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      console.log("ブロック数不足のため省略します");
      return;
    } else if (!this.isValidChain(newChain)) {
      console.log("ブロックチェーンデータ不備のため省略します");
      return;
    }

    console.log("最新ブロックチェーンデータに更新します");
    this.chain = newChain;
  }
}

module.exports = Blockchain;

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

  it('ブロックチェーン更新テスト', () => {
    bc2.addBlock("fuga");
    bc.replaceChain(bc2.chain);

    expect(bc.chain).toEqual(bc2.chain);
  });

  it('ブロックチェーン更新省略テスト', () => {
    bc.addBlock("fuda");
    bc.replaceChain(bc2.chain);

    expect(bc.chain).not.toEqual(bc2.chain);
  });
});
```

``` bash terminal
npm run test
```

``` bash terminal result
 PASS  ./block.test.js
 PASS  ./blockchain.test.js
  ● Console

    console.log blockchain.js:41
      最新ブロックチェーンデータに更新します
    console.log blockchain.js:34
      ブロック数不足のため省略します


Test Suites: 2 passed, 2 total
Tests:       9 passed, 9 total
Snapshots:   0 total
Time:        1.543s
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

今回はブロックチェーンのリプレイスについて取り扱いました。

ブロックチェーンは分散型台帳をいうコンセプトを
採用しています。

これは、中央集権的にデータベースを一箇所で
管理するのではなく、マスターデータをいろんな人が
持って、最新のマスターデータを関係者で持っておくことで
データの信頼性を保証するというコンセプトです。

そこで必要になるので、みんなが持ってる
マスターデータの更新になります。

ブロックチェーンを置き換える時に、
データの不整合が起きていないか、
最新のブロックチェーンであるかをチェックする
必要があります。

最新のブロックチェーンであるかをチェックするには、
ブロック数が一番多いブロックチェーンであることを
確認して実現します。

今回は、分散型台帳を取り扱うための
土台となる、ブロックチェーンの更新について
取り扱えるようになりました。

このレッスンは以上になります。

お疲れ様でした。
