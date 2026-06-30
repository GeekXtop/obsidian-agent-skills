---
name: obdoc
description: 从当前对话、用户粘贴材料、命令输出、本地文件、项目材料或 Codex session id 中整理可独立阅读的 Obsidian 文档。适用于用户要求提取配置文档、服务器配置、教程、运维 runbook、迁移指南、排障记录、配置参考、操作手册，或希望把一次 Codex 会话整理成 Obsidian 长文档。不要用于只提取短经验条目；短经验沉淀使用 oblearn。
---

# Obdoc

从会话和材料中整理“文档型输出”，写入或建议写入 Obsidian。文档是一等知识库产物，面向人类实践的可读、可执行、可复盘和可迁移使用，不是短知识条目。

## 职责边界

`obdoc` 负责生成结构化文档：

- 配置文档：当前配置、关键参数、地址规划、规则清单、验证结果。
- 教程：前提、步骤、命令、图形界面路径、验证和常见问题。
- Runbook：触发条件、检查顺序、修复步骤、回滚和风险。
- 迁移或排障记录：背景、过程、最终状态、证据和遗留问题。

文档的复用方式是让人或后续 agent 理解上下文、替换本地参数并照着实践；文档里可以保留经过确认和脱敏的当前环境值、验证证据和回滚信息。短经验条目则是从文档或项目材料中抽出的规则、检查项或启发式判断。

`obdoc` 不负责：

- 把经验压缩成跨场景短条目；那是 `$oblearn`。
- 整理、移动、合并、重命名公共知识库；那是 `$obcurate`。
- 记录项目架构决策；那是 `$obadr`。
- 回写当前项目收尾状态；那是 `$obclose`。

完成文档后，如发现可复用经验，只在文档中列出“可提取知识候选”，不要自动混写到公共知识条目；用户要求继续沉淀时再使用 `$oblearn`。

## 运行时假设

- 涉及 Obsidian 写入时，假设 Obsidian 桌面端已打开目标 vault，且 `obsidian` CLI 可用。
- 构建、测试、部署和运行时不能依赖私人 vault；Obsidian 只作为文档写入目标。
- Codex session id 只作为用户授权和定位线索；只读取本机 Codex 会话存储中精确匹配的 transcript。
- 默认使用用户或项目既有语言偏好；当前模板使用简体中文。路径、命令、包名和英文专有名词保持原样。

## 输入来源

可用输入：

- 当前对话中明确出现的事实、命令、错误、结论和用户偏好。
- 用户粘贴的 transcript、命令输出、配置片段、截图说明或会话摘要。
- 用户明确指定的本地文件、项目文档、`.agents/` memory、ADR、计划或配置文件。
- 用户提供的 Codex session id，且本机能精确定位对应 JSONL。

如果用户只说“之前那次”“昨天那个会话”但没有 transcript、摘要、文件路径或 Codex session id，不要假装能自动读取历史；请用户补充可定位材料。

## Codex Session ID

用户提供 Codex session id 时：

- 只查找 `$CODEX_HOME/session_index.jsonl`、`$CODEX_HOME/sessions/`、`$CODEX_HOME/archived_sessions/`；未设置 `$CODEX_HOME` 时使用用户主目录下的 `.codex`。
- 只用完整 ID 做 fixed-string 精确匹配，不按关键词、日期、标题或项目名扩大扫描。
- 优先使用文件名或 `session_meta.session_id` / `payload.id` 精确等于该 ID 的 JSONL。
- 如果只命中其他会话的 `forked_from_id`，那不是目标 transcript；继续查找目标 ID，找不到就说明。
- 不运行 `codex resume <id>` 读取 transcript；`resume` 是恢复交互会话，不是导出命令。
- 找到唯一 JSONL 后，只抽取 user / assistant / tool 事件中与目标文档相关的事实、步骤、命令、验证和结论；不要把完整聊天流水写入 Obsidian。
- 找不到或命中不唯一时，请用户提供摘要、导出的 transcript 或明确文件路径。

