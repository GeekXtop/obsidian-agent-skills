# 进展记录

本文件只记录阶段性进展摘要，不记录聊天流水。

## 2026-07-01 - obcurate Documents catalog 示例防复制

- 已完成：修正本次 `$obcurate` 结果，`Agent/Documents/_catalog.md` 的分组从 `Network` 改为 `网络 / Network`，目标文档 frontmatter 增加 `use_as: runbook` 和 `topic: [network, pve, immortalwrt, subnet-migration]`。
- 已完成：`skills/obcurate/SKILL.md` 将 Documents catalog 示例从固定 `## Network` 改为占位结构，明确展示分组名按用户或项目语言偏好、vault 既有风格和文档 topic 命名，不直接复制示例分组名。
- 已完成：`$obcurate` document 检查项纳入 `use_as` / `topic`，移动步骤补充“确认目标路径目录并先确保目标目录存在”。
- 已完成：`scripts/validate-skills.mjs` 增加 `$obcurate` Documents catalog 展示分组策略校验，防止示例重新退化为可复制默认值。
- 已验证：新增校验后先运行 `npm test` 得到目标红灯；补齐 skill 文案后 `npm test` 通过，输出 `All skills are valid.`；Obsidian 读回 catalog、`use_as`、`topic` 和 catalog link 均正常。
- 备注：本轮未改版本号，未提交未推送。

## 2026-07-01 - Knowledge 与 Documents 硬分流

- 已完成：将 `$oblearn` 固定为只写 `Agent/Knowledge/`，不稳定时进 `Agent/Knowledge/Inbox/`，并只维护 `Agent/Knowledge/_catalog.md`。
- 已完成：将 `$obdoc` 固定为只写 `Agent/Documents/`，不稳定时进 `Agent/Documents/Inbox/`，并只维护 `Agent/Documents/_catalog.md`；文档中的可复用经验候选继续建议后续 `$oblearn`。
- 已完成：`$obcurate` 默认可同时整理 `Agent/Knowledge/_catalog.md`、`Agent/Knowledge/Inbox/`、`Agent/Documents/_catalog.md`、`Agent/Documents/Inbox/`，也可按用户指定只整理 Knowledge 或 Documents。
- 已完成：去掉单独 Private 路径设计；敏感文档稳定归类到 `Agent/Documents/`，通过 `sensitivity` 和读取条件控制复用。
- 已完成：metadata 机器层保留英文 token，模板、整理计划和完成说明使用中文展示层。
- 已验证：先扩展 `scripts/validate-skills.mjs` 后运行 `npm test` 得到目标红灯；补齐 skill 文案、模板、README、命令和 manifest 后 `npm test` 通过，输出 `All skills are valid.`；`git diff --check` 无输出。

## 2026-07-01 - obcurate 批量整理策略

- 已完成：`$obcurate` 增加批量整理策略；处理多篇 Inbox 或 catalog 条目时先分组，不把低风险条目逐篇确认。
- 已完成：默认分组明确为稳定归类、保持 Inbox、建议私有化、需要人工判断；结构性修改优先按组确认，高风险例外逐项确认。
- 已完成：`skills/obcurate/templates/curation-plan.md` 增加批量分组和高风险例外区块，要求列数量、代表样例、共同理由、建议处理和确认方式。
- 已完成：`scripts/validate-skills.mjs` 增加 `$obcurate` 批量整理策略和 `curation-plan.md` 模板术语校验，防止回退到逐篇确认流程。
- 已验证：先运行 `npm test` 得到目标红灯，指出缺少 `批量整理`、`先分组`、`按组确认`、`不逐篇确认`、`需要人工判断`、`高风险例外` 和模板批量分组术语；补齐后 `npm test` 通过，输出 `All skills are valid.`。
- 已验证：`git diff --check` 无输出；旧文案搜索无命中。

## 2026-07-01 - 文档作为一等知识库产物

