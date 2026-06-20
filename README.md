# Obsidian Agent Skills

Obsidian-backed workflow skills for coding agents.

This repository follows the [Agent Skills specification](https://agentskills.io/specification). It can be installed by skills-compatible agents such as Claude Code, Codex, OpenCode, and other clients that discover `skills/<skill-name>/SKILL.md`.

## Installation

### Marketplace

```text
/plugin marketplace add GeekXtop/obsidian-agent-skills
/plugin install obsidian-agent-skills@obsidian-agent-skills
```

The plugin exposes three skills: `obinit`, `obadr`, and `oblearn`.

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
$oblearn
```

The skills are written in Chinese because the workflow is intended for a Chinese-language Obsidian agent knowledge base. They keep Obsidian as a context and knowledge layer, not a build, test, deploy, or runtime dependency.

Project memory files such as `.agents/active.md`, `.agents/progress.md`, and `.agents/lessons.md` are agent-driven updates. This repository does not install a background watcher or automatic sync hook.

## Development

Validate the repository:

```sh
npm test
```

The validation script checks that every skill has a `SKILL.md` file with frontmatter `name` and `description`, and that the frontmatter name matches the skill directory.
