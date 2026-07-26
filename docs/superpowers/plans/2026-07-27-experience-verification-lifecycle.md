# 经验验证与退役闭环实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 按 [spec](../specs/2026-07-27-experience-verification-lifecycle-design.md) 把 `下次检查` 从静态字段升级为有稳定触发点的验证与退役流程,覆盖项目内 lessons 和 Obsidian 公共知识两层。

**Architecture:** 分布式触发,三个既有触点各担一段:使用中证伪(obinit 生成的 instructions 协议)、`$obclose` 收尾增量验证、`$obcurate` 批量复查与退役 GC。载体格式:lessons 条目新增 `验证方式` / `最后验证` / `状态` 字段;公共知识笔记扩展 frontmatter `status` 取值并新增 `last_verified`。

**Tech Stack:** Markdown skill 文件 + Node.js 校验脚本(`scripts/validate-skills.mjs`)。本仓库的 TDD 循环是 validator-first:先加校验(红灯),再补 skill 内容(绿灯)。

## Global Constraints

- 所有 skill 正文和模板使用简体中文;机器层 token 保持英文:`needs-review`、`deprecated`、`active`、`draft`、`last_verified`。
- 中文展示层配对写法(项目既有约定):待复核(`needs-review`)、已退役(`deprecated`)。
- lessons 条目字段名(全角冒号):`验证方式：`、`最后验证：`、`状态：`。
- 模板占位符禁止 `<a|b>` 枚举形式(validator 的 angleBracketEnums 检查会拒绝含 `|` 的 `<>` 占位),用顿号或文字描述替代。
- 历史条目不批量迁移:根目录 `.agents/lessons.md` 现有 `下次检查` 条目保持原样,不在本计划中修改。
- 每个任务:先改 validator 跑 `npm test` 确认红灯,再改内容跑 `npm test` 确认绿灯,然后 commit(只 add 本任务的文件)。
- 测试命令:`npm test`(在仓库根 `e:\Developer\Github-GeekXtop\obsidian-agent-skills` 运行),绿灯输出 `All skills are valid.`。
- 不发版、不 bump 版本、不推送;release 由用户决定。

---

### Task 0: 落地在途改动

工作区有上一轮 `$obcurate` 任务的未提交改动(`.agents/active.md`、`.agents/lessons.md`、`.agents/progress.md`、`scripts/validate-skills.mjs`、`skills/obcurate/SKILL.md`)。`.agents/active.md` 记录该工作已完成且 `npm test` 绿灯,下一步就是"用户决定是否提交"。本计划要继续修改其中两个文件,必须先让它们以独立提交落地,避免混入本计划的提交。

**Files:**
- Commit(不修改内容): `.agents/active.md`、`.agents/lessons.md`、`.agents/progress.md`、`scripts/validate-skills.mjs`、`skills/obcurate/SKILL.md`

**Interfaces:**
- Produces: 干净工作树,后续任务的 diff 只含本计划内容。

- [ ] **Step 1: 确认在途改动仍是绿灯**

Run: `npm test`
Expected: `All skills are valid.`

- [ ] **Step 2: 查看 diff 确认只含 obcurate 展示分组修正和 memory 更新**

Run: `git diff --stat`
Expected: 只有上述五个文件。若出现其他文件,停下向用户报告。

- [ ] **Step 3: Commit**

```bash
git add .agents/active.md .agents/lessons.md .agents/progress.md scripts/validate-skills.mjs skills/obcurate/SKILL.md
git commit -m "Refine obcurate catalog display-group rules and sync memory"
```

---

### Task 1: lessons 载体格式升级(模板层)

**Files:**
- Modify: `skills/obclose/templates/lesson-entry.md`(整文件替换,现 7 行)
- Modify: `skills/obinit/templates/lessons.md`(整文件替换,现 15 行)
- Modify: `scripts/validate-skills.mjs`

**Interfaces:**
- Produces: 字段词汇 `验证方式：` / `最后验证：` / `状态：`,状态 token `needs-review` / `deprecated`,展示词 待复核 / 已退役。Task 2/3 的 SKILL.md 文本引用这些字段名。

- [ ] **Step 1: validator 加模板校验(红灯)**

在 `scripts/validate-skills.mjs` 顶部常量区(`requiredAuthoritativeStateCarrierTerms` 之后)加:

