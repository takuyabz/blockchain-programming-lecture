# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

暗号通貨を送金する

``` bash terminal
npm i uuid 
code chain-util.js
```

``` js chain-utils.js
const EC = require('elliptic').ec;
const uuidV1 = require('uuid/V1');
const ec = new EC('secp256k1');

class ChainUtil {
  static genKeyPair() {
    return ec.genKeyPair();
  }

  static id() {
    return uuidV1();
  }
}

module.exports = ChainUtil;
```

``` bash terminal
code wallet/transaction.js
```

``` js wallet/transaction.js
const ChainUtil = require('../chain-util');

class Transaction {
  constructor() {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  static newTransaction(senderWallet, receipient, amount) {
    if (amount > senderWallet.balance) {
      console.log(`金額： ${amount}が残高超過しています`);
      return;
    }

    const transaction = new this();

    transaction.outputs.push(...[
      { amount: senderWallet.balance - amount, address: senderWallet.publicKey},
      { amount, address: receipient}
    ]);

    return transaction;
  }
}

module.exports = Transaction;
```

``` bash terminal
code wallet/transaction.test.js
```

``` js wallet/transaction.test.js
const Transaction = require('./transaction');
const Wallet = require('./index');

describe('Transaction', () => {
  let transaction, wallet, receipient, amount;
  beforeEach( () => {
    wallet = new Wallet();
    amount = 50;
    receipient = 'r2c1e0p24nt';
    transaction = Transaction.newTransaction(wallet, receipient, amount);
  });

  it('残高差し引きテスト', () => {
    expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
      .toEqual(wallet.balance - amount);
  });

  it('送金テスト', () => {
    expect(transaction.outputs.find(output => output.address == receipient).amount)
      .toEqual(amount);
  });

  describe('残高超過テスト', () => {
    beforeEach( () => {
      amount = 50000;
      transaction = Transaction.newTransaction(wallet, receipient, amount);
    });

    it('取引省略テスト', () => {
      expect(transaction).toEqual(undefined);
    })
  })
});
```

``` bash terminal
code package.json
```

``` bash terminal result
 PASS  blockchain/index.test.js
  ● Console

    console.log blockchain/index.js:41
      最新ブロックチェーンデータに更新します
    console.log blockchain/index.js:34
      ブロック数不足のため省略します

 PASS  blockchain/block.test.js
  ● Console

    console.log blockchain/block.test.js:24
      Block
            Timestamp : 1560394005719
            lastHash  : h4r0-h123
            hash      : 0000682a55
            nonce     : 3108
            difficulty: 3
            data      : sato

 PASS  wallet/transaction.test.js
  ● Console

    console.log wallet/transaction.js:13
      金額： 50000が残高超過しています


Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        1.932s
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

暗号通貨の送金処理を取り扱いました。

トランザクションを作り、残高から指定した金額を移動する
という構成になっています。

残高を超過した場合は、移動できないので、
トランザクションを作成せず、資金の移動もしない
という処理を構築しています。

このレッスンは以上になります。

お疲れ様でした。
