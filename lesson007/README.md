# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

ブロックチェーンを実装する。

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
  let bc;
  beforeEach( () => {
    bc = new Blockchain();

  });

  it('start genesis block', () => {
    expect(bc.chain[bc.chain.length - 1]).toEqual(Block.genesis());
  });

  it('add Block', () => {
    const data = "hoge";
    bc.addBlock(data);
    expect(bc.chain[bc.chain.length-1].data).toEqual(data);
  });
});
```

``` bash terminal
npm run test
```

``` bash terminal result

PASS  ./block.test.js
 PASS  ./blockchain.test.js

Test Suites: 2 passed, 2 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        2.193s
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

今回はブロックチェーンを取り扱います。

ブロックの生成ができたので、
ブロックチェーンクラスを作り、
ブロックを追加できるようにしました。

ブロックチェーンでは、ブロックを
配列形式で保持するようにしています。

ブロックチェーンの初期化で、
最初のブロック（genesis）を生成、
ブロックの追加で値を渡すと、
値に応じたハッシュ値を生成した
ブロックが生成され、配列に追加されるように
しています。

テストコードも書いて、
テストが通る（グリーン）になることを確認し、
最小限のブロックチェーンの実装が完了できました。

このレッスンは以上になります。

お疲れ様でした。
