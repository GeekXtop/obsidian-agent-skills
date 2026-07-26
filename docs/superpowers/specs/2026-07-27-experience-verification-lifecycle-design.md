# 经验验证与退役闭环设计

- 日期:2026-07-27
- 状态:待实施
- 范围:`$obclose`、`$oblearn`、`$obcurate`、`$obinit` 四个 skill 及其模板、`scripts/validate-skills.mjs`

## 问题

当前记忆体系有准入控制(lessons 四条准入、Knowledge Inbox 人工晋升),但没有证伪与退役:

- `下次检查` 只是 lessons 条目和公共知识笔记里的一个静态字段,没有任何流程保证它被执行;触发完全依赖人想起来。
- 一条经验被证伪或过时后,没有标准处理方式;坏经验会被继续召回,甚至被 `$oblearn` 重新提取到公共知识层,错误自我强化。
- 自我进化闭环只有"往库里加对的东西",缺"把变错的东西移出去"。

## 设计决策(已确认)

1. **触发架构:分布式触发。** 不新增 skill。三个既有触点各担一段:召回时证伪(使用中发现矛盾即标记)、`$obclose` 收尾时增量验证(只验本次任务相关条目)、`$obcurate` 批量复查长期未验证条目并执行退役 GC。
2. **退役语义:标注状态 + 延迟删除。** 证伪先标注(状态 + 一行原因 + 日期),召回时跳过已标注条目;真正删除由 `$obcurate` 批量执行且需用户确认。证伪记录本身是知识,防止同一错误经验被重新提取。
3. **覆盖范围:两层都覆盖。** 项目内 `.agents/lessons.md` 由 `$obclose` 收尾时验证;Obsidian 公共知识采用使用驱动验证——只在本次会话真实召回并使用过某条知识时才回写验证结果(依托 `active.md` 已有的"已使用知识"节);长尾由 `$obcurate` 收。
4. **标注权限:按证据强度分级。** 有直接证伪证据(检查命令实际跑过且失败、引用的文件/术语已不存在)时 AI 可直接标 `deprecated` 并附证据;仅怀疑过时(无直接证据)时只能标 `needs-review` 等人裁决。标注可逆故 AI 可自主,删除不可逆故留给人。

## 状态模型

经验条目的生命周期状态:

```text
active(默认,无标注;验证通过只更新"最后验证"日期,仍是 active)
  → needs-review(AI 怀疑过时但无直接证据;等人裁决,可恢复 active)
  → deprecated(有直接证伪证据,或人工裁决;召回时跳过)
  → 删除(Obsidian 公共知识删除归 $obcurate 批量执行,需用户确认;lessons 条目删除遵循 $obclose 确认后维护)
```

规则:

- `active` 是默认态,不需要显式标注;既有条目不迁移、不批量回填。
- `verified` 通过在条目上更新"最后验证"日期表达,不引入独立状态词。
- `needs-review` → `deprecated` 或回到 `active`,由人裁决(通常在 `$obcurate` 批次中)。
- `deprecated` 条目保留原文,追加一行退役原因、证据和日期;召回时跳过,不作为经验使用,但可作为"此路不通"的反例被读到。
- 删除是结构性操作,需用户确认:Obsidian 公共知识删除归 `$obcurate`,`.agents/lessons.md` 条目删除遵循 `$obclose` 确认后维护——与既有"默认不删除内容"规则一致。

## 载体格式

### 项目内 lessons(`.agents/lessons.md`)

lesson-entry 模板从"下次检查"升级为可执行的验证契约:

```md
## YYYY-MM-DD - <简短经验标题>

- 背景:
- 经验:
- 适用场景:
- 验证方式:<可执行的检查:命令、文件存在性、术语搜索;写明预期结果>
- 最后验证:YYYY-MM-DD <本次验证的一行结论>
- 状态:<省略即 active;needs-review/deprecated 需附一行原因和日期>
```

- `验证方式` 替代 `下次检查`:要求写成可执行动作 + 预期结果,不是提醒短语。
- `最后验证` 每次验证后更新日期和一行结论;新条目创建时以创建日期为首次验证。
- `状态` 行仅在非 active 时出现,保持默认态零成本。
- 既有条目(`下次检查` 字段)保持原样读取兼容;只在该条目被验证或修改时顺手升级为新字段,不批量迁移——与"模板升级与历史公共知识"既有规则一致。

### Obsidian 公共知识(`Agent/Knowledge/`)

`public-knowledge-note.md` 模板 frontmatter 已有 `status`,扩展其取值语义:

