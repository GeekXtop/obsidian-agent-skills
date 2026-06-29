# 当前状态

## 当前任务

- 目标：新增统一版本号同步脚本，避免发版时手工修改多个 manifest。
- 状态：已完成。新增 `scripts/bump-version.mjs` 和 `npm run version:set -- <version>`；README 和校验脚本已同步；未提交、未推送。
- 最后更新：2026-06-30

## 当前状态

- 已完成：新增 `skills/obdoc/SKILL.md`，职责定位为配置文档、教程、runbook、迁移指南和排障记录等“文档型输出”。
- 已完成：`$obdoc` 明确和 `$oblearn` 分工：`obdoc` 生成可独立阅读的长文档，`oblearn` 生成短经验条目；`obdoc` 只列出“可提取知识候选”，不自动混写公共知识条目。
- 已完成：`$obdoc` 支持当前对话、粘贴材料、本地文件、项目材料和完整 Codex session id；session id 只能在本机 Codex 会话存储中 fixed-string 精确定位，不使用 `codex resume`。
- 已完成：根据用户反馈统一 `$oblearn` / `$obdoc` 路径规则：用户指定路径优先，已有明确命中的公共知识笔记或文档优先更新；不稳定时建议 `Agent/Knowledge/Inbox/`；稳定归类、移动、合并、拆分和批量 catalog 维护交给 `$obcurate`。
- 已完成：`$oblearn` 和 `$obdoc` 可以处于同一文件夹，通过 frontmatter 和正文结构区分：`kind: knowledge` / `source_skill: oblearn` 表示短经验知识，`kind: document` / `source_skill: obdoc` 表示可阅读或可执行文档。
- 已完成：新增模板 `document-note.md` 和 `source-evidence.md`，覆盖摘要、前提、配置或步骤、验证、风险回滚、来源摘要和可提取知识候选。
- 已完成：新增 `commands/obdoc.md` 和 `skills/obdoc/agents/openai.yaml`。
- 已完成：更新 `skills.json`、`README.md` 和 `.codex-plugin/plugin.json`，插件说明从五个 skills 改为六个 skills，并补 `$obdoc` 使用说明和 Codex 默认 prompt。
- 已完成：同步 `package.json`、`skills.json`、README、Claude/Codex plugin 和 marketplace 描述，顶层描述现在包含“文档整理”。
- 已完成：`$oblearn` / `$obdoc` 允许为本次实际写入或更新的明确产物最小更新 `_catalog.md`；结构性 catalog 维护由 `$obcurate` 执行。
- 已完成：`$obcurate` 现在明确整理同目录知识和文档时保留并使用 `kind`、`source_skill`、`doc_type`。
- 已完成：`$obdoc` 的 `doc_type` 和 `source` 改为自由描述字段，不再使用 `guide|runbook|config|migration|troubleshooting` 或 `current-conversation|transcript|...` 这类固定枚举占位。
- 已完成：catalog 示例中的 `aliases` 默认改为 `[]`，避免暗示必须填写别名；只有用户确认、已有 frontmatter、标题可直接推出或重命名/合并保留旧名时才填写。
- 已完成：`scripts/validate-skills.mjs` 增加必备 skill 名称、`obdoc` 概念、统一路径规则、模板字段、README 使用前提、项目描述、Codex plugin interface/defaultPrompt 等校验。
- 已发布：提交 `0df8046 Release v0.1.22` 已推送到 `origin/main`。
- 已发布：按 ADR 只创建并推送插件 tag `obsidian-agent-skills--v0.1.22`，未创建平行 `v0.1.22`。
- 已更新：Codex marketplace 已 upgrade，并通过 `codex plugin add obsidian-agent-skills@obsidian-agent-skills` 安装到 `0.1.22`。
- 已更新：Claude Code marketplace 已 update，并通过 `claude plugin update obsidian-agent-skills@obsidian-agent-skills --scope user` 从 `0.1.21` 更新到 `0.1.22`。
- 已完成：新增 `scripts/bump-version.mjs`，统一更新 `package.json`、`skills.json`、`.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json` 和 `.codex-plugin/plugin.json` 的版本字段。
- 已完成：`package.json` 增加 `version:set` 脚本；README 开发章节增加 `npm run version:set -- 0.1.23` 用法。
- 已完成：`scripts/validate-skills.mjs` 要求版本同步脚本和 README 说明存在，避免后续回退到手工多文件改版本。
- 进行中：无。
- 阻塞：无。

## 验证

