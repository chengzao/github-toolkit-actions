# Create Changelog GitHub Action

这个action用于使用changlogithub工具自动创建变更日志。

## 重要提示

⚠️ **必须在工作流中配置 `fetch-depth: 0`**

此 Action 依赖完整的 Git 提交历史来生成准确的变更日志。如果未正确配置 `fetch-depth: 0`，将会出现以下错误：

```
Error: Shallow repository detected!
```

请确保在工作流中配置：

```yaml
- name: Check out code
  uses: actions/checkout@v4
  with:
    fetch-depth: 0
```

> 💡 **为什么需要 fetch-depth: 0？**
> 
> 在 GitHub Actions 中，`actions/checkout` 默认只获取最近一次提交（fetch-depth: 1）。
> 这会导致 Action 无法访问完整的提交历史，进而无法生成准确的变更日志。
> 
> `fetch-depth: 0` 表示获取完整的提交历史，是生成 changelog 的必要条件。

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
        uses: chengzao/github-toolkit-actions/changelog-v4@main
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```

## 输入参数

| 参数名 | 描述 | 必需 | 默认值 |
|--------|------|------|--------|
| `token` | GitHub token用于创建changelog | 是 | - |

## 输出参数

| 输出名 | 描述 | 可能值 |
|--------|------|--------|
| `changelog_created` | changelog是否成功创建 | `true` - changelog成功创建<br>`false` - changelog创建失败或无需创建 |

## 使用输出参数

你可以在后续步骤中使用这个输出参数来执行条件操作：

```yaml
- name: Create Changelog
  id: changelog
  uses: chengzao/github-toolkit-actions/changelog-v4@main
  with:
    token: ${{ secrets.GITHUB_TOKEN }}

- name: Check changelog creation result
  run: |
    if [ "${{ steps.changelog.outputs.changelog_created }}" = "true" ]; then
      echo "✅ Changelog was created successfully"
    else
      echo "⚠️ Changelog was not created or creation failed"
    fi
```

## 输出参数详细说明

- `changelog_created`: 布尔值，表示changelog创建操作的状态
  - 当 changelogithub 工具成功运行时，值为 `true`
  - 当安装失败、运行失败或其他错误发生时，值为 `false`

## 要求

- Node.js >= 14.x
- npm >= 6.x
- GitHub token with appropriate permissions