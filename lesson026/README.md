# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

P2Pでウォレットトランザクションを同期する

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

const HTTP_PORT = process.env.HTTP_PORT || 3001;
const app = express();

app.use(bodyParser.json());

const bc = new Blockchain(); 
const wallet = new Wallet();
const tp = new TransactionPool();

const p2pServer = new P2pServer(bc, tp); 

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
  res.redirect('/transactions');
})

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();

```

``` bash terminal
code app/p2p-server.js
```

``` js app/p2p-server.js
const Websocket = require('ws');
const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION'
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
      }
      console.log('data', data);
    })
  }

  broadcastTransaction(transaction) {
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }
}

module.exports = P2pServer;
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

const HTTP_PORT = process.env.HTTP_PORT || 3001;
const app = express();

app.use(bodyParser.json());

const bc = new Blockchain(); 
const wallet = new Wallet();
const tp = new TransactionPool();

const p2pServer = new P2pServer(bc, tp); 

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
GET
localhost:3002/transactions
```

``` POST MAN RESULT
[]
```

``` POST MAN REQUEST
POST
body -> raw -> application/json
localhost:3001/transact
```

``` json json
{
	"receipient": "foo-21mkt31",
	"amount" : 50
}
```

``` POST MAN RESULT
[
    {
        "id": "da948c90-8d96-11e9-9841-877176763fb2",
        "input": {
            "timestamp": 1560401466329,
            "amount": 500,
            "address": "047e625b6e7ecc13ad30ce594d24ad08a1b452c37410ab96986f7410923eef7dee5753ebe728c4f836690c631900a2f6419921ae3641352b53e9ac5d5f54bf53f9",
            "signature": {
                "r": "b2f1d225e4bc4b2bdaaa0221fd6528eb8c72f880da8a3fce9d16a877e53979b9",
                "s": "d7c08b2357bdf32836377cf4145e38c3041ac00327cda7df717621348fd9ea34",
                "recoveryParam": 0
            }
        },
        "outputs": [
            {
                "amount": 450,
                "address": "047e625b6e7ecc13ad30ce594d24ad08a1b452c37410ab96986f7410923eef7dee5753ebe728c4f836690c631900a2f6419921ae3641352b53e9ac5d5f54bf53f9"
            },
            {
                "amount": 50,
                "address": "foo-21mkt31"
            }
        ]
    }
]
```

``` json json
{
	"receipient": "foo-21mkt31",
	"amount" : 50
}
```

``` POST MAN RESULT
[
    {
        "id": "da948c90-8d96-11e9-9841-877176763fb2",
        "input": {
            "timestamp": 1560401488157,
            "amount": 500,
            "address": "047e625b6e7ecc13ad30ce594d24ad08a1b452c37410ab96986f7410923eef7dee5753ebe728c4f836690c631900a2f6419921ae3641352b53e9ac5d5f54bf53f9",
            "signature": {
                "r": "35833862ebb52663578b5ff1f3738efaaf79a8f8f8d4246f4b8be435b0508666",
                "s": "b16d3e9308c787c11d29a92707f83799170e3b404695b73c5636717790c87c",
                "recoveryParam": 0
            }
        },
        "outputs": [
            {
                "amount": 400,
                "address": "047e625b6e7ecc13ad30ce594d24ad08a1b452c37410ab96986f7410923eef7dee5753ebe728c4f836690c631900a2f6419921ae3641352b53e9ac5d5f54bf53f9"
            },
            {
                "amount": 50,
                "address": "foo-21mkt31"
            },
            {
                "amount": 50,
                "address": "foo-21mkt31"
            }
        ]
    }
]
```

``` POST MAN REQUEST

POST
body -> raw -> application/json
localhost:3002/transact

```

``` json json
{
	"receipient": "bar-21mkt31",
	"amount" : 50
}
```

``` POST MAN RESULT

