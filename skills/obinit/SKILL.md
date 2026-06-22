---
name: obinit
description: 初始化或更新软件项目的 Obsidian-backed 通用 agent 工作约定。适用于用户要求为新项目或已有仓库建立通用 agent 指令、创建或连接 Obsidian 项目笔记、创建 allowlist 范围内的 agent/doc 目录，或为 Codex、Claude Code 以及其他 coding agent 统一项目 onboarding 流程。
---

# Obinit

把项目接入“仓库规则 + 项目内 memory + Obsidian 项目上下文”。新项目可创建完整规则源；成熟项目只加索引和 memory 协议，不替代已有 `AGENTS.md` / `CLAUDE.md`。

默认遵循用户或项目既有语言偏好。当前模板使用简体中文，fork 可替换 `templates/`、README 和 manifest 文案；路径、命令、包名和英文专有名词保持原样。

## 快速流程

1. 确定项目根目录：优先 git root，否则当前目录。
2. 运行或等价执行 `scripts/inspect-project.mjs` 判断模式：

```bash
node <skill>/scripts/inspect-project.mjs <project-root>
```

3. 读取 `AGENTS.md`、`CLAUDE.md`、`.agents/instructions.md`、`README.md` 和 package metadata；对 `docs/` 只检查 docs 顶层信号和索引。
4. 只在 allowlist 内创建或更新：`AGENTS.md`、`CLAUDE.md`、`.agents/`、`docs/adr/`。
5. 选择模板、合并已有内容、写入项目 memory。
6. 如果 Obsidian CLI 可用且 Obsidian 已打开，创建或更新 `Agent/Projects/<project>.md`。
7. 读回更新过的项目文件；完成后必须读回 Obsidian 项目笔记。

## 初始化模式选择

先按 `references/init-modes.md` 处理分支和冲突。

| 模式 | 判定 | 写入 |
| --- | --- | --- |
| 新项目模式 | 没有非空入口指南，也没有明显项目文档 | 用完整 `.agents/instructions.md`；入口文件可薄指针 |
| 成熟项目接入模式 | fork、已有项目、已有非空 `AGENTS.md` / `CLAUDE.md` / README / docs | 用索引型 `.agents/instructions.md`；保留已有指南 |
| 重复运行模式 | `.agents/instructions.md`、`.agents/active.md` 或入口提示已存在 | 只补缺失文件、链接和过期表述 |

成熟项目接入模式下，`AGENTS.md` / `CLAUDE.md` 仍是项目/工具指南事实源。索引型 `.agents/instructions.md` 只记录 memory 协议、Obsidian 项目笔记路径、源文件链接和写入边界。

不要把 `AGENTS.md` / `CLAUDE.md` 的长内容完整复制进 `.agents/instructions.md`。

默认不递归读取 `docs/`。只列出 docs 顶层目录和读取已存在的索引文件，例如 `docs/README.md`、`docs/index.md`、`docs/adr/README.md`；默认不读取 `docs/superpowers/specs/` 或 `docs/superpowers/plans/`，除非 `.agents/active.md` 指向具体文件或用户指定。

发现规则冲突、入口文件语义冲突或目录用途不一致时，停止写入冲突文件并列出待确认项；无冲突的 allowlist 文件可以继续创建。

## 入口文件保护

处理 `AGENTS.md`、`CLAUDE.md` 前先读 `references/entry-file-policy.md`。

- 文件不存在或为空：可用 `templates/agent-entry.md` 创建。
- 已有非空入口文件只追加符合语言偏好的入口段。
- 已有等价 `.agents/instructions.md` 指针：不修改。
- 不得用 `templates/agent-entry.md` 整体替换已有非空入口文件。
- 除非用户明确说“覆盖”“重写”或指定替换文件，否则不要压缩、重排或删除已有入口内容。

## Memory Bank

项目内 memory 规则见 `references/memory-bank.md`。

默认文件：

```text
.agents/instructions.md
.agents/active.md
.agents/progress.md
.agents/lessons.md
.agents/scratch/
docs/adr/
```

更新时机：

- 任务开始、阶段完成、会话结束时更新 `.agents/active.md`。
- 重要里程碑追加 `.agents/progress.md`。
- 可跨任务复用的坑和规则写入 `.agents/lessons.md`。
- 长期技术决策写入 `docs/adr/`。
- Superpowers spec/plan 保留原文件，memory 只链接；obinit 不创建、不改写、不递归读取 `docs/superpowers/specs/` 或 `docs/superpowers/plans/`。

## Obsidian 同步

Obsidian 只作为跨会话上下文和公共知识入口，不作为源码、构建、测试、部署或运行时依赖。细节见 `references/obsidian-sync.md`。

- 项目笔记默认路径：`Agent/Projects/<project>.md`。
- 公共知识默认路径：`Agent/Knowledge/`。
- 重复运行时也要检查 Obsidian 项目笔记。
- Obsidian 项目笔记存在但内容过期时，按当前模式幂等更新。
- Obsidian 项目笔记的相关知识只记录真实查阅或明确相关的公共知识笔记；不要预填通用示例链接。
- 完成后必须读回 Obsidian 项目笔记。

任务开始或遇到相关问题时，按任务领域、技术栈、错误信息或用户问题在 `Agent/Knowledge/` 关键词定向搜索公共知识；只有命中相关笔记后才明确读取并使用。不要全量自动加载公共知识，不扫描整个 vault。

## 模板

优先使用本 skill 的模板：

| 模板 | 目标 |
| --- | --- |
| `templates/instructions.md` | 新项目 `.agents/instructions.md` |
| `templates/instructions-index.md` | 成熟项目索引型 `.agents/instructions.md` |
| `templates/agent-entry.md` | 空入口文件 |
| `templates/active.md` | `.agents/active.md` |
| `templates/progress.md` | `.agents/progress.md` |
| `templates/lessons.md` | `.agents/lessons.md` |
| `templates/agents-readme.md` | `.agents/README.md` |
| `templates/adr-readme.md` | `docs/adr/README.md` |
| `templates/obsidian-project-note.md` | Obsidian 项目笔记 |

如果目标文件已有非空内容，先读取并合并；只有用户明确要求替换时才整体覆盖。

## 调用方式

常规使用：

```text
$obinit
```

或：

```text
使用 obinit 初始化当前项目。
```

只有偏离默认行为时才补充说明，例如指定项目名、指定 Obsidian vault、跳过 Claude 入口或允许覆盖已有文件。
