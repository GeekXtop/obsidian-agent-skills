# 经验记录

本文件只记录项目内可复用经验。

## 格式

```md
## YYYY-MM-DD - <简短经验标题>

- 背景：
- 经验：
- 适用场景：
- 下次检查：
```

## 2026-06-25 - Marketplace 插件更新不要手工写 cache

- 背景：发布 `0.1.18` 后，本地更新阶段曾尝试直接向 Codex plugin cache 写入新版本目录；用户要求改为正常商店更新和技能更新。
- 经验：通过 marketplace 安装的 Claude Code / Codex 插件，发布后本地更新必须走客户端插件管理器命令；不要直接 clone、复制或改写 cache。更新后还要 reload、重启或开启新会话，否则当前会话可能仍使用旧 skill。
- 适用场景：维护 Agent Skills marketplace 插件、发版后更新本地 Codex / Claude Code 插件、排查本地 skill 版本不一致。
- 下次检查：README 是否保留 Codex 的 `codex plugin marketplace upgrade` + `codex plugin add`，Claude Code 的 `claude plugin marketplace update` + `claude plugin update`，以及 `/reload` / 重启提示；用 `plugin list --json` 验证实际安装版本。

## 2026-06-28 - 校验脚本应校验 metadata 内容而非仅文件存在

- 背景：`scripts/validate-skills.mjs` 原先对 `agents/openai.yaml` 只做 `existsSync` 检查，但 README 声称“检查 OpenAI agent metadata”；字段写空或写错不会被测试发现。
- 经验：为 skills 仓库新增任何 metadata / manifest 文件类型时，validate 脚本要校验关键字段内容（存在且非空），不要只校验文件存在；否则 README 中“校验脚本会检查 X”的承诺会和实现脱节。
- 适用场景：扩展 `validate-skills.mjs`、新增 agent metadata 或 plugin manifest 字段、对齐 README 校验声明。
- 下次检查：`openai.yaml` 三字段（`display_name` / `short_description` / `default_prompt`）校验是否仍在；新增 metadata 文件是否同样补了内容校验。

## 2026-06-30 - Obsidian Markdown 写入统一使用 vault 文件

- 背景：`$obdoc` 生成 Markdown 文档时，如果通过命令参数传输正文，内容里的换行、引号、反斜杠、中文和代码块可能破坏 Obsidian 端 IPC JSON。
- 经验：面向 Obsidian 的 Markdown 写入统一使用 vault 文件；根据目标 `path` 确定 vault 本地文件系统路径，将完整 Markdown 写入或更新对应 `.md` 文件。CLI 用于查找、读取和写入后读回校验。
- 适用场景：维护 `$oblearn`、`$obdoc`、调整 Obsidian 写入流程、排查 `SyntaxError ... is not valid JSON` 这类 CLI/IPC 写入错误。
- 下次检查：`skills/oblearn/SKILL.md` 和 `skills/obdoc/SKILL.md` 是否仍包含“Obsidian Markdown 写入 / 统一使用 vault 文件 / 文件写入 / 本地文件系统路径 / 写入后读回”；校验脚本是否继续覆盖这些术语并禁止旧写入措辞。

## 2026-06-30 - Skill 行为规则优先写正向 contract

- 背景：`$obdoc` 写入规则最初用“不要把整篇 Markdown 作为 CLI 参数，也不要分段 append”描述，用户指出这仍围绕错误路径展开，而且范围应覆盖 `$oblearn` / `$obdoc` 的 Obsidian Markdown 写入。
- 经验：写 skill 行为规则时，先给正向 contract：产物是什么、输入来自哪里、执行路径是什么、验证证据是什么。禁令适合 secret、隐私、权限、全库扫描等安全边界；字段来源、模板填写、写入路径、相关链接等行为形状应优先写成正向步骤或输出约束。
- 适用场景：维护 `SKILL.md`、命令入口、模板说明、校验脚本和 agent 工作约定。
- 下次检查：遇到“不要为了...”“不把...改成...”“不要用...替代...”这类表述时，先判断是否为安全边界；如果是行为塑造，改为正向 contract，并在 `scripts/validate-skills.mjs` 中同时检查正向术语和禁止旧措辞回归。

## 2026-06-30 - obcurate 整理 document 只处理入口和 metadata

