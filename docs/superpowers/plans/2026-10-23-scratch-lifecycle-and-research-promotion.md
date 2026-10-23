# Scratch 两段式生命周期与 docs/research/ 升档契约（0.1.34）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (本计划选定 Native/inline，理由：8 个文件共享同一套 validator 术语契约，强耦合，任务间不可独立验收)。Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 `.agents/scratch/` 建立 `<MMDD>-<topic>/` 子目录制、四分法收尾升档 `docs/research/`、入库文档零 `scratch` 持久外链契约，以及 `$obclose` 两段式生命周期，随 0.1.34 发布。

**Architecture:** Validator-First TDD——先在 `scripts/validate-skills.mjs` 加三组新断言验证红灯，再改模板 / references / obclose SKILL.md 至全绿，逐条负向红灯实验后还原；`obinit/SKILL.md` 本体零改动（1997/2000 满员）；memory 代际维持 v3 同代际追加；发版后本仓库自举同步。

**Tech Stack:** 纯 Node 脚本（无依赖）+ Markdown 模板；门禁 `npm test`。

**Spec:** `docs/superpowers/specs/2026-10-23-scratch-lifecycle-and-research-promotion-design.md`

## Global Constraints

- `skills/obinit/SKILL.md` 本体**一字不改**（现 1997/2000 wordsish）；第 91 行 scratch 句保持原样以过 `scratch-only temporary workspace` 断言。
- memory 代际维持 **v3**，`memory-upgrade.md` 以同代际追加方式登记 0.1.34。
- 字节硬预算：`templates/instructions.md`、`templates/instructions-index.md` 与本仓库 `.agents/instructions.md` ≤ **8192 B**；`templates/docs-readme.md` 与 `docs/README.md` ≤ **6144 B**（validator 既有 `assertByteBudget`）。
- validator 术语断言对四文件生效：`templates/instructions.md`、`templates/instructions-index.md`、`references/memory-bank.md` 需全含 `requiredScratchLifecycleTerms`；`templates/docs-readme.md` 需含 `docs/research/`。**本仓库自身的 `.agents/instructions.md` 与 `docs/README.md` 不加硬断言**（0.1.32 先例：发布与自举解耦）。
- `obclose/SKILL.md` 的 `close-only safety boundary` 原句「不修改源码、依赖、构建配置或 git 配置」必须保留。
- 模板禁项不受触：新文案无 `[[<…>]]` 占位 wikilink、无 `<a|b>` 枚举占位、无 `- \`docs/\`` 窄初始化范围写法。
- 发布序列：feature 提交 → `npm run version:set -- 0.1.34` → `npm test` → 提交推送；下游项目（bn-alpha-bot / flower-dashboard）收敛是**独立后续批次**，不在本计划内。
- 提交由主 agent 执行；每绿里程碑一提交；推送属 spec 明确授权的发布动作。

## Review Focus

- **术语断言与文案逐字对齐**：validator 找的是子串（如 `10 个子目录`、`<MMDD>-<topic>/`），文案差一个字即红——每个文件改完立即跑 `npm test` 定位。
- **字节预算单侧超限**：两处 8 KB 模板现余量 ~2.5 KB，`.agents/instructions.md` 现余量仅 782 B——改完即用 `stat -c%s` 核账，超限先压缩别硬塞。
- **负向实验后还原遗漏**：破坏实验用 `git stash` 或精确 `git checkout -- <file>` 还原，还原后必须全绿才算还原；禁止整树清扫。
- **v3 行追加处语法**：`memory-upgrade.md` 表格行是 Markdown 表格单元格，追加内容不得引入换行。
- **active.md 标题奇偶性**：收尾重建 `.agents/active.md` 时保持 `## ` 节集合与 `obclose/templates/active.md` 完全一致（validator 逐字比对），只改节内内容。

---

### Task 1: validator 三组新断言（红灯）

