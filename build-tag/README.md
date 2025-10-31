# Build and Tag Action

一个用于在分支上自动创建带日期版本标签的 GitHub Action，已增强并发幂等与远端一致性处理，同时支持时区与日期格式可配置。

## 功能特性

- 📅 按日期生成版本标签（如：`release_2024_01_15_v1`）
- 🔢 自动递增每日版本号（当日首个为 v1，后续递增）
- 🏷️ 创建并推送标签到远端仓库
- 🌍 可配置时区（tz）与日期格式（date_format）
- 🛡️ 并发与幂等增强：远端/本地存在性检查，避免并行冲突
- 🌿 前缀为空时自动回退到触发分支名（`${{ github.ref_name }}`）
- 🧰 移除对 Node/npm 的依赖，仅需 git 环境

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

      - name: Build and tag
        uses: chengzao/github-toolkit-actions/build-tag@main
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          prefix: 'release'           # 可选，默认 'release'；为空则回退为触发分支名
          tz: 'UTC'                   # 可选，默认 'UTC'；例如 'Asia/Shanghai'
          date_format: '%Y_%m_%d'     # 可选，默认 '%Y_%m_%d'
          git_user_name: 'Your Name'  # 可选，默认 'github-actions'
          git_user_email: 'your.email@example.com' # 可选，默认 'github-actions@github.com'
```

## 输入参数

| 参数 | 描述 | 是否必需 | 默认值 |
|------|------|----------|--------|
| `token` | GitHub token，用于创建并推送标签 | 是 | - |
| `prefix` | 用于标签名称的前缀（为空时回退到触发分支名） | 否 | `'release'` |
| `git_user_name` | Git 用户名称，通过环境变量传递给 git config | 否 | `'github-actions'` |
| `git_user_email` | Git 用户邮箱，通过环境变量传递给 git config | 否 | `'github-actions@github.com'` |
| `tz` | 生成日期时使用的时区（例如：`UTC`、`Asia/Shanghai`） | 否 | `'UTC'` |
| `date_format` | 日期格式（strftime），例如：`%Y_%m_%d` | 否 | `'%Y_%m_%d'` |

## 输出参数

| 输出名 | 描述 | 可能值 |
|--------|------|--------|
| `tag_name` | 创建的标签名称 | 标签名称字符串（如：`release_2024_01_15_v1`）<br>创建失败时为空字符串 |
| `tag_created` | 标签是否成功创建并推送 | `true` - 标签成功创建和推送<br>`false` - 标签已存在或创建/推送失败 |

## 使用输出参数

你可以在后续步骤中使用这些输出参数来执行条件操作：

```yaml
- name: Build and tag
  id: build_tag
  uses: chengzao/github-toolkit-actions/build-tag@main
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    prefix: 'main'
    tz: 'Asia/Shanghai'
    date_format: '%Y_%m_%d'

- name: Use tag output
  run: |
    echo "创建的标签: ${{ steps.build_tag.outputs.tag_name }}"
    
    if [ "${{ steps.build_tag.outputs.tag_created }}" = "true" ]; then
      echo "✅ 标签创建并推送成功"
      # 在这里添加标签创建成功后的逻辑
      # 例如：触发发布流程、发送通知等
    else
      echo "⚠️ 标签已存在或创建失败"
      # 在这里添加标签已存在/失败时的逻辑
    fi
```

## 输出参数详细说明

- `tag_name`: 字符串，表示成功创建的标签名称
  - 格式：`${prefix}_${YYYY}_${MM}_${DD}_v${version}`
  - 日期由 `tz` 与 `date_format` 控制，默认为 UTC 和 `%Y_%m_%d`
  - 当创建失败时，该值为空字符串
  - 可用于后续步骤中的标签引用或通知

- `tag_created`: 布尔值，表示标签创建/推送操作的状态
  - 当标签成功创建并推送到远程仓库时，值为 `true`
  - 当标签已存在、创建标签失败或推送失败时，值为 `false`
  - 建议使用此参数进行条件判断来决定后续操作

## 标签命名规则

生成的标签格式为：`${prefix}_${YYYY}_${MM}_${DD}_v${version}`

例如：
- `release_2024_01_15_v1`
- `main_2024_01_15_v2`

## 版本递增逻辑

- 每天从 v1 开始
- 如果当天已有标签，则递增版本号（基于远端/本地最新标签）
- 使用语义版本排序 `sort -V` 选择最新版本号

## 依赖要求

- 需要 Git 仓库配置
- 需要配置 Git 用户信息
- 需要配置 Token 以允许推送标签
- 不需要 Node.js 或 npm 环境

## 本地开发

在本地开发时，可以通过以下方式引用：

```yaml
uses: ./build-tag
```

## 许可证

MIT License