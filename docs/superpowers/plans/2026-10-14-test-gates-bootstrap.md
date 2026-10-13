# 测试门禁骨架进 obinit（验证分层落地填值卡）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让 `$obinit` 初始化/接入项目时在 `.agents/instructions.md` 登记验证落地值（填值卡），validator 钉住卡形状，随 0.1.32 发布，reload 后自举补卡并推进代际标记。

**Architecture:** 契约文本（模板卡）+ 运营判据（init-modes 下沉文本）+ 代际记账（memory-upgrade v3 行合成与口径小节）+ 职责说明（memory-bank 一句）+ validator 断言（形状钉死）五件同批；发布与自举解耦——Task 1–5 只改插件侧，Task 6 在用户 reload 后改本仓库 `.agents/instructions.md`（补真值卡 + 代际 v2→v3 + validator 字面量同批）。

**Tech Stack:** Node.js ESM 脚本（`scripts/validate-skills.mjs` 即测试，无测试框架）、npm scripts、纯 Markdown 契约文件。

**Spec:** `docs/superpowers/specs/2026-10-14-test-gates-bootstrap-design.md`（已确认，commit 6e1cd17；plan 论证以 spec 为准，两者随行）

## Global Constraints

- 策略归 agent 全局规则，项目文件只填值、不复述策略；行内括号是填值形状提示，逐字符按本 plan 定稿文本，不改写。
- `skills/obinit/SKILL.md` **净增 0 词**（实测 1998/2000，`validate-skills.mjs:908` `bodyLimit = 2000`）——本批禁改该文件，细节全部下沉 references。
- `templates/instructions-index.md` 整节不加（validator 负向断言钉死）。
- 填值语义：有测试或 CI 的项目**六行全填**，无对应机制的行写「无」（不留空行）；无测试且无 CI 的项目运行时把节体替换为一行「有意留空（判定于 <日期>）」——模板本身保持六行卡，「有意留空」四个字不得出现在任何模板里。
- 同代际追加：不建 v4、不写迁移清单；memory-upgrade v3 行合成一句，不出现两个版本路标。
- validator 不钉机制名词（禁把 `@watches` 之类实现细节写进断言）；**不对 `.agents/instructions.md` 加新节断言**。
- 版本只经 `npm run version:set 0.1.32` 写 5 处（package.json、skills.json、.claude-plugin/plugin.json、.codex-plugin/plugin.json、.claude-plugin/marketplace.json），不手改 package.json。当前版本 0.1.31。
- 本仓库无 CI：`npm test` 是唯一发布门禁，push 前本地全绿；重型验证串行。
- 发布与自举解耦：Task 1–5 不改 `.agents/instructions.md` 与 validator 的 `requiredSelfHostingGateTerms` 字面量（含 `"0.1.28"`，:137）——自举两动作在 reload 后的 Task 6 同批执行，否则发布前 `npm test` 必红或违反自举门禁时序。
- 提交用显式路径 `git add <files>...`，禁 `git add -A`；每绿即提交；负向红灯实验后必须还原并复绿。

## Review Focus

1. **卡文本被改写**——断言只钉 8 个子串，行内括号改写仍会绿；人读到的应是 spec §1 定稿原文。钉子：Task 1 Step 7 用 diff 逐字符对照本文 Task 1 的定稿卡文。
2. **卡插入位置漂移**——validator 无位置断言，插错位置要到发布后重复运行才暴露。钉子：Task 1 Step 7 检查节顺序为 文档地图 → 验证分层落地 → 协作策略。
3. **「有意留空」形态误进模板**——它只是 obinit 运行时写项目文件的形态，进模板会让所有新项目初始化即报差异。钉子：Task 1 Step 7 grep 模板无「有意留空」。
4. **init-modes 下沉文本与模板口径漂移**——概念断言只钉 6 个子串，口径句子改写不触发红灯。钉子：Task 2 文本照抄本文定稿，Step 5 核对「六行全填 / 有意留空 / 同一任务内 / 不报差异」四口径齐备。
5. **自举补卡减行、写空行或压缩卡的行**——行数与模板一致是重复运行判绿前提。钉子：Task 6 Step 3 对照六行标签逐行核对 + 字节实测 ≈6951 B；逼近 8 KB 时按 memory-bank:38 压缩旧节说明，不动卡的行。

---

### Task 1: 填值卡进模板 + validator 断言 1/2

