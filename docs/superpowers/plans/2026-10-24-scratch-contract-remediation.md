# 0.1.36 scratch 契约整改实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 落实 0.1.36 契约整改——升档后引用改指、②③ 搬移确认门槛、可重建产物不入热缓存、清退判据改看 handoff 时效，validator 断言同步钉住。

**Architecture:** 术语强耦合的契约文本批改：validator 断言先红 → 5 类载体（obclose SKILL、memory-bank、memory-upgrade、模板 ×3、旧 spec 状态行）逐层补绿 → 负向实验 → 发版 → 自举。全部改动共享同一组钉住术语，原子性要求高。

**Tech Stack:** Node.js ESM 校验脚本（`scripts/validate-skills.mjs`），无运行时依赖。

**Spec:** `docs/superpowers/specs/2026-10-24-scratch-contract-remediation-design.md`（已确认版，含 ZCode 复审 5 条修订）

## Global Constraints

- **术语原子性**：`obclose/SKILL.md:12`/`:47` 与 validator `close-only safety boundary` 术语必须在同一提交内一起改，否则红灯。
- **共享 4 词组不动**：`requiredScratchLifecycleTerms`（`<MMDD>-<topic>/`、`docs/research/`、`持久证据外链`、`热缓存`）保持 4 词；memory-bank 新概念块**新建键**，不扩共享数组（否则模板被连带要求确认句）。
- **模板不提 ②③**：instructions / instructions-index / agents-readme 只加「引用改指」简写与措辞统一，不出现「只在用户当次确认后」「scripts/」「samples/」。
- **`:202` 免确认清单不放 `tools/`**。
- **`skills/obinit/SKILL.md` 一字不碰**（1997/2000 wordsish 满员）。
- **快照只读**：除旧 spec 状态行（元数据例外）外，`docs/superpowers/specs/`、`docs/plans/`、既有 `docs/research/`、既有 `docs/adr/` 不改。
- **阈值数值不动**：10 个子目录 / 20 MB / 14 天。
- 提交一律显式路径 `git add <files>`，先 `git status --short` 复核无越界。
- 版本走 `npm run version:set -- 0.1.36`，5 manifest 同步。

## Review Focus

- **共享数组误扩**：模板文件不含「只在用户当次确认后」仍须绿——Task 6 步 4 用 grep 验证模板无 ②③ 术语。
- **旧句残留**：`:47` 改后 obclose 内不得再出现整句「不修改源码、依赖、构建配置或 git 配置」——Task 6 步 3 grep（范围限定本批文件，排除 `obadr/SKILL.md:22`）。
- **钉住术语被改写丢字**：正文措辞若拆散「最近 14 天更新过」「改写为指向」等短语，npm test 即红——Task 6 逐条负向实验同时反向验证钉住强度。
- **safety boundary 其余两条意外丢失**：概念块另两条（不自动提交…、git status --short）保持原位——Task 1 只替换第一条术语。
- **模板字节预算**：instructions 6,006 B、index 5,703 B 各 +30 B 级别，须仍在 8,192 B 内——Task 5 步 5 核账。
- **自举分叉**：本仓库 `.agents/instructions.md` 与模板新句必须逐字一致——Task 8 对照。

---

### Task 1: validator 断言红灯先行

**Files:**
- Modify: `scripts/validate-skills.mjs:586-599`（obclose 概念块）、`:122-135`（`requiredObinitReferenceConcepts`）、`:562-565`（close-only safety boundary）

**Interfaces:**
- Produces: 14 术语的 obclose `scratch graduation and deferred eviction` 概念块；`references/memory-bank.md` 新概念块 `scratch contract remediation`（5 术语）；safety boundary 首条术语由整句替换为 `既有源码内容` + `不改写其逻辑` 两条。

- [ ] **Step 1: 基线确认**

Run: `npm test`
Expected: `All skills are valid. (6 skills checked)`

- [ ] **Step 2: 加断言（三处）**

obclose 概念块 terms 从 9 → 14，在 `"samples/"` 后追加：

```js
"tools/",
"改写为指向",
"可重建产物",
"只在用户当次确认后",
"最近 14 天更新过",
```

`requiredObinitReferenceConcepts` 新增键（放 `obsidian-sync` 之后、`memory-upgrade` 之前）：

```js
"references/memory-bank.md": [
  {
    name: "scratch contract remediation",
    terms: ["改写为指向", "只在用户当次确认后", "tools/", "可重建产物", "最近 14 天更新过"],
  },
],
```

