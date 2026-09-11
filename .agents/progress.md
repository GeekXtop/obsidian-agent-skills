# 进展记录

本文件只记录阶段性进展摘要，不记录聊天流水。

## 2026-08-08 - Obsidian vault 文件写入契约

- 已卸载：Codex 与 Claude Code 的第三方 `obsidian@obsidian-skills` 插件和 `obsidian-skills` marketplace；清理 Codex 早期独立安装的 `defuddle`、`json-canvas`、`obsidian-bases`、`obsidian-cli`、`obsidian-markdown`，以及 Claude Code/Codex 残留缓存目录。
- 已修复：`$obinit`、`$oblearn`、`$obdoc`、`$obcurate`、`$obclose` 统一采用 vault 本地文件系统完成所有 Markdown mutation；CLI 只用于 vault 定位、有限搜索、读取和写入后读回，无法解析路径时要求用户提供或确认。
- 已防回归：`scripts/validate-skills.mjs` 新增 `obsidianVaultFilesystemMutationContract`，统一覆盖五个写 vault 的 skill、`obinit/references/obsidian-sync.md` 和 README。
- 已验证：修改 validator 后 `npm test` 先按预期报告五个 skill/reference/README 缺契约；补齐内容后恢复 `All skills are valid.`。`skills/obinit/SKILL.md` 正文 wordsish 为 1998，未突破 2000 上限。
- 文档：spec 为 `docs/superpowers/specs/2026-08-08-obsidian-filesystem-write-contract-design.md`，plan 为 `docs/superpowers/plans/2026-08-08-obsidian-filesystem-write-contract.md`。
- 发布与本地更新：遵循 `docs/adr/0001-use-marketplace-plugin-update-flow.md`，发布状态以 git commit/tag 为准，本地安装状态以两端 `plugin list --json` 为准；更新后需重启或开启新会话加载新 skill。

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

## 2026-06-23 - 项目初始化

- 已完成：创建 `.agents/` memory 结构和 `docs/adr/` 入口；保留既有 `AGENTS.md` / `CLAUDE.md` 并追加 memory 指针。
- 已验证：`npm test` 通过，输出 `All skills are valid.`。
- 下一步：在后续任务开始或收尾时更新 `.agents/active.md`。

## 2026-06-25 - 公共知识边界调整

- 已完成：新增 `$obcurate` skill，负责整理 `Agent/Knowledge/`、清理 Inbox、维护 `_catalog.md`、合并/拆分/重命名知识笔记。
- 已完成：收窄 `$oblearn` 职责，只负责提取、脱敏、追加/新建公共知识，并在关键词明确时更新 `_catalog.md`。
- 已完成：更新 `$obinit` 生成规则，公共知识检索不再凭空假设领域，优先以 `Agent/Knowledge/_catalog.md` 为事实来源。
- 已验证：`npm test` 通过，输出 `All skills are valid.`。

## 2026-06-25 - 插件更新流程 ADR

- ADR：新增 `docs/adr/0001-use-marketplace-plugin-update-flow.md`，记录本地插件更新必须走 marketplace/plugin 管理器，并在更新后 reload、重启或开启新会话。
- 已完成：README 增加 Obsidian 使用前提、Codex / Claude Code 插件更新命令和版本验证命令。
- 已提取：公共知识 `[[Marketplace 插件更新流程]]` 写入 `Agent/Knowledge/Inbox/`，并登记到 `Agent/Knowledge/_catalog.md`。

## 2026-06-26 - 发布 tag 约定

- 已完成：README 和插件更新流程 ADR 记录后续发版只创建 `obsidian-agent-skills--vX.Y.Z`，不再额外创建平行的 `vX.Y.Z` tag。
- 已保留：历史 `v0.1.x` tag 不主动删除，避免影响已发布引用。
- 已验证：`npm test` 通过，输出 `All skills are valid.`。

## 2026-06-27 - obclose 主动收尾与 memory 膨胀控制