- `status: draft | active | needs-review | deprecated`(既有 `draft` 语义不变)。
- 新增 frontmatter 字段 `last_verified: YYYY-MM-DD`(可选;缺失按 `created`/`updated` 推断新旧)。
- `deprecated` 笔记在正文顶部追加一个短节:退役原因、证据、日期、(如有)替代笔记的 wikilink。
- catalog(`_catalog.md`)条目对 `deprecated` 笔记的处理归 `$obcurate`:默认从 terms 移除入口或标注,防止被自动发现命中;是否物理删除笔记等人裁决。

`固定检查` 节(既有模板已有)承担与 lessons `验证方式` 同构的角色:写可执行检查项。

## 各触点行为

### 触点一:召回时证伪(所有 skill 通用,写入 obinit 生成的 instructions 协议)

任务中召回并使用某条经验/知识时,如果当前证据与其矛盾:

- 有直接证伪证据(检查实际执行且失败、引用对象已不存在)→ 就地标 `deprecated` 并附证据行。项目内 lessons 直接改文件;Obsidian 知识改 frontmatter `status` 并加退役节。
- 仅感觉可疑、无直接证据 → 标 `needs-review` 附一行怀疑理由,不改变条目正文。
- 与经验一致、正常使用 → 不强制回写(留给 `$obclose` 收尾统一处理,避免任务中频繁写 memory)。

### 触点二:`$obclose` 增量验证

收尾工作流新增一步(在现有"检查 memory 文件大小"附近):

- 只验证与本次任务相关的 lessons 条目:本次读过、用过、或其 `验证方式` 涉及本次改动文件的条目。
- 对每条相关条目执行其 `验证方式`,更新 `最后验证` 日期和结论;失败则按证据分级标 `deprecated` 或 `needs-review`。
- 本次会话若使用过 Obsidian 公共知识(`active.md` 的"已使用知识"节),对使用过且结果明确的知识回写 `last_verified` 或状态;使用中被证伪的按触点一规则处理。
- 明确不做:全量验证所有 lessons、扫描 Obsidian、验证与本次无关的条目。增量验证是安全默认值的一部分,不是可选装饰。

### 触点三:`$obcurate` 批量复查与退役 GC

批量整理策略新增一个分组维度(融入既有四分组,不推翻):

- 复查候选:`needs-review` 条目、`deprecated` 待删除条目、长期未验证条目(`last_verified`/`最后验证` 超过阈值,建议默认 180 天,作为建议值写入 skill 而非硬编码)。
- `needs-review` 逐项给人裁决:恢复 active、标 deprecated、或修正内容。
- `deprecated` 条目在复查时即可列入删除建议组(不设额外保留期,逐项确认后删除);确认删除后同时清理 catalog 入口。
- 长期未验证但无矛盾证据的条目:列为"待验证"建议,不自动降级——时间流逝本身不是证伪证据。

## 校验(validate-skills.mjs)

按项目既有模式,为新规则加防回归校验:

- `skills/obclose/SKILL.md` 及 lesson-entry 模板:要求出现 `验证方式`、`最后验证`、增量验证、按证据强度分级、`needs-review`、`deprecated` 等关键术语;禁止旧字段 `下次检查` 在模板中回归。
- `skills/oblearn/SKILL.md` 及 public-knowledge-note 模板:要求 `last_verified`、状态取值、退役节说明。
- `skills/obcurate/SKILL.md`:要求复查候选、长期未验证、`needs-review` 逐项裁决、deprecated 删除需确认等术语。
- `skills/obinit/SKILL.md` 及 instructions 模板:要求召回时证伪协议、证据分级术语,使新项目继承该规则;`skills/obinit/templates/lessons.md` 的格式说明同步 `验证方式` / `最后验证` / `状态` 字段。

## 不做的事(YAGNI)

- 不新增 skill、不新增 hook、不新增运行时依赖。
- 不做验证结果的量化统计(命中率、使用计数)——先跑通状态流转。
- 不批量迁移历史条目和历史公共知识。
- 不引入独立的 graveyard 文件或目录。
- 不让时间阈值自动降级条目;阈值只产生"待验证"建议。

## 成功标准

- 一条被证伪的 lesson 在下一次 `$obclose` 后带上 `deprecated` 标注和证据,后续会话不再作为经验使用。
- 一条被本次会话真实使用的公共知识,收尾后 `last_verified` 更新。
- `$obcurate` 能列出 needs-review/待删除/长期未验证三类复查候选并按既有批量确认流程处理。
- `npm test` 全绿,新校验项存在且能红灯(移除关键术语时失败)。
