# 0.1.36 scratch 契约整改：证据链闭环与写入边界

状态：已确认（2026-10-24 用户「干」当轮确认；m00223 提出，builder check 与 ZCode 独立复审后修订并入正文，见「评审与自查记录」）。

## 意图与为什么

0.1.34 建立了 `.agents/scratch/` 两段式生命周期与 `docs/research/` 升档；0.1.35 把曾缺失的 ②③（脚本、样本）去向补进 `$obclose`。两次发布解决了"有没有规矩"，没解决"规矩自己是否自洽"。

本会话评审（m00203）与 ZCode 独立评审（`session_64bc78182956df8958ff805670de315e`）并集 14 条，去重后 7 项。合并后剩三条主轴：

1. **证据链断在升档那一刻。** 义务写的是"不留 scratch 外链"，删掉链接就通关；升档产物躺在 `docs/research/` 没有指针，而 `docs/README.md` 是时点快照、不收录它 → 每次升档都在制造孤儿文件。这是两轮评审唯一的交集级问题，也是"升档"从溯源动作退化成"搬文件"的唯一原因。
2. **`$obclose` 的写盘边界说了两套话。** 同一条运行时假设既说"只写 `.agents/`"又豁免 `docs/research/`，步 10 又让它往 `scripts/`、`samples/` 落文件；`:47` 的默认行为还保留着"不修改源码"原句。而 ②③ 在"可以直接做的维护"和"需要用户确认后再做"两个清单里都不存在 → 用户只说"同步 memory"，它就能静默往源码目录加被 git 跟踪的文件。
3. **分类树有兜底洞。** ①~③ 是"值得留"，④ 是"其余留热缓存"；18.16 MB 的 exe 与 23 张截图全部落 ④，从违规变成合规热缓存。

三条都不改 0.1.34 的目标，只补执行面的自洽。

## 目标 / 非目标 / 反目标

### 目标（可验证）

1. 升档后原引用必须指向升档落点或就地内联，不留空引用。
2. `$obclose` 的写盘边界在 skill 正文、`memory-bank.md`、模板三处不互相矛盾；②③ 搬移只在用户当次确认后发生。
3. 分类树对"可重建产物 / 运行态"有明确处置，不再默认热缓存。
4. 清退判据不再被僵尸 handoff 永久钉住。
5. 目标 1～4 各有 validator 断言（删掉即红），对照表见「断言覆盖矩阵」。

### 非目标

- 不改 10 子目录 / 20 MB / 14 天三个阈值数值——没有测量数据支撑新数字，本批只定义度量口径。
- 不做"同一句出现在 4 处"的结构性去重。本批用断言钉住漂移，不做模板继承改造。
- 不改 obinit 代际结构（v3 不跳代，同代际追加）。
- 不动 `docs/README.md` 的时点快照地图策略。
- 不新增体积统计脚本或专用工具。
- 不引入新的 handoff 状态值（见下 §4）。

### 反目标（技术及格但设计失败）

- 为消除矛盾而把 ②③ 从 `$obclose` 删掉、退回"只记路径不搬"：省事，但与 `memory-bank.md` 四分法冲突，等于把矛盾换到另一对文件之间。
- 把确认门槛写成"记得先问用户"这类无判据软话：不可执行，也断言不了。
- 只钉字符串出现、不钉语义义务：例如同时保留"不留外链"与"引用改指"两句、允许只做前者。

## 现状证据（两轮评审并集）

