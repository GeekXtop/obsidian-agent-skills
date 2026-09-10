# 当前状态

> 本文件是派生视图：可从 `.agents/handoffs/`、`docs/adr/` 和 Obsidian 项目笔记重建，不保存孤本信息。

## 当前任务

- 目标：让本仓库在任意 agent 工具下可自举（仓库侧版本门禁 + 仓库自身 memory 收敛到 v2），统一 `active.md` 章节集，并把「文档地图」契约下沉到插件（memory 代际 v3）。
- 状态：三轮改动均已完成并通过验证，随 `0.1.29` 发布。
- 最后更新：2026-09-11

## 当前状态

- 已完成：`.agents/instructions.md` 新增「自举门禁」节——memory 代际 v2（对应插件 `0.1.28` 及以上），用行为探针判定执行者版本，过旧时只读、不写 `.agents/`；并声明**代际标记只在本版已发布且执行者已更新插件后推进**。
- 已完成：仓库自身 v1 → v2 收敛——`.agents/handoffs/` 建立并接入交接记录、`active.md` 补派生视图声明、`.agents/README.md` 补 `handoffs/` 与派生视图说明。
- 已完成：`active.md` 章节集统一——obinit 模板移除独立 `## Obsidian` 节，项目笔记路径并入 `## 已提取知识`，与 obclose 模板和段落归属对齐。
- 已完成：文档地图契约（本版主要内容，memory 代际 v3）——新增 `skills/obinit/templates/docs-readme.md`；两个指令模板新增 `## 文档地图` 节（纯增量）；`SKILL.md` allowlist 加 `docs/README.md`；`references/memory-upgrade.md` 推进到 v3 并给出 v2 → v3 迁移清单；`README.md` 补模式说明。
- 已完成：本仓库自身按新契约建立 `docs/README.md`，登记 7 份当前状态文档的事实范围与同步触发，`docs/adr/` 与 `docs/superpowers/`（时点快照，标注「不更新」）各一行。
- 已完成：`scripts/validate-skills.mjs` 新增自举 scope（9 条断言）、共享章节契约（4 条断言）、文档地图契约（3 条断言），并把 `v2 → v3` 纳入 memory-upgrade 概念断言；仓库自身 memory 与模板一致性都进 `npm test`。
- 阻塞：无。

## 验证

- 命令：`npm test` → `All skills are valid. (6 skills checked)`。
- 破坏实验：自举门禁 9 条 + 章节集 4 条 + 文档地图 2 条，各在临时副本上逐条红灯（删 `docs-readme.md` 的「同步触发」、把 `instructions.md` 的 `## 文档地图` 改名等），恢复后全绿。
- 版本一致性：`package.json` / `skills.json` / `.claude-plugin/plugin.json` / `.codex-plugin/plugin.json` / `.claude-plugin/marketplace.json`（metadata + plugin）全部 `0.1.29`。
- 模板 diff 核验：两个指令模板为纯新增（各 8 增 0 删），既有规则文本未被改动，存量项目重复运行 `$obinit` 只会看到「模板有、文件没有的章节」，不产生规则冲突。

## 关键文件

- `.agents/instructions.md`、`.agents/README.md`、`.agents/active.md`、`.agents/handoffs/`
- `scripts/validate-skills.mjs`
- `skills/obinit/templates/`（`docs-readme.md`、`instructions.md`、`instructions-index.md`、`active.md`）
- `skills/obinit/references/memory-upgrade.md`、`skills/obinit/SKILL.md`
- `docs/README.md`

## 下一步

1. 确认本地插件已更新到 `0.1.29` 并 reload 后，把 `.agents/instructions.md` 的自举门禁代际标记从 v2 / `0.1.28` 推进到 v3 / `0.1.29`；在此之前执行者仍按 v2 契约行事。
2. 在存量项目试用 v2 → v3 迁移（bn-alpha-bot 是天然试用点：它既有 README 文档地图，也有大量时点快照目录），确认差异报告是否干净、地图建出来是否好用。
3. 产品侧评估：是否把自举门禁下沉到 `skills/obinit/templates/instructions.md`，让 obinit 生成的项目同样带版本门禁。

## 当前 ADR

- [0001-use-marketplace-plugin-update-flow.md](../docs/adr/0001-use-marketplace-plugin-update-flow.md)：使用 marketplace/plugin 命令更新本地插件。

## 已使用知识

- `[[Skill 行为规则使用正向 contract]]`：门禁文案与新增断言按正向 contract 规则书写。

## 已提取知识

- 项目笔记：`Agent/Projects/obsidian-agent-skills.md`
- `[[Marketplace 插件更新流程]]`（`kind: knowledge` / `use_as: runbook`）
- `[[Skill 行为规则使用正向 contract]]`（`kind: knowledge` / `use_as: rule`）
