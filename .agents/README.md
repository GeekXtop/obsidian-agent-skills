# Agent 记忆库

本目录保存项目内 agent memory。

- `instructions.md`：成熟项目索引和 memory 协议，含自举门禁。
- `handoffs/`：每会话一份交接记录，append-only 事实来源，应提交；命名 `YYYY-MM-DD_HHMMSS_<agent>_<任务slug>.md`，字段见 `skills/obclose/templates/handoff.md`。
- `active.md`：派生视图，由 `$obclose` 从 `handoffs/`、`docs/adr/` 和 Obsidian 项目笔记重建，不保存孤本信息。
- `progress.md`：阶段性进展摘要，新条目带 `- 来源：<agent>/<任务 slug>`。
- `lessons.md`：项目内可复用经验。
- `archive/`：过长 `progress.md` 的历史归档，应提交。
- `scratch/`：临时调查草稿，按 `<MMDD>-<topic>/` 子目录归拢，可清理（清理前先做升档检查）。

临时调查草稿按 `<MMDD>-<topic>/` 子目录写入 `scratch/`；收尾把有独立价值的取证/回测报告（内联关键判据与统计口径）升档到 `docs/research/`，不留持久证据外链，原目录暂留作热缓存，超龄后按目录整体处置。运行日志、缓存和生成物不要放进 agent memory。`scratch/` 不提交，`handoffs/` 和 `archive/` 应提交。

不要在这里保存密钥、凭证、私人 vault 内容或聊天流水。