```js
const requiredEvidenceGradedStatusTerms = [
  "按证据强度分级",
  "直接证伪证据",
  "needs-review",
  "deprecated",
  "待复核",
  "已退役",
];

const requiredLessonVerificationFieldTerms = ["验证方式：", "最后验证：", "状态："];

const forbiddenLessonLegacyFieldTerms = ["下次检查"];

const requiredUsageFalsificationTerms = ["使用中证伪", "直接证伪证据", "needs-review", "deprecated", "最后验证"];
```

(`requiredEvidenceGradedStatusTerms` 和 `requiredUsageFalsificationTerms` 本任务只声明,Task 2/3 使用;JS 声明未使用不报错。)

在模板循环内(`if (skillName === "oblearn" && template === "public-knowledge-note.md")` 之前)加:

```js
if ((skillName === "obclose" && template === "lesson-entry.md") || (skillName === "obinit" && template === "lessons.md")) {
  for (const term of requiredLessonVerificationFieldTerms) {
    if (!content.includes(term)) {
      fail(`${skillName}: template ${template} must include lesson verification field: ${term}`);
    }
  }
  assertNoPhrases(`${skillName}: template ${template}`, content, forbiddenLessonLegacyFieldTerms, (phrase) => {
    return `must use 验证方式/最后验证/状态 fields instead of legacy field: ${phrase}`;
  });
}
```

- [ ] **Step 2: 跑测试确认红灯**

Run: `npm test`
Expected: FAIL,输出含 `obclose: template lesson-entry.md must include lesson verification field: 验证方式：`、`legacy field: 下次检查` 及 obinit lessons.md 的对应缺失。

- [ ] **Step 3: 替换 `skills/obclose/templates/lesson-entry.md` 全文**

```md
## YYYY-MM-DD - <简短经验标题>

- 背景：
- 经验：
- 适用场景：
- 验证方式：<可执行检查和预期结果，例如命令、文件或术语存在性检查>
- 最后验证：YYYY-MM-DD <一行验证结论；新条目以创建日期为首次验证>
- 状态：<active 时省略本行；待复核（`needs-review`）或已退役（`deprecated`）时注明一行原因和日期>
```

- [ ] **Step 4: 替换 `skills/obinit/templates/lessons.md` 全文**

````md
# 经验记录

本文件只记录项目内可复用经验。

## 格式

```md
## YYYY-MM-DD - <简短经验标题>

- 背景：
- 经验：
- 适用场景：
- 验证方式：<可执行检查和预期结果，例如命令、文件或术语存在性检查>
- 最后验证：YYYY-MM-DD <一行验证结论；新条目以创建日期为首次验证>
- 状态：<active 时省略本行；待复核（`needs-review`）或已退役（`deprecated`）时注明一行原因和日期>
```
````

- [ ] **Step 5: 跑测试确认绿灯**

Run: `npm test`
Expected: `All skills are valid.`

- [ ] **Step 6: Commit**

```bash
git add skills/obclose/templates/lesson-entry.md skills/obinit/templates/lessons.md scripts/validate-skills.mjs
git commit -m "Upgrade lesson entry template with verification lifecycle fields"
```

---

### Task 2: `$obclose` 收尾增量验证

**Files:**
- Modify: `skills/obclose/SKILL.md`
- Modify: `scripts/validate-skills.mjs`

**Interfaces:**
- Consumes: Task 1 的字段词汇。
- Produces: `## 经验验证` 一节(增量验证 + 证据分级规则的规范文本);Task 3 的 instructions 协议与之同语义。

- [ ] **Step 1: validator 给 obclose 加概念校验(红灯)**

在 `requiredSkillConcepts.obclose` 数组末尾加两个概念:

```js
{
  name: "incremental lesson verification",
  terms: ["增量验证", "只验证与本次任务相关", "验证方式", "最后验证", "已使用知识", "last_verified", "不批量迁移"],
},
{
  name: "evidence-graded deprecation",
  terms: requiredEvidenceGradedStatusTerms,
},
```

- [ ] **Step 2: 跑测试确认红灯**

Run: `npm test`
Expected: FAIL,输出 `obclose: missing required incremental lesson verification concept terms: ...` 和 `evidence-graded deprecation` 缺失清单。

- [ ] **Step 3: 编辑 `skills/obclose/SKILL.md`(五处)**

3a. `## 默认行为` 列表,在 `- 只有发现可复用经验时才更新 \`.agents/lessons.md\`。` 之后插入:

