# 文档地图：把「改行为要更新哪些文档」变成可查的表

- 状态：已交接
- 会话：dsh/doc-map-contract
- 开始：2026-09-11 07:04
- 涉及文件：`skills/obinit/templates/docs-readme.md`、`skills/obinit/templates/instructions.md`、`skills/obinit/templates/instructions-index.md`、`skills/obinit/references/memory-upgrade.md`、`skills/obinit/SKILL.md`、`scripts/validate-skills.mjs`、`README.md`、`docs/README.md`、`.agents/instructions.md`
- 目标：让 `$obinit` 规定文档地图的位置与形态，把「行为改动同步哪些文档」从每次现场 grep 猜测变成可查表；并让存量项目通过 v2 → v3 迁移发现它。
- 下一步：随 0.1.29 发布；发布并 reload 后，把 `.agents/instructions.md` 的自举门禁代际标记从 v2 / `0.1.28` 推进到 v3 / `0.1.29`。
- 结论：完成并已发版（0.1.29）。新增 `templates/docs-readme.md` 与两个指令模板的 `## 文档地图` 节（纯新增），`SKILL.md` allowlist 加 `docs/README.md`，`memory-upgrade.md` 推进到 v3，validator 加三条断言，`README.md` 与 `docs/README.md` 同步。`npm test` 绿（6 skills），两条新断言负向验证逐条红灯。自举门禁代际标记刻意保持 v2 / `0.1.28`——发布前不存在 v3 执行者，提前推进会让门禁宣称的代际高于执行者实际契约。

## 决策与理由

1. **位置定在 `docs/README.md`，不放仓库 README**：公开分发的项目，README 是消费级文档，不该承载内部维护元信息；而 `docs/` 已是 obinit 认定的事实源层（`.agents/` 明确「只存状态、索引和经验，不复制事实源内容」）。
2. **按类别而非工具路径表述**：「时点快照」是类别，模板里不出现 `docs/superpowers/` 等任何具体工具目录，符合 `forbiddenHardcodedToolPaths`，也让其他 spec/plan 流程能用各自目录。
3. **地图只收当前状态文档与 `docs/adr/`**：设计稿、实施计划每天新增且永不回改，逐条登记等于制造必然腐烂的索引；快照的天然索引是计划头部指向 spec 的字段。
4. **表格必须带同步触发列**：地图的可用形态是「改 X → 看/改 Y」的反查，只列文档名对执行者无用。
5. **代际推进与发布解耦**：v3 契约先写进模板，但仓库自身代际标记要等 0.1.29 发布且执行者更新插件后再推进，否则门禁宣称 v3、执行者按 v2 行事。
