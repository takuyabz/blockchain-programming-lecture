# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

口座取引APIを構築し公開する

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

### POST MAN

``` POST MAN REQUEST
GET
localhost:3001/transactions
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
	"receipient": "hoge-3341m",
	"amount" : 50
}
```

``` POST MAN RESULT
[
    {
        "id": "46432290-8d91-11e9-a9b2-7d63f5e0606e",
        "input": {
            "timestamp": 1560399070010,
            "amount": 500,
            "address": "041b54793cb90a161b92238382ffd4b362c63ac1c5306c2fb910c8fbfaf1fede3262022c4c1446ad6f04113a7d53c29f6d13cbbf281eb5472fff9fdf0159d54f08",
            "signature": {
                "r": "c086eaec208f8c88e990bd1c5e2c62fe9438209776233033362919dd800d758c",
                "s": "7e829393b2cfb6d97cbcc21dd9230517156d8df395101c58032679b849e6d5bf",
                "recoveryParam": 1
            }
        },
        "outputs": [
            {
                "amount": 450,
                "address": "041b54793cb90a161b92238382ffd4b362c63ac1c5306c2fb910c8fbfaf1fede3262022c4c1446ad6f04113a7d53c29f6d13cbbf281eb5472fff9fdf0159d54f08"
            },
            {
                "amount": 50,
                "address": "hoge-3341m"
            }
        ]
    }
]
```

## 補足解説

口座取引APIを構築、公開方法を取り扱いました。

初期残高500から、hoge-3341mさんへ
50を送金することがウォレットトランザクションを
作って動作確認することができました。

このレッスンは以上になります。

お疲れ様でした。