**Files:**
- Modify: `scripts/validate-skills.mjs`（常量区 ~L241 后、references 循环 ~L871、templates 循环 ~L1077、`requiredObinitReferenceConcepts` ~L131、`requiredSkillConcepts.obclose` ~L548）

**Interfaces:**
- Produces: 常量 `requiredScratchLifecycleTerms`（4 术语）；`requiredObinitReferenceConcepts["references/memory-upgrade.md"]` 新概念块；`requiredSkillConcepts.obclose` 新概念块。后续 Task 2–4 的文案必须满足这些断言。

- [ ] **Step 1: 基线确认**——`npm test` 输出 `All skills are valid. (6 skills checked)`。
- [ ] **Step 2: 加断言**——

```js
const requiredScratchLifecycleTerms = [
  "<MMDD>-<topic>/",
  "docs/research/",
  "持久证据外链",
  "热缓存",
];
```

1. `requiredObinitReferenceConcepts["references/memory-upgrade.md"]` 追加：
   `{ name: "scratch lifecycle and research promotion upgrade", terms: ["0.1.34", "<MMDD>-<topic>/", "docs/research/", "持久证据外链"] }`
2. `requiredSkillConcepts.obclose` 追加：
   `{ name: "scratch graduation and deferred eviction", terms: ["<MMDD>-<topic>/", "docs/research/", "持久证据外链", "热缓存", "10 个子目录", "20 MB", "14 天"] }`
3. references 循环内 `relativePath === "references/memory-bank.md"` 块：对 `referenceContent` 断言全含 `requiredScratchLifecycleTerms`，缺失时 `fail` 信息含 `must include scratch lifecycle terms`。
4. templates 循环内 `["instructions.md", "instructions-index.md"]` 块：对 `content` 断言全含 `requiredScratchLifecycleTerms`。
5. templates 循环内 `template === "docs-readme.md"` 块：断言 `content.includes("docs/research/")`。

- [ ] **Step 3: 验证红灯**——`npm test`，预期 FAIL，缺失术语逐文件列出（instructions/instructions-index 各 4 项、memory-bank 4 项、memory-upgrade 概念 4 项、docs-readme 1 项、obclose 概念 7 项）。不提交红灯。

### Task 2: 指令模板与 docs/agents-readme 模板文案

**Files:**
- Modify: `skills/obinit/templates/instructions.md:55,63`
- Modify: `skills/obinit/templates/instructions-index.md:52,66`（与 instructions.md 完全同文）
- Modify: `skills/obinit/templates/docs-readme.md:12`
- Modify: `skills/obinit/templates/agents-readme.md:10,12`

- [ ] **Step 1:「记忆库」末条替换**（两指令模板同文，spec 4.2.1 原文）：

```markdown
- 临时调查草稿按 `<MMDD>-<topic>/` 子目录写入 `.agents/scratch/`；收尾时将有独立价值的取证/回测报告（内联关键判据片段与统计口径）升档到 `docs/research/` 或内联进正式文档，入库文档不留 `.agents/scratch/` 持久证据外链，原目录暂留作热缓存后按目录定期清理；运行日志、缓存和生成物不要放进 agent memory。
```

- [ ] **Step 2:「文档地图」时点快照条替换**（两指令模板同文，spec 4.2.1 原文）：

```markdown
- 设计稿、实施计划、研究报告（`docs/research/`）等时点快照不进文档地图：它们记录当时的判断与取证，不随后续改动更新。
```

- [ ] **Step 3: docs-readme.md 模板第 12 行**（spec 4.2.2 原文）：

```markdown
设计稿、实施计划、研究报告（`docs/research/`）等**时点快照**不入表：它们记录当时的判断与取证，不随后续改动更新，各自按日期累积。
```