- 已完成：`$obclose` 增加主动触发规则，明确 agent 在完成实质代码/文档改动、阶段性验证、复杂任务暂停或发现项目内可复用经验时应主动收尾。
- 已完成：`$obclose` 增加跳过条件，轻量问答、无项目状态变化或用户明确要求不更新 memory 时不执行。
- 已完成：`$obclose` 增加项目 memory 维护规则，检查 `progress.md` / `lessons.md` 是否过长或重复；轻量合并、压缩和归档可直接做，拆分 lessons、删除历史、大规模重组需用户确认。
- 已保留：公共知识提取仍由 `$oblearn` 负责，公共知识库整理仍由 `$obcurate` 负责。
- 已验证：目标文本断言通过；`npm test` 通过，输出 `All skills are valid.`。

## 2026-06-27 - 五个 skill 职责边界同步

- 已完成：`$obclose` 的主动收尾和 memory 膨胀控制语义同步到 `README.md`、`skills.json` 和 `skills/obclose/agents/openai.yaml`。
- 已完成：`$obinit` 的 memory 规则和模板补充 `.agents/archive/`，明确它保存过长 `progress.md` 的历史归档，应提交，不同于 `scratch/`。
- 已完成：`$oblearn` 触发描述从“任务完成后记录踩坑”收窄为“把已记录的项目经验转成跨项目公共知识”，避免抢 `$obclose` 的项目内收尾职责。
- 已完成：`$oblearn` 输入范围补充 `.agents/archive/progress-YYYY.md`，仅在当前材料指向归档、用户要求长期复盘或候选知识需要旧阶段证据时读取相关归档。
- 已验证：目标文本断言通过；旧触发词 `任务完成后记录踩坑` / `记录踩坑` 无命中；`npm test` 通过，输出 `All skills are valid.`。

## 2026-06-27 - 0.1.19 发版准备

- 已完成：版本号推进到 `0.1.19`，同步 `package.json`、`skills.json`、`.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json`、`.codex-plugin/plugin.json`。
- 已完成：`.codex-plugin/plugin.json` 的 `$obclose` 默认 prompt 更新为收尾、更新 memory 并检查 `progress/lessons` 轻量维护。
- 已验证：`npm test` 通过，输出 `All skills are valid.`。

## 2026-06-27 - 0.1.19 发布与本地更新

- 已发布：提交 `ffbe90b Release v0.1.19` 已推送到 `origin/main`。
- 已发布：按 ADR 只创建并推送插件 tag `obsidian-agent-skills--v0.1.19`，未创建平行 `v0.1.19`。
- 已更新：Codex marketplace 已 upgrade，并通过 `codex plugin add obsidian-agent-skills@obsidian-agent-skills` 安装到 `0.1.19`。
- 已更新：Claude Code marketplace 已 update，并通过 `claude plugin update obsidian-agent-skills@obsidian-agent-skills --scope user` 从 `0.1.18` 更新到 `0.1.19`。
- 已验证：`codex plugin list --json` 与 `claude plugin list --json` 均显示 `obsidian-agent-skills@obsidian-agent-skills` 版本 `0.1.19`。
- 注意：Claude Code 提示需要 restart 才能应用；Codex 也需要重启或开启新会话加载新 skill。

## 2026-06-27 - obadr 历史材料读取边界

- 已完成：`$obadr` 新增“历史材料读取”小节，明确历史材料只用于避免重复 ADR 或补足当前决策背景。
- 已完成：`$obadr` 明确默认读取 `.agents/active.md`、必要的 `.agents/progress.md`、`docs/adr/` 索引/标题/相关 ADR。
- 已完成：`$obadr` 明确只有用户指定、当前 memory/ADR 明确链接、或当前决策依赖历史阶段证据时，才读取额外历史材料。
- 已完成：`$obadr` 明确禁止全量扫描 `.agents/archive/`、全量读取历史 `progress`、为找灵感遍历 `docs/`、把历史计划/进展/ADR 原文复制进新 ADR。
- 已验证：目标文本断言通过；`npm test` 通过，输出 `All skills are valid.`。
- 备注：按用户要求，本轮只改文档，不发版。

