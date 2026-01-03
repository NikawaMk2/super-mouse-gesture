#!/bin/bash

# バージョン更新の変更をコミットしてプッシュするスクリプト
# 使用方法: ./commit-version-update.sh <version> <branch>
# 例: ./commit-version-update.sh 1.0.0 release/1.0.0

set -e

VERSION="$1"
BRANCH="$2"

if [ -z "$VERSION" ]; then
  echo "Error: VERSION is not defined"
  exit 1
fi

if [ -z "$BRANCH" ]; then
  echo "Error: BRANCH is not defined"
  exit 1
fi

# Git設定
bash .github/scripts/configure-git.sh

# 変更をステージング
git add package.json
git add package-lock.json
git add src/manifest.json

# コミット
git commit -m "$VERSIONにアップデート"

# プッシュ
git push origin "$BRANCH"

echo "Version update committed and pushed to $BRANCH"