- 背景：一次 `$obcurate` 计划把三件事混在一起：整理已有 `kind: document`、从 document 正文抽取新经验、以及判断含内网拓扑的文档是否能作为公共经验传播。
- 经验：`$obcurate` 可以整理 `kind: document` / `source_skill: obdoc`，但产物限于整理计划、metadata/catalog/wikilink/path 调整、`sensitivity` 判断、相关链接和必要的私有化建议；从文档正文提炼可复用经验是单独 `$oblearn` 任务。
- 适用场景：维护 `$obcurate`、清理 `Agent/Knowledge/Inbox/`、处理 `source_skill: obdoc` 文档、修正 `_catalog.md` stale link 或含本地事实的公共文档入口。
- 下次检查：看到 `kind: document` 时先判断本轮范围；在 `$obcurate` 中只检查 `kind`、`source_skill`、`doc_type`、`sensitivity`、路径、catalog 是否保留和 `## 相关`，不要把 `## 可提取知识候选` 直接晋升为公共知识。

## 2026-06-30 - catalog 需要表达查到后怎么用

- 背景：只用 `_catalog.md` 记录 `terms` / `aliases` / `notes` 时，新项目 agent 能查到相关笔记，但无法稳定判断命中项是可直接应用的公共经验，还是只能作为参考材料的 document；tags 也容易被误用成主发现入口。
- 经验：catalog entry 应包含 `kind` 和 `use_as`。`kind` 表示命中对象是 `knowledge` 还是 `document`；`use_as` 表示查到后怎么用，例如 `rule`、`checklist`、`reference`、`evidence`。tags 只作为 Obsidian UI、人工筛选和整理辅助，不作为 agent 发现入口。
- 适用场景：维护 `_catalog.md`、设计 `obinit` 项目规则、整理 `Agent/Knowledge/`、新增 `oblearn` / `obdoc` 模板字段。
- 下次检查：新增或整理 catalog entry 时确认 `terms` / `aliases` / `kind` / `use_as` / `notes` 是否一致；新项目模板是否说明 `knowledge` 可作为公共经验使用、`document` 只作为参考材料使用。

## 2026-06-30 - obinit 相关知识应重复初始化逐步回写

- 背景：首次 `$obinit` 时项目类型可能还没定型；把公共知识发现放到日常每次任务里又太复杂，放进当前项目 `.agents/lessons.md` 也无法跨项目生效。
- 经验：`$obinit` 应提供跨项目的渐进绑定机制：第一次初始化只建立 catalog 查询协议，不预填弱相关知识；重复初始化时根据项目结构、README、package metadata、docs 顶层索引和 agent memory 判断项目类型，按 `unknown` / `candidate` / `confirmed` 三档处理。只有 `confirmed` 才回写高置信公共知识链接，`candidate` 只列建议。
- 适用场景：维护 `$obinit`、设计跨项目公共知识发现机制、处理项目从空仓库逐渐成型后的知识入口补全。
- 下次检查：`skills/obinit/SKILL.md`、`templates/instructions*.md` 和 `references/obsidian-sync.md` 是否仍说明“只回写链接和 `kind` / `use_as`，不复制公共知识正文”；校验脚本是否覆盖 `unknown` / `candidate` / `confirmed`。

## 2026-07-01 - memory 只补权威状态载体外的信息

- 背景：发版过程中如果在 commit/tag/push 前后反复更新 `.agents/active.md` / `.agents/progress.md`，会制造额外提交尾巴；类似问题也会出现在 PR、CI/CD、ADR、migration、issue 或 runbook 等已经承载状态的流程里。
- 经验：当状态已由权威状态载体记录时，memory 只记录下一次 agent 需要接手的载体外信息：未完成事项、载体中没有的决策背景、阻塞、人工确认点或可复用经验。已由载体记录的完成状态放在最终回复说明，不为短暂中间态额外写 memory。
- 适用场景：维护 `$obclose`、`$obinit` 模板、发版流程、PR/CI/deployment 收尾、ADR/migration/issue/runbook 驱动的任务。
- 下次检查：`skills/obclose/SKILL.md` 是否仍有“权威状态载体边界”；`skills/obinit/templates/instructions*.md` 是否让新项目继承该规则；`scripts/validate-skills.mjs` 是否校验 `authoritative state carrier memory boundary`。
