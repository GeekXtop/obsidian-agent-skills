---
name: obcurate
description: 整理和维护 Obsidian 公共知识库 `Agent/Knowledge/`。适用于用户要求整理公共知识、清理 Inbox、维护 `Agent/Knowledge/_catalog.md`、合并或拆分知识笔记、重命名主题、修正 aliases/tags/wikilink，或觉得公共知识分类混乱需要低频维护。
---

# Obcurate

整理 `Agent/Knowledge/` 中已经存在的公共知识和文档入口，让后续 agent 更容易发现、判断和复用。它不是经验提取工具；从当前项目提炼新知识使用 `$oblearn`。

## 职责边界

- 维护 `Agent/Knowledge/_catalog.md`，让它成为已沉淀领域的事实来源。
- 清理 `Agent/Knowledge/Inbox/`，把高置信、可复用的笔记移动到稳定主题。
- 修正公共知识笔记和文档的 `title`、`aliases`、tags、`platform`、`topic`、`kind`、`source_skill`、`doc_type`、wikilink 和脱敏状态。
- 合并重复主题，拆分过长或适用范围混杂的笔记。
- 按 `kind: knowledge` / `source_skill: oblearn` 和 `kind: document` / `source_skill: obdoc` 区分短经验知识与可阅读或可执行文档；同目录整理时保留 `doc_type` 等文档类型字段。
- 产物是整理计划、metadata/catalog/wikilink/path 调整和必要的私有化建议。
- 不从当前项目 memory 提取新经验；需要提取时改用 `$oblearn`。
- 文档正文里的可复用经验候选作为后续 `$oblearn` 任务；用户明确要求从文档提炼时，按单独 `$oblearn` 任务处理。
- 不在普通任务开始时检索知识；需要按任务查阅时只读 catalog 和命中笔记，不使用本 skill。

## 文档整理边界

`kind: document` / `source_skill: obdoc` 的笔记可以纳入 `$obcurate` 整理范围，但处理目标是文档本身的可发现性、分类和安全状态。

| 输入对象 | `$obcurate` 处理 | 转交条件 |
| --- | --- | --- |
| `kind: knowledge` / `source_skill: oblearn` | 合并、拆分、重命名、修正 aliases/tags/wikilink、维护 catalog | 需要补充来源材料或提炼新经验时，转 `$oblearn` |
| `kind: document` / `source_skill: obdoc` | 整理 metadata/catalog、标题、aliases、tags、topic、wikilink、路径、Inbox 状态、`sensitivity`、`## 相关` | 用户明确要求从文档提炼可复用经验时，创建单独 `$oblearn` 任务 |

整理 `kind: document` 时检查：

- `kind: document`、`source_skill: obdoc`、`doc_type`、`sensitivity`、`status` 是否能说明文档类型和可公开程度。
- 标题、aliases、tags、topic、wikilink、路径和 Inbox 状态是否准确。
- catalog 是否保留：该文档是否应该作为可发现的公共文档入口登记；含内网拓扑、本地事实或 `sensitivity` 不适合公开复用时，建议保留 Inbox、私有化或移除 catalog 入口。
- `## 相关` 是否只链接真实主题相关文档。
- 文档正文中的 `## 可提取知识候选` 只作为后续 `$oblearn` 线索，不在 `$obcurate` 中直接晋升为公共知识。
- 含内网拓扑的 `kind: document` 仍可整理 metadata/catalog；经验提取和脱敏公共化属于 `$oblearn`。

整理计划必须按用户点名范围裁剪。如果某个文档不属于本轮范围，计划中写明“暂不处理”，并说明只在 Inbox 或 catalog 整理范围内检查 metadata/catalog。

## 默认行为

用户只说 `$obcurate` 或“整理公共知识”时，按安全默认值执行：

- 只读取 `Agent/Knowledge/_catalog.md`、`Agent/Knowledge/Inbox/`、用户指定的笔记，以及这些笔记明确链接的少量相关笔记。
- 使用有限范围，以 catalog、Inbox、用户指定笔记和明确链接为整理输入。
- 先列出整理计划，说明每个建议动作、理由、影响范围和回滚方式。
- 移动、重命名、合并、拆分、删除、批量 catalog 更新前必须等待用户确认。
- 默认不删除内容；确需删除时先建议归档或合并，除非用户明确要求删除。
- 不写 secret、账号、token、客户信息、内网地址、机器清单、磁盘序列号等本地事实。
- 发现本地事实时只做脱敏或建议移动到用户私有笔记，不把它们登记到公共知识 catalog。

## 输入范围

优先读取：

```text
Agent/Knowledge/_catalog.md
Agent/Knowledge/Inbox/
Agent/Knowledge/<用户指定笔记>.md
```

可以按明确关键词做有限搜索：

```bash
obsidian search query="<关键词>" limit=10
obsidian read path="Agent/Knowledge/<命中笔记>.md"
```

