# 项目文档

本文件是项目文档的事实地图：哪个文档是哪些内容的事实源，以及改动哪些路径时必须同步更新哪个文档。

## 权威文档地图

入表的两类文档：

- **当前状态**：描述系统现在如何工作，行为改动必须同批更新。
- **决策记录**：`docs/adr/` 下逐条累积，新增决策只加新文件，不改旧文件。

设计稿、实施计划等**时点快照**不入表：它们记录当时的判断，不随后续改动更新，各自按日期累积。

| 文档 | 事实范围 | 同步触发（改这里就要更新它） |
|---|---|---|
| [`README.md`](../README.md) | 项目定位、`$ob*` skill 用法、安装与发布流程、开发命令 | skill 的触发语义与用法、安装步骤、发布流程、npm scripts |
| [`AGENTS.md`](../AGENTS.md) | 仓库项目约定：skill 放置路径、frontmatter 字段、运行时假设、发布前验证 | 目录约定、skill 结构要求、发布门禁 |
| [`.agents/instructions.md`](../.agents/instructions.md) | agent 工作约定、自举门禁、memory 契约与代际 | memory 代际、初始化范围、自举门禁判据 |
| [`skills/obinit/references/memory-upgrade.md`](../skills/obinit/references/memory-upgrade.md) | `.agents/` 模板代际定义与存量项目迁移清单 | 任一模板的代际变更（新增/改名/删除节、规则口径变化） |
| [`skills/ob*/SKILL.md`](../skills/) | 各 skill 的行为契约与运行时假设 | 对应该 skill 的模板、脚本、references 或校验规则 |
| [`scripts/validate-skills.mjs`](../scripts/validate-skills.mjs) | `npm test` 的全部门禁：模板必备术语、共享章节、自举一致性 | 任何模板或 SKILL.md 契约变化（新断言必须同批加） |
| [`docs/README.md`](README.md) | 本文件：项目文档的事实索引 | 文档新增、改名或下掉 |
| `docs/superpowers/`（`specs/`、`plans/`） | 时点快照：当时的判断，不随后续改动更新 | 不更新 |

`docs/adr/` 是决策记录：新增决策只加新文件，不改旧文件。当前条目见 [ADR 索引](adr/README.md)。

## 维护规则

- 新增或改名文档后同批更新本表。
- 行为改动同批更新受影响的文档，并在同一批提交里完成。
- 定位要写到能跳过去的粒度：**文件名 + 节标题**，能写到行号就写行号。只写文档名等于没定位。
- 写实施计划时先读本表，把受影响文档的节标题写进每个任务的改动点，不要留到实现完再补。
- 表中未定位的条目表示尚未落位，按「先定位再改行为」处理。
- 有意保留旧写法或刻意不改的条目，在对应行注明「有意保留」，避免在重复运行 `$obinit` 时被反复报告为差异。
