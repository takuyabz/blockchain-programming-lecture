# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

署名を検証する

``` bash terminal
code chain-util.js
```

``` js chain-util.js
const EC = require('elliptic').ec;
const uuidV1 = require('uuid/V1');
const SHA256 = require('crypto-js/sha256');
const ec = new EC('secp256k1');

class ChainUtil {
  static genKeyPair() {
    return ec.genKeyPair();
  }

  static id() {
    return uuidV1();
  }

  static hash(data) {
    return SHA256(JSON.stringify(data)).toString();
  }

  static verifySignature(publicKey, signature, dataHash){
    return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
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

``` js wallet/transaction.js
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
  })
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
            Timestamp : 1560395615775
            lastHash  : h4r0-h123
            hash      : 000a9f607d
            nonce     : 17342
            difficulty: 3
            data      : sato

 PASS  wallet/transaction.test.js
  ● Console

    console.log wallet/transaction.js:13
      金額： 50000が残高超過しています


Test Suites: 3 passed, 3 total
Tests:       18 passed, 18 total
Snapshots:   0 total
Time:        3.436s
Ran all test suites.

Watch Usage: Press w to show more.
```


## 補足解説

署名の検証を取り扱いました。

verifySignatureにて、公開鍵と署名を元に
データの検証を行なっています。

データが改竄されると、データの検証が失敗し、
トランザクションが不正であることを検知できるようになります。

このレッスンは以上になります。

お疲れ様でした。
