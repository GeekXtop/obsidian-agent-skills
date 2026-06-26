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

## 2026-06-27 - obclose 主动收尾与 memory 膨胀控制

- 已完成：`$obclose` 增加主动触发规则，明确 agent 在完成实质代码/文档改动、阶段性验证、复杂任务暂停或发现项目内可复用经验时应主动收尾。
- 已完成：`$obclose` 增加跳过条件，轻量问答、无项目状态变化或用户明确要求不更新 memory 时不执行。
- 已完成：`$obclose` 增加项目 memory 维护规则，检查 `progress.md` / `lessons.md` 是否过长或重复；轻量合并、压缩和归档可直接做，拆分 lessons、删除历史、大规模重组需用户确认。
- 已保留：公共知识提取仍由 `$oblearn` 负责，公共知识库整理仍由 `$obcurate` 负责。
- 已验证：目标文本断言通过；`npm test` 通过，输出 `All skills are valid.`。

## 2026-06-27 - 五个 skill 职责边界同步

- 已完成：`$obclose` 的主动收尾和 memory 膨胀控制语义同步到 `README.md`、`skills.json` 和 `skills/obclose/agents/openai.yaml`。
- 已完成：`$obinit` 的 memory 规则和模板补充 `.agents/archive/`，明确它保存过长 `progress.md` 的历史归档，应提交，不同于 `scratch/`。
- 已完成：`$oblearn` 触发描述从“任务完成后记录踩坑”收窄为“把已记录的项目经验转成跨项目公共知识”，避免抢 `$obclose` 的项目内收尾职责。
- 已完成：`$oblearn` 输入范围补充 `.agents/archive/progress-YYYY.md`，仅在当前材料指向归档、用户要求长期复盘或候选知识需要旧阶段证据时读取相关归档。
- 已验证：目标文本断言通过；旧触发词 `任务完成后记录踩坑` / `记录踩坑` 无命中；`npm test` 通过，输出 `All skills are valid.`。

## 2026-06-27 - 0.1.19 发版准备

- 已完成：版本号推进到 `0.1.19`，同步 `package.json`、`skills.json`、`.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json`、`.codex-plugin/plugin.json`。
- 已完成：`.codex-plugin/plugin.json` 的 `$obclose` 默认 prompt 更新为收尾、更新 memory 并检查 `progress/lessons` 轻量维护。
- 已验证：`npm test` 通过，输出 `All skills are valid.`。
- 下一步：提交、创建并推送 `obsidian-agent-skills--v0.1.19`，再用 marketplace/plugin 命令更新本地插件。
