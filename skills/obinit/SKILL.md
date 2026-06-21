---
name: obinit
description: 初始化或更新软件项目的 Obsidian-backed 通用 agent 工作约定。适用于用户要求为新项目或已有仓库建立通用 agent 指令、创建或连接 Obsidian 项目笔记、创建 allowlist 范围内的 agent/doc 目录，或为 Codex、Claude Code 以及其他 coding agent 统一项目 onboarding 流程。
---

# Obinit

把一个项目初始化成“仓库规则 + Obsidian 项目上下文”的工作环境。`.agents/instructions.md` 是中立规则源头，Obsidian 项目笔记是跨会话上下文入口，工具专用文件只作为入口转发。

## 无参数默认行为

用户只说 `$obinit`、`使用 obinit` 或“初始化当前项目”时，直接按安全默认值执行，不要求用户重复说明。

- 自动判断新项目或已有项目。
- 新项目：创建完整初始化结构。
- 已有项目：只补齐缺失文件和目录，不覆盖已有非空文件。
- 已有 `AGENTS.md`、`CLAUDE.md`、`.agents/instructions.md`、`README.md` 或 `docs/` 时，先读取再合并。
- 发现规则冲突、入口文件语义冲突、已有目录用途不一致时，停止写入冲突文件并列出待确认项。
- 没有冲突的 allowlist 文件可以继续创建。
- 默认不创建 `GEMINI.md`。
- 默认不写脚本、不引入依赖、不改 git 配置。
- 新建或更新的长期项目文档默认使用简体中文；技术标识符、路径、命令、包名和英文专有名词保持原样。

用户要覆盖或重写时，必须明确说“覆盖”“重写”或给出具体文件。

## 入口文件保护

`AGENTS.md`、`CLAUDE.md`、`GEMINI.md` 等工具入口文件经常已有项目约定。处理这些文件时必须遵守：

- 目标文件不存在或为空：可以用 `templates/agent-entry.md` 创建中文入口。
- 目标文件已有非空内容：不得用 `templates/agent-entry.md` 整体替换。
- 目标文件已有非空内容且还没有 `.agents/instructions.md` 指针：只追加一小段中文入口说明，保留原文所有内容。
- 目标文件已有非空内容且已有等价指针：不修改该文件。
- 如果无法判断新增入口段应放在顶部还是底部，先问用户，不要猜测覆盖。

推荐追加段落：

```md
> Agent 规则入口：修改代码前先读 `.agents/instructions.md`。本文件保留仓库原有指南，`.agents/instructions.md` 是跨 agent 的工作约定汇总。
```

把已有入口文件压缩成短指针属于破坏性覆盖；除非用户明确要求重写，否则禁止这样做。

## 流程

1. 确定项目根目录：优先使用当前 git root，否则使用当前目录。
2. 确定项目名：默认取根目录文件夹名，除非用户指定。
3. 读取已有入口和文档：`AGENTS.md`、`CLAUDE.md`、`.agents/instructions.md`、`README.md`、`docs/`。
4. 确定初始化写入 allowlist：
   - `AGENTS.md`
   - `CLAUDE.md`
   - `.agents/`
   - `docs/`
5. 只创建或更新 allowlist 内的文件和目录；其他路径必须等用户明确授权。
6. 如果 Obsidian CLI 可用且 Obsidian 已打开，创建或更新配置好的项目笔记路径。
7. 完成后读回创建的项目文件；如果使用 Obsidian，也读回项目笔记。

## 默认约定

- 项目规则源头：`.agents/instructions.md`
- 工具适配文件：`AGENTS.md`、`CLAUDE.md`
- agent 记忆库：`.agents/`
- 当前状态：`.agents/active.md`
- 阶段进度：`.agents/progress.md`
- 复用经验：`.agents/lessons.md`
- 长期项目文档：`docs/`
- 架构决策记录：`docs/adr/`
- Superpowers 设计文档：`docs/superpowers/specs/`
- Superpowers 实现计划：`docs/superpowers/plans/`
- Obsidian 项目笔记目录：`Agent/Projects`
- Obsidian 公共知识目录：`Agent/Knowledge`
- Obsidian vault：默认使用最近聚焦的 vault，除非用户指定 `vault=...`

不要检查无关的 vault 目录。Obsidian 访问范围默认只限配置好的项目笔记路径和按任务关键词命中的公共知识笔记。

## Obsidian 如何体现

Obsidian 只承担三件事：

1. 保存跨会话项目上下文：目标、当前状态、命令、决策、开放问题、agent 日志。
2. 给 `.agents/instructions.md` 提供一个稳定引用：`Obsidian project note: Agent/Projects/<project>.md`。
3. 保存跨项目复用知识：框架约定、设计坑、部署坑、调试经验等公共笔记。

不要把 Obsidian 当成项目源码、运行依赖或全库搜索入口。公共知识必须通过关键词定向搜索和明确笔记读取来使用。

## 中立规则文件

`.agents/instructions.md` 应该简短、中立、可被不同 agent 读取：

- 修改代码前先读本文件。
- 项目事实写在仓库里。
- agent 草稿、计划、调查日志写在 `.agents/`。
- 当前任务状态写在 `.agents/active.md`。
- 阶段性结果摘要写在 `.agents/progress.md`。
- 可跨任务复用的坑和规则写在 `.agents/lessons.md`。
- 长期文档写在 `docs/`。
- 架构决策写在 `docs/adr/`。
- 跨会话上下文写在配置好的 Obsidian 项目笔记，并在本文件记录路径。
- 设计和计划类过程文档保留在 `docs/superpowers/`，不要全文复制进 `.agents/`。
- 初始化阶段只写 allowlist 路径。
- 正常开发阶段只修改用户任务范围内的代码。
- 批量移动、删除、重命名、改依赖、改生成文件、重组文档前先问用户。