```md
- 对与本次任务相关的 lessons 条目做增量验证，更新 `最后验证`；不全量验证 `.agents/lessons.md`。
```

3b. `## 工作流` 编号列表改为(在原第 8 步后插入新第 9 步,原 9-11 顺延,末尾加第 13 步):

```md
8. 如果发现跨任务复用经验，追加 `.agents/lessons.md`。
9. 对本次任务相关的 lessons 条目执行增量验证；验证失败按证据强度分级标注。
10. 检查 memory 文件大小和重复度，必要时轻量压缩或提出整理建议。
11. 如果发现重要技术决策但没有 ADR，建议运行 `$obadr`。
12. 如果发现明显跨项目可复用经验，建议运行 `$oblearn`。
13. 如果待复核或已退役条目积压，建议运行 `$obcurate` 复查。
```

3c. `## lessons.md 写法` 一节之后、`## Memory 维护` 之前,插入新节:

```md
## 经验验证

收尾时对经验做增量验证：只验证与本次任务相关的 lessons 条目——本次读取过、使用过，或其 `验证方式` 涉及本次改动文件的条目。不全量验证 `.agents/lessons.md`，不扫描 Obsidian，不验证与本次无关的条目。

对每条相关条目：

- 执行其 `验证方式`，更新 `最后验证` 日期和一行结论。
- 验证失败或与当前证据矛盾时按证据强度分级标注：有直接证伪证据（检查命令实际执行且失败、引用的文件或术语已不存在）时标已退役（`deprecated`）并附证据和日期；仅怀疑过时、无直接证据时标待复核（`needs-review`）并附一行怀疑理由。
- 标注只追加 `状态` 行，保留条目原文；已退役条目在之后的会话不再作为有效经验使用，只作为“此路不通”的反例背景。
- 删除已退役条目属于确认后维护，遵循“删除历史记录或经验”需用户确认的规则。

本次会话使用过 Obsidian 公共知识时（见 `.agents/active.md` 的“已使用知识”），对使用结果明确的知识回写 frontmatter `last_verified`；使用中被证伪的按同一分级规则更新 `status` 并在正文追加退役说明。没有使用过的公共知识不回写，不扫描 vault。

既有条目仍使用旧字段 `下次检查` 时保持原样读取；只在该条目本次被验证或修改时顺手升级为 `验证方式` / `最后验证`，不批量迁移。
```

3d. `## 判断规则` 列表末尾加两行:

```md
- 标已退役（`deprecated`）：只有直接证伪证据时；仅怀疑过时标待复核（`needs-review`）。
- 建议 `$obcurate`：待复核或已退役条目积压、或较多条目长期未验证时。
```

3e. `## 完成说明` 汇报列表,在 `- 更新了哪些 memory 文件。` 之后加:

```md
- 验证了哪些 lessons 条目和验证结果。
```

- [ ] **Step 4: 跑测试确认绿灯**

Run: `npm test`
Expected: `All skills are valid.`

- [ ] **Step 5: Commit**

```bash
git add skills/obclose/SKILL.md scripts/validate-skills.mjs
git commit -m "Add incremental lesson verification to obclose"
```

---

### Task 3: 使用中证伪协议(obinit 及生成物)

**约束说明:** validator 对 `obinit/SKILL.md` 正文有 2000 wordsish 上限,当前实测 1999/2000,不能再增加内容。因此协议不写入 `skills/obinit/SKILL.md`;它落在 `references/memory-bank.md`(SKILL.md 已声明"项目内 memory 规则见 `references/memory-bank.md`",细节位置就是这里)和两个 instructions 模板。validator 校验对象相应是 reference 文件和模板,不是 SKILL.md。

**Files:**
- Modify: `skills/obinit/templates/instructions.md`(记忆库列表)
- Modify: `skills/obinit/templates/instructions-index.md`(记忆库列表)
- Modify: `skills/obinit/references/memory-bank.md`(更新规则列表)
- Modify: `skills/obinit/references/obsidian-sync.md`(公共知识按需查阅列表)
- Modify: `.agents/instructions.md`(本仓库自身的记忆库列表,dogfood 同步;此前"权威状态载体"规则推广时也同步过此文件)
- Modify: `scripts/validate-skills.mjs`
- 不修改: `skills/obinit/SKILL.md`(长度上限)

