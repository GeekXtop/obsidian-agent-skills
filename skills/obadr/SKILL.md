---
name: obadr
description: 为当前项目记录 Architecture Decision Record，并在需要时回写项目 memory 的 ADR 链接。适用于用户要求记录技术决策、沉淀架构取舍、解释为什么选择或放弃某个方案、把重要决定写入 docs/adr/，或希望后续 agent 能理解项目级决策背景。
---

# Obadr

把当前项目的重要技术取舍写成项目内 ADR。ADR 属于当前仓库，不属于 Obsidian 公共知识库；跨项目可复用经验由 `$oblearn` 另行提取。

## 默认行为

用户只说 `$obadr`、`记录 ADR`、`把这个决定写下来` 或类似请求时，按安全默认值执行：

- 只写当前项目仓库内的 `docs/adr/`。
- 不把 ADR 原文复制到 Obsidian 公共知识笔记。
- 不修改源码、依赖、构建配置或 git 配置。
- 先读取已有 `AGENTS.md`、`.agents/instructions.md`、`.agents/active.md`、相关 `docs/adr/`，避免重复记录。
- 如果决策内容不明确，先问用户补齐背景、备选方案、最终决定和后果。
- 如果已有 ADR 覆盖同一决策，优先更新状态或追加后续说明，不创建重复 ADR。
- 完成后仅在有助于下一次 agent 恢复上下文时，更新 `.agents/active.md` 或 `.agents/progress.md` 的 ADR 链接。
- 新建或追加的 ADR、memory 段落默认遵循用户或项目既有语言偏好；当前模板使用简体中文。技术标识符、路径、命令、包名和英文专有名词保持原样。

## 适用场景

使用 ADR 记录长期会影响维护的项目级决定，例如：

- 技术栈、框架、数据库、运行时、部署平台选择。
- 目录结构、模块边界、数据流、权限模型。
- 引入或拒绝一个依赖、服务、模式或约定。
- 一次重要重构的边界和原因。
- 已经验证过的长期技术取舍。

不要为这些内容创建 ADR：

- 临时任务状态。
- 普通 bug 修复过程。
- 聊天摘要。
- 未验证猜测。
- 跨项目通用经验本身。
- secret、账号、密钥、客户信息、隐私内容。

跨项目通用经验应该进入 `$oblearn` 的候选知识；项目内决策才进入 `$obadr`。

## 工作流

1. 确定项目根目录：优先使用当前 git root，否则使用当前目录。
2. 读取项目规则和记忆文件：
   - `AGENTS.md`
   - `.agents/instructions.md`
   - `.agents/active.md`
   - `.agents/progress.md`
3. 读取 `docs/adr/` 下现有 ADR 标题和最近相关条目。
4. 判断是否需要新 ADR：
   - 新的长期项目决策：创建新 ADR。
   - 已有 ADR 的后续变化：更新已有 ADR 状态或追加后续说明。
   - 只是可复用经验：建议使用 `$oblearn`，不要写 ADR。
5. 如果缺少关键信息，向用户提出简短问题。
6. 创建或更新 ADR 文件。
7. 回写 `.agents/active.md` 或 `.agents/progress.md`，记录本次 ADR 链接。
8. 结束时说明写入的 ADR 路径、状态和是否建议后续运行 `$oblearn`。

## 历史材料读取

`obadr` 读取历史材料只为避免重复 ADR，或补足当前决策背景。不要把历史材料搜索当成寻找决策灵感的入口。

默认读取：

- `.agents/active.md`。
- 必要的 `.agents/progress.md`。
- `docs/adr/` 的索引、标题和相关 ADR。

只有存在明确线索时才读取额外历史材料：

- 用户指定某个历史决策、计划、归档或 ADR。
- `.agents/active.md`、`.agents/progress.md` 或现有 ADR 明确链接某个文件。
- 当前决策背景必须依赖某个历史阶段证据。

不要：

- 全量扫描 `.agents/archive/`。
- 全量读取历史 `progress`。
- 为寻找决策灵感遍历 `docs/`。
- 把历史计划、历史进展或 ADR 原文复制进新 ADR。

## 文件命名

ADR 默认写入：

```text
docs/adr/
```

文件名使用递增编号和短标题：

```text
0001-use-project-agent-memory.md
0002-keep-obsidian-as-context-layer.md
```

如果已有 ADR 不是编号风格，遵循项目现有命名方式。不要批量重命名已有 ADR。

## ADR 模板

新建 ADR 时使用 `templates/adr.md`。填充标题、状态、日期、决策人、背景、适用范围、非目标、决定、备选方案、后果和参考链接。

`适用范围` 用来说明该决定约束哪些模块、文件、工作流或运行环境。`非目标` 用来说明该决定不覆盖什么，避免后续 agent 把局部取舍误读成全局规则。

默认状态：

- 已经做出的决定用 `accepted`。
- 还在讨论的决定用 `proposed`。
- 被替代的决定用 `superseded`，并写明替代 ADR。
- 不再建议使用的决定用 `deprecated`，并写明废弃原因。

## 模板升级与历史 ADR

模板升级只影响新建和后续更新的 ADR；历史 ADR 默认保持原样，仍应按当时内容读取和理解。

读取旧 ADR 时兼容缺失字段，从正文推断适用范围、非目标或状态关系，不要因为缺少新模板字段就判定无效。不要批量迁移历史 ADR。

只有在以下情况才做最小回填：

- 正在更新该 ADR。
- 该 ADR 被替代、废弃或状态发生变化。
- 缺失字段会导致后续 agent 误读项目决策或无法恢复上下文。

回填时只追加必要小节或短句，不整体重写历史内容。

## 已有 ADR 维护

当用户明确要求维护已有 ADR 时，可以更新状态、追加后续说明、补充缺失的新模板字段，或修正会导致误读的标题或链接。

维护已有 ADR 时保持历史决策原意，不整体重写，不批量整理。标题修正只用于提高可读性或避免误导；如果标题变化会破坏外部引用，优先追加别名说明或更新明确相关的链接。

## 与 oblearn 的关系

`obadr` 写项目内决策，`oblearn` 提取跨项目经验。

推荐链路：

```text
重要技术决策
-> $obadr 写入 docs/adr/
-> 如有跨项目可复用经验，再用 $oblearn 提取到 Agent/Knowledge/
```

不要把项目私有 ADR 直接复制进 Obsidian 公共知识笔记。提取时必须脱敏、泛化，并保留适用范围。

## Memory 回写

如果 `.agents/active.md` 存在，且该 ADR 是当前工作恢复所需的上下文，追加或更新：

使用 `templates/active-adrs-section.md` 中的 `Current ADRs` 结构。

如果 `.agents/progress.md` 存在，且该 ADR 代表明确里程碑，追加短记录：

使用 `templates/progress-entry.md`。

不要创建聊天流水式日志。只记录能帮助下一次 agent 恢复项目上下文的信息。
