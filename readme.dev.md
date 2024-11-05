# Web Extension for NITech Moodle 4.0

## 機能実装の方針

- ホストに過剰な負荷をかけない
  - 必要以上の HTTP Request やリロードを行わない
  - すべての利用者が一斉にリクエストを行うような機能を避ける
  - ...
- すでに存在する DOM を削除して挿入しない
  - Moodle
    の機能によって追加されているイベントリスナの動作が怪しくなる可能性がある
- Moodle の DOM 構造、スタイルを再利用する
  - 例えばダッシュボードにブロックを追加するならすでに存在するブロックと同様の構造・クラス・属性の
    DOM を挿入する
  - ドロップダウンリストなどロジックを自前で実装しなくて済むことがあります
  - デザインの統一は重要です

## ワークフローについて

`main` ブランチから派生したブランチで作業し、 `main` ブランチに Pull request
を作成するという前提で作成しています。

- attach build artifact to release (`release-attach-artifact.yml`)
  - Release 時にビルドを実行し、ビルド成果物を Assets に追加する
- attach build artifact to release manually
  (`release-attach-artifact-manual.yml`)
  - 上記と同様のワークフローを手動で実行できるようにしたもの
- check latest version (`check-version-increase.yml`)
  - `main` ブランチへの PR を作成した際にバージョンが増えていることを確認する
  - バージョンは [Semantic Versioning 2.0](https://semver.org/lang/ja/)
    に準拠しています
- create- tag when PR is merged (`create-tag-on-pr-merge.yml`)
  - `main` ブランチへの PR がマージされたときに `manifest.json5`
    に書かれたバージョンのタグを作成する
- lint, check format and run build as test (`lint-fmt-test.yml`)
  - push の際に linter, formatter によるチェックとビルドが成功するかを確認する

## 開発環境

- Deno: `>= 1.32.x`

### 使用している主要なライブラリ

すべてのライブラリは `import_map.json` を参照

- esbuild: builder / bundler
- preact: 軽量版 React
- webextension-polyfill: WebExtension 標準に準拠した環境にする
  - グローバル名として `chrome` ではなく `browser` を使えます

### VSCode での開発環境のセットアップ

1. [ビルド方法](how_to_build.md) に従って環境を構築する
2. [Deno 用拡張機能](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
   をインストールする
3. 次のコマンドを実行する:

```sh
$deno task setup-vscode
```

4. VSCodeをリロードまたは再起動する

### ビルドなど

#### 前提条件

- [ビルド方法](how_to_build.md) に従って環境を構築してある必要があります

#### タスク

- 本番用ビルド

  ```sh
  $deno task build
  ```

- 開発用ビルド (import map が埋め込まれます; `web_accessible_resources`
  に指定すれば本番用とほぼ変わりません)

  ```sh
  $deno task dev
  ```

- 開発用ビルド (watch; ファイル変更時に自動で再ビルドします;
  一部プラグインによる出力は watch されません; Enter で手動再ビルド)

  ```sh
  $deno task watch
  ```

- キャッシュ・出力ディレクトリのクリーンアップ

  ```sh
  $deno task clean
  ```

- すべてのファイルのリモート `import` のキャッシュ (bash 環境のみ？)

  ```sh
  $deno task cache-all
  ```

### ビルド設定について

- `manifest.json5`
  からビルドするファイルの情報を生成しているため、拡張機能で読み込むファイルを指定すれば勝手にビルドしてくれます
  - 基本的に esbuild の設定はほとんどしなくて良いはずです

## ディレクトリ・ファイル構成

- `.github/workflows`: GitHub Actions 用ワークフロー
- `cache`: リモート `import` 用キャッシュディレクトリ
- `dist`: 出力先ディレクトリ
- `plugins`: ビルド用プラグイン
- `scripts`: ツールのスクリプト
- `src`: ソースファイル
  - `background`: バックグラウンド用リソース
  - `common`: すべてのコンテキストで共通のリソース
  - `content_scripts`: content_scripts 環境 (実際のページの環境)
    - `common`: すべてのページで共通のリソース
    - ... (各ページごとのリソース)
  - `popup`: ポップアップ (アイコンのクリック) 環境
  - `manifest.json5`: 拡張機能の設定ファイル (`manifest.json`
    として出力されます)
  - `manifestTypes.ts`: `manifest.json5` の型定義
- `build.ts`: ビルドスクリプト
- `deno.json`: Deno の環境設定ファイル
- `esbuild.*.ts`: esbuild の設定ファイル
- `import_map`: インポートマップ (エイリアス)
