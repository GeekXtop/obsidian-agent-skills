# 当前状态

> 本文件是派生视图：可从 `.agents/handoffs/`、`docs/adr/` 和 Obsidian 项目笔记重建，不保存孤本信息。

## 当前任务

- 目标：0.1.33 发布（repeat 判定收紧）与下游两仓库「验证分层落地」收敛。
- 状态：0.1.33 已发布 reload，下游两仓库收敛完成——ClashRouteKit 72cd3c0（填卡六行全填）、bn-alpha-bot 890ba5f（填卡 + 记忆库宽口径 + progress 9 月 18 条归档 + 预算压缩到 8,023/8,192）。本线程挂账清零。
- 最后更新：2026-10-15

## 当前状态

- 已完成：下游收敛（0.1.33 reload 后）——ClashRouteKit 与 bn-alpha-bot 各补「验证分层落地」真值卡；bn 另做记忆库宽口径对齐、progress 9 月 18 条移出归档（守恒 18+10）、超预算压缩（8,023/8,192，含移除与 skill 重复的「重复运行」节）。证据见各自仓库提交与 `.agents/handoffs/2026-10-15_024010_zcode_repeat-signal-tightening.md`。
- 已完成：0.1.33 已发布——`inspect-project.mjs` repeat 判定收紧到 `.agents/instructions.md`（LP-Bot 误触发修复，负向 fixture 先红）+ SKILL/init-modes 信号同批删 active.md；「有意留空」指针句与本实例「有意保留」标注同批入版。评估项「自举门禁下沉」结论不下沉。证据见 `.agents/handoffs/2026-10-15_024010_zcode_repeat-signal-tightening.md` 与 `.agents/progress.md` 2026-10-15 条目。
- 已完成：reload 后自举（Task 6）——`.agents/instructions.md` 补六行真值卡、代际标记推进 v3 / `0.1.29`（validator 字面量同批换），重复运行先报「验证分层落地」缺失、补后新增差异清零。证据见 `.agents/progress.md` 2026-10-14 自举条目。
- 已完成：0.1.32 已发布——「验证分层落地」填值卡（模板加节、init-modes 判据下沉、memory-upgrade v3 行合成与口径小节、memory-bank 登记、validator 三断言各负向红灯）与前批 `active.md` 预算（c998e2d）。证据见 `.agents/handoffs/2026-10-14_050215_zcode_test-gates-bootstrap.md` 与 `.agents/progress.md` 2026-10-14 条目。
- 已完成：`0.1.31` 五轮发布内容——自举门禁（代际 v2 / `0.1.28`）、仓库自身 v1 → v2 收敛、`active.md` 章节集统一、文档地图契约（memory 代际 v3）、memory 体积预算与读取分级、`progress.md` 追加顺序契约与归档。逐轮记录见 `.agents/handoffs/2026-09-11_*` 与 `.agents/progress.md` 2026-09-11 各条。
- 阻塞：无。

## 验证

- 命令：`npm test` → `All skills are valid. (6 skills checked)`。
- 负向红灯：0.1.32 批三条断言（模板缺卡 8 项全列、索引模板加节、init-modes 删判据段 6 词全列）；0.1.33 批负向 fixture（仅 active.md 存在误判 repeat，收紧后判 new）。各一次，还原复绿。
- 自举验证：重复运行对比 0.1.32 模板——补卡前唯一新增差异为缺失「验证分层落地」节，补卡后六行标签与模板逐一一致、新增差异清零（既有命名分叉如 `规则入口`↔`项目规则` 与实例特有节为存量状态，不在新增项内）。
- 体积现状：`skills/obinit/templates/instructions.md` 5,668 B / 8 KB（加卡后）；.agents/instructions.md` 7,410 B / 8 KB（标注后）；`docs/README.md` 3,554 B / 软约束 4 KB、上限 6 KB；`.agents/active.md` 4,054 B / 软约束 4 KB、上限 6 KB；`progress.md` 34,455 B / 50 KB；`lessons.md` 18,457 B / 30 KB。

## 关键文件

- `.agents/instructions.md`、`.agents/README.md`、`.agents/active.md`、`.agents/handoffs/`、`.agents/archive/`
- `scripts/validate-skills.mjs`
- `skills/obinit/templates/`（`docs-readme.md`、`instructions.md`、`instructions-index.md`、`active.md`、`progress.md`）
- `skills/obinit/references/`（`memory-upgrade.md`、`memory-bank.md`）、`skills/obclose/SKILL.md`
- `docs/README.md`

## 下一步

- 无——下游收敛完成，线程挂账清零；bn 侧货架项（Post-Access 验证、symbol 正则收紧等）在 bn 自己的 progress 里。
