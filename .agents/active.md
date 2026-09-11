# 当前状态

> 本文件是派生视图：可从 `.agents/handoffs/`、`docs/adr/` 和 Obsidian 项目笔记重建，不保存孤本信息。

## 当前任务

- 目标：让本仓库在任意 agent 工具下可自举（仓库侧版本门禁 + 仓库自身 memory 收敛到 v2），统一 `active.md` 章节集，把「文档地图」契约下沉到插件（memory 代际 v3），给 memory 补体积上界与读取分级，并修掉 `progress.md` 追加顺序的契约缺口。
- 状态：五轮改动均已完成并通过验证，随 `0.1.31` 发布。
- 最后更新：2026-09-11

## 当前状态

- 已完成：`.agents/instructions.md` 新增「自举门禁」节——memory 代际 v2（对应插件 `0.1.28` 及以上），用行为探针判定执行者版本，过旧时只读、不写 `.agents/`；并声明**代际标记只在本版已发布且执行者已更新插件后推进**。
- 已完成：仓库自身 v1 → v2 收敛——`.agents/handoffs/` 建立并接入交接记录、`active.md` 补派生视图声明、`.agents/README.md` 补 `handoffs/` 与派生视图说明。
- 已完成：`active.md` 章节集统一——obinit 模板移除独立 `## Obsidian` 节，项目笔记路径并入 `## 已提取知识`，与 obclose 模板和段落归属对齐。
- 已完成：文档地图契约（memory 代际 v3）——新增 `skills/obinit/templates/docs-readme.md`；两个指令模板新增 `## 文档地图` 节（纯增量）；`SKILL.md` allowlist 加 `docs/README.md`；`references/memory-upgrade.md` 推进到 v3 并给出 v2 → v3 迁移清单；`README.md` 补模式说明。
- 已完成：本仓库自身按新契约建立 `docs/README.md`，登记当前状态文档的事实范围与同步触发，`docs/adr/` 与 `docs/superpowers/`（时点快照，标注「不更新」）各一行。
- 已完成：memory 体积预算与读取分级——`memory-bank.md` 新增「体积与读取成本」节（每次必读 vs 按需 grep 两类，含代际推进必须同时修剪旧节的条款）；`obclose` 加读取分级并修掉与重复度检查的自相矛盾；validator 新增 `assertByteBudget`（`instructions.md` 8 KB 硬预算、文档地图 4 KB 软约束配 6 KB 上限）与跨仓库预算一致性断言。
- 已完成：`progress.md` 追加顺序契约与归档（本版主要内容）——三处规则写明「新条目追加到文件末尾、按时间升序」（`templates/progress.md`、`obclose` 写法、`memory-upgrade` 可选迁移项）；validator 加两条断言；本仓库最旧 24 条移入 `.agents/archive/progress-2026-06.md` 并升序重排。
- 阻塞：无。

## 验证

- 命令：`npm test` → `All skills are valid. (6 skills checked)`。
- 破坏实验：自举门禁 9 条 + 章节集 4 条 + 文档地图 2 条 + 体积预算 3 条 + 追加顺序 2 条，各在临时副本上逐条红灯，恢复后全绿。
- 版本一致性：`package.json` / `skills.json` / `.claude-plugin/plugin.json` / `.codex-plugin/plugin.json` / `.claude-plugin/marketplace.json`（metadata + plugin）全部 `0.1.31`。
- 归档核验：条目守恒 24 + 15 = 39（原 39）；现行与归档两文件日期序列均无倒退；无同日条目被拆到两边；合计 47,322 B vs 原件 47,094 B（差 228 B 为归档头与条目间空行）；抽样条目逐字保留。
- 体积现状：`.agents/instructions.md` 6.4 KB（余 1.8 KB）；`docs/README.md` 3.6 KB（软约束 4 KB 内）；`progress.md` 23.4 KB / 50 KB（45.7%）；`lessons.md` 18.5 KB / 30 KB。

## 关键文件

- `.agents/instructions.md`、`.agents/README.md`、`.agents/active.md`、`.agents/handoffs/`、`.agents/archive/`
- `scripts/validate-skills.mjs`
- `skills/obinit/templates/`（`docs-readme.md`、`instructions.md`、`instructions-index.md`、`active.md`、`progress.md`）
- `skills/obinit/references/`（`memory-upgrade.md`、`memory-bank.md`）、`skills/obclose/SKILL.md`
- `docs/README.md`

## 下一步

1. 确认本地插件已更新到 `0.1.31` 并 reload 后，把 `.agents/instructions.md` 的自举门禁代际标记从 v2 / `0.1.28` 推进到 v3 / `0.1.29`；在此之前执行者仍按 v2 契约行事。
2. 对 bn-alpha-bot 与 ClashRouteKit 各重跑一次 `$obinit`（重复运行模式），一次收敛三项：v0.1.30 的体积预算与读取分级、本版的追加顺序规则、以及各自 `progress.md` 的排序区块（bn-alpha-bot 有 3 条倒序，ClashRouteKit 已升序无需处理）。
3. 产品侧评估：是否把自举门禁下沉到 `skills/obinit/templates/instructions.md`，让 obinit 生成的项目同样带版本门禁。

## 当前 ADR

- [0001-use-marketplace-plugin-update-flow.md](../docs/adr/0001-use-marketplace-plugin-update-flow.md)：使用 marketplace/plugin 命令更新本地插件。

## 已使用知识

- `[[Skill 行为规则使用正向 contract]]`：门禁文案与新增断言按正向 contract 规则书写。

## 已提取知识

- 项目笔记：`Agent/Projects/obsidian-agent-skills.md`
- `[[Marketplace 插件更新流程]]`（`kind: knowledge` / `use_as: runbook`）
- `[[Skill 行为规则使用正向 contract]]`（`kind: knowledge` / `use_as: rule`）
