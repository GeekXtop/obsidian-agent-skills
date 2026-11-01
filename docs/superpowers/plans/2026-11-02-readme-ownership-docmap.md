# 0.1.38 README 所有权与文档地图解耦 — 实施计划

- **Goal**：模板 `docs-readme.md` 退出对根 README 的登记与同步触发指派（README 结构与事实范围由项目自己的介绍规范单独拥有）；obclose 与 memory-bank 改指面补齐根 README（改指面与登记解耦）；validator 四组断言钉死；memory-upgrade 迁移条目；本仓自举 + lessons。
- **Architecture**：validator-first TDD——红灯先行 → 五载体转绿 → 负向实验（已提交态）→ 本仓自举/lessons → 发版 → 独立终审 → 收口。
- **Tech Stack**：Node ESM validator（`npm test` → `node scripts/validate-skills.mjs`）。
- **Spec**：`docs/superpowers/specs/2026-11-02-readme-ownership-docmap-design.md`（b8a9923，已确认，外部评审 Approved + 4 条 plan 级建议已并入）。

## Global Constraints

1. **红灯先行**：Task 1 一次性加入全部断言并跑红点名；Task 2–5 逐载体转绿；不得先改文案后补断言。
2. **只动目标数组/块**：`requiredScratchLifecycleTerms`（4 词）与其他共享数组零改动；概念块只追加术语，不改名、不改既有术语顺序。
3. **锚点连续字串**：`介绍规范单独拥有`、`脱离改指面`、``与根 `README.md` `` 不得被反引号/空格隔断；memory-upgrade 中前两个锚点必须在新节同一文本流连续出现。
4. **JS 字面量书写**：反引号在双引号 JS 字符串中直接写（`"与根 \`README.md\`"` 无需转义，勿写成模板字面量拼接）；禁短语写 `"../README.md"`。
5. **负向断言只挂模板**：`assertNoPhrases` 只作用于 docs-readme 模板内容，不挂本仓 `docs/README.md` 自举侧。
6. **工具无关措辞**：新句禁 `superpowers`、`.worktrees/` 等工具路径（`forbiddenHardcodedToolPaths` 会红）。
7. **字节/词预算**：docs-readme 模板 ≤6,144 B；obclose wordsish ≤5,000（改后重测记账）；本仓 `docs/README.md` 删行只减不增。
8. **提交纪律**：显式路径 `git add <files>`；提交前 `git status --short` 复核无越界；门禁用 `npm test; echo EXIT=$?` 显式核验退出码（fc68086 事故：管道吞退出码）。
9. **负向实验安全**（0.1.37 教训）：Task 7 必须在 feature 提交**之后**做；逐项 编辑→红点名→`git checkout -- <单文件>`→绿，整树清扫禁止。
10. **多会话共树**：每个提交前核对 `git status --short`，发现他人新落文件立即停下重估（75a4f24 先例）。

## Review Focus（终审逐项核对）

- 模板全文件（含示例行）`../README.md` 为 0 处；README 登记语义 0 残留。
- obclose `:12` 仅末括号改写：`既有源码内容`、`不改写其逻辑`、`只在用户当次确认后` 等既有术语零牵连。
- memory-bank `:31` 枚举扩展后，4 词共享组与既有概念块 6 术语仍绿。
- memory-upgrade：v3 清单第 2 条行尾恰一处追加；新节锚点连续；新概念块 3 术语全绿。
- 自举删行**不补空行**（模板侧不同：模板保留 `| | | |` 空行 + 示例行前空行，两处勿混淆）。
- 发版后 5 处 manifest 同步且 `All skills are valid. (6 skills checked)` 绿。

## Tasks

### Task 1: validator 断言红灯先行

File: `scripts/validate-skills.mjs`

- [ ] 1.1 `:249` `requiredDocsReadmeTerms` 追加 `"介绍规范单独拥有"`：
  `const requiredDocsReadmeTerms = ["## 权威文档地图", "同步触发", "时点快照", "docs/adr/", "介绍规范单独拥有"];`
- [ ] 1.2 `:1140`（`missingDocsReadme` 断言块旁）新增负向断言，签名照抄 `:696` `assertNoPhrases(label, content, phrases, describe)` 与既有调用形状：
  禁短语数组 `["../README.md"]`，describe 指明「根 README 不入文档地图登记（所有权归项目介绍规范）」。
- [ ] 1.3 obclose 概念块（`:605` 附近，terms 含 `"改写为指向"`）追加术语 `"脱离改指面"`。
- [ ] 1.4 memory-bank 概念块 `{ name: "scratch contract remediation", terms: [...] }`（`:133-135`）terms 追加 `` "与根 `README.md`" ``。
- [ ] 1.5 memory-upgrade 概念块数组（keyed `references/memory-upgrade.md`）追加：
  `{ name: "readme ownership decoupling", terms: ["0.1.38", "介绍规范单独拥有", "脱离改指面"] }`