- 已完成：根据 PVE 项目既有指南形态，修正 `$obdoc` / `$obcurate` / catalog 使用语义：文档是一等知识库产物，面向人类实践的可读、可执行、可复盘和可迁移使用；短经验只是另一种更紧凑的知识产物。
- 已完成：`$obdoc` 明确文档可保留经过确认和脱敏的当前环境值、验证证据和回滚信息；复用方式是理解上下文并替换本地参数，不把正文里的当前环境值直接泛化成公共规则。
- 已完成：`$obcurate` 将 Inbox 处理语义从“晋升”改为“稳定归类”；敏感但稳定的 document 应有稳定路径和明确 `sensitivity`，`Inbox/` 不是敏感文档长期归档。
- 已完成：`$obinit`、生成模板和 `references/obsidian-sync.md` 同步 catalog 命中后的新使用语义；`skills/obcurate/templates/catalog-entry.md` 的 `use_as` 示例加入 `guide` / `runbook`。
- 已验证：先扩展 `scripts/validate-skills.mjs` 后运行 `npm test` 得到目标红灯；补齐文案和模板后 `npm test` 通过，输出 `All skills are valid.`。

## 2026-07-01 - Obsidian 公共知识 catalog 整理

- 已完成：按 `$obcurate` 整理 `Agent/Knowledge/` 中“Agent 工作流经验”相关主题，将其重命名并收窄为 `[[计划文档 checklist 收尾规则]]`。
- 已完成：移除“公共知识写入后要登记 catalog”经验段落；该行为已由 `$oblearn` / README 规则承载，不再作为并行公共经验维护。
- 已完成：`Agent/Knowledge/_catalog.md` 补齐现有入口的 `kind` / `use_as`，将 `agent-workflow` 改为 `plan-checklist-closure`，并移除含内网拓扑的 PVE document catalog 入口。
- 已完成：将 `[[Marketplace 插件更新流程]]` 和 `[[Skill 行为规则使用正向 contract]]` 从 Inbox 移入稳定路径；当时保留 PVE 文档在 Inbox，后续已在“文档作为一等知识库产物”语义修正中明确这不是敏感稳定文档的长期策略。
- 已验证：`rg` 检查旧小节标题、旧 `[[Agent 工作流经验]]` wikilink 和 PVE catalog 入口无残留；Obsidian 成功读回 catalog，`[[计划文档 checklist 收尾规则]]` backlinks 指向 catalog、相关知识和项目笔记。

## 2026-07-01 - memory 权威状态载体边界

- 已完成：将 release 专用 memory 边界推广为通用“权威状态载体”规则，覆盖 git commit、tag、PR、CI/CD、release、artifact、ADR、migration、issue/ticket、runbook。
- 已完成：`.agents/instructions.md`、`$obinit` 模板/参考和 `$obclose` 统一约定：权威载体已记录的状态不再写短暂中间态；memory 只补下一次 agent 需要接手的载体外信息、阻塞、人工确认点或可复用经验。
- 已完成：`scripts/validate-skills.mjs` 从 release workflow 校验改为 authoritative state carrier memory boundary 校验。
- 已验证：`npm test` 通过，输出 `All skills are valid.`。

## 2026-07-27 - 经验验证生命周期落地

