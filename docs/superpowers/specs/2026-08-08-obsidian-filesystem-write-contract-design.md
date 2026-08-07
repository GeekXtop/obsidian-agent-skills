# Obsidian vault 文件写入契约设计

- 日期：2026-08-08
- 状态：已实施
- 范围：`$obinit`、`$oblearn`、`$obdoc`、`$obcurate`、`$obclose`、`scripts/validate-skills.mjs` 与 README

## 问题

现有仓库只在 `$oblearn` 和 `$obdoc` 中写明 vault 文件写入策略，校验器也只覆盖这两个 skill。其余会修改 Obsidian vault 的 skill 没有同一契约，agent 因而可能把正文、frontmatter 或 catalog 内容放进 `obsidian create`、`append`、`prepend`、`property:set` 等 CLI 参数，触发 IPC JSON 转义错误。

## 设计决策

1. 所有 Obsidian Markdown mutation 统一直接操作 vault 本地文件系统，包括创建、覆盖、追加、局部修改、frontmatter、catalog、项目笔记更新，以及移动和重命名。
2. `obsidian` CLI 只承担 vault 定位、有限搜索、读取和写入后读回校验。
3. CLI mutation 命令不作为正常写入或回退路径，包括 `obsidian create`、`append`、`prepend`、`property:set`、`move`、`rename`，以及通过 `content=` 传递正文。
4. 无法解析 vault 本地路径时，停止写入并请用户提供或确认路径；不得退回 CLI 写入。
5. 校验器对所有会写 vault 的 skill 统一应用契约，并检查 `$obinit` 的详细同步 reference，防止只修两个入口后再次回归。

## 影响范围

- `$obinit`：项目笔记及相关知识链接更新。
- `$oblearn`：Knowledge 笔记、Knowledge catalog、项目笔记。
- `$obdoc`：Documents 文档和 Documents catalog。
- `$obcurate`：笔记、catalog、frontmatter、移动和重命名。
- `$obclose`：被使用公共知识的 `last_verified` / `status` 回写。

## 非目标

- 不卸载或禁用 Obsidian 官方 CLI；搜索、读取和读回仍可使用。
- 不改变 Knowledge、Documents、Projects 的路径和职责分工。
- 不改版本号，不发布，不提交，不推送。

## 验收

- 扩展 validator 后，现有 skill 因缺少统一契约而出现预期红灯。
- 补齐五个写入 skill 和 `obsidian-sync.md` 后，`npm test` 输出 `All skills are valid.`。
- README 明确正文不通过 CLI 参数写入。
- Codex/Claude Code 中 `kepano/obsidian-skills` 的插件、marketplace、独立副本和缓存均不存在。
