import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const skillsDir = join(root, "skills");
const commandsDir = join(root, "commands");
const packageJsonPath = join(root, "package.json");
const skillsJsonPath = join(root, "skills.json");
const gitignorePath = join(root, ".gitignore");
const bumpVersionScriptPath = join(root, "scripts", "bump-version.mjs");
const inspectProjectScriptPath = join(skillsDir, "obinit", "scripts", "inspect-project.mjs");
let skillNames = [];

const forbiddenGeneratedEnglish = [
  "Read `.agents/instructions.md` first",
  "# Agent Instructions",
  "## Project Protocol",
  "## Bootstrap Scope",
  "## Normal Work",
  "## Memory",
  "# Agent Memory",
  "# Active",
  "## Current Task",
  "## Current State",
  "## Verification",
  "## Important Files",
  "## Next Steps",
  "## Knowledge Used",
  "## Knowledge Extracted",
  "Knowledge Note",
  "# Progress",
  "# Lessons",
  "# Architecture Decisions",
  "# Specs",
  "# Plans",
  "## Links",
  "Use this directory",
  "Use this file",
  "User arguments:",
  "Use the `ob",
];

const forbiddenProjectPositioning = [
  "面向中文 agent 工作流",
  "面向中文 coding agent 工作流",
];

const forbiddenDefaultKnowledgeLinks = [
  "Frontend Design Pitfalls",
  "React Project Conventions",
];

const forbiddenDefaultKnowledgeNoteExamples = [
  "前端设计避坑",
  "React 项目约定",
  "Tailwind UI 避坑",
  "Shadcn 使用经验",
  "部署经验",
  "测试经验",
  "Windows 开发经验",
  "Agent 工作流经验",
];

const forbiddenTemplatePlaceholders = [
  "path/to/file",
  "0001-title.md",
];

const forbiddenObsidianProjectNoteTemplatePhrases = [
  "暂无",
  "## 目标",
  "## 常用命令",
  "## 相关知识",
  "## 决策",
  "## 开放问题",
  "Specs：",
  "Plans：",
];

const unsupportedEntryFiles = [
  "GEMINI.md",
];

const requiredGitignoreEntries = [
  ".agents/scratch/",
];

const forbiddenNonstandardAgentTempPaths = [
  ".agents/tmp",
  ".agent/tmp",
];

const requiredObinitReferences = [
  "references/init-modes.md",
  "references/entry-file-policy.md",
  "references/obsidian-sync.md",
  "references/memory-bank.md",
];

const requiredObinitScripts = [
  "scripts/inspect-project.mjs",
];

const requiredSkillNames = ["obinit", "obadr", "obclose", "oblearn", "obcurate", "obdoc"];

const requiredProjectDescriptionTerms = ["文档整理"];

const requiredKnowledgeLookupTerms = ["Agent/Knowledge/", "Agent/Knowledge/_catalog.md", "关键词定向搜索", "明确读取"];

const requiredKnowledgeUseSemanticsTerms = [
  "kind",
  "use_as",
  "knowledge",
  "document",
  "rule",
  "reference",
];

const requiredProjectKnowledgeBindingTerms = [
  "项目相关知识",
  "项目类型",
  "unknown",
  "candidate",
  "confirmed",
  "高置信",
  "只回写链接",
  "只列建议",
];

const requiredAuthoritativeStateCarrierTerms = [
  "权威状态载体",
  "git commit",
  "tag",
  "PR",
  "CI/CD",
  "release",
  "artifact",
  "ADR",
  "migration",
  "issue/ticket",
  "runbook",
  "短暂中间态",
  "最终回复说明",
];

const forbiddenObdocWritePolicyPhrases = [
  "长文写入",
  "不把整篇 Markdown",
  "分段 append",
];

const forbiddenObdocBehaviorShapingPhrases = [
  "不要为了匹配模板",
  "不要为了找灵感",
  "不要为了填模板",
  "不要在 `obdoc` 中替代",
];

const sharedObsidianMarkdownWritePolicy = {
  name: "shared Obsidian Markdown file write policy",
  terms: ["Obsidian Markdown 写入", "统一使用 vault 文件", "文件写入", "本地文件系统路径", "写入后读回"],
};

