# Publish Package to GitHub Packages Action

一个用于构建并发布包到 GitHub Packages 的 GitHub Action，包含版本检查功能。

## 功能特性

- 🔨 自动构建包（支持 npm/yarn/pnpm）
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
      - name: Publish package
        uses: chengzao/toolkit-actions/publish-package@main
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          node-version: '20'
          package-manager: 'yarn'
          build-script: 'build'
          registry: 'npm.pkg.github.com'
          scope: '@your-org'
```

## 输入参数

| 参数 | 描述 | 是否必需 | 默认值 |
|------|------|----------|--------|
| `token` | GitHub token，用于发布到 GitHub Packages | 否 | `${{ github.token }}` |
| `node-version` | Node.js 版本 | 否 | `'20'` |
| `package-manager` | 包管理器（npm、yarn、pnpm） | 否 | `'yarn'` |
| `build-script` | 构建脚本名称 | 否 | `'build'` |
| `registry` | 包注册表 URL | 否 | `'npm.pkg.github.com'` |
| `scope` | 包作用域（例如：@your-org） | 否 | `'@YOLOTECHNOLOGY'` |

## 工作流程

1. **检出代码** - 获取仓库的完整历史
2. **设置 Node.js** - 配置指定版本的 Node.js 环境
3. **安装依赖** - 使用指定的包管理器安装依赖
4. **构建包** - 运行构建脚本
5. **配置认证** - 创建 .npmrc 文件进行 GitHub Packages 认证
6. **版本检查** - 检查包版本是否已存在
7. **发布包** - 如果版本不存在，则发布到 GitHub Packages
8. **清理** - 自动删除认证文件

## 环境要求

- 需要有效的 `package.json` 文件
- 需要构建脚本（默认：`build`）
- 需要 GitHub Packages 访问权限
- 需要有效的 GitHub token

## 认证配置

Action 会自动创建 `.npmrc` 文件，包含必要的认证信息：

```
@your-scope:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN
```

## 错误处理

- 如果版本已存在，Action 将跳过发布并退出
- 发布失败时会显示详细错误信息
- 自动清理认证文件，避免安全风险

## 支持的包管理器

- **npm** - Node Package Manager
- **yarn** - Yarn Package Manager
- **pnpm** - Performant NPM

## 项目结构

本 Action 遵循标准的 GitHub Actions 目录结构：

```
publish-package/
└── action.yml          # Action 配置文件
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