**Files:**
- Modify: `scripts/validate-skills.mjs`（常量区 :235 `requiredMemoryBudgetTerms` 之后；模板循环 :1116–1118 `## 协作策略` 检查块之后）
- Modify: `skills/obinit/templates/instructions.md`（:64 文档地图节末行与 :66 `## 协作策略` 之间）
- Create: `.agents/handoffs/2026-10-14_<HHMMSS>_zcode_test-gates-bootstrap.md`

**Interfaces:**
- Consumes: validator 既有形状——模板循环内 `content` 变量、`fail()`、`assertNoPhrases()`。
- Produces: 常量 `requiredVerificationLandingTerms`（Task 5 发版门禁依赖它全绿）；模板「验证分层落地」节（Task 6 自举卡与其同行数同标签）。

- [ ] **Step 1: 建批次 handoff 文件**

按仓库协议建 `.agents/handoffs/2026-10-14_<HHMMSS>_zcode_test-gates-bootstrap.md`（状态：进行中；任务：验证分层落地填值卡 0.1.32 批次；涉及文件：本 plan 改动清单）。随 Task 1 一并提交。

- [ ] **Step 2: 写 validator 断言（先红）**

在 `requiredMemoryBudgetTerms` 常量之后加：

```js
const requiredVerificationLandingTerms = [
  "## 验证分层落地",
  "验证策略由 agent 全局规则承担",
  "- 受影响测试命令：",
  "- 提交门禁命令（本项目实际跑什么）：",
  "- 全量命令与承担者（本项目跑在哪，本地 / CI）：",
  "- 依赖图推不出的检查与触发范围（读源码文本、数据驱动、子进程类）：",
  "- 测试并发预算与依据（值：并发数；依据：实测数据）：",
  "- 选跑器路径：",
];
```

在模板循环的 `## 协作策略` 检查块（:1116–1118）之后加：

```js
if (skillName === "obinit" && template === "instructions.md") {
  const missing = requiredVerificationLandingTerms.filter((term) => !content.includes(term));
  if (missing.length > 0) {
    fail(`${skillName}: template ${template} must include the verification landing card terms: ${missing.join(", ")}`);
  }
}

if (skillName === "obinit" && template === "instructions-index.md") {
  assertNoPhrases(`${skillName}: template ${template}`, content, ["## 验证分层落地"], (phrase) => {
    return `index template must not gain the verification landing card: ${phrase}`;
  });
}
```

- [ ] **Step 3: 跑 npm test 验证红灯（断言 1 的负向）**

Run: `npm test`
Expected: FAIL，报 `must include the verification landing card terms: ## 验证分层落地, …`（8 项全列）。

- [ ] **Step 4: 卡文进模板（spec §1 定稿，逐字符照抄）**

在 `templates/instructions.md` 的文档地图节末行（:64 体积预算行）之后、`## 协作策略` 之前插入（含节间空行，净增 535 B）：

```markdown
## 验证分层落地

验证策略由 agent 全局规则承担（验证与审查；执行者无全局规则时，本节改记完整验证策略），本节登记本项目的落地值：

- 受影响测试命令：
- 提交门禁命令（本项目实际跑什么）：
- 全量命令与承担者（本项目跑在哪，本地 / CI）：
- 依赖图推不出的检查与触发范围（读源码文本、数据驱动、子进程类）：
- 测试并发预算与依据（值：并发数；依据：实测数据）：
- 选跑器路径：
```

- [ ] **Step 5: 跑 npm test 验证全绿**

Run: `npm test`
Expected: `All skills are valid. (6 skills checked)`。

- [ ] **Step 6: 断言 2 的负向红灯（故意改坏再还原）**

临时在 `templates/instructions-index.md` 任意位置加一行 `## 验证分层落地` → 跑 `npm test`，Expected: FAIL，报 `index template must not gain the verification landing card` → 删掉该行还原 → 再跑 `npm test` 全绿。

- [ ] **Step 7: 形状验收（Review Focus 1–3 的钉子）**

- `git diff skills/obinit/templates/instructions.md` 与 Step 4 定稿卡文逐字符一致；节顺序为 文档地图 → 验证分层落地 → 协作策略。
- `grep -c "有意留空" skills/obinit/templates/instructions.md` Expected: `0`。
- `node -e "console.log(require('node:fs').statSync('skills/obinit/templates/instructions.md').size)"` Expected: `5667`（< 8192）。

- [ ] **Step 8: Commit**

```bash
git add scripts/validate-skills.mjs skills/obinit/templates/instructions.md .agents/handoffs/
git commit -m "feat(obinit): 新项目模板加验证分层落地填值卡并钉 validator 断言"
```

