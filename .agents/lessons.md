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

## 2026-06-25 - Marketplace 插件更新不要手工写 cache

- 背景：发布 `0.1.18` 后，本地更新阶段曾尝试直接向 Codex plugin cache 写入新版本目录；用户要求改为正常商店更新和技能更新。
- 经验：通过 marketplace 安装的 Claude Code / Codex 插件，发布后本地更新必须走客户端插件管理器命令；不要直接 clone、复制或改写 cache。更新后还要 reload、重启或开启新会话，否则当前会话可能仍使用旧 skill。
- 适用场景：维护 Agent Skills marketplace 插件、发版后更新本地 Codex / Claude Code 插件、排查本地 skill 版本不一致。
- 验证方式：确认 README 和 ADR 保留 Codex 的 `codex plugin marketplace upgrade` + `codex plugin add`、Claude Code 的 `claude plugin marketplace update` + `claude plugin update` 以及 reload/重启提示；用两端 `plugin list --json` 验证实际安装版本。
- 最后验证：2026-08-08 Codex manual 与本机两端 CLI help 均确认上述 marketplace/plugin 更新命令；两端 `plugin list --json` 均能返回本项目已启用的安装版本。

## 2026-06-28 - 校验脚本应校验 metadata 内容而非仅文件存在

- 背景：`scripts/validate-skills.mjs` 原先对 `agents/openai.yaml` 只做 `existsSync` 检查，但 README 声称“检查 OpenAI agent metadata”；字段写空或写错不会被测试发现。
- 经验：为 skills 仓库新增任何 metadata / manifest 文件类型时，validate 脚本要校验关键字段内容（存在且非空），不要只校验文件存在；否则 README 中“校验脚本会检查 X”的承诺会和实现脱节。
- 适用场景：扩展 `validate-skills.mjs`、新增 agent metadata 或 plugin manifest 字段、对齐 README 校验声明。
- 验证方式：检查 `scripts/validate-skills.mjs` 是否仍校验 `openai.yaml` 三字段（`display_name` / `short_description` / `default_prompt`）；新增 metadata 文件是否同样补了内容校验。
- 最后验证：2026-09-09 三字段校验仍在；本次新增的引用存在性、命令入口、README 表格、manifest 版本断言同样按内容校验而非仅文件存在。

## 2026-06-30 - Obsidian Markdown 写入统一使用 vault 文件

- 背景：通过命令参数传输 Markdown 正文、frontmatter 或 catalog 内容时，换行、引号、反斜杠、中文和代码块可能破坏 Obsidian 端 IPC JSON；只约束 `$oblearn` / `$obdoc` 也会让其他写 vault 的 skill 继续退回 CLI mutation。
- 经验：所有 Obsidian Markdown mutation 都直接操作 vault 本地文件系统，覆盖创建、覆盖、追加、局部修改、frontmatter、catalog、项目笔记、移动和重命名。`obsidian` CLI 只用于 vault 定位、有限搜索、读取和写入后读回；无法解析本地路径时请用户提供或确认，不使用 CLI mutation 回退。
- 适用场景：维护 `$obinit`、`$oblearn`、`$obdoc`、`$obcurate`、`$obclose`，调整 Obsidian 写入流程，或排查 `SyntaxError ... is not valid JSON` 这类 CLI/IPC 写入错误。
- 验证方式：运行 `npm test`，预期输出 `All skills are valid.`；确认 `scripts/validate-skills.mjs` 的 `obsidianVaultFilesystemMutationContract` 覆盖五个写 vault 的 skill 和 `skills/obinit/references/obsidian-sync.md`。
- 最后验证：2026-08-08 已完成 validator-first 红灯→绿灯；五个写 vault 的 skill、obinit reference 和 README 均由共享契约覆盖。

## 2026-06-30 - Skill 行为规则优先写正向 contract

- 背景：`$obdoc` 写入规则最初用“不要把整篇 Markdown 作为 CLI 参数，也不要分段 append”描述，用户指出这仍围绕错误路径展开，而且范围应覆盖 `$oblearn` / `$obdoc` 的 Obsidian Markdown 写入。
- 经验：写 skill 行为规则时，先给正向 contract：产物是什么、输入来自哪里、执行路径是什么、验证证据是什么。禁令适合 secret、隐私、权限、全库扫描等安全边界；字段来源、模板填写、写入路径、相关链接等行为形状应优先写成正向步骤或输出约束。
- 适用场景：维护 `SKILL.md`、命令入口、模板说明、校验脚本和 agent 工作约定。
- 验证方式：遇到“不要为了...”“不把...改成...”“不要用...替代...”这类表述时，先判断是否为安全边界；如果是行为塑造，改为正向 contract，并在 `scripts/validate-skills.mjs` 中同时检查正向术语和禁止旧措辞回归。
- 最后验证：2026-09-09 本次新增的运行时假设、写前重读和回退规则均按正向 contract 书写；`forbiddenObdocBehaviorShapingPhrases` 等禁止措辞断言仍生效。

