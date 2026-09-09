# 项目记忆多会话并行与普适性整改计划

**Goal:** 把 `.agents/` 从「共享可变状态」改造为「追加日志 + 派生视图」，使同一工作区的多会话并行不再互相覆盖；同时清理 skills 中把特定工具或个人编排习惯固化为通用规则的历史耦合。

**Architecture:** 新增每会话独立的 handoff 文件作为 append-only 事实来源，`active.md` 降级为可重建的派生视图；所有行为约束通过 `scripts/validate-skills.mjs` 的契约断言防回归。skills 只承载机制，策略留给项目级 `.agents/instructions.md`。

**Tech Stack:** Markdown Agent Skills + Node.js validator（`scripts/validate-skills.mjs`）。

**路径说明:** 本文档放在 `docs/superpowers/plans/`，跟随本仓库既有结构。skill 侧不硬编码该路径（见 Task 5）；本仓库用什么路径由既有结构决定。

## Global Constraints

- 使用简体中文；路径、命令、包名和英文专有名词保持原样。
- skills 正文不得把任何工具名或工具专有路径作为硬依赖；工具特有内容只能是「可选输入来源」或「示例」。
- skills 正文不得出现策略词（单写者、占坑、认领、强制 worktree）；这些属于项目规则，不属于通用能力。
- 每项行为改动都要配 validator 断言，并先在临时副本上验证该断言能红灯。
- 统计口径统一复用 `scripts/validate-skills.mjs` 的 `countWordsish`，不另造第二套统计。
- 不改版本号，不提交，不推送，不发布。

## 设计准则：机制与策略分离

| 类别 | 内容 | 归属 |
| --- | --- | --- |
| 机制 | append-only handoff、每会话一份文件、派生视图、冲突即停并上报、保留与新鲜度上限 | 写进 skills |
| 策略 | 单写者还是并行、是否使用 worktree、认领粒度、清扫权归属 | 留给项目 `.agents/instructions.md` |

依据：全局规则按工具配置目录分裂（`.dsh` / `.codex` / `.claude` / `.zcode` 各一份且内容不一致），因此**跨工具约定只能落在项目级规则里**；单工具全局配置不能充当多会话协调基底。

## 不变量

1. `active.md` 是**缓存**：可随时从 append-only 源重建，不含孤本信息。
2. 段落归属：`## 当前 ADR` 从 `docs/adr/` 派生；`## 已提取知识` 从 vault 项目笔记派生（vault 不可用时保留现值、不重生成）；`## 已使用知识` 从 handoff 派生；其余五段（当前任务、当前状态、验证、关键文件、下一步）从 handoff 派生。
3. `.agents/handoffs/` 不计入 `progress.md` 的 500 行 / 50 KB 预算，但必须有独立上限。

## 已完成基线（第 1-3 批，改动未提交）

- **第 1 批 门禁补齐**：validator 新增引用存在性、命令→skill、README 技能表、`marketplace.json` 的 `metadata.version`、description 语义约束、运行时假设章节、正文长度预算、机器层枚举、模板对齐、写前重读、可执行回退等断言，并输出失败计数与 scope 汇总。
- **第 2 批 契约收口**：6 个 skill 补齐 `## 运行时假设`；vault 写入契约统一加「写前重读 + 外部改动即停止上报」；obcurate 定义 `Agent/Archive/YYYY-MM-DD/` 回退；oblearn 补步骤级读回与追加去重。
- **第 3 批 结构收敛**：obinit 项目相关知识回写下沉到 `references/obsidian-sync.md`（正文 1998 → 1811）；obadr progress 模板统一五段式；obdoc 新增 `templates/documents-catalog-entry.md`；obcurate 新增 `## 机器层枚举`；oblearn 模板 `last_verified` 不再预填；长度预算改为 obinit 2000 / 其余 5000。
- **验证**：`npm test` 输出 `All skills are valid. (6 skills checked)`；14 个断言在临时副本上逐个破坏验证可红灯。
- **memory 收尾**：`.agents/active.md`、`progress.md`、`lessons.md`、`instructions.md` 已更新；7 条 legacy `下次检查` 升级为 `验证方式` + `最后验证`。

