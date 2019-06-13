# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

P2P ブロードキャスティング

``` bash terminal
code app/p2p-server.js
```

``` js app/p2p-server.js
const Websocket = require('ws');
const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2pServer {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  listen() {
    const server = new Websocket.Server({port: P2P_PORT});
    server.on('connection', socket => this.connectSocket(socket));
    this.connectPeers();
  }

  connectPeers() {
    peers.forEach( peer => {
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
    socket.send(JSON.stringify(this.blockchain.chain));
  }

  syncChain() {
    this.sockets.forEach(socket => {
      this.sendChain(socket);
    })
  }

  messageHandler(socket) {
    socket.on('message', message => {
      const data = JSON.parse(message);
      this.blockchain.replaceChain(data);
      console.log('data', data);
    })
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
const P2pServer = require("./p2p-server");

const HTTP_PORT = process.env.HTTP_PORT || 3001;
const app = express();

app.use(bodyParser.json());

const bc = new Blockchain(); 
const p2pServer = new P2pServer(bc); 

app.get('/blocks', (req, res) => {
  res.json(bc.chain);
});

app.post('/mine', (req, res) => {
  const block = bc.addBlock(req.body.data);
  console.log(`ブロックが追加されました。${block.toString()}`);
  p2pServer.syncChain();
  res.redirect('/blocks');
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();

```

``` bash terminal
npm run dev
```

``` bash terminal new tab
HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev
```

## POST MAN

``` POST MAN REQUEST
GET
http://localhost:3001/blocks
```

``` POST MAN RESULT
[
    {
        "timestamp": "timestamp",
        "lastHash": "----",
        "hash": "h4r0-h123",
        "data": []
    }
]
```

``` POST MAN REQUEST
POST
http://localhost:3002/mine
body -> raw -> JSON(application/json)
```

``` json REQUEST
{
  "data" : "hello"
}
```

``` POST MAN RESULT
[
    {
        "timestamp": "timestamp",
        "lastHash": "----",
        "hash": "h4r0-h123",
        "data": []
    },
    {
        "timestamp": 1560388031075,
        "lastHash": "h4r0-h123",
        "hash": "549e33372b50b8f201b51dbe70d88c9e750665061dfcefe05156bb6ca374c670",
        "data": "hello"
    }
]
```

``` POST MAN REQUEST
GET
http://localhost:3001/blocks
```

``` POST MAN RESULT
[
    {
        "timestamp": "timestamp",
        "lastHash": "----",
        "hash": "h4r0-h123",
        "data": []
    },
    {
        "timestamp": 1560388031075,
        "lastHash": "h4r0-h123",
        "hash": "549e33372b50b8f201b51dbe70d88c9e750665061dfcefe05156bb6ca374c670",
        "data": "hello"
    }
]
```

``` bash terminal result
fixer: ~/dev/lectures/20190613/t2/lesson014 [git:master] 
🌏 >npm run dev

> lesson002@1.0.0 dev /Users/tech/dev/lectures/20190613/t2/lesson014
> nodemon ./app

[nodemon] 1.19.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node ./app`
Listening on port 3001
Socket connected
ブロック数不足のため省略します
data [ { timestamp: 'timestamp',
    lastHash: '----',
    hash: 'h4r0-h123',
    data: [] } ]
最新ブロックチェーンデータに更新します
data [ { timestamp: 'timestamp',
    lastHash: '----',
    hash: 'h4r0-h123',
    data: [] },
  { timestamp: 1560388031075,
    lastHash: 'h4r0-h123',
    hash:
     '549e33372b50b8f201b51dbe70d88c9e750665061dfcefe05156bb6ca374c670',
    data: 'hello' } ]
```

``` bash terminal new tab result

fixer: ~/dev/lectures/20190613/t2/lesson014 [git:master] 
😄 >HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev

> lesson002@1.0.0 dev /Users/tech/dev/lectures/20190613/t2/lesson014
> nodemon ./app

[nodemon] 1.19.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node ./app`
Listening on port 3002
Socket connected
ブロック数不足のため省略します
data [ { timestamp: 'timestamp',
    lastHash: '----',
    hash: 'h4r0-h123',
    data: [] } ]
ブロックが追加されました。Block
      Timestamp : 1560388031075
      lastHash  : h4r0-h123
      hash      : 549e33372b
      data      : hello

```

## 補足解説

今回は、P2P Serverのブロードキャスティングを取り扱いました。

新たなP2P接続を試みた時に、
ブロックチェーンの更新を試みますが、
ブロック数が足りないということで、省略しています、
これは正しい挙動です。

続いて、新しいブロックチェーンサーバーに
マイン処理をリクエストしてブロックを追加すると、
ブロックが追加され、他のブロックチェーンサーバーに
新しいブロックチェーンデータで更新がかかります。

これで、分散型台帳のデータ同期ができるようになった
ことになります。

このレッスンは以上になります。

お疲れ様でした。
