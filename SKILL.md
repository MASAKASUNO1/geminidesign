---
name: design
description: geminidesign CLI でHTMLデザインを生成・管理する。Webページ、UIコンポーネント、ランディングページなどのデザイン作成時に使用。
argument-hint: "[デザインの説明]"
---

# geminidesign CLI

Gemini 3 Flash を使ってHTMLデザインを生成するCLIツール。
生成結果は呼び出しディレクトリの `.geminidesign/` に自動保存される。

## 初回セットアップ

APIキーが未設定なら先にログインさせる:

```bash
geminidesign login
```

## コマンド

### 生成

```bash
geminidesign gen "$ARGUMENTS"
```

出力先を指定する場合:

```bash
geminidesign gen "$ARGUMENTS" -o output.html
```

### 履歴一覧

```bash
geminidesign list
geminidesign list -n 10
```

### 過去の生成結果を表示

```bash
geminidesign show <id>
```

### 再生成（同じプロンプトで再度生成）

```bash
geminidesign regen <id>
geminidesign regen <id> -o improved.html
```

## 生成後の対応

1. 出力されたパスの HTML を Read で読み、内容を確認する
2. ユーザーの要望に応じて HTML を直接 Edit で修正する
3. 気に入らなければ `geminidesign regen <id>` で再生成する

## 注意

- 生成結果は `.geminidesign/{id}.html` に保存される
- 履歴メタデータは `.geminidesign/history.json` に記録される
- APIキーは `~/.config/geminidesign/credentials.json` に保存済み
- 環境変数 `GEMINI_API_KEY` があればそちらが優先される
