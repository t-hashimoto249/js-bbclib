コンパイル
```
npx webpack
```

テスト
```$xslt
npx jest
```

実行
```$xslt
browser-sync start --server html
```


確認はjavascript debugで確認

このライブラリはブロックチェーンのプラットフォームであるbbc-1をブラウザ上のJSもしくはpureJS上で利用するためのライブラリです。
対応しているブラウザは、Google Chrome、Safari、FireFox、Edge、Internet Explorerです。
BBc-1: https://github.com/beyond-blockchain/bbc1
このライブラリでは、bbc-1プラットフォーム上で定義されているTransaction、Event、Asset、Reference、Relation、Signature、Witness、CrossRef、Pointer、KeyPairクラスで必要となる機能を提供します。
実際には、トランザクションへの署名、トランザクションの署名の検証、RestAPIを用いてbbc-1へトランザクションの挿入、トランザクションの検索を可能とします。
このモジュールはES6で書かれています。


インストール方法


使い方




