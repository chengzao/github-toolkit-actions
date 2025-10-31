#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

DIR="changelog-v4"

if [ ! -d "$DIR" ]; then
  echo "[build-changelog-v4] 跳过：$DIR 不存在"
  exit 0
fi

echo "[build-changelog-v4] 开始构建 $DIR"

cd "$DIR"

if [ "${1-}" = "--install" ]; then
  if [ -f "package-lock.json" ]; then
    echo "[build-changelog-v4] npm ci"
    npm ci
  else
    echo "[build-changelog-v4] npm install"
    npm install
  fi
fi

npm run build

echo "[build-changelog-v4] 构建完成"

exit 0