# `.agents/scratch/` 两段式生命周期与 `docs/research/` 升档契约设计

- 日期：2026-10-23
- 状态：待用户确认（brainstorming 产物；确认后才进 writing-plans）
- 来源实证：`flower-dashboard`（`.agents/scratch/` 71 文件 / 6.41 MB）与 `bn-alpha-bot`（43 文件 / 3.18 MB，含 `2026-10-20` 子目录先行约定及 `1021-alpha123-quota` / `1021-value-window-forensics` 逆向回测案例）
- 目标版本：`0.1.34`（memory 代际维持 v3，同代际追加）

---

## 1. 意图与为什么（Why）

对 `e:\Developer` 下接入 `obsidian-agent-skills` 的主力项目体检发现，`.agents/scratch/` 在高频工程迭代中普遍出现堆积且 AI 不敢清理的「引用死锁」现象：

1. **项目内高价值实证报告缺乏合法槽位（写时没地方放）**：
   以 `bn-alpha-bot` 的 `1021-alpha123-quota/report.md`（从 455 轮历史数据中淘出 7 轮隐藏的 `quota_auto_confirm_target_usd: 30`、`[22, 38]` 美元带等 6 行关键 JSON 判据）和 `1021-value-window-forensics/report.md`（110 轮上线小时价回测分布表）为例——这类产物属于**项目私有、高信息密度的领域研究与逆向取证报告**：
   - 塞不进 `.agents/lessons.md`（`lessons` 仅收简短防踩坑规则，装不下百行分位数分布表与演化时间线）；
   - 不等同于 `docs/adr/`（纯竞品对标或前置回测阶段尚未产生架构决策，或一份研究支撑多个后续 Spec/ADR）；
   - 不能进 Obsidian 公共知识库 `$oblearn` / `$obdoc`（属单一项目的私有业务情报，跨项目不通用）。
   结果 AI 在调查期间只能把成型报告与几 MB 的原始 JSON 语料、一次性探针脚本混装进 `.agents/scratch/`。

2. **入库文档留外链导致安全护栏死锁（清时不敢删）**：
   AI 为满足「证据先于断言」和「可复现性」，在入库的正式文档（`docs/superpowers/specs/`、`plans/`、`.agents/progress.md`、`active.md`）中直接写下 `详见 .agents/scratch/xxx` 或 `可复跑 node .agents/scratch/xxx.mjs`。下一轮 AI 来清理时，扫描发现正式文档引用了该路径，便触发安全护栏拒绝删除；同时因为 `.agents/scratch/` 被 `.gitignore` 忽略，跨机器或新建 `git worktree` 时这些外链天然变成悬空死链。

本设计旨在通过**「写时按子目录装盒 → 收尾按四分法当场淘金脱钩（黄金进 `docs/research/`、断掉 `scratch` 外链、热缓存暂留） → 延期按目录批量清退沙子」**的两段式生命周期，彻底解开死锁。

---

## 2. 目标、非目标与反目标

### 目标
1. **目录隔离**：`.agents/scratch/` 统一按 `<MMDD>-<topic>/`（或 `<YYYY-MM-DD>-<topic>/`）子目录组织，消除根目录散装文件。
2. **明确 AI 淘金决断标准**：建立「四分法决断树」，将成型的项目内逆向/取证/回测报告（内联关键原始判据片段与统计口径）正式升档至 `docs/research/YYYY-MM-DD-<topic>.md`。
3. **破除引用死锁**：建立「入库文档零 `.agents/scratch/` 持久证据外链」契约，使 `.agents/scratch/` 子目录在任务收尾后即处于「已脱钩、随时可安全删除」状态。
4. **兼顾近期追问与长期整洁**：`$obclose` 收尾当场只做「淘金脱钩」、默认保留本轮 `scratch` 子目录作近期热缓存；当累积超限或用户点名时，按子目录批量确认清退过时项。

