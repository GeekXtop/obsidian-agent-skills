# Obsidian Agent Skills

Obsidian-backed workflow skills for coding agents.

This repository follows the [Agent Skills specification](https://agentskills.io/specification). It can be installed by skills-compatible agents such as Claude Code, Codex, OpenCode, and other clients that discover `skills/<skill-name>/SKILL.md`.

## Installation

### Marketplace

```text
/plugin marketplace add GeekXtop/obsidian-agent-skills
/plugin install obsidian-agent-skills@obsidian-agent-skills
```

The plugin exposes four skills: `obinit`, `obadr`, `obclose`, and `oblearn`.

Claude Code also exposes matching slash commands:

```text
/obinit
/obadr
/obclose
/oblearn
```

### npx skills

```sh
npx skills add https://github.com/GeekXtop/obsidian-agent-skills
```

If you prefer SSH:

```sh
npx skills add git@github.com:GeekXtop/obsidian-agent-skills.git
```

### Manual install

#### Codex

Copy the `skills/` directory into your Codex skills path:

```text
~/.codex/skills
```

#### Claude Code

Copy the skill directories under `skills/` into your Claude skills path:

```text
~/.claude/skills
```

#### OpenCode

Clone the full repository into the OpenCode skills directory:

```sh
git clone https://github.com/GeekXtop/obsidian-agent-skills.git ~/.opencode/skills/obsidian-agent-skills
```

OpenCode discovers `SKILL.md` files under nested `skills/` directories after restart.

## Skills

| Skill | Description |
| --- | --- |
| [obinit](skills/obinit) | Initialize or update an Obsidian-backed agent workspace for a software project. |
| [obadr](skills/obadr) | Record project-local architecture decisions in `docs/adr/`. |
| [obclose](skills/obclose) | Close out a task or session by updating `.agents/active.md`, `.agents/progress.md`, and `.agents/lessons.md`. |
| [oblearn](skills/oblearn) | Extract reusable project lessons and write them into Obsidian public knowledge notes. |

## Usage

Ask your agent to use a skill explicitly:

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

The skills are written in Chinese because the workflow is intended for a Chinese-language Obsidian agent knowledge base. They keep Obsidian as a context and knowledge layer, not a build, test, deploy, or runtime dependency.

Project memory files such as `.agents/active.md`, `.agents/progress.md`, and `.agents/lessons.md` are agent-driven updates. This repository does not install a background watcher or automatic sync hook. Use `$obclose` at task or session boundaries to write the current state back to project memory.

Templates for files written by the skills live under each skill's `templates/` directory. The `SKILL.md` files define behavior and safety boundaries; templates define the output format.

## Development

Validate the repository:

```sh
npm test
```

The validation script checks skill frontmatter, OpenAI agent metadata, Claude slash commands, templates, and plugin manifest versions.
