# Build and Tag Action

一个用于在主分支上自动构建并创建带日期版本标签的 GitHub Action。

## 功能特性

- 📅 按日期生成版本标签（如：`main_2024_01_15_v1`）
- 🔢 自动递增每日版本号
- 🏷️ 创建和推送标签到远程仓库

## 使用方法

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

      - name: Build and tag
        uses: chengzao/github-toolkit-actions/build-tag@main
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          prefix: 'release'
          git_user_name: 'Your Name'
          git_user_email: 'your.email@example.com'
```

## 输入参数

| 参数 | 描述 | 是否必需 | 默认值 |
|------|------|----------|--------|
| `token` | GitHub token，用于创建标签和变更日志 | 是 | - |
| `prefix` | 用于标签名称的分支名 | 否 | `'release'` |
| `git_user_name` | Git 用户名称，通过环境变量传递给 git config | 否 | `'github-actions'` |
| `git_user_email` | Git 用户邮箱，通过环境变量传递给 git config | 否 | `'github-actions@github.com'` |


## 标签命名规则

生成的标签格式为：`${prefix}_${YYYY}_${MM}_${DD}_v${version}`

例如：
- `release_2024_01_15_v1`
- `main_2024_01_15_v2`

## 版本递增逻辑

- 每天从 v1 开始
- 如果当天已有标签，则递增版本号
- 按语义版本排序选择最新的版本号

## 依赖要求

- 需要 Git 仓库配置
- 需要配置 Git 用户信息
- 需要配置 Token 以允许推送标签


## 本地开发

在本地开发时，可以通过以下方式引用：

```yaml
uses: ./build-tag
```

## 许可证

MIT License