# 当前状态

## 当前任务

- 目标：将 `$oblearn` / `$obdoc` 的 Obsidian 产物路径硬分流为 Knowledge 与 Documents，并让 `$obcurate` 同时支持两类整理。
- 状态：已完成。`$oblearn` 只写入 `Agent/Knowledge/` 并维护公共知识 `_catalog.md`；`$obdoc` 只写入 `Agent/Documents/` 并维护文档 `_catalog.md`；`$obcurate` 默认可同时整理两类 catalog / Inbox，也支持只整理 Knowledge 或只整理 Documents；metadata 保留英文 token，模板和整理计划使用中文展示层。
- 最后更新：2026-07-01

## 当前状态

- 已完成：新增 `skills/obdoc/SKILL.md`，职责定位为配置文档、教程、runbook、迁移指南和排障记录等“文档型输出”。
- 已完成：`$obdoc` 明确和 `$oblearn` 分工：`obdoc` 生成可独立阅读的长文档，`oblearn` 生成短经验条目；`obdoc` 只列出“可提取知识候选”，不自动混写公共知识条目。
- 已完成：`$obdoc` 支持当前对话、粘贴材料、本地文件、项目材料和完整 Codex session id；session id 只能在本机 Codex 会话存储中 fixed-string 精确定位，不使用 `codex resume`。
- 已完成：根据用户反馈统一 `$oblearn` / `$obdoc` 路径规则：用户指定路径优先，已有明确命中的公共知识笔记或文档优先更新；不稳定时建议 `Agent/Knowledge/Inbox/`；稳定归类、移动、合并、拆分和批量 catalog 维护交给 `$obcurate`。
- 已完成：`$oblearn` 和 `$obdoc` 可以处于同一文件夹，通过 frontmatter 和正文结构区分：`kind: knowledge` / `source_skill: oblearn` 表示短经验知识，`kind: document` / `source_skill: obdoc` 表示可阅读或可执行文档。
- 已完成：新增模板 `document-note.md` 和 `source-evidence.md`，覆盖摘要、前提、配置或步骤、验证、风险回滚、来源摘要和可提取知识候选。
- 已完成：新增 `commands/obdoc.md` 和 `skills/obdoc/agents/openai.yaml`。
- 已完成：更新 `skills.json`、`README.md` 和 `.codex-plugin/plugin.json`，插件说明从五个 skills 改为六个 skills，并补 `$obdoc` 使用说明和 Codex 默认 prompt。
- 已完成：同步 `package.json`、`skills.json`、README、Claude/Codex plugin 和 marketplace 描述，顶层描述现在包含“文档整理”。
- 已完成：`$oblearn` / `$obdoc` 允许为本次实际写入或更新的明确产物最小更新 `_catalog.md`；结构性 catalog 维护由 `$obcurate` 执行。
- 已完成：`$obcurate` 现在明确整理同目录知识和文档时保留并使用 `kind`、`source_skill`、`doc_type`。
- 已完成：`$obdoc` 的 `doc_type` 和 `source` 改为自由描述字段，不再使用 `guide|runbook|config|migration|troubleshooting` 或 `current-conversation|transcript|...` 这类固定枚举占位。
- 已完成：catalog 示例中的 `aliases` 默认改为 `[]`，避免暗示必须填写别名；只有用户确认、已有 frontmatter、标题可直接推出或重命名/合并保留旧名时才填写。
- 已完成：`scripts/validate-skills.mjs` 增加必备 skill 名称、`obdoc` 概念、统一路径规则、模板字段、README 使用前提、项目描述、Codex plugin interface/defaultPrompt 等校验。
- 已发布：提交 `0df8046 Release v0.1.22` 已推送到 `origin/main`。
- 已发布：按 ADR 只创建并推送插件 tag `obsidian-agent-skills--v0.1.22`，未创建平行 `v0.1.22`。
- 已更新：Codex marketplace 已 upgrade，并通过 `codex plugin add obsidian-agent-skills@obsidian-agent-skills` 安装到 `0.1.22`。
- 已更新：Claude Code marketplace 已 update，并通过 `claude plugin update obsidian-agent-skills@obsidian-agent-skills --scope user` 从 `0.1.21` 更新到 `0.1.22`。
- 已完成：新增 `scripts/bump-version.mjs`，统一更新 `package.json`、`skills.json`、`.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json` 和 `.codex-plugin/plugin.json` 的版本字段。
- 已完成：`package.json` 增加 `version:set` 脚本；README 开发章节增加 `npm run version:set -- 0.1.23` 用法。
- 已完成：`scripts/validate-skills.mjs` 要求版本同步脚本和 README 说明存在，避免后续回退到手工多文件改版本。
- 已完成：根据用户反馈，`$oblearn` / `$obdoc` 共享 Obsidian Markdown 写入约定：统一使用 vault 文件；新建、追加、覆盖、局部更新和 catalog 最小更新都走文件写入路径，`obsidian` CLI 用于查找、读取和写入后读回校验。
- 已完成：`$obdoc` 明确 `## 相关` 记录与文档主题有真实主题关联的相关链接；没有明确相关资料时保留空小节或省略内容。
- 已完成：扫描 `README.md`、`skills/`、`commands/`、`docs/adr/` 和 agent memory 中相关非正向表述；将 `obdoc` 的模板/搜索/相关链接/经验分工规则改为正向 contract。
- 已完成：将 `oblearn` 的 archive/catalog/Obsidian 查找规则和 `obcurate` 的整理范围规则改为正向范围描述；保留 secret、隐私、权限、全库扫描等安全边界类禁令。
- 已完成：使用 `$oblearn` 提取公共知识 `[[Skill 行为规则使用正向 contract]]`，并对 `Agent/Knowledge/_catalog.md` 增加 `skill-positive-contract` 最小入口。
- 已完成：`$obcurate` 明确自身产物是整理计划、metadata/catalog/wikilink/path 调整和必要的私有化建议。
- 已完成：`$obcurate` 新增 knowledge/document 职责矩阵；`kind: document` / `source_skill: obdoc` 可以整理，但只处理文档入口、metadata、catalog、路径、链接、脱敏状态和可发现性。
- 已完成：`$obcurate` 明确文档正文里的可复用经验候选作为后续 `$oblearn` 任务，不在 `$obcurate` 中直接转成短经验知识。
- 已完成：修正此前过窄的 document 语义；文档是一等知识库产物，面向人类实践可读、可执行、可复用，短经验只是另一种更紧凑的知识产物。
- 已完成：`scripts/validate-skills.mjs` 增加 `$obcurate` 产物边界、document 经验转交、职责矩阵、内网拓扑文档 metadata/catalog 整理边界校验。
- 已完成：`$obcurate` 增加批量整理策略；多篇 Inbox 或 catalog 条目先分组为稳定归类、保持 Inbox、建议私有化、需要人工判断，低风险条目按组确认，高风险例外逐项确认。
- 已完成：`skills/obcurate/templates/curation-plan.md` 增加批量分组和高风险例外区块，避免大型整理计划退化为逐篇确认清单。
- 已完成：`Agent/Knowledge/_catalog.md` 规则增加 `kind` 和 `use_as`；`kind: knowledge` / `use_as: rule` 等公共经验可作为规则或检查清单，`kind: document` / `use_as: guide|runbook|reference|evidence` 等文档作为面向人类实践的一等知识库产物使用。
- 已完成：`$obinit` 生成的 `.agents/instructions.md` 模板同步 catalog 命中后的使用语义，避免新项目只知道查 catalog、不知道如何区分 knowledge 和 document。
- 已完成：`$oblearn` / `$obdoc` / `$obcurate` 明确 tags 是辅助 metadata，用于 Obsidian UI、Bases、Dataview、人工筛选和低频整理辅助，不作为 agent 发现入口。
- 已完成：`skills/obdoc/templates/document-note.md` 增加 `tags: []` 和 `use_as`，`skills/oblearn/templates/public-knowledge-note.md` 增加 `use_as`，`skills/obcurate/templates/catalog-entry.md` 增加 `kind` / `use_as`。
- 已完成：`$obinit` 新增项目相关知识回写规则：第一次初始化不预填弱相关知识，重复初始化根据 README、package metadata、目录结构、显式 skill/spec/plan、docs 顶层索引和 agent memory 判断项目类型。
- 已完成：`$obinit` 使用 `unknown` / `candidate` / `confirmed` 三档处理项目相关知识：`unknown` 只保留协议，`candidate` 只列建议，`confirmed` 才查 catalog 并回写高置信链接。
- 已完成：`skills/obinit/templates/instructions.md` 和 `instructions-index.md` 新增 `项目相关知识` 小节，只回写链接和 `kind` / `use_as`，不复制公共知识正文。
- 已完成：`skills/obinit/references/init-modes.md` 和 `references/obsidian-sync.md` 同步重复初始化逐步收敛规则。
- 已完成：将 release 专用 memory 边界推广为“权威状态载体”规则，并同步到 `.agents/instructions.md`、`skills/obinit/SKILL.md`、`skills/obinit/references/memory-bank.md`、`skills/obinit/templates/instructions*.md`、`skills/obclose/SKILL.md` 和 `scripts/validate-skills.mjs`。
- 已完成：根据用户决策将 `$oblearn` / `$obdoc` 产物路径硬分流：`$oblearn` 只写 `Agent/Knowledge/`，不稳定时进 `Agent/Knowledge/Inbox/`；`$obdoc` 只写 `Agent/Documents/`，不稳定时进 `Agent/Documents/Inbox/`。
- 已完成：`Agent/Knowledge/_catalog.md` 定位为公共 agent 自动发现入口；`Agent/Documents/_catalog.md` 定位为人类可读文档目录和显式读取入口。
- 已完成：`$obcurate` 支持同时整理 Knowledge 和 Documents，也可按用户指定只整理一种；批量分组把旧“建议私有化”改为“敏感文档”，用 `sensitivity` 和读取条件控制复用，不引入 `Agent/Private/`。
- 已完成：模板和规则统一为机器层保留英文 token、展示层中文化，例如“类型：文档（`kind: document`）”“用途：操作手册（`use_as: runbook`）”。
- 进行中：无。
- 阻塞：无。

