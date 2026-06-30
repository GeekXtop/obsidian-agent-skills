---
name: oblearn
description: 从项目内 agent 记忆库、Superpowers specs/plans、ADR、recent changes，或非项目临时会话摘要、Codex session id 中提取可跨场景复用的经验，并沉淀到 Obsidian 公共知识笔记。适用于用户说 $oblearn、沉淀经验、提取公共知识、复盘项目、同步 lessons 到 Obsidian、从当前对话、粘贴 transcript 或 Codex 会话提炼经验，或希望把已记录经验转成公共知识。
---

# Oblearn

从当前项目或用户明确提供的临时会话材料提取“可复用知识”，写入 Obsidian 的 `Agent/Knowledge/`。它不是初始化工具，不创建项目入口文件；项目初始化使用 `$obinit`。

## 职责边界

`oblearn` 只负责从当前项目材料或非项目临时会话材料中提取、脱敏和写入可复用知识。

- 可以追加到明确匹配的已有公共知识笔记。
- 可以在新知识无明确稳定主题时，建议写入 `Agent/Knowledge/Inbox/`。
- 可以在追加或新建笔记时只做最小维护，例如补必要 frontmatter、`aliases` 或修正当前写入会用到的 wikilink。
- 可以在没有项目 memory 时，从当前对话、用户摘要、粘贴 transcript 或用户提供的 Codex session id 中提取公共经验。
- 不负责初始化临时目录或为非项目任务创建 `.agents/`。
- 不负责全库重分类，不做批量移动、重命名、合并、拆分或重建索引。
- 结构性整理交给 `$obcurate`，例如清理 Inbox、合并重复主题、拆分过长笔记、整理 `Agent/Knowledge/_catalog.md`。

## 默认行为

用户只说 `$oblearn` 或“提取公共知识”时，按安全默认值执行：

- 如果用户明确提供临时会话摘要、transcript、Codex session id 或指定非项目材料，按非项目临时会话模式处理，即使当前目录存在项目 memory。
- 如果用户没有指定非项目材料，且当前目录有项目 memory，读取当前项目的记忆库、设计/计划/ADR 和最近变更摘要。
- 如果用户没有指定非项目材料，且当前目录没有项目 memory，按非项目临时会话处理；只使用当前对话、用户提供的摘要、transcript 或可精确定位的 Codex session id，不要求先 `$obinit`。
- 只提取跨项目可复用的经验，不复制项目私有业务内容。
- 先读取 `Agent/Knowledge/_catalog.md`（如果存在）作为已沉淀领域的事实来源。
- 再用候选主题、技术栈、错误信息或平台名做关键词定向搜索。
- 明确匹配已有笔记时，可以追加短条目。
- 需要新建公共知识笔记时，优先建议写入 `Agent/Knowledge/Inbox/` 并等待用户确认。
- 只有本次已确认写入目标、关键词明确且不含敏感信息时，才对 `Agent/Knowledge/_catalog.md` 做最小明确更新。
- 不扫描整个 vault。
- 不凭空假设某个领域已经沉淀；没有 `_catalog.md` 命中或搜索命中时，就按新知识处理。
- 不写 secret、账号、token、客户信息、内部路径细节。
- 不把 Superpowers spec/plan 原文复制进 Obsidian。
- 新建或追加的 Obsidian 公共知识和项目回写内容默认遵循用户或项目既有语言偏好；当前模板使用简体中文。技术标识符、路径、命令、包名和英文专有名词保持原样。

## 输入来源

项目模式下，按需读取这些项目内文件：

```text
.agents/instructions.md
.agents/active.md
.agents/progress.md
.agents/lessons.md
.agents/archive/progress-YYYY.md
docs/superpowers/specs/
docs/superpowers/plans/
docs/adr/
```

`.agents/archive/` 读取范围由明确证据触发：`.agents/active.md`、`.agents/progress.md` 或 `.agents/lessons.md` 指向归档；用户要求复盘长期项目；或当前候选知识需要旧阶段证据。

如果是 git 项目，可以读取最近变更摘要：

```bash
git status --short
git diff --stat
git log -5 --oneline
```

只读取与当前任务、当前 spec/plan 或用户指定范围相关的文档；不要遍历大型目录。

## 非项目临时会话

当前目录没有 `.agents/instructions.md`，或任务明显不属于软件项目时，不要要求用户先运行 `$obinit`。