const requiredObinitConcepts = [
  {
    name: "init mode selection",
    terms: ["## 初始化模式选择", "新项目模式", "成熟项目接入模式", "重复运行模式", "references/init-modes.md"],
  },
  {
    name: "mature project index instructions",
    terms: ["索引型 `.agents/instructions.md`", "AGENTS.md", "CLAUDE.md", "长内容完整复制"],
  },
  {
    name: "entry file protection",
    terms: ["## 入口文件保护", "templates/agent-entry.md", "整体替换", "已有非空入口文件"],
  },
  {
    name: "language preference",
    terms: ["默认遵循用户或项目既有语言偏好"],
  },
  {
    name: "obsidian idempotent sync",
    terms: ["重复运行", "Obsidian 项目笔记", "内容过期", "幂等更新", "读回"],
  },
  {
    name: "obsidian related knowledge",
    terms: ["相关知识", "真实查阅", "明确相关", "公共知识笔记"],
  },
  {
    name: "on-demand public knowledge lookup",
    terms: ["任务开始", "遇到相关问题", "Agent/Knowledge/", "Agent/Knowledge/_catalog.md", "关键词定向搜索", "明确读取", "不凭空假设"],
  },
  {
    name: "catalog hit use semantics",
    terms: ["kind", "use_as", "knowledge", "document", "rule", "reference", "公共经验", "参考材料"],
  },
  {
    name: "progressive project knowledge binding",
    terms: ["项目相关知识回写", "第一次初始化", "重复初始化", "项目类型", "unknown", "candidate", "confirmed", "高置信", "只回写链接", "只列建议"],
  },
  {
    name: "authoritative state carrier memory boundary",
    terms: requiredAuthoritativeStateCarrierTerms,
  },
  {
    name: "bounded docs discovery",
    terms: ["docs 顶层", "不递归读取", "docs/superpowers/specs/", "docs/superpowers/plans/", "用户指定"],
  },
  {
    name: "scratch-only temporary workspace",
    terms: [".agents/scratch/", "临时调查草稿", "运行日志", "缓存", "生成物", "不要放进 agent memory"],
  },
  {
    name: "clean Obsidian project note",
    terms: ["干净索引", "只写真实链接", "省略空章节", "初始化模式", "Agent 记录", "不写入决策"],
  },
];

