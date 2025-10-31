# 🚀 GitHub Actions 事件触发大全（2025 版）

> **作者建议：** 将此文档保存为  
> `.github/docs/github-actions-events.md`  
> 并作为组织统一的 CI/CD 指南基础模板。

---

## 🧭 一、基础概念

GitHub Actions 的核心是事件驱动模型：  
每一个 workflow 都由 `on:` 定义的事件触发。

```yaml
on:
  <事件名>:
    <条件配置>
```

一个工作流可以同时响应多个事件：
```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
  schedule:
    - cron: '0 3 * * 1' # 每周一凌晨3点
```

---

## 🧱 二、核心事件分类

### 🧍 手动与计划触发

#### 1️⃣ 手动触发（workflow_dispatch）
```yaml
on:
  workflow_dispatch:
    inputs:
      env:
        description: 'Target environment'
        required: true
        default: 'production'
```
✅ **用途**：人工审批、生产发布、回滚操作。  
💡 **创新建议**：通过 API 自动化触发，实现内部控制台“一键部署”。

---

#### 2️⃣ 定时任务（schedule）
```yaml
on:
  schedule:
    - cron: '0 2 * * *' # 每天UTC 2点
```
✅ **用途**：周期性构建、健康检查、依赖更新。  
💡 **创新建议**：结合 AI 工具分析构建趋势，智能调整频率。

---

### 🧩 代码事件

#### 3️⃣ Push 事件
```yaml
on:
  push:
    branches:
      - main
      - release/*
    paths-ignore:
      - '**.md'
```
✅ **用途**：自动构建、测试、Lint 校验。  
💡 **创新建议**：结合 commit message 自动推算版本号。

---

#### 4️⃣ Pull Request
```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
```
✅ **用途**：CI 验证、PR 审查、预览部署。  
💡 **创新建议**：自动在 PR 评论中返回预览链接（如 Vercel URL）。

---

#### 5️⃣ 分支 / 标签创建
```yaml
on:
  create:
    tags:
      - 'v*.*.*'
```
✅ **用途**：自动生成 release 或 changelog。  
💡 **创新建议**：结合 semantic-release，自动生成版本号。

---

#### 6️⃣ 删除事件
```yaml
on:
  delete:
```
✅ **用途**：清理旧分支对应的测试环境。  
💡 **创新建议**：自动同步删除云资源、数据库或 CDN 缓存。

---

### 🧮 发布与版本管理

#### 7️⃣ Release
```yaml
on:
  release:
    types: [published, edited]
```
✅ **用途**：自动构建产物、推送到 npm / Docker。  
💡 **创新建议**：集成 changelogithub 自动生成发布日志。

---

#### 8️⃣ Workflow 调用（workflow_call）
```yaml
on:
  workflow_call:
    inputs:
      version:
        required: true
        type: string
```
✅ **用途**：工作流模块化，其他 workflow 可复用逻辑。  
💡 **创新建议**：在组织级模板中封装“标准发布流程”。

---

#### 9️⃣ 外部触发（repository_dispatch）
```yaml
on:
  repository_dispatch:
    types: [trigger-build]
```
✅ **用途**：从外部系统（如 Jenkins、前端平台）触发。  
💡 **创新建议**：构建组织内部“事件总线”，实现跨仓库构建联动。

---

### 🧠 协作与社区事件

#### 🔹 Issue / PR 评论
```yaml
on:
  issue_comment:
    types: [created]
```
✅ **用途**：通过评论触发动作（如 `/deploy` 指令）。  
💡 **创新建议**：接入 LLM，识别自然语言触发 CI。

---

#### 🔹 Discussions
```yaml
on:
  discussion:
    types: [created, edited]
```
✅ **用途**：活跃度分析、自动欢迎、标签管理。  

---

### 🔐 安全与依赖

#### Dependabot / Security
```yaml
on:
  dependabot_alert:
    types: [created, dismissed]
  security_advisory:
    types: [published]
```
✅ **用途**：漏洞修复、自动生成安全报告。  
💡 **创新建议**：结合漏洞数据库 AI 分析风险等级。

---

### 🚀 部署与环境

#### Deployment Status
```yaml
on:
  deployment_status:
```
✅ **用途**：监控部署成功或失败状态，自动通知。  
💡 **创新建议**：失败时触发回滚流程或 Slack 报警。

---

### 🧰 Workflow 元事件

#### workflow_run
```yaml
on:
  workflow_run:
    workflows: ["Build"]
    types:
      - completed
```
✅ **用途**：工作流之间串联，例如：  
“Build 完成 → Deploy 启动”。  
💡 **创新建议**：构建多阶段流水线系统。

---

## 🧠 三、前瞻性模式（创新设计）

### 🧩 1. 事件编排（Event Orchestration）
通过 `repository_dispatch` + `workflow_call`  
让不同仓库之间形成 **事件级联**：

```text
repo-A 构建成功 → dispatch → repo-B 触发部署
```

➡️ 构建「去中心化 CI/CD 平台」。

---

### 🧠 2. 智能触发条件
结合上下文条件：
```yaml
if: github.ref == 'refs/heads/main' && github.actor != 'dependabot[bot]'
```
让 workflow 只在特定触发人或分支上运行。  
💡 可以与 AI 审批系统整合，动态放行关键操作。

---

### ⚙️ 3. AI 协同构建
将 workflow_dispatch 与外部 AI 调用结合：
- 分析日志 → 自动重试失败的构建  
- 从 PR 描述生成 release note  
- 智能决定部署策略（灰度 / 全量）

---

## 🧩 四、实践建议

1. **模块化工作流**
   - 把通用流程（测试、构建、发布）抽象成独立 workflow。
2. **命名规范**
   - 文件名：`ci.yml`、`deploy.yml`、`lint.yml`
   - Job 名：`build_frontend`, `deploy_staging`
3. **环境区分**
   - 使用 `inputs.env` 控制 dev / staging / prod 环境。
4. **安全合规**
   - 禁止在 `workflow_dispatch` 里泄露密钥。
   - 仅管理员可触发生产部署。

