# Agent 工作约定

Obsidian 项目笔记：`Agent/Projects/obsidian-agent-skills.md`。

## 规则入口

- 修改代码前先读本文件，确认 memory 位置、Obsidian 项目笔记和当前工作范围。
- 仓库已有通用指南：`AGENTS.md`。
- Claude Code 专用指南：`CLAUDE.md`。
- 项目说明、安装方式和开发命令：`README.md`。
- package metadata：`package.json`、`skills.json`。
- 如果需要项目结构、命令、测试、架构或提交规范细节，读取上述源文件，不要依赖本文件的二次摘要。
- 不要把 `AGENTS.md` / `CLAUDE.md` / `README.md` / docs 的长内容完整复制进本文件。

## 自举门禁

本仓库同时是 ob* skill 的源码仓库，执行者手上的插件版本不一定等于仓库当前契约。写 memory 或改 skill 之前先做一次自检。

- 当前 memory 代际：v2，对应插件版本 `0.1.28` 及以上；代际定义和迁移清单见 `skills/obinit/references/memory-upgrade.md`。
- 代际标记只在本版**已发布且执行者已更新插件**后推进：仓库先把 v3 契约写进模板，但加载到的插件仍是 v2 时，按 v2 行事；0.1.29 发布并 reload 后再把本行改为 v3 / `0.1.29`。
- 自检依据是你**实际加载到的 skill 正文**，不是版本号：加载到的 `$obclose` 正文如果没有 `## handoffs 目录` 一节，或 `$obinit` 正文没有 `references/memory-upgrade.md` 指针，就判定插件过旧。
- 判定插件过旧时：只做只读分析和代码阅读，不执行 `$obinit`、`$obclose`、`$oblearn`、`$obdoc`、`$obadr`、`$obcurate` 的写入，不改 `.agents/`。
- 恢复方式：按 `docs/adr/0001-use-marketplace-plugin-update-flow.md` 更新插件，reload 或重启客户端后继续。

## 初始化范围

项目初始化阶段，agent 只能创建或更新：

- `AGENTS.md`
- `CLAUDE.md`
- `.agents/`
- `docs/adr/`
- `.gitignore` 中的 `.agents/scratch/` 条目

其他路径必须等待用户明确要求。

## 日常工作

- 只修改用户任务范围内的代码和文档。
- 批量移动、删除、重命名、改生成文件、改依赖或重组文档前先问用户。
- 构建、测试、部署和运行时不能依赖私人笔记、本地 vault 或个人工具。
- 任务开始或遇到相关问题时，不凭空假设哪些领域已有公共知识；仅在用户明确要求、`Agent/Knowledge/_catalog.md` 命中任务关键词，或风险较高且关键词明确时，在 `Agent/Knowledge/` 做有限关键词定向搜索；命中相关笔记后再明确读取并使用，不全量自动加载。

## 项目相关知识

- 项目类型：`confirmed`（Agent Skills 仓库，发布为 Codex / Claude Code marketplace 插件）。
- 相关知识：
  - `[[Marketplace 插件更新流程]]`：`kind: knowledge` / `use_as: runbook`，用于本仓库插件发布、本地更新和 reload/restart 验证。
  - `[[Skill 行为规则使用正向 contract]]`：`kind: knowledge` / `use_as: rule`，用于维护 `SKILL.md`、模板和校验脚本时的写法约束。

## 记忆库

- 任务开始时在 `.agents/handoffs/` 创建自己的交接文件（会话、任务、涉及文件）。
- 阶段完成、会话收尾时更新 `.agents/active.md`；它是派生视图，由 `$obclose` 从 handoffs、`docs/adr/` 和 Obsidian 项目笔记重建。
- 完成实质代码/文档改动、阶段性验证或复杂任务暂停时，按 `$obclose` 收尾。
- 有明确里程碑时更新 `.agents/progress.md`。
- 只有可复用经验才更新 `.agents/lessons.md`。
- 使用 lessons 经验或公共知识时发现与当前证据矛盾，按证据强度分级执行使用中证伪：有直接证伪证据（检查实际执行且失败、引用对象已不存在）就地标已退役（`deprecated`）并附证据；仅怀疑、无直接证据时标待复核（`needs-review`）并附理由；正常使用不强制回写，由 `$obclose` 收尾时统一更新 `最后验证` / `last_verified`。`.agents/lessons.md` 中 `状态` 为已退役（`deprecated`）或待复核（`needs-review`）的条目不作为有效经验使用，已退役条目只作为反例背景。
- 当状态已由权威状态载体记录时（git commit、tag、PR、CI/CD、release、artifact、ADR、migration、issue/ticket、runbook），`.agents/active.md` / `.agents/progress.md` 只记录下一次 agent 需要接手的未完成事项、不在权威载体中的决策背景、阻塞或人工确认点；不记录短暂中间态，已完成状态在最终回复说明。
- `.agents/archive/` 保存过长 `progress.md` 的历史归档，应提交。
- 长期项目决策写入 `docs/adr/`。
- 如已有设计/计划文档（无论由哪个工具生成），在 `.agents/active.md` 链接当前文件，不复制全文。
- 临时调查草稿写入 `.agents/scratch/`；运行日志、缓存和生成物不要放进 agent memory。

## 文档地图

- `docs/README.md` 是项目文档的事实源地图：登记每个当前状态文档的事实范围和同步触发。初始化时建立，内容由项目自填。
- 改行为之前先读文档地图，定位受影响的文档与节；改动与文档更新同批提交。
- 写实施计划时把受影响文档的**节标题**写进每个任务的改动点，不要留到实现完再补。
- 新增、改名或下掉文档时同批更新文档地图；地图里未定位的条目按「先定位再改行为」处理。
- 设计稿、实施计划等时点快照不进文档地图：它们记录当时的判断，不随后续改动更新。
- 有意保留旧写法或刻意不改的条目，在对应行注明「有意保留」，避免重复运行 `$obinit` 时被反复报告为差异。
- 体积预算：本文件是每个任务开始都要读的规则源头，保持 **8 KB** 以内；只收约束和入口链接，细节放 `docs/README.md`、`docs/adr/` 和项目既有文档。文档地图保持 **4 KB** 以内。

## 重复运行

- 如果入口提示已经存在，不要重复追加。
- 如果 `.agents/` 文件已经存在，保留现有内容，只补缺失段落或缺失文件。
- 如果现有规则之间冲突，停止修改冲突文件并向用户列出待确认项。

## 协作策略

本节由项目自行约定；未填写时按单会话假设处理。

- 并行策略：
- 认领位置：
- worktree 使用：
