# 0.1.36 scratch 契约整改（证据链闭环与写入边界）

- 会话：zcode（m00203 评审同会话延续；spec 由 m00223 提出）
- 状态：已交接
- 任务：落实 0.1.36 契约整改——升档后引用改指、②③ 搬移确认门槛、可重建产物不入热缓存、清退判据改看 handoff 时效；含 spec 复审修订、plan、validator-first 实现、发版与自举。
- 涉及文件：`scripts/validate-skills.mjs`、`skills/obclose/SKILL.md`、`skills/obinit/references/{memory-bank,memory-upgrade}.md`、`skills/obinit/templates/{instructions,instructions-index,agents-readme}.md`、`docs/superpowers/specs/2026-10-23-…-design.md`（仅状态行）、`docs/superpowers/{specs,plans}/2026-10-24-scratch-contract-remediation*`、版本 5 manifest、自举 `.agents/instructions.md` 与 `.agents/README.md`、本 handoff 与 active/progress。
- 结论：0.1.36 已发布推送（597a8bf）；npm test 全绿；12 条负向红灯实验全过；独立终审（f3498d5..b89a954）1 Important（收口时序，即本提交解决）+ 6 Minor 延期（见 progress 2026-10-24 条目）。
- 下一步：客户端更新插件 reload；下游项目按 `memory-upgrade.md`「Scratch 契约修正（0.1.36）」节各自重跑 `$obinit` 收敛（②③ 确认门槛与改指义务对新一批 close 生效）；6 Minor 延期项随下一批处理。
- 不计入：本文件不计入 progress 预算；`涉及文件` 用于多会话重叠判断。
