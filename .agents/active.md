# 当前状态

> 本文件是派生视图：可从 `.agents/handoffs/`、`docs/adr/` 和 Obsidian 项目笔记重建，不保存孤本信息。

## 当前任务

- 目标：把 `.agents/active.md` 收进「必读类」体积预算——软约束 4 KB、validator 硬上限 6 KB、`$obclose` 补上折叠已完成项的明确动作，补齐 memory 契约里最后一块无上界的每任务必读文件。
- 状态：改动与验证已完成，未提交、未发版（0.1.32 候选）；`0.1.31` 五轮发布内容见 `.agents/progress.md`。
- 最后更新：2026-09-14

## 当前状态

- 已完成：`active.md` 收进体积预算——`memory-bank.md` 与 `obclose` 声明软约束 4 KB（含折叠动作），validator 新增 `assertByteBudget`（6 KB 硬上限）与跨文件预算声明一致性断言；本实例按要求把已完成项折叠为一行。
- 已完成：`0.1.31` 五轮发布内容——自举门禁（代际 v2 / `0.1.28`）、仓库自身 v1 → v2 收敛、`active.md` 章节集统一、文档地图契约（memory 代际 v3）、memory 体积预算与读取分级、`progress.md` 追加顺序契约与归档。逐轮记录见 `.agents/handoffs/2026-09-11_*` 与 `.agents/progress.md` 2026-09-11 各条。
- 阻塞：无。

## 验证

- 命令：`npm test` → `All skills are valid. (6 skills checked)`。
- 破坏实验：`active.md` 超 6 KB 上限、`memory-bank.md` 与 `obclose` 任一侧的预算声明被改，三条各按预期红灯，恢复后全绿。
- 体积现状：`.agents/instructions.md` 6.4 KB / 8 KB；`docs/README.md` 3.6 KB / 4 KB；`.agents/active.md` 3,547 B / 4 KB（折叠前 5,152 B）；`progress.md` 26.3 KB / 50 KB；`lessons.md` 18.5 KB / 30 KB。

## 关键文件

- `.agents/instructions.md`、`.agents/README.md`、`.agents/active.md`、`.agents/handoffs/`、`.agents/archive/`
- `scripts/validate-skills.mjs`
- `skills/obinit/templates/`（`docs-readme.md`、`instructions.md`、`instructions-index.md`、`active.md`、`progress.md`）
- `skills/obinit/references/`（`memory-upgrade.md`、`memory-bank.md`）、`skills/obclose/SKILL.md`
- `docs/README.md`

## 下一步

1. 随 0.1.32 发布本轮 `active.md` 预算；发布并 reload 后按自举门禁把 `.agents/instructions.md` 的代际标记从 v2 / `0.1.28` 推进到 v3 / `0.1.29`；在此之前执行者仍按 v2 契约行事。
2. 对 bn-alpha-bot 与 ClashRouteKit 各重跑一次 `$obinit`（重复运行模式），一次收敛三项：体积预算与读取分级、追加顺序规则、以及各自 `progress.md` 的排序区块（bn-alpha-bot 有 3 条倒序，ClashRouteKit 已升序无需处理）。
3. 产品侧评估两项：自举门禁是否下沉到 `skills/obinit/templates/instructions.md`；`inspect-project.mjs` 的重复运行判定目前只要 `.agents/` 下任一 memory 文件存在即为 repeat，非 obinit 项目自建的 `.agents/active.md`（如 LP-Bot 的会话认领登记）会误触发，是否收紧到 `.agents/instructions.md`。

## 当前 ADR

- [0001-use-marketplace-plugin-update-flow.md](../docs/adr/0001-use-marketplace-plugin-update-flow.md)：使用 marketplace/plugin 命令更新本地插件。

## 已使用知识

- `[[Skill 行为规则使用正向 contract]]`：门禁文案与新增断言按正向 contract 规则书写。

## 已提取知识

- 项目笔记：`Agent/Projects/obsidian-agent-skills.md`
- `[[Marketplace 插件更新流程]]`（`kind: knowledge` / `use_as: runbook`）
- `[[Skill 行为规则使用正向 contract]]`（`kind: knowledge` / `use_as: rule`）
