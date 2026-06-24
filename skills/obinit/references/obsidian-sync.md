# Obsidian 同步

Obsidian 只承担三件事：

1. 保存跨会话项目上下文：真实链接、当前状态、已记录决策、开放问题和 agent 记录。
2. 给 `.agents/instructions.md` 提供稳定引用：`Obsidian project note: Agent/Projects/<project>.md`。
3. 保存跨项目复用知识入口：框架约定、设计坑、部署坑、调试经验等公共笔记。

不要把 Obsidian 当成项目源码、运行依赖或全库搜索入口。访问范围默认只限配置好的项目笔记、`Agent/Knowledge/_catalog.md` 和有限关键词命中的公共知识笔记。

项目笔记规则：

- 笔记不存在：用 `templates/obsidian-project-note.md` 创建。
- 笔记存在但内容过期：按新项目、成熟项目或重复运行模式幂等更新。
- 成熟项目笔记要说明 `AGENTS.md` / `CLAUDE.md` 保留长指南，`.agents/instructions.md` 是索引和 memory 协议。
- 项目笔记是干净索引，只写真实链接、真实状态和真实记录；省略空章节，不写 `暂无` 或“需要时补充”。
- `相关知识` 只写实际查阅、已提取或用户明确要求关联的公共知识笔记；没有明确知识入口时省略本节。
- `决策` 只写真实 ADR 或长期技术决策；初始化模式和 `$obinit` 接入记录写入 `当前状态` 或 `Agent 记录`，不写入决策。
- `开放问题`、`常用命令` 等可选章节只有有真实内容时才写入。
- 完成后必须读回 Obsidian 项目笔记。

公共知识按需查阅：

- 任务开始或遇到相关问题时，不凭空假设哪些领域已有公共知识。
- 优先读取 `Agent/Knowledge/_catalog.md`；它是已沉淀领域的事实来源，不存在或不命中时不要强行扩展搜索。
- 仅在用户明确要求、catalog 的 `terms` / `aliases` 命中任务关键词，或风险较高且关键词明确时，在 `Agent/Knowledge/` 做有限关键词定向搜索。
- 只有命中相关笔记后才明确读取并使用。
- 不全量自动加载公共知识，不扫描整个 vault。

查阅示例：

```bash
obsidian read path="Agent/Knowledge/_catalog.md"
obsidian search query="<主题关键词>" limit=5
obsidian read path="Agent/Knowledge/<实际命中笔记>.md"
```

查到并使用公共知识后，在 `.agents/active.md` 的“已使用知识”记录链接。发现跨项目可复用经验时，先写 `.agents/lessons.md`，阶段结束再用 `$oblearn` 提取。
