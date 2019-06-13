# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

P2Pサーバーの構築

``` bash terminal
npm i ws
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
    console.log('Socket connect');
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
  res.redirect('/blocks');
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();
```

``` bash terminal
npm run dev
```

次にターミナルをもう一つタブで追加で立ち上げます。

``` bash terminal
HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev
HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev
```

``` bash terminal tab1 result
fixer: ~/dev/lectures/20190613/t2/lesson012 [git:master] 
😄 >npm run dev

> lesson002@1.0.0 dev /Users/tech/dev/lectures/20190613/t2/lesson012
> nodemon ./app

[nodemon] 1.19.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node ./app`
Listening on port 3001
Socket connect
Socket connect

```

``` bash terminal tab2 result
fixer: ~/dev/lectures/20190613/t2/lesson012 [git:master] 
😄 >HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev

> lesson002@1.0.0 dev /Users/tech/dev/lectures/20190613/t2/lesson012
> nodemon ./app

[nodemon] 1.19.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node ./app`
Listening on port 3002
Socket connect
Socket connect
```

``` bash terminal tab3 result
fixer: ~/dev/lectures/20190613/t2/lesson012 [git:master] 
🌏 >HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev

> lesson002@1.0.0 dev /Users/tech/dev/lectures/20190613/t2/lesson012
> nodemon ./app

[nodemon] 1.19.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node ./app`
Listening on port 3003
Socket connect
Socket connect
```

## 補足解説

今回は、P2P Serverの構築を取り扱いました。

一つのP2Pサーバーが一つの分散型台帳として
機能するように実装していくことになります。

Websocketを使うことで、P2P通信が
実現できることを確認できました。

このレッスンは以上になります。

お疲れ様でした。
