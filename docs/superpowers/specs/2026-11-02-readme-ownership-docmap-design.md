# 0.1.38 README 所有权与文档地图解耦设计

- 日期：2026-11-02
- 状态：已确认（2026-11-02，用户转交外部评审判定 Approved；其 4 条 plan 级建议已并入 §10 与 §12；builder check 先行通过，见「评审与自查记录」）
- 来源：bn-alpha-bot README create-readme 重构（987→164 行 / 12,820 B）与 flower-dashboard README 重写前审计（sess_d43dac98-2e8b-4389-890c-e960a09a2398）；本会话内部评审与外部评审（「先评审」轮）两轮收敛
- 目标版本：0.1.38（memory 代际维持 v3，同代际追加）

## 1. 意图与为什么

`templates/docs-readme.md:16` 预置根 README 登记行：

> `| [`README.md`](../README.md) | 项目是什么、怎么装、怎么跑、运维链路 | 运行方式、命令、配置键、对外行为 |`

`$obinit` 用该模板给每个新项目建档，等于预注册「README = 当前状态文档」并预派同步触发（运行方式、命令、配置键、对外行为）。这是**间接写入义务**：obinit 的写入 allowlist 不含根 README（写入纪律正确），但文档地图的同步触发绕过 allowlist，把 README 绑进行为/配置改动的必更新项——**模板替项目派了 allowlist 不会批准的义务**。

双实证：

1. **bn-alpha-bot**：README 膨胀到 987 行（行为细则 + 运维纪事全在里面），create-readme 重构被迫 `docs!` 破坏性迁移（48f0b09，987→164 行）：行为事实迁 `docs/system-flow.md`、运维迁 `docs/operations.md`、AGENTS/CLAUDE/instructions 指针同批改指、instructions 同批更新规则改写为「对应事实源文档」。重构后 instructions 8,167 B、地图 README 行收窄为「运行方式、命令、对外介绍口径」——收窄后自洽。
2. **flower-dashboard**：README 410 行 / 61 KB（架构/数据口径/调度/端点 + 页面表 8 行单行数千字、变更史批注嵌正文）。create-readme 会话（sess_d43dac98）的修改前审计确认：`docs/README.md:16` 按 §架构/§部署/§vendor 快照维护/§数据口径 四个节级引用 README，同步触发含「配置键、对外行为」；`instructions:34` 自填句把 README 列进行为同批更新对象；重写未执行（口径待拍板）。

目标原则（本批拍板）：**所有权**。README 的结构与事实范围由项目自己的介绍规范单独拥有（工具无关表述，不点名任何具体 skill）；文档地图不登记根 README、不派同步触发。义务与证据卫生分离：**义务摘除 ≠ 死链豁免**——README 无条件留在 `$obclose` 改指面（0.1.34 §3.3 将 README 明列于零外链持久文档集）。

## 2. 目标 / 非目标 / 反目标

### 目标（可验证）

1. docs-readme 模板：无根 README 登记行；含表外格式示例（非登记语义）；含工具无关所有权句。
2. validator：正向 term（所有权句）+ 窄负向（模板再现 README 登记行即红）双断言。
3. 本仓库自举地图 `docs/README.md:16` README 行同批移除——README 义务由既有 validator 直查断言承接（`validate-skills.mjs:1377-1386`：各 skill Obsidian 前提句 + version:set 发布口径），无义务真空。
4. obclose `:12` 改指面与地图登记解耦：根 README 无条件在改指面；obclose 概念块加钉住术语。
5. memory-upgrade：v3 行追加 0.1.38 合成句 + 新收敛小节（存量不强制；bn 收窄版为过渡形态证据；已具备事实承接文档的项目随 `$obinit` 重跑收窄；无承接文档的项目（flower 形态）收窄前置 = 承接落点拍板，未落点前不得先收窄）。
6. 本项目 lessons 落「义务网过 allowlist」一条。

### 非目标

- 不改 bn/flower 实例（bn 收窄自洽；flower 事实迁移属其自身批次，需拍板承接落点）。
- 不改两个 instructions 模板（文档地图节泛指「受影响的文档」，不点名 README——已核实 `instructions.md:57-65`、`instructions-index.md:60-68`）。
- 不改外部介绍规范类 skill（create-readme 等）。
- 不沉淀「README 重组收敛序列」进本技能——把 README 重构手册写进 skill 等于再次对 README 扩大话语权，与本批方向自相矛盾；bn/flower 会话已证明手搓可行。**记为有意不做**。
- 不动 obinit allowlist（本就正确）。

### 反目标（技术及格但设计失败）

