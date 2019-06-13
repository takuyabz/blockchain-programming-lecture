# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

P2Pによるトランザクションクリアの同期

``` bash terminal
code app/p2p-server.js
```

``` js app/p2p-server.js
const Websocket = require('ws');
const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
  clear_transaction: 'CLEAR_TRANSACTION'
};
class P2pServer {
  constructor(blockchain, transactionPool) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool
    this.sockets = [];
  }

  listen() {
    const server = new Websocket.Server({ port: P2P_PORT });
    server.on('connection', socket => this.connectSocket(socket));
    this.connectPeers();
  }

  connectPeers() {
    peers.forEach(peer => {
      const socket = new Websocket(peer);
      socket.on('open', () => this.connectSocket(socket));
    });
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    console.log('Socket connected');
    this.messageHandler(socket);
    this.sendChain(socket);
  }

  sendChain(socket) {
    socket.send(JSON.stringify(
      {
        type: MESSAGE_TYPES.chain,
        chain: this.blockchain.chain
      }
    ));
  }

  sendTransaction(socket, transaction) {
    socket.send(JSON.stringify(
      {
        type: MESSAGE_TYPES.transaction,
        transaction
      }
    ));
  }

  syncChain() {
    this.sockets.forEach(socket => {
      this.sendChain(socket);
    })
  }

  messageHandler(socket) {
    socket.on('message', message => {
      const data = JSON.parse(message);
      switch(data.type) {
        case MESSAGE_TYPES.chain:
          this.blockchain.replaceChain(data.chain);
          break;
        case MESSAGE_TYPES.transaction:
          this.transactionPool.updateOrAddTransaction(data.transaction);
          break;
        case MESSAGE_TYPES.clear_transaction:
          this.transactionPool.clear();
          break;
      }
      console.log('data', data);
    })
  }

  broadcastTransaction(transaction) {
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }

  broadcastClearTransactions() {
    this.sockets.forEach(socket => socket.send(
      JSON.stringify( {
        type: MESSAGE_TYPES.clear_transaction
      })
    ));
  }
}

module.exports = P2pServer;
```

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
    const validTransactions = this.transactionPool.validTransactions();
    validTransactions.push(
      Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
    );

    const block = this.blockchain.addBlock(validTransactions);
    this.p2pServer.syncChain();
    this.transactionPool.clear();
    this.p2pServer.broadcastClearTransactions();
    return block;
  }
}

module.exports = Minner;
```

``` bash terminal
code app/index.js
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
  const transaction = wallet.createTransaction(receipient, amount, tp );
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

``` bash terminal
npm run dev
```

``` bash terminal new tab
HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev
```

### POST MAN

``` POST MAN REQUEST
POST
localhost:3001/transact
body -> raw -> JSON(application/json)
```

``` json json
{
  "receipient": "foo-121ejfi",
  "amount": 30
}

``` POSTMAN RESULT
[
    {
        "id": "18157ab0-8da2-11e9-8683-f324e361257c",
        "input": {
            "timestamp": 1560406293979,
            "amount": 500,
            "address": "0471e6ec11d330abb027681b6785d70b90732b140fe90083eeff6ef1f9948c7c5dcb139ba654260aef1967fee9a6727b0fb134c64a132710ee02f2348f3f23d726",
            "signature": {
                "r": "dfaaf080a029a0d864c83d9484e2b39331798d4601856b9636a948f92151e05c",
                "s": "d5a2068ff8c61a8b1bb8efc08c5440082c3f9129cb423fdb25b766940f909334",
                "recoveryParam": 1
            }
        },
        "outputs": [
            {
                "amount": 470,
                "address": "0471e6ec11d330abb027681b6785d70b90732b140fe90083eeff6ef1f9948c7c5dcb139ba654260aef1967fee9a6727b0fb134c64a132710ee02f2348f3f23d726"
            },
            {
                "amount": 30,
                "address": "foo-121ejfi"
            }
        ]
    }
]
```

``` POSTMAN REQUEST
GET 
localhost:3002/miner-transactions
```

``` POSTMAN RESULT
[
    {
        "timestamp": "timestamp",
        "lastHash": "----",
        "hash": "h4r0-h123",
        "data": [],
        "nonce": 0,
        "difficulty": 4
    },
    {
        "timestamp": 1560406310122,
        "lastHash": "h4r0-h123",
        "hash": "000b7da48c6cf8419e1a952214af3e729d98b62f6f01117d55140cdc42434e9e",
        "data": [
            {
                "id": "18157ab0-8da2-11e9-8683-f324e361257c",
                "input": {
                    "timestamp": 1560406293979,
                    "amount": 500,
                    "address": "0471e6ec11d330abb027681b6785d70b90732b140fe90083eeff6ef1f9948c7c5dcb139ba654260aef1967fee9a6727b0fb134c64a132710ee02f2348f3f23d726",
                    "signature": {
                        "r": "dfaaf080a029a0d864c83d9484e2b39331798d4601856b9636a948f92151e05c",
                        "s": "d5a2068ff8c61a8b1bb8efc08c5440082c3f9129cb423fdb25b766940f909334",
                        "recoveryParam": 1
                    }
                },
                "outputs": [
                    {
                        "amount": 470,
                        "address": "0471e6ec11d330abb027681b6785d70b90732b140fe90083eeff6ef1f9948c7c5dcb139ba654260aef1967fee9a6727b0fb134c64a132710ee02f2348f3f23d726"
                    },
                    {
                        "amount": 30,
                        "address": "foo-121ejfi"
                    }
                ]
            },
            {
                "id": "21a87fa0-8da2-11e9-ad9b-679dc049e497",
                "input": {
                    "timestamp": 1560406310043,
                    "amount": 500,
                    "address": "046ed4e04891d184483062157a48b9f83202976c6bd1c7afbbf722c3a62ee267c9347f1e7b6655ad48c2adab77ece2f2a697a2ba90d593b3174ebce84981daa2ae",
                    "signature": {
                        "r": "26655fed8c6b774eaa6b484b660fc9215f243e7ab554955bf24daa2fde3f9b2a",
                        "s": "bde2ff0d19f2c74ae92e23bc5b815936b57afb090e74d7a71ef77b48415cc9c",
                        "recoveryParam": 1
                    }
                },
                "outputs": [
                    {
                        "amount": 50,
                        "address": "044295cbb24c9a07e7e4c8dedcb04d73e6af50e37efd0cb9941854d795f18bfb605e0ddf018211ac7f24468b291fe55fc6cf49c6b33f022fe2d40f8f1406d36d17"
                    }
                ]
            }
        ],
        "nonce": 1830,
        "difficulty": 3
    }
]
```

``` POSTMAN REQUEST
GET
localhost:3001/transactions
```

``` POSTMAN RESULT
[]
```

``` POSTMAN REQUEST
GET
localhost:3002/transactions
```

``` POSTMAN RESULT
[]
```



## 補足解説

P2Pによるトランザクションクリアの同期

ウォレットによりトランザクションをマイニングし、
妥当性が検証できたので、トランザクションを同期し、
リワードを受け取り、トランザクションをクリアし、
P2Pネットワーク全体でトランザクションがクリアされる
一連の処理が確認できました。

このレッスンは以上になります。

お疲れ様でした。
