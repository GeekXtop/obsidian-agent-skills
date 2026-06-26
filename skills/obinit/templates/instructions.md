# Agent 工作约定

## 项目规则

- 修改代码前先读本文件。
- 项目事实写在当前仓库内。
- Agent 草稿、计划和调查记录写在 `.agents/`。
- 当前任务状态写在 `.agents/active.md`。
- 阶段进展摘要写在 `.agents/progress.md`。
- 可复用经验写在 `.agents/lessons.md`。
- 过长进展归档写在 `.agents/archive/`。
- 长期项目文档写在 `docs/`。
- 架构决策写在 `docs/adr/`。
- Obsidian 项目笔记：`Agent/Projects/<project>.md`。

## 初始化范围

项目初始化阶段，agent 只能创建或更新：

- `AGENTS.md`
- `CLAUDE.md`
- `.agents/`
- `docs/adr/`
- `.gitignore` 中的 `.agents/scratch/` 条目

其他路径必须等待用户明确要求。

## 日常工作

- 只修改用户任务范围内的代码和文档。
- 批量移动、删除、重命名、改生成文件、改依赖或重组文档前先问用户。
- 构建、测试、部署和运行时不能依赖私人笔记、本地 vault 或个人工具。
- 任务开始或遇到相关问题时，不凭空假设哪些领域已有公共知识；仅在用户明确要求、`Agent/Knowledge/_catalog.md` 命中任务关键词，或风险较高且关键词明确时，在 `Agent/Knowledge/` 做有限关键词定向搜索；命中相关笔记后再明确读取并使用，不全量自动加载。

## 记忆库

- 任务开始、阶段完成、会话收尾时更新 `.agents/active.md`。
- 完成实质代码/文档改动、阶段性验证或复杂任务暂停时，按 `$obclose` 收尾。
- 有明确里程碑时更新 `.agents/progress.md`。
- 只有可复用经验才更新 `.agents/lessons.md`。
- `.agents/archive/` 保存过长 `progress.md` 的历史归档，应提交。
- 长期项目决策写入 `docs/adr/`。
- 如已有 Superpowers spec/plan，在 `.agents/active.md` 链接当前文件，不复制全文。
- 临时调查草稿写入 `.agents/scratch/`；运行日志、缓存和生成物不要放进 agent memory。
