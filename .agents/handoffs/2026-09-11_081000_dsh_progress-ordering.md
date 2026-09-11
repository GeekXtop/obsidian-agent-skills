# progress 追加顺序契约与归档

- 状态：已交接
- 会话：dsh/progress-ordering
- 开始：2026-09-11 08:10
- 涉及文件：`skills/obinit/templates/progress.md`、`skills/obclose/SKILL.md`、`skills/obinit/references/memory-upgrade.md`、`scripts/validate-skills.mjs`、`.agents/progress.md`、`.agents/archive/progress-2026-06.md`
- 目标：修掉 `progress.md` 排序混乱的根因（追加位置无明文规定），并把本仓库自身积压的倒序区块归档。
- 下一步：对 bn-alpha-bot 与 ClashRouteKit 各重跑一次 `$obinit`（重复运行模式），一次收敛 v0.1.30 的体积预算与读取分级、以及本版的追加顺序规则。
- 结论：完成。三处规则落定（progress 模板、obclose 写法、memory-upgrade 可选迁移项），validator 加两条契约断言；本仓库最旧 24 条移入 `.agents/archive/progress-2026-06.md` 并升序重排，`progress.md` 由 92.0% 降至 45.7%。`npm test` 绿，两条断言负向验证逐条红灯。

## 决策与理由

1. **根因是契约缺口，不是使用者的疏忽**：`templates/progress.md` 首行就是一个条目，暗示「新建项在顶部」，而任何地方都没写后续条目追加在哪。三个项目里两个出现同形态错误，其中 bn-alpha-bot 只跨 5 天——排除「历史积累」解释。
2. **归档切点用业务判据而非结构判据**：该文件历史形态是「头部含最新条目、尾部含最旧条目、中间另有一段局部升序」。实测「找第一个递增处」会切错边：先切出 3 条，改用「最长升序尾部」后切出 8 条且**把最新的条目移走**。最终改为「按日期排序后保留最近的条目，直到累计体积降到预算的约 40%」，并额外对齐到日期边界。
3. **归档文件内重排为升序**：若照抄倒序区块，新归档文件会继承同一缺陷。规则写明「归档不是照抄」。
4. **切点对齐日期边界**：首个方案把 2026-07-01 的条目拆到两边（归档 2 条、现行 5 条），对齐后档案 6/30 止、现行 7/01 起，同日不再跨文件。
5. **保真优先**：仅整条搬移与重排，不压缩、不改写条目正文；合计字节只增 228 B（归档头与条目间空行），抽样条目逐字保留。
