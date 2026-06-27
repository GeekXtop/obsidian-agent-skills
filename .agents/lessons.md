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
