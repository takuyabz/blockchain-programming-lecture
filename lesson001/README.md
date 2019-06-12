# チュートリアル

ブロックチェーンプログラミング講座 lesson001

タイトル：環境を構築する。

この講座では、Node.jsでブロックチェーンプログラミング
を学ぶことができます。

Node.jsは、2009年に登場し、推奨版と最新版の
2種類がダウンロードできます。

https://github.com/nodejs/node

公式では、ChromeのV8 JavaScriptエンジン上に
構築されたJavaScriptランタイムと説明されています。

Chrome V8とは、Googleによって構築された
オープンソースです。

オープンソースとは、一般の人に公開され、
誰でも変更したり共有することが可能です。

ランタイムとは、プログラムの実行中に
実行されるソフトウェア/命令、コードを
正しく実行するために必要な命令を記述したものです。

...

なるほど、わからん＼＼\٩(๑`^´๑)۶//／／

となるのが普通だと思います。

...

このように色々な角度から解説していくことは
できるのですが、解説し、補足説明していくと
専門用語が増えてしまい、本質的な理解が遠ざかります。

この講座では、ステップバイステップで、
手を動かしながら、実際に実体験を通して、
学びを促していく方法を採用していきます。

体験してから、なぜ必要か、学んだことは何だったのか、
具体的な手順を整理して、スキルの定着化を図ります。

それでは、これからステップバイステップで
実際に一緒に学んでいきましょう。

この講座を終える頃には、
一通りのブロックチェーンとは一体何なのか、
なぜ必要なのか、具体的にどのように構築するのかが
わかるでしょう。

さらなる応用方法も同時に習得していく方法も
紹介していきますので、楽しみにしていてください。

STEP01. Install Node.js

https://nodejs.org/ja/

上記サイトからNode.jsをダウンロードして
インストールしてください。

推奨版と最新版がありますが、
推奨版を導入してください。

インストールしたら、
Node.jsコマンドが有効になっているかを
確認するために、ターミナルで
動作確認をしていきます。

Macの場合は、Spotlight検索に「ターミナル」と
入力すると立ち上げできます。

Spotlight検索は、Macの画面上部にあるメニュー
アイコンで虫眼鏡をクリックすることで実行できます。

Windowsの場合は、コマンドプロンプトか
PowerShellで実行確認できます。

Powershellの起動方法は、スタートメニューから
Powershellー＞Powershellを選ぶ、または、
検索ボックスでPowershellと入力いただくことで
起動できます。

ターミナルが立ち上がったら、次のコマンドを
入力して、動作を確認していきます。

``` bash terminal
node -v
npm -v
```

``` bash result
 fixer: ~/dev/lectures/20190613/t2/lesson001 
🌏 >node -v
v10.16.0

 fixer: ~/dev/lectures/20190613/t2/lesson001 
🌏 >npm -v
6.9.0
```

Node.jsが導入されたことが確認できました。

STEP02. エディタの導入

この講座ではVS Codeというエディタを使って
プログラミングソースコードを構築していきます。

VS Codeは下記のURLからダウンロード、
インストールできますので、インストールしてください。

https://azure.microsoft.com/ja-jp/products/visual-studio-code/

簡単な使い方は下記が参考になります。

https://code.visualstudio.com/docs/getstarted/tips-and-tricks

特にチェックしておきたいところとしては、
CLI InterfaceとExtensionです。

CLI Interfaceは、Terminalで、VS Codeを立ち上げる方法
が解説されています。

Extensionは、VS Codeをより生産性高く開発するための
拡張機能の導入が解説されています。

オススメする拡張機能を一覧化して紹介しますので、
導入してください。

- Auto Close Tag
- Auto Rename Tag
- Bracker Pair Colozier
- Indent-Rainbow
- Material Icon Theme
- Material Theme
- npm Intelisense
- Path Intelisense
- solidity
- Terminal
- Terminal Tabs
- Vetur
- Visual Studio InteliCode
- vue
- Vue 2 Snippets
- Vue Snippets(vue-ls)
- Vue VSCode Snippets
- vue-beautify
- vue-format
- WakaTime

今は一つ一つ何かわかりづらいですが、
ステップバイステップで理解が深まっていきますので、
ご安心ください。

STEP03. プロジェクトの作成

Node.jsをインストールしたら、
早速Node.jsを使ったプログラムを作っていきましょう。

まず最初にやるのが、プロジェクトの作成です。

ターミナルで次のコマンドを実行してみてください。

``` bash terminal
npm init -y
```

すると次のような内容のファイル`package.json`が
出来上がります。

``` js package.json
{
  "name": "lesson001",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "Takuya Sato <business@satotakuya.jp> (https://www.satotakuya.jp/)",
  "license": "ISC"
}
```

試しにプログラムを実際に作ってみましょう。

VS Codeを立ち上げます。

package.jsonがあるフォルダで、
`sample.js`というファイル名を作り、
下記の内容を保存してください。

``` js
console.log("hello world");
```

保存したら、ターミナルを立ち上げて実行します。

VS CodeのExtension Terminal Tabsを
導入していただくと、VS Codeの下部の青いエリアから
プロジェクトフォルダ内で
ターミナルを立ち上げることができます。

詳しくはVS Code ExtensionのTerminal Tabsの
解説を確認してください。

それでは、ターミナルで次のように
コマンドを実行してみましょう。

``` bash terminal
node sample.js
```

すると次のように出力されます。

``` bash result
hello world
```

これで基本的なNode.jsの最初の
動かし方を体験していただくことができました。

以上でこのレッスンは終了です。

お疲れ様でした。


