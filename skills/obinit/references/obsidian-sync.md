# Obsidian 同步

Obsidian 只承担三件事：

1. 保存跨会话项目上下文：真实链接、当前状态、已记录决策、开放问题和 agent 记录。
2. 给 `.agents/instructions.md` 提供稳定引用：`Obsidian project note: Agent/Projects/<project>.md`。
3. 保存跨项目复用知识入口：框架约定、设计坑、部署坑、调试经验等公共笔记；文档目录单独放在 `Agent/Documents/_catalog.md`。

不要把 Obsidian 当成项目源码、运行依赖或全库搜索入口。访问范围默认只限配置好的项目笔记、`Agent/Knowledge/_catalog.md`、有限关键词命中的公共知识笔记，以及用户明确指定或任务明确相关时的 `Agent/Documents/_catalog.md` 和命中文档。

## Obsidian vault 写入契约

所有 Obsidian Markdown mutation，包括创建、覆盖、追加、局部修改、frontmatter、catalog 或项目笔记更新，以及移动和重命名，都直接操作 vault 本地文件系统。

`obsidian` CLI 只用于 vault 定位、有限搜索、读取和写入后读回校验。

不得以 `obsidian create`、`obsidian append`、`obsidian prepend`、`obsidian property:set`、`obsidian move`、`obsidian rename` 或 `content=` 作为写入或回退路径。

无法解析 vault 本地路径时，请用户提供或确认目标 vault 的本地文件系统路径，再执行文件操作。

写入前先读取目标文件的当前内容；发现本次范围外的外部改动时停止写入并列出待确认项，不覆盖对方内容。

项目笔记规则：

- 笔记不存在：用 `templates/obsidian-project-note.md` 创建。
- 笔记存在但内容过期：按新项目、成熟项目或重复运行模式幂等更新。
- 第一次初始化不强行判断项目类型；项目类型是 `unknown` 时只建立 catalog 查询协议，不预填弱相关知识。
- 重复初始化时根据 README、package metadata、目录结构、显式 skill/spec/plan、docs 顶层索引和 agent memory 判断项目类型：`unknown` 不回写，`candidate` 只列建议，`confirmed` 才回写高置信相关知识链接。
- 成熟项目笔记要说明 `AGENTS.md` / `CLAUDE.md` 保留长指南，`.agents/instructions.md` 是索引和 memory 协议。
- 项目笔记是干净索引，只写真实链接、真实状态和真实记录；省略空章节，不写 `暂无` 或“需要时补充”。
- `相关知识` 只写实际查阅、已提取或用户明确要求关联的公共知识笔记；没有明确知识入口时省略本节。
- 项目相关知识只回写链接和简短 `kind` / `use_as`，不复制公共知识正文；不明确时只列建议。
- `决策` 只写真实 ADR 或长期技术决策；初始化模式和 `$obinit` 接入记录写入 `当前状态` 或 `Agent 记录`，不写入决策。
- `开放问题`、`常用命令` 等可选章节只有有真实内容时才写入。
- 完成后必须读回 Obsidian 项目笔记。

## 项目相关知识回写

项目相关知识回写按置信度分档：

| 置信度 | 判定 | 处理 |
| --- | --- | --- |
| `unknown` | 项目类型或任务域不明确 | 只保留查询协议，不回写公共知识 |
| `candidate` | 有单一信号或弱相关命中 | 只列建议，不写入项目相关知识 |
| `confirmed` | 多个信号一致，或用户明确说明项目类型/任务域 | 查 `Agent/Knowledge/_catalog.md`，只回写高置信相关知识链接 |

只回写链接和简短使用语义，不复制公共知识正文。优先写入 Obsidian 项目笔记的 `相关知识`；需要让后续 agent 启动时立即看见的少量高置信链接，可写入 `.agents/instructions.md` 的 `项目相关知识` 小节。每条链接保留 `kind` / `use_as`，让后续 agent 区分公共经验规则、检查清单、参考材料或证据。

已有项目相关知识在重复初始化时幂等维护：确认仍高置信的保留；不存在或明显过期的链接列出修正建议；不确定的链接只列建议，等待用户确认。

公共知识按需查阅：

- 任务开始或遇到相关问题时，不凭空假设哪些领域已有公共知识。
- 优先读取 `Agent/Knowledge/_catalog.md`；它是已沉淀领域的事实来源，不存在或不命中时不要强行扩展搜索。
- 仅在用户明确要求、catalog 的 `terms` / `aliases` 命中任务关键词，或风险较高且关键词明确时，在 `Agent/Knowledge/` 做有限关键词定向搜索。
- 只有命中相关笔记后才明确读取并使用。
- 读取 Knowledge catalog 命中项时看 `kind` 和 `use_as`：`kind: knowledge` / `use_as: rule`、`checklist` 或 `heuristic` 这类公共经验可以作为规则、检查清单或启发式判断。
- 命中笔记 `status` 为 `deprecated` 或 `needs-review` 时不作为有效经验使用；已退役笔记只作为“此路不通”的反例背景。使用中发现知识与当前证据矛盾时，按证据强度分级更新该笔记状态；正常使用的由 `$obclose` 收尾时回写 `last_verified`。
- `Agent/Documents/_catalog.md` 是文档目录；只有用户明确指定、任务明确涉及文档主题，或执行 `$obdoc` / `$obcurate` 文档流程时才读取。文档可能保留当前环境值，读取后要理解上下文并替换本地参数，不能把正文里的当前环境值直接当公共经验。
- 不全量自动加载公共知识，不扫描整个 vault。

查阅示例：

```bash
obsidian read path="Agent/Knowledge/_catalog.md"
obsidian search query="<主题关键词>" limit=5
obsidian read path="Agent/Knowledge/<实际命中笔记>.md"
obsidian read path="Agent/Documents/_catalog.md"
```

查到并使用公共知识后，在 `.agents/active.md` 的“已使用知识”记录链接。发现跨项目可复用经验时，先写 `.agents/lessons.md`，阶段结束再用 `$oblearn` 提取。