- 所有权句点名具体介绍 skill → 模板带悬空引用（与 `forbiddenHardcodedToolPaths` 同类缺陷；模板复制进无该 skill 的项目即死链）。
- 只加负向断言 → 「加回登记行 + 删所有权句」双绿绕过。
- 删行不补格式示例 → 新项目 agent 凭空猜表格形状。
- 框架写成「不影响 README」→ 只读提一句不算违反，义务网从旁门回归。
- 把 README 刻意排除出改指面 → 0.1.34 §3.3 的 README 零外链条款失去执行者，与本仓契约自相矛盾。

## 3. 现状证据

| 编号 | 位置 | 事实 | 来源 |
|---|---|---|---|
| T-1 | `skills/obinit/templates/docs-readme.md:16` | 预置行原文（见 §1 引文）；事实范围「运维链路」字样邀请运维细节进 README | 本会话 |
| T-2 | `docs-readme.md:21` | 维护规则「建立本文件时只填真实存在的当前状态文档」与预置行自相矛盾——预置行是伪装成登记的格式示例 | 外部评审 |
| T-3 | `scripts/validate-skills.mjs:249` | `requiredDocsReadmeTerms = ["## 权威文档地图", "同步触发", "时点快照", "docs/adr/"]`，不含 README 行词条——删行不撞既有门禁 | 本会话 |
| T-4 | `validate-skills.mjs:1377-1386` | validator 直查根 README（各 skill Obsidian 前提句、version:set 发布口径）——README 用法事实的门禁不依赖地图行 | 本会话 |
| T-5 | `docs/README.md:16`（本仓自举） | README 行在案：「项目定位、`$ob*` skill 用法、安装与发布流程、开发命令 \| skill 的触发语义与用法、安装步骤、发布流程、npm scripts」 | 外部评审指出，本会话核实 |
| T-6 | bn 实测 | README 164 行 / 12,820 B；节列表仍含 快速开始（接收端/常用命令）、配置——地图 `:17` 与实况一致，bn 为「收窄后自洽」样本，**非**双 owner 漂移证据 | 本会话复验（修正外部评审：行数 123→164；「安装/配置已迁出」不成立） |
| T-7 | flower 审计 | `docs/README.md:16` 四节级引用 + `instructions:34` 自填同步句 + 历史 plan 引用 §页面表/§数据口径（≥5 份，时点快照不回改，重写保留节名即不断链） | sess_d43dac98 审计 + 本会话核实 |
| T-8 | `.agents/lessons.md:42` | 2026-06-30「Skill 行为规则优先写正向 contract」在案：禁令留安全边界，行为形状用正向 contract + 旧措辞回归检查 | 外部评审引用，本会话核实 |
| T-9 | `validate-skills.mjs:1438-1447` | 自举门禁只查 `.agents/instructions.md`，对本仓 `docs/README.md` 无内容断言——自举删行不撞既有门禁（0.1.34 解耦保护同款先例） | 本会话 |

## 4. 核心设计

### 4.1 模板（`skills/obinit/templates/docs-readme.md`）

- 删 `:16` README 预置行；表格只剩表头 + 空行（`:17` 的 `| | | |` 保留）。
- 表后新增散文格式示例（非登记语义）：`行格式示例（非登记）：\`| [docs/架构.md](./架构.md) | 组件拓扑与运行分支行为 | 代码行为改动 |\``。
- `## 维护规则` 新增所有权句（工具无关）：`项目根 README 的结构与事实范围由项目自己的介绍规范单独拥有：不入本表、不登记其同步触发。`
- 预算：现 2,082 B；删行 −~120 B、示例与所有权句 +~250 B → ~2,210 B / 6,144 B ✓。

### 4.2 validator（`scripts/validate-skills.mjs`）

- 正向：`requiredDocsReadmeTerms` 增 `介绍规范单独拥有`（唯一自然短语，模板集仅此一处）。
- 负向：对 docs-readme 模板新增 `assertNoPhrases`，禁短语 `../README.md`（外部评审 Approved 轮建议收窄：从完整链接短语放宽为相对路径本身——docs-readme 模板处于 docs/ 子目录语境，任何指向根 README 的链接必以 `../README.md` 开头，覆盖带/不带反引号的全部变体；正文散文只提 README 三字，无误伤）。
- 红灯先行：先加断言跑红（模板未改），再改模板转绿；负向实验逐条删/加 → 红 → 还原 → 绿。

### 4.3 本仓自举（`docs/README.md`）