| 编号 | 位置 | 问题 | 来源 |
|---|---|---|---|
| P0-1 | `skills/obclose/SKILL.md:104`、`:202` | 只要求"不留外链"，删链接即通关；升档产物无指针，`docs/research/` 又不进文档地图 | 我 |
| P0-2 | `skills/obclose/SKILL.md:12` vs `:104`、`:47` | "只写 `.agents/`"与"写 `docs/research/`、`scripts/`、`samples/`"同文冲突；默认行为仍是"不修改源码"原句；②③ 不在任何确认清单内 | ZCode + builder |
| P0-3 | `skills/obclose/SKILL.md:104` | `tools/` 丢失，而 `memory-bank.md:31`、`memory-upgrade.md:81` 都写「`scripts/` 或 `tools/`」 | ZCode |
| P0-4 | `skills/obclose/SKILL.md:104`、`memory-bank.md:31` | 限定词丢失：剥离临时硬编码、只保留最小必要字段 | ZCode |
| P1-5 | `memory-bank.md:31`、`skills/obclose/SKILL.md:193` | ④"其余热缓存"吞掉 exe / 日志 / pid / 缓存目录 | 我 |
| P1-6 | `skills/obclose/SKILL.md:192-193`、`memory-bank.md:31`、`memory-bank.md:46` | 过时判据"无进行中 handoff 关联"被僵尸 handoff 永久钉住（handoff 只在"已交接且超龄"时归档）；旧判据在 reference 里另有一份 | 我 + builder |
| P2-7 | `2026-10-23` spec 的状态行、`templates/agents-readme.md:10`、`skills/obclose/SKILL.md:236` | 状态行过期；"可清理"与"暂留后清理"自相矛盾；20 MB 度量口径指向不存在的脚本 | 双方 |

## 核心设计

### 1. 证据链闭环（P0-1）

把义务从"删"改成"改指"。四类落点与写法：

| 产物 | 落点 | 引用写法 |
|---|---|---|
| 成型取证 / 回测报告 | `docs/research/YYYY-MM-DD-<topic>.md` | 指向该文件 |
| 跨任务复跑脚本 | `scripts/` 或 `tools/` | 指向脚本路径 |
| 最小回归样本 | `samples/` 或 `test/fixtures/` | 指向样本路径 |
| 3～10 行结论 | 本轮正在撰写的文档，或 `.agents/progress.md` 条目 | 就地内联，不引路径 |

判据句（可 grep、可断言）：**升档后，原引用一律改写为指向升档后的路径；无处可指的引用改为就地内联结论，不留空引用。**

第三出口（m00203 评审补，2026-10-24）：目标已删且从未升档、结论已不可恢复的历史死链，既不能改指也无从内联——不得编造内联，改为**删除该引用或标注「原 scratch 证据已清理」**，列进收尾说明。二分法（改指 / 内联）只覆盖结论可知的引用；不可恢复的死链走本出口。

`docs/research/` 不进 `docs/README.md` 地图这件事不解决——引用链本身就是索引，这是本批接受的代价。

### 2. 写入范围（m00294 拍板）

`$obclose` 可写：

- `.agents/` 下的 memory 文件（handoffs / active / progress / lessons / README / instructions）；
- `docs/research/` 下**新升档**的文件；
- `scripts|tools/`、`samples|test/fixtures/`——仅在用户当次确认后移入；
- 引用改指：`.agents/` 与本仓/docs 中**当前状态文档**（按 `docs/README.md` 定义：描述系统现在如何工作的文档）里指向 `.agents/scratch/` 的旧引用；
- 结论内联：本轮正在撰写的文档，或 `.agents/progress.md`。

`$obclose` 只读：

- 时点快照——`docs/superpowers/specs/`、`docs/plans/`、既有 `docs/research/` 文件；
- 既有 `docs/adr/` 条目（ADR 只加新文件，不改旧文件）。

快照里残留的旧引用**不回改**：那是当时的取证，回改即伪造历史。

**谁负责**：没有第二个 skill 会去扫 `docs/` 找过期引用——`$obinit` 只做逐节 diff，`$obadr` 只加 ADR，`$obcurate` 只管 Obsidian 公共知识。这条若不归 `$obclose`，就等于没人管，`docs/` 里的 scratch 死链会永久沉淀。`$obclose` 之所以是正确的主，不是因为它"管 docs"，而是因为**失效引用的诞生时刻就是升档时刻**——它正好在现场。权限按"事件"划、不按"目录"划，才是这条能闭环的原因。

