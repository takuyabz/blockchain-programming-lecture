# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

ウォレットキーの公開

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

app.get('/public-key', (req, res) => {
  res.json({publickey : wallet.publicKey});
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();

```

``` bash terminal
npm run dev
```

### POST MAN

``` POST MAN REQUEST
GET
localhost:3001/public-key
```

``` POST MAN RESULT
{
    "publickey": "0488af909beb3d6f45e3ae163f580882c5edfb03662ff972fb6684d318c973f8448765f19af7a9b38ff686bf2000e720784d28d0c21976343b63a6c4d64b9e1917"
}
```

## 補足解説

ウォレット公開キーの公開方法を取り扱いました。

このレッスンは以上になります。

お疲れ様でした。
