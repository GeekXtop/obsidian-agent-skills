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
