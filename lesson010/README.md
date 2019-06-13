# チュートリアル

今回以降の講座では、一つ前のLessonが
完了している前提で解説を進めていますので、
まだ前のLessonが完了していない場合は、
前のLessonが完了してからチャレンジしてください。

HTTP APIサーバーを構築する。

``` bash terminal
mkdir blockchain
mv block.js blockchain/block.js
mv block.test.js blockchain/block.test.js
mv blockchain.js blockchain/index.js
mv blockchain.test.js blockchain/index.test.js
code blockchain/index.test.js
```

``` js blockchain/index.test.js
const Blockchain = require("./index");
// ...
```

``` bash terminal
npm run test
```

``` bash terminal
mkdir app
code app/index.js
```

``` js app/index.js
const express = require('express');
const Blockchain = require('../blockchain');

const HTTP_PORT = process.env.HTTP_PORT || 3001;
const app = express();
const bc = new Blockchain();

app.get('/blocks', (req, res) => {
  res.json(bc.chain);
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));

```

``` bash terminal
code package.json
```

``` json package.json
{
  // ...
  "scripts": {
    // ...
    "start" : "node ./app",
    "dev" : "nodemon ./app"
  },
  // ...
}
```

``` bash terminal
npm i express
npm run dev
```

``` bash result
fixer: ~/dev/lectures/20190613/t2/lesson010 [git:master] 
♥️ >npm run dev

> lesson002@1.0.0 dev /Users/tech/dev/lectures/20190613/t2/lesson010
> nodemon ./app

[nodemon] 1.19.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node ./app`
Listening on port 3001
```

## POST MAN立ち上げ

HTTP APIサーバーを検証するには、
Gogole Chrome　Extensionの
POST MANの利用がおすすめです。

導入は下記のサイトからできますので、
インストールしてください。

https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=ja

Google Chromeを利用していない場合は、
下記のサイトから Google Chromeを
ダウンロードしてインストールすることができます。

合わせて未導入の場合は、
インストールしてください。

https://www.google.com/intl/ja/chrome/

実際の使い方は、
Udemyレクチャーを確認してください。

https://www.udemy.com/cryptcurrency-master-course/learn/lecture/9782022#overview

``` postman request
GET
localhost:3001/blocks
```

``` postman response
[
    {
        "timestamp": "timestamp",
        "lastHash": "----",
        "hash": "h4r0-h123",
        "data": []
    }
]
```


## 補足解説

今回は、HTTP APIサーバーの構築について取り扱いました。

プロジェクトのフォルダ、ファイル構成を見直し、
最適化しています。

APIサーバーを構築して、動作確認するには、
POSTMANを利用すると生産性が引き上がります。

今回は、サーバーサイドのブロックチェーンの
内容を表示するという処理を構築しました。

さらに、メモリ上に展開されているので、
サーバーを再起動するとブロックチェーンデータは
クリアされることになります。

本番運営では、
何らかのストレージ（ファイルやデータベース）に
ブロックチェーンのデータを格納する必要がありますが、
学習目的を絞るために、ここでは構築を省いています。

HTTP APIサーバーの提供できると、
ブラウザベースで情報を開示できるようになったりと
幅が広がります。

Node.jsを使って、HTTPサーバーを作り、
POSTMANで動作確認し、サーバーを提供する
流れは様々なアプリケーション開発で応用が利きますので
ぜひ、習得してください。

このレッスンは以上になります。

お疲れ様でした。
