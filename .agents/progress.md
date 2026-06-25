# 进展记录

本文件只记录阶段性进展摘要，不记录聊天流水。

## 2026-06-23 - 项目初始化

- 已完成：创建 `.agents/` memory 结构和 `docs/adr/` 入口；保留既有 `AGENTS.md` / `CLAUDE.md` 并追加 memory 指针。
- 已验证：`npm test` 通过，输出 `All skills are valid.`。
- 下一步：在后续任务开始或收尾时更新 `.agents/active.md`。

## 2026-06-25 - 公共知识边界调整

- 已完成：新增 `$obcurate` skill，负责整理 `Agent/Knowledge/`、清理 Inbox、维护 `_catalog.md`、合并/拆分/重命名知识笔记。
- 已完成：收窄 `$oblearn` 职责，只负责提取、脱敏、追加/新建公共知识，并在关键词明确时更新 `_catalog.md`。
- 已完成：更新 `$obinit` 生成规则，公共知识检索不再凭空假设领域，优先以 `Agent/Knowledge/_catalog.md` 为事实来源。
- 已验证：`npm test` 通过，输出 `All skills are valid.`。

## 2026-06-25 - 插件更新流程 ADR

- ADR：新增 `docs/adr/0001-use-marketplace-plugin-update-flow.md`，记录本地插件更新必须走 marketplace/plugin 管理器，并在更新后 reload、重启或开启新会话。
- 已完成：README 增加 Obsidian 使用前提、Codex / Claude Code 插件更新命令和版本验证命令。
- 已提取：公共知识 `[[Marketplace 插件更新流程]]` 写入 `Agent/Knowledge/Inbox/`，并登记到 `Agent/Knowledge/_catalog.md`。

## 2026-06-26 - 发布 tag 约定

- 已完成：README 和插件更新流程 ADR 记录后续发版只创建 `obsidian-agent-skills--vX.Y.Z`，不再额外创建平行的 `vX.Y.Z` tag。
- 已保留：历史 `v0.1.x` tag 不主动删除，避免影响已发布引用。
- 已验证：`npm test` 通过，输出 `All skills are valid.`。
