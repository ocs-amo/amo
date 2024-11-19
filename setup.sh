#!/bin/bash
set -e  # エラー時にスクリプトを停止

# リポジトリの最新情報を取得
echo "Fetching updates from the remote repository..."
git fetch --all

# ローカルの変更を一時的に退避
echo "Stashing local changes..."
git stash

# リモートリポジトリから最新の変更を取得してマージ
echo "Pulling latest changes from remote..."
git pull origin main  # もしくは必要なブランチ名に変更してください

# Docker Compose 起動
echo "Starting Docker Compose..."
docker compose up -d

# pnpm コマンド群
echo "Running pnpm commands..."
pnpm migrate
pnpm generate
pnpm seed
pnpm build
pnpm start:custom

# 必要であれば stash を復元
# echo "Restoring stashed changes..."
# git stash pop
