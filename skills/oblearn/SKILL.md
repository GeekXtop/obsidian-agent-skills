---
name: oblearn
description: 从项目内 agent 记忆库、Superpowers specs/plans、ADR、recent changes 中提取可跨项目复用的经验，并沉淀到 Obsidian 公共知识笔记。适用于用户说 $oblearn、沉淀经验、提取公共知识、复盘项目、同步 lessons 到 Obsidian、任务完成后记录踩坑，或希望后续项目避免重复踩坑。
---

# Oblearn

从当前项目提取“可复用知识”，写入 Obsidian 的 `Agent/Knowledge/`。它不是初始化工具，不创建项目入口文件；项目初始化使用 `$obinit`。

## 默认行为

用户只说 `$oblearn` 或“提取公共知识”时，按安全默认值执行：

- 只读取当前项目的记忆库、设计/计划/ADR 和最近变更摘要。
- 只提取跨项目可复用的经验，不复制项目私有业务内容。
- 先搜索 Obsidian 是否已有相关公共知识笔记。
- 明确匹配已有笔记时，可以追加短条目。
- 需要新建公共知识笔记时，先列出建议并等待用户确认。
- 不扫描整个 vault。
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

优先追加到已有 Obsidian 公共知识笔记：

```text
Agent/Knowledge/Frontend Design Pitfalls.md
Agent/Knowledge/React Project Conventions.md
Agent/Knowledge/Tailwind UI Pitfalls.md
Agent/Knowledge/Shadcn Usage Notes.md
Agent/Knowledge/Deployment Lessons.md
Agent/Knowledge/Testing Lessons.md
Agent/Knowledge/Windows Dev Lessons.md
Agent/Knowledge/Agent Workflow Lessons.md
```

如果没有合适笔记，先向用户提出新建建议，不要擅自创建一堆分类。

## 工作流

1. 确定项目根目录。
2. 读取 `.agents/active.md`，确认当前任务、当前 spec/plan、项目笔记路径。
3. 读取 `.agents/lessons.md` 和相关 `.agents/progress.md` 条目。
4. 按 `.agents/active.md` 指向读取相关 spec/plan/ADR。
5. 从材料中列出候选知识，每条包含来源、证据、适用范围、建议目标笔记。
6. 过滤掉项目私有、未验证、过细或不可复用内容。
7. 用 Obsidian CLI 定向搜索目标笔记。
8. 对明确匹配的已有笔记追加短条目。
9. 对需要新建的笔记，先列清单等用户确认。
10. 更新项目 Obsidian 笔记的 `Knowledge To Check`。
11. 在 `.agents/active.md` 或 `.agents/lessons.md` 记录本次提取结果。

## Obsidian 查找

使用关键词定向搜索：

```bash
obsidian search query="frontend design pitfalls" limit=5
obsidian read path="Agent/Knowledge/Frontend Design Pitfalls.md"
```

不要使用全 vault 扫描来“找灵感”。搜索词应来自任务领域、技术栈、错误信息或候选知识分类。

## 公共知识条目格式

追加到公共知识笔记时，使用短条目：

使用 `templates/public-knowledge-entry.md`。

条目要能被下一个 agent 直接执行，不写散文。

## 新建公共知识笔记模板

仅在用户确认后创建：

使用 `templates/public-knowledge-note.md`。

内部链接使用 Obsidian wikilink，例如 `[[Frontend Design Pitfalls]]`。外部链接用标准 Markdown 链接。

## 项目回写

如果提取了公共知识，在 `.agents/active.md` 追加或更新：

使用 `templates/active-knowledge-extracted.md` 的结构。

如果只是发现项目内经验但不适合公共化，保留在 `.agents/lessons.md`。

## 完成说明

结束时只汇报：

- 读取了哪些项目文件。
- 追加了哪些 Obsidian 公共知识笔记。
- 建议新建但等待确认的笔记。
- 回写了哪些项目内 memory 文件。
