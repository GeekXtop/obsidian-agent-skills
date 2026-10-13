# 测试门禁骨架进 obinit：「验证分层落地」填值卡——设计

- 日期：2026-10-14
- 状态：待用户确认
- 来源批次：flower-dashboard 2026-10-12 测试门禁分层（commit 5da58d7）；全局三份 AGENTS 的「验证与审查」四层修订（仓库外，备份 `%TEMP%\agents-md-backup-20261012\`）
- 先例：0.1.29 文档地图契约（`.agents/handoffs/2026-09-11_070435_dsh_doc-map-contract.md`）

## 目标

让 `$obinit` 初始化或接入项目时，在 `.agents/instructions.md` 登记本项目的验证落地值（命令、承担者、并发预算、选跑器路径），使「改了代码跑什么验证」从现场猜测变成可查的表。策略层（四层门禁、依赖图推导、不回落全量、新检查三事申报）由 agent 全局规则承载，**项目文件只填值、不复述策略**。

## 非目标（已拍板，不做）

- 选跑器脚本不进插件模板——脚本属于各项目自己的代码，按各自测试框架落地。
- `// @watches:` 语法不写成通用约定——语法离开解析器就是装饰；插件只规定义务（依赖图推不出的检查必须声明触发范围），语法是项目层实现细节。
- 插件规则不指向任何私有仓库的具体实现路径。
- 不新建 memory 代际 v4（见「同代际追加」）。
- 初始化 allowlist 不扩（新节落在 `.agents/instructions.md` 内）。
- 不为存量测试批量补申报、不替项目写选跑器。

## 设计

### 1. 填值卡节（新项目模板，全文定稿）

加进 `skills/obinit/templates/instructions.md`（「文档地图」节之后）：

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

体积实测（UTF-8 字节，含指针句与兜底半句）：**卡文 522–535 B**（随行内括号微调 ±13 B；文件末尾换行口径 ±1 B），模板 5132 → 5656–5667 B，8 KB 硬预算内余量 2525–2536 B——plan 阶段对 validator 的 `assertByteBudget` 输出核账时以此口径为准，勿按单点数字误判。行内括号是**填值形状提示**（回答「填什么算合格」），与策略复述不同：策略仍在全局，括号只约定值的形态与凭证要求；第 5 行初稿的「先测后调，本机资源」即全局规则原话复述（四轮评审漏网），已改。

### 2. 适用面与条件判定

| 模板/项目形态 | 处理 |
| --- | --- |
| 新项目模板（instructions.md），项目有测试或 CI | 保留节，obinit 按项目实际填值 |
| 新项目模板，项目无测试且无 CI | 节体替换为一行：`本项目无测试与 CI，本节有意留空（判定于 <日期>）；引入测试时按模板填值。`——沿用 memory-upgrade「有意保留」形状，避免重复运行反复报告，且不形成"删了没人加回"的单向下行 |
| 索引版模板（instructions-index.md） | **整节不加**。memory-bank 对索引型的内容限定是封闭清单（指南链接、memory 用途、项目笔记路径、写入边界），且其自身规则禁止二次摘要——策略块三项全违。验证落地值属于项目事实源（AGENTS.md 或新项目模板），不属于索引 |

条件判定信号（写入 `references/init-modes.md`，**不写进 SKILL.md 正文**——见「B1 字数账」）：主信号 = 存在测试文件（`*.test.*` / `*_test.go` / `tests/` / `spec/` 之一）；辅信号 = `package.json` 的 test script、CI 配置（`.github/workflows/`、`.gitlab-ci.yml` 等多种托管形态）。主信号不依赖 CI 代理。

触发式同步（写入 `references/init-modes.md`，不写进节文）：测试架构、门禁命令或 CI 配置变更的**同一任务内**同步更新该节——与文档地图同款机制，不挂 `$obclose` 收尾。

填值语义（定死，防各项目各写一套）：有测试或 CI 的项目**六行全填**，无对应机制的行写「无」（不留空行——照 obinit「省略空章节、不写暂无」口径的行级应用）；无测试且无 CI 的项目整节省略、只留一行有意留空（见上表）。

#### B1 字数账（SKILL.md 正文预算）

实测（validator 自身 `countWordsish`，CJK 按字计）：obinit SKILL.md body **1998 / 2000，余量 2**（`validate-skills.mjs:908` 区域 `bodyLimit = skillName === "obinit" ? 2000 : 5000`）。选出路 (a)：SKILL.md **净增 0 词**——「初始化模式选择」表格与快速流程不动，条件判定、触发式同步、重复运行豁免口径全部下沉既有 `references/init-modes.md`（分支/冲突路由的既有落点；references 只有术语断言，无词预算）。不选 (b) 压缩别处（连带触碰既有断言覆盖的句子）与 (c) 调大预算（2000 是刻意的「往 references 搬」压力阀）。

### 3. 同代际追加，不建 v4