执行边界（可审计）：

- 扫描面：`git grep -n '\.agents/scratch/' -- . ':(exclude)docs/superpowers/**' ':(exclude)docs/research/**' ':(exclude)docs/adr/**' ':(exclude).agents/scratch/**'`。
- 只改**目标已升档或已删除**的引用；仍在进行中的 scratch 引用不动。
- 改过的文件列进收尾说明，便于复核。
- bn-alpha-bot 的 177 处引用全部落在 `.agents/` 下，所以即便某项目 `docs/` 里一处都没有，这套机制也不会空转。

### 3. 写入边界（P0-2 / P0-3 / P0-4）

三件事必须一起改，缺一不成立。

**(a) 运行时假设 `skills/obclose/SKILL.md:12` 重写为：**

> 只写 `.agents/` 下的项目 memory；本轮调查的成型取证 / 回测报告升档写入 `docs/research/`；本轮或入库文档里指向 `.agents/scratch/` 的引用改写为指向升档后的落点，短结论内联进本轮正在撰写的文档或 `.agents/progress.md`。跨任务脚本与最小样本只在用户当次确认后移入 `scripts/` 或 `tools/`、`samples/` 或 `test/fixtures/`，移入时只剥离临时硬编码、不改写其逻辑与判据。既有源码内容、依赖、构建配置与 git 配置不改动；时点快照（`docs/superpowers/specs/`、`docs/plans/`、既有 `docs/research/`）与既有 `docs/adr/` 只读。

"不改写其逻辑与判据"是关键限定：它让"不改动源码"在 ②③ 搬移之后依然为真，而不是靠读者心证。（初稿写的是"只移动、不改写其内容"——与"剥离临时硬编码"自相矛盾，硬编码本身就是内容；已改。）

**(b) 默认行为 `:47` 同步改写为**「不修改既有源码内容、依赖、构建配置或 git 配置。」——不改则与 (a) 直接打架，且验收 #3 的"无残留旧句"过不了。

**(c) 步 10 拆成两段**（`skills/obclose/SKILL.md:104`）：

- 当场做（无需确认）：升档报告；把原引用改写为指向升档落点或就地内联；3～10 行短结论内联；其余过程语料留作热缓存，本轮子目录当场不删；把可复跑的脚本与最小样本**登记为候选**。
- 确认后做：把候选移入 `scripts|tools/`、`samples|test/fixtures/`；搬移时剥离临时硬编码（本机路径、时间戳、端口），样本只保留最小必要字段。

确认门槛的操作定义：「只在用户当次确认后」= 确认来源限于**用户当前请求里已明确**，或**本轮针对候选清单明确提问后用户当轮的回答**；未获确认的候选只写进收尾说明，不跨轮沿用、不写进 `active.md`（避免撞 4 KB 快照预算与"不留短暂中间态"规则）。

**(d) `tools/` 补齐**：步 10、`memory-bank.md:31`、概念块术语三处同时出现。

**注意**：`:202` 在"可以直接做的维护"（免确认清单）下，**不放 `tools/`**——那会把脚本搬移重新广告成"随手可做"，正是 P0-2 本身。`:202` 只补"引用改指"（升档是免确认动作）。

**原子性提醒**：改 `:12` / `:47` 会撞 `scripts/validate-skills.mjs:564` 的 close-only safety boundary 术语（原句「不修改源码、依赖、构建配置或 git 配置」）。术语数组必须与正文同一次提交改，否则红灯。`skills/obadr/SKILL.md:22` 是另一句、另一语境，不动。

### 4. 分类树补档（P1-5）

`memory-bank.md:31` 与 `skills/obclose/SKILL.md:193` 各加同文一句：

> 可重建产物与运行态（构建产物、下载的二进制、日志、pid、缓存目录）不按热缓存保留，发现即列入建议删除清单，不必等 14 天。

