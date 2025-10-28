# Create Changelog GitHub Action

这个action用于使用changlogithub工具自动创建变更日志。

## 用法

```yaml
name: Build and Tag

permissions:
  contents: write

on:
  push:
    branches: [main, master]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Check out code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Create Changelog
        uses: chengzao/github-toolkit-actions/changelog@main
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```

## 输入参数

| 参数名 | 描述 | 必需 | 默认值 |
|--------|------|------|--------|
| `token` | GitHub token用于创建changelog | 是 | - |

## 输出参数

| 输出名 | 描述 |
|--------|------|
| `changelog_created` | changelog是否成功创建 (`true`/`false`) |

## 要求

- Node.js >= 14.x
- npm >= 6.x
- GitHub token with appropriate permissions