### Task 2: 判据下沉 init-modes + validator 断言 3（C1）

**Files:**
- Modify: `scripts/validate-skills.mjs`（`requiredObinitReferenceConcepts` :118–131）
- Modify: `skills/obinit/references/init-modes.md`（文末追加一段）

**Interfaces:**
- Consumes: Task 1 的模板卡（判据描述的就是它的填值行为）。
- Produces: `requiredObinitReferenceConcepts["references/init-modes.md"]` 条目（后续规则变更时词表随文本演进）；init-modes 判据段（Task 3 口径小节与之互为印证，不复制长句）。

- [ ] **Step 1: 加概念断言（先红）**

`requiredObinitReferenceConcepts` 新增条目（新键按字母序排在既有两键之前：`references/init-modes.md` < `references/memory-upgrade.md` < `references/obsidian-sync.md`）：

```js
  "references/init-modes.md": [
    {
      name: "verification landing card",
      terms: ["验证分层落地", "测试文件", "同一任务内", "六行全填", "有意留空", "不报差异"],
    },
  ],
```

- [ ] **Step 2: 跑 npm test 验证红灯（断言 3 的负向）**

Run: `npm test`
Expected: FAIL，报 `missing required verification landing card concept terms: 验证分层落地, …`（6 项全列）。

- [ ] **Step 3: 判据文本进 init-modes.md（定稿，照抄）**

在 `skills/obinit/references/init-modes.md` 文末（:25 项目相关知识收敛段之后）追加一段（该文件全文无 `##` 小节，保持段落形态）：

```markdown
验证分层落地节（新项目模板）按项目实际填值。主判定信号是存在测试文件（`*.test.*` / `*_test.go` / `tests/` / `spec/` 之一）；辅信号是 `package.json` 的 test script 与 CI 配置（`.github/workflows/`、`.gitlab-ci.yml` 等托管形态），主信号不依赖 CI。有任一信号的项目六行全填，无对应机制的行写「无」，不留空行；两项信号都没有的项目把节体替换为一行「本项目无测试与 CI，本节有意留空（判定于 <日期>）；引入测试时按模板填值」，不整节删除。测试架构、门禁命令或 CI 配置变更的同一任务内同步更新该节，与文档地图同款机制，不挂 `$obclose` 收尾。重复运行逐节对比时，六行全填、一行有意留空与索引型整节不加均为有意形态，不报差异。
```

- [ ] **Step 4: 跑 npm test 验证全绿**

Run: `npm test`
Expected: `All skills are valid. (6 skills checked)`。

- [ ] **Step 5: 口径验收（Review Focus 4 的钉子）+ B1 复核**

- Step 3 文本中「六行全填」「有意留空」「同一任务内」「不报差异」四个口径词齐备（断言词表即从这句来，红灯已证）。
- B1：`git status --short skills/obinit/SKILL.md` Expected: 空（SKILL.md 未动，正文仍 1998/2000 词）。

- [ ] **Step 6: Commit**

```bash
git add scripts/validate-skills.mjs skills/obinit/references/init-modes.md
git commit -m "feat(obinit): 验证落地判据与同步豁免下沉 init-modes 并加概念断言"
```

### Task 3: memory-upgrade v3 行合成 + 填值口径小节

**Files:**
- Modify: `skills/obinit/references/memory-upgrade.md`（:11 v3 表行；文末新小节）

**Interfaces:**
- Consumes: Task 2 的 init-modes 判据段（口径小节指向同一套语义，不另起炉灶）。
- Produces: v3 行的 0.1.32 追加记录（重复运行差异检测读它豁免三种有意形态）。

- [ ] **Step 1: v3 行合成一句（spec §3 定稿原文）**

把 :11 表行替换为（一行内不出现两个版本路标断点）：

```markdown
| v3 | 0.1.29 | `docs/README.md` 文档地图、`## 文档地图` 占位节与同批更新规则；0.1.30 起同代际追加体积预算与读取分级，0.1.32 起追加『验证分层落地』填值卡（有测试或 CI 的项目六行全填，无对应机制写『无』；无测试项目记一行有意留空；索引型不加节——三者均为有意形态，重复运行不报差异） |
```

- [ ] **Step 2: 文末追加口径小节（照 :73「有意保留」形状）**

```markdown
## 验证分层落地（0.1.32 起同代际追加）