[
    {
        "id": "da948c90-8d96-11e9-9841-877176763fb2",
        "input": {
            "timestamp": 1560401488157,
            "amount": 500,
            "address": "047e625b6e7ecc13ad30ce594d24ad08a1b452c37410ab96986f7410923eef7dee5753ebe728c4f836690c631900a2f6419921ae3641352b53e9ac5d5f54bf53f9",
            "signature": {
                "r": "35833862ebb52663578b5ff1f3738efaaf79a8f8f8d4246f4b8be435b0508666",
                "s": "b16d3e9308c787c11d29a92707f83799170e3b404695b73c5636717790c87c",
                "recoveryParam": 0
            }
        },
        "outputs": [
            {
                "amount": 400,
                "address": "047e625b6e7ecc13ad30ce594d24ad08a1b452c37410ab96986f7410923eef7dee5753ebe728c4f836690c631900a2f6419921ae3641352b53e9ac5d5f54bf53f9"
            },
            {
                "amount": 50,
                "address": "foo-21mkt31"
            },
            {
                "amount": 50,
                "address": "foo-21mkt31"
            }
        ]
    },
    {
        "id": "24d88ae0-8d97-11e9-a2aa-03d2d3d0735e",
        "input": {
            "timestamp": 1560401590927,
            "amount": 500,
            "address": "043f6c0849a1267831e351413940383f14929bd805a82c1e527129c1a20837297641b6108088fc82f552c3d1addc6c5eca8136582ce1f28bc6d16ce8b91307b2a2",
            "signature": {
                "r": "8b56a66b3336917804d0d720d983c1a6966f94f8db4b164382bc17e5f2618dbe",
                "s": "eceaaa48c0694ae6352647a86ca1633247bb24ab603d4f75af5dfaf8d0fae930",
                "recoveryParam": 0
            }
        },
        "outputs": [
            {
                "amount": 450,
                "address": "043f6c0849a1267831e351413940383f14929bd805a82c1e527129c1a20837297641b6108088fc82f552c3d1addc6c5eca8136582ce1f28bc6d16ce8b91307b2a2"
            },
            {
                "amount": 50,
                "address": "bar-21mkt31"
            }
        ]
    }
]

```

``` POST MAN REQUEST

POST
body -> raw -> application/json
localhost:3001/transact

```

``` json json
{
	"receipient": "fuga-21mkt31",
	"amount" : 50
}
```

``` POST MAN RESULT
[
    {
        "id": "da948c90-8d96-11e9-9841-877176763fb2",
        "input": {
            "timestamp": 1560401668083,
            "amount": 500,
            "address": "047e625b6e7ecc13ad30ce594d24ad08a1b452c37410ab96986f7410923eef7dee5753ebe728c4f836690c631900a2f6419921ae3641352b53e9ac5d5f54bf53f9",
            "signature": {
                "r": "3fe21cc075668f046cbd317c7bef36b46399d20e9361676ec1587b7a56f1b49f",
                "s": "d4a41605908c26e9abc23fae94b8733029fb3625e438a5a817cd135e0fb8dc5c",
                "recoveryParam": 1
            }
        },
        "outputs": [
            {
                "amount": 350,
                "address": "047e625b6e7ecc13ad30ce594d24ad08a1b452c37410ab96986f7410923eef7dee5753ebe728c4f836690c631900a2f6419921ae3641352b53e9ac5d5f54bf53f9"
            },
            {
                "amount": 50,
                "address": "foo-21mkt31"
            },
            {
                "amount": 50,
                "address": "foo-21mkt31"
            },
            {
                "amount": 50,
                "address": "fuga-21mkt31"
            }
        ]
    },
    {
        "id": "24d88ae0-8d97-11e9-a2aa-03d2d3d0735e",
        "input": {
            "timestamp": 1560401590927,
            "amount": 500,
            "address": "043f6c0849a1267831e351413940383f14929bd805a82c1e527129c1a20837297641b6108088fc82f552c3d1addc6c5eca8136582ce1f28bc6d16ce8b91307b2a2",
            "signature": {
                "r": "8b56a66b3336917804d0d720d983c1a6966f94f8db4b164382bc17e5f2618dbe",
                "s": "eceaaa48c0694ae6352647a86ca1633247bb24ab603d4f75af5dfaf8d0fae930",
                "recoveryParam": 0
            }
        },
        "outputs": [
            {
                "amount": 450,
                "address": "043f6c0849a1267831e351413940383f14929bd805a82c1e527129c1a20837297641b6108088fc82f552c3d1addc6c5eca8136582ce1f28bc6d16ce8b91307b2a2"
            },
            {
                "amount": 50,
                "address": "bar-21mkt31"
            }
        ]
    }
]
```






## 補足解説

口座取引 P2Pサーバーを構築、公開方法を取り扱いました。

トランザクション情報が同期され、
各ウォレットのトランザクションが
描き貯められていくことが確認できます。

このレッスンは以上になります。

お疲れ様でした。