---

### Task 1: 零风险批 — 来源标识与预算可见

**Files:**
- Modify: `skills/obclose/templates/progress-entry.md`
- Modify: `skills/obclose/SKILL.md`
- Modify: `scripts/validate-skills.mjs`

**Interfaces:**
- Produces: `progress.md` 条目新增 `来源：<agent>/<任务 slug>` 行；`$obclose` 收尾时输出 memory 占用。

- [x] **Step 1:** `progress-entry.md` 在五段式末尾追加 `- 来源：<agent>/<任务 slug>`。
- [x] **Step 2:** `obclose/SKILL.md` 的 progress 写法节说明来源行的取值规则（agent 为当前工具名，slug 为任务短名）。
- [x] **Step 3:** `obclose/SKILL.md` 增加收尾输出：`progress.md` 行数/KB、`lessons.md` 行数/KB、`handoffs/` 数量，均与阈值并列；字数口径复用 validator 的 `countWordsish`。
- [x] **Step 4:** validator 增加断言：`progress-entry.md` 必须含 `- 来源：`。
- [x] **Step 5:** 运行 `npm test`，并在临时副本上删掉来源行确认红灯。

Expected: `npm test` 绿；破坏来源行后红灯。

### Task 2: handoff 机制（协议级）

**Files:**
- Create: `skills/obclose/templates/handoff.md`
- Modify: `skills/obclose/SKILL.md`
- Modify: `skills/obinit/references/memory-bank.md`
- Modify: `scripts/validate-skills.mjs`

**Interfaces:**
- Produces: `.agents/handoffs/<YYYY-MM-DD>_<HHMMSS>_<agent>_<slug>.md`；handoff 模板含 `状态`、`会话`、`任务`、`涉及文件`、`下一步`。

- [x] **Step 1:** 定义命名规范：`YYYY-MM-DD_HHMMSS_<agent>_<任务slug>.md`，零填充保证排序，同秒冲突加序号；slug 只负责可读性，唯一性靠时间戳与序号。
- [x] **Step 2:** 定义生命周期：任务开始时创建并标 `状态：进行中`；收尾时改 `状态：已交接` 并写结论；`$obclose` 把已交接且超龄的 handoff 并入 `progress.md` 后移入 `.agents/archive/handoffs-YYYY.md`。
- [x] **Step 3:** 定义新鲜度：`状态：进行中` 且 mtime 超过阈值（默认 12 小时）视为过期，可接管但必须在自己的 handoff 中注明接管来源。
- [x] **Step 4:** 定义预算：`handoffs/` 不计入 progress 的 500 行 / 50 KB，但设独立上限（建议 ≤ 30 个文件或 200 KB），超限时优先归档已交接项。
- [x] **Step 5:** `obclose` 的 Memory 维护节原文写入「不计入主预算但必须有自己的顶」这一表述。
- [x] **Step 6:** validator 断言 handoff 模板含必需字段，且 `obclose` 正文含 handoffs 路径与独立上限。

Expected: 新增断言先红灯，补齐后绿灯。

### Task 3: active.md 降级为派生视图

**Files:**
- Modify: `skills/obclose/SKILL.md`
- Modify: `skills/obclose/templates/active.md`
- Modify: `skills/obinit/templates/active.md`
- Modify: `skills/obadr/SKILL.md`、`skills/oblearn/SKILL.md`（段落归属说明）
- Modify: `scripts/validate-skills.mjs`

- [x] **Step 1:** `active.md` 头部注明「本文件是派生视图，可从 `.agents/handoffs/`、`docs/adr/` 和 Obsidian 项目笔记重建」。
- [x] **Step 2:** `## 当前 ADR` 改为从 `docs/adr/` 生成的链接列表；`## 已提取知识` 改为指向 vault 项目笔记的链接视图，vault 不可用时保留现值不重生成；`## 已使用知识` 从 handoff 派生。
- [x] **Step 3:** `obclose` 工作流改为「先汇总 handoffs → 再重生成 active.md」，并明确 active.md 冲突为 last-writer-wins 且无损失（因为可重建）。
- [x] **Step 4:** 保留 `active.md` 的就地更新能力作为降级路径：`handoffs/` 不存在时（旧项目）继续按原方式维护。
- [x] **Step 5:** validator 断言 active 模板含派生声明，且不含只应属于 owner skill 的独占内容。