## 输出目标

`obdoc` 只写入 `Agent/Documents/`，不写入 `Agent/Knowledge/`。`Agent/Documents/` 保存可独立阅读的文档、runbook、guide、reference、evidence 和 troubleshooting；`Agent/Knowledge/` 保存 `$oblearn` 提取的短经验、规则、检查清单和启发式判断。

不要固定目录。先根据用户指定路径、已有明确命中文档、当前 vault 习惯和文档用途判断目标；不稳定时先建议写入 `Agent/Documents/Inbox/` 并等待确认。稳定归类、移动、合并或拆分交给 `$obcurate`。

候选路径示例，不是选择规则：

```text
Agent/Documents/<主题>.md
Agent/Documents/Guides/<主题>.md
Agent/Documents/Runbooks/<主题>.md
Agent/Documents/Configs/<主题>.md
Agent/Documents/Inbox/<主题>.md
```

使用路径时遵循这些原则：

- 用户指定路径优先。
- 已有明确命中文档优先更新或链接，不为分类整洁而强行新建目录。
- vault 已有同类文档结构时，跟随既有结构。
- 主题未稳定、隐私脱敏未确认、目标分类不明确时，建议 `Agent/Documents/Inbox/`，并设置 `status: draft`。
- 用户明确要求项目内文档时，可写入项目 `docs/`；否则默认写入 Obsidian。

`obdoc` 新建文档使用 `kind: document` 和 `source_skill: obdoc`。机器层使用英文 token，中文展示用于正文、整理计划和完成说明，例如“类型：文档（`kind: document`）”“用途：操作手册（`use_as: runbook`）”。

`doc_type` 和 `source` 是自由描述字段，不是固定枚举。`doc_type` 使用用户材料中的真实文档类型或自然语言短语，例如“服务器配置说明”“GUI 迁移教程”“值班检查 runbook”“排障复盘”。`source` 写实际输入来源，可以是一个或多个来源，例如“当前对话 + 本地配置文件”“Codex session + 用户补充说明”。字段值由材料事实决定。

## Tags

`tags` 是辅助 metadata，用于 Obsidian UI、Bases、Dataview、人工筛选和低频整理辅助，不作为 agent 发现入口。文档目录以 `Agent/Documents/_catalog.md` 为准；agent 只有在用户明确指定、任务明确涉及该文档主题，或正在执行 `$obcurate` 文档整理时才读取。

文档模板保留 `tags: []` 槽位。只有存在稳定用途时才填写粗粒度 tag，例如 `agent/document`、`ops/runbook` 或 `network/migration`。不要用 tags 替代 `kind: document`、`source_skill: obdoc`、`doc_type`、`sensitivity` 或 catalog 入口。

## Obsidian 查找

写入前做有限查找，避免重复文档：

```bash
obsidian read path="Agent/Documents/_catalog.md"
obsidian search query="<主题关键词>" limit=5
obsidian read path="<明确命中的文档路径>"
```

搜索词必须来自用户材料中的平台、技术栈、服务名、错误信息、命令名或文档主题。搜索范围保持为有限关键词定向搜索。

如果命中已有文档：

- 用户要求“更新/补充”时，追加或局部修订。
- 用户要求“新整理一篇”时，可以新建草稿并在“相关”中链接已有文档。
- 命中不明确时，列出候选并等待用户确认。

## Obsidian 写入

Obsidian Markdown 写入统一使用 vault 文件：根据目标 `path` 确定 vault 本地文件系统路径，将生成后的完整 Markdown 写入或更新对应 `.md` 文件。新建、覆盖和局部更新都走文件写入路径。

`obsidian` CLI 用于查找、读取和写入后读回校验。无法确定目标 vault 的本地文件系统路径时，先说明需要目标 vault 路径或让用户确认可写位置，再执行文件写入。

## 文档生成流程

