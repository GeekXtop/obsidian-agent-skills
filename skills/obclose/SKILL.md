---
name: obclose
description: 在任务、阶段或会话收尾时更新项目内 agent memory。适用于用户说收尾、同步状态、更新 active/progress/lessons、结束当前任务、记录本次进展，或 agent 完成实质任务后需要主动保存可恢复上下文。
---

# Obclose

把当前任务或会话的实际进展写回项目内 memory。`obclose` 不初始化项目，不创建架构决策，不沉淀公共知识；它只把当前项目状态整理到 `.agents/`，让下一次 agent 能接着做。

## 触发时机

`obclose` 是收尾动作，不是后台 hook。用户显式说 `$obclose`、`收尾`、`同步状态`、`更新 memory` 或类似请求时必须执行。

即使用户没有显式要求，agent 在以下情况也应主动执行：

- 完成了有实质代码或文档改动的任务。
- 完成了一个阶段性验证，且结果会影响后续工作。
- 任务未完成但上下文复杂，下一次需要接着做。
- 发现项目内可复用经验，需要写入 `.agents/lessons.md`。

以下情况不执行，除非用户明确要求：

- 只是回答概念问题、解释代码或做轻量查询。
- 没有改变项目状态，也没有产生需要下次恢复的上下文。
- 用户明确说不要更新 memory。
- 当前状态已由权威状态载体记录，且没有下一次 agent 需要接手的未完成事项。

## 默认行为

用户只说 `$obclose`、`收尾`、`同步状态`、`更新 memory` 或类似请求时，按安全默认值执行：

- 读取当前项目规则和 memory 文件。
- 读取 git 状态、最近 diff 摘要和最近提交。
- 总结本次完成、未完成、验证结果、下一步。
- 更新 `.agents/active.md`。
- 追加 `.agents/progress.md` 的阶段记录。
- 只有发现可复用经验时才更新 `.agents/lessons.md`。
- 对与本次任务相关的 lessons 条目做增量验证，更新 `最后验证`；不全量验证 `.agents/lessons.md`。
- 检查 `.agents/progress.md` 和 `.agents/lessons.md` 是否过长或明显重复，并按“Memory 维护”规则处理。
- 不修改源码、依赖、构建配置或 git 配置。
- 不自动提交、不自动推送、不自动创建 release。
- 不扫描整个 Obsidian vault。
- 不把项目私有内容写入 Obsidian 公共知识笔记。
- 新建或追加的 memory 内容默认遵循用户或项目既有语言偏好；当前模板使用简体中文。技术标识符、路径、命令、包名和英文专有名词保持原样。

如果项目还没有 `.agents/` 或 `.agents/instructions.md`，提示先运行 `$obinit`，不要自行创建完整初始化结构。

## 权威状态载体边界

权威状态载体包括 git commit、tag、PR、CI/CD、release、artifact、ADR、migration、issue/ticket、runbook。它们已经记录了可恢复状态时，`obclose` 不为短暂中间态单独追加 `.agents/progress.md`，也不为已完成状态再单独追加第二次 memory 提交。

需要记录的 memory 只覆盖权威状态载体外的信息：下一次 agent 需要接手的未完成事项、不在载体中的决策背景、阻塞、人工确认点或可复用经验。已由权威状态载体记录的完成状态，只在最终回复说明载体位置和验证结果，除非用户明确要求再更新 memory。

`.agents/active.md` 只记录会影响下一次继续工作的真实阻塞或未完成事项；不记录“下一步 commit/tag/push”“等待 CI 完成后写一条状态”“部署完成后再补 progress”这类即将由权威状态载体承载的短暂中间态。

## Obsidian vault 写入契约

所有 Obsidian Markdown mutation，包括创建、覆盖、追加、局部修改、frontmatter、catalog 或项目笔记更新，以及移动和重命名，都直接操作 vault 本地文件系统。

`obsidian` CLI 只用于 vault 定位、有限搜索、读取和写入后读回校验。

不得以 `obsidian create`、`obsidian append`、`obsidian prepend`、`obsidian property:set`、`obsidian move`、`obsidian rename` 或 `content=` 作为写入或回退路径。

无法解析 vault 本地路径时，请用户提供或确认目标 vault 的本地文件系统路径，再执行文件操作。

本 skill 仅在回写本次实际使用过的 Obsidian 公共知识 `last_verified`、`status` 或退役说明时触发该契约；项目内 `.agents/` memory 继续直接写项目文件。

## 工作流

1. 确定项目根目录：优先使用当前 git root，否则使用当前目录。
2. 读取项目规则：
   - `AGENTS.md`
   - `.agents/instructions.md`
3. 读取现有 memory：
   - `.agents/active.md`
   - `.agents/progress.md`
   - `.agents/lessons.md`
4. 如果是 git 项目，读取：
   - `git status --short`
   - `git diff --stat`
   - `git log -5 --oneline`
5. 按实际证据总结：
   - 本次目标
   - 已完成事项
   - 当前未完成事项
   - 验证命令和结果
   - 关键变更文件
   - 下一步
   - 阻塞问题