模板自 0.1.32 起含「验证分层落地」填值卡：验证策略由 agent 全局规则承担，项目只登记落地值。填值口径：有测试或 CI 的项目六行全填，无对应机制的行写「无」，不留空行；无测试且无 CI 的项目把节体替换为一行「有意留空（判定于 <日期>）」；索引型整节不加。三者均为有意保留形态，逐节对比不报差异。测试架构、门禁命令或 CI 配置变更的同一任务内同步更新该节。
```

- [ ] **Step 3: 跑 npm test 验证全绿**

Run: `npm test`
Expected: `All skills are valid. (6 skills checked)`（该文件既有概念断言 terms 全部仍在）。

- [ ] **Step 4: Commit**

```bash
git add skills/obinit/references/memory-upgrade.md
git commit -m "docs(obinit): memory-upgrade v3 行合成 0.1.32 填值卡追加并补口径小节"
```

### Task 4: memory-bank 登记说明

**Files:**
- Modify: `skills/obinit/references/memory-bank.md`（:38 instructions.md 必读条目，spec 遗留的落点问题在此收口）

**Interfaces:**
- Consumes: 无。
- Produces: instructions.md 职责描述中登记了新节（spec 开放问题「落点段落」的定稿 = :38「每次必读，必须小」块的 instructions.md 条目）。

- [ ] **Step 1: :38 条目末尾追加一句（定稿）**

```markdown
其中的「验证分层落地」节由 obinit 初始化或重复运行时按项目实际登记验证落地值，登记口径见 `memory-upgrade.md`。
```

- [ ] **Step 2: 跑 npm test 验证全绿**

Run: `npm test`
Expected: `All skills are valid. (6 skills checked)`（usage-falsification 与 active.md 预算声明断言不受影响）。

- [ ] **Step 3: Commit**

```bash
git add skills/obinit/references/memory-bank.md
git commit -m "docs(obinit): memory-bank 登记 instructions.md 验证分层落地节"
```

### Task 5: 0.1.32 发版批次

**Files:**
- Modify: `package.json`、`skills.json`、`.claude-plugin/plugin.json`、`.codex-plugin/plugin.json`、`.claude-plugin/marketplace.json`（全部由 version:set 代写）
- Modify: `.agents/progress.md`（末尾追加）、`.agents/active.md`（派生视图重建口径就地更新）

**Interfaces:**
- Consumes: Task 1–4 的全部提交（本任务 push 时一并出站，含既有的 c998e2d 与 spec 提交 6e1cd17）。
- Produces: 已发布的 0.1.32（Task 6 的前置条件）。

- [ ] **Step 1: 版本推进**

Run: `npm run version:set 0.1.32`
Expected: 5 个文件版本字段写为 0.1.32；`git status --short` 恰好列出这 5 个文件。

- [ ] **Step 2: 全量门禁**

Run: `npm test`
Expected: `All skills are valid. (6 skills checked)`（发布层门禁；本仓库无 CI，无兜底）。

- [ ] **Step 3: 文档地图同步核对（不涉及不硬凑）**

- 根 `README.md`：事实范围是项目定位、用法、安装与发布流程、npm scripts——本批未触及，**不需更新**。
- `docs/README.md`：自身同步触发是「文档新增、改名或下掉」——本批无，**不需更新**。若核对时发现与预期不符（如实际改了用法），停下先同步再继续。

- [ ] **Step 4: 记忆收口（升序追加，权威状态载体口径）**

- `.agents/progress.md` 末尾追加本次发布条目：已完成五件套（模板卡 / init-modes 判据 / memory-upgrade 记账 / memory-bank 登记 / validator 三断言）、验证证据（三次负向红灯 + 全绿输出）、已变更文件清单、下一部（reload 后自举），末行 `- 来源：zcode/test-gates-bootstrap`。
- `.agents/active.md` 就地更新：当前任务改为「0.1.32 已发布待 reload 自举」；`下一步` 第 1 条改写为「reload 后补真值卡 + 代际 v2→v3」（原欠账的执行条件到 Task 6 才满足，不提前划掉）。

- [ ] **Step 5: Commit + Push**

```bash
git add package.json skills.json .claude-plugin/plugin.json .codex-plugin/plugin.json .claude-plugin/marketplace.json .agents/progress.md .agents/active.md
git commit -m "chore(release): 0.1.32——验证分层落地填值卡与 active.md 预算批次"
git push origin main
```

Expected: push 含既有 `c998e2d`、`6e1cd17` 与本批全部提交。

- [ ] **Step 6: 停——交棒用户**

请用户按 `docs/adr/0001-use-marketplace-plugin-update-flow.md` 更新插件到 0.1.32 并 reload。Task 6 依赖用户确认 reload 完成；本步阻塞等待，不得自行标记完成。

### Task 6: reload 后自举（用户门控，可在后续会话执行）

**Files:**
- Modify: `.agents/instructions.md`（文档地图节后插卡；:19 代际推进；:20 去掉已失效的尾句）
- Modify: `scripts/validate-skills.mjs`（:137 字面量 `"0.1.28"` → `"0.1.29"`）

**Interfaces:**
- Consumes: 已发布并 reload 的 0.1.32（Task 5 产出）；模板卡（Task 1）作为补卡的行数与标签基准。
- Produces: 本仓库收敛到 v3 契约 + 真值卡（active.md 下一步第 1 条欠账清零）。

- [ ] **Step 1: 自检加载版本（自举门禁正文自检口径）**

确认当前会话加载的 `$obinit` 正文已含新契约（如 init-modes 判据 / 模板指针）；无法确认时请用户复核插件版本为 0.1.32。加载到的仍是旧版时按自举门禁行事：只读分析，不改 `.agents/`。

- [ ] **Step 2: 重复运行先报缺失差异**

按已加载 `$obinit` 重复运行模式对比本仓库 `.agents/instructions.md` 与 0.1.32 模板。
Expected: 差异报告列出「模板有、文件没有的章节：`## 验证分层落地`」，且无其他新增差异项；若冒出别的差异，停下逐项向用户确认后再继续。

