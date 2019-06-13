# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

採掘報酬（マイニングとリワード）

``` bash terminal
code config.js
```

``` js config.js
const DIFFICULTY = 4;
const MINE_RATE = 3000;
const INITIAL_BALANCE = 500;
const MINING_REWARD = 50;

module.exports = {DIFFICULTY, MINE_RATE, INITIAL_BALANCE, MINING_REWARD};
```

``` bash terminal
code wallet/transaction.js
```

``` js wallet/transaction.js

const ChainUtil = require('../chain-util');
const { MINING_REWARD } = require('../config');

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
    this.outputs.push({ amount, address: receipient });
    Transaction.signTransaction(this, senderWallet);

    return this;
  }

  static newTransaction(senderWallet, receipient, amount) {
    if (amount > senderWallet.balance) {
      console.log(`金額： ${amount}が残高超過しています`);
      return;
    }

    return Transaction.transactionWithOutputs(senderWallet,
      [
        { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
        { amount, address: receipient }
      ]
    );
  }

  static rewardTransaction(minerWallet, blockchainWallet) {
    return Transaction.transactionWithOutputs(blockchainWallet,
      [
        { amount: MINING_REWARD, address: minerWallet.publicKey }
      ]
    );
  }

  static transactionWithOutputs(senderWallet, outputs) {
    const transaction = new this();
    transaction.outputs.push(...outputs);
    Transaction.signTransaction(transaction, senderWallet);
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
code wallet/index.js
```

``` js wallet/index.js
const Transaction = require('./transaction');
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

  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }

  createTransaction(receipient, amount, transactionPool) {
    if (amount > this.balance) {
      console.log(`金額： ${amount}が残高超過しています。`);
      return;
    }

    let transaction = transactionPool.existingTransaction(this.publicKey);

    if (transaction) {
      transaction.update(this, receipient, amount);
    } else {
      transaction = Transaction.newTransaction(this, receipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;

  }

  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.address = 'blockchain-address';
    return blockchainWallet;
  }
}

module.exports = Wallet;
```

``` bash terminal
code wallet/transaction.test.js
```

``` js wallet/transaction.test.js
const Transaction = require('./transaction');
const Wallet = require('./index');
const { MINING_REWARD } = require('../config');

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

  describe('報酬取引作成', () => {
    beforeEach(()=>{
      transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());
    });

    it('口座採掘報酬テスト', () => {
      expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
        .toEqual(MINING_REWARD);
    })
  })
});
```

``` bash terminal
npm run test
```

``` bash terminal result
 PASS  blockchain/block.test.js
  ● Console

    console.log blockchain/block.test.js:24
      Block
            Timestamp : 1560404508644
            lastHash  : h4r0-h123
            hash      : 00000a3a36
            nonce     : 575
            difficulty: 3
            data      : sato

 PASS  blockchain/index.test.js
  ● Console

    console.log blockchain/index.js:41
      最新ブロックチェーンデータに更新します
    console.log blockchain/index.js:34
      ブロック数不足のため省略します

 PASS  wallet/index.test.js
 PASS  wallet/transaction.test.js
  ● Console

    console.log wallet/transaction.js:29
      金額： 50000が残高超過しています

 PASS  wallet/transaction-pool.test.js
  ● Console

    console.log wallet/transaction-pool.js:31
      不正な取引です。 044cfda9ba0975dc2b06497920d7d2f4978f3edbb2aca7cd811bddeb4350369099b7c213e8af46fa1cf2f22dbd38701697ae3f7108d105f8f7d9f76cc3f45985a3
    console.log wallet/transaction-pool.js:31
      不正な取引です。 04a231cbcd15704a5829a6ca7152af30a54798c629f71cbff0a8001114bff38d6aa95c96f1ffc0b1daa93a860eb8f20d066d01e60cc2e79832b9f1088b5c5aa89a
    console.log wallet/transaction-pool.js:31
      不正な取引です。 04e7a3fb153c8b691f27a6ad5e48ed98c8e573c206d7e952ea32527233b3c299c0def06721f647e3efb8cd5bd6dcf1268ea85ef90c4ca6f6b7f736b3e5f2be697e


Test Suites: 5 passed, 5 total
Tests:       27 passed, 27 total
Snapshots:   0 total
Time:        4.919s, estimated 5s
Ran all test suites.

Watch Usage: Press w to show more.
```



## 補足解説

採掘報酬（マイニングとリワード）

マイナーによって、トランザクションを検証し、
妥当性が確認できたら、マイナーにリワードを
還元できることを確認できました。

このレッスンは以上になります。

お疲れ様でした。