6. 更新 `.agents/active.md` 为当前最新状态。
7. 追加 `.agents/progress.md` 的日期条目。
8. 如果发现跨任务复用经验，追加 `.agents/lessons.md`。
9. 对本次任务相关的 lessons 条目执行增量验证；验证失败按证据强度分级标注。
10. 检查 memory 文件大小和重复度，必要时轻量压缩或提出整理建议。
11. 如果发现重要技术决策但没有 ADR，建议运行 `$obadr`。
12. 如果发现明显跨项目可复用经验，建议运行 `$oblearn`。
13. 如果待复核或已退役条目积压，建议运行 `$obcurate` 复查。

## active.md 写法

`.agents/active.md` 表示“下一次打开项目时最该知道什么”。它应该短而具体。

推荐结构见 `templates/active.md`。

如果现有 `active.md` 已有不同结构，保留原结构并就地更新相关段落。不要整体重写用户已有内容，除非用户明确要求重写。

## progress.md 写法

`.agents/progress.md` 记录阶段性进展，不保存聊天流水。

追加条目使用 `templates/progress-entry.md`。

只记录对后续工作有价值的信息。不要把每个命令输出全文复制进去。

## lessons.md 写法

`.agents/lessons.md` 只保存可复用经验，不能变成任务日志。

追加条目使用 `templates/lesson-entry.md`。

只有满足至少一条才写入：

- 下次同项目任务会再次遇到。
- 能避免重复踩坑。
- 是已验证的调试结论。
- 是项目内长期约定。

如果经验明显跨项目复用，先写入 `.agents/lessons.md`，结束时建议运行 `$oblearn`。

## 经验验证

收尾时对经验做增量验证：只验证与本次任务相关的 lessons 条目——本次读取过、使用过，或其 `验证方式` 涉及本次改动文件的条目。不全量验证 `.agents/lessons.md`，不扫描 Obsidian，不验证与本次无关的条目。

对每条相关条目：

- 执行其 `验证方式`，更新 `最后验证` 日期和一行结论。
- 验证失败或与当前证据矛盾时按证据强度分级标注：有直接证伪证据（检查命令实际执行且失败、引用的文件或术语已不存在）时标已退役（`deprecated`）并附证据和日期；仅怀疑过时、无直接证据时标待复核（`needs-review`）并附一行怀疑理由。
- 标注只追加 `状态` 行，保留条目原文；已退役条目在之后的会话不再作为有效经验使用，只作为“此路不通”的反例背景。
- 删除已退役条目属于确认后维护，遵循“删除历史记录或经验”需用户确认的规则。

本次会话使用过 Obsidian 公共知识时（见 `.agents/active.md` 的“已使用知识”），对使用结果明确的知识回写 frontmatter `last_verified`；使用中被证伪的按同一分级规则更新 `status` 并在正文追加退役说明。没有使用过的公共知识不回写，不扫描 vault。

既有条目仍使用旧字段 `下次检查` 时保持原样读取；只在该条目本次被验证或修改时顺手升级为 `验证方式` / `最后验证`，不批量迁移。

## Memory 维护

`obclose` 负责控制项目内 memory 膨胀，但只做轻量维护。

每次收尾时检查：

- `.agents/progress.md` 是否超过约 500 行或 50 KB。
- `.agents/lessons.md` 是否超过约 300 行或 30 KB。
- 新增经验是否和已有条目明显重复。

可以直接做的维护：

- `active.md` 始终保持当前状态快照，直接就地更新。
- `progress.md` 过长时，保留最近阶段记录，把较旧阶段压缩为短摘要，或归档到 `.agents/archive/progress-YYYY.md`。
- `lessons.md` 新增条目与已有经验明显重复时，合并到已有条目，不追加近似重复段落。
- `lessons.md` 有少量同主题重复时，在原文件内合并和重排。

需要用户确认后再做：

- 按主题拆分 `.agents/lessons.md` 为多个文件。
- 删除历史记录或经验。
- 大规模重写、移动、重命名 `.agents/` 下的 memory 文件。

不属于 `obclose` 的维护：

- 不把项目经验自动写入 Obsidian 公共知识；只建议 `$oblearn`。
- 不整理 `Agent/Knowledge/` 的主题、Inbox、catalog 或 wikilink；只建议 `$obcurate`。
- 不把聊天流水、完整命令输出或运行日志塞进 memory。

## 判断规则

- 写 `.agents/active.md`：几乎每次 `$obclose` 都应该更新。
- 写 `.agents/progress.md`：本次有实际完成、验证或明确阶段进展时更新。
- 写 `.agents/lessons.md`：只有可复用经验时更新。
- 建议 `$obadr`：出现长期技术取舍、架构边界、依赖选择或重要约定时。
- 建议 `$oblearn`：出现跨项目可复用经验、检查清单或高成本踩坑时。
- 标已退役（`deprecated`）：只有直接证伪证据时；仅怀疑过时标待复核（`needs-review`）。
- 建议 `$obcurate`：待复核或已退役条目积压、或较多条目长期未验证时。

## 完成说明

结束时只汇报：

- 更新了哪些 memory 文件。
- 验证了哪些 lessons 条目和验证结果。
- 记录了哪些完成事项和下一步。
- 是否建议运行 `$obadr`。
- 是否建议运行 `$oblearn`。

不要把完整 memory 内容复制到最终回复，除非用户要求。
