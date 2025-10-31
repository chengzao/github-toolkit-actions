# Create Changelog GitHub Action

这个 action 用于使用 changelogithub 工具自动创建变更日志，改为通过 npx 按指定版本执行，提供失败策略与参数透传能力。

## 功能特性

- 🚀 一键生成 GitHub Release 变更日志（基于 changelogithub）
- 📦 通过 npx 执行，支持指定 changelogithub 版本
- ⚙️ 支持参数透传（args），可灵活控制 from/to/tag/dry-run 等
- ⛔ 支持 fail_on_error，决定失败时是否终止工作流

## 用法

```yaml
name: Create Changelog

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
        uses: chengzao/github-toolkit-actions/changelog-v1@main
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          changelogithub_version: 'latest'   # 可选，默认 latest
          args: ''                           # 可选，透传给 changelogithub 的参数
          fail_on_error: 'false'             # 可选，失败时是否终止
```

## 输入参数

| 参数名 | 描述 | 必需 | 默认值 |
|--------|------|------|--------|
| `token` | GitHub token，用于创建 changelog | 是 | - |
| `changelogithub_version` | changelogithub 版本（如 0.12.7 或 latest） | 否 | `latest` |
| `args` | 透传给 changelogithub 的 CLI 参数 | 否 | `''` |
| `fail_on_error` | 失败时是否终止工作流 | 否 | `false` |

## 输出参数

| 输出名 | 描述 | 可能值 |
|--------|------|--------|
| `changelog_created` | changelog 是否成功创建 | `true` - 创建成功<br>`false` - 创建失败或跳过 |

## 使用输出参数

```yaml
- name: Create Changelog
  id: changelog
  uses: chengzao/github-toolkit-actions/changelog-v1@main
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    args: '--from=v1.2.0 --to=HEAD'   # 示例参数
    fail_on_error: 'true'

- name: Check changelog creation result
  run: |
    if [ "${{ steps.changelog.outputs.changelog_created }}" = "true" ]; then
      echo "✅ Changelog was created successfully"
    else
      echo "⚠️ Changelog was not created or creation failed"
    fi
```

## 输出参数详细说明

- `changelog_created`: 布尔值，表示 changelog 创建操作的状态
  - 当 changelogithub 工具成功运行时，值为 `true`
  - 当安装/执行失败或其他错误发生时，值为 `false`
  - 当 `fail_on_error` 为 `true` 且失败时，步骤将终止工作流

## 要求

- Node.js >= 14.x
- npm >= 6.x
- GitHub token with appropriate permissions（建议 workflow 设定 contents: write）