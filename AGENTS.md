# AGENTS.md

## Project Protocol

- Keep skills under `skills/<name>/SKILL.md`.
- Preserve the Agent Skills frontmatter fields `name` and `description`.
- Keep runtime assumptions inside each skill explicit.
- Do not add hooks, generated files, or runtime dependencies unless a skill truly requires them.
- Run `npm test` before publishing changes.