- 红灯：先在校验脚本中要求 `obdoc` 存在，运行 `npm test` 失败并输出 `skills directory: missing required skills: obdoc`。
- 红灯：将 `obdoc` 校验从固定目录集合改为要求“候选路径 / 不要固定目录 / 用户指定路径”，运行 `npm test` 失败并指出缺少“候选路径、不要固定目录”。
- 红灯：新增统一路径规则和模板字段校验后，`npm test` 失败并指出 `oblearn` / `obdoc` 缺少共享路径术语与 `kind` / `source_skill` 字段。
- 红灯：新增审查校验后，`npm test` 失败并指出 `$obdoc` 缺少 README 使用前提、Codex manifest 发现层缺 `$obdoc`、`oblearn` catalog 边界和 `obcurate` metadata 边界缺失。
- 红灯：新增 `public-knowledge-entry.md` catalog 边界校验后，`npm test` 失败并指出模板仍要求直接更新 catalog。
- 绿灯：补齐 `oblearn` / `obdoc` / `obcurate` 规则、模板、README、Codex manifest 和校验脚本后运行 `npm test`，输出 `All skills are valid.`。
- 绿灯：补齐顶层项目描述和对应校验后再次运行 `npm test`，输出 `All skills are valid.`；旧文案搜索无命中。
- 绿灯：发版后再次运行 `npm test`，输出 `All skills are valid.`。
- 已验证：`codex plugin list --json` 显示 `obsidian-agent-skills@obsidian-agent-skills` 版本 `0.1.22` 且 enabled。
- 已验证：`claude plugin list --json` 显示 `obsidian-agent-skills@obsidian-agent-skills` 版本 `0.1.22`；Claude Code 报告该插件 enabled 为 false，需按用户配置启用并重启或 reload 后应用。
- 红灯：新增版本脚本校验后，`npm test` 失败并指出缺少 `scripts.version:set` 和 `scripts/bump-version.mjs`。
- 红灯：新增 README 命令说明校验后，`npm test` 失败并指出 README 缺少 `npm run version:set --`。
- 绿灯：实现脚本、npm 命令和 README 后运行 `npm test`，输出 `All skills are valid.`。
- 已验证：`npm run version:set -- 0.1.23` 能同步更新五个版本位置，再运行 `npm run version:set -- 0.1.22` 能恢复当前版本。
- 已验证：`node scripts/bump-version.mjs nope` 对无效版本输出用法并非 0 退出。

## 关键文件

- `skills/obdoc/SKILL.md`：新 skill 的职责、输入来源、Codex session id 读取边界、输出目标和工作流。
- `skills/obdoc/templates/document-note.md`：Obsidian 文档模板。
- `skills/oblearn/SKILL.md`：与 `$obdoc` 统一路径规则，明确短经验知识用 `kind: knowledge` 区分。
- `skills/oblearn/templates/public-knowledge-note.md`：新增 `kind: knowledge` 和 `source_skill: oblearn`。
- `skills/obdoc/templates/source-evidence.md`：来源摘要模板。
- `commands/obdoc.md`：命令入口。
- `skills/obdoc/agents/openai.yaml`：Codex/OpenAI UI metadata。
- `skills.json`：新增 `obdoc` registry 项，并同步顶层描述。
- `.codex-plugin/plugin.json`：Codex 插件 interface longDescription 和 defaultPrompt 增加 `$obdoc`，并同步顶层描述。
- `.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json`、`package.json`：同步顶层描述。
- `README.md`：安装、命令、skills 表和使用说明增加 `$obdoc`。
- `scripts/validate-skills.mjs`：新增 `obdoc` 存在性、关键概念、发现层、README 前提、项目描述、`doc_type` / `source` 自由字段、模板禁用 `<a|b>` 枚举占位、catalog aliases 默认空列表和 catalog 最小更新边界校验。
- `scripts/bump-version.mjs`：统一同步 release 版本号。
- `package.json`：新增 `version:set` 命令。

## 下一步

1. 用户决定是否提交当前版本同步脚本改动。
2. 若要在 Claude Code 中立即使用 `0.1.22`，按当前客户端状态需要启用该插件并重启或 `/reload`。
3. Codex 当前会话不一定热加载新插件；需要新会话或重启后使用 `0.1.22` skill。

## 当前 ADR

- [0001-use-marketplace-plugin-update-flow.md](../docs/adr/0001-use-marketplace-plugin-update-flow.md)：使用 marketplace/plugin 命令更新本地插件。

## 已使用知识

- 无新增公共知识使用。

## 已提取知识

- 本轮未提取公共知识。

## Obsidian

- 项目笔记：`Agent/Projects/obsidian-agent-skills.md`
