# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

単体（ユニット）テストJestの導入。

``` bash terminal
npm i jest --save-dev
code block.test.js
```

``` js block.test.js
const Block = require('./block');

describe('Block', () => {

  let data, lastblock, block;

  beforeEach(()=>{
    data = "sato";
    lastBlock = Block.genesis();
    block = Block.mineBlock(lastBlock, data);
  });
  it('data test', ()=> {
    expect(block.data).toEqual(data);
  });

  it('hash test', () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
  });
});

```

``` bash terminal 
code package.json
```

``` json package.json
 {
  // ...
  "scripts": {
    "test": "jest --watchAll",
    // ...
  },
  // ...
}
```

``` bash terminal
npm run test
```

``` bash terminal result
 PASS  ./block.test.js
  Block
    ✓ data test (5ms)
    ✓ hash test (1ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.531s
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

単体（ユニット）テストを今回は組み込みました。

Blockをテストし、テストケースとしてデータのテストと
ハッシュのテストをするテストコードを記述しています。

beforeEachでは各テストコードを実施する前に
実行し、テスト条件の初期化を行っています。

単体テストを実行するために、
package.jsonを編集し、コマンドを実行し、
テストを実行しています。

単体テストを組み込むことで、
動作が保証された状態で、ソースコードを
拡張していくことができるようになります。

今回のレッスンで単体テストについての
感触を掴んでいただければと思います。

このレッスンは以上になります。

お疲れ様でした。
