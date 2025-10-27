# Publish Package to GitHub Packages Action

一个用于发布包到 GitHub Packages 的 GitHub Action，包含版本检查功能。

## 功能特性

- 📦 发布到 GitHub Packages
- 🔍 检查版本避免重复发布
- 🧹 自动清理认证文件
- ⚠️ 完善的错误处理和日志记录
- 🔒 安全性检查和验证

## 使用方法

```yaml
name: Publish Package

on:
  push:
    paths:
      - 'package.json'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Check out code
        uses: actions/checkout@v4
        with:
           fetch-depth: 0

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'yarn'

      - name: Install Dependencies
        run: yarn install

      - name: Build Packages
        run: yarn build

      - name: Publish package
        uses: chengzao/toolkit-actions/publish-package@main
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          node-version: '20'
          registry: 'npm.pkg.github.com'
          scope: '@your-org'
```

## 输入参数

| 参数 | 描述 | 是否必需 | 默认值 |
|------|------|----------|--------|
| `token` | GitHub token，用于发布到 GitHub Packages | 是 | - |
| `node-version` | Node.js 版本 | 否 | `'20'` |
| `registry` | 包注册表 URL | 否 | `'npm.pkg.github.com'` |
| `scope` | 包作用域（例如：@your-org） | 是 | - |

## 工作流程

1. **检出代码** - 获取仓库的完整历史
2. **设置 Node.js** - 配置指定版本的 Node.js 环境
3. **配置认证** - 创建 .npmrc 文件进行 GitHub Packages 认证
4. **版本检查** - 检查包版本是否已存在
5. **发布包** - 如果版本不存在，则发布到 GitHub Packages
6. **清理** - 自动删除认证文件

**注意**：构建过程需要在调用此 Action 之前完成

## 环境要求

- 需要有效的 `package.json` 文件
- 需要 GitHub Packages 访问权限
- 需要有效的 GitHub token
- 包需要在调用此 Action 之前构建完成

## 认证配置

Action 会自动创建 `.npmrc` 文件，包含必要的认证信息：

```
@your-scope:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN
```

## 远程使用

当发布到 `chengzao/toolkit-actions` 仓库后，可以使用以下格式引用：

```yaml
uses: chengzao/toolkit-actions/publish-package@main
```

## 本地开发

在本地开发时，可以通过以下方式引用：

```yaml
uses: ./publish-package
```

## 许可证

MIT License