- [ ] **Step 4: agents-readme.md**（spec 4.2.3 简述，builder 措辞）——
  第 10 行改：`- \`scratch/\`：临时调查草稿，按 \`<MMDD>-<topic>/\` 子目录归拢，可清理。`
  第 12 行改：`临时调查草稿按 \`<MMDD>-<topic>/\` 子目录写入 \`scratch/\`；收尾把有独立价值的取证/回测报告（内联关键判据与统计口径）升档到 \`docs/research/\`，不留持久证据外链，原目录暂留后按目录清理。运行日志、缓存和生成物不要放进 agent memory。\`scratch/\` 不提交。`

- [ ] **Step 5: 核账**——`stat -c%s` 四文件：5668→≤8192、5365→≤8192、2036→≤6144、561→无硬预算；`npm test` 中三组模板断言由红转绿（memory-bank / memory-upgrade / obclose 断言仍红）。

### Task 3: memory-bank.md 与 memory-upgrade.md（v3 同代际追加）

**Files:**
- Modify: `skills/obinit/references/memory-bank.md:13-16,30,45`
- Modify: `skills/obinit/references/memory-upgrade.md:11,文末`

- [ ] **Step 1: memory-bank.md 目录树** `docs/` 下 `adr/` 行后插入：

```text
  research/         # 成型的取证、回测与领域研究报告（时点快照，按需创建）
```

- [ ] **Step 2: memory-bank.md 规则第 30 行替换**（四分法 + 零外链 + 两段式一段说清）：

```markdown
- 临时调查草稿按 `.agents/scratch/<MMDD>-<topic>/` 子目录写入，并在 `.gitignore` 忽略；收尾按四分法分流：成型取证/回测报告内联关键判据片段与统计口径后升档 `docs/research/YYYY-MM-DD-<topic>.md`（短结论直接内联进正式文档），跨任务复跑脚本进 `scripts/` 或 `tools/`，最小回归样本进 `samples/` 或 `test/fixtures/`，其余过程语料留作热缓存。入库文档不留 `.agents/scratch/` 持久证据外链；当场只脱钩不删目录，超过建议规模（不超过 10 个子目录或 20 MB，单目录超 14 天且无进行中 handoff 视为过时）经用户确认后按目录清理。运行日志、缓存和生成物不要放进 agent memory。
```

- [ ] **Step 3: memory-bank.md「按需读取」预算行**（L45）末尾追加：`；\`.agents/scratch/\` 建议不超过 10 个子目录或 20 MB（单目录超过 14 天且无进行中 handoff 视为过时，可清理）`
- [ ] **Step 4: memory-upgrade.md v3 行**（L11）末尾追加（单行内、不换行）：`；0.1.34 起追加 scratch 子目录隔离、docs/research/ 升档与零持久证据外链契约`
- [ ] **Step 5: memory-upgrade.md 文末新增小节**：

```markdown
## Scratch 生命周期与研究报告升档（0.1.34 起同代际追加）

模板自 0.1.34 起同代际追加 `.agents/scratch/` 两段式生命周期：临时调查草稿按 `<MMDD>-<topic>/` 子目录写入；收尾按四分法分流——成型取证/回测/领域研究报告内联关键判据片段与统计口径后升档 `docs/research/YYYY-MM-DD-<topic>.md`（短结论直接内联进正式文档），跨任务脚本进 `scripts/` 或 `tools/`，最小样本进 `samples/` 或 `test/fixtures/`，其余过程语料留作热缓存，超限后经用户确认按目录清理；入库文档不留 `.agents/scratch/` 持久证据外链。

存量项目收敛口径：

1. 重复运行 `$obinit` 时，逐节对比报告 `.agents/instructions.md` 的「记忆库」scratch 条与「文档地图」时点快照条、以及 `docs/README.md` 时点快照说明的差异，确认后就地更新；其余 memory 文件不动。
2. 存量 `.agents/scratch/` 已有的散装文件或旧目录不强制在 `$obinit` 期间搬迁，在后续 `$obclose` 或专门清理轮按四分法分流：未入库的成型报告补内联判据后升档 `docs/research/`，已完结的旧目录与散装过程文件经用户确认后清理；历史文档中已存在的 `.agents/scratch/` 旧引用在结论已内联或补升档后不再阻碍删除。
```

