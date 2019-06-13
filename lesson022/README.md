# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

取引台帳（トランザクションプール）

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
}

module.exports = TransactionPool;


```

``` bahs terminal
code wallet/transaction-pool.test.js
```

``` js wallet/transaction-pool.test.js

const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');

describe('TransactionPool', () => {
  let tp, transaction, wallet;
  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    transaction = Transaction.newTransaction(wallet, 'rec134nt', 30);
    tp.updateOrAddTransaction(transaction);
  });

  it('取引台帳追加テスト', () => {
    expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
  });

  it('取引台帳更新テスト', () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, 'foo-ew145', 40);
    tp.updateOrAddTransaction(newTransaction);
    expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id)))
      .not.toEqual(oldTransaction);
  });
})
```

``` bash terminal
npm run test
```

``` bash terminal result
PASS  blockchain/block.test.js
  ● Console

    console.log blockchain/block.test.js:24
      Block
            Timestamp : 1560397251489
            lastHash  : h4r0-h123
            hash      : 0006e28102
            nonce     : 3310
            difficulty: 3
            data      : sato

 PASS  blockchain/index.test.js
  ● Console

    console.log blockchain/index.js:41
      最新ブロックチェーンデータに更新します
    console.log blockchain/index.js:34
      ブロック数不足のため省略します

 PASS  wallet/transaction-pool.test.js
 PASS  wallet/transaction.test.js
  ● Console

    console.log wallet/transaction.js:28
      金額： 50000が残高超過しています


Test Suites: 4 passed, 4 total
Tests:       22 passed, 22 total
Snapshots:   0 total
Time:        3.33s
Ran all test suites.

Watch Usage: Press w to show more.
```

## 補足解説

取引台帳を取り扱いました。

初期残高から、rec134ntさんに30、foo-ew145さんに40を
送金するトランザクションを作り、トランザクションプールに
トランザクションの登録、更新ができるようにしました。

このレッスンは以上になります。

お疲れ様でした。
