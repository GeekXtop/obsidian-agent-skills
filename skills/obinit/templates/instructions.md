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
- 任务开始或遇到相关问题时，不凭空假设哪些领域已有公共知识；仅在用户明确要求、`Agent/Knowledge/_catalog.md` 命中任务关键词，或风险较高且关键词明确时，在 `Agent/Knowledge/` 做有限关键词定向搜索；命中后明确读取 catalog 的 `kind` / `use_as`：`knowledge` + `rule` 可作为公共经验规则或检查清单使用，`document` + `reference` 是一等知识库产物，面向人类实践，可作为参考材料、证据、操作记录或实践指南使用；不全量自动加载。

## 项目相关知识

- 第一次初始化时项目类型可能是 `unknown`；只建立查询协议，不预填弱相关知识。
- 重复初始化时重新判断项目类型：`unknown` 只保留协议，`candidate` 只列建议，`confirmed` 才回写高置信公共知识链接。
- 只回写链接和简短 `kind` / `use_as`，不复制公共知识正文。
- 高置信链接可以写入 Obsidian 项目笔记的 `相关知识`；需要启动时立即可见的少量链接可写在本节。
- 项目类型、任务域或 catalog 命中不明确时只列建议，等待用户确认。

## 记忆库

- 任务开始、阶段完成、会话收尾时更新 `.agents/active.md`。
- 完成实质代码/文档改动、阶段性验证或复杂任务暂停时，按 `$obclose` 收尾。
- 有明确里程碑时更新 `.agents/progress.md`。
- 只有可复用经验才更新 `.agents/lessons.md`。
- 当状态已由权威状态载体记录时（git commit、tag、PR、CI/CD、release、artifact、ADR、migration、issue/ticket、runbook），`.agents/active.md` / `.agents/progress.md` 只记录下一次 agent 需要接手的未完成事项、不在权威载体中的决策背景、阻塞或人工确认点；不记录短暂中间态，已完成状态在最终回复说明。
- `.agents/archive/` 保存过长 `progress.md` 的历史归档，应提交。
- 长期项目决策写入 `docs/adr/`。
- 如已有 Superpowers spec/plan，在 `.agents/active.md` 链接当前文件，不复制全文。
- 临时调查草稿写入 `.agents/scratch/`；运行日志、缓存和生成物不要放进 agent memory。
