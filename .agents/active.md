# 当前状态

## 当前任务

- 目标：记录后续发布只保留 `obsidian-agent-skills--vX.Y.Z` 插件 tag 的约定。
- 状态：已记录并验证
- 最后更新：2026-06-26

## 当前状态

- 已将 `Agent/Knowledge/_catalog.md` 设为已沉淀领域事实来源。
- 已规划 `$oblearn`、`$obcurate` 的职责边界。
- 已更新 skill 文档、模板、registry、README、插件元数据和校验规则。
- 已将版本号推进到 `0.1.18`。
- 已新增 ADR，要求本地插件更新走 marketplace/plugin 命令并在更新后 reload、重启或开启新会话。
- 已补充后续发布 tag 只保留 `obsidian-agent-skills--vX.Y.Z`，不再额外创建 `vX.Y.Z`。
- 已在 Obsidian `Agent/Knowledge/Inbox/` 提取公共知识，并创建 `Agent/Knowledge/_catalog.md` 的最小入口。

## 验证

- 命令：`npm test`
- 结果：通过，`All skills are valid.`

## 关键文件

- `.agents/instructions.md`：成熟项目索引和 memory 协议。
- `.agents/progress.md`：阶段性进展摘要。
- `.agents/lessons.md`：可复用经验。
- `docs/adr/`：架构决策记录。
- `docs/adr/0001-use-marketplace-plugin-update-flow.md`：插件更新流程 ADR。

## 当前 ADR

- [0001-use-marketplace-plugin-update-flow.md](../docs/adr/0001-use-marketplace-plugin-update-flow.md)：使用 marketplace/plugin 命令更新本地插件。

## 下一步

1. 用户确认后再决定是否发布下一版。

## 已使用知识

- [[Marketplace 插件更新流程]]：用于记录发版后本地更新和 reload 检查项。

## 已提取知识

- [[Marketplace 插件更新流程]]：通过 `$oblearn` 提取到 `Agent/Knowledge/Inbox/`，并登记到 `Agent/Knowledge/_catalog.md`。

## Obsidian

- 项目笔记：`Agent/Projects/obsidian-agent-skills.md`
