# 统一 obinit / obclose 的 active.md 章节集

- 状态：已交接
- 会话：dsh/active-section-set
- 开始：2026-09-11 06:08
- 涉及文件：`skills/obinit/templates/active.md`、`skills/obclose/templates/active.md`、`scripts/validate-skills.mjs`、`.agents/active.md`
- 目标：消除两个 `active.md` 模板的章节集差异（obinit 多一个 `## Obsidian`），并加断言防回归。
- 下一步：随下一版发布（0.1.29 候选）并在发版说明记录章节集变化。
- 结论：完成。以 obclose 模板为基准统一（项目笔记路径并入 `## 已提取知识`，不再有独立 `## Obsidian` 节）；validator 增加「两个模板章节序列一致」和「仓库实例章节集等于发布模板」两条断言；`npm test` 绿，4 条破坏实验在临时副本上全部红灯。属同代际兼容调整，不改变 memory 代际。