## 2026-06-30 - obcurate 整理 document 以实践文档为一等产物

- 背景：一次 `$obcurate` 计划把三件事混在一起：整理已有 `kind: document`、从 document 正文抽取新经验、以及判断含内网拓扑的文档是否能作为公共经验传播。后续对 PVE 既有指南复核后，确认实践文档本身就是一等知识库产物。
- 经验：`$obcurate` 可以整理 `kind: document` / `source_skill: obdoc`，目标是让实践文档稳定归类、可发现、可读、可执行，并处理 metadata/catalog/wikilink/path、`sensitivity` 和相关链接。文档进入 `Agent/Documents/`，敏感但稳定的文档也用 `sensitivity` 和读取条件控制复用，不再引入单独 Private 路径；文档里的“可提取知识候选”只作为 `$oblearn` 线索，不在 `$obcurate` 中直接转成短经验知识。
- 适用场景：维护 `$obcurate`、清理 `Agent/Documents/Inbox/`、处理 `source_skill: obdoc` 文档、修正 `Agent/Documents/_catalog.md` stale link 或含本地事实的文档入口。
- 验证方式：看到 `kind: document` 时先判断本轮范围；稳定但敏感的文档不要长期留在 Inbox，应有 `Agent/Documents/` 稳定路径和明确 `sensitivity`；不要把 `## 可提取知识候选` 直接转成短经验知识。
- 最后验证：2026-09-09 文档整理边界与 `## 可提取知识候选` 转交规则仍在；本次新增 `Agent/Archive/YYYY-MM-DD/` 回退路径和 `## 机器层枚举`。

## 2026-06-30 - catalog 需要表达查到后怎么用

- 背景：只用 `_catalog.md` 记录 `terms` / `aliases` / `notes` 时，新项目 agent 能查到相关笔记，但无法稳定判断命中项是短经验规则，还是面向人类实践的文档；tags 也容易被误用成主发现入口。
- 经验：catalog entry 应包含 `kind` 和 `use_as`。`kind` 表示命中对象是短经验知识还是实践文档；`use_as` 表示查到后怎么用，例如 `rule`、`checklist`、`guide`、`runbook`、`reference`、`evidence`。`kind: document` 是一等知识库产物，读取时应理解上下文并替换本地参数，不能把正文里的当前环境值直接泛化成公共规则。tags 只作为 Obsidian UI、人工筛选和整理辅助，不作为 agent 发现入口。
- 适用场景：维护 `_catalog.md`、设计 `obinit` 项目规则、整理 `Agent/Knowledge/`、新增 `oblearn` / `obdoc` 模板字段。
- 验证方式：新增或整理 catalog entry 时确认 `terms` / `aliases` / `kind` / `use_as` / `notes` 是否一致；新项目模板是否说明 `knowledge` 可作为公共经验使用、`document` 可作为面向人类实践的指南、runbook、参考材料或证据使用。
- 最后验证：2026-09-09 本次新增 `## 机器层枚举` 封闭 `kind` / `source_skill` / `use_as` / `sensitivity` / `status`；catalog 使用语义断言仍在。

## 2026-06-30 - obinit 相关知识应重复初始化逐步回写

- 背景：首次 `$obinit` 时项目类型可能还没定型；把公共知识发现放到日常每次任务里又太复杂，放进当前项目 `.agents/lessons.md` 也无法跨项目生效。
- 经验：`$obinit` 应提供跨项目的渐进绑定机制：第一次初始化只建立 catalog 查询协议，不预填弱相关知识；重复初始化时根据项目结构、README、package metadata、docs 顶层索引和 agent memory 判断项目类型，按 `unknown` / `candidate` / `confirmed` 三档处理。只有 `confirmed` 才回写高置信公共知识链接，`candidate` 只列建议。
- 适用场景：维护 `$obinit`、设计跨项目公共知识发现机制、处理项目从空仓库逐渐成型后的知识入口补全。
- 验证方式：`skills/obinit/SKILL.md`、`templates/instructions*.md` 和 `references/obsidian-sync.md` 是否仍说明“只回写链接和 `kind` / `use_as`，不复制公共知识正文”；校验脚本是否覆盖 `unknown` / `candidate` / `confirmed`。
- 最后验证：2026-09-09 该协议已从 `SKILL.md` 下沉到 `references/obsidian-sync.md`，断言目标同步迁移到 `requiredObinitReferenceConcepts`；`templates/instructions*.md` 仍保留该协议。