const requiredSkillConcepts = {
  obadr: [
    {
      name: "ADR scope and deduplication",
      terms: ["docs/adr/", "避免重复记录", "不创建重复 ADR"],
    },
    {
      name: "ADR safety boundaries",
      terms: ["如果决策内容不明确", "先问用户", "不修改源码、依赖、构建配置或 git 配置", "$oblearn"],
    },
    {
      name: "ADR boundary and relationship fields",
      terms: ["适用范围", "非目标", "有助于下一次 agent 恢复上下文", "替代 ADR", "废弃原因"],
    },
    {
      name: "ADR template migration compatibility",
      terms: ["模板升级", "历史 ADR", "默认保持原样", "最小回填", "不要批量迁移"],
    },
    {
      name: "existing ADR maintenance",
      terms: ["已有 ADR 维护", "更新状态", "追加后续说明", "修正会导致误读的标题或链接", "保持历史决策原意"],
    },
  ],
  oblearn: [
    {
      name: "shared document and knowledge target policy",
      terms: ["用户指定路径优先", "已有明确命中", "不稳定时", "Agent/Knowledge/Inbox/", "$obcurate"],
    },
    {
      name: "bounded knowledge extraction",
      terms: ["不扫描整个 vault", "关键词定向搜索", "等待用户确认", "Agent/Knowledge/Inbox/"],
    },
    {
      name: "privacy and source boundaries",
      terms: ["不写 secret", "不把 Superpowers spec/plan 原文复制", "用户指定范围"],
    },
    {
      name: "knowledge catalog source",
      terms: ["Agent/Knowledge/_catalog.md", "事实来源", "terms", "aliases", "kind", "use_as", "不凭空假设"],
    },
    {
      name: "tags auxiliary metadata",
      terms: ["tags", "辅助 metadata", "Obsidian UI", "人工筛选", "不作为 agent 发现入口"],
    },
    {
      name: "catalog maintenance boundary",
      terms: ["最小明确更新", "结构性 catalog 维护", "$obcurate", "catalog"],
    },
    {
      name: "oblearn curation boundary",
      terms: ["只做最小维护", "结构性整理", "$obcurate", "不负责全库重分类"],
    },
    {
      name: "knowledge template migration compatibility",
      terms: ["模板升级", "历史公共知识", "默认保持原样", "最小回填", "不要批量迁移"],
    },
    {
      name: "existing public knowledge maintenance",
      terms: ["已有公共知识维护", "最小修改", "aliases", "修正 wikilink", "可发现性"],
    },
    sharedObsidianMarkdownWritePolicy,
  ],
  obdoc: [
    {
      name: "shared document and knowledge target policy",
      terms: ["用户指定路径优先", "已有明确命中", "不稳定时", "Agent/Knowledge/Inbox/", "$obcurate"],
    },
    {
      name: "document extraction boundary",
      terms: ["文档型输出", "不是短知识条目", "$oblearn", "可提取知识候选"],
    },
    {
      name: "free-form document metadata",
      terms: ["doc_type", "source", "自由描述字段", "不是固定枚举"],
    },
    {
      name: "document source safety",
      terms: ["Codex session id", "精确定位", "脱敏", "不写 secret"],
    },
    {
      name: "flexible Obsidian document targets",
      terms: ["候选路径", "不要固定目录", "用户指定路径", "Agent/Knowledge/Inbox/"],
    },
    {
      name: "document catalog boundary",
      terms: ["最小明确 catalog 更新", "Agent/Knowledge/_catalog.md", "$obcurate"],
    },
    sharedObsidianMarkdownWritePolicy,
    {
      name: "related links quality boundary",
      terms: ["相关链接", "真实主题关联", "空小节或省略内容"],
    },
    {
      name: "tags auxiliary metadata",
      terms: ["tags", "辅助 metadata", "Obsidian UI", "人工筛选", "不作为 agent 发现入口"],
    },
  ],
  obcurate: [
    {
      name: "bounded knowledge curation",
      terms: ["Agent/Knowledge/_catalog.md", "Agent/Knowledge/Inbox/", "有限范围", "整理输入"],
    },
    {
      name: "curation confirmation boundary",
      terms: ["先列出整理计划", "等待用户确认", "移动", "合并", "拆分", "重命名"],
    },
    {
      name: "catalog maintenance",
      terms: ["事实来源", "terms", "aliases", "kind", "use_as", "notes", "不凭空假设"],
    },
    {
      name: "catalog use semantics",
      terms: ["查到后怎么用", "公共经验", "参考材料", "rule", "reference"],
    },
    {
      name: "knowledge and document metadata",
      terms: ["kind", "source_skill", "doc_type", "knowledge", "document"],
    },
    {
      name: "document curation boundary",
      terms: ["kind: document", "source_skill: obdoc", "doc_type", "sensitivity", "catalog 是否保留", "$oblearn"],
    },
    {
      name: "curation output contract",
      terms: ["产物是整理计划", "metadata/catalog/wikilink/path 调整", "必要的私有化建议"],
    },
    {
      name: "document experience handoff",
      terms: ["文档正文里的可复用经验候选", "用户明确要求从文档提炼", "单独 `$oblearn` 任务", "后续 `$oblearn` 任务"],
    },
    {
      name: "knowledge/document responsibility matrix",
      terms: ["输入对象", "`$obcurate` 处理", "转交条件"],
    },
    {
      name: "no direct document promotion",
      terms: ["`## 可提取知识候选`", "不在 `$obcurate` 中直接晋升为公共知识"],
    },
    {
      name: "internal document metadata handling",
      terms: ["含内网拓扑", "仍可整理 metadata/catalog", "经验提取和脱敏公共化属于 `$oblearn`"],
    },
    {
      name: "scope-specific skip reasons",
      terms: ["用户点名范围", "本轮范围", "暂不处理", "整理 metadata/catalog"],
    },
    {
      name: "privacy-preserving curation",
      terms: ["不写 secret", "本地事实", "脱敏"],
    },
  ],
  obclose: [
    {
      name: "close-only safety boundary",
      terms: ["不修改源码、依赖、构建配置或 git 配置", "不自动提交、不自动推送、不自动创建 release", "git status --short"],
    },
    {
      name: "authoritative state carrier memory boundary",
      terms: [...requiredAuthoritativeStateCarrierTerms, "单独追加"],
    },
    {
      name: "memory preservation",
      terms: ["保留原结构", "不要整体重写", "只有发现可复用经验时才更新 `.agents/lessons.md`"],
    },
  ],
};

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function parseFrontmatter(markdown) {
  if (!markdown.startsWith("---")) return null;

  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const frontmatter = match[1].trim();
  const result = {};

  for (const line of frontmatter.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (match) result[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }

  return result;
}

function parseOpenAiInterface(yaml) {
  if (!/^interface:\s*$/m.test(yaml)) return null;

  const fields = {};
  for (const key of ["display_name", "short_description", "default_prompt"]) {
    const match = yaml.match(new RegExp(`^\\s+${key}:\\s*(.*)$`, "m"));
    if (match) fields[key] = match[1].trim().replace(/^["']|["']$/g, "");
  }

  return fields;
}

function countWordsish(markdown) {
  return markdown.match(/[A-Za-z0-9_`$./-]+|[\u4e00-\u9fff]/g)?.length ?? 0;
}

function assertNoPhrases(label, content, phrases, describe) {
  for (const phrase of phrases) {
    if (content.includes(phrase)) {
      fail(`${label}: ${describe(phrase)}`);
    }
  }
}

function assertNoDefaultKnowledgeNoteExamples(label, content) {
  assertNoPhrases(label, content, forbiddenDefaultKnowledgeNoteExamples, (phrase) => {
    return `must not suggest default public knowledge note examples: ${phrase}`;
  });
}

function assertRequiredConcepts(label, content, concepts) {
  for (const concept of concepts) {
    const missing = concept.terms.filter((term) => !content.includes(term));
    if (missing.length > 0) {
      fail(`${label}: missing required ${concept.name} concept terms: ${missing.join(", ")}`);
    }
  }
}

function toPosix(path) {
  return path.replace(/\\/g, "/");
}

function expectEqual(context, actual, expected) {
  if (actual !== expected) {
    fail(`${context}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function runInspectProjectFixture(name, setup, assertResult) {
  const tempRoot = mkdtempSync(join(tmpdir(), "obsidian-agent-skills-"));
  const projectRoot = join(tempRoot, "project");

  try {
    mkdirSync(projectRoot);
    const cwd = setup(projectRoot) ?? projectRoot;
    const output = execFileSync(process.execPath, [inspectProjectScriptPath, cwd], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    const result = JSON.parse(output);
    assertResult(result, projectRoot);
  } catch (error) {
    fail(`inspect-project fixture ${name}: ${error.message}`);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

function modeFixture(name, expectedMode, setup = () => undefined) {
  return {
    name,
    setup,
    assert: (result) => expectEqual(`inspect-project fixture ${name} mode`, result.mode, expectedMode),
  };
}

function runInspectProjectFixtures() {
  if (!existsSync(inspectProjectScriptPath)) {
    fail("obinit: missing scripts/inspect-project.mjs");
    return;
  }

  const fixtures = [
    modeFixture("empty project is new", "new"),
    modeFixture("AGENTS.md marks mature", "mature", (projectRoot) => {
      writeFileSync(join(projectRoot, "AGENTS.md"), "# Project Rules\n", "utf8");
    }),
    modeFixture("README.md marks mature", "mature", (projectRoot) => {
      writeFileSync(join(projectRoot, "README.md"), "# Project\n", "utf8");
    }),
    modeFixture("docs directory marks mature", "mature", (projectRoot) => {
      mkdirSync(join(projectRoot, "docs"));
    }),
    modeFixture(".agents memory marks repeat", "repeat", (projectRoot) => {
      mkdirSync(join(projectRoot, ".agents"));
      writeFileSync(join(projectRoot, ".agents", "instructions.md"), "# Instructions\n", "utf8");
    }),
    modeFixture("GEMINI.md is unsupported", "new", (projectRoot) => {
      writeFileSync(join(projectRoot, "GEMINI.md"), "# Gemini\n", "utf8");
    }),
    {
      name: "git subdirectory resolves repository root",
      setup: (projectRoot) => {
        execFileSync("git", ["init"], { cwd: projectRoot, stdio: "ignore" });
        const subdir = join(projectRoot, "packages", "app");
        mkdirSync(subdir, { recursive: true });
        return subdir;
      },
      assert: (result, projectRoot) => expectEqual(
        "inspect-project fixture git subdirectory resolves repository root",
        result.root,
        toPosix(projectRoot),
      ),
    },
  ];

  for (const fixture of fixtures) {
    runInspectProjectFixture(fixture.name, fixture.setup, fixture.assert);
  }
}

if (!existsSync(skillsDir)) {
  fail("Missing skills directory.");
} else {
  skillNames = readdirSync(skillsDir).filter((name) => {
    const path = join(skillsDir, name);
    return statSync(path).isDirectory();
  });

  if (skillNames.length === 0) fail("No skills found.");

  const missingRequiredSkillNames = requiredSkillNames.filter((skillName) => !skillNames.includes(skillName));
  if (missingRequiredSkillNames.length > 0) {
    fail(`skills directory: missing required skills: ${missingRequiredSkillNames.join(", ")}`);
  }

  for (const skillName of skillNames) {
    const skillPath = join(skillsDir, skillName, "SKILL.md");

    if (!existsSync(skillPath)) {
      fail(`${skillName}: missing SKILL.md`);
      continue;
    }

    const markdown = readFileSync(skillPath, "utf8");
    const frontmatter = parseFrontmatter(markdown);

    if (!frontmatter) {
      fail(`${skillName}: missing YAML frontmatter`);
      continue;
    }

    if (frontmatter.name !== skillName) {
      fail(`${skillName}: frontmatter name must match directory name`);
    }

    if (!frontmatter.description) {
      fail(`${skillName}: missing description`);
    }

    assertNoDefaultKnowledgeNoteExamples(`${skillName}: SKILL.md`, markdown);
    assertNoPhrases(`${skillName}: SKILL.md`, markdown, forbiddenNonstandardAgentTempPaths, (phrase) => {
      return `must not use nonstandard agent temp path: ${phrase}`;
    });

    if (skillName === "obinit") {
      const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\s*/, "");
      const bodyWordsish = countWordsish(body);
      if (bodyWordsish > 2000) {
        fail(`${skillName}: SKILL.md body is too long (${bodyWordsish} > 2000); move details to references or scripts`);
      }

      for (const relativePath of requiredObinitReferences) {
        const referencePath = join(skillsDir, skillName, relativePath);

        if (!markdown.includes(relativePath)) {
          fail(`${skillName}: SKILL.md must link ${relativePath}`);
        }

        if (!existsSync(referencePath)) {
          fail(`${skillName}: missing ${relativePath}`);
        } else {
          const referenceContent = readFileSync(referencePath, "utf8");
          assertNoDefaultKnowledgeNoteExamples(`${skillName}: ${relativePath}`, referenceContent);
          assertNoPhrases(`${skillName}: ${relativePath}`, referenceContent, forbiddenNonstandardAgentTempPaths, (phrase) => {
            return `must not use nonstandard agent temp path: ${phrase}`;
          });
        }
      }

      for (const relativePath of requiredObinitScripts) {
        if (!markdown.includes(relativePath)) {
          fail(`${skillName}: SKILL.md must mention ${relativePath}`);
        }

        if (!existsSync(join(skillsDir, skillName, relativePath))) {
          fail(`${skillName}: missing ${relativePath}`);
        }
      }

      assertRequiredConcepts(skillName, markdown, requiredObinitConcepts);

      assertNoPhrases(`${skillName}: SKILL.md`, markdown, unsupportedEntryFiles, (phrase) => {
        return `must not advertise unsupported entry file: ${phrase}`;
      });

      const inspectScript = readFileSync(join(skillsDir, skillName, "scripts", "inspect-project.mjs"), "utf8");
      assertNoPhrases(`${skillName}: inspect-project.mjs`, inspectScript, unsupportedEntryFiles, (phrase) => {
        return `must not report unsupported entry file: ${phrase}`;
      });
    }

    assertRequiredConcepts(skillName, markdown, requiredSkillConcepts[skillName] ?? []);

    if (skillName === "obdoc") {
      assertNoPhrases(`${skillName}: SKILL.md`, markdown, forbiddenObdocWritePolicyPhrases, (phrase) => {
        return `must describe Obsidian writes with the positive file-write policy, not old phrasing: ${phrase}`;
      });
      assertNoPhrases(`${skillName}: SKILL.md`, markdown, forbiddenObdocBehaviorShapingPhrases, (phrase) => {
        return `must use positive behavior contracts instead of negative template/search phrasing: ${phrase}`;
      });
    }

    const openAiAgentPath = join(skillsDir, skillName, "agents", "openai.yaml");
    if (!existsSync(openAiAgentPath)) {
      fail(`${skillName}: missing agents/openai.yaml`);
    } else {
      const openAiInterface = parseOpenAiInterface(readFileSync(openAiAgentPath, "utf8"));
      if (!openAiInterface) {
        fail(`${skillName}: openai.yaml must define a top-level interface block`);
      } else {
        for (const key of ["display_name", "short_description", "default_prompt"]) {
          if (!openAiInterface[key]) {
            fail(`${skillName}: openai.yaml interface.${key} must be a non-empty string`);
          }
        }
      }
    }

    const templatesDir = join(skillsDir, skillName, "templates");
    if (!existsSync(templatesDir)) {
      fail(`${skillName}: missing templates directory`);
    } else {
      const templates = readdirSync(templatesDir).filter((name) => {
        const path = join(templatesDir, name);
        return statSync(path).isFile();
      });

      if (templates.length === 0) {
        fail(`${skillName}: templates directory is empty`);
      }

      if (skillName === "obinit" && !templates.includes("instructions-index.md")) {
        fail(`${skillName}: missing templates/instructions-index.md for mature project onboarding`);
      }

      for (const template of templates) {
        const templatePath = join(templatesDir, template);
        const content = readFileSync(templatePath, "utf8");
        assertNoDefaultKnowledgeNoteExamples(`${skillName}: template ${template}`, content);
        assertNoPhrases(`${skillName}: template ${template}`, content, forbiddenNonstandardAgentTempPaths, (phrase) => {
          return `must not use nonstandard agent temp path: ${phrase}`;
        });
        assertNoPhrases(`${skillName}: template ${template}`, content, forbiddenGeneratedEnglish, (phrase) => {
          return `contains English generated-doc phrase: ${phrase}`;
        });
        assertNoPhrases(`${skillName}: template ${template}`, content, forbiddenDefaultKnowledgeLinks, (phrase) => {
          return `contains hardcoded default knowledge link: ${phrase}`;
        });
        assertNoPhrases(`${skillName}: template ${template}`, content, forbiddenTemplatePlaceholders, (phrase) => {
          return `contains fake placeholder content: ${phrase}`;
        });

        if (skillName === "obinit") {
          assertNoPhrases(`${skillName}: template ${template}`, content, unsupportedEntryFiles, (phrase) => {
            return `must not advertise unsupported entry file: ${phrase}`;
          });

          if (content.includes("- `docs/`")) {
            fail(`${skillName}: template ${template} must use the narrower docs/adr/ initialization scope`);
          }
        }

        if (skillName === "obinit" && template === "obsidian-project-note.md") {
          assertNoPhrases(`${skillName}: template ${template}`, content, forbiddenObsidianProjectNoteTemplatePhrases, (phrase) => {
            return `must not include empty Obsidian project note scaffold: ${phrase}`;
          });

          const concreteKnowledgeLinks = content.match(/\[\[(?!<)[^\]]+\]\]/g) ?? [];
          if (concreteKnowledgeLinks.length > 0) {
            fail(`${skillName}: template ${template} must not prefill concrete knowledge wikilinks: ${concreteKnowledgeLinks.join(", ")}`);
          }
        }

        const placeholderKnowledgeLinks = content.match(/\[\[<[^>\]]+>\]\]/g) ?? [];
        if (placeholderKnowledgeLinks.length > 0) {
          fail(`${skillName}: template ${template} must not contain placeholder wikilinks: ${placeholderKnowledgeLinks.join(", ")}`);
        }

        const angleBracketEnums = content.match(/<[^>\r\n]*\|[^>\r\n]*>/g) ?? [];
        if (angleBracketEnums.length > 0) {
          fail(`${skillName}: template ${template} must not constrain placeholders to fixed enum choices: ${angleBracketEnums.join(", ")}`);
        }

        if (skillName === "obinit" && ["instructions.md", "instructions-index.md"].includes(template)) {
          const missing = requiredKnowledgeLookupTerms.filter((term) => !content.includes(term));
          if (missing.length > 0) {
            fail(`${skillName}: template ${template} must include on-demand public knowledge lookup terms: ${missing.join(", ")}`);
          }

          const missingUseSemantics = requiredKnowledgeUseSemanticsTerms.filter((term) => !content.includes(term));
          if (missingUseSemantics.length > 0) {
            fail(`${skillName}: template ${template} must include public knowledge use semantics terms: ${missingUseSemantics.join(", ")}`);
          }

          const missingProjectKnowledgeBinding = requiredProjectKnowledgeBindingTerms.filter((term) => !content.includes(term));
          if (missingProjectKnowledgeBinding.length > 0) {
            fail(`${skillName}: template ${template} must include progressive project knowledge binding terms: ${missingProjectKnowledgeBinding.join(", ")}`);
          }

          const missingAuthoritativeStateCarrier = requiredAuthoritativeStateCarrierTerms.filter((term) => !content.includes(term));
          if (missingAuthoritativeStateCarrier.length > 0) {
            fail(`${skillName}: template ${template} must include authoritative state carrier memory boundary terms: ${missingAuthoritativeStateCarrier.join(", ")}`);
          }
        }

        if (skillName === "oblearn" && template === "public-knowledge-note.md") {
          for (const term of ["kind: knowledge", "source_skill: oblearn"]) {
            if (!content.includes(term)) {
              fail(`${skillName}: template ${template} must include ${term}`);
            }
          }
        }

        if (skillName === "oblearn" && template === "public-knowledge-entry.md") {
          for (const term of ["最小更新", "Agent/Knowledge/_catalog.md", "$obcurate"]) {
            if (!content.includes(term)) {
              fail(`${skillName}: template ${template} must include ${term}`);
            }
          }
        }

        if (skillName === "obdoc" && template === "document-note.md") {
          for (const term of ["kind: document", "source_skill: obdoc", "doc_type:", "source:", "tags:"]) {
            if (!content.includes(term)) {
              fail(`${skillName}: template ${template} must include ${term}`);
            }
          }
        }

        if (skillName === "obcurate" && template === "catalog-entry.md") {
          if (!content.includes("aliases: []")) {
            fail(`${skillName}: template ${template} must default catalog aliases to an empty list`);
          }

          for (const term of ["kind:", "use_as:"]) {
            if (!content.includes(term)) {
              fail(`${skillName}: template ${template} must include ${term}`);
            }
          }

          if (content.includes("aliases: [<别名>]")) {
            fail(`${skillName}: template ${template} must not imply aliases are required`);
          }
        }
      }
    }
  }
}

if (!existsSync(commandsDir)) {
  fail("Missing commands directory.");
} else {
  for (const skillName of skillNames) {
    const commandPath = join(commandsDir, `${skillName}.md`);

    if (!existsSync(commandPath)) {
      fail(`${skillName}: missing Claude slash command`);
      continue;
    }

    const command = readFileSync(commandPath, "utf8");
    const frontmatter = parseFrontmatter(command);

    if (!frontmatter?.description) {
      fail(`${skillName}: command missing description`);
    }

    assertNoPhrases(`${skillName}: command`, command, forbiddenGeneratedEnglish, (phrase) => {
      return `contains English generated-doc phrase: ${phrase}`;
    });
  }
}

if (existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

  if (packageJson.scripts?.["version:set"] !== "node scripts/bump-version.mjs") {
    fail("package.json: scripts.version:set must be node scripts/bump-version.mjs");
  }

  if (!existsSync(bumpVersionScriptPath)) {
    fail("Missing scripts/bump-version.mjs.");
  }

  if (!existsSync(gitignorePath)) {
    fail("Missing .gitignore.");
  } else {
    const gitignore = readFileSync(gitignorePath, "utf8");
    const missing = requiredGitignoreEntries.filter((entry) => !gitignore.includes(entry));
    if (missing.length > 0) {
      fail(`.gitignore: missing required entries: ${missing.join(", ")}`);
    }
    assertNoPhrases(".gitignore", gitignore, forbiddenNonstandardAgentTempPaths, (phrase) => {
      return `must not keep compatibility ignore for nonstandard agent temp path: ${phrase}`;
    });
  }

  if (!existsSync(skillsJsonPath)) {
    fail("Missing skills.json.");
  } else {
    const skillsJson = JSON.parse(readFileSync(skillsJsonPath, "utf8"));

    if (skillsJson.name !== packageJson.name) {
      fail("skills.json: name must match package name");
    }

    if (skillsJson.version !== packageJson.version) {
      fail("skills.json: version must match package version");
    }

    if (!Array.isArray(skillsJson.skills)) {
      fail("skills.json: skills must be an array");
    } else {
      const declaredSkillNames = skillsJson.skills.map((skill) => skill.name).sort();
      const actualSkillNames = [...skillNames].sort();

      if (JSON.stringify(declaredSkillNames) !== JSON.stringify(actualSkillNames)) {
        fail(`skills.json: skill names must match skills directory names (${actualSkillNames.join(", ")})`);
      }

      for (const skill of skillsJson.skills) {
        const expectedPath = `skills/${skill.name}`;
        if (skill.path !== expectedPath) {
          fail(`${skill.name}: skills.json path must be ${expectedPath}`);
        }

        const skillPath = join(root, skill.path);
        if (!existsSync(skillPath) || !statSync(skillPath).isDirectory()) {
          fail(`${skill.name}: skills.json path does not exist or is not a directory`);
        }
      }
    }
  }

  for (const relativePath of [
    "package.json",
    "skills.json",
    "README.md",
    join(".claude-plugin", "marketplace.json"),
    join(".claude-plugin", "plugin.json"),
    join(".codex-plugin", "plugin.json"),
  ]) {
    const filePath = join(root, relativePath);
    if (!existsSync(filePath)) continue;

    const content = readFileSync(filePath, "utf8");
    assertNoPhrases(relativePath, content, forbiddenProjectPositioning, (phrase) => {
      return `avoid positioning the project as Chinese-only: ${phrase}`;
    });

    for (const term of requiredProjectDescriptionTerms) {
      if (!content.includes(term)) {
        fail(`${relativePath}: project description must mention ${term}`);
      }
    }

    if (relativePath === "README.md") {
      const prerequisiteLine = content.split(/\r?\n/).find((line) => line.includes("需要上述前提")) ?? "";
      for (const skillName of ["$obinit", "$oblearn", "$obdoc", "$obcurate"]) {
        if (!prerequisiteLine.includes(skillName)) {
          fail(`README.md: Obsidian prerequisites line must mention ${skillName}`);
        }
      }

      if (!content.includes("npm run version:set --")) {
        fail("README.md: must document npm run version:set -- for synchronized release version bumps");
      }
    }
  }

  for (const pluginDir of [".claude-plugin", ".codex-plugin"]) {
    const manifestPath = join(root, pluginDir, "plugin.json");

    if (!existsSync(manifestPath)) {
      fail(`${pluginDir}: missing plugin.json`);
      continue;
    }

    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

    if (manifest.name !== packageJson.name) {
      fail(`${pluginDir}: manifest name must match package name`);
    }

    if (manifest.version !== packageJson.version) {
      fail(`${pluginDir}: manifest version must match package version`);
    }

    if (!manifest.description) {
      fail(`${pluginDir}: missing description`);
    }

    if (pluginDir === ".codex-plugin") {
      const longDescription = manifest.interface?.longDescription ?? "";
      const defaultPrompt = Array.isArray(manifest.interface?.defaultPrompt)
        ? manifest.interface.defaultPrompt.join("\n")
        : "";

      if (longDescription.includes("五个")) {
        fail(`${pluginDir}: longDescription must not say five workflows after adding obdoc`);
      }

      for (const skillName of skillNames) {
        if (!longDescription.includes(skillName)) {
          fail(`${pluginDir}: longDescription must mention ${skillName}`);
        }

        if (!defaultPrompt.includes(`$${skillName}`)) {
          fail(`${pluginDir}: defaultPrompt must include $${skillName}`);
        }
      }
    }
  }

  const marketplacePath = join(root, ".claude-plugin", "marketplace.json");
  if (!existsSync(marketplacePath)) {
    fail(".claude-plugin: missing marketplace.json");
  } else {
    const marketplace = JSON.parse(readFileSync(marketplacePath, "utf8"));
    const marketplacePlugin = marketplace.plugins?.find((plugin) => plugin.name === packageJson.name);

    if (marketplace.name !== packageJson.name) {
      fail(".claude-plugin/marketplace.json: marketplace name must match package name");
    }

    if (!marketplacePlugin) {
      fail(".claude-plugin/marketplace.json: missing plugin entry for package name");
    } else {
      if (marketplacePlugin.version !== packageJson.version) {
        fail(".claude-plugin/marketplace.json: plugin version must match package version");
      }

      if (marketplacePlugin.source?.source !== "url" || marketplacePlugin.source?.url !== "https://github.com/GeekXtop/obsidian-agent-skills.git") {
        fail(".claude-plugin/marketplace.json: plugin source must point at the GitHub repository URL");
      }
    }
  }
}

runInspectProjectFixtures();

if (process.exitCode) {
  process.exit();
}

console.log("All skills are valid.");
