# 当前状态

## 当前任务

- 目标：发布 `0.1.20` 并更新本地插件安装。
- 状态：发版准备已完成；待提交、tag、推送和本地插件更新。
- 最后更新：2026-06-27

## 当前状态

- `$oblearn` 已支持非项目临时会话模式：当前目录没有项目 memory，或用户明确要求从当前对话、粘贴 transcript、临时任务摘要、Codex session id 中提取经验时，不要求先 `$obinit`。
- `$oblearn` 模式选择已改为显式非项目材料优先：用户提供临时会话摘要、transcript、Codex session id 或指定非项目材料时，即使当前目录存在项目 memory，也按非项目临时会话模式处理。
- `$oblearn` 非项目模式只使用当前对话、用户摘要、transcript、明确指定材料，或能精确定位的 Codex session JSONL；如果用户提到历史 Codex app 对话但未提供摘要、记录或 session id，需先请用户补充关键事实。
- `$oblearn` 支持用户提供 Codex session id 后，在 `$CODEX_HOME/session_index.jsonl`、`$CODEX_HOME/sessions/`、`$CODEX_HOME/archived_sessions/` 做完整 ID fixed-string 精确查找；未设置 `$CODEX_HOME` 时使用用户主目录下的 `.codex`，Windows 通常是 `%USERPROFILE%\.codex`，macOS/Linux 通常是 `~/.codex`。
- `$oblearn` 不用 `codex resume <id>` 读取 transcript；`resume` 只用于恢复交互会话。只命中其他会话的 `forked_from_id` 时不等于找到目标 transcript。
- `$oblearn` 非项目模式默认建议写入 `Agent/Knowledge/Inbox/<简短主题>.md`，不创建 `.agents/`、`docs/adr/`、项目 Obsidian 笔记或项目 memory。
- `$oblearn` 非项目模式的主题命名应从候选知识核心适用范围提炼，使用平台、技术栈、命令、错误类型、风险类型或工作流类型等真实信号；不要把说明性示例、会话背景或临时任务外壳当成固定分类。
- `$oblearn` 非项目模式仍按 `_catalog.md` + 关键词定向搜索，不全 vault 扫描，并要求脱敏本机路径、隐私、secret、账号等信息。
- `$oblearn` 发现层已同步到 `commands/oblearn.md`、`README.md`、`skills.json`、`skills/oblearn/agents/openai.yaml`、`.codex-plugin/plugin.json`。
- `$obadr` 新增“历史材料读取”规则：读取历史材料只为避免重复 ADR 或补足当前决策背景，不用于寻找决策灵感。
- `$obadr` 默认只读取 `.agents/active.md`、必要的 `.agents/progress.md`、`docs/adr/` 的索引/标题/相关 ADR。
- `$obadr` 只有在用户指定、当前 memory/ADR 明确链接、或当前决策必须依赖历史阶段证据时，才读取额外历史材料。
- `$obadr` 明确禁止全量扫描 `.agents/archive/`、全量读取历史 `progress`、为找灵感遍历 `docs/`、把历史计划/进展/ADR 原文复制进新 ADR。
- 本轮发版版本：`0.1.20`。
- 本轮待发布内容：同步五个 Obsidian agent skills 的职责边界，补齐 `$obclose` 主动收尾、archive 归档和 `$oblearn` 跨项目提取语义。
- `$obclose` 发现层已同步到 `skills.json`、`README.md`、`skills/obclose/agents/openai.yaml`、`.codex-plugin/plugin.json`。
- `$obinit` 已补 `.agents/archive/` 约定：过长 `progress.md` 的历史归档应提交，不同于 `scratch/`。
- `$oblearn` 已收窄触发：项目内经验先由 `$obclose` 写入 `.agents/lessons.md`，只有需要转成跨项目公共知识时才用 `$oblearn`。
- `$oblearn` 已补 archive 读取规则：仅在 active/progress/lessons 指向归档、用户要求长期复盘或候选知识需要旧阶段证据时读取相关归档，不全量扫描。
- 版本号已从 `0.1.19` 推进到 `0.1.20`：`package.json`、`skills.json`、`.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json`、`.codex-plugin/plugin.json`。
- 按 ADR，发版只创建并推送 `obsidian-agent-skills--v0.1.19`，未创建平行 `v0.1.19`。
- 本地更新已按 marketplace/plugin 流程完成：`codex plugin add obsidian-agent-skills@obsidian-agent-skills` 安装到 `0.1.19`；`claude plugin update obsidian-agent-skills@obsidian-agent-skills --scope user` 从 `0.1.18` 更新到 `0.1.19`。
- 注意：Claude Code 输出提示需要 restart 才能应用新插件；Codex 当前会话也需要重启或开新会话才能加载新 skill 内容。

## 验证