- 已完成：按 `docs/superpowers/plans/2026-07-27-experience-verification-lifecycle.md`（spec：`docs/superpowers/specs/2026-07-27-experience-verification-lifecycle-design.md`）完成 Task 1-5，给 lessons 和公共知识补齐“验证方式：/最后验证：/状态：”经验生命周期字段。
- 已完成：lessons 模板字段升级，`下次检查` → `验证方式：`/`最后验证：`/`状态：`（`skills/obclose/templates/lesson-entry.md`、`skills/obinit/templates/lessons.md`，提交 `0b210fc`）。
- 已完成：`$obclose` 新增 `## 经验验证` 节，收尾时只验本次相关 lessons 条目、按证据强度分级标注（待复核 `needs-review` / 已退役 `deprecated`）、回写本次使用过公共知识的 `last_verified`（提交 `75edbae`）。
- 已完成：`$obinit` 生成物（`instructions.md`、`instructions-index.md`、`memory-bank.md`、`obsidian-sync.md`）加入“使用中证伪”协议，根 `.agents/instructions.md` 同步；`skills/obinit/SKILL.md` 因 2000-wordsish 上限本轮未改（提交 `72684af`）。
- 已完成：`$oblearn` 新增 `## 知识生命周期` 节和模板 frontmatter `last_verified`，明确不重新提取已退役同结论的知识（提交 `cac3167`）。
- 已完成：`$obcurate` 新增 `## 经验复查与退役` 节和复查候选分组（180 天建议阈值，时间流逝本身不是证伪证据）（提交 `83d1e8f`）。
- 已完成：`scripts/validate-skills.mjs` 对以上全部新增防回归校验；每个任务均遵循 validator-first TDD（RED → 内容 → GREEN），逐任务证据记录在本机 `.superpowers/sdd/2026-07-27-experience-verification-lifecycle/task-{1..5}-report.md`（git-ignored，仅本机可见）；git 内证据为对应实现提交。
- 已验证：Task 6 终检 `npm test` 输出 `All skills are valid.`；`grep -rn "下次检查" skills/` 只命中 `skills/obclose/SKILL.md:131` 兼容规则一处，无需修复；`git diff --check` 无输出；`git log --oneline -8` 确认六个实现提交（`0b210fc`/`75edbae`/`72684af`/`cac3167`/`83d1e8f`）与 Task 0 提交 `aa07af5` 均存在。
- 已验证：按计划 Global Constraints 的“历史条目不批量迁移”要求复核 `.agents/lessons.md`：全部 9 条历史 `下次检查` 条目保持原样，与 `git show 83d1e8f:.agents/lessons.md` 逐字节一致；只有新增的 2026-07-27 条目使用新字段（`验证方式`/`最后验证`）。历史条目不在本计划内批量迁移，后续由 `$obclose` 会话按兼容规则在真正被验证或修改时逐条顺手升级。
- 备注：本轮未改版本号，未推送（本地 `main` 领先 `origin/main`）；下一步等用户决定是否发版。任务详情记录在本机 `.superpowers/sdd/2026-07-27-experience-verification-lifecycle/`（含 task-0..6 brief/report，git-ignored，仅本机可见）。

## 2026-08-08 - Obsidian vault 文件写入契约

- 已卸载：Codex 与 Claude Code 的第三方 `obsidian@obsidian-skills` 插件和 `obsidian-skills` marketplace；清理 Codex 早期独立安装的 `defuddle`、`json-canvas`、`obsidian-bases`、`obsidian-cli`、`obsidian-markdown`，以及 Claude Code/Codex 残留缓存目录。
- 已修复：`$obinit`、`$oblearn`、`$obdoc`、`$obcurate`、`$obclose` 统一采用 vault 本地文件系统完成所有 Markdown mutation；CLI 只用于 vault 定位、有限搜索、读取和写入后读回，无法解析路径时要求用户提供或确认。
- 已防回归：`scripts/validate-skills.mjs` 新增 `obsidianVaultFilesystemMutationContract`，统一覆盖五个写 vault 的 skill、`obinit/references/obsidian-sync.md` 和 README。
- 已验证：修改 validator 后 `npm test` 先按预期报告五个 skill/reference/README 缺契约；补齐内容后恢复 `All skills are valid.`。`skills/obinit/SKILL.md` 正文 wordsish 为 1998，未突破 2000 上限。
- 文档：spec 为 `docs/superpowers/specs/2026-08-08-obsidian-filesystem-write-contract-design.md`，plan 为 `docs/superpowers/plans/2026-08-08-obsidian-filesystem-write-contract.md`。
- 发布与本地更新：遵循 `docs/adr/0001-use-marketplace-plugin-update-flow.md`，发布状态以 git commit/tag 为准，本地安装状态以两端 `plugin list --json` 为准；更新后需重启或开启新会话加载新 skill。

## 2026-09-09 - validator 门禁与 skill 契约三批整改