Expected: 断言红灯 → 补齐绿灯。

### Task 4: 认领位置重定义（不预设策略）

**Files:**
- Modify: `skills/obinit/templates/instructions.md`
- Modify: `skills/obinit/templates/instructions-index.md`
- Modify: `skills/obinit/SKILL.md`
- Modify: `.agents/instructions.md`（本仓库自食其力）

- [x] **Step 1:** 项目规则把「任务开始时更新 `.agents/active.md`」改为「任务开始时创建 `.agents/handoffs/` 下的会话文件；`active.md` 由 `$obclose` 派生」。
- [x] **Step 2:** 模板新增空的「协作策略」小节占位，说明「并行策略、是否使用 worktree、认领粒度由项目自行约定」，不预填任何具体策略。
- [x] **Step 3:** 明确「认领登记的位置由项目规则定义」；skills 不出现单写者/占坑/认领等策略词。
- [x] **Step 4:** 本仓库 `.agents/instructions.md` 同步该改动。

Expected: 模板含策略占位节且为空；`npm test` 绿。

### Task 5: 普适性回溯清理（现有耦合）

**Files:**
- Modify: `skills/obinit/SKILL.md`、`skills/obinit/references/init-modes.md`、`skills/obinit/references/memory-bank.md`
- Modify: `skills/obinit/templates/instructions.md`、`skills/obinit/templates/instructions-index.md`
- Modify: `skills/oblearn/SKILL.md`、`skills/obdoc/SKILL.md`
- Modify: `scripts/validate-skills.mjs`

现状（grep 实测）：

| 耦合 | 出现次数 | 判定 |
| --- | --- | --- |
| `Codex session id` | 24 处（oblearn 11、obdoc 8、obinit 1、`agents/openai.yaml` 4） | 可接受但不对称：只支持 Codex，未对称支持其他工具 |
| `docs/superpowers/specs/`、`docs/superpowers/plans/` | 11 处（obinit 5、oblearn 3、templates 2、memory-bank 1） | 不可接受：特定工具目录约定被硬编码进通用规则 |
| `Claude Code 专用指南：CLAUDE.md` | 1 处（`templates/instructions-index.md:9`） | 不可接受：硬写在模板里 |

- [x] **Step 1:** 移除 `docs/superpowers/specs/`、`docs/superpowers/plans/` 的硬编码；改为「发现并遵守项目既有的设计/计划文档结构，不预设路径、不创建目录」。具体工具路径只作为发现结果的示例，不作为规则。
- [x] **Step 2:** 扩展 `skills/obinit/scripts/inspect-project.mjs`，输出 `docs/` 顶层子目录和索引文件，让「按既有结构识别」数据驱动；补对应 fixture 测试。
- [x] **Step 3:** 把「Codex session id」抽象为「用户提供的会话记录（transcript、session id、导出文件）」；Codex 的具体定位方式降级为示例，不再独占章节。
- [x] **Step 4:** 模板里的工具名加条件表述（「如存在 `CLAUDE.md`」），并对 `AGENTS.md` 保持同等对待。
- [x] **Step 5:** 新增 validator 断言：skills 正文不得把工具名、工具专有路径或文档目录作为硬依赖；策略词不得出现。
- [x] **Step 6:** 评估既有 `docs/superpowers/` 结构是否改用中性路径（破坏性移动，需用户确认后执行）。

Expected: 断言红灯 → 清理后绿灯；skills 正文不再出现硬编码工具路径。

### Task 6: 验证与收尾

- [x] **Step 1:** 运行 `npm test`，确认 `All skills are valid.`
- [x] **Step 2:** 对每个新增断言在临时副本上做破坏实验，确认能红灯。
- [x] **Step 3:** 检查 skills 正文无策略词、无硬编码工具路径。
- [x] **Step 4:** 按 `$obclose` 更新 `.agents/active.md`、`progress.md`；新增可复用经验写入 `lessons.md`。
- [x] **Step 5:** 汇报改动范围、验证证据和未决问题。