## 验证

- 红灯：先在校验脚本中要求 `obdoc` 存在，运行 `npm test` 失败并输出 `skills directory: missing required skills: obdoc`。
- 红灯：将 `obdoc` 校验从固定目录集合改为要求“候选路径 / 不要固定目录 / 用户指定路径”，运行 `npm test` 失败并指出缺少“候选路径、不要固定目录”。
- 红灯：新增统一路径规则和模板字段校验后，`npm test` 失败并指出 `oblearn` / `obdoc` 缺少共享路径术语与 `kind` / `source_skill` 字段。
- 红灯：新增审查校验后，`npm test` 失败并指出 `$obdoc` 缺少 README 使用前提、Codex manifest 发现层缺 `$obdoc`、`oblearn` catalog 边界和 `obcurate` metadata 边界缺失。
- 红灯：新增 `public-knowledge-entry.md` catalog 边界校验后，`npm test` 失败并指出模板仍要求直接更新 catalog。
- 绿灯：补齐 `oblearn` / `obdoc` / `obcurate` 规则、模板、README、Codex manifest 和校验脚本后运行 `npm test`，输出 `All skills are valid.`。
- 绿灯：补齐顶层项目描述和对应校验后再次运行 `npm test`，输出 `All skills are valid.`；旧文案搜索无命中。
- 绿灯：发版后再次运行 `npm test`，输出 `All skills are valid.`。
- 已验证：`codex plugin list --json` 显示 `obsidian-agent-skills@obsidian-agent-skills` 版本 `0.1.22` 且 enabled。
- 已验证：`claude plugin list --json` 显示 `obsidian-agent-skills@obsidian-agent-skills` 版本 `0.1.22`；Claude Code 报告该插件 enabled 为 false，需按用户配置启用并重启或 reload 后应用。
- 红灯：新增版本脚本校验后，`npm test` 失败并指出缺少 `scripts.version:set` 和 `scripts/bump-version.mjs`。
- 红灯：新增 README 命令说明校验后，`npm test` 失败并指出 README 缺少 `npm run version:set --`。
- 绿灯：实现脚本、npm 命令和 README 后运行 `npm test`，输出 `All skills are valid.`。
- 已验证：`npm run version:set -- 0.1.23` 能同步更新五个版本位置，再运行 `npm run version:set -- 0.1.22` 能恢复当前版本。
- 已验证：`node scripts/bump-version.mjs nope` 对无效版本输出用法并非 0 退出。
- 红灯：将 `scripts/validate-skills.mjs` 调整为要求 `oblearn` / `obdoc` 共享正向文件写入策略并禁止旧写入措辞后，运行 `npm test` 失败，指出缺少 `Obsidian Markdown 写入`、`统一使用 vault 文件`、`文件写入`，并命中旧措辞。
- 绿灯：补齐 `skills/obdoc/SKILL.md` 正向规则后运行 `npm test`，输出 `All skills are valid.`。
- 红灯：新增 `obdoc` 行为塑造旧措辞校验后运行 `npm test`，命中 `不要为了匹配模板`、`不要为了找灵感`、`不要为了填模板`、`不要在 obdoc 中替代`。
- 绿灯：改写 `obdoc` 行为规则、`oblearn` 查找范围和 `obcurate` 整理输入后运行 `npm test`，输出 `All skills are valid.`。
- 已验证：`obsidian read path="Agent/Knowledge/Inbox/Skill 行为规则使用正向 contract.md"` 成功读回新公共知识；`Agent/Knowledge/_catalog.md` 包含 `skill-positive-contract` 入口。
- 红灯：新增 `$obcurate` document boundary 校验后运行 `npm test`，指出缺少 `kind: document`、`source_skill: obdoc`、`doc_type`、`sensitivity`、`catalog 是否保留`、`$oblearn` 等边界术语。
- 绿灯：补齐 `$obcurate` 文档整理边界、职责矩阵和正文经验转交规则后运行 `npm test`，输出 `All skills are valid.`。
- 红灯：新增 catalog `kind/use_as`、tags 辅助 metadata、obinit 查询使用语义校验后运行 `npm test`，指出 `$obcurate`、`$obdoc`、`$obinit`、`$oblearn` 缺少对应术语和模板字段。
- 绿灯：补齐 catalog 使用语义、tags 边界、模板字段和 obinit 生成规则后运行 `npm test`，输出 `All skills are valid.`。
- 红灯：新增 `$obinit` 项目相关知识回写校验后运行 `npm test`，指出缺少 `项目相关知识回写`、`第一次初始化`、`重复初始化`、`unknown`、`candidate`、`confirmed`、`高置信`、`只回写链接`、`只列建议`。
- 绿灯：补齐 `$obinit` 主规则、模板和 references 后运行 `npm test`，输出 `All skills are valid.`。
- 红灯：将 validator 改为要求通用“权威状态载体”术语后运行 `npm test`，指出 `$obclose`、`$obinit` 和 obinit templates 仍缺少通用边界术语。
- 绿灯：补齐通用 memory 边界规则后运行 `npm test`，输出 `All skills are valid.`。
- 红灯：新增 `$obcurate` 批量整理策略校验后运行 `npm test`，指出缺少 `批量整理`、`先分组`、`按组确认`、`不逐篇确认`、`需要人工判断`、`高风险例外` 和整理计划模板批量分组术语。
- 绿灯：补齐 `$obcurate` 正文和 `curation-plan.md` 后运行 `npm test`，输出 `All skills are valid.`；`git diff --check` 无输出；旧文案搜索无命中。
- 红灯：新增 Knowledge/Documents 硬分流、Documents catalog、中文展示层校验后运行 `npm test`，指出 `$oblearn`、`$obdoc`、`$obcurate` 缺少新路径和展示层术语。
- 绿灯：补齐 `$oblearn`、`$obdoc`、`$obcurate`、`$obinit`、README、模板、命令和 Codex manifest 后运行 `npm test`，输出 `All skills are valid.`；`git diff --check` 无输出。