- 已完成：validator 新增引用存在性、命令→skill、README 表格、manifest `metadata.version`、description 语义、运行时假设、长度预算、枚举封闭、模板对齐、写前重读和可执行回退断言，并输出失败计数与 scope 汇总。
- 已完成：6 个 skill 补齐 `## 运行时假设`，覆盖 Obsidian CLI 不可用、非 git 项目、vault 路径无法解析时的行为；vault 写入契约统一加写前重读与冲突检测。
- 已完成：obinit 项目相关知识回写下沉到 `references/obsidian-sync.md` 并迁移断言目标；obadr progress 模板统一为五段式；obdoc 新增 `templates/documents-catalog-entry.md` 并指向唯一 catalog 格式；obcurate 新增 `## 机器层枚举` 与 `Agent/Archive/YYYY-MM-DD/` 回退；oblearn 模板 `last_verified` 不再预填、工作流补读回。
- 已验证：`npm test` 输出 `All skills are valid. (6 skills checked)`；14 个破坏实验在临时副本上全部红灯。
- 已变更：`scripts/validate-skills.mjs`、6 个 `SKILL.md`、`skills/obinit/references/obsidian-sync.md`、`skills/obinit/templates/active.md`、`skills/obadr/templates/progress-entry.md`、`skills/oblearn/templates/public-knowledge-note.md`、`skills/obdoc/templates/documents-catalog-entry.md`（新增）、`skills.json`、`README.md`。
- 下一步：用户 review 后决定提交与发版。
- 备注：未提交、未推送、未发版；README / commands / skills.json 的描述长度差异有意保留摘要定位。

## 2026-09-09 - 多会话并行机制化与普适性清理

- 已完成：新增 `.agents/handoffs/` 每会话交接机制（模板、命名 `YYYY-MM-DD_HHMMSS_<agent>_<任务slug>.md`、生命周期、12 小时新鲜度、独立上限），`active.md` 降级为可从 handoffs、`docs/adr/` 和项目笔记重建的派生视图，并写明「可重建、不含孤本」不变量。
- 已完成：progress 条目新增 `来源：<agent>/<任务 slug>` 归因；`$obclose` 收尾输出 memory 占用；obinit 两个 instructions 模板新增空「协作策略」占位节，任务开始的认领动作改为创建 handoff。
- 已完成：普适性回溯清理——移除 `docs/superpowers/` 硬编码（改为发现并遵守项目既有结构）、会话记录抽象为通用能力（Codex 降级为示例）、`inspect-project.mjs` 输出 `docs/` 顶层结构、新增禁硬编码工具路径与策略词的断言。
- 已验证：`npm test` 输出 `All skills are valid. (6 skills checked)`；7 个新断言在临时副本上全部红灯。
- 已变更：`scripts/validate-skills.mjs`、`skills/obclose/*`、`skills/obinit/*`、`skills/oblearn/SKILL.md`、`skills/obdoc/SKILL.md`、`skills/obadr/templates/progress-entry.md`、`.agents/instructions.md`。
- 下一步：用户 review 后决定提交与发版；观察 handoffs 阈值是否合适。
- 备注：未提交、未推送、未发版；既有 `docs/superpowers/` 结构保持不变。
- 来源：dsh/multi-session-memory-and-generality

## 2026-09-09 - 存量项目迁移机制（Task 7）

- 已完成：新增 `skills/obinit/references/memory-upgrade.md`——memory 代际（v1 ≤ 0.1.27 / v2 = 0.1.28）、差异检测粒度（章节级 + 变更条目，措辞差异仅参考）、执行主体（agent 报告、用户确认）、验证方式（迁移后差异为空）、v1 → v2 清单（必做 4 / 可选 2 / 不做 2）。
- 已完成：`obinit/SKILL.md` 加薄指针、`init-modes.md` 重复运行模式引用清单、validator 增加三处断言。
- 已验证：`npm test` 输出 `All skills are valid. (6 skills checked)`；本仓库端到端对比差异归零。
- 已变更：`skills/obinit/references/memory-upgrade.md`（新增）、`skills/obinit/SKILL.md`、`skills/obinit/references/init-modes.md`、`scripts/validate-skills.mjs`、`.agents/instructions.md`。
- 下一步：用户 review 后决定提交与发版；发版前确认迁移机制与批次二同版本发布。
- 备注：未提交、未推送、未发版；代际标记推迟到 v2 → v3。
- 来源：dsh/multi-session-memory-and-generality

