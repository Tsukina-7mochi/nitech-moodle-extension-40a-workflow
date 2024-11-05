# Web Extension for NITech Moodle 4.0

[![release](https://img.shields.io/github/v/release/nitech-create/nitech-moodle-extension-40a?include_prereleases)](https://github.com/nitech-create/nitech-moodle-extension-40a/releases/latest)

開発をお手伝いしてくださる方: [開発者向けドキュメント](./readme.dev.md)

## 概要

名古屋工業大学のオンライン授業サポートシステムとして採用されている Moodle (4.0)
の機能を改善・拡張して使いやすくするブラウザ用拡張機能です。非公式であり、問題が起きても責任は取れません。

Web Extension for Moodle 4.0 of NITech.

### 主な機能

- ダッシュボード ( トップページ ) に講義へのショートカットアクセスを追加
  - 今受けている講義だけを曜日・時間でソートして一覧表示
- 動画を画面内で大きく表示するように変更
- 時間割表の追加 (予定)
- 課題などのイベント締め切りにカウントダウン表示の追加
- ナビゲーションのコース表示をわかりやすいように変更
- ヘッダーのコース表示をわかりやすいように変更
- 強制ダウンロードリンクの無効化
- 全体的なスタイルの修正

## ブラウザ対応状況

| ブラウザ                              | 対応状況                 |
| ------------------------------------- | ------------------------ |
| Chrome (Windows 11, 111.0.5563.147)   | 開発中                   |
| Microsoft Edge (情報基盤センター推奨) | 開発中                   |
| Firefox                               | 現在非対応(今後対応予定) |

## 利用方法

### Chrome Web Store からインストール

準備中です

### GitHub からインストール

1. [Releases](https://github.com/nitech-create/nitech-moodle-extension-40a/(releases))
   から .zip ファイルをダウンロードする
   - または [ビルド方法](./how_to_build.md) に従ってビルドする
2. 拡張機能ページを開く
   - `chrome://extensions` をURL欄に入力する
   - またはEdgeブラウザ右上のクッキーみたいなアイコンを押して、「拡張機能の管理」をクリック
3. 開発者モードを有効にします
4. `manifest.json` が含まれるフォルダまたはダウンロードした .zip
   ファイルをドロップ
   - または「パッケージ化されていない拡張機能を読み込む」
