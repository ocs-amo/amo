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

# コミット規約

プルリクエストを作成する前に、あなたのコミットがこのリポジトリで使用されているコミット規約に準拠しているかどうかを確認してください。

コミットを作成する際は、次のカテゴリのいずれかを使用しながら、コミットメッセージで規約`カテゴリ: あなたのコミットメッセージ`に従うことをお願いします。

- `feat / feature`: 完全に新しいコードや新機能を導入した場合
- `fix`: バグを修正した変更の場合（可能であれば、詳細も記述する）
- `refactor`: `fix`でも`feat / feature`でもない、コード関連の変更をした場合
- `docs`: 既存のドキュメンテーションの変更や新しいドキュメンテーションを作成した場合（例：READMEやJSDocを記述）
- `build`: ビルドに関する変更、依存関係の変更、新しい依存関係の追加をした場合
- `test`: テストに関する変更をした場合（新しいテストの追加や既存のテストの変更）
- `ci`: 継続的インテグレーションの設定に関する変更をした場合（例：github actions、CIシステムなど）
- `chore`: 上記のいずれにも当てはまらないリポジトリへの変更をした場合

> [!TIP]
>
> 詳しい仕様については、[Conventional Commits](https://www.conventionalcommits.org)を確認するか、[Angular Commit Message Guidelines](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)を確認してください。
