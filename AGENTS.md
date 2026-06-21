# AGENTS.md

## 项目约定

- Skill 放在 `skills/<name>/SKILL.md`。
- 保留 Agent Skills frontmatter 字段 `name` 和 `description`。
- 每个 skill 内要明确运行时假设。
- 除非 skill 确实需要，不要添加 hook、生成文件或运行时依赖。
- 发布前运行 `npm test`。
- 生成的项目文档默认遵循用户或项目既有语言偏好；当前模板使用简体中文，路径、命令、包名和英文专有名词保持原样。