- [ ] **Step 6: 验证**——`npm test`：memory-bank 断言与 memory-upgrade 概念断言转绿（仅剩 obclose 红）。

### Task 4: obclose/SKILL.md 六处改动 → 全绿

**Files:**
- Modify: `skills/obclose/SKILL.md:12,103-107,191,194-199,201-205,232`（改后行号顺移）

- [ ] **Step 1: 运行时假设（L12）**——保留安全边界原句：

```markdown
- 只写 `.agents/` 下的项目 memory（本轮调查在 `.agents/scratch/` 中产出需升档的成型取证/回测报告时，可按收尾分流规则写入 `docs/research/`）；不修改源码、依赖、构建配置或 git 配置。
```

- [ ] **Step 2: 工作流插新步 10**（原 10–13 顺移为 11–14）：

```markdown
10. 检查本轮任务在 `.agents/scratch/<MMDD>-<topic>/` 下的调查产物，执行当场淘金脱钩：把有独立保留价值的取证/回测报告按自包含要求（内联关键原始判据片段、统计复现口径与结果分布表）升档到 `docs/research/YYYY-MM-DD-<topic>.md`，3～10 行的短结论直接内联进对应 Spec / ADR / progress 条目；核对本轮新增/更新的入库文档不留 `.agents/scratch/` 持久证据外链；本轮 scratch 子目录当场默认保留作近期热缓存，不删除。
```

- [ ] **Step 3: Memory 维护「每次收尾时检查」**（handoffs 行后）加：`- \`.agents/scratch/\` 是否超过约 10 个子目录或 20 MB，或存在最后修改超过 14 天且无进行中 handoff 关联的过时子目录。`
- [ ] **Step 4:「可以直接做的维护」加**：`- 将本轮 \`.agents/scratch/<MMDD>-<topic>/\` 中已定稿的成型研究/取证/回测报告（含关键判据片段与统计口径）升档写入 \`docs/research/YYYY-MM-DD-<topic>.md\`，消除入库文档对 \`.agents/scratch/\` 的持久证据外链。`
- [ ] **Step 5:「需要用户确认后再做」加**：`- 按子目录批量清理已脱钩的过时 \`.agents/scratch/<MMDD>-<topic>/\` 目录或历史散装草稿：先列出候选子目录、体积、最后修改日期与结论是否已升档 \`docs/research/\` 或内联，经确认后按目录整体删除；历史文档曾提及路径但结论已升档/内联的不阻碍清理。`
- [ ] **Step 6:「完成说明」memory 占用行**（L232）改为：

```markdown
- memory 占用：`progress.md`、`lessons.md` 的行数和 KB，以及 `handoffs/` 数量，与各自阈值并列；`.agents/scratch/` 的子目录数与总体积（与 10 个子目录 / 20 MB 阈值并列），及本次是否升档了 `docs/research/` 报告或存在建议清理的过时 scratch 子目录；字数口径复用项目校验脚本的统计方式，不另造第二套。
```

- [ ] **Step 7: 验证**——`npm test` 全绿 `All skills are valid. (6 skills checked)`；`skills/obclose/SKILL.md` wordsish 仍 < 5000（现 3819 + ~150）。

### Task 5: 逐条负向红灯实验后还原

**Files:** 临时破坏 Task 2–4 已改的五个断言载体文件，逐个还原。**注意：此时 feature 尚未提交，`git checkout --` 会冲掉全部改动——破坏与还原都必须用精确编辑（删术语 → 红 → 原位补回 → 绿），不碰 git。**