用"列入建议删除"而不是"删除"，避免与"删除需用户确认"的门槛打架；真正的删除动作仍留在确认清单里。

### 5. 清退判据（P1-6）

现在：过时 = "无进行中 handoff 关联"（`obclose:193`、`memory-bank.md:31`、`memory-bank.md:46` 三处都这么写），而 handoff 只在"已交接且超龄"时归档（`:192`）→ 被放弃的"进行中" handoff 永久钉住目录。

改成两条，三处同步：

1. 过时 = **没有任何最近 14 天更新过的 handoff 引用它**（不看 handoff 自身状态）。
2. 反向提示：`.agents/handoffs/` 中 `状态：进行中` 但超过 14 天未更新的条目，提示确认转为 `已交接`，或确认后删除该 handoff；**不引入新状态值**（`已放弃` 只存在于讨论里，仓里没有、模板里也没有，加它就得同步改 `skills/obclose/templates/handoff.md` 与生命周期正文，超出本批范围）。

第 2 条是让第 1 条真能生效的那把钥匙——没有它，僵尸 handoff 会继续被旧判据保护。

### 6. 文档卫生（P2-7）

- 旧 spec 状态行（`docs/superpowers/specs/2026-10-23-scratch-lifecycle-and-research-promotion-design.md:4`）改为：已实现并随 0.1.34 发布；0.1.35 补 ②③；契约修正见本 spec。**显式 carve（m00203 评审补，2026-10-24）**：状态行是工作流元数据、不属于快照正文，是「快照只读」原则的唯一例外；与下条「第 5 行不回改」不冲突——正文取证不可改，状态指针可更新。
- 旧 spec 第 5 行写了 `.agents/scratch/` 路径、字面违反其自身 §3.3——不回改（时点快照），在此记录为例外，也是本批"快照只读"的第一个实例。
- `templates/agents-readme.md:10` 的"可清理"与 `:12` 的"原目录暂留后按目录清理"统一为"可清理（清理前先做升档检查）"与"原目录暂留作热缓存，超龄后按目录整体处置"。本仓库 `.agents/README.md:11` 同步。
- `skills/obclose/SKILL.md:236` 的 20 MB 口径改成可执行定义：按目录内所有文件字节数求和（`Get-ChildItem -Recurse | Measure-Object Length -Sum` 或等价命令），数字只作量级参考，超限只触发确认、不阻断。删掉"字数口径复用项目校验脚本的统计方式"——项目里没有 scratch 体积统计脚本，这句指向不存在的东西。

## 契约句对照表（改完应满足）

| 契约 | obclose SKILL | memory-bank.md | 指令模板 | validator 术语 |
|---|---|---|---|---|
| 升档后引用改指 | 是（`:12`、步 10、`:202`） | 是（`:31`） | 简写"引用改指" | `改写为指向` |
| 快照 / ADR 只读 | 是（`:12`） | 是（`:31`） | 否 | `只读`（并入边界句） |
| ②③ 需确认 | 是（`:12`、步 10、确认清单） | 是（`:31`） | 否（模板不提 ②③） | `只在用户当次确认后` |
| 脚本落 `scripts/` 或 `tools/` | 是（步 10） | 是（`:31`） | 否 | `tools/` |
| 可重建产物不入热缓存 | 是（`:193`） | 是（`:31`） | 否 | `可重建产物` |
| 过时判据看 handoff 时效 | 是（`:193`） | 是（`:31`、`:46`） | 否 | `最近 14 天更新过` |
| 不留 scratch 持久外链 | 保留 | 保留 | 保留 | `持久证据外链`（既有） |

**为什么模板只带简写**：本批不做结构去重，但也不该把细节再复制一遍。模板承载 30 秒版本，义务句由 `obclose` 与 `memory-bank.md` 承担；漂移由断言兜住。模板不提 ②③，是有意的保守默认——项目若从不搬脚本，永远不会踩到确认门槛。

