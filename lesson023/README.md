# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

ウォレットトランザクション

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
}

module.exports = Wallet;
```

``` bash terminal
code wallet/transaction-pool.js
```

``` js wallet/transaction-pool.js

class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  updateOrAddTransaction(transaction) {
    let transactionWithId = this.transactions.find(t => t.id === transaction.id);

    if (transactionWithId) {
      this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
    } else {
      this.transactions.push(transaction);
    }
  }

  existingTransaction(address) {
    return this.transactions.find( t => t.input.address === address);
  }
}

module.exports = TransactionPool;

```

``` bash terminal
code wallet/index.test.js
```

``` js wallet/index.test.js

const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');

describe('Wallet', () => {
  let wallet, tp;
  beforeEach( () => {
    wallet = new Wallet();
    tp = new TransactionPool();
  });

  describe('取引作成テスト', () => {
    let transaction, sendAmount, receipient;
    beforeEach(() => {
      sendAmount = 50;
      receipient = 'r39310-3ndrs';
      transaction = wallet.createTransaction(receipient,sendAmount,tp);
    });

    describe('同一取引生成テスト', () => {
      beforeEach(()=>{
        wallet.createTransaction(receipient, sendAmount, tp);
      });

      it('残高から倍額差し引かれる', () => {
        expect(transaction.outputs.find(output => output.address ===  wallet.publicKey).amount)
          .toEqual(wallet.balance - sendAmount * 2);
      });

      it('送り先への取引金額起票テスト', () => {
        expect(transaction.outputs.filter(output => output.address === receipient)
          .map(output => output.amount)).toEqual([sendAmount, sendAmount]);
      });
    });
  })
})
```

``` bash terminal
npm run test
```

``` bahs terminal result
 PASS  blockchain/block.test.js
  ● Console

    console.log blockchain/block.test.js:24
      Block
            Timestamp : 1560398359785
            lastHash  : h4r0-h123
            hash      : 0007725f59
            nonce     : 6571
            difficulty: 3
            data      : sato

 PASS  wallet/transaction-pool.test.js
 PASS  blockchain/index.test.js
  ● Console

    console.log blockchain/index.js:41
      最新ブロックチェーンデータに更新します
    console.log blockchain/index.js:34
      ブロック数不足のため省略します

 PASS  wallet/index.test.js
 PASS  wallet/transaction.test.js
  ● Console

    console.log wallet/transaction.js:28
      金額： 50000が残高超過しています


Test Suites: 5 passed, 5 total
Tests:       24 passed, 24 total
Snapshots:   0 total
Time:        3.413s
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

ウォレットトランザクションを取り扱いました。

口座に取引処理を導入し送り先へ送金する
ことができるようになりました。

このレッスンは以上になります。

お疲れ様でした。
