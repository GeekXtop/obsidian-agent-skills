# 当前状态

## 当前任务

- 目标：发布 `0.1.19` 并更新本地插件安装。
- 状态：发版准备完成，待提交、打 tag、推送和本地插件更新。
- 最后更新：2026-06-27

## 当前状态

- 本轮待发布内容：同步五个 Obsidian agent skills 的职责边界，补齐 `$obclose` 主动收尾、archive 归档和 `$oblearn` 跨项目提取语义。
- `$obclose` 发现层已同步到 `skills.json`、`README.md`、`skills/obclose/agents/openai.yaml`、`.codex-plugin/plugin.json`。
- `$obinit` 已补 `.agents/archive/` 约定：过长 `progress.md` 的历史归档应提交，不同于 `scratch/`。
- `$oblearn` 已收窄触发：项目内经验先由 `$obclose` 写入 `.agents/lessons.md`，只有需要转成跨项目公共知识时才用 `$oblearn`。
- `$oblearn` 已补 archive 读取规则：仅在 active/progress/lessons 指向归档、用户要求长期复盘或候选知识需要旧阶段证据时读取相关归档，不全量扫描。
- 版本号已从 `0.1.18` 推进到 `0.1.19`：`package.json`、`skills.json`、`.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json`、`.codex-plugin/plugin.json`。
- 按 ADR，发版只创建 `obsidian-agent-skills--v0.1.19`，不创建平行 `v0.1.19`。

## 验证

- 红灯检查：`rg -n "主动执行|实质任务|膨胀|过长|archive|归档|obcurate" skills\obclose\SKILL.md commands\obclose.md` 修改前无命中。
- 绿灯检查：`rg -n "主动执行|实质任务|Memory 维护|膨胀|过长|归档|obcurate|oblearn" skills\obclose\SKILL.md commands\obclose.md` 修改后命中目标规则。
- 五项同步检查：`rg -n "主动执行|主动收尾|实质任务|memory 膨胀|archive|归档|跨项目公共知识|已记录的项目经验" README.md skills.json skills\obclose\agents\openai.yaml skills\obinit skills\oblearn\SKILL.md .agents` 命中目标规则。
- 旧触发词检查：`rg -n "任务完成后记录踩坑|记录踩坑" skills\oblearn\SKILL.md README.md skills.json commands\oblearn.md` 无命中。
- 版本一致性检查：`rg -n '"version": "0\.1\.19"|"version": "0\.1\.18"' package.json skills.json .claude-plugin .codex-plugin` 仅命中 `0.1.19`。
- 命令：`npm test`。
- 结果：通过，`All skills are valid.`

## 关键文件

- `.agents/instructions.md`：成熟项目索引和 memory 协议。
- `.agents/progress.md`：阶段性进展摘要。
- `.agents/lessons.md`：可复用经验。
- `.agents/archive/`：过长 `progress.md` 的历史归档，应提交。
- `commands/obclose.md`：`$obclose` 命令说明。
- `skills/obclose/SKILL.md`：`$obclose` 收尾、主动触发和 memory 维护规则。
- `skills/obinit/SKILL.md`、`skills/obinit/references/memory-bank.md`、`skills/obinit/templates/`：初始化和模板 memory 规则。
- `skills/oblearn/SKILL.md`：跨项目公共知识提取和 archive 输入范围。
- `README.md`、`skills.json`、`skills/obclose/agents/openai.yaml`：发现层说明。
- `package.json`、`.claude-plugin/`、`.codex-plugin/`：发布版本 metadata。
- `docs/adr/`：架构决策记录。
- `docs/adr/0001-use-marketplace-plugin-update-flow.md`：插件更新流程 ADR。

## 当前 ADR

- [0001-use-marketplace-plugin-update-flow.md](../docs/adr/0001-use-marketplace-plugin-update-flow.md)：使用 marketplace/plugin 命令更新本地插件。

## 下一步

1. 提交 `Release v0.1.19`。
2. 创建并推送 `obsidian-agent-skills--v0.1.19`。
3. 按 README/ADR 运行 Codex 和 Claude Code 插件更新命令，并验证本地版本。

## 已使用知识

- 无新增公共知识使用。

## 已提取知识

- 本轮未提取公共知识；如后续需要将“项目 memory 收尾触发策略 / archive 归档策略”公共化，再运行 `$oblearn`。

## Obsidian

- 项目笔记：`Agent/Projects/obsidian-agent-skills.md`
