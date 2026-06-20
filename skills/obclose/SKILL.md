---
name: obclose
description: 在任务、阶段或会话收尾时更新项目内 agent memory。适用于用户说收尾、同步状态、更新 active/progress/lessons、结束当前任务、记录本次进展，或希望下一次 agent 能快速恢复上下文。
---

# Obclose

把当前任务或会话的实际进展写回项目内 memory。`obclose` 不初始化项目，不创建架构决策，不沉淀公共知识；它只把当前项目状态整理到 `.agents/`，让下一次 agent 能接着做。

## 默认行为

用户只说 `$obclose`、`收尾`、`同步状态`、`更新 memory` 或类似请求时，按安全默认值执行：

- 读取当前项目规则和 memory 文件。
- 读取 git 状态、最近 diff 摘要和最近提交。
- 总结本次完成、未完成、验证结果、下一步。
- 更新 `.agents/active.md`。
- 追加 `.agents/progress.md` 的阶段记录。
- 只有发现可复用经验时才更新 `.agents/lessons.md`。
- 不修改源码、依赖、构建配置或 git 配置。
- 不自动提交、不自动推送、不自动创建 release。
- 不扫描整个 Obsidian vault。
- 不把项目私有内容写入 Obsidian 公共知识笔记。

如果项目还没有 `.agents/` 或 `.agents/instructions.md`，提示先运行 `$obinit`，不要自行创建完整初始化结构。

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
9. 如果发现重要技术决策但没有 ADR，建议运行 `$obadr`。
10. 如果发现明显跨项目可复用经验，建议运行 `$oblearn`。

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

## 判断规则

- 写 `.agents/active.md`：几乎每次 `$obclose` 都应该更新。
- 写 `.agents/progress.md`：本次有实际完成、验证或明确阶段进展时更新。
- 写 `.agents/lessons.md`：只有可复用经验时更新。
- 建议 `$obadr`：出现长期技术取舍、架构边界、依赖选择或重要约定时。
- 建议 `$oblearn`：出现跨项目可复用经验、检查清单或高成本踩坑时。

## 完成说明

结束时只汇报：

- 更新了哪些 memory 文件。
- 记录了哪些完成事项和下一步。
- 是否建议运行 `$obadr`。
- 是否建议运行 `$oblearn`。

不要把完整 memory 内容复制到最终回复，除非用户要求。
