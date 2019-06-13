# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

署名

``` bash terminal
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

  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }
}

module.exports = Wallet;
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

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(transaction.outputs)
    }
  }
}

module.exports = Transaction;
```

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
}

module.exports = ChainUtil;
```

``` bash terminal
code blockchain/block.js
```

``` js blockchain/block.js
const ChainUtil = require('../chain-util');
const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY, MINE_RATE } = require('../config');

class Block {
  constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  toString() {
    return `Block
      Timestamp : ${this.timestamp}
      lastHash  : ${this.lastHash.substring(0,10)}
      hash      : ${this.hash.substring(0,10)}
      nonce     : ${this.nonce}
      difficulty: ${this.difficulty}
      data      : ${this.data}`;
  }

  static genesis() {
    return new this("timestamp", "----", "h4r0-h123", [], 0, DIFFICULTY);
  }

  static mineBlock(lastBlock, data) {
    const lastHash = lastBlock.hash;
    let { difficulty } = lastBlock;
    let timestamp, hash;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = this.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty))

    return new Block(timestamp, lastHash, hash, data, nonce, difficulty);
  }

  static hash(timestamp, lastHash, data, nonce, difficulty) {
    return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
  }

  static blockHash(block) {
    const {timestamp, lastHash, data, nonce, difficulty } = block;
    return Block.hash(timestamp, lastHash, data, nonce, difficulty);
  }

  static adjustDifficulty(lastBlock, currentTime) {
    let { difficulty } = lastBlock;
    difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
    return difficulty;
  }
}

module.exports = Block;

```

``` bash terminal
code blockchain/transaction.js
```

``` js blockchain/transaction.js

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
            Timestamp : 1560394799810
            lastHash  : h4r0-h123
            hash      : 000bb94bd2
            nonce     : 6485
            difficulty: 3
            data      : sato

 PASS  wallet/transaction.test.js
  ● Console

    console.log wallet/transaction.js:13
      金額： 50000が残高超過しています


Test Suites: 3 passed, 3 total
Tests:       16 passed, 16 total
Snapshots:   0 total
Time:        2.947s
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

署名を取り扱いました。

keyPair.signでデータを署名する処理を構築し、
トランザクションの内容を署名しています。

SHA256が複数回扱われることになるので、
ChainUtilに集約し、リファクタリングしています。

このレッスンは以上になります。

お疲れ様でした。
