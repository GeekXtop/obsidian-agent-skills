# Agent Instructions

## Project Protocol

- Read this file before changing code.
- Project facts belong in this repository.
- Agent scratch notes, plans, and investigation logs belong in `.agents/`.
- Current task state belongs in `.agents/active.md`.
- Progress summaries belong in `.agents/progress.md`.
- Reusable lessons belong in `.agents/lessons.md`.
- Durable documentation belongs in `docs/`.
- Architecture decisions belong in `docs/adr/`.
- Obsidian project note: Agent/Projects/<project>.md.

## Bootstrap Scope

During project initialization, agents may create or update only:

- `AGENTS.md`
- `CLAUDE.md`
- `.agents/`
- `docs/`

Any other path requires an explicit user request.

## Normal Work

- Modify code only within the user's requested task scope.
- Ask before bulk moves, deletes, renames, generated-file churn, dependency changes, or documentation restructuring.
- Do not require private notes, local vaults, or personal tools for build, test, deploy, or runtime behavior.

## Memory

- Update `.agents/active.md` at task start, phase completion, and session closeout.
- Update `.agents/progress.md` after meaningful milestones.
- Update `.agents/lessons.md` only for reusable lessons.
- Use `docs/adr/` for long-lived project decisions.
- Use `docs/superpowers/` for specs and plans; link them from `.agents/active.md` instead of copying full content.