- 依据：代际表 v3 行先例（「0.1.30 起同代际追加体积预算与读取分级」）——同量级模板加节走同代际；重复运行模式本就逐节对比报差异，新代际不产生新能力，只产生记账。
- 动作：`references/memory-upgrade.md` v3 行（:11）**合成一句**，避免一行出现两个版本路标：「`docs/README.md` 文档地图、`## 文档地图` 占位节与同批更新规则；0.1.30 起同代际追加体积预算与读取分级，0.1.32 起追加『验证分层落地』填值卡（有测试或 CI 的项目六行全填，无对应机制写『无』；无测试项目记一行有意留空；索引型不加节——三者均为有意形态，重复运行不报差异）」。正文补一小节说明填值口径、触发式同步与上述豁免（照 :73「有意保留」形状，否则重复运行的逐节对比会把「模板有节、项目一行留空」反复报为差异）。**不建 v4、不写迁移清单。**
- 存量项目收敛：下一次 `$obinit` 重复运行时逐节对比自然报出缺失节，等用户确认后补——不需要独立迁移清单。

### 4. 自举（插件仓库自身，一次 reload 两个动作）

- **动作一：补卡，与「六行全填」同口径（不减行）**。本仓库自身 `.agents/instructions.md`（实测 6355 B / 8192）在插件发布且客户端更新 reload 后补**六行全填的真值卡**（实测 +596 B → 6951 B，余量 1241 B；「无对应机制写『无』」口径与第 2 节一致，不留空行、不整节省略）。第 4 行本仓库真值恰是全套里最该登记的一行：`依赖图推不出的检查与触发范围 = validate-skills.mjs 对 skills/**、模板与 references 的文本断言——改 skills/** 即触发`（扫描式断言不在任何 import 图上，与全局规则「CI 上结构性缺席的门禁」同类）。若补卡后逼近 8 KB，按 memory-bank:38 压缩的是**已成为存量稳定态的旧节说明**，不是卡的行——行数与模板一致是第 105 行验收（重复运行逐节对比差异为空）能判绿的前提，行数差本身就是差异项。
- **动作二：清代际标记欠账**。`.agents/instructions.md:19` 仍是「当前 memory 代际：v2，对应插件版本 `0.1.28` 及以上」，而 active.md:33 已排队「随 0.1.32 发布……发布并 reload 后把代际标记从 v2/`0.1.28` 推进到 v3/`0.1.29`」，自举文件 :20 自述的推进条件（发布并 reload）届时已满足。本批 reload 后**一并推进 v2→v3**；`validate-skills.mjs` 的 `requiredSelfHostingGateTerms` 含字面量 `"0.1.28"`（:136），必须同批换 `0.1.29`，否则 `npm test` 必红。
- validator **不对自举文件加新节断言**：否则发布前 `npm test` 即红，破坏「发布与自举解耦」的时序（自举两个动作都发生在 reload 后）。模板间预算 parity 断言（既有）继续覆盖三份 8 KB。

### 5. validator 断言

按 validator **实际存在的形状**（无 `requiredSections`；正向= `required*Terms` 术语数组 + 内联 `content.includes` 过滤，负向= `assertNoPhrases`，引用文件= `requiredUsageFalsificationTerms` 对 `memory-bank.md` 的既有形状），断言落在「节存在 + 指针句 + 待填行形状」，**不钉机制名词**（把 `@watches` 这类名字写进 validator 等于把项目层实现钉成永久承诺）：

1. 新增 `requiredVerificationLandingTerms = ["## 验证分层落地", "验证策略由 agent 全局规则承担", "- 受影响测试命令：", "- 提交门禁命令（本项目实际跑什么）：", "- 全量命令与承担者（本项目跑在哪，本地 / CI）：", "- 依赖图推不出的检查与触发范围（读源码文本、数据驱动、子进程类）：", "- 测试并发预算与依据（值：并发数；依据：实测数据）：", "- 选跑器路径："]`，对 `templates/instructions.md` 做内联 includes 过滤——钉的是节名、指针句与待填行形状，不是任何机制实现。
2. `assertNoPhrases("templates/instructions-index.md", ["## 验证分层落地"])`——负向，防回归加节（有意取舍：拿可查性换不重复，命令与测试细节由索引模板既有指针句「读取上述源文件」覆盖）。
3. **条件判定信号与触发式同步的断言（C1）**：`references/init-modes.md` 现只被 `requiredObinitReferences`（validator:107）的**文件存在性**覆盖，无内容级断言；落点用既有 per-file 概念块 `requiredObinitReferenceConcepts`（validator:118，现仅 obsidian-sync.md 与 memory-upgrade.md 两键）**新增 `"references/init-modes.md"` 条目**（terms 如 `["验证分层落地", "测试文件", "同一任务内"]` 级别，具体词表 plan 阶段随下沉文本定稿）——规则落在哪，断言跟到哪，与「每条规则都有断言」的仓库口径一致。
4. 体积预算复用既有 `assertByteBudget` 与模板 parity 断言，无新增第二道。