### 非目标（不做）
- **不把原始大体积 JSON、截图或一次性探针脚本原样升档进 Git**：`docs/research/` 只收自包含的 Markdown 研究报告，不收几 MB 的原始抓取 Dump。
- **不扩大 `$obinit` 初始化 allowlist**：`$obinit` 初始化时不预建空的 `docs/research/` 目录（保持 `docs/adr/` 与 `docs/README.md` 的窄初始化范围）；`docs/research/` 在日常任务首次有研究报告升档时按需创建。
- **不新建第 7 个 skill**：分流与延期清退直接内聚在 `$obclose` 的收尾工作流与 Memory 维护中。
- **不推进 memory 代际到 v4**：沿用 0.1.30 / 0.1.32 同代际追加先例，在 v3 内通过 `$obinit` 重复运行逐节对比自然收敛。

### 反目标（失败形态）
- 把 `.agents/scratch/` 里的几 MB JSON 或一次性脚本原封不动搬进 `docs/research/`，导致 Git 仓库膨胀。
- 收尾当场强行秒删刚跑完的 `.agents/scratch/<MMDD>-<topic>/`，导致用户次日追问同一话题时丢失本地热缓存、被迫重新抓取。
- 升档后的 `docs/research/` 报告里仍然写“关键字段见 `.agents/scratch/xxx/historydata.json`”，没有把那几行决定性 JSON 判据内联进正文，换个环境依然死链。

---

## 3. 核心设计

### 3.1 写入隔离：`<MMDD>-<topic>/` 子目录制

- 凡写入 `.agents/scratch/` 的临时调查草稿（探针脚本、临时抓取 JSON、中间对比表、验证截图），一律按单轮调查话题建 `<MMDD>-<topic>/`（或 `<YYYY-MM-DD>-<topic>/`）子目录归拢，不在 `.agents/scratch/` 根目录裸放散装文件。
- `.agents/scratch/` 不保存长期测试夹具（长期夹具按 3.2 节类别 ③ 归入项目正式 `samples/` 或 `test/fixtures/`）。
- 运行日志、构建缓存和生成物仍不得放入 `.agents/`。

### 3.2 收尾淘金：四分法决断树與 `docs/research/` 自包含铁律

每次调查或任务收尾（执行 `$obclose`）时，AI 按**产物性质**（而非“是否被某篇文档提过名字”）对 `.agents/scratch/<MMDD>-<topic>/` 内部文件执行四分法决断：

| 类别 | 产物性质 | 收尾去向（AI 决断动作） | 自包含与可复现要求 |
| :--- | :--- | :--- | :--- |
| **① 成型研究 / 逆向 / 回测报告** | 项目私有的领域调查、竞品 API 逆向、全量回测分布、故障根因深潜（如 `alpha123` 配额推断报告、小时价价值带回测） | **升档入库 → `docs/research/YYYY-MM-DD-<topic>.md`**<br>（若仅是服务于单次小改动的 3～10 行结论，直接**内联**进对应 Spec / ADR / `.agents/progress.md`，不单独建文件） | **证据自包含铁律**：报告正文必须直接内联：<br>1) **决定性原始判据小片段**（如改变认知的 5～15 行真实 JSON 隐藏字段或报文样本）；<br>2) **统计与复现口径**（数据源/接口/表名、时间窗、过滤谓词、计算公式或一行复现命令）；<br>3) **结果分布表与边界样本 ID**。<br>满足此三项即视为已具备完整可复现性，不再依赖原始大 JSON 或临时脚本。 |
| **② 跨任务复跑工具** | 后续日常运维、回归核账仍需反复执行的通用脚本（占比 < 10%） | **升档入库 → 项目 `scripts/` 或 `tools/`**<br>（剥离临时硬编码后移入正式脚本目录） | 按项目脚本约定维护。 |
| **③ 最小回归夹具 / 绝版基准样本** | 单测/e2e 必用的最小复现报文，或外部随时可能下线的绝版小体量基准 | **裁剪归档 → 项目 `samples/` 或 `test/fixtures/`**<br>（若仓库已有同源存档如 `samples/bapi/...`，不重复留存） | 只保留最小必要字段或去重存档，不把未裁剪的多 MB 过程快照塞入测试夹具。 |
| **④ 一次性探针与过程语料** | 单次统计脚本（`run.py`、`backtest-*.mjs`）、原始大体积 JSON 快照、已被证伪的中间数据、临时截图 | **不升档，留原子目录作热缓存 → 延期整目录清退** | 报告已按类别 ① 自包含记录口径与判据，下次需要时 AI 可在 30 秒内按口径重写脚本，无需保留易随代码演进而腐败的临时脚本。 |

