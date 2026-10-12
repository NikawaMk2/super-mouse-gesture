#!/bin/bash

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
TEMP_BASE="$(cd "${TMPDIR:-/tmp}" && pwd -P)"
TEST_ROOT="$(mktemp -d "$TEMP_BASE/smg-release-test.XXXXXX")"
TEST_ROOT="$(cd "$TEST_ROOT" && pwd -P)"
cleanup() {
  cd "$PROJECT_ROOT"
  case "$TEST_ROOT" in
    "$TEMP_BASE"/smg-release-test.*) rm -rf -- "$TEST_ROOT" ;;
    *) echo "Unexpected fixture path: $TEST_ROOT" >&2; return 1 ;;
  esac
}
trap cleanup EXIT
echo "Test fixture: $TEST_ROOT"

git init --bare "$TEST_ROOT/remote.git"
git init -b develop "$TEST_ROOT/work"
cd "$TEST_ROOT/work"
git config core.autocrlf false
git config user.name "Release test"
git config user.email "release-test@example.com"
git remote add origin "$TEST_ROOT/remote.git"
mkdir -p public
printf '{\n  "name": "release-test",\n  "version": "0.4.0",\n  "private": true\n}\n' > package.json
printf '{\n  "version": "0.4.0",\n  "manifest_version": 3\n}\n' > public/manifest.json
npm install --package-lock-only --ignore-scripts --offline
git add package.json package-lock.json public/manifest.json
git commit -m "Initial develop without release scripts"
git push origin develop

# developにスクリプトがない状態で、別チェックアウトのスクリプトを実行する。
mkdir -p .release-tools/.github/scripts
cp "$PROJECT_ROOT"/.github/scripts/*.sh .release-tools/.github/scripts/
SCRIPTS=".release-tools/.github/scripts"
bash "$SCRIPTS/validate-version.sh" 0.5.0
if bash "$SCRIPTS/validate-version.sh" invalid; then
  echo "Invalid version was accepted"
  exit 1
fi
bash "$SCRIPTS/create-release-branch.sh" 0.5.0 develop
test "$(git branch --show-current)" = "release/0.5.0"
if bash "$SCRIPTS/create-release-branch.sh" 0.5.0 develop; then
  echo "Existing release branch was accepted"
  exit 1
fi
bash "$SCRIPTS/update-version.sh" 0.5.0
bash "$SCRIPTS/commit-version-update.sh" 0.5.0 release/0.5.0

node --input-type=module <<'NODE'
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
for (const path of ['package.json', 'public/manifest.json', 'package-lock.json']) {
  assert.equal(JSON.parse(readFileSync(path, 'utf8')).version, '0.5.0');
}
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
assert.equal(lock.packages[''].version, '0.5.0');
NODE

test "$(git rev-parse HEAD)" = "$(git rev-parse origin/release/0.5.0)"
test "$(git --git-dir="$TEST_ROOT/remote.git" rev-parse refs/heads/release/0.5.0)" = "$(git rev-parse HEAD)"
test "$(git diff-tree --no-commit-id --name-only -r HEAD | sort)" = "$(printf '%s\n' package-lock.json package.json public/manifest.json | sort)"
echo "Release script integration checks passed"