**Interfaces:**
- Consumes: Task 1 声明的 `requiredUsageFalsificationTerms` 与字段词汇。
- Produces: 使用中证伪协议文本;新项目经 `$obinit` 继承该协议。

- [ ] **Step 1: validator 加校验(红灯)**

两处修改,都在 obinit 分支内:

1a. obinit 的 `requiredObinitReferences` 循环里已有 `const referenceContent = readFileSync(referencePath, "utf8");` 及两个 assertNoPhrases;在它们之后加:

```js
if (relativePath === "references/memory-bank.md") {
  const missing = requiredUsageFalsificationTerms.filter((term) => !referenceContent.includes(term));
  if (missing.length > 0) {
    fail(`${skillName}: ${relativePath} must include usage-time falsification terms: ${missing.join(", ")}`);
  }
}

if (relativePath === "references/obsidian-sync.md") {
  for (const term of ["deprecated", "needs-review", "last_verified", "反例"]) {
    if (!referenceContent.includes(term)) {
      fail(`${skillName}: ${relativePath} must include knowledge status handling term: ${term}`);
    }
  }
}
```

1b. 模板循环中现有 `if (skillName === "obinit" && ["instructions.md", "instructions-index.md"].includes(template))` 块内、authoritative state carrier 检查之后加:

```js
const missingUsageFalsification = requiredUsageFalsificationTerms.filter((term) => !content.includes(term));
if (missingUsageFalsification.length > 0) {
  fail(`${skillName}: template ${template} must include usage-time falsification terms: ${missingUsageFalsification.join(", ")}`);
}
```

- [ ] **Step 2: 跑测试确认红灯**

Run: `npm test`
Expected: FAIL,输出 `obinit: references/memory-bank.md must include usage-time falsification terms: ...`、`references/obsidian-sync.md must include knowledge status handling term: ...` 和两个 instructions 模板的 `usage-time falsification terms` 缺失。

- [ ] **Step 3: 编辑四个内容文件(同一条协议,逐文件插入)**

协议正文(canonical,下面各文件用同一句式):

```md
- 使用 lessons 经验或公共知识时发现与当前证据矛盾，按证据强度分级执行使用中证伪：有直接证伪证据（检查实际执行且失败、引用对象已不存在）就地标已退役（`deprecated`）并附证据；仅怀疑、无直接证据时标待复核（`needs-review`）并附理由；正常使用不强制回写，由 `$obclose` 收尾时统一更新 `最后验证` / `last_verified`。
```

3a. `skills/obinit/templates/instructions.md` → `## 记忆库` 列表,在 `- 只有可复用经验才更新 \`.agents/lessons.md\`。` 之后插入上面整条。

3b. `skills/obinit/templates/instructions-index.md` → `## 记忆库` 列表,同 3a 位置插入同一条。

3c. `skills/obinit/references/memory-bank.md` → "更新规则"列表,在 `- 只有可复用经验才写入 \`.agents/lessons.md\`。` 之后插入同一条。

3d. `.agents/instructions.md`(仓库根)→ `## 记忆库` 列表,在 `- 只有可复用经验才更新 \`.agents/lessons.md\`。` 之后插入同一条。

- [ ] **Step 4: 编辑 `skills/obinit/references/obsidian-sync.md`**

"公共知识按需查阅"列表,在 `- 读取 Knowledge catalog 命中项时看 \`kind\` 和 \`use_as\`...` 一行之后插入:

```md
- 命中笔记 `status` 为 `deprecated` 或 `needs-review` 时不作为有效经验使用；已退役笔记只作为“此路不通”的反例背景。使用中发现知识与当前证据矛盾时，按证据强度分级更新该笔记状态；正常使用的由 `$obclose` 收尾时回写 `last_verified`。
```

- [ ] **Step 5: 跑测试确认绿灯**

Run: `npm test`
Expected: `All skills are valid.`

- [ ] **Step 6: Commit**

```bash
git add skills/obinit/templates/instructions.md skills/obinit/templates/instructions-index.md skills/obinit/references/memory-bank.md skills/obinit/references/obsidian-sync.md .agents/instructions.md scripts/validate-skills.mjs
git commit -m "Add usage-time falsification protocol to obinit outputs"
```

---

### Task 4: `$oblearn` 公共知识生命周期