**每条新增断言（第 1–3 条）各做一次负向红灯验证**；`npm test`（= `scripts/validate-skills.mjs`，6 skills）全绿为门禁。

### 6. 发版序列（已核实的事实）

- 源仓库：`E:\Developer\01-GeekXtop\_AI\obsidian-agent-skills`，分支 main，`origin/main..HEAD = 2`：`c998e2d`（active.md 预算批次）+ 本 spec 提交自身（`5bdf184` 系）——**两个未推提交随本批一并进 0.1.32**，知情选择；发布前需复核该计数（本行即 spec 回改自身事实行的实例）。
- 本仓库**无 CI**（无 `.github/workflows`）：`npm test` 是唯一发布门禁，推送前必须本地全绿，无 CI 兜底。
- 版本不是一个文件：`npm run version:set 0.1.32`（= `scripts/bump-version.mjs`）写 5 处——`package.json`、`skills.json`、`.claude-plugin/plugin.json`、`.codex-plugin/plugin.json`、`.claude-plugin/marketplace.json`（metadata + plugins[]）。不手改 package.json。
- 序列：改文件 → `npm run version:set 0.1.32` → `npm test` 全绿（含新断言负向红灯）→ 检查 README 与本仓库 docs/README.md 文档地图是否需同步（涉及发版/新节则同批，不涉及不硬凑）→ commit → push（两个未推提交一并，其一为本 spec 自身）→ ZCode 客户端 update plugin → reload → reload 后自举两个动作（补真值卡 + 代际标记 v2→v3，见第 4 节）。

### 改动文件清单（源仓库内，7 项）

1. `skills/obinit/templates/instructions.md` —— 加填值卡节
2. `skills/obinit/templates/instructions-index.md` —— 不改文件本体；validator 负向断言的对象
3. `skills/obinit/references/init-modes.md` —— 条件判定信号、触发式同步、重复运行豁免口径（B1 字数账：SKILL.md 正文 1998/2000 余量 2，净增 0 词，细节全部下沉此处；SKILL.md 本体不改）
4. `skills/obinit/references/memory-bank.md` —— 补验证分层落地节的登记说明（落点 plan 阶段定，倾向 instructions.md 描述处）
5. `skills/obinit/references/memory-upgrade.md` —— v3 行同代际追加 + 填值口径小节
6. `scripts/validate-skills.mjs` —— 断言 1/2/3
7. `.agents/handoffs/`（本批次占坑）+ `package.json` 等 5 文件由 version:set 代写

### 验证与证据要求

- `npm test` 全绿（6 skills）。
- 每条新断言一次负向红灯（临时改坏模板验证 fail 信息后还原）。
- 模板加节后三份 8 KB 实测字节（validator 预算断言输出为准）。
- 客户端 reload 后：`$obinit` 重复运行模式对本仓库报出「验证分层落地」缺失差异，补节后差异为空（memory-upgrade 的迁移验证口径）。

## 已拍板决策记录

| 决策 | 拍板人轮次 |
| --- | --- |
| 只加规则节，不带选跑器脚本 | 2026-10-14（AskUserQuestion：不带脚本） |
| 节形态=填值卡，不复述全局策略（防漂移 + 体积 + 语法三题同解） | 2026-10-14 评审 |
| 索引版整节不加 | 2026-10-14 评审（三处契约条款违背，选最小改动） |
| 无测试项目「有意留空」一行，不删节 | 2026-10-14 评审（memory-upgrade:73 形状） |
| 同代际追加，不建 v4 | 2026-10-14 评审（v3 行先例 + 重复运行机制重复） |
| `@watches` 语法不通用化、不进 validator、参考实现不指向私有仓库 | 2026-10-14 评审 |
| 申报义务的准确口径=声明义务+作者自证+评审把关；护栏只保证「有申报、glob 活」，**不保证覆盖性**（design-system 漏申报规则本体即实证）——模板与断言不得写「护栏钉死」类承诺 | 2026-10-14 二轮评审（依据 flower-dashboard `c948b8b` 工具头部修正） |
| B1 出路选 (a)：SKILL.md 净增 0 词，判定/同步/豁免全部下沉 `references/init-modes.md`（实测正文 1998/2000 余量 2，不压缩别处、不调预算） | 2026-10-14 三轮评审 |
| 自举卡与模板同口径**六行全填**（无值写「无」），不减行——行数一致是重复运行验收判绿的前提；实测 +596 B 余量 1241 B，逼近 8 KB 时按 memory-bank:38 压缩旧节说明而非减行；同一次 reload 一并推进代际标记 v2→v3（清 active.md:33 欠账，validator 字面量同批换） | 2026-10-14 三轮评审提出极简卡，四轮评审否决（3 行卡与六行口径分叉、省掉最该登记的文本断言行、行数差永不判绿） |
| 发布与自举解耦（reload 后补节） | doc-map-contract 先例沿用，评审确认 |

## 开放问题

无——plan 阶段需核实的仅剩 memory-bank.md 登记说明的具体落点段落。
