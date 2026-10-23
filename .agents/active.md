# 当前状态

> 本文件是派生视图：可从 `.agents/handoffs/`、`docs/adr/` 和 Obsidian 项目笔记重建，不保存孤本信息。

## 当前任务

- 目标：0.1.34 发布（scratch 两段式生命周期与 docs/research/ 升档契约）。
- 状态：已发布推送（4da1067），本仓库自举同步完成（3029816），独立终审通过。剩余为下游收敛独立批次与两项用户侧确认。
- 最后更新：2026-10-23

## 当前状态

- 已完成：0.1.34 发布——`.agents/scratch/` 子目录制（`<MMDD>-<topic>/`）、收尾四分法（成型报告内联判据升档 `docs/research/`）、入库文档零 `scratch` 持久外链、`$obclose` 当场淘金脱钩 + 延期经确认按目录清退；validator 6 断言红灯先行，5 载体文件负向实验还原；memory 代际维持 v3 同代际追加。证据见 `.agents/handoffs/2026-10-23_063100_agy_scratch-lifecycle-and-research-promotion.md` 与 `.agents/progress.md` 2026-10-23 条目。
- 已完成：本仓库自举同步——`.agents/instructions.md`（7,748 B）记忆库/文档地图两句、`.agents/README.md` scratch 条目、`docs/README.md`（3,628 B）时点快照说明并入 `docs/research/`。
- 历史：0.1.29–0.1.33 各批（自举门禁、文档地图、体积预算、验证分层填值卡、repeat 判定收紧）及下游 ClashRouteKit / bn-alpha-bot 收敛已完成，逐批见 `.agents/progress.md` 与 `.agents/archive/`。
- 阻塞：无。

## 验证

- 命令：`npm test` → `All skills are valid. (6 skills checked)`。
- 负向红灯：0.1.34 批 6 断言红灯先行，5 载体文件各一次破坏→红→原位补回→绿（instructions/热缓存、docs-readme/docs·research、memory-bank/热缓存、memory-upgrade/MMDD、obclose/热缓存）；0.1.32 / 0.1.33 批各见 progress。
- 终审：独立子代理评审 3913a8b..3029816——无 Critical/Important，3 Minor 延期（obclose 未列四分法②③去向提示、validator 断言块位置风格、index 模板未单独负向实验）。
- 体积现状：`skills/obinit/templates/instructions.md` 6,006 B / 8 KB；`instructions-index.md` 5,703 B / 8 KB；`docs-readme.md` 2,082 B / 6 KB；`.agents/instructions.md` 7,748 B / 8 KB；`docs/README.md` 3,628 B / 6 KB；`.agents/active.md` 本文件在 6 KB 上限内（不自带评数字，避免自指漂移）；`progress.md` / `lessons.md` 见每次收尾汇报行。

## 关键文件

- `.agents/instructions.md`、`.agents/README.md`、`.agents/active.md`、`.agents/handoffs/`、`.agents/archive/`
- `scripts/validate-skills.mjs`
- `skills/obinit/templates/`（`docs-readme.md`、`instructions.md`、`instructions-index.md`、`active.md`、`progress.md`）
- `skills/obinit/references/`（`memory-upgrade.md`、`memory-bank.md`）、`skills/obclose/SKILL.md`
- `docs/README.md`

## 下一步

- 下游收敛独立批次：bn-alpha-bot / flower-dashboard 按 `skills/obinit/references/memory-upgrade.md`「Scratch 生命周期与研究报告升档」小节跑 `$obinit` 重复运行 + 四分法升档清理（bn 两份回测报告补判据升档、flower `.agents/scratch/` 71 文件清退、两者 active/progress 折叠归档）。
- 等用户确认：本仓库 `.agents/scratch/skillcheck/`（2026-09-19 遗留 clip-01..30.txt，630 B，未入库）删除；客户端插件更新 reload。
- 未来批次 Minor：obclose 补四分法②③（scripts/fixtures）去向提示句。

## 当前 ADR

- [0001-use-marketplace-plugin-update-flow.md](../docs/adr/0001-use-marketplace-plugin-update-flow.md)：使用 marketplace/plugin 命令更新本地插件。

## 已使用知识

- `[[Skill 行为规则使用正向 contract]]`：门禁文案与新增断言按正向 contract 规则书写。

## 已提取知识

- 项目笔记：`Agent/Projects/obsidian-agent-skills.md`
- `[[Marketplace 插件更新流程]]`（`kind: knowledge` / `use_as: runbook`）
- `[[Skill 行为规则使用正向 contract]]`（`kind: knowledge` / `use_as: rule`）