**memory-upgrade.md 的位置**（m00203 评审补，2026-10-24）：它携带第三份四分法正文（`:81`，0.1.34 节，现无确认门槛），且是存量项目收敛时 agent 实际读的手册。0.1.34 节是代际历史记录、保持原文不改；**0.1.36 新节以显式 supersede 句声明②③口径修正（需用户当次确认、补 `tools/` 与两个限定词），收敛以新节为准**。它不进本对照表的断言列，防线由 obclose 与 memory-bank 承担。

## 断言覆盖矩阵

| 目标 | 断言位置 | 术语 |
|---|---|---|
| 1 引用改指 | obclose 概念块 + memory-bank 概念块 | `改写为指向` |
| 2 写入边界 | obclose 概念块 + memory-bank 概念块 + 边界术语 | `只在用户当次确认后`、`tools/`、`既有源码内容`、`不改写其逻辑` |
| 3 可重建产物 | obclose 概念块 + memory-bank 概念块 | `可重建产物` |
| 4 清退判据 | obclose 概念块 + memory-bank 概念块 | `最近 14 天更新过` |

## validator 断言设计

`scripts/validate-skills.mjs` 改动：

1. `requiredSkillConcepts.obclose` 概念块（现于 `:586-599`，9 术语）→ **14**：新增 `tools/`、`改写为指向`、`可重建产物`、`只在用户当次确认后`、`最近 14 天更新过`。
2. `requiredObinitReferenceConcepts["references/memory-bank.md"]` **新建概念块**（该键当前不存在；memory-bank 现有的 4 个 scratch 术语住在 `requiredScratchLifecycleTerms`，与两个指令模板**共享**，按第 4 条保持 4 词不动——不得扩共享数组，否则模板会被连带要求包含「只在用户当次确认后」，违反「模板不提 ②③」拍板）。新块 **5 术语**，与「断言覆盖矩阵」逐行对齐：`改写为指向`、`只在用户当次确认后`、`tools/`、`可重建产物`、`最近 14 天更新过`。这是目标 2「三处一致」里 memory-bank 那一处的唯一自动防线。
3. close-only safety boundary（`:564`）由旧句替换为 `既有源码内容` 与 `不改写其逻辑` 两条。
4. `requiredScratchLifecycleTerms` 保持 4 词（`<MMDD>-<topic>/`、`docs/research/`、`持久证据外链`、`热缓存`）——模板只承载这四个锚点。

原则：断言钉"义务句"，不钉"分支细节"；术语必须是唯一的自然短语（不钉 `14 天` 这种到处都有的）。

## 预算核账

| 文件 | 现状 | 预算 | 余量 |
|---|---|---|---|
| `skills/obclose/SKILL.md` | 4,269 wordsish / 17,172 B | 5,000 wordsish | 约 730 词，本批约 +130 词 |
| `skills/obinit/SKILL.md` | 1,997 wordsish | 2,000 wordsish | **仅 3 词，本批一个字都不碰** |
| `templates/instructions.md` | 6,006 B | 8,192 B | +约 20 字符 |
| `templates/instructions-index.md` | 5,703 B | 8,192 B | +约 20 字符 |
| `templates/agents-readme.md` | 809 B | 8,192 B | +约 40 字符 |
| `references/memory-bank.md` | 5,521 B | 无字节门禁 | +约 120 字符 |
| `references/memory-upgrade.md` | 6,995 B | 无字节门禁 | +约 200 字符 |

## 变更清单（文件级）