**Files:**
- Modify: `skills/oblearn/SKILL.md`
- Modify: `skills/oblearn/templates/public-knowledge-note.md`
- Modify: `scripts/validate-skills.mjs`

**Interfaces:**
- Consumes: 状态 token 与证据分级词汇。
- Produces: frontmatter `last_verified` 字段、`## 退役` 小节格式、"不重新提取已退役结论"守卫;Task 5 的 obcurate 复查依赖这些状态。

- [ ] **Step 1: validator 加校验(红灯)**

1a. `requiredSkillConcepts.oblearn` 数组末尾(`sharedObsidianMarkdownWritePolicy` 之后)加:

```js
{
  name: "knowledge lifecycle status",
  terms: ["知识生命周期", "last_verified", "needs-review", "deprecated", "## 退役", "退役原因", "替代笔记", "反例", "不重新提取", "按证据强度分级", "直接证伪证据"],
},
```

1b. 模板循环中现有 public-knowledge-note.md 检查的 term 数组扩为:

```js
for (const term of ["kind: knowledge", "source_skill: oblearn", "last_verified:"]) {
```

- [ ] **Step 2: 跑测试确认红灯**

Run: `npm test`
Expected: FAIL,输出 `oblearn: missing required knowledge lifecycle status concept terms: ...` 和 `oblearn: template public-knowledge-note.md must include last_verified:`。

- [ ] **Step 3: 编辑 `skills/oblearn/SKILL.md`(两处)**

3a. `## 输出目标` 一节之后、`## Tags` 之前,插入新节:

```md
## 知识生命周期

公共知识笔记用 frontmatter `status` 表示生命周期：`draft` 表示未稳定归类，`active` 表示默认可用，`needs-review` 表示待复核（有怀疑但无直接证据），`deprecated` 表示已退役（有直接证伪证据或人工裁决）。`last_verified: YYYY-MM-DD` 记录最近一次真实使用验证；缺失时按 `created` / `updated` 推断新旧，不批量回填。

- 已退役笔记保留原文，在正文顶部追加 `## 退役` 小节：退役原因、证据、日期和（如有）替代笔记的 wikilink。
- 检索命中 `deprecated` 或 `needs-review` 笔记时不作为有效经验使用；退役记录只作为“此路不通”的反例背景。
- 候选知识与已退役笔记同结论时不重新提取为有效经验；如有新证据推翻退役结论，先列出复核建议等用户裁决。
- `status` 变更按证据强度分级：有直接证伪证据可标 `deprecated` 并附证据；仅怀疑标 `needs-review`；批量复查、恢复裁决和删除属于 `$obcurate`。
```

3b. `## 可提取内容` 的"不要提取"列表末尾加:

```md
- 与已退役（`deprecated`）笔记同结论的经验。
```

- [ ] **Step 4: 编辑 `skills/oblearn/templates/public-knowledge-note.md`**

frontmatter 中 `status: draft` 行之后插入一行:

```yaml
last_verified: YYYY-MM-DD
```

- [ ] **Step 5: 跑测试确认绿灯**

Run: `npm test`
Expected: `All skills are valid.`

- [ ] **Step 6: Commit**

```bash
git add skills/oblearn/SKILL.md skills/oblearn/templates/public-knowledge-note.md scripts/validate-skills.mjs
git commit -m "Add knowledge lifecycle status to oblearn"
```

---

### Task 5: `$obcurate` 复查与退役 GC

**Files:**
- Modify: `skills/obcurate/SKILL.md`
- Modify: `skills/obcurate/templates/curation-plan.md`
- Modify: `scripts/validate-skills.mjs`

**Interfaces:**
- Consumes: `status` / `last_verified` 语义(Task 4)、lessons `状态` 字段(Task 1)。
- Produces: 复查候选分组、退役删除 + catalog 清理流程。

- [ ] **Step 1: validator 加校验(红灯)**

1a. `requiredSkillConcepts.obcurate` 数组末尾加:

```js
{
  name: "experience review and retirement",
  terms: ["复查候选", "needs-review", "deprecated", "长期未验证", "180 天", "逐项", "删除建议", "清理", "时间流逝本身不是证伪证据", "待验证"],
},
```

1b. 模板循环中现有 curation-plan.md 检查的 term 数组扩为:

```js
for (const term of ["批量分组", "按组确认", "高风险例外", "稳定归类", "保持 Inbox", "敏感文档", "需要人工判断", "复查候选", "needs-review", "deprecated", "长期未验证", "逐项确认"]) {
```

