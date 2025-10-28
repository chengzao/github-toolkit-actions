# Auto Tag and Changelog Action

一个用于在 package.json 版本变更时自动创建 Git 标签和变更日志的 GitHub Action。

## 功能特性

- 🔍 自动检测版本变更
- 🏷️ 创建 Git 标签
- 📝 生成 Changelog（可选）
- ✅ 避免重复标签
- 🚀 自动推送标签

## 使用方法

```yaml
name: Auto Tag and Changelog

on:
  push:
    paths:
      - 'package.json'

jobs:
  tag:
    runs-on: ubuntu-latest
    steps:
      - name: Check out code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          cache: 'yarn'

      - name: Auto tag and changelog
        uses: chengzao/github-toolkit-actions/version-tag@main
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          create_changelog: 'true'
```

## 输入参数

| 参数 | 描述 | 是否必需 | 默认值 |
|------|------|----------|--------|
| `token` | GitHub token，用于创建标签和变更日志 | 否 | `${{ github.token }}` |
| `create_changelog` | 是否使用 changelogithub 创建变更日志 | 否 | `'true'` |

## 输出

该 Action 会在工作流日志中输出：
- 当前版本号
- 标签创建状态
- 变更日志生成状态

## 依赖要求

- 需要项目根目录存在 `package.json` 文件
- 需要安装 `changelogithub` 包（用于生成变更日志）
- 需要 Git 仓库配置

## 安装依赖

```bash
npm install -g changelogithub
# 或
yarn global add changelogithub
```

## 本地开发

在本地开发时，可以通过以下方式引用：

```yaml
uses: ./version-tag
```

## 许可证

MIT License