- [ ] 1.6 `npm test; echo EXIT=$?` → **红**，缺口一一对应 7 项（模板正向 1 + 模板负向 1 + obclose 1 + memory-bank 1 + memory-upgrade 3），无意外红。

### Task 2: 模板 docs-readme.md

File: `skills/obinit/templates/docs-readme.md`

- [ ] 2.1 删 `:16` 登记行整行：`| [`README.md`](../README.md) | 项目是什么、怎么装、怎么跑、运维链路 | 运行方式、命令、配置键、对外行为 |`；`:17` `| | | |` 空行**原样保留**。
- [ ] 2.2 表格后插入（示例行前各留一个空行，行内代码包裹，防解析为表格延续行）：
  ```
  行格式示例（非登记）：`| [docs/架构.md](./架构.md) | 组件拓扑与运行分支行为 | 代码行为改动 |`
  ```
- [ ] 2.3 `:21` 维护规则清单追加一条 bullet：
  `- 根 README 的结构与事实范围由项目自己的介绍规范单独拥有：不入本表、不登记其同步触发。`
- [ ] 2.4 `npm test; echo EXIT=$?` → 模板正向+负向转绿（obclose/memory-bank/memory-upgrade 仍红）；`wc -c skills/obinit/templates/docs-readme.md` ≤6,144 记账。

### Task 3: obclose 改指面

File: `skills/obclose/SKILL.md`

- [ ] 3.1 `:12` 末括号整体替换，其余零改动：
  旧：`（项目无文档地图时，改指范围收窄为 `.agents/` 与根 `README.md`）`
  新：`（改指范围为 `.agents/`、当前状态文档与根 `README.md`——README 不因不进文档地图而脱离改指面）`
- [ ] 3.2 `npm test; echo EXIT=$?` → obclose 概念块转绿。

### Task 4: memory-bank 改指枚举

File: `skills/obinit/references/memory-bank.md`

- [ ] 4.1 同行内替换：`改指只改 `.agents/` 与当前状态文档中的旧引用` → `改指只改 `.agents/`、当前状态文档与根 `README.md` 中的旧引用`（该行其余不动，`时点快照与既有 `docs/adr/` 只读` 短语保持）。
- [ ] 4.2 `npm test; echo EXIT=$?` → memory-bank 转绿（4 词共享组无回退）。

### Task 5: memory-upgrade 迁移条目

File: `skills/obinit/references/memory-upgrade.md`

- [ ] 5.1 `## v2 → v3 迁移清单` 第 2 条（「创建 `docs/README.md`：登记…」）行尾追加：`；0.1.38 起根 README 退出文档地图登记，改指面与登记解耦`。
- [ ] 5.2 文末（`## Scratch 契约修正（0.1.36 起同代际追加）` 4 条之后）追加新节，4 条口径（锚点连续字串）：
  ```
  ## README 所有权与文档地图解耦（0.1.38 起同代际追加）

  自 0.1.38 起，根 README 的所有权与文档地图解耦，冲突处以本节为准：

  1. 文档地图不登记根 README、不指派其同步触发；README 的结构与事实范围由项目自己的介绍规范单独拥有，介绍规范措辞工具无关。
  2. obclose 改指面与登记解耦：README 不因不进文档地图而脱离改指面——改指范围为 `.agents/`、当前状态文档与根 `README.md`。
  3. 已有项目不追溯回填所有权句；存量 `docs/README.md` 已登记的 README 行在下次触达该文件时按本节删除，不做专项清理。
  4. 本仓自举同代际执行（`docs/README.md` 删 README 行）。
  ```
- [ ] 5.3 `npm test; echo EXIT=$?` → 全绿 `All skills are valid. (6 skills checked)`。

### Task 6: 全绿核账 + feature 提交

- [ ] 6.1 `wc -c` 五载体记账；`grep -c '../README\.md' skills/obinit/templates/docs-readme.md` = 0。
- [ ] 6.2 `git status --short` 复核仅 5 个预期文件。
- [ ] 6.3 `git add scripts/validate-skills.mjs skills/obinit/templates/docs-readme.md skills/obclose/SKILL.md skills/obinit/references/memory-bank.md skills/obinit/references/memory-upgrade.md` → 提交（validator 断言 + 五载体契约 + 红灯先行说明）。

### Task 7: 负向红灯实验（Task 6 提交后、已提交态下）

7 项逐个：编辑 → `npm test; echo EXIT=$?` 红点名 → `git checkout -- <单文件>` → 绿复跑。