close-only safety boundary 首条 `"不修改源码、依赖、构建配置或 git 配置"` 替换为 `"既有源码内容"` 与 `"不改写其逻辑"` 两条（其余两条原样）。

- [ ] **Step 3: 验证红灯**

Run: `npm test`
Expected: FAIL——obclose 缺 5 术语、memory-bank 缺 5 术语、safety boundary 缺 2 术语，逐条列出。不提交红灯。

### Task 2: obclose SKILL.md 六处改动

**Files:**
- Modify: `skills/obclose/SKILL.md:12`、`:47`、`:104`、`:192-193`、`:202` 与确认清单、`:236`

**Interfaces:**
- Consumes: Task 1 的 14 + 5 + 2 术语必须全部在本文本中出现。

- [ ] **Step 1: `:12` 运行时假设重写**

```markdown
- 只写 `.agents/` 下的项目 memory；本轮调查的成型取证 / 回测报告升档写入 `docs/research/`；本轮或入库文档里指向 `.agents/scratch/` 的引用改写为指向升档后的落点，短结论内联进本轮正在撰写的文档或 `.agents/progress.md`。跨任务脚本与最小样本只在用户当次确认后移入 `scripts/` 或 `tools/`、`samples/` 或 `test/fixtures/`，移入时只剥离临时硬编码、不改写其逻辑与判据。既有源码内容、依赖、构建配置与 git 配置不改动；时点快照（`docs/superpowers/specs/`、`docs/plans/`、既有 `docs/research/`）与既有 `docs/adr/` 只读。
```

- [ ] **Step 2: `:47` 默认行为**

`不修改源码、依赖、构建配置或 git 配置。` → `不修改既有源码内容、依赖、构建配置或 git 配置。`

同时给 `:13`（git 可选 bullet）尾部追加改指扫描回退：`改指扫描在非 git 项目用 grep -rn / rg 加目录排除（跳过 docs/superpowers/、docs/research/、docs/adr/、.agents/scratch/）等价执行。`；给 `:12` 尾部追加无地图收窄：`（项目无文档地图时，改指范围收窄为 \`.agents/\` 与根 \`README.md\`）`。

- [ ] **Step 3: 步 10 拆两段（保留全部既有钉住术语）**

```markdown
10. 检查本轮任务在 `.agents/scratch/<MMDD>-<topic>/` 下的调查产物，执行当场淘金脱钩：把有独立保留价值的取证/回测报告按自包含要求（内联关键原始判据片段、统计复现口径与结果分布表）升档到 `docs/research/YYYY-MM-DD-<topic>.md`，3～10 行的短结论直接内联进对应 Spec / ADR / progress 条目；把本轮及入库文档中指向已升档产物的旧引用改写为指向升档后的落点，目标已删且结论不可恢复的引用删除或标注「原 scratch 证据已清理」；跨任务复跑脚本与最小回归样本登记为搬移候选（只在用户当次确认后移入 `scripts/` 或 `tools/`、`samples/` 或 `test/fixtures/`，移入时剥离临时硬编码，样本只保留最小必要字段），其余过程语料不升档；核对本轮新增/更新的入库文档不留 `.agents/scratch/` 持久证据外链；本轮 scratch 子目录当场默认保留作近期热缓存，不删除。
```

- [ ] **Step 4: `:192-193` 判据与僵尸提示**

`:192` handoffs 行追加：`；状态：进行中 但超过 14 天未更新的条目，提示用户确认转为已交接或删除。`

`:193` 替换为：

```markdown
- `.agents/scratch/` 是否超过约 10 个子目录或 20 MB，或存在最后修改超过 14 天、且没有任何最近 14 天更新过的 handoff 引用它的过时子目录；可重建产物与运行态（构建产物、下载的二进制、日志、pid、缓存目录）不按热缓存保留，发现即列入建议删除清单，不必等 14 天。
```

- [ ] **Step 5: `:202` 补改指（不放 tools/）+ 确认清单新增两条**

`:202` 尾段 `，消除入库文档对 \`.agents/scratch/\` 的持久证据外链。` → `，并把入库文档中指向它的旧引用改写为指向升档落点，消除持久证据外链。`

「需要用户确认后再做」新增：

```markdown
- 把登记为候选的跨任务复跑脚本 / 最小回归样本移入 `scripts/` 或 `tools/`、`samples/` 或 `test/fixtures/`（移入时剥离临时硬编码，样本只保留最小必要字段）。
- 处置 `状态：进行中` 但超过 14 天未更新的 handoff：确认转为 `已交接` 或删除。
```

