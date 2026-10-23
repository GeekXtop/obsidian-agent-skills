# Scratch 两段式生命周期与 docs/research/ 升档契约

- 状态：已交接
- 会话：agy/scratch-lifecycle-and-research-promotion（zcode 于 2026-10-23 接续执行至收尾）
- 开始：2026-10-23 06:31
- 涉及文件：`docs/superpowers/specs/2026-10-23-scratch-lifecycle-and-research-promotion-design.md`（后续实现涉及 `skills/obinit/templates/instructions.md`、`skills/obinit/templates/instructions-index.md`、`skills/obinit/templates/docs-readme.md`、`skills/obinit/references/memory-bank.md`、`skills/obinit/references/memory-upgrade.md`、`skills/obclose/SKILL.md`、`scripts/validate-skills.mjs`）
- 目标：为 `.agents/scratch/` 建立 `<MMDD>-<topic>/` 子目录隔离、四分法淘金决断树（成型取证/回测报告带自包含判据升档 `docs/research/`）、入库文档零 `scratch` 持久外链，以及 `$obclose`「当场淘金脱钩 + 延期按目录批量清退」两段式生命周期。
- 下一步：下游收敛独立批次——bn-alpha-bot / flower-dashboard 按 `skills/obinit/references/memory-upgrade.md`「Scratch 生命周期与研究报告升档」小节跑 `$obinit` 重复运行 + 四分法升档清理；本仓库 `.agents/scratch/skillcheck/` 删除与客户端插件更新 reload 待用户操作；Minor 延期项（obclose 补四分法②③去向提示句）留后续批次。
- 结论：0.1.34 已发布并推送。spec a1e165e → plan（9fc2ffa 内）→ validator 6 断言红灯先行 → 模板/references/obclose 改至全绿 → 5 轮负向红灯实验逐条还原 → feature 9fc2ffa → release 4da1067 → 自举同步 3029816（`.agents/instructions.md` 7,748 B / `docs/README.md` 3,628 B，均预算内）。独立终审（范围 3913a8b..3029816）无 Critical/Important，3 Minor 延期；`npm test` 全绿 6 skills。批次留痕见 `.agents/progress.md` 2026-10-23 条目。