1. `skills/obclose/SKILL.md`——`:12`、`:47`、步 10、`:192-193`、`:202`、确认清单（新增 ②③ 项）、`:236`
2. `skills/obinit/references/memory-bank.md`——`:31`、`:46`
3. `skills/obinit/references/memory-upgrade.md`——新增 0.1.36 同代际追加节，节内**显式 supersede**：②③ 自 0.1.36 起改为需用户当次确认、补 `tools/` 与「剥离临时硬编码 / 只保留最小必要字段」两个限定词（修正 0.1.34 节的无确认口径；0.1.34 节原文不改，由新节声明取代）；v3 代际行同批追加 0.1.36 合成句
4. `skills/obinit/templates/instructions.md`——`:55`
5. `skills/obinit/templates/instructions-index.md`——`:52`
6. `skills/obinit/templates/agents-readme.md`——`:10`、`:12`
7. `scripts/validate-skills.mjs`——obclose 概念块、memory-bank 概念块、边界术语
8. `docs/superpowers/specs/2026-10-23-…-design.md`——仅状态行
9. `.agents/README.md:11`、`.agents/instructions.md:64`——本仓库自举同步
10. 版本同步：`package.json`、`skills.json`、`.claude-plugin/{plugin,marketplace}.json`、`.codex-plugin/plugin.json`（`npm run version:set -- 0.1.36`；`docs/README.md` 无版本串，不在其中）

## 发布与自举

- 目标版本 0.1.36；五处 manifest 同升。
- 提交顺序（validator-first）：断言先红 → 正文 → 模板 → references → 绿 → 版本 → 自举。
- 10 个接入项目不自动生效，各自重跑 `$obinit` 才拿到新指令；本仓库在收尾说明里点名。

## 已拍板决策

| 决策 | 选择 | 理由 | 被否决的备选 |
|---|---|---|---|
| ②③ 搬移 | 保留 + 确认门槛 | 脚本/样本复用有真实价值；四分法原意如此；缺的只是"谁批准" | 禁搬：与 memory-bank 冲突；只记路径：升档在 ②③ 这一半失效 |
| 写入范围 | `.agents/` + docs 当前状态文档；快照与既有 ADR 只读（m00294） | 死链的诞生时刻在升档，只有 `$obclose` 在场；没有第二个 skill 扫 `docs/`，只动 `.agents/` 会让那部分引用无人负责 | 只动 `.agents/`：等于承认 docs 死链永久沉淀；全改：违反仓库自己的快照 policy |
| 阈值数值 | 不改 | 无测量数据支撑新数字；先有口径再谈阈值 | 调成 5 MB / 7 天：拍脑袋 |
| 模板是否承载全量义务 | 否，只带简写 | 避免把"同一句五处"的病灶再复制一遍 | 全量复制：下次漂移仍有五处 |
| 旧 spec 处理 | 只改状态行 | 时点快照，回改即伪造历史 | 全量重写 |
| 术语钉法 | 钉义务句 | 细节会漂，义务不该漂 | 钉阈值：换数字就红 |
| `已放弃` 状态 | 不引入 | 会牵动 handoff 模板与生命周期正文；清退判据已不依赖 handoff 状态，nudge 用"转为已交接或删除"即可 | 新增第三状态：本批范围外 |
| ②③ 候选落点 | 只写收尾说明 | 进 `active.md` 会撞 4 KB 快照预算与"不留短暂中间态" | 写 progress：把临时状态混进日志 |

## 评审与自查记录

builder check（fresh subagent，2026-10-24）提出 7 个问题，处置：

| # | 问题 | 处置 |
|---|---|---|
| 1 | 运行时假设没授权"改指/内联"，`:47` 仍留旧句 | 已答：`:12` 显式列出改指与内联并声明快照只读；`:47` 同步改写并进变更清单 |
| 2 | 快照政策下能写哪些文档 | 已答：m00294 拍板，§2「写入范围」 |
| 3 | `tools/` 是否该进 `:202` | 已纠正：`:202` 免确认，不放 `tools/`；确认清单新增 ②③ 项 |
| 4 | 目标 4 无断言、memory-bank 副本无断言 | 已答：概念块 9→14，memory-bank 4→7，加「断言覆盖矩阵」 |
| 5 | `memory-bank.md:46` 另有旧判据；`已放弃` 是新状态 | 已答：`:46` 进变更清单；不引入新状态 |
| 6 | memory-bank 的义务份额自相矛盾 | 已答：对照表改为 memory-bank 承担 ②③ 与两个限定词，预算 +120 字符 |
| 7 | 候选记在哪、"当次确认"边界 | 已答：只进收尾说明；确认来源限于当前请求或本轮明确提问的回答 |
| 事实漂移 | wordsish 计数、`version:set` 触及文件 | 已修正预算表与变更清单第 10 项 |