## 2026-09-11 - 通用自举门禁与仓库自身 v2 收敛

- 已完成：`.agents/instructions.md` 新增「自举门禁」节——声明当前 memory 代际 v2（对应插件 `0.1.28` 及以上），用行为探针判定执行者版本（加载到的 `$obclose` 正文缺 `## handoffs 目录`、或 `$obinit` 正文缺 `references/memory-upgrade.md` 指针即判定过旧），过旧时只读不写 `.agents/`，恢复路径指向 ADR 0001。
- 已完成：补齐本仓库自身 v1 → v2 迁移——创建 `.agents/handoffs/` 并接入首份交接记录、`.agents/active.md` 补派生视图声明与 `## 已提取知识` 节、`.agents/README.md` 记忆库索引补 `handoffs/` 与派生视图说明。
- 已完成：`scripts/validate-skills.mjs` 新增自举 scope——门禁四要素、obclose 探针章节标题、active 派生声明、README 记忆库索引两项、`handoffs/` 目录存在、progress 末条 `来源` 行，让仓库自身 memory 也进 `npm test` 门禁。
- 已验证：`npm test` 输出 `All skills are valid. (6 skills checked)`；9 条新断言在临时副本上逐条红灯（门禁标题、版本下限、探针术语、obclose 章节改名、派生声明、README 两项、删 `handoffs/` 目录、末条来源行）。
- 已变更：`.agents/instructions.md`、`.agents/README.md`、`.agents/active.md`、`.agents/handoffs/`（新增）、`scripts/validate-skills.mjs`。
- 下一步：产品侧评估是否把自举门禁下沉到 `skills/obinit/templates/instructions.md`，让 obinit 生成的项目同样带版本门禁（属产品改动，需发版）；另核对 `skills/obinit/templates/active.md` 与 `skills/obclose/templates/active.md` 的章节集不一致问题。
- 备注：未提交、未发版。
- 来源：dsh/self-hosting-gate

## 2026-09-11 - 统一 active.md 章节集

- 已完成：`skills/obinit/templates/active.md` 移除独立的 `## Obsidian` 节，项目笔记路径并入 `## 已提取知识`，与 `skills/obclose/templates/active.md` 以及 obclose 的段落归属（已提取知识 = 指向 Obsidian 项目笔记的链接视图）对齐。
- 已完成：`scripts/validate-skills.mjs` 增加共享章节契约断言——两个 `active.md` 模板的 `## ` 章节序列必须一致（以 obclose 为基准），且本仓库 `.agents/active.md` 的章节集必须等于发布模板。
- 已完成：本仓库 `.agents/active.md` 同步去重，项目笔记路径并入 `## 已提取知识`。
- 已验证：`npm test` 输出 `All skills are valid. (6 skills checked)`；4 条新断言在临时副本上逐条红灯（obinit 模板加回 `## Obsidian`、obclose 模板改章节名、仓库实例多出 `## Obsidian`、仓库实例丢掉 `## 验证`）。
- 已变更：`skills/obinit/templates/active.md`、`scripts/validate-skills.mjs`、`.agents/active.md`。
- 下一步：属产品改动，需随下一版发布（0.1.29 候选）；发版说明记录「active.md 不再有独立 `## Obsidian` 节」。这是同代际内的兼容调整，不改变 memory 代际，不要求存量项目迁移。
- 备注：未提交、未发版；连同上一轮自举门禁改动一起待 review。
- 来源：dsh/active-section-set

## 2026-09-11 - 文档地图契约与 memory 代际 v3

