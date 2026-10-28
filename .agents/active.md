# 当前状态

> 本文件是派生视图：可从 `.agents/handoffs/`、`docs/adr/` 和 Obsidian 项目笔记重建，不保存孤本信息。

## 当前任务

- 目标：0.1.36/0.1.37 发布 + 下游两仓库契约收敛。
- 状态：全部完成——两版已发布推送、6 Minor 已修复随 0.1.37 入版；下游 bn-alpha-bot / flower-dashboard 契约收敛与悬空引用改指已完成（2026-10-28，验收 #5 实证）。本线程挂账清零。
- 最后更新：2026-10-28

## 当前状态

- 已完成：0.1.36 契约整改——升档后旧引用改写为指向升档落点（含死链第三出口：已删且不可恢复的引用删除或标注，不编造内联）；②③（脚本/样本搬移 `scripts|tools/`、`samples|test/fixtures/`）改为只在用户当次确认后执行并补 `tools/` 与两个限定词；可重建产物与运行态不入热缓存；单目录过时判据改「超 14 天且无任何最近 14 天更新过的 handoff 引用」+ 僵尸 handoff 确认提示；运行时假设与默认行为的写盘边界改为「既有源码内容/不改写其逻辑」口径；20 MB 体积口径落为字节求和定义。validator obclose 概念块 9→14 术语、memory-bank 新概念块 5 术语（共享 4 词组未动）、safety boundary 术语替换，红灯先行。证据见 `.agents/handoffs/2026-10-24_131646_zcode_scratch-contract-remediation.md` 与 `.agents/progress.md` 2026-10-24 条目。
- 已完成：spec 复审修订 5 条并入（断言矩阵对齐、memory-upgrade supersede、死链第三出口、状态行 carve、非 git 口径）后用户确认；本仓库自举同步（`.agents/instructions.md` 7,796 B 与模板逐字一致、`.agents/README.md` 措辞随版）。
- 已完成：下游收敛批（2026-10-28）——bn（4 提交）契约收敛 2 文件含 0.1.35 漏网补齐（README 整文件 + 文档地图研究报告句）、当前状态文档悬空 scratch 引用 3→0（lessons 2 处标注、system-flow 改指在途子目录）、scratch 散装装盒；flower（2 提交）同款收敛 + 四处无损微压缩守 8 KB（8,184/8,192）。历史记录/快照悬空 61+7 处按契约保留，随各 topic 收尾 $obclose 逐步下降。
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

- 无挂账——0.1.34～0.1.37 全链路与下游收敛收官（本地插件缓存已 0.1.37）。
- 货架：bn instructions 缺「## 重复运行」节（预算余量 49 B 放不下，待下轮收敛评估）；bn 1021-anon-flat 观察结题时按四分法升档 `docs/research/` 并改指 system-flow 指针（属 bn 侧批次）。

## 当前 ADR

- [0001-use-marketplace-plugin-update-flow.md](../docs/adr/0001-use-marketplace-plugin-update-flow.md)：使用 marketplace/plugin 命令更新本地插件。

## 已使用知识

- `[[Skill 行为规则使用正向 contract]]`：门禁文案与新增断言按正向 contract 规则书写。

## 已提取知识

- 项目笔记：`Agent/Projects/obsidian-agent-skills.md`
- `[[Marketplace 插件更新流程]]`（`kind: knowledge` / `use_as: runbook`）
- `[[Skill 行为规则使用正向 contract]]`（`kind: knowledge` / `use_as: rule`）