## 2026-06-27 - oblearn 非项目临时会话模式

- 已完成：`$oblearn` 支持从非项目临时会话提取可复用经验；当前目录没有项目 memory 或用户明确要求从当前对话、粘贴 transcript、临时任务摘要、Codex session id 提取经验时，不要求先 `$obinit`。
- 已完成：`$oblearn` 模式选择改为显式非项目材料优先；用户提供临时会话摘要、transcript、Codex session id 或指定非项目材料时，即使当前目录存在项目 memory，也按非项目临时会话模式处理。
- 已完成：`$oblearn` 非项目模式只使用当前对话、用户提供摘要、transcript、明确指定材料，或能精确定位的 Codex session JSONL；无法定位历史 Codex app 对话时要求用户补充关键事实。
- 已完成：`$oblearn` 支持用户提供 Codex session id 后，在 `$CODEX_HOME/session_index.jsonl`、`$CODEX_HOME/sessions/`、`$CODEX_HOME/archived_sessions/` 做完整 ID fixed-string 精确查找；未设置 `$CODEX_HOME` 时使用用户主目录下的 `.codex`，Windows 通常是 `%USERPROFILE%\.codex`，macOS/Linux 通常是 `~/.codex`。
- 已完成：`$oblearn` 明确不使用 `codex resume <id>` 读取 transcript；只命中其他会话的 `forked_from_id` 时不等于找到目标 transcript。
- 已完成：`$oblearn` 非项目模式默认建议写入 `Agent/Knowledge/Inbox/`，不创建 `.agents/`、`docs/adr/`、项目 Obsidian 笔记或项目 memory。
- 已完成：`$oblearn` 非项目模式的主题命名改为从候选知识核心适用范围提炼，使用平台、技术栈、命令、错误类型、风险类型或工作流类型等真实信号，避免把说明性示例、会话背景或临时任务外壳当成固定分类。
- 已完成：`$oblearn` 非项目模式仍使用 `_catalog.md` 和关键词定向搜索，不全 vault 扫描，并要求脱敏本机路径、隐私、secret、账号等信息。
- 已完成：同步更新 `commands/oblearn.md`、`README.md`、`skills.json`、`skills/oblearn/agents/openai.yaml`、`.codex-plugin/plugin.json`。
- 已验证：非项目模式和 session ID 目标文本断言通过；`npm test` 通过，输出 `All skills are valid.`。
- 备注：按用户要求，本轮只改文档，不发版。

## 2026-06-27 - 0.1.20 发版准备

- 已完成：版本号推进到 `0.1.20`，同步 `package.json`、`skills.json`、`.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json`、`.codex-plugin/plugin.json`。
- 已包含：`$obadr` 历史材料读取边界、`$oblearn` 非项目临时会话模式、Codex session id 精确查找、显式非项目材料优先和跨平台 Codex home 路径说明。
- 已同步：`commands/oblearn.md`、`README.md`、`skills/oblearn/agents/openai.yaml`、`.codex-plugin/plugin.json` 的 `$oblearn` 发现层说明。
- 已验证：版本一致性检查通过；`npm test` 通过，输出 `All skills are valid.`。

## 2026-06-27 - 0.1.20 发布与本地更新

- 已发布：提交 `3786dc2 Release v0.1.20` 已推送到 `origin/main`。
- 已发布：按 ADR 只创建并推送插件 tag `obsidian-agent-skills--v0.1.20`，未创建平行 `v0.1.20`。
- 已更新：Codex marketplace 已 upgrade，并通过 `codex plugin add obsidian-agent-skills@obsidian-agent-skills` 安装到 `0.1.20`。
- 已更新：Claude Code marketplace 已 update，并通过 `claude plugin update obsidian-agent-skills@obsidian-agent-skills --scope user` 从 `0.1.19` 更新到 `0.1.20`。
- 已验证：`codex plugin list --json` 与 `claude plugin list --json` 均显示 `obsidian-agent-skills@obsidian-agent-skills` 版本 `0.1.20`。
- 注意：Claude Code 提示需要 restart 才能应用；Codex 也需要重启或开启新会话加载新 skill。

