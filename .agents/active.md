# 当前状态

> 本文件是派生视图：可从 `.agents/handoffs/`、`docs/adr/` 和 Obsidian 项目笔记重建，不保存孤本信息。

## 当前任务

- 目标：0.1.36/0.1.37 发布（scratch 契约整改 + 终审 Minor 修复随版）。
- 状态：两版均已发布推送（597a8bf / e451595）、自举同步完成、独立终审通过且 6 Minor 已全部修复随 0.1.37 入版。剩余为客户端 reload 与下游各自收敛。
- 最后更新：2026-10-24

## 当前状态

- 已完成：0.1.36 契约整改——升档后旧引用改写为指向升档落点（含死链第三出口：已删且不可恢复的引用删除或标注，不编造内联）；②③（脚本/样本搬移 `scripts|tools/`、`samples|test/fixtures/`）改为只在用户当次确认后执行并补 `tools/` 与两个限定词；可重建产物与运行态不入热缓存；单目录过时判据改「超 14 天且无任何最近 14 天更新过的 handoff 引用」+ 僵尸 handoff 确认提示；运行时假设与默认行为的写盘边界改为「既有源码内容/不改写其逻辑」口径；20 MB 体积口径落为字节求和定义。validator obclose 概念块 9→14 术语、memory-bank 新概念块 5 术语（共享 4 词组未动）、safety boundary 术语替换，红灯先行。证据见 `.agents/handoffs/2026-10-24_131646_zcode_scratch-contract-remediation.md` 与 `.agents/progress.md` 2026-10-24 条目。
- 已完成：spec 复审修订 5 条并入（断言矩阵对齐、memory-upgrade supersede、死链第三出口、状态行 carve、非 git 口径）后用户确认；本仓库自举同步（`.agents/instructions.md` 7,796 B 与模板逐字一致、`.agents/README.md` 措辞随版）。
- 历史：0.1.29–0.1.35 各批（自举门禁、文档地图、体积预算、验证分层填值卡、repeat 判定收紧、scratch 生命周期与②③补句、下游收敛与 skillcheck 清退）已完成，逐批见 `.agents/progress.md` 与 `.agents/archive/`。
- 阻塞：无。

## 验证

- 命令：`npm test` → `All skills are valid. (6 skills checked)`。
- 负向红灯：0.1.36 批 12 条（obclose 7 术语 + memory-bank 5 术语）逐条删→红点名→还原→绿；0.1.37 修复轮 2 条新钉术语（memory-bank 只读短语、obclose「不修改既有源码内容」）RED✓；反向验证（模板 0 处②③确认句、obclose 旧安全句 0 残留、`tools/` 与限定词双文件在场）通过。
- 终审：独立子代理评审 f3498d5..b89a954——无 Critical；1 Important（收口时序，由发布后收口提交解决）；6 Minor 已全部随 0.1.37 修复（见 progress 2026-10-24 修复轮条目）。
- 体积现状：`skills/obinit/templates/instructions.md` 6,054 B / 8 KB；`instructions-index.md` 5,751 B / 8 KB；`docs-readme.md` 2,082 B / 6 KB；`.agents/instructions.md` 7,796 B / 8 KB；`docs/README.md` 3,628 B / 6 KB；`.agents/active.md` 本文件在 6 KB 上限内；`progress.md` / `lessons.md` 见每次收尾汇报行。

## 关键文件

- `.agents/instructions.md`、`.agents/README.md`、`.agents/active.md`、`.agents/handoffs/`、`.agents/archive/`
- `scripts/validate-skills.mjs`
- `skills/obinit/templates/`（`docs-readme.md`、`instructions.md`、`instructions-index.md`、`agents-readme.md`、`active.md`、`progress.md`）
- `skills/obinit/references/`（`memory-upgrade.md`、`memory-bank.md`）、`skills/obclose/SKILL.md`
- `docs/README.md`、`docs/superpowers/specs|plans/2026-10-24-scratch-contract-remediation*`

## 下一步

- 客户端更新本地插件到 0.1.37 并 reload；下游项目按 `memory-upgrade.md`「Scratch 契约修正（0.1.36）」节重跑 `$obinit` 收敛（0.1.37 修复轮不动模板，无需追加收敛）。
- 货架：bn 51 处悬空引用下降验证属下游批次（spec 验收第 5 条）。

## 当前 ADR

- [0001-use-marketplace-plugin-update-flow.md](../docs/adr/0001-use-marketplace-plugin-update-flow.md)：使用 marketplace/plugin 命令更新本地插件。

## 已使用知识

- `[[Skill 行为规则使用正向 contract]]`：门禁文案与新增断言按正向 contract 规则书写。

## 已提取知识

- 项目笔记：`Agent/Projects/obsidian-agent-skills.md`
- `[[Marketplace 插件更新流程]]`（`kind: knowledge` / `use_as: runbook`）
- `[[Skill 行为规则使用正向 contract]]`（`kind: knowledge` / `use_as: rule`）