### 3.3 引用边界：入库文档「零 `scratch` 持久外链」契约

- **入库文档禁留 `scratch` 持久证据外链**：凡是被 Git 跟踪的持久文档——包括 `docs/adr/`、`docs/research/`、设计稿与实施计划（如 `docs/superpowers/specs/`、`plans/`）、`README.md`、`.agents/progress.md`、`.agents/lessons.md`、`.agents/active.md`——在任务完成或文档定稿时，一律引用升档后的 `docs/research/YYYY-MM-DD-<topic>.md`、`samples/` 或直接内联结论数据，**不得把 `.agents/scratch/` 路径写进持久文档充当证据外链**。
- **在途上下文临时指向豁免**：仅 `状态：进行中` 的 `.agents/handoffs/` 交接文件，或尚在执行中的实施计划，允许临时指向当前任务的 `.agents/scratch/<MMDD>-<topic>/` 传递会话内/跨会话热数据；任务收尾（handoff 转为 `已交接`）时，持久总结以 `docs/research/` 或内联结论为准。
- **清理解锁规则**：判断某个 `.agents/scratch/<MMDD>-<topic>/` 能否删除，**唯一判据是「对应任务是否已完结且其中有价值的结论/样本已按四分法升档或内联」**。即使旧版历史文档中曾遗留 `.agents/scratch/xxx` 字面路径，只要结论已内联或已补升档至 `docs/research/`，该历史字符串不再构成阻止清理的引用锁。

### 3.4 两段式生命周期（`$obclose` 当场淘金脱钩 + 延期批量清退）

为避免“当场秒删导致次日追问无热数据可用”，`.agents/scratch/<MMDD>-<topic>/` 采用两段式生命周期：

1. **第一阶段（当场收尾 `$obclose`）：只做「淘金脱钩」，默认保留热缓存**
   - 执行 `$obclose` 时，检查本轮任务是否在 `.agents/scratch/` 下新增或修改了调查子目录：
     - 若存在有独立保留价值的取证/回测报告但尚未升档，当场按 3.2 节自包含要求升档至 `docs/research/YYYY-MM-DD-<topic>.md`（或将简短结论内联进 Spec / ADR / `progress.md`）；
     - 核对本轮新增/更新的入库文档未遗留 `.agents/scratch/` 持久证据外链；
     - **当场默认不删除**本轮的 `.agents/scratch/<MMDD>-<topic>/` 子目录，将其保留为近期追问的本地热缓存。
2. **第二阶段（延期批量清退）：超限或用户点名时按子目录确认删除**
   - **巡检预算**：`$obclose` 在「Memory 维护」中检查 `.agents/scratch/` 存量规模，建议上限为 **不超过 10 个子目录或 20 MB**，单目录陈旧阈值为 **最后修改超过 14 天且无 `状态：进行中` 的 handoff 关联**。`$obclose` 结束汇报的「memory 占用」行同步输出 `.agents/scratch/` 的子目录数与总体积。
   - **批量确认清理**：当 `.agents/scratch/` 超过上述阈值，或用户显式要求清理 `scratch` 时，AI 按子目录列出清理候选表（包含：子目录名、体积、最后修改日期、对应结论是否已升档 `docs/research/` 或内联、是否存在未提取的孤本报告）。若某旧子目录内仍有未提取的孤本报告，先补升档/内联；随后**等待用户按组或逐项确认后，按 `<MMDD>-<topic>/` 子目录整体删除**（归入 `$obclose`「需要用户确认后再做」的维护动作）。

### 3.5 `docs/research/` 在文档地图（`docs/README.md`）与 `$oblearn` 中的定位