- [ ] **Step 3: 补六行真值卡 + 推进代际（一次 reload 两个动作 + validator 字面量同批）**

在 `.agents/instructions.md` 的文档地图节（:73 末行）之后、`## 重复运行`（:75）之前插入，标签与模板逐行一致，值按本仓库真值填写（六行全填，不留空行）：

```markdown
## 验证分层落地

验证策略由 agent 全局规则承担（验证与审查；执行者无全局规则时，本节改记完整验证策略），本节登记本项目的落地值：

- 受影响测试命令：`npm test`（validate-skills.mjs 扫描式断言，无受影响子集，任何改动等价全量）
- 提交门禁命令（本项目实际跑什么）：`npm test` 全绿；无独立 lint / 类型检查步骤
- 全量命令与承担者（本项目跑在哪，本地 / CI）：`npm test`，本地（本仓库无 CI）
- 依赖图推不出的检查与触发范围（读源码文本、数据驱动、子进程类）：validate-skills.mjs 对 `skills/**`、模板与 references 的文本断言——改 `skills/**` 即触发
- 测试并发预算与依据（值：并发数；依据：实测数据）：无（validator 单进程串行，无并发参数）
- 选跑器路径：无（无测试框架与选跑器）
```

同批改 `.agents/instructions.md`：
- :19 `当前 memory 代际：v2，对应插件版本 \`0.1.28\` 及以上` → `当前 memory 代际：v3，对应插件版本 \`0.1.29\` 及以上`（其余不动）。
- :20 删去尾句「0.1.29 发布并 reload 后再把本行改为 v3 / \`0.1.29\`。」，保留通用推进规则句。

同批改 `scripts/validate-skills.mjs` :137：`requiredSelfHostingGateTerms` 中 `"0.1.28"` → `"0.1.29"`（不加任何新断言）。

- [ ] **Step 4: 验证**

Run: `npm test`
Expected: `All skills are valid. (6 skills checked)`；`node -e "console.log(require('node:fs').statSync('.agents/instructions.md').size)"` Expected: ≈`6951`（< 8192；逼近上限时按 memory-bank:38 压缩旧节说明，不动卡的行）。

- [ ] **Step 5: 重复运行差异为空**

再跑一次 `$obinit` 重复运行模式。
Expected: 「验证分层落地」缺失差异消失，报告为空（memory-upgrade 迁移验证口径）。若仍报差异，逐项消解后再提交。

- [ ] **Step 6: Commit + 收口**

```bash
git add .agents/instructions.md scripts/validate-skills.mjs .agents/progress.md .agents/active.md
git commit -m "chore(bootstrap): reload 后自举——补真值卡并推进代际标记 v2→v3"
git push origin main
```

提交前把 active.md 下一步第 1 条欠账清零（补卡与代际推进已完成，属权威状态载体可记录的完成态）；progress.md 追加自举条目（含两次重复运行的差异证据）。
