# Auto Tag Action

一个用于在 package.json 版本变更时自动创建 Git 标签的 GitHub Action。

## 功能特性

- 🔍 自动检测版本变更
- 🏷️ 创建 Git 标签

## 使用方法

```yaml
name: Auto Tag

permissions:
  contents: write

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

      - name: Auto tag
        uses: chengzao/github-toolkit-actions/version-tag@main
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          git_user_name: 'Your Name'
          git_user_email: 'your.email@example.com'
```

## 输入参数

| 参数 | 描述 | 是否必需 | 默认值 |
|------|------|----------|--------|
| `token` | GitHub token，用于创建标签 | 是 | - |
| `git_user_name` | Git 用户名称，通过环境变量传递给 git config | 否 | `'github-actions'` |
| `git_user_email` | Git 用户邮箱，通过环境变量传递给 git config | 否 | `'github-actions@github.com'` |

## 输出参数

| 输出名 | 描述 | 可能值 |
|--------|------|--------|
| `version` | 从 package.json 读取的版本号 | 版本号字符串（如：`1.0.0`） |
| `tag_exists` | 标签是否已存在 | `true` - 标签已存在<br>`false` - 标签不存在 |
| `tag_created` | 标签是否成功创建 | `true` - 标签成功创建和推送<br>`false` - 标签创建失败 |
| `tag_name` | 创建的标签名称 | 标签名称字符串（如：`v1.0.0`）<br>创建失败时为空字符串 |

## 使用输出参数

你可以在后续步骤中使用这些输出参数来执行条件操作：

```yaml
- name: Auto tag
  id: auto_tag
  uses: chengzao/github-toolkit-actions/version-tag@main
  with:
    token: ${{ secrets.GITHUB_TOKEN }}

- name: Check operation results
  run: |
    echo "检测到的版本: ${{ steps.auto_tag.outputs.version }}"
    echo "标签名称: ${{ steps.auto_tag.outputs.tag_name }}"
    
    if [ "${{ steps.auto_tag.outputs.tag_exists }}" = "true" ]; then
      echo "⚠️ 标签 ${{ steps.auto_tag.outputs.version }} 已存在，跳过操作"
    elif [ "${{ steps.auto_tag.outputs.tag_created }}" = "true" ]; then
      echo "✅ 标签创建成功: ${{ steps.auto_tag.outputs.tag_name }}"
    else
      echo "❌ 标签创建失败"
    fi
```

## 输出参数详细说明

- `version`: 字符串，从 package.json 读取的当前版本号
- `tag_exists`: 布尔值，表示检查的标签是否已存在
- `tag_created`: 布尔值，表示标签创建和推送是否成功
- `tag_name`: 字符串，成功创建的标签名称（格式：`v${version}`）
  - 当标签创建失败时，该值为空字符串

## 依赖要求

- 需要项目根目录存在 `package.json` 文件
- 需要 Git 仓库配置

## 本地开发

在本地开发时，可以通过以下方式引用：

```yaml
uses: ./version-tag
```

## 许可证

MIT License