## 2026-07-01 - memory 只补权威状态载体外的信息

- 背景：发版过程中如果在 commit/tag/push 前后反复更新 `.agents/active.md` / `.agents/progress.md`，会制造额外提交尾巴；类似问题也会出现在 PR、CI/CD、ADR、migration、issue 或 runbook 等已经承载状态的流程里。
- 经验：当状态已由权威状态载体记录时，memory 只记录下一次 agent 需要接手的载体外信息：未完成事项、载体中没有的决策背景、阻塞、人工确认点或可复用经验。已由载体记录的完成状态放在最终回复说明，不为短暂中间态额外写 memory。
- 适用场景：维护 `$obclose`、`$obinit` 模板、发版流程、PR/CI/deployment 收尾、ADR/migration/issue/runbook 驱动的任务。
- 验证方式：`skills/obclose/SKILL.md` 是否仍有“权威状态载体边界”；`skills/obinit/templates/instructions*.md` 是否让新项目继承该规则；`scripts/validate-skills.mjs` 是否校验 `authoritative state carrier memory boundary`。
- 最后验证：2026-09-09 三项均仍在；本次收尾按该规则只记录未完成事项和决策背景。

## 2026-07-01 - skill 示例不要把具体值写成默认值

- 背景：`$obcurate` 的 Documents catalog 示例使用固定 `## Network`，实际整理时 agent 容易直接复制该分组名，和项目中文展示偏好不一致。
- 经验：skill 示例如果用于说明结构，应优先使用占位符和“如何选择”的规则；只有真实必须保留的 token 才写成具体值。展示分组名、路径目录、标题、别名等上下文相关值要说明来源，例如用户或项目语言偏好、vault 既有风格、frontmatter、topic 或用户确认。
- 适用场景：维护 `SKILL.md`、模板、catalog 示例、frontmatter 示例和 validator 校验。
- 验证方式：示例里的具体词是否会被 agent 当默认值复制；必要时改成 `<占位>` + 一个简短例子，并在 `scripts/validate-skills.mjs` 中校验防回归。
- 最后验证：2026-09-09 本次新增的 `skills/obdoc/templates/documents-catalog-entry.md` 使用 `<展示分组名>` / `<目标路径目录>` / `<何时读取该文档>` 占位符；`forbiddenTemplatePlaceholders` 和 `angleBracketEnums` 断言仍生效。

## 2026-07-27 - SKILL.md 正文字数上限时新协议进 references/模板

- 背景：Task 3 要给 `$obinit` 生成物加“使用中证伪”协议，但 `scripts/validate-skills.mjs` 对 `obinit` 的 SKILL.md 正文有 2000-wordsish 上限校验；最终协议正文只插入 `references/memory-bank.md`、`references/obsidian-sync.md` 和两个 `templates/instructions*.md`，`skills/obinit/SKILL.md` 本身全程未修改。
- 经验：skill 正文有 wordsish/字数上限校验时，新协议、新规则或新章节优先放进 `references/` 和 `templates/`，由 SKILL.md 链接引用，不直接撑大 SKILL.md 正文；SKILL.md 只承担入口和索引角色。
- 适用场景：给 `obinit`（或其他有正文字数上限的 skill）新增规则、协议或章节；扩展 `scripts/validate-skills.mjs` 的字数类校验前先确认是否已接近阈值。
- 验证方式：按 `scripts/validate-skills.mjs` 里 `countWordsish` 的同款统计方法，对 `skills/obinit/SKILL.md` 去除 frontmatter 后的正文计数，确认 ≤ 2000；并运行 `npm test` 确认输出 `All skills are valid.`。
- 最后验证：2026-07-27 创建时首次验证：`skills/obinit/SKILL.md` 正文实测 1999（逼近上限，说明该文件已接近无余量，后续新增规则应默认走 references/模板）；`npm test` 输出 `All skills are valid.`。

## 2026-09-09 - 多工具环境里「全局规则」是复数

- 背景：排查「主工作区单写者」规则出处时，只枚举了 `.dsh`、`.codex`、`.claude` 三个工具配置目录就下结论说找不到，实际它写在 `.zcode/AGENTS.md`——每个 agent 工具只注入自己配置目录下的全局规则。
- 经验：同一台机器上多个 agent 工具各有独立全局规则文件（`.dsh/AGENTS.md`、`.codex/AGENTS.md`、`.claude/CLAUDE.md`、`.zcode/AGENTS.md`），内容还不一致。搜索「全局规则」前先枚举用户目录下的工具配置目录，再逐个搜；不要假设全局只有一份。
- 适用场景：排查某条 agent 规则出自哪个文件、评估全局配置对某个工具的生效范围、设计跨工具生效的约定。
- 验证方式：列出用户目录下的工具配置目录，对每个目录检查是否存在 `AGENTS.md` / `CLAUDE.md`，再在其中搜索目标短语。
- 最后验证：2026-09-09 创建时首次验证：四个工具目录中只有 `.zcode/AGENTS.md`（91 行）含「主工作区单写者」；另三份（46/46/47 行）均无。