- [ ] **Step 6: `:236` 口径句**

`；字数口径复用项目校验脚本的统计方式，不另造第二套。` → `；\`.agents/scratch/\` 总体积按各子目录内所有文件字节数求和（\`Get-ChildItem -Recurse | Measure-Object Length -Sum\` 或等价命令），数字只作量级参考，超限只触发确认、不阻断；\`progress.md\`、\`lessons.md\` 的行数与 KB 口径复用项目校验脚本的统计方式，不另造第二套。`

### Task 3: memory-bank.md

**Files:**
- Modify: `skills/obinit/references/memory-bank.md:31`、`:46`

- [ ] **Step 1: `:31` 规则行重写**

```markdown
- 临时调查草稿按 `.agents/scratch/<MMDD>-<topic>/` 子目录写入，并在 `.gitignore` 忽略；收尾按四分法分流：成型取证/回测报告内联关键判据片段与统计口径后升档 `docs/research/YYYY-MM-DD-<topic>.md`（短结论直接内联进正式文档），升档后入库文档中的旧引用改写为指向升档落点；跨任务复跑脚本与最小回归样本只在用户当次确认后移入 `scripts/` 或 `tools/`、`samples/` 或 `test/fixtures/`（移入时剥离临时硬编码，样本只保留最小必要字段），其余过程语料留作热缓存。可重建产物与运行态（构建产物、下载的二进制、日志、pid、缓存目录）不按热缓存保留，发现即列入建议删除清单。入库文档不留 `.agents/scratch/` 持久证据外链；当场只脱钩不删目录，超过建议规模（不超过 10 个子目录或 20 MB，单目录超 14 天且无任何最近 14 天更新过的 handoff 引用视为过时）经用户确认按目录清理。运行日志、缓存和生成物不要放进 agent memory。
```

- [ ] **Step 2: `:46` 判据行同步**

`（单目录超过 14 天且无进行中 handoff 视为过时，可清理）` → `（单目录超过 14 天且无任何最近 14 天更新过的 handoff 引用视为过时，可清理）`

### Task 4: memory-upgrade.md（v3 行 + 新节 supersede）

**Files:**
- Modify: `skills/obinit/references/memory-upgrade.md:11`（v3 行尾）、文末新节

- [ ] **Step 1: v3 行尾追加**

`；0.1.34 起追加 scratch 子目录隔离、docs/research/ 升档与零持久证据外链契约` 之后追加：`；0.1.36 起契约修正——升档后旧引用改指、②③ 需用户当次确认并补 tools/ 与限定词、可重建产物不入热缓存、清退判据改看 handoff 时效`

- [ ] **Step 2: 文末新增小节（0.1.34 节原文不动）**

```markdown
## Scratch 契约修正（0.1.36 起同代际追加）

自 0.1.36 起修正 0.1.34 节的四分法口径，**冲突处以本节为准**：

1. ②③（跨任务脚本移入 `scripts/` 或 `tools/`、最小样本移入 `samples/` 或 `test/fixtures/`）改为只在用户当次确认后执行；移入时剥离临时硬编码，样本只保留最小必要字段。
2. 升档后，入库文档中指向 `.agents/scratch/` 的旧引用改写为指向升档落点；目标已删且结论不可恢复的引用删除或标注「原 scratch 证据已清理」。
3. 可重建产物与运行态（构建产物、下载的二进制、日志、pid、缓存目录）不按热缓存保留，发现即列入建议删除清单。
4. 单目录过时判据改为「超 14 天且无任何最近 14 天更新过的 handoff 引用」；`状态：进行中` 但超 14 天未更新的 handoff 提示确认转为 `已交接` 或删除。

存量项目收敛：重复运行 `$obinit` 时按 0.1.34 节口径逐节对比（scratch 条含新增的「引用改指」简写），确认后就地更新；`.agents/scratch/` 存量分流按 0.1.34 节四分法执行，②③ 搬移与过时判据按本节执行。
```

### Task 5: 模板三件 + 旧 spec 状态行

**Files:**
- Modify: `skills/obinit/templates/instructions.md`、`skills/obinit/templates/instructions-index.md`（scratch 行）、`skills/obinit/templates/agents-readme.md:10`/`:12`、`docs/superpowers/specs/2026-10-23-scratch-lifecycle-and-research-promotion-design.md:4`

