#!/bin/bash

# バージョンを更新するスクリプト
# 使用方法: ./update-version.sh <version>
# 更新対象: package.json, public/manifest.json, package-lock.json

set -e

VERSION="$1"

if [ -z "$VERSION" ]; then
  echo "Error: VERSION is not defined"
  exit 1
fi

# package.jsonのバージョンを更新
if [ -f "package.json" ]; then
  sed -i "s/\"version\": \"[0-9]\+\.[0-9]\+\.[0-9]\+\"/\"version\": \"$VERSION\"/" package.json
  echo "Updated package.json version to $VERSION"
else
  echo "Error: package.json not found"
  exit 1
fi

# public/manifest.jsonのバージョンを更新
if [ -f "public/manifest.json" ]; then
  sed -i "s/\"version\": \"[0-9]\+\.[0-9]\+\.[0-9]\+\"/\"version\": \"$VERSION\"/" public/manifest.json
  echo "Updated public/manifest.json version to $VERSION"
else
  echo "Error: public/manifest.json not found"
  exit 1
fi

# バージョン更新の検証
if ! grep -q "\"version\": \"$VERSION\"" package.json; then
  echo "Error: Version update failed in package.json"
  exit 1
fi

if ! grep -q "\"version\": \"$VERSION\"" public/manifest.json; then
  echo "Error: Version update failed in public/manifest.json"
  exit 1
fi

# package-lock.jsonを更新
npm install --package-lock-only

echo "Version update completed successfully: $VERSION"

