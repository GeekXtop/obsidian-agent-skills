# 当前状态

## 当前任务

- 目标：把 `.agents/` 从共享可变状态改造为「追加日志 + 派生视图」，并清理 skills 中的工具耦合。
- Plan：`docs/superpowers/plans/2026-09-09-multi-session-memory-and-generality.md`。
- 状态：Task 1-7 全部完成并通过验证，改动尚未提交。
- 最后更新：2026-09-09

## 当前状态

- 已完成：新增 `.agents/handoffs/` 每会话交接机制（模板、命名、生命周期、12 小时新鲜度、独立上限），`active.md` 降级为可重建的派生视图。
- 已完成：progress 条目加 `来源` 归因；`$obclose` 收尾输出 memory 占用；obinit 两个 instructions 模板加空「协作策略」占位节，任务开始的认领动作改为创建 handoff。
- 已完成：普适性清理——移除 `docs/superpowers/` 硬编码（改为发现并遵守既有结构），会话记录抽象为通用能力（Codex 降级为示例），`inspect-project.mjs` 输出 `docs/` 顶层结构，新增禁硬编码路径与策略词断言。
- 已完成：新增 `references/memory-upgrade.md` 与重复运行模式的差异检测——存量项目可按 v1 → v2 清单收敛，机制只报告不自动改写。
- 阻塞：无。

## 验证

- `npm test` 输出 `All skills are valid. (6 skills checked)`。
- 本批 7 个新断言在临时副本上全部红灯：handoff 字段、progress 来源行、active 派生声明、协作策略节、硬编码工具路径、策略词、docsTopLevel fixture。
- 占用：obinit 1860/2000、obadr 1665/5000、obclose 3266/5000、obdoc 2965/5000、obcurate 3990/5000、oblearn 4589/5000。
- 端到端验证：本仓库作为「无标记、手工漂移」样本，逐节对比发现「协作策略 / 重复运行」顺序差异，按报告执行最小改动后差异归零。
- 累计改动（三批整改 + 本批）尚未提交、未发版。

## 关键文件

- `scripts/validate-skills.mjs`
- `skills/obclose/SKILL.md`、`skills/obclose/templates/handoff.md`（新增）、`skills/obclose/templates/active.md`
- `skills/obinit/SKILL.md`、`skills/obinit/references/memory-bank.md`、`skills/obinit/templates/instructions.md`、`skills/obinit/templates/instructions-index.md`、`skills/obinit/scripts/inspect-project.mjs`
- `skills/oblearn/SKILL.md`、`skills/obdoc/SKILL.md`、`skills/obadr/templates/progress-entry.md`
- `docs/superpowers/plans/2026-09-09-multi-session-memory-and-generality.md`

## 下一步

1. 用户 review 全部 diff 后决定是否提交、是否发版（`npm run version:set -- <版本>`）。
2. 首个使用 `.agents/handoffs/` 的任务结束后，按实际校准 12 小时新鲜度阈值与 30 文件 / 200 KB 上限。
3. 未决项：既有 `docs/superpowers/` 结构是否改用中性路径（破坏性，需用户确认）。

## 当前 ADR

- [0001-use-marketplace-plugin-update-flow.md](../docs/adr/0001-use-marketplace-plugin-update-flow.md)：使用 marketplace/plugin 命令更新本地插件。

## 已使用知识

- [[Skill 行为规则使用正向 contract]]：本次整改按其规则书写新规则。

## Obsidian

- 项目笔记：`Agent/Projects/obsidian-agent-skills.md`