- `docs/research/` 与设计稿（`specs/`）、实施计划（`plans/`）同属**时点快照（Point-in-Time Snapshot）**：它们记录特定时点的逆向取证、数据回测与实证判断，不描述系统当前运行态，因此**不随日常代码行为改动强制同步更新，也不逐篇登记进 `docs/README.md` 的当前状态表格**（防止撑爆 `docs/README.md` 的 4 KB 预算）。
- **模板与自举实例的一致口径（构建者裁定）**：
  - 在 `skills/obinit/templates/docs-readme.md`、`skills/obinit/templates/instructions.md`、`skills/obinit/templates/instructions-index.md` 的「时点快照不入表」正文中，将 `研究报告（docs/research/）` 与设计稿、实施计划并列点名；模板表格不新增快照行。
  - 本仓库自身的 `docs/README.md` 在自举同步时，除更新第 12 行正文外，若表格第 24 行保留了时点快照兜底说明行，则同步将 `docs/research/` 并入该行说明（不逐篇登记文件）。
- **与 `$oblearn` 输入范围的边界（构建者裁定）**：
  - `docs/research/` 保存的是项目私有实证研究，`$oblearn` **不遍历 `docs/research/` 目录**；与设计/计划文档同口径（`skills/oblearn/SKILL.md:73`），仅当 `.agents/active.md`、`.agents/progress.md`、`.agents/lessons.md` 明确指向某篇 `docs/research/` 报告或用户指定从中提炼跨项目通用经验时才按需读取，无需改动 `oblearn/SKILL.md`。

---

## 4. 改动落点与字数/体积预算核账

### 4.1 `skills/obinit/SKILL.md` 字数账（硬上限 2000 wordsish）
- **现状实测**：`skills/obinit/SKILL.md` 去除 frontmatter 后为 **1997 / 2000 wordsish**，余量仅 3 词。
- **决策**：与 0.1.32「验证分层落地」相同，**`skills/obinit/SKILL.md` 本体一字不改（净增 0 词）**。其第 91 行既有句子 `临时调查草稿写入 .agents/scratch/；运行日志、缓存和生成物不要放进 agent memory。` 保持原样以继续满足 `requiredObinitConcepts` 的 `scratch-only temporary workspace` 断言；具体子目录规则、四分法升档与零外链契约全部落入下述模板、`references/` 与 `skills/obclose/SKILL.md`。

### 4.2 两个指令模板与 `docs-readme.md` 模板（定稿文案与字节账）

1. **`skills/obinit/templates/instructions.md`（现 5,668 B / 8,192 B）与 `skills/obinit/templates/instructions-index.md`（现 5,365 B / 8,192 B）**：
   - `## 记忆库` 末条原为：
     ```markdown
     - 临时调查草稿写入 `.agents/scratch/`；运行日志、缓存和生成物不要放进 agent memory。
     ```
     替换为（两模板完全同文）：
     ```markdown
     - 临时调查草稿按 `<MMDD>-<topic>/` 子目录写入 `.agents/scratch/`；收尾时将有独立价值的取证/回测报告（内联关键判据片段与统计口径）升档到 `docs/research/` 或内联进正式文档，入库文档不留 `.agents/scratch/` 持久证据外链，原目录暂留作热缓存后按目录定期清理；运行日志、缓存和生成物不要放进 agent memory。
     ```
   - `## 文档地图` 第 5 条原为：
     ```markdown
     - 设计稿、实施计划等时点快照不进文档地图：它们记录当时的判断，不随后续改动更新。
     ```
     替换为（两模板完全同文）：
     ```markdown
     - 设计稿、实施计划、研究报告（`docs/research/`）等时点快照不进文档地图：它们记录当时的判断与取证，不随后续改动更新。
     ```
   - **字节账**：每份模板净增约 **285 B**：
     - `templates/instructions.md`：5,668 B → **~5,953 B / 8,192 B**（余量 ~2,239 B）；
     - `templates/instructions-index.md`：5,365 B → **~5,650 B / 8,192 B**（余量 ~2,542 B）；
     - 本仓库 `.agents/instructions.md`（reload 自举后同步该两句）：7,410 B → **~7,695 B / 8,192 B**（余量 ~497 B）。三者均满足 8 KB 硬预算。

