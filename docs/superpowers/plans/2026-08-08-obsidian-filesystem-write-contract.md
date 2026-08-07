# Obsidian vault 文件写入契约实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 消除各 Obsidian skill 的 CLI mutation 回退路径，统一为 vault 本地文件系统写入，并用 validator 防止回归。

**Architecture:** 用一个共享 validator contract 覆盖所有会修改 vault 的 skill；每个 skill 用与自身职责一致的短契约说明 mutation 范围、CLI 只读职责和路径解析失败行为。`$obinit` 的细节放入已链接的 `references/obsidian-sync.md`，避免突破正文 wordsish 上限。

**Tech Stack:** Markdown Agent Skills + Node.js validator（`scripts/validate-skills.mjs`）。

## Global Constraints

- 使用简体中文；路径、命令、包名和英文专有名词保持原样。
- 所有 Markdown mutation 直接操作 vault 本地文件系统。
- `obsidian` CLI 只用于 vault 定位、搜索、读取和写入后读回。
- 无法解析 vault 本地路径时请用户提供或确认，不使用 CLI mutation 回退。
- 不改版本号，不提交，不推送，不发布。

---

### Task 0: 卸载第三方 obsidian-skills

**Files:** Codex/Claude Code 用户级插件配置、marketplace 与缓存；不修改仓库文件。

- [x] **Step 1:** 用官方插件管理命令卸载 `obsidian@obsidian-skills`。
- [x] **Step 2:** 用官方 marketplace 命令移除 `obsidian-skills`。
- [x] **Step 3:** 删除 Codex 早期独立安装的五个 skill 和 Claude Code 残留缓存。
- [x] **Step 4:** 用插件列表、marketplace 列表和精确路径检查验证不存在。

### Task 1: 建立 validator 红灯

**Files:**
- Modify: `scripts/validate-skills.mjs`

**Interfaces:**
- Produces: `obsidianVaultFilesystemMutationContract`，应用到 `obinit` reference、`oblearn`、`obdoc`、`obcurate`、`obclose`。

- [x] **Step 1:** 增加共享必需术语：vault 本地文件系统、mutation 覆盖范围、CLI 只读职责、路径解析失败处理、禁止 CLI mutation 回退。
- [x] **Step 2:** 将共享契约应用到五个会写 vault 的 skill；`obinit` 校验 `references/obsidian-sync.md`。
- [x] **Step 3:** 运行 `npm test`。

Expected: FAIL，至少指出 `obcurate`、`obclose` 和 `obinit/references/obsidian-sync.md` 缺少写入契约。

### Task 2: 补齐 skill 和 README

**Files:**
- Modify: `skills/obinit/references/obsidian-sync.md`
- Modify: `skills/oblearn/SKILL.md`
- Modify: `skills/obdoc/SKILL.md`
- Modify: `skills/obcurate/SKILL.md`
- Modify: `skills/obclose/SKILL.md`
- Modify: `README.md`

**Contract text shape:**

```md
所有 Obsidian Markdown 创建、覆盖、追加、局部修改、frontmatter、catalog/项目笔记更新、移动和重命名都直接操作 vault 本地文件系统。
`obsidian` CLI 只用于 vault 定位、有限搜索、读取和写入后读回。
不得以 CLI mutation 命令或 `content=` 传正文作为写入或回退路径；无法解析本地路径时请用户提供或确认。
```

- [x] **Step 1:** 按各 skill 实际职责加入或收紧上述契约。
- [x] **Step 2:** README 说明正文和 metadata 不经 CLI 参数传输。
- [x] **Step 3:** 运行 `npm test`。

Expected: PASS，输出 `All skills are valid.`。

### Task 3: 完整验证和收尾

**Files:**
- Modify: `.agents/active.md`
- Modify: `.agents/progress.md`
- Modify only if reusable evidence changes: `.agents/lessons.md`

- [x] **Step 1:** 运行 `npm test`、`git diff --check`、`git status --short`。
- [x] **Step 2:** 再次检查 Codex/Claude Code 插件、marketplace 和相关路径。
- [x] **Step 3:** 按 `$obclose` 更新项目 memory，并核验“Obsidian Markdown 写入统一使用 vault 文件”经验。
