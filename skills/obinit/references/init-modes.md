# 初始化模式

先读 `AGENTS.md`、`CLAUDE.md`、`.agents/instructions.md`、`README.md` 和 package metadata；对 `docs/` 只检查顶层信号和索引文件，再选模式。

| 模式 | 判定信号 | 写入策略 |
| --- | --- | --- |
| 新项目模式 | 没有非空入口指南，也没有明显项目文档 | 创建完整 `.agents/instructions.md`；入口文件可用薄指针 |
| 成熟项目接入模式 | fork、已有项目、已有非空 `AGENTS.md` / `CLAUDE.md` / README / docs 顶层信号 | 创建索引型 `.agents/instructions.md`；保留已有指南，只追加入口提示 |
| 重复运行模式 | `.agents/instructions.md`、`.agents/active.md` 或入口提示已存在 | 只补缺失文件、链接和过期表述；不重写、不重复追加、不重置状态；代际差异按 `memory-upgrade.md` 逐节对比后报告 |

执行前可运行：

```bash
node <skill>/scripts/inspect-project.mjs <project-root>
```

发现规则冲突、入口文件语义冲突或目录用途不一致时，停止写冲突文件并列出待确认项。没有冲突的 allowlist 文件仍可创建。

成熟项目中，`AGENTS.md` / `CLAUDE.md` 是项目和工具指南事实源；`.agents/instructions.md` 只记录 memory 协议、Obsidian 项目笔记路径、源文件索引和写入边界。

不要递归读取 `docs/` 来理解项目。只列出 docs 顶层目录，读取已存在的索引文件（如 `docs/README.md`、`docs/index.md`、`docs/adr/README.md`）；设计/计划文档只有在 `.agents/active.md` 指向具体文件或用户指定时才读取，不按工具路径批量读取。

重复运行时必须检查 Obsidian 项目笔记是否过期；过期则按当前模式幂等更新。

项目相关知识在重复运行时逐步收敛：第一次初始化不强行判断项目类型；项目类型为 `unknown` 时只保留查询协议，`candidate` 时只列建议，`confirmed` 时才根据 `Agent/Knowledge/_catalog.md` 回写高置信相关知识链接。只回写链接和 `kind` / `use_as`，不复制公共知识正文。

验证分层落地节（新项目模板）按项目实际填值。主判定信号是存在测试文件（`*.test.*` / `*_test.go` / `tests/` / `spec/` 之一）；辅信号是 `package.json` 的 test script 与 CI 配置（`.github/workflows/`、`.gitlab-ci.yml` 等托管形态），主信号不依赖 CI。有任一信号的项目六行全填，无对应机制的行写「无」，不留空行；两项信号都没有的项目把节体替换为一行「本项目无测试与 CI，本节有意留空（判定于 <日期>）；引入测试时按模板填值」，不整节删除。测试架构、门禁命令或 CI 配置变更的同一任务内同步更新该节，与文档地图同款机制，不挂 `$obclose` 收尾。重复运行逐节对比时，六行全填、一行有意留空与索引型整节不加均为有意形态，不报差异。