2. **`skills/obinit/templates/docs-readme.md`（现 2,036 B / 6,144 B）**：
   - 第 12 行原为：
     ```markdown
     设计稿、实施计划等**时点快照**不入表：它们记录当时的判断，不随后续改动更新，各自按日期累积。
     ```
     替换为：
     ```markdown
     设计稿、实施计划、研究报告（`docs/research/`）等**时点快照**不入表：它们记录当时的判断与取证，不随后续改动更新，各自按日期累积。
     ```
   - **字节账**：2,036 B → **~2,079 B / 6,144 B**（余量 > 4 KB）。

3. **`skills/obinit/templates/agents-readme.md`**：
   - 第 10、12 行关于 `scratch/` 的说明同步加上按 `<MMDD>-<topic>/` 子目录归拢与结论升档 `docs/research/` 后按目录清理的简述。

### 4.3 `skills/obinit/references/memory-bank.md` 与 `memory-upgrade.md`

1. **`skills/obinit/references/memory-bank.md`**：
   - 目录树 `docs/` 下补充 `research/         # 成型的取证、回测与领域研究报告（时点快照，按需创建）`；
   - 更新规则第 30 行扩写：明确 `.agents/scratch/<MMDD>-<topic>/` 子目录制、收尾四分法分流（成型报告内联关键判据片段与统计口径升档 `docs/research/YYYY-MM-DD-<topic>.md`、跨任务脚本进 `scripts/` 或 `tools/`、最小样本进 `samples/` 或 `test/fixtures/`、入库文档不留 `.agents/scratch/` 持久证据外链）、当场保留热缓存与超限（建议不超过 10 个子目录或 20 MB，或超 14 天无在途 handoff）按目录清理。
   - 「按需读取，不要全文加载」现行预算段末追加：`.agents/scratch/` 建议不超过 10 个子目录或 20 MB（单目录超过 14 天且无进行中 handoff 视为过时可清理）。

2. **`skills/obinit/references/memory-upgrade.md`（维持 v3，同代际追加）**：
   - 代际表 v3 行（第 11 行）尾部合成追加：`0.1.34 起追加 scratch 子目录隔离、docs/research/ 升档与零持久外链契约`；
   - 文件末尾新增 `## Scratch 生命周期与研究报告升档（0.1.34 起同代际追加）` 小节，说明：
     1) 存量项目重复运行 `$obinit` 时，对比报告 `.agents/instructions.md` 与 `docs/README.md` 的上述两处表述差异，确认后就地更新；
     2) 存量项目 `.agents/scratch/` 中已有的散装文件或旧目录不强制在 `$obinit` 期间搬迁，而是在后续 `$obclose` 或专门清理轮中按四分法分流（未入库的成型取证/回测报告补内联判据后升档 `docs/research/`，已完结的旧目录与散装过程文件经用户确认后清理；历史文档中已存在的 `.agents/scratch/` 旧引用在结论已内联或补升档后不再阻碍删除）。

### 4.4 `skills/obclose/SKILL.md`（现 3,819 / 5,000 wordsish，余量 1,181）

1. **`## 运行时假设`（第 11 行）**：
   - 原为：`只写 .agents/ 下的项目 memory；不修改源码、依赖、构建配置或 git 配置。`
   - 改为：`只写 .agents/ 下的项目 memory（当本轮调查在 .agents/scratch/ 中产出了需升档的成型取证/回测报告时，可按收尾分流规则写入 docs/research/）；不修改源码、依赖、构建配置或 git 配置。`（注意保留 `不修改源码、依赖、构建配置或 git 配置` 原句以通过 validator `close-only safety boundary` 断言）。
