# Tag on Version Change Action

一个用于在 package.json 版本变更时自动创建 Git 标签的 GitHub Action。

## 功能特性

- 🔍 自动检测 `package.json` 版本变更
- 🏷️ 创建带 `v` 前缀的 Git 标签
- 📝 支持生成 Changelog（可选）
- ✅ 防止重复创建已存在的标签
- 🚀 自动推送标签到远程仓库

## 使用方法

```yaml
name: Create Tag on Version Change

on:
  push:
    paths:
      - 'package.json'

jobs:
  tag:
    runs-on: ubuntu-latest
    steps:
      - name: Create tag
        uses: chengzao/toolkit-actions/tag-on-version-change@main
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

## 项目结构

本 Action 遵循标准的 GitHub Actions 目录结构：

```
tag-on-version-change/
└── action.yml          # Action 配置文件
```

## 远程使用

当发布到 `chengzao/toolkit-actions` 仓库后，可以使用以下格式引用：

```yaml
uses: chengzao/toolkit-actions/tag-on-version-change@main
```

## 本地开发

在本地开发时，可以通过以下方式引用：

```yaml
uses: ./tag-on-version-change
```

## 许可证

MIT License