- 已完成：新增 `skills/obinit/templates/docs-readme.md`——`docs/README.md` 文档地图模板与维护规则。形态为三列反查表「文档 / 事实范围 / 同步触发」，只收**当前状态**文档与 `docs/adr/`，明写设计稿、实施计划这类**时点快照不入表**；定位粒度要求到「文件名 + 节标题」，能写行号就写行号。
- 已完成：`templates/instructions.md` 与 `templates/instructions-index.md` 各新增 `## 文档地图` 节（纯新增，未改动既有行）——声明 `docs/README.md` 是事实源地图、改行为前先读地图、改动与文档同批提交、**写实施计划时把受影响文档的节标题写进每个任务的改动点**、文档增删改名时同批更新地图、时点快照不入表。
- 已完成：`obinit/SKILL.md`——allowlist 加 `docs/README.md`（最窄写法，未触发「必须用更窄的 `docs/adr/` 初始化范围」断言）、Memory Bank 文件树与更新时机补建图要求、Obsidian 同步节声明地图不写进 vault、模板表加 `docs-readme.md`。
- 已完成：`references/memory-upgrade.md` 推进到 **v3（0.1.29）**——代际表加一行，新增 v2 → v3 迁移清单（必做 4 / 可选 1 / 不做 2），并兑现原先推迟的「有意保留」持久化记录（改由文档地图的维护规则承载）。
- 已完成：`scripts/validate-skills.mjs` 新增 `requiredDocMapTerms`、`requiredDocsReadmeTerms` 与三条断言（两个指令模板含文档地图节术语、`docs-readme.md` 含表结构术语、模板文件存在），并把 `v2 → v3` 纳入 memory-upgrade 概念断言。
- 已完成：`README.md` 的 `$obinit` 模式说明补文档地图条目（两种建立模式、空行待补、已有文件先读回再合并不覆盖）。
- 已验证：`npm test` 输出 `All skills are valid. (6 skills checked)`；负向验证两条新断言逐条红灯（删 `docs-readme.md` 的「同步触发」、把 `instructions.md` 的 `## 文档地图` 改名），恢复后全绿。模板 diff 为纯新增（两模板各 8 增 0 删）。
- 已变更：`skills/obinit/templates/docs-readme.md`（新增）、`skills/obinit/templates/instructions.md`、`skills/obinit/templates/instructions-index.md`、`skills/obinit/references/memory-upgrade.md`、`skills/obinit/SKILL.md`、`scripts/validate-skills.mjs`、`README.md`、`docs/README.md`（新增）。
- 下一步：随 0.1.29 发布，发版说明记录 memory 代际 v3；发布并 reload 后推进 `.agents/instructions.md` 的自举门禁代际标记到 v3 / `0.1.29`。
- 备注：自举门禁代际标记**刻意保持 v2 / `0.1.28`**——0.1.29 发布前不存在 v3 执行者，提前推进会让门禁宣称的代际高于执行者实际契约（见 `lessons.md` 关于「仓库无法决定执行者插件版本」的教训）。
- 来源：dsh/doc-map-contract

## 2026-09-11 - memory 体积预算与读取分级

- 已完成：`obinit/references/memory-bank.md` 新增「体积与读取成本」节——按读取方式分两类：每次必读的文件（`.agents/instructions.md` 硬预算 8 KB、`docs/README.md` 软约束 4 KB、`active.md` 快照不留历史）与按需读取的文件（`progress.md` / `lessons.md` 用 grep 定位，不整篇读入）；并写明代际推进往里加节时必须同时压缩已成为存量稳定态的旧节，否则预算在下一次代际推进时失效。
- 已完成：`obclose/SKILL.md` 的「Memory 维护」加读取分级段，检查清单补 `instructions.md` 8 KB 与文档地图 4 KB 两项；并把原「新增经验是否和已有条目明显重复」改为「用 grep 定位同主题条目后比对」，消除与新读取规则的自相矛盾。
- 已完成：`obinit/templates/instructions.md`、`instructions-index.md`、`docs-readme.md` 与 `.agents/instructions.md`、`docs/README.md` 各补体积预算声明与分工说明。
- 已完成：`scripts/validate-skills.mjs` 新增 `assertByteBudget` 与两种阈值——`instructions.md` 硬预算 8 KB（仓库实例 + 两个指令模板），文档地图 3 KB→**4 KB** 软约束配 6 KB 硬上限；另加「仓库实例与两个发布模板必须声明同一套预算」的跨仓库一致性断言。
- 已验证：`npm test` 输出 `All skills are valid. (6 skills checked)`；三条新断言在临时副本上逐条红灯——仓库 `instructions.md` 超 8 KB、`docs/README.md` 超 6 KB、`instructions-index.md` 删掉「4 KB」（后者同时触发模板断言与跨仓库一致性断言，共 3 条报错）。
- 已变更：`skills/obinit/references/memory-bank.md`、`skills/obclose/SKILL.md`、`skills/obinit/templates/docs-readme.md`、`skills/obinit/templates/instructions.md`、`skills/obinit/templates/instructions-index.md`、`scripts/validate-skills.mjs`、`.agents/instructions.md`、`docs/README.md`。
- 下一步：`progress.md` 归档与压缩未执行（见 `active.md` 下一步）。
- 备注：地图软约束原定 3 KB，实测标定偏低——发出的模板实例 2.0 KB、本仓库实例 3.5 KB、按 8 条目估算约 3.6 KB，三个数据点都贴近或超过 3 KB，故上调为 4 KB。改指导值而不是扭曲地图。
- 来源：dsh/memory-budget

