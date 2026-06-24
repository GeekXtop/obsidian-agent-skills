---
name: oblearn
description: 从项目内 agent 记忆库、Superpowers specs/plans、ADR、recent changes 中提取可跨项目复用的经验，并沉淀到 Obsidian 公共知识笔记。适用于用户说 $oblearn、沉淀经验、提取公共知识、复盘项目、同步 lessons 到 Obsidian、任务完成后记录踩坑，或希望后续项目避免重复踩坑。
---

# Oblearn

从当前项目提取“可复用知识”，写入 Obsidian 的 `Agent/Knowledge/`。它不是初始化工具，不创建项目入口文件；项目初始化使用 `$obinit`。

## 职责边界

`oblearn` 只负责从当前项目材料中提取、脱敏和写入可复用知识。

- 可以追加到明确匹配的已有公共知识笔记。
- 可以在新知识无明确稳定主题时，建议写入 `Agent/Knowledge/Inbox/`。
- 可以在追加或新建笔记时只做最小维护，例如补必要 frontmatter、`aliases` 或修正当前写入会用到的 wikilink。
- 不负责全库重分类，不做批量移动、重命名、合并、拆分或重建索引。
- 结构性整理交给 `$obcurate`，例如清理 Inbox、合并重复主题、拆分过长笔记、整理 `Agent/Knowledge/_catalog.md`。

## 默认行为

用户只说 `$oblearn` 或“提取公共知识”时，按安全默认值执行：

- 只读取当前项目的记忆库、设计/计划/ADR 和最近变更摘要。
- 只提取跨项目可复用的经验，不复制项目私有业务内容。
- 先读取 `Agent/Knowledge/_catalog.md`（如果存在）作为已沉淀领域的事实来源。
- 再用候选主题、技术栈、错误信息或平台名做关键词定向搜索。
- 明确匹配已有笔记时，可以追加短条目。
- 需要新建公共知识笔记时，优先建议写入 `Agent/Knowledge/Inbox/` 并等待用户确认。
- 只有写入目标和关键词明确时，才同步更新 `Agent/Knowledge/_catalog.md`。
- 不扫描整个 vault。
- 不凭空假设某个领域已经沉淀；没有 `_catalog.md` 命中或搜索命中时，就按新知识处理。
- 不写 secret、账号、token、客户信息、内部路径细节。
- 不把 Superpowers spec/plan 原文复制进 Obsidian。
- 新建或追加的 Obsidian 公共知识和项目回写内容默认遵循用户或项目既有语言偏好；当前模板使用简体中文。技术标识符、路径、命令、包名和英文专有名词保持原样。

## 输入来源

按需读取这些项目内文件：

```text
.agents/instructions.md
.agents/active.md
.agents/progress.md
.agents/lessons.md
docs/superpowers/specs/
docs/superpowers/plans/
docs/adr/
```

如果是 git 项目，可以读取最近变更摘要：

```bash
git status --short
git diff --stat
git log -5 --oneline
```

只读取与当前任务、当前 spec/plan 或用户指定范围相关的文档；不要遍历大型目录。

## 可提取内容

只提取满足至少一条的内容：

- 其他项目也可能遇到的坑。
- 可复用的框架约定、目录约定、组件约定。
- 可执行检查清单。
- 已验证的调试结论。
- 长期有效的技术取舍。
- 多次出现或明显高成本的错误模式。

不要提取：

- 本项目专属业务逻辑。
- 临时任务状态。
- 聊天摘要。
- 未验证猜测。
- 大段 spec/plan 原文。
- secret、账号、密钥、客户数据、隐私信息。

## 输出目标

优先追加到定向搜索命中的已有 Obsidian 公共知识笔记：

```text
Agent/Knowledge/<主题>.md
```

主题应来自 `Agent/Knowledge/_catalog.md` 命中、定向搜索命中或用户确认。如果没有合适笔记，先向用户提出新建建议，不要擅自创建一堆分类。

新知识尚未稳定归类时，建议目标是：

```text
Agent/Knowledge/Inbox/<简短主题>.md
```

`Agent/Knowledge/_catalog.md` 是已沉淀领域的事实来源。它只记录已经存在或本次确认创建的公共知识入口，不记录猜测分类。

