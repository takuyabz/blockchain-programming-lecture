# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

HTTP API経由でブロックマイニングリクエスト

``` bash terminal
npm i body-parser
code app/index.js
```

``` js app/index.js
const express = require('express');
const bodyParser = require("body-parser");
const Blockchain = require('../blockchain');

const HTTP_PORT = process.env.HTTP_PORT || 3001;
const app = express();

app.use(bodyParser.json());

const bc = new Blockchain();

app.get('/blocks', (req, res) => {
  res.json(bc.chain);
});

app.post('/mine', (req, res) => {
  const block = bc.addBlock(req.body.data);
  console.log(`ブロックが追加されました。${block.toString()}`);
  res.redirect('/blocks');
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
```

``` bash terminal
npm run dev
```

``` bash terminal result
 fixer: ~/dev/lectures/20190613/t2/lesson011 [git:master] 
👍 >npm run dev

> lesson002@1.0.0 dev /Users/tech/dev/lectures/20190613/t2/lesson011
> nodemon ./app

[nodemon] 1.19.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node ./app`
Listening on port 3001
```

## POST MAN

``` POSTMAN request
POST
localhost:3001/mine
body > raw > JSON(application/json)
```

``` json 
{
  "data" : "hello"
}
```

``` POST RESULT
[
    {
        "timestamp": "timestamp",
        "lastHash": "----",
        "hash": "h4r0-h123",
        "data": []
    },
    {
        "timestamp": 1560384600693,
        "lastHash": "h4r0-h123",
        "hash": "e5577696d4a3cdeb7aead88770026c5d8ecb507effd97dac46ac5de33eb10945",
        "data": "hello"
    }
]
```

``` bash terminal
 fixer: ~/dev/lectures/20190613/t2/lesson011 [git:master] 
👍 >npm run dev

> lesson002@1.0.0 dev /Users/tech/dev/lectures/20190613/t2/lesson011
> nodemon ./app

[nodemon] 1.19.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node ./app`
Listening on port 3001
ブロックが追加されました。Block
      Timestamp : 1560384600693
      lastHash  : h4r0-h123
      hash      : e5577696d4
      data      : hello
```

## 補足解説

今回は、HTTP APIのPOST処理の実装を取り扱いました。

ブロックマイニングリクエストをし、
HTTP API経由で
ブロックチェーンにブロックが追加できることを
確認しました。

このレッスンは以上になります。

お疲れ様でした。
