# 通用自举门禁与仓库自身 v2 迁移

- 状态：已交接
- 会话：dsh/self-hosting-gate
- 开始：2026-09-11 06:01
- 涉及文件：`.agents/instructions.md`、`.agents/README.md`、`.agents/active.md`、`.agents/handoffs/`、`scripts/validate-skills.mjs`
- 目标：让本仓库在任意 agent 工具下都能安全自举——用仓库侧版本门禁拦截过旧插件，并把仓库自身补成 memory 代际 v2。
- 下一步：用户 review 后决定提交与发版；产品侧再评估是否把门禁下沉到 obinit 模板。
- 结论：完成。门禁写进 `.agents/instructions.md`（行为探针判版本，过旧只读不写 memory）；仓库自身补齐 v1 → v2 缺失项（`handoffs/` 目录、active 派生声明、README 索引）；`scripts/validate-skills.mjs` 增加自举 scope，`npm test` 绿，9 条新断言在临时副本上逐条红灯。未提交、未发版。
