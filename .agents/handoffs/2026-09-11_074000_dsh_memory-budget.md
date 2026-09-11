# memory 体积预算与读取分级

- 状态：已交接
- 会话：dsh/memory-budget
- 开始：2026-09-11 07:40
- 涉及文件：`skills/obinit/references/memory-bank.md`、`skills/obclose/SKILL.md`、`skills/obinit/templates/`（`instructions.md`、`instructions-index.md`、`docs-readme.md`）、`scripts/validate-skills.mjs`、`.agents/instructions.md`、`docs/README.md`
- 目标：给项目 memory 补体积上界与读取分级——现有预算只覆盖 `progress` / `lessons` / `handoffs`，而 `instructions.md` 是唯一每任务必读的文件却无预算，文档地图也没有。
- 下一步：`progress.md` 归档与压缩待用户确认后执行（`obclose:196` 把大规模重写列为需确认项）；随后按 `active.md` 第 1 条推进自举门禁代际标记。
- 结论：完成。`memory-bank.md` 新增「体积与读取成本」节（每次必读 vs 按需 grep 两类，含代际推进必须同时修剪旧节的条款）；`obclose` 加读取分级并修掉与新规则冲突的重复度检查；三个模板与仓库两个实例补预算声明；validator 加 `assertByteBudget` 与跨仓库预算一致性断言。`npm test` 绿，三条断言负向验证逐条红灯。

## 决策与理由

1. **按读取方式分级，而不是按文件类型**：成本取决于「读它的人付多少上下文」。`instructions.md` 每任务必读 → 硬预算 8 KB；地图写计划时必查 → 软约束 + 防膨胀上限；`progress` / `lessons` 是按需 grep 的对象 → 不设字节断言，只保留既有行数/体积预算。
2. **地图软约束定 4 KB 而非 3 KB**：三个实测数据点（模板 2.0 KB、本仓库 3.5 KB、8 条目估算 3.6 KB）都贴近或超过 3 KB，说明原指导值标定偏低。改指导值，不为了凑数字扭曲地图。
3. **两条轨道的作用域不同**：validator 只在本仓库跑，保证仓库自洽（实例不超预算、模板与实例声明一致）；下游项目拿到的是 prose 契约，会不会被遵守不由 validator 保证。`memory-bank.md` 也是 reference，不进 `templates/`，所以下游看到的仍是文字约定。
4. **仓库实例也纳入预算声明的一致性检查**：`instructions.md` 因此增加一行预算说明（从 62 行增至 66 行）。这是刻意接受的轻微重复——与既有的 `active.md` 章节集一致性检查同一模式，代价一行，换来预算不会静默分叉。
5. **归档暂缓**：实测归档前 12 条只省 7,578 B（44,755 → 37,177，87% → 74%），收益低于预估；且 `obclose:196` 要求大规模重写需用户确认，故不与本次发布捆绑。
