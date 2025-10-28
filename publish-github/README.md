# Publish Package to GitHub Packages Action

一个用于发布包到 GitHub Packages 的 GitHub Action，包含版本检查功能。

## 功能特性

- 📦 发布到 GitHub Packages
- 🔍 检查版本避免重复发布
- 🧹 自动清理认证文件
- ⚠️ 完善的错误处理和日志记录
- 🔒 安全性检查和验证
- 🔧 自动校验 Node.js 和 npm 环境

## 使用方法

```yaml
name: Publish Package

permissions:
  contents: write
  packages: write

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
          cache: 'yarn'

      - name: Install Dependencies
        run: yarn install

      - name: Build Packages
        run: yarn build

      - name: Publish package
        uses: chengzao/github-toolkit-actions/publish-github@main
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          registry: 'npm.pkg.github.com'
          scope: '@your-org'
```

## 输入参数

| 参数 | 描述 | 是否必需 | 默认值 |
|------|------|----------|--------|
| `token` | GitHub token，用于发布到 GitHub Packages | 是 | - |
| `registry` | 包注册表 URL | 否 | `'npm.pkg.github.com'` |
| `scope` | 包作用域（例如：@your-org） | 是 | - |

## 输出参数

| 输出名 | 描述 | 可能值 |
|--------|------|--------|
| `package_name` | 发布的包名称 | 包名称字符串 |
| `package_version` | 发布的包版本 | 版本号字符串 |
| `publish_success` | 包是否成功发布 | `true` - 发布成功<br>`false` - 发布失败或跳过 |
| `skip_publish` | 是否因版本已存在而跳过发布 | `true` - 跳过发布<br>`false` - 正常发布流程 |

## 使用输出参数

你可以在后续步骤中使用这些输出参数来执行条件操作：

```yaml
- name: Publish package
  id: publish_pkg
  uses: chengzao/github-toolkit-actions/publish-github@main
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    registry: 'npm.pkg.github.com'
    scope: '@your-org'

- name: Check publish result
  run: |
    echo "包名称: ${{ steps.publish_pkg.outputs.package_name }}"
    echo "包版本: ${{ steps.publish_pkg.outputs.package_version }}"
    
    if [ "${{ steps.publish_pkg.outputs.publish_success }}" = "true" ]; then
      echo "✅ 包发布成功"
      # 在这里添加发布成功后的逻辑
    elif [ "${{ steps.publish_pkg.outputs.skip_publish }}" = "true" ]; then
      echo "⚠️ 版本已存在，跳过发布"
      # 在这里添加跳过发布后的逻辑
    else
      echo "❌ 包发布失败"
      # 在这里添加发布失败后的逻辑
    fi
```

## 输出参数详细说明

- `package_name`: 字符串，从 package.json 读取的包名称
- `package_version`: 字符串，从 package.json 读取的版本号
- `publish_success`: 布尔值，表示发布操作是否成功
  - 当发布成功时，值为 `true`
  - 当发布失败或因版本存在跳过时，值为 `false`
- `skip_publish`: 布尔值，表示是否因版本已存在而跳过发布
  - 当版本已存在且跳过发布时，值为 `true`
  - 当正常发布流程时，值为 `false`

## 工作流程

1. **检出代码** - 获取仓库的完整历史
2. **设置 Node.js** - 配置指定版本的 Node.js 环境
3. **环境校验** - 验证 Node.js 和 npm 环境是否可用
4. **配置认证** - 创建 .npmrc 文件进行 GitHub Packages 认证
5. **版本检查** - 检查包版本是否已存在
6. **发布包** - 如果版本不存在，则发布到 GitHub Packages
7. **清理** - 自动删除认证文件

**注意**：构建过程需要在调用此 Action 之前完成

## 环境要求

- 需要有效的 `package.json` 文件
- 需要 GitHub Packages 访问权限
- 需要有效的 GitHub token
- 需要 Node.js 和 npm 环境（Action 会自动校验）
- 包需要在调用此 Action 之前构建完成

## 认证配置

Action 会自动创建 `.npmrc` 文件，包含必要的认证信息：

```
@your-scope:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN
```

## 本地开发

在本地开发时，可以通过以下方式引用：

```yaml
uses: ./publish-github
```

## 许可证

MIT License