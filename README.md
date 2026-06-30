# Obsidian Agent Skills

Obsidian-backed skills 集合，用于 agent 项目记忆、任务收尾、ADR、经验沉淀、文档整理和知识整理。

本仓库遵循 [Agent Skills specification](https://agentskills.io/specification)。Claude Code、Codex、OpenCode 以及其他能发现 `skills/<skill-name>/SKILL.md` 的客户端都可以安装使用。

## 使用前提

仓库内 memory 和 ADR 功能可以只依赖本项目文件；涉及 Obsidian vault 的功能需要额外准备运行中的 Obsidian：

- 安装 Obsidian 桌面端，并打开目标 vault。
- 在 Obsidian 打开 `设置 -> 关于 -> 高级`，开启 `命令行界面`。
- 在终端运行 `obsidian help` 验证 CLI 可用，再运行 `obsidian vault` 确认能访问目标 vault。

`$obinit` 同步 `Agent/Projects/`、`$oblearn` 写入 `Agent/Knowledge/`、`$obdoc` 写入 Obsidian 文档、`$obcurate` 整理公共知识库时都需要上述前提。构建、测试和发布本仓库不依赖 Obsidian。

## 安装

### Marketplace

Codex：

```bash
codex plugin marketplace add GeekXtop/obsidian-agent-skills
codex plugin add obsidian-agent-skills@obsidian-agent-skills
```

Claude Code：

```bash
claude plugin marketplace add GeekXtop/obsidian-agent-skills --scope user
claude plugin install obsidian-agent-skills@obsidian-agent-skills --scope user
```

插件提供六个 skills：`obinit`、`obadr`、`obclose`、`oblearn`、`obdoc`、`obcurate`。

插件同时提供对应命令入口；不同客户端可能显示为 slash command、prompt chip 或命令面板项：

```text
/obinit
/obadr
/obclose
/oblearn
/obdoc
/obcurate
```

### npx skills

```bash
npx skills add https://github.com/GeekXtop/obsidian-agent-skills
```

如果偏好 SSH：

```bash
npx skills add git@github.com:GeekXtop/obsidian-agent-skills.git
```

### 手动安装

#### Codex

把 `skills/` 目录复制到 Codex skills 路径：

```text
$CODEX_HOME/skills
```

未设置 `CODEX_HOME` 时使用用户主目录下的 `.codex/skills`：Windows 通常是 `%USERPROFILE%\.codex\skills`，macOS/Linux 通常是 `~/.codex/skills`。

#### Claude Code

把 `skills/` 下的 skill 目录复制到 Claude skills 路径：

```text
~/.claude/skills
```

#### OpenCode

把完整仓库 clone 到 OpenCode skills 目录：

```bash
git clone https://github.com/GeekXtop/obsidian-agent-skills.git ~/.opencode/skills/obsidian-agent-skills
```

OpenCode 重启后会发现嵌套 `skills/` 目录下的 `SKILL.md`。

## 更新

已通过 marketplace 安装时，不要直接 clone、复制或改写客户端 cache。发布新版本后用对应客户端的插件管理命令更新。

发布 tag 只保留插件发布约定的 `obsidian-agent-skills--vX.Y.Z`。不要再为同一版本额外创建平行的 `vX.Y.Z` tag；已有历史 `v0.1.x` tag 保留为已发布引用。

Codex：

```bash
codex plugin marketplace upgrade obsidian-agent-skills
codex plugin add obsidian-agent-skills@obsidian-agent-skills
```

Claude Code：

```bash
claude plugin marketplace update obsidian-agent-skills
claude plugin update obsidian-agent-skills@obsidian-agent-skills --scope user
```

更新后需要 reload 或重启：

- Claude Code：执行 `/reload` 或重启 Claude Code。
- Codex：重启 Codex 或开启新会话；如果客户端提供 plugin reload 操作，使用客户端提供的 reload。

可以用以下命令确认本地版本：

```bash
codex plugin list --json
claude plugin list --json
```

## Skills

| Skill | 说明 |
| --- | --- |
| [obinit](skills/obinit) | 初始化或更新软件项目的 Obsidian-backed agent 工作约定。 |
| [obadr](skills/obadr) | 把项目内长期架构决策记录到 `docs/adr/`。 |
| [obclose](skills/obclose) | 在任务或会话收尾时更新项目 memory；实质任务结束后 agent 可主动执行，并控制 `progress` / `lessons` 膨胀。 |
| [oblearn](skills/oblearn) | 从项目内经验、非项目临时会话材料或 Codex session 提取跨场景可复用知识，并写入或建议写入 Obsidian 公共知识笔记。 |
| [obdoc](skills/obdoc) | 从当前对话、材料、本地文件或 Codex session 整理配置文档、教程、runbook 和排障记录到 Obsidian。 |
| [obcurate](skills/obcurate) | 整理和维护 `Agent/Knowledge/` 公共知识库、`Agent/Documents/` 文档库、Inbox 和 `_catalog.md`。 |

## 使用

显式要求 agent 使用某个 skill：

```text
$obinit
```

```text
$obadr
```

```text
$obclose
```

```text
$oblearn
```

```text
$obdoc
```

```text
$obcurate
```

这些 skills 默认遵循用户或项目既有语言偏好；本仓库当前模板使用简体中文，fork 可替换 `templates/` 调整输出语言。技术标识符、路径、命令、包名和英文专有名词保持原样。它们把 Obsidian 作为上下文和知识层，不把 Obsidian 变成构建、测试、部署或运行时依赖。

`$obinit` 会按项目状态选择模式：

- 新项目：创建完整 `.agents/instructions.md`，`AGENTS.md` / `CLAUDE.md` 作为薄入口。
- 成熟项目或 fork：保留已有 `AGENTS.md` / `CLAUDE.md`，只追加中文入口提示；`.agents/instructions.md` 使用索引型结构，避免重复复制长规则。
- 重复运行：只补缺失文件、链接和入口提示，不覆盖、不重复追加、不重置状态。

首次 `$obinit` 不强行判断尚未成型的项目类型，也不预填弱相关公共知识。重复 `$obinit` 时会根据 README、package metadata、目录结构、显式 skill/spec/plan、docs 顶层索引和 agent memory 重新判断项目类型；`unknown` 只保留查询协议，`candidate` 只列建议，`confirmed` 才回写高置信相关知识链接。回写只写链接和 `kind` / `use_as`，不复制公共知识正文。

`.agents/active.md`、`.agents/progress.md`、`.agents/lessons.md` 等项目 memory 文件不会后台自动同步。需要 agent 在任务开始、阶段结束或会话收尾时主动回写；完成实质代码/文档改动、阶段性验证或复杂任务暂停时，agent 应按 `$obclose` 收尾。`$obclose` 还会检查 `progress` / `lessons` 是否过长或重复，必要时轻量合并、压缩或把旧进展归档到 `.agents/archive/`。

`Agent/Knowledge/` 中的跨项目公共知识不会被全量自动加载。接入项目后，agent 不应凭空假设哪些领域已经沉淀；只有用户明确要求、`Agent/Knowledge/_catalog.md` 命中任务关键词，或风险较高且关键词明确时，才做有限关键词定向搜索。命中后读取 catalog 的 `kind` / `use_as`：`knowledge` 可作为公共经验、规则、检查清单或启发式判断使用。`Agent/Documents/` 中的文档不进入公共知识自动发现；`Agent/Documents/_catalog.md` 是人类可读文档目录，只有用户明确指定、任务明确涉及文档主题，或执行 `$obdoc` / `$obcurate` 文档流程时才读取。

`$oblearn` 负责把当前项目经验提取为跨项目公共知识；项目内经验先由 `$obclose` 写入 `.agents/lessons.md`。它也支持非项目临时会话：当当前目录没有项目 memory，或用户明确要求从当前对话、粘贴 transcript、临时任务摘要、Codex session id 中提取经验时，不要求先 `$obinit`，不创建 `.agents/`，只把脱敏后的可复用经验写入或建议写入 `Agent/Knowledge/Inbox/`。Codex session id 只用于在本机 Codex 会话存储中精确定位对应 JSONL，不使用 `codex resume` 读取，也不扩大扫描无关历史。不稳定归类的新知识可建议写入 Inbox；写入目标和关键词明确时，允许对 catalog 做最小明确更新。

`$obdoc` 负责把当前对话、粘贴材料、本地文件或 Codex session 整理成可独立阅读的 Obsidian 文档，例如服务器配置、教程、运维 runbook、迁移指南和排障记录。文档写入或建议写入 `Agent/Documents/`，不写入 `Agent/Knowledge/`；不稳定时建议写入 `Agent/Documents/Inbox/`。文档保留脱敏、来源摘要、验证和回滚信息，是面向人类实践的可读、可执行、可复用知识库产物。短经验条目仍交给 `$oblearn`。

`$oblearn` 和 `$obdoc` 采用硬分流：`$oblearn` 只写入 `Agent/Knowledge/`，不稳定时建议写入 `Agent/Knowledge/Inbox/`，并可最小维护 `Agent/Knowledge/_catalog.md`；`$obdoc` 只写入 `Agent/Documents/`，不稳定时建议写入 `Agent/Documents/Inbox/`，并可最小维护 `Agent/Documents/_catalog.md`。稳定归类、移动、合并、拆分和批量 catalog 维护交给 `$obcurate`。

`kind`、`use_as`、`sensitivity` 等 metadata 的机器层字段值保持英文 token；模板、整理计划和完成说明使用中文展示，例如“类型：文档（`kind: document`）”“用途：操作手册（`use_as: runbook`）”。`$obcurate` 负责低频结构性整理公共知识库和文档库，例如清理两个 Inbox、移动或重命名主题、合并或拆分主题、删除过期入口、批量维护 `_catalog.md`、修正 aliases/tags/wikilink。

模板文件位于各 skill 的 `templates/` 目录。`SKILL.md` 定义行为和安全边界，模板定义写入项目或 Obsidian 的输出格式。

## 开发

同步更新 release 版本号：

```bash
npm run version:set -- 0.1.23
```

该命令会同步更新 `package.json`、`skills.json`、`.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json` 和 `.codex-plugin/plugin.json` 的版本字段。

验证仓库：

```bash
npm test
```

校验脚本会检查 skill frontmatter、OpenAI agent metadata、命令入口、模板语言回归规则、Codex 插件 interface 发现层、版本同步脚本，以及插件 manifest 版本一致性。

两个 plugin manifest 的 skills 发现方式不同，这是有意为之：`.codex-plugin/plugin.json` 用 `"skills": "./skills/"` 显式声明，`.claude-plugin/plugin.json` 依赖 Claude Code 对仓库根 `skills/` 与 `commands/` 目录的约定式发现，因此不重复声明。两者指向同一套 `skills/`，`.claude-plugin/plugin.json` 缺少 `skills` 字段不是配置遗漏。