可用输入：

- 当前对话中明确出现的事实、命令、错误和结论。
- 用户粘贴的 transcript、命令输出或会话摘要。
- 用户提供的 Codex session id，且本机能在 Codex 会话存储中精确定位对应 transcript。
- 用户明确指定的本地文件或笔记。

如果用户提到“昨天的 Codex app 对话”“之前那个临时任务”等历史会话，但当前上下文没有 transcript、摘要或 Codex session id，不能假装能自动读取历史；先请用户提供摘要、关键命令、错误信息、结论或 session id。

### Codex 会话 ID

用户提供 Codex session id 时，可把该 ID 作为授权和定位线索，做精确本地查找：

- 只查找 `$CODEX_HOME/session_index.jsonl`、`$CODEX_HOME/sessions/`、`$CODEX_HOME/archived_sessions/`；未设置 `$CODEX_HOME` 时使用用户主目录下的 `.codex`，Windows 通常是 `%USERPROFILE%\.codex`，macOS/Linux 通常是 `~/.codex`。
- 只用完整 ID 做 fixed-string 精确匹配；不要按日期、关键词或标题扩大扫描历史会话。
- 优先使用文件名或 `session_meta.session_id` / `payload.id` 精确等于该 ID 的 JSONL。
- 如果只命中其他会话的 `forked_from_id`，那只是派生关系，不等于目标 transcript；继续查找目标 ID，找不到就向用户说明。
- 不运行 `codex resume <id>` 来读取 transcript；`resume` 是恢复交互会话，不是导出命令。
- 找到唯一 JSONL 后，可以读取该文件并从 user / assistant / tool 事件中提取候选经验；不要把完整对话原文写入公共知识。
- 找不到或命中不唯一时，请用户提供摘要、导出的 transcript 或明确文件路径。

非项目模式下：

- 只提取跨场景可复用的操作经验、检查清单、风险提示或调试结论。
- 默认建议写入 `Agent/Knowledge/Inbox/<简短主题>.md`，并设置 `status: draft`。
- 主题应从候选知识的核心适用范围中提炼，优先使用平台、技术栈、命令、错误类型、风险类型或工作流类型等真实信号；不要把说明性示例、会话背景或临时任务外壳当成固定分类，也不要把所有临时会话归到同一主题。
- 仍然先读 `Agent/Knowledge/_catalog.md` 并用关键词定向搜索；不要全 vault 扫描。
- 不创建 `.agents/`、`docs/adr/`、项目 Obsidian 笔记或项目 memory。
- 不记录本机磁盘清单、绝对路径细节、账号、隐私信息、客户数据、token 或 secret。
- 不把聊天摘要原文作为公共知识；只把经过泛化、脱敏、可执行的经验写入公共知识。

## 可提取内容

只提取满足至少一条的内容：

- 其他项目也可能遇到的坑。
- 可复用的框架约定、目录约定、组件约定。
- 可执行检查清单。
- 已验证的调试结论。
- 长期有效的技术取舍。
- 多次出现或明显高成本的错误模式。
- 临时会话中可迁移到其他机器、项目或操作任务的安全步骤。

不要提取：

- 本项目专属业务逻辑。
- 临时任务状态。
- 聊天摘要原文。
- 未验证猜测。
- 大段 spec/plan 原文。
- secret、账号、密钥、客户数据、隐私信息。

## 输出目标

`oblearn` 只写入 `Agent/Knowledge/`，不写入 `Agent/Documents/`。`Agent/Knowledge/` 保存短经验、规则、检查清单和启发式判断；`Agent/Documents/` 保存 `$obdoc` 生成的人类可读文档。

用户指定路径优先；已有明确命中的公共知识笔记优先追加；不稳定时建议写入 `Agent/Knowledge/Inbox/` 并设置 `status: draft`；稳定归类、移动、合并或拆分交给 `$obcurate`。

优先追加到定向搜索命中的已有 Obsidian 公共知识笔记：

```text
Agent/Knowledge/<主题>.md
```

主题应来自用户指定路径、`Agent/Knowledge/_catalog.md` 命中、定向搜索命中或用户确认。如果没有合适笔记，先向用户提出新建建议，不要擅自创建一堆分类。

新知识尚未稳定归类时，建议目标是：

```text
Agent/Knowledge/Inbox/<简短主题>.md
```