- `$oblearn` 红灯检查：`rg -n "非项目|临时会话|项目外|ad hoc|当前对话|transcript|obinit" skills\oblearn\SKILL.md commands\oblearn.md README.md skills.json .codex-plugin\plugin.json skills\oblearn\agents\openai.yaml` 修改前只命中既有 `$obinit` 和项目语义，未覆盖非项目临时会话规则。
- `$oblearn` 绿灯检查：`rg -n "非项目临时会话|不要求先|当前对话|transcript|不回写项目 memory|临时会话" skills\oblearn\SKILL.md commands\oblearn.md README.md skills.json .codex-plugin\plugin.json skills\oblearn\agents\openai.yaml` 修改后命中目标规则。
- `$oblearn` session ID 绿灯检查：`rg -n "Codex session|session id|session_id|session_index\.jsonl|sessions/|archived_sessions|codex resume|fixed-string|forked_from_id|JSONL|会话 ID" skills\oblearn\SKILL.md commands\oblearn.md README.md skills.json .codex-plugin\plugin.json skills\oblearn\agents\openai.yaml` 命中目标规则。
- `$oblearn` 模式优先级检查：`rg -n "明确提供临时会话摘要|指定非项目材料|即使当前目录存在项目 memory|没有指定非项目材料" skills\oblearn\SKILL.md` 命中目标规则。
- 版本一致性检查：`rg -n '"version": "0\.1\.(19|20)"' package.json skills.json .claude-plugin .codex-plugin` 仅命中 `0.1.20`。
- 命令：`npm test`。
- 结果：通过，`All skills are valid.`
- `$obadr` 红灯检查：`rg -n "archive|归档|全量扫描|全量读取|开放式|找灵感|遍历 docs|历史材料读取" skills\obadr\SKILL.md` 修改前无命中。
- `$obadr` 绿灯检查：`rg -n "历史材料读取|全量扫描|全量读取|寻找决策灵感|遍历 `docs/`|\.agents/archive" skills\obadr\SKILL.md` 修改后命中目标规则。
- 红灯检查：`rg -n "主动执行|实质任务|膨胀|过长|archive|归档|obcurate" skills\obclose\SKILL.md commands\obclose.md` 修改前无命中。
- 绿灯检查：`rg -n "主动执行|实质任务|Memory 维护|膨胀|过长|归档|obcurate|oblearn" skills\obclose\SKILL.md commands\obclose.md` 修改后命中目标规则。
- 五项同步检查：`rg -n "主动执行|主动收尾|实质任务|memory 膨胀|archive|归档|跨项目公共知识|已记录的项目经验" README.md skills.json skills\obclose\agents\openai.yaml skills\obinit skills\oblearn\SKILL.md .agents` 命中目标规则。
- 旧触发词检查：`rg -n "任务完成后记录踩坑|记录踩坑" skills\oblearn\SKILL.md README.md skills.json commands\oblearn.md` 无命中。
- 0.1.19 版本一致性检查：`rg -n '"version": "0\.1\.19"|"version": "0\.1\.18"' package.json skills.json .claude-plugin .codex-plugin` 仅命中 `0.1.19`。
- 命令：`npm test`。
- 结果：通过，`All skills are valid.`
- Git：提交 `ffbe90b Release v0.1.19` 已推送到 `origin/main`；tag `obsidian-agent-skills--v0.1.19` 已推送。
- 本地插件验证：`codex plugin list --json` 和 `claude plugin list --json` 均显示 `obsidian-agent-skills@obsidian-agent-skills` 版本 `0.1.19`。

## 关键文件

- `.agents/instructions.md`：成熟项目索引和 memory 协议。
- `.agents/progress.md`：阶段性进展摘要。
- `.agents/lessons.md`：可复用经验。
- `.agents/archive/`：过长 `progress.md` 的历史归档，应提交。
- `commands/obclose.md`：`$obclose` 命令说明。
- `skills/obclose/SKILL.md`：`$obclose` 收尾、主动触发和 memory 维护规则。
- `skills/obinit/SKILL.md`、`skills/obinit/references/memory-bank.md`、`skills/obinit/templates/`：初始化和模板 memory 规则。
- `skills/oblearn/SKILL.md`：跨项目公共知识提取和 archive 输入范围。
- `commands/oblearn.md`、`skills/oblearn/agents/openai.yaml`：`$oblearn` 命令和 UI 入口说明。
- `skills/obadr/SKILL.md`：ADR 记录、现有 ADR 去重和历史材料读取边界。
- `README.md`、`skills.json`、`skills/obclose/agents/openai.yaml`：发现层说明。
- `package.json`、`.claude-plugin/`、`.codex-plugin/`：发布版本 metadata。
- `docs/adr/`：架构决策记录。
- `docs/adr/0001-use-marketplace-plugin-update-flow.md`：插件更新流程 ADR。

## 当前 ADR

- [0001-use-marketplace-plugin-update-flow.md](../docs/adr/0001-use-marketplace-plugin-update-flow.md)：使用 marketplace/plugin 命令更新本地插件。

## 下一步

1. 提交 `0.1.20` 发版改动。
2. 创建并推送 `obsidian-agent-skills--v0.1.20` tag。
3. 按 ADR 用 marketplace/plugin 命令更新本地 Codex / Claude Code 插件。

## 已使用知识

- 无新增公共知识使用。

## 已提取知识

- 本轮未提取公共知识；如后续需要将“项目 memory 收尾触发策略 / archive 归档策略”公共化，再运行 `$oblearn`。

## Obsidian

- 项目笔记：`Agent/Projects/obsidian-agent-skills.md`