- 移除 `:16` README 行——所有权句生效的第一实例。表格其余行（`skills/ob*`、`validate-skills.mjs`、`docs/README.md` 自身行、时点快照兜底行）不动。
- **自举侧为一次性修正，不新增门禁、不回填所有权句**（builder check Q3 裁定）：模板是契约面（回归即播种 10+ 项目），自举地图是单文件实例（回归 review 可见）；且 T-4 直查断言已覆盖 README 内容义务，自举侧再加断言违反「不新增第二道」。预算行维持 −~230 B。
- T-9：无既有门禁断言本仓 docs/README.md 内容，删行安全。

### 4.4 obclose（`skills/obclose/SKILL.md:12` + 概念块）与 memory-bank 同批对齐

- `:12` 末句括号改写：`（项目无文档地图时，改指范围收窄为 \`.agents/\` 与根 \`README.md\`）` → `（改指范围为 \`.agents/\`、当前状态文档与根 \`README.md\`——README 不因不进文档地图而脱离改指面）`。
- 概念块 `scratch graduation and deferred eviction` 14→15 术语，增 `脱离改指面`。
- **memory-bank.md:31 同批对齐（builder check Q1 裁定）**：`改指只改 \`.agents/\` 与当前状态文档中的旧引用` → `改指只改 \`.agents/\`、当前状态文档与根 \`README.md\` 中的旧引用`；`requiredObinitReferenceConcepts["references/memory-bank.md"]` 概念块 6→7 术语，增 `与根 \`README.md\``。0.1.36 批已确立 memory-bank:31 ↔ obclose:12 同批同步先例，本批改指面变更必须同批落两处，否则双载体口径漂移。
- 语义：义务归介绍规范、死链归 `$obclose`——0.1.34 §3.3 的 README 条款继续有执行者。

### 4.5 memory-upgrade（`skills/obinit/references/memory-upgrade.md`）

- v3 代际行尾追加：`；0.1.38 起根 README 退出文档地图登记，改指面与登记解耦`（v3 行不放钉住短语——`介绍规范单独拥有` 与 `脱离改指面` 必须在新节内以**连续字串**出现，builder check 自决项）。
- 文末新增小节 `## README 所有权与文档地图解耦（0.1.38 起同代际追加）`，正文含两个连续锚点短语：`介绍规范单独拥有`、`脱离改指面`（措辞照 §4.4 句式，锚点不被反引号隔断）。存量收敛口径四条：
  1. 重复运行 `$obinit` 不强制改实例地图；实例自填的 README 行属项目内容，模板删行不构成「模板有、实例无」差异。
  2. 已按介绍规范收窄 README 角色且具备事实承接文档的项目（bn 形态：行为→system-flow、运维→operations）可随重跑把地图 README 行收窄为介绍口径或移除——bn 现状即过渡形态证据。
  3. 尚无承接文档的项目（flower 形态）：收窄前置 = 事实承接落点拍板（架构/数据口径/调度/端点迁入哪份 docs 文档）；未落点前地图行维持现状，不得先收窄——收窄而事实失管比不收窄更差。
  4. **所有权句不回填实例**（builder check Q2 裁定）：差异检测粒度为章节级，模板维护规则新增句不构成待执行项、不报告；否则 flower 形态实例会出现「维护规则写 README 不入表、表里仍留 README 行」的自相矛盾地图，与第 3 条顶牛。
- `requiredObinitReferenceConcepts["references/memory-upgrade.md"]` 增概念块 `{ name: "readme ownership decoupling", terms: ["0.1.38", "介绍规范单独拥有", "脱离改指面"] }`——迁移手册承载契约的唯一自动防线（0.1.36 Z2 教训）。

### 4.6 lessons（`.agents/lessons.md`，本项目）

- 新条「义务网过 allowlist」，按仓库 lessons 既有条目格式（背景 / 经验 / 适用场景 / 验证方式 / 最后验证）：
  - 背景：bn/flower README 膨胀的根因是模板预置同步触发——写入 allowlist 干净，间接写入义务绕过。
  - 经验：给模板加预置行、同步触发或事实范围前，先回答「这把义务派给了谁、那个文件的所有者是谁」；写边界要连同间接写入义务一起审。
  - 适用场景：维护 SKILL.md、模板、references、校验脚本与 agent 工作约定。
  - 验证方式：新增模板预置项时对照本条自查；validator 正向钉语义句（本批 `介绍规范单独拥有` 为首个实例）。
  - 最后验证：落条当批 `npm test` 绿 + 负向实验记录。

## 5. 契约句对照表 + 断言覆盖矩阵

对照表（改完应满足）：