## 关键文件

- `skills/obdoc/SKILL.md`：新 skill 的职责、输入来源、Codex session id 读取边界、输出目标和工作流。
- `skills/obdoc/templates/document-note.md`：Obsidian 文档模板。
- `skills/oblearn/SKILL.md`：与 `$obdoc` 统一路径规则，明确短经验知识用 `kind: knowledge` 区分。
- `skills/oblearn/templates/public-knowledge-note.md`：新增 `kind: knowledge` 和 `source_skill: oblearn`。
- `skills/obdoc/templates/source-evidence.md`：来源摘要模板。
- `commands/obdoc.md`：命令入口。
- `skills/obdoc/agents/openai.yaml`：Codex/OpenAI UI metadata。
- `skills.json`：新增 `obdoc` registry 项，并同步顶层描述。
- `.codex-plugin/plugin.json`：Codex 插件 interface longDescription 和 defaultPrompt 增加 `$obdoc`，并同步顶层描述。
- `.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json`、`package.json`：同步顶层描述。
- `README.md`：安装、命令、skills 表和使用说明增加 `$obdoc`。
- `scripts/validate-skills.mjs`：新增 `obdoc` 存在性、关键概念、发现层、README 前提、项目描述、`doc_type` / `source` 自由字段、模板禁用 `<a|b>` 枚举占位、catalog aliases 默认空列表和 catalog 最小更新边界校验。
- `scripts/bump-version.mjs`：统一同步 release 版本号。
- `package.json`：新增 `version:set` 命令。
- `skills/obdoc/SKILL.md`：新增 Obsidian 写入规则和相关链接质量边界。
- `scripts/validate-skills.mjs`：当前工作区已有对应校验项。
- `skills/oblearn/SKILL.md`：archive/catalog/Obsidian 查找规则改为正向范围描述。
- `skills/obcurate/SKILL.md`：整理输入范围改为正向描述，并新增 document 整理职责矩阵和正文经验转交 `$oblearn` 规则。
- `skills/obcurate/templates/curation-plan.md`：新增批量分组和高风险例外区块。
- `skills/obinit/SKILL.md`、`skills/obinit/templates/instructions.md`、`skills/obinit/templates/instructions-index.md`、`skills/obinit/references/obsidian-sync.md`：新增 catalog 命中后的 `kind` / `use_as` 使用语义。
- `skills/obcurate/templates/catalog-entry.md`：catalog entry 模板新增 `kind` 和 `use_as`。
- `skills/obdoc/templates/document-note.md`：文档模板新增 `tags: []` 和 `use_as`。
- `skills/oblearn/templates/public-knowledge-note.md`：公共知识模板新增 `use_as`。
- `skills/obinit/references/init-modes.md`：重复初始化时项目相关知识逐步收敛。
- `skills/obinit/templates/instructions.md`、`skills/obinit/templates/instructions-index.md`：新增 `项目相关知识` 协议小节。
- `skills/obclose/SKILL.md`：新增“权威状态载体边界”，定义已有 git commit、tag、PR、CI/CD、release、artifact、ADR、migration、issue/ticket、runbook 承载状态时的 memory 写入范围。
- `skills/obinit/SKILL.md`、`skills/obinit/references/memory-bank.md`、`skills/obinit/templates/instructions.md`、`skills/obinit/templates/instructions-index.md`：同步新项目和重复初始化继承的通用 memory 边界。
- `scripts/validate-skills.mjs`：将 release workflow memory boundary 校验替换为 authoritative state carrier memory boundary 校验。
- `Agent/Knowledge/Inbox/Skill 行为规则使用正向 contract.md`：本轮新增公共知识笔记。
- `Agent/Knowledge/_catalog.md`：新增 `skill-positive-contract` 最小入口。

## 下一步

1. 用户决定是否提交当前 Knowledge/Documents 分流改动。
2. 如需实际整理 vault 中已有 PVE 文档，后续用 `$obcurate` 将其从 `Agent/Knowledge/Inbox/` 迁移到 `Agent/Documents/Network/` 并登记 `Agent/Documents/_catalog.md`。

## 当前 ADR

- [0001-use-marketplace-plugin-update-flow.md](../docs/adr/0001-use-marketplace-plugin-update-flow.md)：使用 marketplace/plugin 命令更新本地插件。

## 已使用知识

- 无新增公共知识使用。

## 已提取知识

- [[Skill 行为规则使用正向 contract]]：写 skill 行为规则时优先使用正向 contract；安全、隐私、权限类边界保留明确禁令。
- 项目经验：`$obcurate` 整理 `kind: document` 时只处理 metadata/catalog/path/link/sensitivity/可发现性；从文档正文提炼经验必须转为 `$oblearn`。

## Obsidian

- 项目笔记：`Agent/Projects/obsidian-agent-skills.md`
