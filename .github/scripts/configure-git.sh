#!/bin/bash

# GitHub Actions用のGit設定を行うスクリプト
# 使用方法: ./configure-git.sh

set -e

git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"

echo "Git configuration completed"