不要递归扫描整个 vault。没有用户指定范围时，以 `_catalog.md` 和 `Inbox/` 为主。

## 工作流

1. 确认整理范围：`Inbox/`、catalog、某个平台、某个 topic，或用户指定的笔记列表。
2. 读取 `Agent/Knowledge/_catalog.md`（如果存在）和范围内笔记。
3. 识别问题：重复主题、过长笔记、缺失 aliases、过期 wikilink、未脱敏内容、catalog stale link、Inbox 可晋升笔记、文档 metadata/catalog 状态。
4. 生成整理计划，按动作分组：保留、移动、重命名、合并、拆分、修正 metadata、更新 catalog、建议私有化、暂不处理。
5. 对每个 `kind: document` 计划项标明处理类型：整理 metadata/catalog、保留为文档入口、建议私有化，或因不属于本轮范围而暂不处理。
6. 等待用户确认结构性修改。
7. 执行确认过的修改；每次修改保持最小范围。
8. 读回被修改的笔记和 `_catalog.md`，确认 wikilink、aliases、terms、notes 一致。
9. 汇报修改过的文件、跳过的建议和需要用户判断的剩余项。

## Catalog 维护

`Agent/Knowledge/_catalog.md` 是已沉淀领域的事实来源，不是完整分类树。catalog 不只回答“有哪些笔记”，还回答“查到后怎么用”。

建议结构：

```yaml
## terms

- term: <关键词>
  aliases: []
  kind: knowledge
  use_as: rule
  notes:
    - [[<真实笔记标题>]]
```

维护规则：

- `terms` 使用稳定关键词，例如平台名、框架名、错误类别或任务类型。
- `aliases` 默认保持 `[]`；只写用户确认、笔记现有 frontmatter、标题可直接推出的别名。
- `kind` 标明命中对象是 `knowledge` 还是 `document`；`use_as` 标明使用语义。
- `knowledge` 通常作为公共经验、规则、检查清单或启发式判断使用，`use_as` 可写 `rule`、`checklist` 或 `heuristic`。
- `document` 通常作为参考材料、runbook、证据或操作记录使用，`use_as` 可写 `reference`、`runbook` 或 `evidence`；读取后不能把正文直接当公共经验。
- `notes` 只链接真实存在的公共知识笔记或文档笔记。
- 不凭空假设某个领域已经沉淀；没有真实笔记就不登记。
- 合并或重命名笔记时，保留旧标题或旧关键词为 `aliases`，避免旧搜索词失效。
- 删除 stale link 前先确认目标笔记确实不存在或已经被合并。

## Tags

`tags` 是辅助 metadata，用于 Obsidian UI、Bases、Dataview、人工筛选和低频整理辅助，不作为 agent 发现入口。

整理 tags 时只做一致性维护：明显错类时修正，缺少稳定用途时保持 `tags: []`。不要用 tags 替代 catalog 的 `terms` / `aliases` / `kind` / `use_as`，也不要只凭 tags 决定晋升、私有化或 catalog 是否保留。

## Inbox 整理

`Agent/Knowledge/Inbox/` 是低摩擦落点，不是错误状态。

可以建议晋升的情况：

- 同一主题出现多次。
- 笔记已经被项目实际使用过。
- 适用场景、检查项和脱敏状态清楚。
- 能稳定命名为“某平台/某技术/某任务类型怎么处理某问题”。

不要强行晋升的情况：

- 内容仍是未验证猜测。
- 内容包含本地事实且无法可靠脱敏。
- 适用范围不清楚。
- 只是一次性记录，没有复用价值。

## 合并、拆分和重命名

合并前先列出：

- 源笔记。
- 目标笔记。
- 合并理由。
- 冲突内容。
- 将保留为 `aliases` 的旧标题。

拆分前先列出：

- 原笔记。
- 新主题。
- 每个新主题的适用范围。
- 原笔记是否保留为索引或归档。

重命名前先读取 backlinks 或定向搜索旧标题；重命名后更新明确指向旧标题的 wikilink，并把旧标题写入 `aliases`。

## 隐私和脱敏

公共知识只保留可复用模式，不保留本地事实。

遇到敏感内容时：

- 用 `<management-subnet>`、`<pve-node>`、`<backup-target>` 这类占位描述替代。
- 将 `sensitivity` 设为 `sanitized`。
- 如果无法脱敏，建议移动到用户私有笔记，不登记到 `Agent/Knowledge/_catalog.md`。

## 模板

优先使用本 skill 的模板：

| 模板 | 目标 |
| --- | --- |
| `templates/curation-plan.md` | 修改前整理计划 |
| `templates/catalog-entry.md` | `_catalog.md` 条目格式 |

## 完成说明

结束时只汇报：

- 读取了哪些公共知识范围。
- 执行了哪些已确认的整理动作。
- 更新了哪些 `terms` / `aliases` / `notes`。
- 哪些建议等待用户确认。
- 哪些内容因隐私、范围不清或证据不足而跳过。