## 2026-06-28 - 发现层与校验脚本质量修复

- 已完成：`scripts/validate-skills.mjs` 增加 `agents/openai.yaml` 内容校验（`interface` 块 + `display_name` / `short_description` / `default_prompt` 非空），补上 README 声称但原先缺失的 OpenAI agent metadata 检查。
- 已完成：`skills/obadr/SKILL.md` frontmatter 补“回写项目 memory 的 ADR 链接”，与 `skills.json` 对齐（obadr 正文确实回写 active/progress）。
- 已完成：`README.md` 开发章节说明 `.codex-plugin` 显式 `skills` 字段与 `.claude-plugin` 约定式发现的差异。
- 已验证：红灯/绿灯断言通过；`npm test` 通过，输出 `All skills are valid.`。
- 备注：本轮只改文档与校验脚本，未改版本号，未提交未推送，等用户决定是否发版。

## 2026-06-30 - 新增 obdoc 文档提取 skill

- 已完成：新增 `$obdoc` skill，负责把当前对话、粘贴材料、本地文件或 Codex session 整理成 Obsidian 文档型输出，包括配置文档、教程、runbook、迁移指南和排障记录。
- 已完成：明确 `$obdoc` 与 `$oblearn` 分工：`obdoc` 生成可独立阅读的长文档，`oblearn` 生成短经验条目；`obdoc` 只列“可提取知识候选”，不自动混写公共知识条目。
- 已完成：新增 `document-note.md`、`source-evidence.md` 模板，新增 `commands/obdoc.md` 和 `skills/obdoc/agents/openai.yaml`。
- 已完成：同步更新 `skills.json` 和 `README.md`，插件说明从五个 skills 改为六个 skills。
- 已完成：`scripts/validate-skills.mjs` 增加必备 skill 名称检查和 `obdoc` 关键概念断言。
- 已验证：先运行 `npm test` 得到缺少 `obdoc` 的红灯；补齐后 `npm test` 通过，输出 `All skills are valid.`。
- 备注：本轮未改版本号，未提交未推送。

## 2026-06-30 - obdoc 输出目标改为候选路径

- 已完成：根据用户反馈，移除 `$obdoc` 中按文档类型固定目录的“选择规则”，改为“候选路径示例，不是选择规则”。
- 已完成：`$obdoc` 现在明确用户指定路径、已有命中文档和 vault 既有结构优先；主题、脱敏或分类不明确时才建议 `Agent/Knowledge/Inbox/`。
- 已完成：README 同步说明 `$obdoc` 不固定目录。
- 已完成：`scripts/validate-skills.mjs` 将 `obdoc` 目标校验改为要求“候选路径 / 不要固定目录 / 用户指定路径”，避免后续回退到强绑定目录。
- 已验证：先运行 `npm test` 得到缺少“候选路径、不要固定目录”的红灯；修正后 `npm test` 通过，输出 `All skills are valid.`。
- 备注：本轮未改版本号，未提交未推送。

## 2026-06-30 - oblearn 和 obdoc 路径规则统一

- 已完成：`$oblearn` / `$obdoc` 统一路径规则：用户指定路径优先，已有明确命中的公共知识笔记或文档优先更新；不稳定时建议 `Agent/Knowledge/Inbox/`；稳定归类、移动、合并、拆分和批量 catalog 维护交给 `$obcurate`。
- 已完成：明确两类产物可以处于同一文件夹，不通过目录区分；通过 frontmatter 和正文结构区分。
- 已完成：`skills/oblearn/templates/public-knowledge-note.md` 新增 `kind: knowledge`、`source_skill: oblearn`。
- 已完成：`skills/obdoc/templates/document-note.md` 新增 `kind: document`、`source_skill: obdoc`。
- 已完成：README 同步说明统一路径规则和 frontmatter 区分方式。
- 已完成：`scripts/validate-skills.mjs` 增加共享路径策略断言，并校验两个模板的 `kind` / `source_skill` 字段。
- 已验证：先运行 `npm test` 得到缺少共享路径术语和模板字段的红灯；修正后 `npm test` 通过，输出 `All skills are valid.`。
- 备注：本轮未改版本号，未提交未推送。