建议结构：

```yaml
## terms

- term: <关键词>
  aliases: [<别名>]
  notes:
    - [[<真实笔记标题>]]
```

更新 catalog 时只使用真实笔记标题、已有 frontmatter、用户确认的别名或本次知识的明确关键词。无法判断时，不更新 catalog。

## 工作流

1. 确定项目根目录。
2. 读取 `.agents/active.md`，确认当前任务、当前 spec/plan、项目笔记路径。
3. 读取 `.agents/lessons.md` 和相关 `.agents/progress.md` 条目。
4. 按 `.agents/active.md` 指向读取相关 spec/plan/ADR。
5. 从材料中列出候选知识，每条包含来源、证据、适用范围、建议目标笔记。
6. 过滤掉项目私有、未验证、过细或不可复用内容。
7. 读取 `Agent/Knowledge/_catalog.md`（如果存在），用候选关键词匹配 `terms` 和 `aliases`。
8. 用 Obsidian CLI 定向搜索目标笔记。
9. 对明确匹配的已有笔记追加短条目。
10. 对需要新建的笔记，先列清单等用户确认；默认建议放入 `Agent/Knowledge/Inbox/`。
11. 写入完成后，如关键词和目标明确，更新 `Agent/Knowledge/_catalog.md` 的 `terms` / `aliases` / `notes`。
12. 更新项目 Obsidian 笔记的 `相关知识`。
13. 在 `.agents/active.md` 或 `.agents/lessons.md` 记录本次提取结果。

## Obsidian 查找

使用关键词定向搜索：

```bash
obsidian read path="Agent/Knowledge/_catalog.md"
obsidian search query="<主题关键词>" limit=5
obsidian read path="Agent/Knowledge/<实际命中笔记>.md"
```

如果 `Agent/Knowledge/_catalog.md` 不存在，不要为了查找而创建空 catalog；只有本次实际写入公共知识且有明确关键词时再建议创建或更新。

不要使用全 vault 扫描来“找灵感”。搜索词应来自候选知识本身的技术栈、错误信息、平台名、命令名或用户确认的主题；搜索没有命中时，按新知识处理。

## 公共知识条目格式

追加到公共知识笔记时，使用短条目：

使用 `templates/public-knowledge-entry.md`。

条目要能被下一个 agent 直接执行，不写散文。

## 新建公共知识笔记模板

仅在用户确认后创建：

使用 `templates/public-knowledge-note.md`。

如果用户没有指定稳定主题，默认创建在 `Agent/Knowledge/Inbox/`，并设置 `status: draft`。稳定归类、移动、合并或拆分由 `$obcurate` 后续处理。

引用真实存在或本次确认创建的 Obsidian 笔记时使用 wikilink。外部链接用标准 Markdown 链接。

## Catalog 更新

`Agent/Knowledge/_catalog.md` 用于让后续 agent 知道哪些领域已经沉淀过。它不是分类体系，不要求完整，不是全 vault 索引。

可以更新 catalog 的情况：

- 本次追加到已有笔记，且候选关键词明确匹配该笔记。
- 本次新建笔记，且用户确认标题、别名或关键词。
- 正在补充的笔记已有 `aliases`、`platform`、`topic` 或 tags 可直接转换为 `terms` / `aliases`。

不要更新 catalog 的情况：

- 只是猜测某平台或领域可能以后会用到。
- 搜索结果不明确。
- 目标笔记仍需要用户确认。
- 关键词包含本地事实、内网地址、账号、客户名或其他需要脱敏的信息。

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

如果提取了公共知识，在 `.agents/active.md` 追加或更新：

使用 `templates/active-knowledge-extracted.md` 的结构。

如果只是发现项目内经验但不适合公共化，保留在 `.agents/lessons.md`。

## 完成说明

结束时只汇报：

- 读取了哪些项目文件。
- 追加了哪些 Obsidian 公共知识笔记。
- 新建或建议写入了哪些 `Agent/Knowledge/Inbox/` 笔记。
- 是否更新了 `Agent/Knowledge/_catalog.md`。
- 建议新建但等待确认的笔记。
- 回写了哪些项目内 memory 文件。
