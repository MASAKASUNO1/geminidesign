# geminidesign

Gemini 3 Flash を使って、プロンプトからHTMLデザインを生成するCLIツール。

## インストール

```bash
npm install -g @aimasaou/geminidesign
```

## セットアップ

Gemini APIキーを設定します。

```bash
geminidesign login
```

環境変数 `GEMINI_API_KEY` が設定されている場合はそちらが優先されます。

## 使い方

### HTMLを生成する

```bash
geminidesign gen "モダンなランディングページ"
```

出力先を指定する場合:

```bash
geminidesign gen "お問い合わせフォーム" -o contact.html
```

### 生成履歴を確認する

```bash
geminidesign list
geminidesign list -n 10   # 表示件数を指定
```

### 過去の生成結果を表示する

```bash
geminidesign show <id>
```

### 同じプロンプトで再生成する

```bash
geminidesign regen <id>
geminidesign regen <id> -o improved.html
```

## データの保存先

| 種類 | パス |
|------|------|
| 生成HTML | `.geminidesign/{id}.html` (カレントディレクトリ) |
| 履歴メタデータ | `.geminidesign/history.json` |
| APIキー | `~/.config/geminidesign/credentials.json` |

## License

ISC
