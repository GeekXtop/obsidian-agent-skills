# 进展记录

本文件只记录阶段性进展摘要，不记录聊天流水。

## 2026-06-23 - 项目初始化

- 已完成：创建 `.agents/` memory 结构和 `docs/adr/` 入口；保留既有 `AGENTS.md` / `CLAUDE.md` 并追加 memory 指针。
- 已验证：`npm test` 通过，输出 `All skills are valid.`。
- 下一步：在后续任务开始或收尾时更新 `.agents/active.md`。

## 2026-06-25 - 公共知识边界调整

- 已完成：新增 `$obcurate` skill，负责整理 `Agent/Knowledge/`、清理 Inbox、维护 `_catalog.md`、合并/拆分/重命名知识笔记。
- 已完成：收窄 `$oblearn` 职责，只负责提取、脱敏、追加/新建公共知识，并在关键词明确时更新 `_catalog.md`。
- 已完成：更新 `$obinit` 生成规则，公共知识检索不再凭空假设领域，优先以 `Agent/Knowledge/_catalog.md` 为事实来源。
- 已验证：`npm test` 通过，输出 `All skills are valid.`。

## 2026-06-25 - 插件更新流程 ADR

- ADR：新增 `docs/adr/0001-use-marketplace-plugin-update-flow.md`，记录本地插件更新必须走 marketplace/plugin 管理器，并在更新后 reload、重启或开启新会话。
- 已完成：README 增加 Obsidian 使用前提、Codex / Claude Code 插件更新命令和版本验证命令。
- 已提取：公共知识 `[[Marketplace 插件更新流程]]` 写入 `Agent/Knowledge/Inbox/`，并登记到 `Agent/Knowledge/_catalog.md`。

## 2026-06-26 - 发布 tag 约定

- 已完成：README 和插件更新流程 ADR 记录后续发版只创建 `obsidian-agent-skills--vX.Y.Z`，不再额外创建平行的 `vX.Y.Z` tag。
- 已保留：历史 `v0.1.x` tag 不主动删除，避免影响已发布引用。
- 已验证：`npm test` 通过，输出 `All skills are valid.`。

## 2026-06-27 - obclose 主动收尾与 memory 膨胀控制

- 已完成：`$obclose` 增加主动触发规则，明确 agent 在完成实质代码/文档改动、阶段性验证、复杂任务暂停或发现项目内可复用经验时应主动收尾。
- 已完成：`$obclose` 增加跳过条件，轻量问答、无项目状态变化或用户明确要求不更新 memory 时不执行。
- 已完成：`$obclose` 增加项目 memory 维护规则，检查 `progress.md` / `lessons.md` 是否过长或重复；轻量合并、压缩和归档可直接做，拆分 lessons、删除历史、大规模重组需用户确认。
- 已保留：公共知识提取仍由 `$oblearn` 负责，公共知识库整理仍由 `$obcurate` 负责。
- 已验证：目标文本断言通过；`npm test` 通过，输出 `All skills are valid.`。

## 2026-06-27 - 五个 skill 职责边界同步

- 已完成：`$obclose` 的主动收尾和 memory 膨胀控制语义同步到 `README.md`、`skills.json` 和 `skills/obclose/agents/openai.yaml`。
- 已完成：`$obinit` 的 memory 规则和模板补充 `.agents/archive/`，明确它保存过长 `progress.md` 的历史归档，应提交，不同于 `scratch/`。
- 已完成：`$oblearn` 触发描述从“任务完成后记录踩坑”收窄为“把已记录的项目经验转成跨项目公共知识”，避免抢 `$obclose` 的项目内收尾职责。
- 已完成：`$oblearn` 输入范围补充 `.agents/archive/progress-YYYY.md`，仅在当前材料指向归档、用户要求长期复盘或候选知识需要旧阶段证据时读取相关归档。
- 已验证：目标文本断言通过；旧触发词 `任务完成后记录踩坑` / `记录踩坑` 无命中；`npm test` 通过，输出 `All skills are valid.`。

## 2026-06-27 - 0.1.19 发版准备

- 已完成：版本号推进到 `0.1.19`，同步 `package.json`、`skills.json`、`.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json`、`.codex-plugin/plugin.json`。
- 已完成：`.codex-plugin/plugin.json` 的 `$obclose` 默认 prompt 更新为收尾、更新 memory 并检查 `progress/lessons` 轻量维护。
- 已验证：`npm test` 通过，输出 `All skills are valid.`。

## 2026-06-27 - 0.1.19 发布与本地更新

- 已发布：提交 `ffbe90b Release v0.1.19` 已推送到 `origin/main`。
- 已发布：按 ADR 只创建并推送插件 tag `obsidian-agent-skills--v0.1.19`，未创建平行 `v0.1.19`。
- 已更新：Codex marketplace 已 upgrade，并通过 `codex plugin add obsidian-agent-skills@obsidian-agent-skills` 安装到 `0.1.19`。
- 已更新：Claude Code marketplace 已 update，并通过 `claude plugin update obsidian-agent-skills@obsidian-agent-skills --scope user` 从 `0.1.18` 更新到 `0.1.19`。
- 已验证：`codex plugin list --json` 与 `claude plugin list --json` 均显示 `obsidian-agent-skills@obsidian-agent-skills` 版本 `0.1.19`。
- 注意：Claude Code 提示需要 restart 才能应用；Codex 也需要重启或开启新会话加载新 skill。

## 2026-06-27 - obadr 历史材料读取边界

