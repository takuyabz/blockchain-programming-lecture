# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

それでは最小限のブロックチェーンを
構築していきます。

``` bash terminal
npm init -y
npm i nodemon --save-dev
code .
```

VS CodeでTerminal Tabを開き、
ファイルを作っていきます。

``` bash terminal tab
code block.js
```

ブロックチェーンで取り扱う
ブロックを処理するプログラムを作ります。

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
}

module.exports = Block;
```

続いて、ブロックをテストするコードを作ります。

``` bash terminal tab
code dev-test.js
```

``` js dev-test.js
const Block = require("./block");
const block = new Block("sato", "suzuki", "yamada", "kitagawa");
console.log(block.toString());
```

続いて、テストコードをコマンドラインで
実行できるように`package.json`を編集します。


``` bash terminal
code package.json
```

``` json package.json
{
  // ...
  "scripts" : {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev-test": "nodemon dev-test"
  },
  // ...
}
```

この状態で、ターミナルで次のように実行します。

``` bash terminal
npm run dev-test
```

すると次のようになります。

``` bash result
 fixer: ~/dev/lectures/20190613/t2/lesson002 [git:master] 
🌏 >npm run dev-test

> lesson002@1.0.0 dev-test /Users/tech/dev/lectures/20190613/t2/lesson002
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
[nodemon] clean exit - waiting for changes before restart

```

## 補足解説

プログラムソースコードを作り、
テストコードを書き、テストをする。

この流れを小さく繰り返し、数多くすればするほど
スキルアップが図れます。

全てはこの応用になりますので、今回の
レクチャーを通して、プログラミングの型を
吸収していただけたことになります。

### block.jsについて。

classとか、constructorとか、thisとか、
returnとか、module.exportsとか、
色々出てきて、もしかしたら困惑しているかもしれません。

JavaScript V8の構文（書き方のルール）
に則って作っています。

プログラムを理解する上で、
「入力/加工/出力」という観点を取り入れると
素早く理解が深まります。

今回は、Blockというプログラムを作り、
dev-test.jsでBlockを呼び出し、呼び出した結果を
出力する。

というプログラムを作ったことになります。

徐々に応用していきながら、
手を動かしていただくことで理解が
深まっていきますので、今は理解できなくても
ご安心ください。

このレッスンは以上になります。

お疲れ様でした。


