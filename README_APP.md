# Base Chain Wallet Activity Viewer

Basechェーン上のウォレットアドレスのアクティビティを検索・表示するWebアプリケーションです。

## 機能

- ✅ ウォレットアドレスの入力検索
- ✅ ETH残高の表示
- ✅ トランザクション履歴の表示
- ✅ トランザクション種別の分類（送信/受信/コントラクト）
- ✅ Basescan へのリンク付き
- ✅ レスポンシブデザイン
- ✅ リアルタイムのアクティビティ統計

## 使い方

1. `index.html` をWebブラウザで開く
2. ウォレットアドレスを入力（`0x...` で始まる40文字の16進数）
3. 「検索」ボタンをクリック
4. ウォレット情報とトランザクション履歴が表示されます

## 技術スタック

- HTML5
- CSS3（グラデーション、グリッドレイアウト）
- Vanilla JavaScript（非同期処理）
- Basescan API（統合可能）

## APIキー設定

実際のデータを取得するには、以下の手順を実行してください：

1. [Basescan.org](https://basescan.org) にアクセス
2. アカウント登録/ログイン
3. APIキーを取得
4. `script.js` の `BASE_API_KEY` に設定

```javascript
const BASE_API_KEY = 'あなたのAPIキー';
```

## 現在の実装

現在はデモンストレーション用のモックデータを使用しています。
APIキーを設定することで、実際のBaseチェーンデータを取得できます。

## ブラウザ互換性

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- モバイルブラウザ: ✅

## ライセンス

MIT License