| 契约 | docs-readme 模板 | validator | 自举 docs/README.md | memory-bank | memory-upgrade | obclose |
|---|---|---|---|---|---|---|
| README 所有权（不入表、不派触发） | 是（所有权句 + 示例非登记） | 正向 term + 负向行 | 是（行移除，一次性修正） | 否 | 是（0.1.38 节 + 概念块） | 否 |
| 改指面含 README（与登记解耦） | 否 | 否 | 否 | 是（`:31` 枚举 + 术语） | 是（节内句 + 概念块） | 是（`:12` + term） |

断言矩阵：

| 目标 | 断言位置 | 术语/形状 |
|---|---|---|
| 1 模板形态 | `requiredDocsReadmeTerms` + `assertNoPhrases` | `介绍规范单独拥有`；负向 `` [`README.md`](../README.md) `` |
| 4a obclose 改指解耦 | obclose 概念块 | `脱离改指面` |
| 4b memory-bank 改指对齐 | memory-bank 概念块 | `与根 \`README.md\`` |
| 5 迁移手册 | memory-upgrade 概念块 | `0.1.38`、`介绍规范单独拥有`、`脱离改指面` |

## 6. 预算核账

| 文件 | 现状（builder check 实测） | 预算 | 本批后 |
|---|---|---|---|
| `templates/docs-readme.md` | 2,082 B | 6,144 B | ~2,210 B |
| `skills/obclose/SKILL.md` | 4,874 wordsish（validator 口径，frontmatter 剥离） | 5,000 | ≈4,885（+~11 词），余量 ~115 |
| `references/memory-upgrade.md` | 8,397 B | 无门禁 | +~700 B |
| `references/memory-bank.md` | 5.7 KB | 无门禁 | +~15 B |
| `docs/README.md`（自举） | 3,628 B | 6 KB | −~230 B |
| `.agents/lessons.md` | 18,457 B | 30 KB | +~400 B |

注：上表为 spec 期实测，**实现时动手重测**，不照抄本表（builder check Q4）。

## 7. 变更清单（文件级 · 范围动作）

1. `skills/obinit/templates/docs-readme.md`
2. `scripts/validate-skills.mjs`
3. `docs/README.md`（自举）
4. `skills/obinit/references/memory-upgrade.md`
5. `skills/obinit/references/memory-bank.md`
6. `skills/obclose/SKILL.md`
7. `.agents/lessons.md`
8. 版本 5 manifest（`npm run version:set -- 0.1.38`）
9. 收口：`.agents/progress.md`、`.agents/active.md`、handoff（源仓推送；bn/flower 零改动）

## 8. 发布与自举

- validator-first：断言先红 → 模板 / obclose / memory-upgrade 补绿 → 自举 docs/README.md 行移除 → 全绿（EXIT 显式核验，禁管道吞码）→ 负向实验 → `version:set -- 0.1.38` → 收口推送。
- 10 个接入项目不自动生效；下游收敛随各自 `$obinit`（bn 已自洽；flower 待承接落点拍板，均不阻塞本批）。

## 9. 已拍板决策

| 决策 | 选择 | 理由 | 被否决的备选 |
|---|---|---|---|
| 框架 | 所有权 | 可执行判据；防「只读提一句」旁门 | 「不影响 README」 |
| 预置行处置 | 删行 + 表外散文示例 | 示例语义与登记分离；不违反 `:26` | 换假登记行（`docs/architecture.md` 多数项目不存在，同样违反 :26）；纯删无示例 |
| 所有权句措辞 | 工具无关 | 模板复制进无该 skill 的项目 | 点名 create-readme（悬空引用，工具路径禁令同类缺陷） |
| 断言策略 | 正向 + 窄负向 | lessons 2026-06-30（T-8）；防「加回行 + 删句」双绿 | 仅负向 |
| obclose 改指面 | README 无条件在改指面 | 0.1.34 §3.3 明列 README；证据卫生所有权中立 | 刻意排除（README 零外链条款变空文）；维持现状（地图解绑即失覆盖） |
| 存量处置 | 不强制 + 迁移口径 | bn 自洽；flower 前置 = 承接落点拍板 | 强制全改；「存量零改动」绝对化 |
| memory-bank 同批对齐 | 入变更清单（:31 枚举 + 概念块 7 术语） | 0.1.36 已确立 memory-bank:31 ↔ obclose:12 同批同步先例，改指面变更单落一处即双载体漂移 | 留待下批（口径漂移窗口敞开） |
| 自举地图侧 | 一次性修正，无新门禁、不回填所有权句 | 模板是契约面（回归播种 10+ 项目），自举是单文件实例；T-4 直查断言已覆盖，加第二道违反复用原则 | 自举侧同款正负断言（第二道门禁） |
| 所有权句回填 | 不回填实例维护规则、差异检测不报告（收敛口径第 4 条） | 章节级粒度不构成待执行项；回填会让 flower 形态实例出现自相矛盾地图 | 回填（与收敛口径第 3 条顶牛） |
| bn 证据定性 | 收窄自洽样本 | 实测节列表仍有快速开始/配置（T-6，164 行） | 双 owner 漂移证据（外部评审原判，复验修正） |
| instructions 模板 | 不动 | 文档地图节泛指，无 README 触点 | 同批加 README 收窄句（模板无 anchor，且扩大模板对 README 话语权） |

