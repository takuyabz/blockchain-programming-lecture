# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

ウォレット、マイニング、リワード

``` bash terminal
code app/miner.js
```

``` js app/miner.js
const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');

class Minner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    const validTransaction = this.transactionPool.validTransaction();
    validTransaction.push(
      Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
    );

    const block = this.blockchain.addBlock(validTransactions);
    this.p2pServer.syncChain();
    this.transactionPool.clear();
    

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

  clear() {
    this.transactions = [];
  }
}

module.exports = TransactionPool;
```

``` bash terminal
code wallet/transaction-pool.test.js
```

``` js wallet/transaction-pool.test.js

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
  });

  it('取引明細クリアテスト', () => {
    tp.clear();
    expect(tp.transactions).toEqual([]);
  })
})

```

``` bash terminal
npm run test
```

``` bash terminal result
 RUNS  wallet/transaction.test.js

 RUNS  wallet/transaction.test.js

 RUNS  wallet/transaction.test.js

 RUNS  wallet/transaction.test.js
 PASS  blockchain/index.test.js

 RUNS  wallet/transaction.test.js
  ● Console

    console.log blockchain/index.js:41
      最新ブロックチェーンデータに更新します
    console.log blockchain/index.js:34
      ブロック数不足のため省略します


 RUNS  wallet/transaction.test.js

 RUNS  wallet/transaction.test.js

 PASS  blockchain/block.test.js

  ● Console

    console.log blockchain/block.test.js:24
      Block
            Timestamp : 1560405090438
            lastHash  : h4r0-h123
            hash      : 0006458332
            nonce     : 4935
            difficulty: 3
            data      : sato


 PASS  wallet/index.test.js
 PASS  wallet/transaction.test.js
  ● Console

    console.log wallet/transaction.js:29
      金額： 50000が残高超過しています

 PASS  wallet/transaction-pool.test.js (6.137s)
  ● Console

    console.log wallet/transaction-pool.js:31
      不正な取引です。 04a73fe107de30f35b36a20c354dd8eee764dcabd1c612b2e47d85ed6b700dd598d0e29209d7330717363d590c1791cc9551e2361de64ef504496bf0a8decd4a1c
    console.log wallet/transaction-pool.js:31
      不正な取引です。 04403a4db12d3c237593880ca69493ce492336e96a2c01addf53f3b33535cb652261ef3215e108add84a50d3734b6993f35774e5dfa9a6aac5891ba4f0f3057817
    console.log wallet/transaction-pool.js:31
      不正な取引です。 0479b51bf181a55a47f9bab6f8e8201c087663a304ee558dd2366e8c047e8b4ce6918ac93d58b3e8021945bfa41c3fbeee9b5bb90daadbc33c8bde4b0cd9b14e94


Test Suites: 5 passed, 5 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        6.666s
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

ウォレット、マイニング、リワード

ウォレットによりトランザクションをマイニングし、
妥当性が検証できたので、トランザクションを同期し、
リワードを受け取り、トランザクションをクリアする
という一連の流れを確認できました。

このレッスンは以上になります。

お疲れ様でした。
