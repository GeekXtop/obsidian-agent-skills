# Obsidian Agent Skills

面向中文 coding agent 工作流的 Obsidian-backed skills 集合。

本仓库遵循 [Agent Skills specification](https://agentskills.io/specification)。Claude Code、Codex、OpenCode 以及其他能发现 `skills/<skill-name>/SKILL.md` 的客户端都可以安装使用。

## 安装

### Marketplace

```text
/plugin marketplace add GeekXtop/obsidian-agent-skills
/plugin install obsidian-agent-skills@obsidian-agent-skills
```

插件提供四个 skills：`obinit`、`obadr`、`obclose`、`oblearn`。

Claude Code 同时提供对应 slash command：

```text
/obinit
/obadr
/obclose
/oblearn
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
~/.codex/skills
```

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

## Skills

| Skill | 说明 |
| --- | --- |
| [obinit](skills/obinit) | 初始化或更新软件项目的 Obsidian-backed agent 工作约定，默认生成简体中文文档。 |
| [obadr](skills/obadr) | 把项目内长期架构决策记录到 `docs/adr/`。 |
| [obclose](skills/obclose) | 在任务或会话收尾时更新 `.agents/active.md`、`.agents/progress.md` 和 `.agents/lessons.md`。 |
| [oblearn](skills/oblearn) | 从项目内经验提取跨项目可复用知识，并写入 Obsidian 公共知识笔记。 |

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

这些 skills 默认使用简体中文生成长期文档和项目记忆；技术标识符、路径、命令、包名和英文专有名词保持原样。它们把 Obsidian 作为上下文和知识层，不把 Obsidian 变成构建、测试、部署或运行时依赖。

`.agents/active.md`、`.agents/progress.md`、`.agents/lessons.md` 等项目 memory 文件不会后台自动同步。需要 agent 在任务开始、阶段结束或会话收尾时主动回写；常规收尾可使用 `$obclose`。

模板文件位于各 skill 的 `templates/` 目录。`SKILL.md` 定义行为和安全边界，模板定义写入项目或 Obsidian 的输出格式。

## 开发

验证仓库：

```bash
npm test
```

校验脚本会检查 skill frontmatter、OpenAI agent metadata、Claude slash command、模板中文化回归规则，以及插件 manifest 版本一致性。
