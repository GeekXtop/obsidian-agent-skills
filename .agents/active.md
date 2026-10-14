# 当前状态

> 本文件是派生视图：可从 `.agents/handoffs/`、`docs/adr/` 和 Obsidian 项目笔记重建，不保存孤本信息。

## 当前任务

- 目标：把「验证分层落地」填值卡推进 obinit 并随 0.1.32 发布；reload 后自举补真值卡、代际标记 v2→v3。
- 状态：Task 1–6 全部完成——0.1.32 已发布，reload 后自举两动作落地（真值卡 + 代际 v3 / `0.1.29`），重复运行差异先报后清。
- 最后更新：2026-10-14

## 当前状态

- 已完成：reload 后自举（Task 6）——`.agents/instructions.md` 补六行真值卡、代际标记推进 v3 / `0.1.29`（validator 字面量同批换），重复运行先报「验证分层落地」缺失、补后新增差异清零。证据见 `.agents/progress.md` 2026-10-14 自举条目。
- 已完成：0.1.32 已发布——「验证分层落地」填值卡（模板加节、init-modes 判据下沉、memory-upgrade v3 行合成与口径小节、memory-bank 登记、validator 三断言各负向红灯）与前批 `active.md` 预算（c998e2d）。证据见 `.agents/handoffs/2026-10-14_050215_zcode_test-gates-bootstrap.md` 与 `.agents/progress.md` 2026-10-14 条目。
- 已完成：`0.1.31` 五轮发布内容——自举门禁（代际 v2 / `0.1.28`）、仓库自身 v1 → v2 收敛、`active.md` 章节集统一、文档地图契约（memory 代际 v3）、memory 体积预算与读取分级、`progress.md` 追加顺序契约与归档。逐轮记录见 `.agents/handoffs/2026-09-11_*` 与 `.agents/progress.md` 2026-09-11 各条。
- 阻塞：无。

## 验证

- 命令：`npm test` → `All skills are valid. (6 skills checked)`。
- 负向红灯（本批）：模板缺卡 8 项全列、索引模板加节、init-modes 删判据段 6 词全列，各一次，还原复绿。
- 自举验证：重复运行对比 0.1.32 模板——补卡前唯一新增差异为缺失「验证分层落地」节，补卡后六行标签与模板逐一一致、新增差异清零（既有命名分叉如 `规则入口`↔`项目规则` 与实例特有节为存量状态，不在新增项内）。
- 体积现状：`skills/obinit/templates/instructions.md` 5,668 B / 8 KB（加卡后）；`.agents/instructions.md` 7,216 B / 8 KB（补卡后）；`docs/README.md` 3,554 B / 软约束 4 KB、上限 6 KB；`.agents/active.md` 4,105 B / 软约束 4 KB、上限 6 KB；`progress.md` 32,688 B / 50 KB；`lessons.md` 18,457 B / 30 KB。

## 关键文件

- `.agents/instructions.md`、`.agents/README.md`、`.agents/active.md`、`.agents/handoffs/`、`.agents/archive/`
- `scripts/validate-skills.mjs`
- `skills/obinit/templates/`（`docs-readme.md`、`instructions.md`、`instructions-index.md`、`active.md`、`progress.md`）
- `skills/obinit/references/`（`memory-upgrade.md`、`memory-bank.md`）、`skills/obclose/SKILL.md`
- `docs/README.md`

## 下一步

1. 对 bn-alpha-bot 与 ClashRouteKit 各重跑一次 `$obinit`（重复运行模式），一次收敛四项：体积预算与读取分级、追加顺序规则、「验证分层落地」填值卡、以及各自 `progress.md` 的排序区块（bn-alpha-bot 有 3 条倒序，ClashRouteKit 已升序无需处理）。
2. 产品侧评估两项：自举门禁是否下沉到 `skills/obinit/templates/instructions.md`；`inspect-project.mjs` 的重复运行判定目前只要 `.agents/` 下任一 memory 文件存在即为 repeat，非 obinit 项目自建的 `.agents/active.md`（如 LP-Bot 的会话认领登记）会误触发，是否收紧到 `.agents/instructions.md`。

## 当前 ADR

- [0001-use-marketplace-plugin-update-flow.md](../docs/adr/0001-use-marketplace-plugin-update-flow.md)：使用 marketplace/plugin 命令更新本地插件。

## 已使用知识

- `[[Skill 行为规则使用正向 contract]]`：门禁文案与新增断言按正向 contract 规则书写。

## 已提取知识

- 项目笔记：`Agent/Projects/obsidian-agent-skills.md`
- `[[Marketplace 插件更新流程]]`（`kind: knowledge` / `use_as: runbook`）
- `[[Skill 行为规则使用正向 contract]]`（`kind: knowledge` / `use_as: rule`）