- 已完成：`$obadr` 新增“历史材料读取”小节，明确历史材料只用于避免重复 ADR 或补足当前决策背景。
- 已完成：`$obadr` 明确默认读取 `.agents/active.md`、必要的 `.agents/progress.md`、`docs/adr/` 索引/标题/相关 ADR。
- 已完成：`$obadr` 明确只有用户指定、当前 memory/ADR 明确链接、或当前决策依赖历史阶段证据时，才读取额外历史材料。
- 已完成：`$obadr` 明确禁止全量扫描 `.agents/archive/`、全量读取历史 `progress`、为找灵感遍历 `docs/`、把历史计划/进展/ADR 原文复制进新 ADR。
- 已验证：目标文本断言通过；`npm test` 通过，输出 `All skills are valid.`。
- 备注：按用户要求，本轮只改文档，不发版。

## 2026-06-27 - oblearn 非项目临时会话模式

- 已完成：`$oblearn` 支持从非项目临时会话提取可复用经验；当前目录没有项目 memory 或用户明确要求从当前对话、粘贴 transcript、临时任务摘要、Codex session id 提取经验时，不要求先 `$obinit`。
- 已完成：`$oblearn` 模式选择改为显式非项目材料优先；用户提供临时会话摘要、transcript、Codex session id 或指定非项目材料时，即使当前目录存在项目 memory，也按非项目临时会话模式处理。
- 已完成：`$oblearn` 非项目模式只使用当前对话、用户提供摘要、transcript、明确指定材料，或能精确定位的 Codex session JSONL；无法定位历史 Codex app 对话时要求用户补充关键事实。
- 已完成：`$oblearn` 支持用户提供 Codex session id 后，在 `$CODEX_HOME/session_index.jsonl`、`$CODEX_HOME/sessions/`、`$CODEX_HOME/archived_sessions/` 做完整 ID fixed-string 精确查找；未设置 `$CODEX_HOME` 时使用用户主目录下的 `.codex`，Windows 通常是 `%USERPROFILE%\.codex`，macOS/Linux 通常是 `~/.codex`。
- 已完成：`$oblearn` 明确不使用 `codex resume <id>` 读取 transcript；只命中其他会话的 `forked_from_id` 时不等于找到目标 transcript。
- 已完成：`$oblearn` 非项目模式默认建议写入 `Agent/Knowledge/Inbox/`，不创建 `.agents/`、`docs/adr/`、项目 Obsidian 笔记或项目 memory。
- 已完成：`$oblearn` 非项目模式的主题命名改为从候选知识核心适用范围提炼，使用平台、技术栈、命令、错误类型、风险类型或工作流类型等真实信号，避免把说明性示例、会话背景或临时任务外壳当成固定分类。
- 已完成：`$oblearn` 非项目模式仍使用 `_catalog.md` 和关键词定向搜索，不全 vault 扫描，并要求脱敏本机路径、隐私、secret、账号等信息。
- 已完成：同步更新 `commands/oblearn.md`、`README.md`、`skills.json`、`skills/oblearn/agents/openai.yaml`、`.codex-plugin/plugin.json`。
- 已验证：非项目模式和 session ID 目标文本断言通过；`npm test` 通过，输出 `All skills are valid.`。
- 备注：按用户要求，本轮只改文档，不发版。

## 2026-06-27 - 0.1.20 发版准备

- 已完成：版本号推进到 `0.1.20`，同步 `package.json`、`skills.json`、`.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json`、`.codex-plugin/plugin.json`。
- 已包含：`$obadr` 历史材料读取边界、`$oblearn` 非项目临时会话模式、Codex session id 精确查找、显式非项目材料优先和跨平台 Codex home 路径说明。
- 已同步：`commands/oblearn.md`、`README.md`、`skills/oblearn/agents/openai.yaml`、`.codex-plugin/plugin.json` 的 `$oblearn` 发现层说明。
- 已验证：版本一致性检查通过；`npm test` 通过，输出 `All skills are valid.`。

## 2026-06-27 - 0.1.20 发布与本地更新

- 已发布：提交 `3786dc2 Release v0.1.20` 已推送到 `origin/main`。
- 已发布：按 ADR 只创建并推送插件 tag `obsidian-agent-skills--v0.1.20`，未创建平行 `v0.1.20`。
- 已更新：Codex marketplace 已 upgrade，并通过 `codex plugin add obsidian-agent-skills@obsidian-agent-skills` 安装到 `0.1.20`。
- 已更新：Claude Code marketplace 已 update，并通过 `claude plugin update obsidian-agent-skills@obsidian-agent-skills --scope user` 从 `0.1.19` 更新到 `0.1.20`。
- 已验证：`codex plugin list --json` 与 `claude plugin list --json` 均显示 `obsidian-agent-skills@obsidian-agent-skills` 版本 `0.1.20`。
- 注意：Claude Code 提示需要 restart 才能应用；Codex 也需要重启或开启新会话加载新 skill。

## 2026-06-28 - 发现层与校验脚本质量修复

- 已完成：`scripts/validate-skills.mjs` 增加 `agents/openai.yaml` 内容校验（`interface` 块 + `display_name` / `short_description` / `default_prompt` 非空），补上 README 声称但原先缺失的 OpenAI agent metadata 检查。
- 已完成：`skills/obadr/SKILL.md` frontmatter 补“回写项目 memory 的 ADR 链接”，与 `skills.json` 对齐（obadr 正文确实回写 active/progress）。
- 已完成：`README.md` 开发章节说明 `.codex-plugin` 显式 `skills` 字段与 `.claude-plugin` 约定式发现的差异。
- 已验证：红灯/绿灯断言通过；`npm test` 通过，输出 `All skills are valid.`。
- 备注：本轮只改文档与校验脚本，未改版本号，未提交未推送，等用户决定是否发版。
