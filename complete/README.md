# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

暗号通貨を口座間で入出金（送金）を実現する

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

  createTransaction(receipient, amount, blockchain, transactionPool) {
    this.balance = this.calculateBalance(blockchain);
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

  calculateBalance(blockchain) {
    let balance = this.balance;
    let transactions = [];
    blockchain.chain.forEach(
      block => block.data.forEach(
        t => {
          transactions.push(t);
        }
      )
    );

    const walletInputTs = transactions.filter(
      t => t.address === this.publicKey
    );

    let startTime = 0;

    if (walletInputTs.length > 0 ) {
      const recentInputT = walletInputTs.reduce(
        (prev, current) => {
          prev.input.timestamp > current.input.timestamp ?
          prev: current
        }
      );
      
      balance = recentInputT.outputs.find(
        output =>
          output.address === this.publicKey
      ).amount;

      startTime = recentInputT.input.timestamp;

      transactions.forEach(
        t => {
          if (t.input.timestamp > startTime) {
            t.outputs.find(
              output => {
                if (output.address === this.publicKey) {
                  balance += output.amount;
                }
              }
            )
          }
        }
      );
    }

    return balance;
  }

  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.address = 'blockchain-address';
    return blockchainWallet;
  }
}

module.exports = Wallet;

```

`wallet/index.js`の
createTransactionのパラメーターを追加したので、
関連ファイルの該当箇所を修正していく。

``` bash terminal
code app/index.js
code app/index.test.js
```

``` js app/index.js
const express = require('express');
const bodyParser = require("body-parser");
const Blockchain = require('../blockchain');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const P2pServer = require("./p2p-server");
const Miner = require('./miner');

const HTTP_PORT = process.env.HTTP_PORT || 3001;
const app = express();

app.use(bodyParser.json());

const bc = new Blockchain(); 
const wallet = new Wallet();
const tp = new TransactionPool();

const p2pServer = new P2pServer(bc, tp); 
const miner = new Miner(bc, tp, wallet, p2pServer);

app.get('/blocks', (req, res) => {
  res.json(bc.chain);
});

app.post('/mine', (req, res) => {
  const block = bc.addBlock(req.body.data);
  console.log(`ブロックが追加されました。${block.toString()}`);
  p2pServer.syncChain();
  res.redirect('/blocks');
});

app.get('/transactions', (req, res) => {
  res.json(tp.transactions);
});

app.post('/transact', (req, res) => {
  const { receipient, amount } = req.body;
  const transaction = wallet.createTransaction(receipient, amount, bc, tp );
  p2pServer.broadcastTransaction(transaction);
  res.redirect('/transactions');
})

app.get('/public-key', (req, res) => {
  res.json({publickey : wallet.publicKey});
});

app.get('/miner-transactions', (req, res) => {
  const block = miner.mine();
  console.log(`ブロックが生成されました。 ${block.toString()}`);
  res.redirect('/blocks');
})

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();
```

``` js wallet/index.test.js

const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain');

describe('Wallet', () => {
  let wallet, tp, bc;
  beforeEach( () => {
    wallet = new Wallet();
    tp = new TransactionPool();
    bc = new Blockchain();
  });

  describe('取引作成テスト', () => {
    let transaction, sendAmount, receipient;
    beforeEach(() => {
      sendAmount = 50;
      receipient = 'r39310-3ndrs';
      transaction = wallet.createTransaction(receipient,sendAmount,bc,tp);
    });

    describe('同一取引生成テスト', () => {
      beforeEach(()=>{
        wallet.createTransaction(receipient, sendAmount, bc, tp);
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

``` js wallet/transaction-pool.test.js

const TransactionPool = require('./transaction-pool');
const Wallet = require('./index');
const Blockchain = require('../blockchain');


describe('TransactionPool', () => {
  let tp, transaction, wallet, bc;
  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    bc = new Blockchain();
    transaction = wallet.createTransaction('rec134nt', 30, bc, tp);
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
        transaction = wallet.createTransaction('rec134nt', 30, bc, tp);
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
 PASS  blockchain/block.test.js
  ● Console

    console.log blockchain/block.test.js:24
      Block
            Timestamp : 1560407329513
            lastHash  : h4r0-h123
            hash      : 0003ce0683
            nonce     : 4296
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

 PASS  wallet/transaction-pool.test.js (5.691s)
  ● Console

    console.log wallet/transaction-pool.js:31
      不正な取引です。 041605ffaef429313df07d90c684fb379ce89cbbfb641c7b35702a9448eff16e6080d7973a6994813688915e54c4f88b6531f4dda762ebeaaed0292938169265b0
    console.log wallet/transaction-pool.js:31
      不正な取引です。 046c90125f2888ec898fc7ea95be7b6b837ccfdabe333d3b575b62d5177ae5c162bc784e20150d82f0194f67a8ed138d30c5618167c1acfb1c8bd1acd69ef6bb34
    console.log wallet/transaction-pool.js:31
      不正な取引です。 046217590cd0f369f1c1389691929bae742a87029b0e56b7fbea29ad6472f80110a702ee876740dbe92a3097ac402bdda9e44e4c750890ca0000ee32ad2e0039e9


Test Suites: 5 passed, 5 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        6.242s
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

暗号通貨を口座間で入出金（送金）を取り扱いました。

ここまでで、ウォレットを使って、
暗号通貨をセキュアにブロックチェーンテクノロジーで
取り扱い、送金できる仕組みが出来上がりました。

このレッスンは以上になります。

お疲れ様でした。
