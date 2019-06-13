# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

Wallet

``` bash terminal
npm i elliptic
mkdir wallet
code wallet/index.js
```

``` js wallet/index.js
const ChainUtil = require('../chain-util');
const { INITIAL_BALANCE } = require('../config');

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  toString() {
    return `Wallet -
      publicKey : ${this.publicKey.toString()}
      balance   : ${this.balance}`;
  }
}

module.exports = Wallet;
```

``` bash terminal
code config.js
```

``` js config.js
const DIFFICULTY = 4;
const MINE_RATE = 3000;
const INITIAL_BALANCE = 500;

module.exports = {DIFFICULTY, MINE_RATE, INITIAL_BALANCE};
```

``` bash terminal
code chain-util.js
```

``` js chain-utils.js
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class ChainUtil {
  static genKeyPair() {
    return ec.genKeyPair();
  }
}

module.exports = ChainUtil;
```

``` bash terminal
code dev-test.js
```

``` js dev-test.js
const Wallet = require('./wallet');

const wallet = new Wallet();

console.log(wallet.toString());
```

``` bash terminal
npm run dev-test
```

``` bash terminal result
fixer: ~/dev/lectures/20190613/t2/lesson017 [git:master] 
🌏 >npm run dev-test

> lesson002@1.0.0 dev-test /Users/tech/dev/lectures/20190613/t2/lesson017
> nodemon dev-test

[nodemon] 1.19.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node dev-test.js`
Wallet -
      publicKey : 0481152e0d9be08433ade0a1c9afff8815182cb3a3284ab4961e795c2883343870b157ade2303bef31ddd74b5f97395ba8b3eadb3d3e997b66e5e40d37d31cc595
      balance   : 500
[nodemon] clean exit - waiting for changes before restart
```

## 補足解説

ウォレット（Wallet）：口座の構築を取り扱いました。

初期残高500とし、口座の公開キーを算出できるようにしました。

口座の公開キーは、高速楕円曲線暗号という手法を
用いて計算し、プリセットとして`secp256k1`を
パッケージとして`elliptic`を導入しています。

秘密鍵と公開鍵のペアで、
暗号化、複合化ができるようになります。

`secp256k1`は、EthererumやBitCoinでも利用されている
暗号方式です。

このレッスンは以上になります。

お疲れ様でした。
