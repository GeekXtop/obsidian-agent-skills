# Obsidian Agent Skills

[![Release](https://img.shields.io/github/v/tag/GeekXtop/obsidian-agent-skills?label=release)](https://github.com/GeekXtop/obsidian-agent-skills/tags)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-spec-8A2BE2)](https://agentskills.io/specification)
![Clients](https://img.shields.io/badge/Claude%20Code%20%C2%B7%20Codex%20%C2%B7%20OpenCode-gray)

Obsidian-backed 项目记忆、任务收尾、ADR、经验沉淀、文档整理和知识整理 skills。

一套遵循 [Agent Skills specification](https://agentskills.io/specification) 的 skills 集合，把 Obsidian vault 用作 coding agent 的项目记忆与知识层。Claude Code、Codex、OpenCode，以及其他能发现 `skills/<skill-name>/SKILL.md` 的客户端都可以安装使用；Obsidian 在这里是上下文与知识层，不成为构建、测试、部署或运行时依赖。

## 目录

- [背景](#背景)
- [安装](#安装)
- [使用](#使用)
- [Skills](#skills)
- [更新](#更新)
- [开发](#开发)

## 背景

coding agent 的工作记忆通常与会话强绑定：换会话、换客户端，项目约定与已沉淀的经验就断了。本仓库把记忆拆成两层：项目内 memory 留在仓库 `.agents/`，跟代码同生命周期；跨项目公共知识与可独立阅读的文档沉淀到 vault 的 `Agent/Knowledge/` 与 `Agent/Documents/`。技能发现遵循 Agent Skills 规范，不绑定单一 agent 产品。

## 安装

### 依赖

仓库内 memory 和 ADR 功能可以只依赖本项目文件；涉及 Obsidian vault 的功能需要额外准备运行中的 Obsidian：

1. 安装 Obsidian 桌面端，并打开目标 vault。
2. 在 Obsidian 打开 `设置 -> 关于 -> 高级`，开启 `命令行界面`。
3. 在终端运行 `obsidian help` 验证 CLI 可用，再运行 `obsidian vault` 确认能访问目标 vault。

`$obinit` 同步 `Agent/Projects/`、`$oblearn` 写入 `Agent/Knowledge/`、`$obdoc` 写入 Obsidian 文档、`$obcurate` 整理公共知识库时都需要上述前提。

> [!IMPORTANT]
> 这些 skill 的所有 Obsidian Markdown mutation 都直接操作 vault 本地文件系统，不通过 CLI 参数传递正文或 metadata。CLI 只用于 vault 定位、有限搜索、读取和写入后读回；无法解析本地路径时会请用户提供或确认路径，而不会退回 CLI 写入。

### Marketplace

Claude Code：

```bash
claude plugin marketplace add GeekXtop/obsidian-agent-skills --scope user
claude plugin install obsidian-agent-skills@obsidian-agent-skills --scope user
```

Codex：

```bash
codex plugin marketplace add GeekXtop/obsidian-agent-skills
codex plugin add obsidian-agent-skills@obsidian-agent-skills
```

### npx skills

```bash
npx skills add https://github.com/GeekXtop/obsidian-agent-skills
```

偏好 SSH 时：

```bash
npx skills add git@github.com:GeekXtop/obsidian-agent-skills.git
```

### 手动安装

| 客户端 | 做法 |
| --- | --- |
| Codex | 把 `skills/` 目录复制到 `$CODEX_HOME/skills`；未设置 `CODEX_HOME` 时使用用户主目录下的 `.codex/skills`：Windows 通常是 `%USERPROFILE%\.codex\skills`，macOS/Linux 通常是 `~/.codex/skills` |
| Claude Code | 把 `skills/` 下的 skill 目录复制到 `~/.claude/skills` |
| OpenCode | 把完整仓库 clone 到 OpenCode skills 目录：`git clone https://github.com/GeekXtop/obsidian-agent-skills.git ~/.opencode/skills/obsidian-agent-skills`，重启后会发现嵌套 `skills/` 目录下的 `SKILL.md` |

## 使用

对 agent 显式说出 skill 名即可调用；marketplace 安装还提供对应命令入口，在不同客户端可能显示为 slash command、prompt chip 或命令面板项：

```text
/obinit /obadr /obclose /oblearn /obdoc /obcurate
```

### `$obinit` 的三种模式

- **新项目**：创建完整 `.agents/instructions.md`，`AGENTS.md` / `CLAUDE.md` 作为薄入口。
- **成熟项目或 fork**：保留已有 `AGENTS.md` / `CLAUDE.md`，只追加中文入口提示；`.agents/instructions.md` 使用索引型结构，避免重复复制长规则。
- **重复运行**：只补缺失文件、链接和入口提示，不覆盖、不重复追加、不重置状态。

新项目模式和成熟项目接入模式都会建立 `docs/README.md` 文档地图：登记当前状态文档的事实范围和同步触发，让行为改动能定位到具体文档与节。已有 `docs/README.md` 的项目先读回再合并，不整体覆盖；设计稿、实施计划这类时点快照不登记。

首次 `$obinit` 不强行判断尚未成型的项目类型，也不预填弱相关公共知识；重复运行时会根据 README、package metadata、目录结构、显式 skill/spec/plan、docs 顶层索引和 agent memory 重新判断项目类型，`candidate` 只列建议，`confirmed` 才回写高置信相关知识链接（只写链接和 `kind` / `use_as`，不复制正文）。

### memory 回写与收尾

`.agents/active.md`、`.agents/progress.md`、`.agents/lessons.md` 等项目 memory 文件不会后台自动同步，由 agent 在任务开始、阶段结束或会话收尾时主动回写。完成实质代码/文档改动、阶段性验证或复杂任务暂停时，agent 应按 `$obclose` 收尾；它还会检查 `progress` / `lessons` 是否过长或重复，必要时轻量合并、压缩或把旧进展归档到 `.agents/archive/`。

### 公共知识发现协议

`Agent/Knowledge/` 中的跨项目公共知识不会被全量自动加载：只有用户明确要求、`Agent/Knowledge/_catalog.md` 命中任务关键词，或风险较高且关键词明确时，才做有限关键词定向搜索。命中后按 catalog 的 `kind` / `use_as` 使用：`knowledge` 可作为公共经验、规则、检查清单或启发式判断。`Agent/Documents/` 中的文档不进入公共知识自动发现，其 `_catalog.md` 只在用户明确指定、任务明确涉及文档主题，或执行 `$obdoc` / `$obcurate` 流程时读取。

### 写入分流

- `$obclose`：项目内经验先写入 `.agents/lessons.md`。
- `$oblearn`：跨项目公共知识只写入 `Agent/Knowledge/`，不稳定归类建议写入 `Agent/Knowledge/Inbox/`，并最小维护 `Agent/Knowledge/_catalog.md`；也支持非项目临时会话——从当前对话、粘贴 transcript、临时任务摘要或 Codex session id 提取经验时不要求先 `$obinit`，不创建 `.agents/`。
- `$obdoc`：可独立阅读的文档只写入 `Agent/Documents/`（服务器配置、教程、运维 runbook、迁移指南、排障记录等），不稳定时建议写入 `Agent/Documents/Inbox/`，并最小维护 `Agent/Documents/_catalog.md`；文档保留脱敏、来源摘要、验证和回滚信息。短经验条目仍交给 `$oblearn`。
- `$obcurate`：稳定归类、移动、合并、拆分和批量 catalog 维护，例如清理两个 Inbox、修正 aliases/tags/wikilink、删除过期入口。

### 语言与模板

`kind`、`use_as`、`sensitivity` 等 metadata 的机器层字段值保持英文 token；模板、整理计划和完成说明使用中文展示，例如“类型：文档（`kind: document`）”。

模板文件位于各 skill 的 `templates/` 目录：`SKILL.md` 定义行为和安全边界，模板定义写入项目或 Obsidian 的输出格式。所有 skills 默认遵循用户或项目既有语言偏好，本仓库当前模板使用简体中文，fork 可替换 `templates/` 调整输出语言；技术标识符、路径、命令、包名和英文专有名词保持原样。

## Skills

| Skill | 说明 |
| --- | --- |
| [obinit](skills/obinit) | 初始化或更新软件项目的 Obsidian-backed 通用 agent 工作约定，按项目状态选择模式。 |
| [obadr](skills/obadr) | 把项目内长期架构决策记录到 `docs/adr/`，并回写项目 memory 的 ADR 链接。 |
| [obclose](skills/obclose) | 在任务、阶段或会话收尾时更新项目内 memory，实质任务后主动保存可恢复上下文，并控制 `progress` / `lessons` 膨胀。 |
| [oblearn](skills/oblearn) | 从项目内经验、非项目临时会话材料或 Codex session 提取跨场景可复用知识，写入或建议写入 Obsidian 公共知识笔记。 |
| [obdoc](skills/obdoc) | 从当前对话、材料、本地文件或 Codex session 整理配置文档、教程、runbook 和排障记录到 Obsidian。 |
| [obcurate](skills/obcurate) | 低频结构性整理和维护 `Agent/Knowledge/` 公共知识库、`Agent/Documents/` 文档库、Inbox 和 `_catalog.md`。 |

## 更新

已通过 marketplace 安装时，不要直接 clone、复制或改写客户端 cache。发布新版本后用对应客户端的插件管理命令更新：

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

更新后需要 reload 或重启：Claude Code 执行 `/reload` 或重启；Codex 重启或开启新会话。可以用 `codex plugin list --json` / `claude plugin list --json` 确认本地版本。

> [!WARNING]
> 升级插件后，已有项目的 `.agents/` 不会自动跟着变。在项目里运行 `$obinit`（重复运行模式），它会按 `skills/obinit/references/memory-upgrade.md` 逐节对比当前模板与项目内文件，报告差异并等用户确认，再按最小改动收敛到当前 memory 代际。迁移前旧项目由 `$obclose` 的降级路径保持可用，不迁移也能继续工作。

## 开发

同步 release 版本号（同时更新 `package.json`、`skills.json`、`.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json` 和 `.codex-plugin/plugin.json` 的版本字段）：

```bash
npm run version:set -- 0.1.38
```

验证仓库：

```bash
npm test
```

校验脚本检查 skill frontmatter、OpenAI agent metadata、命令入口与对应 skill、模板和 reference 引用存在性、README 技能表、description 语义约束、`## 运行时假设` 章节、正文长度预算、机器层枚举、模板对齐规则、模板语言回归规则、Codex 插件 interface 发现层、版本同步脚本，以及插件 manifest 版本一致性；失败时输出问题计数和涉及范围。

两个 plugin manifest 的 skills 发现方式不同，这是有意为之：`.codex-plugin/plugin.json` 用 `"skills": "./skills/"` 显式声明，`.claude-plugin/plugin.json` 依赖 Claude Code 对仓库根 `skills/` 与 `commands/` 目录的约定式发现，因此不重复声明。两者指向同一套 `skills/`，`.claude-plugin/plugin.json` 缺少 `skills` 字段不是配置遗漏。

发布 tag 只保留插件发布约定的 `obsidian-agent-skills--vX.Y.Z`，不要为同一版本额外创建平行的 `vX.Y.Z` tag；已有历史 `v0.1.x` tag 保留为已发布引用。

项目文档地图见 [docs/README.md](docs/README.md)，架构决策记录见 `docs/adr/`。

---

[MIT](https://spdx.org/licenses/MIT/) © 2026 GeekX.top，详见 [LICENSE](LICENSE)。