## 2026-06-30 - obdoc 审查问题修复

- 已完成：`.codex-plugin/plugin.json` 的 `longDescription` 从五个入口更新为六个入口，并在 `defaultPrompt` 增加 `$obdoc`。
- 已完成：README 使用前提补 `$obdoc` 需要 Obsidian CLI/vault，并同步说明校验脚本会检查 Codex 插件 interface 发现层。
- 已完成：`package.json`、`skills.json`、README、Claude/Codex plugin 和 marketplace 顶层描述补“文档整理”，避免新增 `$obdoc` 后发现层仍只描述经验/知识。
- 已完成：`$oblearn` / `$obdoc` 的 catalog 边界调整为允许最小明确更新：只为本次实际写入或更新的明确产物新增真实入口，或追加少量明确 `terms` / `aliases` / `notes`。
- 已完成：`skills/oblearn/templates/public-knowledge-entry.md` 的 Catalog 项改为最小更新 `_catalog.md`；不确定时只列建议并交给 `$obcurate`。
- 已完成：`$obcurate` 明确整理公共知识笔记和文档时保留并使用 `kind`、`source_skill`、`doc_type`，区分 `knowledge` 与 `document`。
- 已完成：`$obdoc` 模板中的 `doc_type` 和 `source` 改为自由描述字段，不再限定为 `guide|runbook|config|migration|troubleshooting` 或 `current-conversation|transcript|...`。
- 已完成：catalog 示例中的 `aliases` 默认改为 `[]`，避免 `aliases: [<别名>]` 暗示必须填写别名；`oblearn`/`obdoc` note frontmatter 的 `aliases: []` 保留为空列表默认值。
- 已完成：`scripts/validate-skills.mjs` 增加 README 使用前提、项目描述、Codex manifest longDescription/defaultPrompt、`doc_type` / `source` 自由字段、模板禁用 `<a|b>` 枚举占位、catalog aliases 默认空列表、oblearn/obdoc catalog 最小更新边界、obcurate metadata 边界和 public knowledge entry 模板校验。
- 已验证：新增校验后先出现目标红灯；修复后 `npm test` 通过，输出 `All skills are valid.`。
- 已验证：最终再次运行 `npm test` 通过，输出 `All skills are valid.`；旧文案搜索无命中。
- 备注：本轮未改版本号，未提交未推送。

## 2026-06-30 - 0.1.22 发布与本地更新

- 已完成：版本号推进到 `0.1.22`，同步 `package.json`、`skills.json`、`.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json`、`.codex-plugin/plugin.json`。
- 已发布：提交 `0df8046 Release v0.1.22` 已推送到 `origin/main`。
- 已发布：按 ADR 只创建并推送插件 tag `obsidian-agent-skills--v0.1.22`，未创建平行 `v0.1.22`。
- 已更新：Codex marketplace 已 upgrade，并通过 `codex plugin add obsidian-agent-skills@obsidian-agent-skills` 安装到 `0.1.22`。
- 已更新：Claude Code marketplace 已 update，并通过 `claude plugin update obsidian-agent-skills@obsidian-agent-skills --scope user` 从 `0.1.21` 更新到 `0.1.22`。
- 已验证：`npm test` 通过，输出 `All skills are valid.`。
- 已验证：`codex plugin list --json` 显示 `obsidian-agent-skills@obsidian-agent-skills` 版本 `0.1.22` 且 enabled。
- 已验证：`claude plugin list --json` 显示 `obsidian-agent-skills@obsidian-agent-skills` 版本 `0.1.22`；当前 Claude Code 列表里该插件 enabled 为 false。
- 注意：Claude Code 提示 restart 才能应用；Codex 也需要重启或开启新会话加载新 skill。