2. **`## 工作流` 与新增 `## Scratch 淘金与延期清理` 节（或并入 `## Memory 维护`）**：
   - 在工作流第 9 步后加入：检查本轮 `.agents/scratch/<MMDD>-<topic>/` 调查产物，执行**阶段一（当场淘金脱钩）**——将有独立价值的取证/回测报告（内联关键原始判据片段、统计口径与结果表）升档至 `docs/research/YYYY-MM-DD-<topic>.md` 或内联进对应文档，确保入库文档不留 `.agents/scratch/` 持久证据外链；本轮 `scratch` 子目录当场默认保留作近期热缓存。
   - 在 `## Memory 维护` 的「每次收尾时检查」列表新增：
     `- .agents/scratch/ 是否超过约 10 个子目录或 20 MB，或存在最后修改超过 14 天且无进行中 handoff 关联的过时子目录。`
   - 在「可以直接做的维护」新增：
     `- 将本轮 .agents/scratch/<MMDD>-<topic>/ 中已定稿的成型研究/取证/回测报告（含关键判据片段与统计口径）升档写入 docs/research/YYYY-MM-DD-<topic>.md，消除入库文档对 .agents/scratch/ 的持久证据外链。`
   - 在「需要用户确认后再做」新增：
     `- 按子目录批量清理已脱钩的过时 .agents/scratch/<MMDD>-<topic>/ 目录或历史散装草稿（先列出候选子目录、体积、结论是否已升档 docs/research/ 或内联；历史文档曾提及路径但结论已升档/内联的不阻碍清理）。`
3. **`## 完成说明`（第 232 行）**：
   - 在 memory 占用汇报中并列加入 `.agents/scratch/` 的子目录数与体积（与 `10 个子目录 / 20 MB` 阈值并列），以及本次是否升档了 `docs/research/` 报告或存在建议清理的过时 `scratch` 子目录。

### 4.5 `scripts/validate-skills.mjs` 断言设计

按仓库 validator 既有模式（术语数组 + 负向红灯验证），新增三处门禁：

1. **`requiredScratchLifecycleTerms`（模板与 `memory-bank.md` 共享契约）**：
   ```js
   const requiredScratchLifecycleTerms = [
     "<MMDD>-<topic>/",
     "docs/research/",
     "持久证据外链",
     "热缓存",
   ];
   ```
   - 对 `skills/obinit/templates/instructions.md`、`skills/obinit/templates/instructions-index.md`、`skills/obinit/references/memory-bank.md` 断言必须包含上述全部术语；
   - 对 `skills/obinit/templates/docs-readme.md` 断言包含 `"docs/research/"`。
2. **`requiredObinitReferenceConcepts["references/memory-upgrade.md"]` 扩展**：
   - 新增概念块 `{ name: "scratch lifecycle and research promotion upgrade", terms: ["0.1.34", "<MMDD>-<topic>/", "docs/research/", "持久证据外链"] }`。
3. **`requiredSkillConcepts.obclose` 扩展**：
   - 新增概念块：
     ```js
     {
       name: "scratch graduation and deferred eviction",
       terms: [
         "<MMDD>-<topic>/",
         "docs/research/",
         "持久证据外链",
         "热缓存",
         "10 个子目录",
         "20 MB",
         "14 天",
       ],
     }
     ```
4. **发布与自举解耦保护**：
   - 不对本仓库自身的 `.agents/instructions.md` 和 `docs/README.md` 加 `requiredScratchLifecycleTerms` 硬断言，遵循 0.1.32 先例，保证发版前 `npm test` 绿灯、客户端更新插件并 reload 后再执行本仓库自举同步。

---

## 5. 发布、自举与下游收敛序列

1. **源仓库实现与发版（`0.1.34`）**：
   - 按 Validator-First TDD 先加 `scripts/validate-skills.mjs` 断言并验证红灯 → 修改模板、`references/` 与 `skills/obclose/SKILL.md` 至 `npm test` 全绿 → 对每条新断言各做一次负向破坏红灯实验后还原；
   - 运行 `npm run version:set -- 0.1.34` 同步 5 个 manifest 版本号，`npm test` 复验全绿；
   - 提交并推送 `0.1.34`。
