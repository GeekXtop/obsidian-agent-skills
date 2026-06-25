# 使用 marketplace/plugin 命令更新本地插件

- 状态：accepted
- 日期：2026-06-25
- 决策人：用户与 Codex 会话

## 背景

本项目通过 Claude Code 和 Codex 的 marketplace/plugin 机制发布和安装。发布 `0.1.18` 后，本地更新阶段曾尝试直接向客户端 cache 写入新版本目录，这会绕过插件管理器的 marketplace snapshot、安装状态和 reload 语义。用户明确要求后续按“正常商店更新和技能更新”处理，并补充记录 reload 插件的步骤。

README 也缺少 Obsidian 运行前提说明，容易让使用者误以为只安装 skill 就能写入 Obsidian vault。实际上，涉及 `Agent/Projects/`、`Agent/Knowledge/` 的功能需要本机安装并运行 Obsidian，并在 `设置 -> 关于 -> 高级` 开启 `命令行界面`。

## 适用范围

该决定约束：

- 本仓库 README 的安装、更新和运行前提说明。
- 后续发布版本后的本地 Codex / Claude Code 插件更新流程。
- agent 在执行“更新本地插件”“更新 skill”“发版后本地验证”任务时的操作边界。

## 非目标

该决定不覆盖：

- npm 包发布流程。
- 非 marketplace 的一次性手动安装场景。
- Claude Code 或 Codex 插件管理器内部实现。
- 本仓库的构建、测试或运行时依赖；`npm test` 仍不得依赖 Obsidian。

## 决策

发布新版本后，本地更新必须使用客户端插件管理器命令，不直接 clone、复制或改写插件 cache。

发布 tag 只使用插件发布约定的 `obsidian-agent-skills--vX.Y.Z`，不再为同一版本额外创建平行的 `vX.Y.Z` tag。已有历史 `v0.1.x` tag 保留为已发布引用，不主动删除。

Codex 更新流程：

```bash
codex plugin marketplace upgrade obsidian-agent-skills
codex plugin add obsidian-agent-skills@obsidian-agent-skills
```

Claude Code 更新流程：

```bash
claude plugin marketplace update obsidian-agent-skills
claude plugin update obsidian-agent-skills@obsidian-agent-skills --scope user
```

更新后必须 reload 或重启客户端，让新 skill 和 slash command 进入当前会话：

- Claude Code：执行 `/reload` 或重启 Claude Code。
- Codex：重启 Codex 或开启新会话；如果客户端提供 plugin reload 操作，使用客户端提供的 reload。

README 必须说明 Obsidian-backed 功能的前提：安装 Obsidian 桌面端、打开目标 vault，并在 `设置 -> 关于 -> 高级` 开启 `命令行界面`。用 `obsidian help` 和 `obsidian vault` 验证 CLI 可访问目标 vault。

## 备选方案

- 直接 clone 或复制到客户端 cache：拒绝。这样绕过插件管理器，可能造成版本状态、启用状态或 reload 结果不一致。
- 只更新 git tag，不更新本地客户端：拒绝。本地会继续使用旧 skill，下一轮 agent 容易读到旧规则。
- 同时创建 `vX.Y.Z` 和 `obsidian-agent-skills--vX.Y.Z`：拒绝。Marketplace/plugin 流程只需要插件命名 tag，平行版本 tag 会造成发版状态看起来重复。
- 继续保留手动安装说明：接受为备用路径，但 marketplace 安装后的更新必须使用 marketplace/plugin 命令。

## 后果

- 正面影响：发布后本地状态可由客户端插件管理器追踪，Codex 和 Claude Code 的安装版本可通过 `plugin list` 验证。
- 正面影响：后续 release tag 只有一个权威命名，减少 GitHub release 和本地 tag 列表中的重复信号。
- 正面影响：后续 agent 不会把 cache 目录当成发布入口，减少本地安装状态损坏风险。
- 成本：更新后需要 reload、重启或开启新会话，当前会话不一定立即看到新 skill。
- 后续工作：README 和项目 memory 需要保留这些命令，避免后续发版遗漏。

## 状态关系

- 替代 ADR：无。
- 废弃原因：无。

## 参考

- `README.md`
- `package.json`
- `skills.json`
- `docs/adr/README.md`
