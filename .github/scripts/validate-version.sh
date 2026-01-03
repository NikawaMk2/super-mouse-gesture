#!/bin/bash

# バージョン形式を検証するスクリプト
# 使用方法: ./validate-version.sh <version>

set -e

VERSION="$1"

if [ -z "$VERSION" ]; then
  echo "Error: VERSION is not defined"
  exit 1
fi

# セマンティックバージョン形式 (x.y.z) をチェック
if ! echo "$VERSION" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+$'; then
  echo "Error: VERSION is not a version format (expected: x.y.z)"
  exit 1
fi

echo "Version format is valid: $VERSION"

