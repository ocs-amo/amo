# 環境構築

1. `.env`ファイルを作成し必要な環境変数を設定

```env
NEXTJS_PORT=8080
```

2. 必要なライブラリをインストール

lintツール

```bash
npm i
```

アプリ

```bash
docker compose run --rm nextjs-app npm i
```

3. コンテナの起動

```bash
docker compose up -d
```

4. コンテナの終了

```bash
docker compose down
```