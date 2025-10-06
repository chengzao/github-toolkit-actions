# GitHub Actions 集合

这是一个从现有 workflow 文件封装而成的 GitHub Actions 集合，包含了常用的 CI/CD 功能。

## � 使用示例

查看 [example-workflow.yml](./example-workflow.yml) 了解完整的使用示例，包含本地使用和外部仓库引用的方式。

## 🔧 开发和测试

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