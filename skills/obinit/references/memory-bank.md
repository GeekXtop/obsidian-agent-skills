# Memory Bank

项目内记忆库只保存索引、状态、摘要和长期经验，不保存聊天流水。

```text
.agents/
  instructions.md   # 中立规则源头或成熟项目索引
  active.md         # 当前任务、当前 spec/plan、下一步
  progress.md       # 里程碑式进展摘要
  lessons.md        # 可复用的坑、限制、经验
  archive/          # 过长 progress 的历史归档，应提交
  scratch/          # 临时调查草稿，可清理
docs/
  adr/              # 长期架构决策
```

更新规则：

- 任务开始、阶段完成、会话结束时更新 `.agents/active.md`；完成实质任务或复杂任务暂停时按 `$obclose` 收尾。
- 完成重要里程碑时追加 `.agents/progress.md`。
- 只有可复用经验才写入 `.agents/lessons.md`。
- 使用 lessons 经验或公共知识时发现与当前证据矛盾，按证据强度分级执行使用中证伪：有直接证伪证据（检查实际执行且失败、引用对象已不存在）就地标已退役（`deprecated`）并附证据；仅怀疑、无直接证据时标待复核（`needs-review`）并附理由；正常使用不强制回写，由 `$obclose` 收尾时统一更新 `最后验证` / `last_verified`。
- 当状态已由权威状态载体记录时（git commit、tag、PR、CI/CD、release、artifact、ADR、migration、issue/ticket、runbook），`.agents/active.md` / `.agents/progress.md` 只记录下一次 agent 需要接手的未完成事项、不在权威载体中的决策背景、阻塞或人工确认点；不记录短暂中间态，已完成状态在最终回复说明。
- `.agents/archive/` 保存过长 `progress.md` 的历史归档；归档是项目 memory 的一部分，应提交，不要加入 `.gitignore`。
- 长期设计决策抽成 `docs/adr/`。
- Superpowers 生成的 spec/plan 保留原文件，`.agents/active.md` 只链接当前使用的 spec/plan；obinit 不创建、不改写、不递归读取 `docs/superpowers/specs/` 或 `docs/superpowers/plans/`，只有 `.agents/active.md` 指向具体文件或用户指定时才读取。
- 临时调查草稿写入 `.agents/scratch/`，并在 `.gitignore` 忽略；运行日志、缓存和生成物不要放进 agent memory。

成熟项目的索引型 `.agents/instructions.md` 必须包含已有指南链接、memory 文件用途、Obsidian 项目笔记路径和写入边界。不要复制 `AGENTS.md` / `CLAUDE.md`、README、docs 或 Superpowers 文档的长章节。