2. **客户端更新与本仓库自举**：
   - 更新本地插件并 reload 后，按 `$obinit` 重复运行模式更新本仓库 `.agents/instructions.md`、`.agents/README.md` 与 `docs/README.md`（注：本仓库 `.agents/scratch/skillcheck/` 经核实为 2026-09-19 遗留的未跟踪临时文件 `clip-01..30.txt`，未被 `npm test` 引用且已超 14 天，自举收尾时列入清理候选经用户确认后删除）。
3. **下游项目收敛（后续独立批次或顺延执行）**：
   - `bn-alpha-bot`：运行 `$obinit` 重复运行对齐 `instructions.md:61`（去掉「待上游 skill 吸收后对齐」临时注记）与 `docs/README.md`；将 `.agents/scratch/1021-alpha123-quota/report.md`（补入那 6 行 `quota_auto_confirm_*` JSON 原始片段）与 `1021-value-window-forensics/report.md` 升档至 `docs/research/`，清理已完结的旧 `scratch` 目录，并将 `active.md`（18.3 KB）按 4 KB 规则折叠。
   - `flower-dashboard`：运行 `$obinit` 重复运行对齐 `instructions.md` 与 `docs/README.md`；将 `.agents/scratch/`（71 文件 / 6.41 MB）按四分法提炼升档后批量清退；同步将膨胀的 `active.md`（33.5 KB）折叠、`progress.md`（61.8 KB）归档。

---

## 6. 已拍板决策记录

| 拍板项 | 结论 | 来源 |
| :--- | :--- | :--- |
| `.agents/scratch/` 堆积的根因 | AI 因正式文档留有 `.agents/scratch/` 引用而不敢删；核心价值在于取证记录与可复现判据（如 `alpha123` 隐藏 JSON 字段与回测表）缺乏正式槽位 | 用户对话确认（2026-10-23） |
| 项目内成型研究/取证/回测报告的升档落点 | 升档至项目内 `docs/research/`（时点快照，不进 Obsidian 公共库，不逐篇塞入 `docs/README.md`） | 用户拍板 `research`（2026-10-23） |
| 收尾清理时机 | 两段式：当场收尾（`$obclose`）只做结论升档/内联与切断外链，默认保留本轮 `scratch/<MMDD>-<topic>/` 作近期热缓存；后续超限或点名时按子目录批量确认清理过时项 | 用户拍板「先不删，后续统一再清理过时的」（2026-10-23） |
| `skills/obinit/SKILL.md` 字数预算处理 | 实测 1997/2000 wordsish，本体净增 0 词，细则落入模板、`references/memory-bank.md`、`references/memory-upgrade.md` 与 `skills/obclose/SKILL.md` | 构建者按仓库先例（0.1.32 B1）裁定 |
| Memory 代际 | 维持 v3（0.1.34 同代际追加），不建 v4 | 构建者按 0.1.30 / 0.1.32 先例裁定 |
| `docs/README.md` 模板 vs 本仓库实例 | 模板只改第 12 行「时点快照」正文说明（不加表格行）；本仓库 `docs/README.md` 自举时同步更新第 12 行正文及第 24 行时点快照说明行 | Builder Check 审查后构建者裁定 |
| `$oblearn` 与 `docs/research/` 的关系 | `$oblearn` 不遍历 `docs/research/`；仅当 `active.md` / `progress.md` / `lessons.md` 指向具体报告或用户指定时按需读取，`oblearn/SKILL.md` 无需修改 | Builder Check 审查后构建者裁定 |
| 本仓库 `.agents/scratch/skillcheck/` 性质 | `git ls-files` 核实未入库、创建于 2026-09-19 且未被 `npm test` 引用，属超 14 天陈旧临时目录，自举收尾时按新规列入确认清理清单 | Builder Check 审查后构建者核实裁定 |

---

## 7. 留给实现计划（Builder）的细节

- `skills/obclose/SKILL.md` 中新规则是作为 `## Memory 维护` 的子段落还是独立 `## Scratch 淘金与延期清理` 小节（以行文自然与字节最省为准，只要满足 `validate-skills.mjs` 的 `requiredSkillConcepts.obclose` 断言）。
- 负向红灯验证在临时副本或工作树上逐条执行的脚本命令编排。
