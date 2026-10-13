# 当前状态

> 本文件是派生视图：可从 `.agents/handoffs/`、`docs/adr/` 和 Obsidian 项目笔记重建，不保存孤本信息。

## 当前任务

- 目标：把「验证分层落地」填值卡推进 obinit 并随 0.1.32 发布；reload 后自举补真值卡、代际标记 v2→v3。
- 状态：Task 1–5 已完成并发布（0.1.32 已推送）；Task 6 自举等客户端 update plugin + reload 后执行（plan `docs/superpowers/plans/2026-10-14-test-gates-bootstrap.md`）。
- 最后更新：2026-10-14

## 当前状态

- 已完成：0.1.32 已发布——「验证分层落地」填值卡（模板加节、init-modes 判据下沉、memory-upgrade v3 行合成与口径小节、memory-bank 登记、validator 三断言各负向红灯）与前批 `active.md` 预算（c998e2d）。证据见 `.agents/handoffs/2026-10-14_050215_zcode_test-gates-bootstrap.md` 与 `.agents/progress.md` 2026-10-14 条目。
- 已完成：`0.1.31` 五轮发布内容——自举门禁（代际 v2 / `0.1.28`）、仓库自身 v1 → v2 收敛、`active.md` 章节集统一、文档地图契约（memory 代际 v3）、memory 体积预算与读取分级、`progress.md` 追加顺序契约与归档。逐轮记录见 `.agents/handoffs/2026-09-11_*` 与 `.agents/progress.md` 2026-09-11 各条。
- 阻塞：无。

## 验证

- 命令：`npm test` → `All skills are valid. (6 skills checked)`。
- 负向红灯（本批）：模板缺卡 8 项全列、索引模板加节、init-modes 删判据段 6 词全列，各一次，还原复绿。
- 体积现状：`skills/obinit/templates/instructions.md` 5,668 B / 8 KB（加卡后）；`.agents/instructions.md` 6,355 B / 8 KB（reload 后 Task 6 补卡，预计 ≈6,951 B）；`docs/README.md` 3,554 B / 软约束 4 KB、上限 6 KB；`.agents/active.md` 3,547 B / 软约束 4 KB、上限 6 KB；`progress.md` 30,868 B / 50 KB；`lessons.md` 18,457 B / 30 KB。

## 关键文件

- `.agents/instructions.md`、`.agents/README.md`、`.agents/active.md`、`.agents/handoffs/`、`.agents/archive/`
- `scripts/validate-skills.mjs`
- `skills/obinit/templates/`（`docs-readme.md`、`instructions.md`、`instructions-index.md`、`active.md`、`progress.md`）
- `skills/obinit/references/`（`memory-upgrade.md`、`memory-bank.md`）、`skills/obclose/SKILL.md`
- `docs/README.md`

## 下一步

1. 客户端 update plugin + reload 后按 plan Task 6 自举：`.agents/instructions.md` 补六行真值卡、代际标记从 v2 / `0.1.28` 推进到 v3 / `0.1.29`（validator 字面量 `"0.1.28"`→`"0.1.29"` 同批）；在此之前执行者仍按 v2 契约行事。
2. 对 bn-alpha-bot 与 ClashRouteKit 各重跑一次 `$obinit`（重复运行模式），一次收敛四项：体积预算与读取分级、追加顺序规则、「验证分层落地」填值卡、以及各自 `progress.md` 的排序区块（bn-alpha-bot 有 3 条倒序，ClashRouteKit 已升序无需处理）。
3. 产品侧评估两项：自举门禁是否下沉到 `skills/obinit/templates/instructions.md`；`inspect-project.mjs` 的重复运行判定目前只要 `.agents/` 下任一 memory 文件存在即为 repeat，非 obinit 项目自建的 `.agents/active.md`（如 LP-Bot 的会话认领登记）会误触发，是否收紧到 `.agents/instructions.md`。

## 当前 ADR

- [0001-use-marketplace-plugin-update-flow.md](../docs/adr/0001-use-marketplace-plugin-update-flow.md)：使用 marketplace/plugin 命令更新本地插件。

## 已使用知识

- `[[Skill 行为规则使用正向 contract]]`：门禁文案与新增断言按正向 contract 规则书写。

## 已提取知识

- 项目笔记：`Agent/Projects/obsidian-agent-skills.md`
- `[[Marketplace 插件更新流程]]`（`kind: knowledge` / `use_as: runbook`）
- `[[Skill 行为规则使用正向 contract]]`（`kind: knowledge` / `use_as: rule`）
