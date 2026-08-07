# 当前状态

## 当前任务

- 目标：卸载 Codex/Claude Code 的第三方 `kepano/obsidian-skills` 插件、marketplace 和重复副本，并修复所有会修改 Obsidian vault 的 skill 可能退回 CLI mutation 写入的问题。
- Plan：`docs/superpowers/plans/2026-08-08-obsidian-filesystem-write-contract.md`
- Spec：`docs/superpowers/specs/2026-08-08-obsidian-filesystem-write-contract-design.md`
- 状态：已完成；发布状态以 git commit/tag 和客户端插件管理器查询结果为准。
- 最后更新：2026-08-08

## 当前状态

- 已完成：Codex 和 Claude Code 的 `obsidian@obsidian-skills` 插件及 `obsidian-skills` marketplace 已移除；Codex 五个独立 skill 和 Codex/Claude Code 残留缓存已清理。
- 已完成：五个会修改 vault 的 skill 统一为 vault 本地文件系统写入；CLI mutation 命令和 `content=` 不再作为写入或回退路径。
- 已完成：validator-first TDD、README、spec/plan 和项目 memory 更新。
- 阻塞：无。

## 验证

- RED：扩展 validator 后，`npm test` 按预期报告 `obinit` reference、`oblearn`、`obdoc`、`obcurate`、`obclose` 与 README 缺少统一契约。
- GREEN：补齐契约后 `npm test` 输出 `All skills are valid.`。
- `skills/obinit/SKILL.md` 正文 wordsish 为 1998，未突破 2000 上限。
- Codex/Claude Code 插件列表和 marketplace 列表中已无 `obsidian@obsidian-skills` / `obsidian-skills`；相关独立 skill、marketplace 和缓存路径均不存在。
- `git diff --check` 无输出。

## 关键文件

- `scripts/validate-skills.mjs`
- `skills/obinit/SKILL.md`
- `skills/obinit/references/obsidian-sync.md`
- `skills/oblearn/SKILL.md`
- `skills/obdoc/SKILL.md`
- `skills/obcurate/SKILL.md`
- `skills/obclose/SKILL.md`
- `README.md`
- `.agents/lessons.md`
- `.agents/progress.md`

## 下一步

1. 无待接手的代码或文档事项。
2. 本项目插件更新后需重启 Codex/Claude Code 或开启新会话，才能让已有客户端进程加载新 skill。

## 当前 ADR

- [0001-use-marketplace-plugin-update-flow.md](../docs/adr/0001-use-marketplace-plugin-update-flow.md)：使用 marketplace/plugin 命令更新本地插件。

## 已使用知识

- 无新增公共知识使用。

## Obsidian

- 项目笔记：`Agent/Projects/obsidian-agent-skills.md`