- [ ] **Step 2: 跑测试确认红灯**

Run: `npm test`
Expected: FAIL,输出 `obcurate: missing required experience review and retirement concept terms: ...` 和 curation-plan.md 的 `复查候选` 等缺失。

- [ ] **Step 3: 编辑 `skills/obcurate/SKILL.md`(三处)**

3a. `## 职责边界` 列表,在 `- 合并重复主题，拆分过长或适用范围混杂的笔记。` 之后插入:

```md
- 复查经验生命周期：批量复核待复核（`needs-review`）笔记、提出已退役（`deprecated`）删除建议、提示长期未验证条目。
```

3b. `## 批量整理策略` 的"默认分组"表格,在"敏感文档"行之后加一行:

```md
| 复查候选 | `needs-review` 待裁决、`deprecated` 待删除、长期未验证（超过建议阈值） | `needs-review` 和删除逐项确认；待验证提示按组确认 |
```

3c. `## 批量整理策略` 一节之后、`## 工作流` 之前,插入新节:

```md
## 经验复查与退役

复查候选有三类：待复核（`needs-review`）笔记、已退役（`deprecated`）待删除笔记、长期未验证笔记（`last_verified` 距今超过阈值；建议默认 180 天，可按用户偏好调整）。

- `needs-review` 逐项给用户裁决：恢复 `active`、标 `deprecated` 或修正内容。
- `deprecated` 笔记可列入删除建议组，按组确认后删除；确认删除时同步清理 `Agent/Knowledge/_catalog.md` 对应入口和 `notes` 链接。
- 未删除的 `deprecated` 笔记默认从 catalog `terms` 移除入口或在 `notes` 标注已退役，防止被自动发现命中；保留正文和 `## 退役` 小节作为反例背景。
- 长期未验证但无矛盾证据的笔记只列“待验证”建议，不自动降级；时间流逝本身不是证伪证据。
- 项目内 `.agents/lessons.md` 的验证和退役标注属于 `$obclose`；其已退役条目的删除遵循 `$obclose` 的确认后维护规则，不在本 skill 默认范围。
```

- [ ] **Step 4: 编辑 `skills/obcurate/templates/curation-plan.md`**

`## 批量分组` 表格,在"敏感文档"行之后加一行:

```md
| 复查候选 | <数量> | <needs-review、deprecated 待删除或长期未验证笔记> | <status、最后验证与当前证据的差距> | <恢复 active、标 deprecated、删除并清理 catalog、列待验证提示> | needs-review 和删除逐项确认 |
```

- [ ] **Step 5: 跑测试确认绿灯**

Run: `npm test`
Expected: `All skills are valid.`

- [ ] **Step 6: Commit**

```bash
git add skills/obcurate/SKILL.md skills/obcurate/templates/curation-plan.md scripts/validate-skills.mjs
git commit -m "Add experience review and retirement GC to obcurate"
```

---

### Task 6: 终检与收尾

**Files:**
- Modify: `.agents/active.md`、`.agents/progress.md`(memory 收尾,按 obclose 规则)

**Interfaces:**
- Consumes: Task 0-5 的全部提交。

- [ ] **Step 1: 全量测试**

Run: `npm test`
Expected: `All skills are valid.`

- [ ] **Step 2: 旧措辞清扫**

Run: `grep -rn "下次检查" skills/`
Expected: 只命中 `skills/obclose/SKILL.md` 的兼容规则一处(`既有条目仍使用旧字段...`)。其他命中都要修复。

Run: `git diff --check` (对未提交内容)与 `git log --oneline -8`
Expected: 无空白错误;Task 0-5 的六个提交都在。

- [ ] **Step 3: memory 收尾**

按 `$obclose` 规则更新 `.agents/active.md`(当前任务改为本闭环实施、验证红绿灯记录、关键文件、下一步:用户决定是否发版)和 `.agents/progress.md`(追加本阶段条目)。本次新经验(如有)按 Task 1 的新字段格式写入 `.agents/lessons.md`。spec 与 plan 已由 git 承载,memory 只记链接和未完成事项(权威状态载体规则)。

- [ ] **Step 4: Commit**

```bash
git add .agents/active.md .agents/progress.md .agents/lessons.md
git commit -m "Record experience verification lifecycle rollout in memory"
```
