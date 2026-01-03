#!/bin/bash

# リリースブランチを作成するスクリプト
# 使用方法: ./create-release-branch.sh <version> <base-branch>
# 例: ./create-release-branch.sh 1.0.0 develop

set -e

VERSION="$1"
BASE_BRANCH="${2:-develop}"

if [ -z "$VERSION" ]; then
  echo "Error: VERSION is not defined"
  exit 1
fi

RELEASE_BRANCH="release/$VERSION"

# リリースブランチの存在確認
if git ls-remote --heads origin "$RELEASE_BRANCH" | grep -q .; then
  echo "Error: Release branch $RELEASE_BRANCH already exists"
  exit 1
fi

# ベースブランチをチェックアウト
git checkout "$BASE_BRANCH"

# リリースブランチを作成してプッシュ
git checkout -b "$RELEASE_BRANCH"
git push origin "$RELEASE_BRANCH"

echo "Release branch $RELEASE_BRANCH created successfully"