## 2026-09-09 - 普适化不是换中性路径

- 背景：把 skill 里的 `docs/superpowers/specs/` 硬编码改成 `docs/specs/` 后，发现装了对应工具的项目会出现两个 plan 目录；正确做法是让 obinit「发现并遵守项目既有结构」，而不是预设另一套路径。
- 经验：skill 普适化不等于换一条中性路径，而是让规则对「项目里实际有什么」保持中立：发现既有结构并遵守、不预设、不创建、不排斥。具体工具的路径只能作为「发现结果的示例」出现，不能作为规则；同理，策略词（单写者、占坑、认领）属于项目规则，不能写进通用 skill。
- 适用场景：维护 SKILL.md 里涉及第三方工具目录、输入来源或协作方式的规则；评审某条规则是否绑定了某个工具或个人习惯。
- 验证方式：`npm test` 中 `forbiddenHardcodedToolPaths`（禁 `docs/superpowers/` 等）和 `forbiddenOrchestrationPolicyWords`（禁单写者/占坑/认领登记）断言；`skills/obinit/scripts/inspect-project.mjs` 输出 `docsTopLevel` 供发现使用。
- 最后验证：2026-09-09 创建时首次验证：两个断言在临时副本上分别对「加回硬编码路径」和「加策略词」红灯；删除 `docsTopLevel` 输出后 fixture 红灯。

## 2026-09-09 - 迁移机制要接在既有钩子上，不新增一套

- 背景：为存量项目设计 `.agents/` 升级路径时，一度想引入 memory 代际标记（`<!-- memory-schema: 2 -->`）；但 `references/init-modes.md` 的重复运行模式原本就写着「只补缺失文件、链接和过期表述」——钩子已经在了，缺的只是「谁判定过期、凭什么」。
- 经验：给存量项目设计迁移时，先找既有规则里已有的钩子（如「补过期表述」「保留原结构就地更新」），用清单和证据源把判定客观化，而不是新增一套平行机制。版本标记这类**无法自举**的东西（存量对象头部没有标记，而「无标记」同时对应多种状态）应推迟到第二次迁移再引入。
- 适用场景：设计 skill 或工具链的升级路径、评估「要不要加版本号」、评审迁移方案是否引入新机制。
- 验证方式：检查迁移方案是否复用了既有规则的措辞（如「补过期表述」）；检查新增机制能否自举——存量对象是否已经带有它依赖的元数据。
- 最后验证：2026-09-09 创建时首次验证：v1 → v2 清单接在 `init-modes.md` 既有钩子上，`npm test` 绿；代际标记按「无法自举」推迟并写入计划未决问题第 4 条。

## 2026-09-11 - 自举仓库的版本门禁要放仓库侧，且用行为探针

- 背景：本仓库迭代自己的 skill，但执行者手上的插件版本不由仓库决定。用 0.1.27 的 agent 收尾会按 v1 就地改写 `.agents/active.md`、不建 `handoffs/`、不写 `来源` 行；而差异检测和迁移清单只存在于 0.1.28 及以上的 skill 里，旧执行者根本读不到，仓库于是静默退回旧代际。`npm test` 也拦不住，因为断言只覆盖模板、不覆盖仓库自己的 `.agents/` 实例。
- 经验：自举仓库要防「执行者版本落后」，门禁必须放在仓库侧（`AGENTS.md`、`.agents/instructions.md` 这类任何工具都会读的文件），不能放在 skill 里——放在 skill 里只有新版本才看得到，等于没有门禁。判定方式用行为探针（「加载到的 `$obclose` 正文里有没有 `## handoffs 目录` 这一节」）而不是版本号：老版本没有这节、新版本有，任何工具任何版本都可判，也不依赖执行者能否拿到版本元数据。同时要把仓库实例纳入 `npm test`，否则绿灯只证明模板合规。
- 适用场景：维护会被自身 skill 修改的仓库、设计跨工具通用的契约或版本门禁、评审「契约该放 skill 还是放项目规则」。
- 验证方式：`scripts/validate-skills.mjs` 自举 scope 断言（门禁术语、obclose 探针章节、active 派生声明、README 记忆库索引、`handoffs/` 目录、progress 末条 `来源` 行）；破坏实验在临时副本上逐条执行。
- 最后验证：2026-09-11 创建时首次验证：9 条断言在临时副本上全部红灯，主仓库 `npm test` 绿。