`Agent/Knowledge/_catalog.md` 是已沉淀领域的事实来源。它只记录已经存在或本次确认创建的公共知识入口，不记录猜测分类。

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

`kind` 表示命中对象的类型，`use_as` 表示查到后怎么用。`oblearn` 写入的是 `kind: knowledge`；常见 `use_as` 是 `rule`、`checklist` 或 `heuristic`。机器层使用英文 token，中文展示用于正文、计划和完成说明，例如“类型：知识（`kind: knowledge`）”“用途：检查清单（`use_as: checklist`）”。最小明确更新 catalog 时只使用真实笔记标题、已有 frontmatter、用户确认的别名或本次知识的明确关键词。无法判断时，不登记，只列出维护建议并交给 `$obcurate`。

## Tags

`tags` 是辅助 metadata，用于 Obsidian UI、Bases、Dataview、人工筛选和低频整理辅助，不作为 agent 发现入口。agent 发现公共知识以 `Agent/Knowledge/_catalog.md` 的 `terms` / `aliases` / `kind` / `use_as` 为准。

新建公共知识笔记可以使用粗粒度 tag，例如 `agent/knowledge` 或 `skill/design`。不要用 tags 替代 `kind: knowledge`、`source_skill: oblearn`、catalog 入口或脱敏判断。

## Obsidian 写入

Obsidian Markdown 写入统一使用 vault 文件：根据目标 `path` 确定 vault 本地文件系统路径，将公共知识笔记、`Agent/Knowledge/_catalog.md` 或项目 Obsidian 笔记写入或更新为对应 `.md` 文件。新建、追加、局部更新和 catalog 最小更新都走文件写入路径。

`obsidian` CLI 用于查找、读取和写入后读回校验。无法确定目标 vault 的本地文件系统路径时，先说明需要目标 vault 路径或让用户确认可写位置，再执行文件写入。

## 工作流

项目模式：

1. 确定项目根目录。
2. 读取 `.agents/active.md`，确认当前任务、当前 spec/plan、项目笔记路径。
3. 读取 `.agents/lessons.md` 和相关 `.agents/progress.md` 条目。
4. 如当前材料指向归档或用户要求长期复盘，读取 `.agents/archive/` 中相关年份文件。
5. 按 `.agents/active.md` 指向读取相关 spec/plan/ADR。
6. 从材料中列出候选知识，每条包含来源、证据、适用范围、建议目标笔记。
7. 过滤掉项目私有、未验证、过细或不可复用内容。
8. 读取 `Agent/Knowledge/_catalog.md`（如果存在），用候选关键词匹配 `terms` 和 `aliases`。
9. 用 Obsidian CLI 定向搜索目标笔记。
10. 对明确匹配的已有笔记追加短条目。
11. 对需要新建的笔记，先列清单等用户确认；默认建议放入 `Agent/Knowledge/Inbox/`。
12. 写入完成后，如关键词和目标明确，对 `Agent/Knowledge/_catalog.md` 做最小明确更新；不明确时只列出 `terms` / `aliases` / `notes` 建议，并建议 `$obcurate` 处理。
13. 更新项目 Obsidian 笔记的 `相关知识`。
14. 在 `.agents/active.md` 或 `.agents/lessons.md` 记录本次提取结果。

非项目临时会话模式：

1. 确认没有可用项目 memory，或用户明确要求从临时会话提取经验。
2. 从当前对话、用户摘要、transcript 或精确匹配的 Codex session JSONL 中列出候选知识，每条包含来源、证据、适用范围、脱敏点和建议目标笔记。
3. 如果证据不足，先请用户补充关键命令、错误信息、结论或上下文。
4. 过滤掉本机私有路径、隐私、secret、未验证猜测和不可复用聊天内容。
5. 读取 `Agent/Knowledge/_catalog.md`（如果存在），用候选关键词匹配 `terms` 和 `aliases`。
6. 用 Obsidian CLI 定向搜索目标笔记。
7. 对明确匹配的已有笔记追加短条目。
8. 对需要新建的笔记，先列清单等用户确认；默认建议放入 `Agent/Knowledge/Inbox/`。
9. 写入完成后，如关键词和目标明确，对 `Agent/Knowledge/_catalog.md` 做最小明确更新；不明确时只列出 catalog 建议，并建议 `$obcurate` 处理。
10. 不回写项目 memory。

## Obsidian 查找

使用关键词定向搜索：

