# Memory Bank

项目内记忆库只保存索引、状态、摘要和长期经验，不保存聊天流水。

```text
.agents/
  instructions.md   # 中立规则源头或成熟项目索引
  active.md         # 当前任务、当前 spec/plan、下一步
  progress.md       # 里程碑式进展摘要
  lessons.md        # 可复用的坑、限制、经验
  scratch/          # 临时调查材料，可清理
docs/
  adr/              # 长期架构决策
```

更新规则：

- 任务开始、阶段完成、会话结束时更新 `.agents/active.md`。
- 完成重要里程碑时追加 `.agents/progress.md`。
- 只有可复用经验才写入 `.agents/lessons.md`。
- 长期设计决策抽成 `docs/adr/`。
- Superpowers 生成的 spec/plan 保留原文件，`.agents/active.md` 只链接当前使用的 spec/plan；obinit 不创建、不改写、不递归读取 `docs/superpowers/specs/` 或 `docs/superpowers/plans/`，只有 `.agents/active.md` 指向具体文件或用户指定时才读取。

成熟项目的索引型 `.agents/instructions.md` 必须包含已有指南链接、memory 文件用途、Obsidian 项目笔记路径和写入边界。不要复制 `AGENTS.md` / `CLAUDE.md`、README、docs 或 Superpowers 文档的长章节。