- [ ] 模板删 `介绍规范单独拥有` bullet → 红（正向缺口）
- [ ] 模板临时加回一行 `| [`README.md`](../README.md) | x | y |` → 红（负向命中）
- [ ] obclose 删 `脱离改指面`（末括号改回旧收窄句）→ 红
- [ ] memory-bank 删 ``与根 `README.md` ``（枚举还原）→ 红
- [ ] memory-upgrade v3 行删 `0.1.38` → 红
- [ ] memory-upgrade 新节删 `介绍规范单独拥有` → 红
- [ ] memory-upgrade 新节删 `脱离改指面` → 红
- [ ] 收尾：`git status --short` 干净（仅可能剩 spec/plan 外文件为零）+ `npm test` 绿。

### Task 8: 本仓自举 + lessons

- [ ] 8.1 `docs/README.md` 删 `:16` README 登记行（**直接删，不补空行**——后面紧接既有登记行）。
- [ ] 8.2 `.agents/lessons.md` 文末按仓库格式（背景/经验/适用场景/验证方式/最后验证）追加：
  - 背景：bn/flower README 膨胀根因——obinit 允许清单没写 README，模板预设行却给所有实例指派了 README 同步触发。
  - 经验：新增模板预设内容时同时审「它会向实例指派哪些义务」——写文件白名单约束不了间接写义务（义务网络 vs 白名单）；断言正负成对（正向钉所有权句、负向禁 `../README.md` 相对路径而非完整链接短语）。
  - 验证方式：npm test 红绿两向 + 模板 grep；最后验证 2026-11-02。
- [ ] 8.3 `npm test; echo EXIT=$?` 绿；`wc -c docs/README.md` 记账（应小于 3,628 B）。
- [ ] 8.4 `git status --short` 复核 → 提交（自举 + lessons 一笔）。

### Task 9: 发版 0.1.38

- [ ] 9.1 `npm run version:set 0.1.38`。
- [ ] 9.2 `npm test; echo EXIT=$?` 绿（版本断言 + 5 manifest 同步）。
- [ ] 9.3 `git status --short` 复核 → 提交 → `git push`。

### Task 10: 独立终审（review-deep）

- [ ] 派 `review-deep` 全分支终审（无条件）：范围 `b8a9923^..HEAD`，逐项核对 Review Focus；产出裁定。
- [ ] 修复轮闭环：Critical/Important 必修（改 → `npm test` 绿 → 提交 → 复审 ADDRESSED）；Minor 入挂账或随修。

### Task 11: 收口

- [ ] 11.1 `.agents/progress.md` 2026-11-02 条目；`.agents/active.md` 当前任务/验证/下一步改写（挂账：bn 形态——已收窄且事实承接文档在位——随重跑收窄或移除地图 README 行；flower 形态承接落点拍板前地图行维持现状，**不得先收窄**；所有权句不回填实例、差异检测不报告；bn 1021 观察结题升档照旧）。
- [ ] 11.2 提交 + `git push`。
- [ ] 11.3 收尾说明提示本地插件缓存更新（marketplace 更新至 0.1.38）。

## 派发台账（执行时补结果）

- 施工 | Native inline（主会话本人） | 7 文件共享 validator 术语契约强耦合、单任务链 | 待执行
- 终审 | review-deep | 全分支终审无条件命中 deep 枚举 | 待执行

## 留痕

- workspace：主工作树（docs-only + validator 小改动，隔离成本 > 收益；无他会在途文件冲突即降级）。
- spec：`docs/superpowers/specs/2026-11-02-readme-ownership-docmap-design.md`（b8a9923）。
- plan：本文件。

## 终审修复记录（2026-11-02，review-deep）

- **Important 1**：本计划 Task 5.2 初稿把 spec §4.5 的四条存量收敛口径误写为「存量 README 行下次触达时删」，与「未落点前不得先收窄」直接冲突，并丢失「不强制改实例地图」「所有权句不回填、差异检测不报告」两条。已按 spec §4.5 逐字恢复 `memory-upgrade.md` 新节（导语承载两锚点 + 四条口径），概念块增守卫术语 `不得先收窄`——RED 点名（missing required readme ownership decoupling concept terms: 不得先收窄）→ GREEN（All skills are valid）。
- **Minor（deferred）**：① 负向断言仅禁 `../README.md`，裸 `README.md` 登记行可绕过窄负向——下批补强；② v3 行追加未被单独钉住（`0.1.38` 为全文存在性检查，新节亦含该词），term 可收紧为 `0.1.38 起根 README 退出文档地图登记`。（两条已随 0.1.39 补强收严：负向禁 README.md、term 收紧，双向负向实验证明咬合——裸行→红、删 v3 追加→红、还原→绿。）
