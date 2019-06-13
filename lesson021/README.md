# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

取引を更新する

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

  update(senderWallet, receipient, amount) {
    const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

    if (amount > senderOutput.amount) {
      console.log(`金額： ${amount} が残高を超過しています。`);
      return;
    }

      senderOutput.amount = senderOutput.amount - amount;
      this.outputs.push( { amount, address :receipient } );
      Transaction.signTransaction(this, senderWallet);

      return this;
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

    this.signTransaction(transaction, senderWallet);

    return transaction;
  }

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
    }
  }

  static verifyTransaction(transaction) {
    return ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs)
    );
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

  it('取引署名テスト', () => {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });

  it('正常な取引の検証テスト', () => {
    expect(Transaction.verifyTransaction(transaction)).toEqual(true);
  });

  it('不正な取引の検証テスト', () => {
    transaction.outputs[0].amount = 5555;
    expect(Transaction.verifyTransaction(transaction)).toEqual(false);
  })

  describe('残高超過テスト', () => {
    beforeEach( () => {
      amount = 50000;
      transaction = Transaction.newTransaction(wallet, receipient, amount);
    });

    it('取引省略テスト', () => {
      expect(transaction).toEqual(undefined);
    })
  });

  describe('取引更新テスト', () => {
    let nextAmount, nextReceipient;
    beforeEach( () => {
      nextAmount = 20;
      nextReceipient = 'n32st-13rpi4nt';
      transaction = transaction.update(wallet, nextReceipient, nextAmount);
    });

    it('取引金額差し引きテスト', () => {
      expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
        .toEqual(wallet.balance - amount - nextAmount);
    });

    it('送信先取引金額テスト' , () => {
      expect(transaction.outputs.find(output => output.address === nextReceipient).amount)
        .toEqual(nextAmount);
    });
  });
});
```

``` bash terminal
npm run test
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
            Timestamp : 1560396310231
            lastHash  : h4r0-h123
            hash      : 0001c154c3
            nonce     : 6090
            difficulty: 3
            data      : sato

 PASS  wallet/transaction.test.js
  ● Console

    console.log wallet/transaction.js:28
      金額： 50000が残高超過しています


Test Suites: 3 passed, 3 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        3.18s
Ran all test suites.

Watch Usage: Press w to show more.
```

## 補足解説

取引の更新を取り扱いました。

テストでは50000から20を差し引き、
送金先に送金できることを確認しています。

このレッスンは以上になります。

お疲れ様でした。