ZCode 独立复审（2026-10-24，含上轮 0.1.34/0.1.35 两版评审）提出 5 条，处置：

| # | 问题 | 处置 |
|---|---|---|
| Z1 | 断言覆盖矩阵要求 memory-bank 断言 5 术语，validator 断言设计 #2 只列 3 个（→7），目标 5 随之不成立；「现 4 术语」位置误导（该键不存在，4 词在共享数组） | 已修：#2 改为新建概念块 5 术语，显式禁止扩共享数组 |
| Z2 | memory-upgrade.md `:81` 是第三份无确认版四分法正文、存量收敛手册，不在对照表且本批不改 | 已修：对照表补「memory-upgrade.md 的位置」说明，变更清单 #3 加显式 supersede |
| Z3 | 「无处可指改内联」对已删未升档、结论不可恢复的死链无解 | 已修：§1 补第三出口（删除或标注失效，列收尾说明，不编造） |
| Z4 | §6 改旧 spec 状态行与「快照只读」论证语言冲突；验收 3 grep 未排除 obadr:22 同文句 | 已修：状态行显式 carve 为元数据例外；验收 3 范围限定 |
| Z5 | 非 git 项目无扫描回退；无地图项目「当前状态文档」未定义 | 已修：两条口径入「留给实现计划」 |

## 留给实现计划

- 每处改动的具体措辞（本 spec 给的是义务与判据，不是逐字文本）。
- 概念块新增术语的排列位置与失败信息措辞。
- **非 git 项目的扫描口径（m00203 评审补，2026-10-24）**：§2 扫描面以 `git grep` 定义，非 git 项目需等价回退——用 `grep -rn` / `rg` 加目录排除（跳过 `docs/superpowers/`、`docs/research/`、`docs/adr/`、`.agents/scratch/`），或声明跳过改指扫描并在收尾说明报告；与 obclose 既有「git 可选」假设对齐。
- **无文档地图项目的改指范围默认口径（同上）**：「当前状态文档（按 `docs/README.md` 定义）」在无 `docs/README.md` 的 v1/v2 代项目上未定义，默认收窄为 `.agents/` 全部 + 根 `README.md`。
- `docs/research/` 是否加 frontmatter 约定（本批不强制，留待下一批）。
- 是否给 `$obinit` 增加"检测到旧引用"的提示（本批不做，靠 `$obclose` 改指）。

## 验收

1. **反向验证**：对 5 个新术语 + 3 个 memory-bank 术语 + 2 个边界术语，逐条"删掉 → `npm test` 红 → 恢复 → 绿"，记录输出。
2. `npm test` 绿；`node scripts/validate-skills.mjs` 单独跑绿。
3. 对照「契约句对照表」逐行 grep 本批改动文件（`skills/obclose/SKILL.md`、`memory-bank.md`、模板、references），无残留旧句（含 `:47`）。**grep 范围显式排除 `skills/obadr/SKILL.md:22`**——同一句原文在该文件是另一 skill 的独立语境，本批不改、不算残留。
4. ZCode 的两条 Minor 作为回归检查点：`tools/` 在 skill 正文与 memory-bank 同时在场；两个限定词在步 10 与 memory-bank 同时在场。
5. 下游（不在本批验收）：bn-alpha-bot 的 `1021-alpha123-quota` 走完升档 + 改指后，`.agents/` 下悬空引用计数从 51 开始下降。本批交付需保证这条路可走。
