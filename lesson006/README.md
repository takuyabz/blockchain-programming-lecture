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

``` bash terminal
code block.test.js
```

``` js block.test.js
const Block = require('./block');

describe('Block', () => {

  let data, lastblock, block;

  beforeEach(()=>{
    data = "sato";
    lastBlock = Block.genesis();
    // block = Block.mineBlock(lastBlock, data);
    block = Block.mineBlock(lastBlock, "yamada");
  });
  it('data test', ()=> {
    expect(block.data).toEqual(data);
  });

  it('hash test', () => {
    // expect(block.lastHash).toEqual(lastBlock.hash);
    expect(block.lastHash).toEqual("suzuki");
  });
});
```

``` bash terminal result
 FAIL  ./block.test.js
  Block
    ✕ data test (4ms)
    ✕ hash test (1ms)

  ● Block › data test

    expect(received).toEqual(expected) // deep equality

    Expected: "sato"
    Received: "yamada"

      12 |   });
      13 |   it('data test', ()=> {
    > 14 |     expect(block.data).toEqual(data);
         |                        ^
      15 |   });
      16 | 
      17 |   it('hash test', () => {

      at Object.toEqual (block.test.js:14:24)

  ● Block › hash test

    expect(received).toEqual(expected) // deep equality

    Expected: "suzuki"
    Received: "h4r0-h123"

      17 |   it('hash test', () => {
      18 |     // expect(block.lastHash).toEqual(lastBlock.hash);
    > 19 |     expect(block.lastHash).toEqual("suzuki");
         |                            ^
      20 |   });
      21 | });

      at Object.toEqual (block.test.js:19:28)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 2 total
Snapshots:   0 total
Time:        0.213s, estimated 1s
Ran all test suites.

Watch Usage: Press w to show more.
```

``` bash terminal
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
    // block = Block.mineBlock(lastBlock, "yamada");
  });
  it('data test', ()=> {
    expect(block.data).toEqual(data);
  });

  it('hash test', () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
    // expect(block.lastHash).toEqual("suzuki");
  });
});
```

``` bash terminal result
 PASS  ./block.test.js
  Block
    ✓ data test (1ms)
    ✓ hash test (1ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.243s, estimated 1s
Ran all test suites.

Watch Usage: Press w to show more.

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

jestではwatchAllオプションをつけて、
ソースコードが修正されたら自動的に
テストが実行されるようになっています。

試しに、あえて失敗するコードを記述すると、
テストが失敗したという旨のメッセージが
ターミナルに出力されます。

もう一度戻すと、元どおりテストが通る
ことが確認できます。

このようにして、単体テストを組み込むことで、
動作が保証された状態で、ソースコードを
拡張していくことができるようになります。

今回のレッスンで単体テストについての
感触を掴んでいただければと思います。

このレッスンは以上になります。

お疲れ様でした。
