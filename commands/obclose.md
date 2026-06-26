---
description: 收尾当前任务并更新项目 memory；实质任务结束时 agent 也可主动执行
argument-hint: '[任务摘要]'
---

使用 `obclose` skill 收尾当前任务或会话，并更新项目内 agent memory。完成实质代码/文档改动、阶段性验证或需要下次恢复上下文时，即使用户没有显式输入本命令，agent 也应主动按 `obclose` 规则收尾。

用户参数：

```text
$ARGUMENTS
```
