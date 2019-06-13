# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

P2P Socket通信

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
    socket.send(JSON.stringify(this.blockchain.chain));
  }

  messageHandler(socket) {
    socket.on('message', message => {
      const data = JSON.parse(message);
      console.log('data', data);
    })
  }
}

module.exports = P2pServer;
```

``` bash terminal
npm run dev
```

## POST MAN

``` POST MAN REQUEST
POST
http://localhost:3001/mine
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
        "timestamp": 1560387204128,
        "lastHash": "h4r0-h123",
        "hash": "80e681174857b6a002326e0a86e893d170b20d6eb522cb4bfdcd81959e1c0319",
        "data": "hello"
    }
]
```

``` bash terminal new tab
HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev
```

``` bash terminal result

 fixer: ~/dev/lectures/20190613/t2/lesson013 [git:master] 
👍 >npm run dev

> lesson002@1.0.0 dev /Users/tech/dev/lectures/20190613/t2/lesson013
> nodemon ./app

[nodemon] 1.19.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node ./app`
Listening on port 3001
ブロックが追加されました。Block
      Timestamp : 1560387204128
      lastHash  : h4r0-h123
      hash      : 80e6811748
      data      : hello
Socket connected
data [ { timestamp: 'timestamp',
    lastHash: '----',
    hash: 'h4r0-h123',
    data: [] } ]

```




``` bash terminal new tab result
fixer: ~/dev/lectures/20190613/t2/lesson013 [git:master] 
🌏 >cHTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev

> lesson002@1.0.0 dev /Users/tech/dev/lectures/20190613/t2/lesson013
> nodemon ./app

[nodemon] 1.19.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node ./app`
Listening on port 3002
Socket connected
data [ { timestamp: 'timestamp',
    lastHash: '----',
    hash: 'h4r0-h123',
    data: [] },
  { timestamp: 1560387204128,
    lastHash: 'h4r0-h123',
    hash:
     '80e681174857b6a002326e0a86e893d170b20d6eb522cb4bfdcd81959e1c0319',
    data: 'hello' } ]
```

## 補足解説

今回は、P2P ServerのSocket通信を取り扱いました。

socket.sendとsocket.onを活用することで、
socket通信を実現しています。

このレッスンは以上になります。

お疲れ様でした。