## 2026-06-30 - 版本号同步脚本

- 已完成：新增 `scripts/bump-version.mjs`，用一个版本参数同步更新 `package.json`、`skills.json`、`.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json` 和 `.codex-plugin/plugin.json`。
- 已完成：`package.json` 增加 `version:set` 命令，用法为 `npm run version:set -- 0.1.23`。
- 已完成：README 开发章节记录版本同步命令和覆盖的文件。
- 已完成：`scripts/validate-skills.mjs` 增加版本同步脚本和 README 命令说明校验。
- 已验证：先运行 `npm test` 得到缺少 `version:set` / `bump-version.mjs` 的红灯；实现后 `npm test` 通过。
- 已验证：临时执行 `npm run version:set -- 0.1.23` 后五个版本位置均变为 `0.1.23`，再执行 `npm run version:set -- 0.1.22` 恢复当前版本。
- 已验证：无效版本参数 `nope` 会输出用法并失败。
- 备注：本轮未发版，未提交未推送。

## 2026-06-30 - Obsidian Markdown 文件写入和相关链接边界

- 已完成：根据用户反馈，`$oblearn` / `$obdoc` 共享 Obsidian Markdown 写入约定：根据目标 `path` 确定 vault 本地文件系统路径，将完整 Markdown 写入或更新对应 `.md` 文件。
- 已完成：`$oblearn` / `$obdoc` 明确新建、追加、覆盖、局部更新和 catalog 最小更新都走文件写入路径；`obsidian` CLI 用于查找、读取和写入后读回校验。
- 已完成：`$obdoc` 明确 `## 相关` 记录与文档主题有真实主题关联的相关链接；没有明确相关资料时保留空小节或省略内容。
- 已验证：先运行 `npm test` 得到文件写入策略红灯，指出 `$oblearn` / `$obdoc` 缺少 `Obsidian Markdown 写入`、`统一使用 vault 文件`、`文件写入`，并命中旧写入措辞；补齐后 `npm test` 通过，输出 `All skills are valid.`。
- 备注：本轮未发版，未提交未推送。

## 2026-06-30 - skill 行为规则正向 contract 扫描与 oblearn

- 已完成：扫描 `README.md`、`skills/`、`commands/`、`docs/adr/` 和 agent memory 中与反向行为塑造相关的表述，区分行为 contract 和安全边界。
- 已完成：`$obdoc` 的 `doc_type/source`、Obsidian 查找、`## 相关`、与 `$oblearn` 分工说明改为正向 contract；`scripts/validate-skills.mjs` 增加 forbidden phrase，防止旧的模板/搜索/替代措辞回归。
- 已完成：`$oblearn` 的 archive/catalog/Obsidian 查找规则和 `$obcurate` 的整理范围规则改为正向范围描述；安全、隐私、权限和公共知识污染类禁令保留。
- 已完成：使用 `$oblearn` 新建公共知识 `Agent/Knowledge/Inbox/Skill 行为规则使用正向 contract.md`，并最小更新 `Agent/Knowledge/_catalog.md` 的 `skill-positive-contract` 入口。
- 已完成：`.agents/lessons.md` 追加“Skill 行为规则优先写正向 contract”项目经验。
- 已验证：新增校验后先运行 `npm test` 得到目标红灯；改写后 `npm test` 通过，输出 `All skills are valid.`。
- 已验证：`obsidian read` 成功读回新公共知识笔记和 catalog 入口。
- 备注：本轮未发版，未提交未推送。

## 2026-06-30 - obcurate 文档整理职责边界