- [ ] **Step 1–5:** 依次对 `templates/instructions.md`、`templates/docs-readme.md`、`references/memory-bank.md`、`references/memory-upgrade.md`、`skills/obclose/SKILL.md` 各做一次：精确删除该文件中一处新术语（如 `热缓存`）→ `npm test` 报对应 `missing required ... concept terms` / `must include ... terms` 红 → 原位补回该术语 → `npm test` 复绿。五个实验全过才进 Task 6。

### Task 6: 提交、发版 0.1.34、推送

- [ ] **Step 1: feature 提交**——`git add scripts/validate-skills.mjs skills/obinit/templates/ skills/obinit/references/memory-bank.md skills/obinit/references/memory-upgrade.md skills/obclose/SKILL.md docs/superpowers/plans/2026-10-23-scratch-lifecycle-and-research-promotion.md`（显式路径，先 `git status --short` 复核无越界），message：`feat(skills): scratch 两段式生命周期与 docs/research/ 升档契约（validator-first，0.1.34 内容）`。
- [ ] **Step 2: 发版**——`npm run version:set -- 0.1.34`，`git diff --stat` 确认 5 个 manifest 同步（package.json、skills.json、.claude-plugin/plugin.json、.claude-plugin/marketplace.json、.codex-plugin/plugin.json），`npm test` 复验全绿。
- [ ] **Step 3: release 提交并推送**——message：`chore(release): 0.1.34——scratch 生命周期与研究报告升档契约`；`git push origin main`。

### Task 7: 本仓库自举同步（发布后）

**Files:**
- Modify: `.agents/instructions.md:64,72`（Task 2 Step 1/2 同文替换）
- Modify: `.agents/README.md`（scratch 两行，比照 Task 2 Step 4 措辞、指向 `.agents/scratch/` 全路径）
- Modify: `docs/README.md:12,24`

- [ ] **Step 1: instructions.md 两句替换**（同 Task 2 Step 1/2 文本）。
- [ ] **Step 2: .agents/README.md**——`scratch/` 条目与说明行按 Task 2 Step 4 同步。
- [ ] **Step 3: docs/README.md**——第 12 行用 Task 2 Step 3 文本；表格时点快照兜底行（L24）改为：`| \`docs/superpowers/\`（\`specs/\`、\`plans/\`）、\`docs/research/\` | 时点快照：当时的判断与取证，不随后续改动更新 | 不更新 |`
- [ ] **Step 4: 核账与验证**——`.agents/instructions.md` ≤ 8192 B（现 7410）、`docs/README.md` ≤ 6144 B（现 3554）；`npm test` 全绿（这两个文件无新断言，解耦保护）。插件侧更新/reload 按 `docs/adr/0001-use-marketplace-plugin-update-flow.md` 由用户客户端执行，不阻塞本步（自检依据：本仓库 0.1.33 已含 v3 契约）。
- [ ] **Step 5: skillcheck 清理候选**——`.agents/scratch/skillcheck/`（2026-09-19 遗留 clip-01..30.txt）按新规列入候选，**列出不删除**（需用户确认）。
- [ ] **Step 6: 提交**——`docs(memory): 0.1.34 自举同步——scratch 生命周期契约入本仓库 memory`。

### Task 8: 收尾（obclose 流程）

- [ ] **Step 1: handoff 更新**——`.agents/handoffs/2026-10-23_063100_agy_...md`：状态→`已交接`，修正过时的「下一步」，填结论（实现+发版+自举完成；下游收敛与 skillcheck 清理待后续批次/确认）。
- [ ] **Step 2: active.md 就地更新**——保持节集合不变，当前状态指向本批次权威载体（commits/0.1.34）。
- [ ] **Step 3: progress.md 追加**——`templates/progress-entry.md` 格式，`来源：zcode/scratch-lifecycle-and-research-promotion`，追加到文件末尾。
- [ ] **Step 4: 批次留痕核验**——spec/plan 路径、workspace（主工作树 + 降级理由）、Native/inline 理由，已写入 progress 条目。
- [ ] **Step 5: `npm test` 终验 + 完成说明汇报**（含 memory/scratch 占用行）。