### Task 7: 存量项目迁移机制（发版阻塞项）

**Files:**
- Create: `skills/obinit/references/memory-upgrade.md`
- Modify: `skills/obinit/SKILL.md`、`skills/obinit/references/init-modes.md`
- Modify: `scripts/validate-skills.mjs`

**Interfaces:**
- Produces: memory 代际清单（v1 → v2）与重复运行模式的差异检测流程。

- [x] **Step 1:** 新增 `references/memory-upgrade.md`：memory 代际与插件版本对应、差异检测粒度（章节级 + 变更条目，措辞差异仅作参考）、执行主体（agent 报告、用户确认后执行）、验证方式（迁移后差异为空）。
- [x] **Step 2:** 写入 v1 → v2 迁移清单：必做 4 条、可选 2 条（不批量迁移）、不做 2 条。
- [x] **Step 3:** `obinit/SKILL.md` 加一句薄指针（正文余量紧张，细节全在 reference）；`init-modes.md` 的重复运行模式引用该清单。
- [x] **Step 4:** validator 增加 `references/memory-upgrade.md` 存在性、reference 概念与 SKILL.md 概念断言。
- [x] **Step 5:** 本仓库端到端验证：逐节对比发现「协作策略」与「重复运行」顺序差异，按报告执行最小改动后差异归零。

Expected: `npm test` 绿；删除 reference 或薄指针后红灯。

**为什么是发版阻塞项:** 批次二一旦发布，存量项目即处于「新 skill 行为 + 旧 `.agents/` + 无升级路径」；`$obclose` 的降级路径保住运行时不坏，但收敛永远不会发生。因此迁移机制必须与协议变更同版本发布。

## 验收标准

1. `npm test` 绿，且新增断言均有对应的破坏实验证据。
2. 同一工作区两个会话并行时，各自写自己的 handoff 不互相覆盖；`active.md` 由 `$obclose` 派生，冲突无损失。
3. skills 正文不含策略词，不含硬编码工具路径；工具特有内容只出现在「可选输入来源」或「示例」语境。
4. `handoffs/` 有独立上限，且不挤占 progress 的 500 行 / 50 KB 预算。
5. `active.md` 满足「可重建、不含孤本」的不变量。
6. 存量项目有可用迁移路径：`$obinit` 重复运行能报告三类差异并等用户确认；迁移后重新对比差异为空。

## 落地顺序与风险

- Task 1 零风险，可立即做。
- Task 2-4 是协议级改造，触及已发布 skill 的行为，且会改动 obinit 两个模板与 obclose 工作流；建议在第 1-3 批整改 review/提交后再开，避免叠在未提交 diff 上。
- Task 5 涉及大量文案替换，需逐处核对 validator 现有断言（`requiredSkillConcepts` 中多处包含 Superpowers 相关术语，迁移时要同步改断言目标）。
- Task 4 的 Step 1 会改变「任务开始更新 active.md」这一既有要求，需同时改 obinit 模板、obclose 工作流和本仓库 `.agents/instructions.md` 三处，漏一处就会出现「规则说 A、模板说 B」。

## 未决问题

1. 本仓库既有 `docs/superpowers/` 结构保持不变（跟随既有结构原则）；若将来决定改用中性路径，需一次性迁移 5 份文档并修复 `active.md` 的 Plan/Spec 链接与文档间交叉引用。
2. `.codex` / `.claude` / `.dsh` 三份全局规则缺少单写者、清扫纪律、验证即提交等约定，与本仓库无关，但属于用户全局配置层面的独立缺口。
3. `handoffs/` 独立上限取「30 个文件 / 200 KB」是否合适，需要实际使用一段时间后校准。
4. memory 代际标记推迟到 v2 → v3；触发条件是「用户拒绝部分迁移且重复报告造成困扰」，或做 v2 → v3 迁移时一并引入。
