# active.md 体积预算与折叠规则

- 状态：已交接
- 会话：dsh/active-snapshot-budget
- 开始：2026-09-14 06:07
- 涉及文件：`skills/obinit/references/memory-bank.md`、`skills/obclose/SKILL.md`、`scripts/validate-skills.mjs`、`.agents/active.md`、`.agents/progress.md`
- 目标：补齐 memory 契约里最后一块无上界的每任务必读文件——给 `.agents/active.md` 定体积预算、加 validator 断言，并把「折叠已完成项」写成 `$obclose` 的明确动作。
- 下一步：随 0.1.32 发布；随后按 `active.md` 下一步推进自举门禁代际标记与两个下游项目的 `$obinit` 重复运行。
- 结论：完成。`memory-bank.md` 的「每次必读」组把 `active.md` 从「无预算」改为软约束 4 KB 并要求折叠已完成项；`obclose` 的「active.md 写法」加折叠规则、检查清单加 4 KB 一项、维护清单写明折叠是可直接做的动作；validator 新增 `activeSnapshotByteBudget`（6 KB 硬上限）、`assertActiveSnapshotBudgetTerm`（`memory-bank.md` 与 `obclose/SKILL.md` 必须声明同一个 4 KB）与实例字节断言；本仓库 `.agents/active.md` 按新规则折叠完成项，5,152 B → 3,523 B。`npm test` 绿，三条断言负向验证逐条红灯。

## 决策与理由

1. **沿用地图的「软约束 4 KB + 硬上限 6 KB」双档**：`active.md` 与 `docs/README.md` 同属「必读但内容由项目自身规模决定」的文件，软约束是收并目标、硬上限留出多任务并发时的余量，避免合法实例刚更新就触红。`instructions.md` 不适用双档——它是纯规则，有唯一正确的下限，所以只有 8 KB 硬预算。
2. **折叠而不是归档**：`active.md` 是派生视图，已完成项在 `handoffs/` 和 `progress.md` 里有权威副本，折叠成一行并指向载体不丢信息；归档会引入第二个需要维护的文件，与「可重建」定位冲突。
3. **断言落在字节而不是行数**：行数受条目长度影响，同样 40 行可以是 2 KB 也可以是 12 KB；成本由字节决定。
4. **一致性断言只查「同一行同时出现 active.md 与 4 KB」**：单侧改预算时该行不再成立，能抓到分叉；不绑定整句措辞，避免为了过断言写僵硬文案。
5. **不动 `.agents/instructions.md`**：它已占 8 KB 预算的 78%，且折叠规则属于收尾动作，归 `$obclose` 承载，不需要每任务必读的规则源头再记一条。