## Memory Bank 分层

项目内记忆库只保存索引、状态、摘要和长期经验，不保存聊天流水。

```text
.agents/
  instructions.md   # 中立规则源头
  active.md         # 当前任务、当前 spec/plan、下一步
  progress.md       # 里程碑式进展摘要
  lessons.md        # 可复用的坑、限制、经验
  scratch/          # 临时调查材料，可清理
docs/
  superpowers/
    specs/          # Superpowers 设计规格书
    plans/          # Superpowers 实现计划
  adr/              # 长期架构决策
```

更新规则：

- 任务开始、阶段完成、会话结束时更新 `.agents/active.md`。
- 完成重要里程碑时更新 `.agents/progress.md`。
- 只有可复用经验才写入 `.agents/lessons.md`。
- 长期设计决策抽成 `docs/adr/`。
- Superpowers 生成的 spec/plan 保留原文件，`.agents/active.md` 只链接当前使用的 spec/plan。

## 公共知识查阅

当任务属于已有公共经验领域时，先定向查 Obsidian 公共知识，再设计或改代码。不要扫全库。

示例规则：

- 前端 UI / 设计任务：查 `frontend design pitfalls`、`responsive layout checklist`、`react project conventions`。
- React 项目约定：查 `react project conventions`。
- Tailwind / shadcn UI：查 `tailwind ui pitfalls`、`shadcn usage notes`。
- 部署任务：查 `<platform> deployment lessons`。
- 反复出现的错误：查关键词和 `.agents/lessons.md`。

Obsidian CLI 示例：

```bash
obsidian search query="frontend design pitfalls" limit=5
obsidian read path="Agent/Knowledge/Frontend Design Pitfalls.md"
```

如果使用了公共知识笔记，在 `.agents/active.md` 记录：

使用 `templates/active.md` 中的 `Knowledge Used` 结构，或在已有 `.agents/active.md` 中追加同名段落。

如果任务中发现新的可复用坑：

1. 先写入项目内 `.agents/lessons.md`。
2. 若它明显跨项目复用，再追加到对应 Obsidian 公共知识笔记。
3. 新建公共知识笔记前先问用户；更新已有明确相关笔记可以直接追加简短条目。

阶段结束、功能完成或踩坑复盘时，使用 `$oblearn` 从项目记忆库中提取公共知识。

工具专用文件保持很短。只有在 `AGENTS.md` 或 `CLAUDE.md` 不存在、为空、或用户明确要求重写时，才使用 `templates/agent-entry.md` 生成文件。已有非空入口文件只追加中文入口段，不要整体替换。

## Obsidian 项目笔记

创建 Obsidian 项目笔记时，只写项目级索引和跨项目知识入口：

使用 `templates/obsidian-project-note.md`。填充 `<project>`、`<repo>` 和日期，不要把私人笔记复制进仓库。

不要让 Obsidian 成为构建、测试、部署或运行时依赖。

## 模板文件

初始化时优先使用本 skill 的模板文件：

- `templates/instructions.md` -> `.agents/instructions.md`
- `templates/agent-entry.md` -> `AGENTS.md`、`CLAUDE.md`
- `templates/agents-readme.md` -> `.agents/README.md`
- `templates/active.md` -> `.agents/active.md`
- `templates/progress.md` -> `.agents/progress.md`
- `templates/lessons.md` -> `.agents/lessons.md`
- `templates/adr-readme.md` -> `docs/adr/README.md`
- `templates/superpowers-specs-readme.md` -> `docs/superpowers/specs/README.md`
- `templates/superpowers-plans-readme.md` -> `docs/superpowers/plans/README.md`
- `templates/obsidian-project-note.md` -> Obsidian project note

如果目标文件已有非空内容，先读取并合并，不要直接覆盖。合并后的新增说明默认使用简体中文。

## 初始化清单

用当前可用的文件工具创建或更新：

1. `.agents/instructions.md`：中立规则源头，使用 `templates/instructions.md`。
2. `AGENTS.md`：通用 agent 入口；仅在文件不存在或为空时使用 `templates/agent-entry.md`，已有内容时只追加中文入口段。
3. `CLAUDE.md`：如果用户使用 Claude Code；仅在文件不存在或为空时使用 `templates/agent-entry.md`，已有内容时只追加中文入口段。
4. `.agents/README.md`：使用 `templates/agents-readme.md`。
5. `.agents/active.md`：使用 `templates/active.md`。
6. `.agents/progress.md`：使用 `templates/progress.md`。
7. `.agents/lessons.md`：使用 `templates/lessons.md`。
8. `docs/superpowers/specs/README.md`：使用 `templates/superpowers-specs-readme.md`。
9. `docs/superpowers/plans/README.md`：使用 `templates/superpowers-plans-readme.md`。
10. `docs/adr/README.md`：使用 `templates/adr-readme.md`。
11. Obsidian 项目笔记：只创建或更新配置好的项目笔记路径。

覆盖已有非空指令文件前，先读取并保留用户已有规则；只有用户明确要求替换时才整体覆盖。

## 调用方式

常规使用只需要：

```text
$obinit
```

或者：

```text
使用 obinit 初始化当前项目。
```

只有在偏离默认行为时才补充说明，例如指定项目名、指定 Obsidian vault、跳过 Claude 入口、允许覆盖已有文件。
