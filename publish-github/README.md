# Publish Package to GitHub Packages Action

一个用于发布包到 GitHub Packages 的 GitHub Action，已改进认证安全性、版本存在性检查与可配置发布选项。

## 功能特性

- 🔧 需要 Node.js 和 npm 环境（步骤内会校验）
- 🔒 使用临时 NPM 配置（$RUNNER_TEMP/npmrc），通过 NPM_CONFIG_USERCONFIG 指定，步骤结束自动清理
- 🧪 支持 dry run（--dry-run）
- 🏷️ 支持 dist-tag（--tag）
- 🔐 支持 access（--access），用于 npmjs 等需要时
- 🧭 作用域 scope 自动规范化（自动补全前缀 @）
- 🔁 在发布前检查版本是否已存在，存在则跳过并输出 skip_publish

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
          node-version: 18

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
          dry_run: 'false'          # 可选：是否 dry-run
          dist_tag: ''              # 可选：发布的 dist-tag（如：next、beta）
          access: ''                # 可选：npm access（public|restricted），GPR 通常无需
```

## 输入参数

| 参数 | 描述 | 是否必需 | 默认值 |
|------|------|----------|--------|
| `token` | GitHub token，用于发布到 GitHub Packages | 是 | - |
| `registry` | 包注册表域名（不含协议） | 否 | `'npm.pkg.github.com'` |
| `scope` | 包作用域（例如：@your-org），会自动规范化为以 `@` 开头 | 是 | - |
| `dry_run` | 是否以 dry-run 模式发布 | 否 | `'false'` |
| `dist_tag` | 指定 dist-tag（映射到 `npm publish --tag`） | 否 | `''` |
| `access` | 指定 access（映射到 `npm publish --access`） | 否 | `''` |

## 输出参数

| 输出名 | 描述 | 可能值 |
|--------|------|--------|
| `package_name` | 发布的包名称 | 包名称字符串 |
| `package_version` | 发布的包版本 | 版本号字符串 |
| `publish_success` | 包是否成功发布 | `true` - 发布成功<br>`false` - 发布失败或跳过 |
| `skip_publish` | 是否因版本已存在而跳过发布 | `true` - 跳过发布<br>`false` - 正常发布流程 |

## 使用输出参数

```yaml
- name: Publish package
  id: publish_pkg
  uses: chengzao/github-toolkit-actions/publish-github@main
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    registry: 'npm.pkg.github.com'
    scope: '@your-org'
    dist_tag: 'next'
    dry_run: 'false'

- name: Check publish result
  run: |
    echo "包名称: ${{ steps.publish_pkg.outputs.package_name }}"
    echo "包版本: ${{ steps.publish_pkg.outputs.package_version }}"
    
    if [ "${{ steps.publish_pkg.outputs.publish_success }}" = "true" ]; then
      echo "✅ 包发布成功"
    elif [ "${{ steps.publish_pkg.outputs.skip_publish }}" = "true" ]; then
      echo "⚠️ 版本已存在，跳过发布"
    else
      echo "❌ 包发布失败"
    fi
```

## 工作流程

1. 检出代码 - 获取仓库完整历史
2. 设置 Node.js - 配置指定版本 Node.js 环境
3. 环境校验 - 验证 Node.js 和 npm 环境是否可用
4. 配置认证 - 在临时目录生成 npmrc 文件，并通过 NPM_CONFIG_USERCONFIG 注入，仅在本作业中生效
5. 版本检查 - 查询目标版本是否已存在，存在则跳过
6. 发布包 - 根据输入选项执行 npm publish（支持 --dry-run、--tag、--access）
7. 清理 - 自动删除临时 npmrc

## 环境与认证说明

- 该 Action 会将 npm 配置写入 `$RUNNER_TEMP/npmrc`，并通过 `NPM_CONFIG_USERCONFIG` 环境变量仅对当前 Job 生效，避免污染 `$HOME/.npmrc`
- 会尝试执行 `npm whoami` 进行基本身份检查，失败不直接终止（发布阶段仍会校验）
- `scope` 会自动规范化为以 `@` 开头，最终 `.npmrc` 中将写入 `@scope:registry=...` 与对应的 token 行
- 如需发布到 npmjs.org，需要在 `registry`、`access` 等参数上进行相应调整

## 本地开发

在本地开发时，可以通过以下方式引用：

```yaml
uses: ./publish-github
```

## 许可证

MIT License