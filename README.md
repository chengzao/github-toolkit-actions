# GitHub Actions 集合

这是一个从现有 workflow 文件封装而成的 GitHub Actions 集合，包含了常用的 CI/CD 功能。

## 📦 包含的 Actions

### 1. [🏷️ Tag on Version Change](./tag-on-version-change/)
当 `package.json` 中的版本发生变化时自动创建 Git 标签。

**🔥 主要功能：**
- 🔍 自动检测 `package.json` 版本变更
- 🏷️ 创建带 `v` 前缀的 Git 标签
- 📝 支持生成 Changelog（可选）
- ✅ 防止重复创建已存在的标签
- 🚀 自动推送标签到远程仓库

### 2. [📅 Build and Tag](./build-tag/)
在指定分支上自动构建并创建带日期版本的标签。

**🔥 主要功能：**
- 📅 按日期生成版本标签（如：`main_2024_01_15_v1`）
- 🔢 自动递增每日版本号
- 🏷️ 创建和推送标签到远程仓库
- 📝 支持生成 Changelog（可选）
- ⚡ 智能版本管理，避免重复标签

### 3. [📦 Publish Package](./publish-package/)
构建并发布包到 GitHub Packages，包含版本检查和错误处理。

**🔥 主要功能：**
- 🔨 自动构建包（支持 npm/yarn/pnpm）
- 📦 发布到 GitHub Packages
- 🔍 检查版本避免重复发布
- 🧹 自动清理认证文件
- ⚠️ 完善的错误处理和日志记录
- 🔒 安全性检查和验证

## 🚀 快速开始

### 📝 前置要求

在使用这些 Actions 之前，请确保：

1. **GitHub Token**: 在仓库设置中启用 `packages: write` 权限
2. **Package Scope**: 确定你的组织或用户作用域（如 `@your-org`）
3. **Registry URL**: 确认你的 GitHub Packages 注册表 URL

### 🎯 基本使用示例

```yaml
# 发布包
- name: 🚀 Publish Package
  uses: bossjobmatt/toolkit-actions/publish-package@main
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    node-version: '20'
    package-manager: 'yarn'
    build-script: 'build'
    registry: 'npm.pkg.github.com'
    scope: '@your-organization'  # ⚠️ 替换为你的作用域
```

```yaml
# 版本变更标签
- name: 🏷️ Create Version Tag
  uses: bossjobmatt/toolkit-actions/tag-on-version-change@main
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    create_changelog: true
```

```yaml
# 构建标签
- name: 📅 Build and Tag
  uses: bossjobmatt/toolkit-actions/build-tag@main
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    branch: 'main'
    node-version: '20'
    create_changelog: true
```

## 📁 项目结构

本仓库使用以下结构组织 Actions：

```
├── publish-package/
│   └── action.yml          # 根目录的 Action 配置文件
├── tag-on-version-change/
│   └── action.yml          # 根目录的 Action 配置文件
├── build-tag/
│   └── action.yml          # 根目录的 Action 配置文件
├── actions/                # 源代码目录（可选）
│   ├── publish-package/
│   ├── tag-on-version-change/
│   └── build-tag/
└── README.md
```

每个 Action 在仓库根目录都有对应的文件夹，GitHub Actions 会在这些文件夹中查找 `action.yml` 文件。

## � 使用示例

查看 [example-workflow.yml](./example-workflow.yml) 了解完整的使用示例，包含本地使用和外部仓库引用的方式。

## 🔧 开发和测试

### 本地测试 Actions

```bash
# 克隆仓库
git clone <your-repo-url>
cd <your-repo-name>

# 安装依赖（如果需要）
npm install

# 运行本地测试
```

### 发布 Actions

1. 为每个 action 创建独立的仓库：
   ```bash
   mkdir tag-on-version-change-action
   cd tag-on-version-change-action
   # 复制相关文件...
   ```

2. 发布到 GitHub：
   ```bash
   git init
   git add .
   git commit -m "Initial release"
   git remote add origin <new-repo-url>
   git push -u origin main
   ```

## 📝 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📞 支持

如果您在使用过程中遇到问题，请：

1. 查看 Actions 的 README 文档
2. 查阅 GitHub Actions 官方文档
3. 提交 Issue 描述您的问题

---

**注意：** 使用这些 Actions 前，请确保您已经阅读并理解了相应的文档和配置要求。