1. 明确文档目标：配置参考、教程、runbook、迁移记录、排障记录或混合文档。
2. 确定输入范围：当前对话、粘贴材料、Codex session id、本地文件或项目材料。
3. 读取材料，只保留目标文档需要的事实、步骤、命令、验证和结论。
4. 标记需要脱敏的内容：secret、账号、token、客户信息、内网细节、绝对路径、设备唯一标识。
5. 区分已验证事实、用户偏好、推断和未解决问题；不要把猜测写成事实。
6. 选择目标路径；用户指定路径优先，不要固定目录；不稳定时先建议 `Agent/Documents/Inbox/` 并等待确认。
7. 按 `templates/document-note.md` 生成或更新文档。
8. 如材料证据复杂，在文档末尾加入 `templates/source-evidence.md` 的短证据摘要，不复制完整聊天流水。
9. 写入后读回目标文档，检查标题、路径、frontmatter、命令块、脱敏点和可执行步骤。
10. 如果文档标题、路径、主题和敏感度明确，对 `Agent/Documents/_catalog.md` 做最小明确更新；不明确时只列 Documents catalog 建议。
11. 在完成说明中列出输入来源、写入路径、是否更新已有文档、脱敏处理和可提取知识候选。

## 文档质量

文档必须：

- 标题能说明平台、任务和范围。
- 面向人类实践可读、可执行、可复用；读者应能按前提、步骤、验证和回滚完成同类任务。
- 前提条件清楚，尤其是网络、权限、版本、备份和回滚条件。
- 步骤能照着执行，命令块完整且有上下文。
- 配置值分清“示例值”和“来自材料的当前值”；当前环境值可以保留在文档中，但要通过 `sensitivity`、来源摘要和上下文说明限制复用方式。
- 验证方法可复现，包含成功判断。
- 风险和回滚不空泛。
- 来源摘要足以追溯结论，但不暴露完整聊天原文。
- `## 相关` 记录与文档主题有真实主题关联的相关链接；没有明确相关资料时保留空小节或省略内容。

不要写入：

- 不写 secret、账号、token、密钥、客户数据、隐私信息。
- 未经用户确认的敏感内网拓扑或设备唯一标识。
- 大段聊天流水、工具输出原文或截图路径。
- 与文档目标无关的临时任务状态。

## 与 Oblearn 的关系

`obdoc` 产出文档，`$oblearn` 产出短经验条目。

同一份材料可以先用 `obdoc` 写教程或配置文档，再用 `$oblearn` 提取少量跨场景经验。经验条目由 `$oblearn` 处理；`obdoc` 只为本次实际创建或更新的文档维护 `Agent/Documents/_catalog.md`。

## Documents Catalog 最小更新

`obdoc` 不写 `Agent/Knowledge/_catalog.md`。文档实际写入 `Agent/Documents/` 且标题、路径、主题和敏感度明确时，才更新 `Agent/Documents/_catalog.md`。最小更新只允许为本次文档新增一个入口，或为已存在的匹配入口追加少量明确 `terms`、`aliases`、`kind`、`use_as`、`sensitivity` 或 `notes`。文档入口使用 `kind: document`，`use_as` 通常是 `guide`、`runbook`、`reference` 或 `evidence`，表示它是一等知识库产物，供人类实践和后续 agent 作为可阅读上下文、操作手册或证据使用；读取后不能把正文里的当前环境值直接泛化成公共经验规则。

不要在 `obdoc` 中移动、重命名、合并、拆分、删除 catalog 入口，也不要为项目内 `docs/` 文档登记公共知识 catalog。结构性 Documents catalog 维护交给 `$obcurate`。

## 完成说明

结束时只汇报：

- 使用了哪些输入材料。
- 写入或建议写入了哪些 Obsidian 文档路径。
- 文档类型和状态。
- 是否更新了已有文档。
- 做了哪些脱敏或省略。
- 发现了哪些可提取知识候选，是否需要后续 `$oblearn`。