- [ ] **Step 1: 两指令模板 scratch 行加简写（同文）**

`升档到 \`docs/research/\` 或内联进正式文档，入库文档不留` → `升档到 \`docs/research/\` 或内联进正式文档，升档后旧引用改写为指向升档落点，入库文档不留`

- [ ] **Step 2: agents-readme 措辞统一**

`:10` `可清理。` → `可清理（清理前先做升档检查）。`
`:12` `原目录暂留后按目录清理。` → `原目录暂留作热缓存，超龄后按目录整体处置。`

- [ ] **Step 3: 旧 spec 状态行（快照唯一例外）**

`- 状态：待用户确认（brainstorming 产物；确认后才进 writing-plans）` → `- 状态：已实现——随 0.1.34 发布，0.1.35 补 ②③ 去向句；契约修正见《0.1.36 scratch 契约整改》spec（2026-10-24）`

- [ ] **Step 4: 验证全绿**

Run: `npm test`
Expected: `All skills are valid. (6 skills checked)`

- [ ] **Step 5: 字节核账**

Run: `wc -c skills/obinit/templates/instructions.md skills/obinit/templates/instructions-index.md skills/obinit/templates/agents-readme.md`
Expected: 三者均 < 8,192 B（基线 6,006 / 5,703 / 809，各 +40 B 内）。

- [ ] **Step 6: 提交（显式路径）**

```bash
git status --short   # 复核仅 Task 1-5 文件
git add scripts/validate-skills.mjs skills/obclose/SKILL.md skills/obinit/references/memory-bank.md skills/obinit/references/memory-upgrade.md skills/obinit/templates/instructions.md skills/obinit/templates/instructions-index.md skills/obinit/templates/agents-readme.md docs/superpowers/specs/2026-10-23-scratch-lifecycle-and-research-promotion-design.md docs/superpowers/plans/2026-10-24-scratch-contract-remediation.md
git commit -m "feat(skills): 0.1.36 契约整改——引用改指、②③ 确认门槛、可重建产物、handoff 时效判据（validator-first）"
```

### Task 6: 逐条负向红灯实验后还原

**Files:** 临时编辑 Task 1-5 的载体文件（不提交中间态）

- [ ] **Step 1: obclose 5 新术语**——逐个删（`tools/`、`改写为指向`、`可重建产物`、`只在用户当次确认后`、`最近 14 天更新过`）→ `npm test` 红点名该术语 → 原位补回 → 复绿。
- [ ] **Step 2: memory-bank 5 术语**——同法逐条。
- [ ] **Step 3: safety boundary 2 术语**——删 `既有源码内容`、`不改写其逻辑` 各一次 → 红 → 补回 → 绿。
- [ ] **Step 4: 反向验证模板未被共享数组波及**——`grep -l "只在用户当次确认后" skills/obinit/templates/*.md` 无输出；`grep -n "不修改源码、依赖" skills/obclose/SKILL.md` 无输出（obadr:22 不在扫描范围）。

### Task 7: 发版 0.1.36

- [ ] **Step 1:** `npm run version:set -- 0.1.36`，`git diff --stat` 确认 5 manifest 同步。
- [ ] **Step 2:** `npm test` 复验全绿。
- [ ] **Step 3:** 提交并推送：`git add package.json skills.json .claude-plugin/plugin.json .claude-plugin/marketplace.json .codex-plugin/plugin.json` → `chore(release): 0.1.36——scratch 契约整改（证据链闭环与写入边界）` → `git push origin main`。

### Task 8: 本仓库自举同步 + 收口

**Files:**
- Modify: `.agents/instructions.md:64`、`.agents/README.md:11-13`、`.agents/active.md`、`.agents/progress.md`、`.agents/handoffs/2026-10-24_*.md`（新建）

- [ ] **Step 1:** `.agents/instructions.md` scratch 行与模板新句逐字同步；`.agents/README.md` 与 agents-readme 模板同步措辞。
- [ ] **Step 2:** `npm test` 绿（自举文件无断言，解耦保护）；`wc -c .agents/instructions.md` < 8,192。
- [ ] **Step 3:** 写 handoff、刷新 active.md（当前任务/状态/验证/下一步）、progress.md 追加 2026-10-24 条目（含批次留痕：workspace 主工作树降级出口理由、Native inline 理由、用户「干」预授权）。
- [ ] **Step 4:** 显式路径提交收口。