```bash
obsidian read path="Agent/Knowledge/_catalog.md"
obsidian search query="<主题关键词>" limit=5
obsidian read path="Agent/Knowledge/<实际命中笔记>.md"
```

`Agent/Knowledge/_catalog.md` 只在本次实际写入公共知识且有明确关键词时建议创建或更新。

Obsidian 查找使用关键词定向搜索。搜索词应来自候选知识本身的技术栈、错误信息、平台名、命令名或用户确认的主题；搜索没有命中时，按新知识处理。

## 公共知识条目格式

追加到公共知识笔记时，使用短条目：

使用 `templates/public-knowledge-entry.md`。

条目要能被下一个 agent 直接执行，不写散文。

## 新建公共知识笔记模板

仅在用户确认后创建：

使用 `templates/public-knowledge-note.md`。

如果用户没有指定稳定主题，默认创建在 `Agent/Knowledge/Inbox/`，并设置 `status: draft`。稳定归类、移动、合并或拆分由 `$obcurate` 后续处理。

引用真实存在或本次确认创建的 Obsidian 笔记时使用 wikilink。外部链接用标准 Markdown 链接。

## Catalog 最小更新

`Agent/Knowledge/_catalog.md` 用于让后续 agent 知道哪些领域已经沉淀过。它不是分类体系，不要求完整，不是全 vault 索引。

可以最小更新 catalog 的情况：

- 本次追加到已有笔记，且候选关键词明确匹配该笔记。
- 本次新建笔记，且用户确认标题、别名或关键词。
- 正在补充的笔记已有 `aliases`、`platform`、`topic` 或 tags 可直接转换为 `terms` / `aliases`。

最小更新只允许：

- 为本次实际写入或更新的真实笔记新增一个入口。
- 为已存在的匹配入口追加少量明确 `terms`、`aliases`、`kind`、`use_as` 或 `notes`。
- 保留 catalog 既有结构，不重排、不移动、不删除、不批量改名。

不要更新 catalog 的情况：

- 只是猜测某平台或领域可能以后会用到。
- 搜索结果不明确。
- 目标笔记仍需要用户确认。
- 关键词包含本地事实、内网地址、账号、客户名或其他需要脱敏的信息。

结构性 catalog 维护由 `$obcurate` 执行，包括清理 Inbox、移动或重命名主题、合并重复入口、拆分大主题、批量修正 aliases/tags/wikilink、删除过期入口和全局重分类。

## 模板升级与历史公共知识

模板升级只影响新建笔记和后续追加条目；历史公共知识默认保持原样，仍应按当时内容读取和复用。

读取旧公共知识笔记时兼容缺失字段，从正文推断适用场景、检查项、经验或相关链接，不要因为缺少新模板字段就判定无效。不要批量迁移历史公共知识。

只有在以下情况才做最小回填：

- 正在向该笔记追加新条目。
- 缺失字段会导致下一个 agent 误用经验或无法判断适用范围。
- 需要脱敏、泛化或修正过期内容。

回填时只补必要字段、短句或条目，不整体重写历史笔记。

## 已有公共知识维护

`oblearn` 对已有公共知识维护只做最小修改：添加当前写入必需的 `aliases`、更新 `title` / H1 / tags、修正 wikilink、追加新条目，或修正当前条目中不够脱敏的内容。

维护动作应服务于可复用性和可发现性，只做最小修改。

如果用户要求移动、重命名主题、合并或拆分笔记、批量修正 catalog、清理 Inbox，转交 `$obcurate`；不要把这些结构性整理塞进一次经验提取。

## 项目回写

仅项目模式执行项目回写。

如果提取了公共知识，在 `.agents/active.md` 追加或更新：

使用 `templates/active-knowledge-extracted.md` 的结构。

如果只是发现项目内经验但不适合公共化，保留在 `.agents/lessons.md`。

## 完成说明

结束时只汇报：

- 读取了哪些项目文件。
- 非项目模式下，说明使用了哪些当前对话、用户摘要、transcript 或 Codex session JSONL 材料。
- 追加了哪些 Obsidian 公共知识笔记。
- 新建或建议写入了哪些 `Agent/Knowledge/Inbox/` 笔记。
- 是否最小更新了 `Agent/Knowledge/_catalog.md`，或只提出了维护建议。
- 建议新建但等待确认的笔记。
- 回写了哪些项目内 memory 文件。
