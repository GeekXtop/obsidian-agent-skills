# 入口文件保护

`AGENTS.md`、`CLAUDE.md`、`GEMINI.md` 等入口文件经常已有项目约定。处理规则：

- 文件不存在或为空：可以用 `templates/agent-entry.md` 创建。
- 文件已有非空内容且没有 `.agents/instructions.md` 指针：只追加符合语言偏好的短入口段。
- 文件已有非空内容且已有等价指针：不修改。
- 文件已有非空内容时，禁止整体替换、压缩、改写成短指针或移动原有章节。
- 不确定入口段放顶部还是底部时，先问用户。

推荐追加段：

```md
> Agent 规则入口：修改代码前先读 `.agents/instructions.md`。本文件保留仓库原有指南，`.agents/instructions.md` 是跨 agent 的工作约定汇总。
```

覆盖已有非空入口文件前，必须有用户明确的“覆盖”“重写”或具体文件替换授权。