## 2026-09-11 - progress 追加顺序契约与归档

- 已完成：查明 `progress.md` 排序混乱的根因——`templates/progress.md` 以一个条目开头（暗示新建项在顶部），但没有任何地方规定下一条追加在哪。三个真实项目的实测形态一致：obsidian-agent-skills（39 条）与 bn-alpha-bot（5 条）都是「开头一段倒序积压 + 其后升序」，**bn-alpha-bot 只跨 5 天也照样错**，说明缺口从一开始就存在，不是老文件积累的历史；ClashRouteKit（17 条）完全升序，是正确形态的样板。
- 已完成：三处规则落定——`templates/progress.md` 与 `obclose` 的「progress.md 写法」写明「新条目追加到文件末尾、按时间升序、不插中部不放顶部」；`memory-upgrade.md` 的 v2 → v3 清单加可选第 6 条（存在排序不同区块时按连续区块整体移出，归档文件内部按时间升序排列，不把倒序区块原样复制进新文件）；`obclose` 的 Memory 维护写明归档也按升序。
- 已完成：validator 新增 `requiredProgressOrderingTerms` 与两处断言（`obinit/templates/progress.md`、`obclose/SKILL.md`），把追加位置固定成契约。
- 已完成：本仓库自身归档——建立 `.agents/archive/`，把最旧的 24 条（2026-06-23 → 2026-06-30）移入 `.agents/archive/progress-2026-06.md`，按时间升序重排；现行 `progress.md` 保留最近 15 条（2026-07-01 → 2026-09-11）。
- 已验证：`npm test` 输出 `All skills are valid. (6 skills checked)`；两条新断言在临时副本上逐条红灯（删模板的「追加到文件末尾」、删 obclose 的「时间升序」），恢复后全绿。
- 已验证（归档）：条目守恒 24 + 15 = 39（原 39）；两个文件日期序列均无倒退；无同日条目被拆到两边（现行 7/01 起、归档 6/30 止）；合计 47,322 B vs 原件 47,094 B（差 228 B 全是归档头与条目间空行）；抽样条目在归档中逐字保留。`progress.md` 由 47,094 B（92.0%）降至 23,419 B（45.7%）。
- 已变更：`skills/obinit/templates/progress.md`、`skills/obclose/SKILL.md`、`skills/obinit/references/memory-upgrade.md`、`scripts/validate-skills.mjs`、`.agents/progress.md`、`.agents/archive/progress-2026-06.md`（新增）。
- 下一步：对 bn-alpha-bot 与 ClashRouteKit 各重跑一次 `$obinit`（重复运行模式），一次收敛 v0.1.30 的体积预算与读取分级、以及本版的追加顺序规则。
- 备注：归档切点用业务判据（保留最近的条目、移出最旧的）而非结构判据——该文件历史形态为「头部含最新、尾部含最旧、中间另有局部升序」，靠「找第一个递增处」会切错边（实测先切出 3 条、再切出 8 条且把最新条目移走）。切点另对齐到日期边界，避免同一日期在两边各留一半。
- 来源：dsh/progress-ordering
