# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

取引台帳の妥当性確認

``` bash terminal
code app/miner.js
```

``` js app/miner.js
class Minner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    const validTransaction = this.transactionPool.validTransaction();
  }
}

module.exports = Minner;

```

``` bash terminal
code wallet/transaction-pool.js
```

``` js wallet/transaction-pool.js
const Transaction = require('../wallet/transaction');

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

  validTransactions() {
    return this.transactions.filter(transaction => {
      const outputTotal = transaction.outputs.reduce(
        (total, output) => {
          return total + output.amount
        }, 0
      )

      if (transaction.input.amount !== outputTotal) {
        console.log(`不正な取引です。 ${transaction.input.address}`);
        return;
      }

      if(!Transaction.verifyTransaction(transaction)) {
        console.log(`不正な署名です。 ${transaction.input.address}`);
        return;
      }

      return transaction;
    });
  }
}

module.exports = TransactionPool;


```

``` bash terminal
code transaction-pool.test.js
```

``` js transaction-pool.test.js

const TransactionPool = require('./transaction-pool');
const Wallet = require('./index');

describe('TransactionPool', () => {
  let tp, transaction, wallet;
  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    transaction = wallet.createTransaction('rec134nt', 30, tp);
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

  describe('正常/不正取引混合テスト', () => {
    let validTransactions;
    beforeEach( () => {
      validTransactions = [...tp.transactions];
      for (let i = 0; i< 6; i++) {
        wallet = new Wallet();
        transaction = wallet.createTransaction('rec134nt', 30, tp);
        if (i%2 == 0 ) {
          transaction.input.amount = 99999;
        } else {
          validTransactions.push(transaction);
        }
      }
    });

    it('取引台帳と妥当性検証取引リストテスト' , () => {
      expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
    });

    it('妥当性検証取引リストテスト', () => {
      expect(tp.validTransactions()).toEqual(validTransactions);
    });

  })
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
            Timestamp : 1560403308220
            lastHash  : h4r0-h123
            hash      : 0001786e53
            nonce     : 2928
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

    console.log wallet/transaction.js:28
      金額： 50000が残高超過しています

 PASS  wallet/transaction-pool.test.js (5.128s)
  ● Console

    console.log wallet/transaction-pool.js:31
      不正な取引です。 047afda100f4d01728e11c5110835232b8ec57f99a356116a07ec5f50987292ee8ca829c3c78b366e545a174cb0a5b201d31378d3a187c8c49a1d3c78f326ea646
    console.log wallet/transaction-pool.js:31
      不正な取引です。 0485e674da2243062e88511e372c86b799cb2431452c7515eb68205c70fcc4250116189d27d62e2bf7a3f7d4991e5aa88dc574e68ad9cd35980290bdaf6eea47bb
    console.log wallet/transaction-pool.js:31
      不正な取引です。 04373bea278303f88635550fac64af9f3368f5d1aef985cd51c6204f30d22131aacfc69382341a089cc4735c9d82e8b40b55774d975080b3d8113ef7d6c4327ec3


Test Suites: 5 passed, 5 total
Tests:       26 passed, 26 total
Snapshots:   0 total
Time:        5.658s
Ran all test suites.

Watch Usage: Press w to show more.
```


## 補足解説

取引台帳の妥当性確認を取り扱いました。

トランザクションの中に不正な取引が含まれてい場合に
検出できるようになりました。

このレッスンは以上になります。

お疲れ様でした。