- 已完成：根据用户反馈修正此前 `$obcurate` 计划里的职责混淆，明确该计划是 agent 生成的修订版计划，不是用户计划。
- 已完成：`skills/obcurate/SKILL.md` 增加职责矩阵，区分 `kind: knowledge` / `source_skill: oblearn` 与 `kind: document` / `source_skill: obdoc` 的处理范围。
- 已完成：`$obcurate` 明确产物是整理计划、metadata/catalog/wikilink/path 调整和必要的私有化建议；`kind: document` 只整理文档入口、metadata、catalog、路径、链接、`sensitivity` 和可发现性。
- 已完成：文档正文里的可复用经验候选作为后续 `$oblearn` 任务；含内网拓扑的 document 可以整理 metadata/catalog，但经验提取和脱敏公共化属于 `$oblearn`。
- 已完成：`scripts/validate-skills.mjs` 增加 `$obcurate` document boundary、职责矩阵、正文经验转交和内网文档 metadata/catalog 处理边界校验。
- 已验证：新增校验后先运行 `npm test` 得到目标红灯；补齐后 `npm test` 通过，输出 `All skills are valid.`。
- 备注：本轮未发版，未提交未推送。

## 2026-06-30 - catalog 使用语义和 tags 边界

- 已完成：将 `Agent/Knowledge/_catalog.md` 规则从纯链接索引扩展为发现入口和使用语义入口，新增 `kind` / `use_as` 字段约定。
- 已完成：`kind: knowledge` / `use_as: rule` 等公共经验可作为规则、检查清单或启发式判断；`kind: document` / `use_as: guide|runbook|reference|evidence` 等文档作为面向人类实践的一等知识库产物使用。
- 已完成：`$obinit` 生成的 `.agents/instructions.md` 模板同步 catalog 命中后的使用语义，避免新项目只会查 catalog、不会区分 knowledge 和 document。
- 已完成：`$oblearn`、`$obdoc`、`$obcurate` 明确 tags 是辅助 metadata，用于 Obsidian UI、Bases、Dataview、人工筛选和低频整理辅助，不作为 agent 发现入口。
- 已完成：`skills/obcurate/templates/catalog-entry.md` 增加 `kind` / `use_as`；`skills/obdoc/templates/document-note.md` 增加 `tags: []` 和 `use_as`；`skills/oblearn/templates/public-knowledge-note.md` 增加 `use_as`。
- 已完成：`scripts/validate-skills.mjs` 增加 catalog 使用语义、tags 辅助 metadata、obinit 模板使用语义和 doc tags 字段校验。
- 已验证：新增校验后先运行 `npm test` 得到目标红灯；补齐后 `npm test` 通过，输出 `All skills are valid.`。
- 备注：本轮未发版，未提交未推送。

## 2026-06-30 - obinit 项目相关知识渐进回写

- 已完成：根据用户反馈调整跨项目知识发现机制，改为 `$obinit` / 重复 `$obinit` 根据项目类型逐步回写相关知识链接，而不是要求日常任务都主动查知识库。
- 已完成：`$obinit` 明确第一次初始化只建立规则入口、memory、Obsidian 项目笔记和 catalog 查询协议；项目类型不明确时保持 `unknown`，不预填弱相关知识。
- 已完成：重复初始化时根据 README、package metadata、目录结构、显式 skill/spec/plan、docs 顶层索引、`.agents/active.md` 和 `.agents/progress.md` 判断项目类型和主要任务域。
- 已完成：新增 `unknown` / `candidate` / `confirmed` 三档：`unknown` 只保留协议，`candidate` 只列建议，`confirmed` 才查 catalog 并回写高置信相关知识链接。
- 已完成：`skills/obinit/templates/instructions.md` 和 `instructions-index.md` 新增 `项目相关知识` 小节；只回写链接和 `kind` / `use_as`，不复制公共知识正文。
- 已完成：`skills/obinit/references/init-modes.md` 和 `references/obsidian-sync.md` 同步重复初始化逐步收敛规则。
- 已完成：`scripts/validate-skills.mjs` 增加 `$obinit` 项目相关知识回写、模板渐进绑定协议校验。
- 已验证：新增校验后先运行 `npm test` 得到目标红灯；补齐后 `npm test` 通过，输出 `All skills are valid.`。
- 备注：本轮未发版，未提交未推送。

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