## 10. 留给实现计划

- 所有权句与格式示例的逐字措辞（本 spec 给义务与锚点短语，非逐字全文）；两个锚点短语（`介绍规范单独拥有`、`脱离改指面`）须以连续字串出现。
- 负向断言的实现形状：`assertNoPhrases` 禁 `../README.md`（外部评审建议，覆盖链接变体；防反引号二重转义——JS 双引号字面量写 `"/../README.md"` 前缀匹配或完整短语按 plan 落地时实测）。
- 表外格式示例的 Markdown 隔离：表格空行后**再留一个空行**再写示例行（行内代码包裹），防解析器把示例行当表格延续行（外部评审建议）。
- memory-bank 概念块术语 `与根 \`README.md\`` 在 JS 双引号字面量中的转义书写，plan 代码片段显式标出。
- 自举 `docs/README.md` 删 `:16` 行后**不补空行**（后面紧接既有登记行；模板侧不同——模板删行后保留 `| | | |` 空行，两处别混淆）。
- 概念块新术语的排列位置与失败信息措辞。
- memory-upgrade 新节与 0.1.36 节的行文衔接（纯追加，无 supersede 关系——0.1.38 不修正 0.1.36 口径）。
- 字节/词核账动手重测（§6 为 spec 期实测，不照抄）。

## 11. 验收

1. 反向验证：四组新断言（docs-readme 正向 term、docs-readme 负向行、obclose `脱离改指面`、memory-bank `与根 \`README.md\``）+ memory-upgrade 概念块 3 term，逐条删/加 → 红 → 还原 → 绿，记录输出。
2. `npm test` 绿（EXIT 显式核验，禁管道吞码）。
3. 对照表逐行 grep：模板无 README 登记行、含表外示例与所有权句；自举地图无 README 行；obclose `:12` 与 memory-bank `:31` 解耦句在位。
4. 字节/词核账全在限（按动手实测数记录，非 §6 预估值）。
5. 回归检查点：validator README 直查断言（`:1377-1386`）不受影响仍绿——README 义务无真空的实证。

## 12. 评审与自查记录

builder check（fresh review-fast 子代理，2026-11-02）提出 4 问，处置（全部自决，无「theirs」堆）：

| # | 问题 | 处置 |
|---|---|---|
| 1 | memory-bank:31 改指面枚举与本批 obclose :12 改写冲突，缺 memory-bank 于变更清单 | 已修：§4.4 增同批对齐小节（枚举扩根 README + 概念块 6→7 术语），变更清单 6→7 个内容文件 |
| 2 | 所有权句对存量实例的重复运行语义未定义（回填 vs 不报告） | 已修：§4.5 收敛口径增第 4 条——所有权句不回填、差异检测不报告（避免 flower 形态实例自相矛盾地图） |
| 3 | 负向断言是否也钉自举 docs/README.md | 已裁定：自举侧一次性修正、无新门禁（§4.3 + 拍板表）；模板是契约面，T-4 直查断言已覆盖 |
| 4 | §6 预算基线与 HEAD 漂移（obclose 实测 4,874 wordsish 非 ≈4,824 等） | 已修：§6 改用 builder 实测数并注明「动手重测」；§10 增重测项 |
| 自决 | lessons 条目按仓库既有格式（补适用场景/最后验证，去 progress 式「来源」）；`脱离改指面` 须连续字串出现（v3 行草稿被反引号隔断，锚点移入新节）；T-2 行号 :26→:21 | 已并入正文 |

外部评审（用户转交，2026-11-02）：**判定 Approved**，实测核验 spec 数据全部吻合（obclose 4,874 wordsish、memory-upgrade 8,397 B、manifest 5 处闭环）；4 条 plan 级建议（负向短语收窄为 `../README.md`、示例行 Markdown 隔离、memory-bank 术语 JS 转义书写、自举删行不补空行）已并入 §4.2 与 §10。
