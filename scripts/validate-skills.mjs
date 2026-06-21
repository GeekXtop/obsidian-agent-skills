import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const skillsDir = join(root, "skills");
const commandsDir = join(root, "commands");
const packageJsonPath = join(root, "package.json");
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

function countWordsish(markdown) {
  return markdown.match(/[A-Za-z0-9_`$./-]+|[\u4e00-\u9fff]/g)?.length ?? 0;
}

if (!existsSync(skillsDir)) {
  fail("Missing skills directory.");
} else {
  skillNames = readdirSync(skillsDir).filter((name) => {
    const path = join(skillsDir, name);
    return statSync(path).isDirectory();
  });

  if (skillNames.length === 0) fail("No skills found.");

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

    if (skillName === "obinit") {
      const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\s*/, "");
      const bodyWordsish = countWordsish(body);
      if (bodyWordsish > 2000) {
        fail(`${skillName}: SKILL.md body is too long (${bodyWordsish} > 2000); move details to references or scripts`);
      }

      const requiredObinitReferences = [
        "references/init-modes.md",
        "references/entry-file-policy.md",
        "references/obsidian-sync.md",
        "references/memory-bank.md",
      ];

      for (const relativePath of requiredObinitReferences) {
        if (!markdown.includes(relativePath)) {
          fail(`${skillName}: SKILL.md must link ${relativePath}`);
        }

        if (!existsSync(join(skillsDir, skillName, relativePath))) {
          fail(`${skillName}: missing ${relativePath}`);
        }
      }

      const requiredObinitScripts = [
        "scripts/inspect-project.mjs",
        "scripts/check-generated-docs.mjs",
      ];

      for (const relativePath of requiredObinitScripts) {
        if (!markdown.includes(relativePath)) {
          fail(`${skillName}: SKILL.md must mention ${relativePath}`);
        }

        if (!existsSync(join(skillsDir, skillName, relativePath))) {
          fail(`${skillName}: missing ${relativePath}`);
        }
      }

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
      ];

      for (const concept of requiredObinitConcepts) {
        const missing = concept.terms.filter((term) => !markdown.includes(term));
        if (missing.length > 0) {
          fail(`${skillName}: missing required ${concept.name} concept terms: ${missing.join(", ")}`);
        }
      }
    }

    const openAiAgentPath = join(skillsDir, skillName, "agents", "openai.yaml");
    if (!existsSync(openAiAgentPath)) {
      fail(`${skillName}: missing agents/openai.yaml`);
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

        for (const phrase of forbiddenGeneratedEnglish) {
          if (content.includes(phrase)) {
            fail(`${skillName}: template ${template} contains English generated-doc phrase: ${phrase}`);
          }
        }

        for (const phrase of forbiddenDefaultKnowledgeLinks) {
          if (content.includes(phrase)) {
            fail(`${skillName}: template ${template} contains hardcoded default knowledge link: ${phrase}`);
          }
        }

        if (skillName === "obinit" && template === "obsidian-project-note.md") {
          const concreteKnowledgeLinks = content.match(/\[\[(?!<)[^\]]+\]\]/g) ?? [];
          if (concreteKnowledgeLinks.length > 0) {
            fail(`${skillName}: template ${template} must not prefill concrete knowledge wikilinks: ${concreteKnowledgeLinks.join(", ")}`);
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

    for (const phrase of forbiddenGeneratedEnglish) {
      if (command.includes(phrase)) {
        fail(`${skillName}: command contains English generated-doc phrase: ${phrase}`);
      }
    }
  }
}

if (existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

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
    for (const phrase of forbiddenProjectPositioning) {
      if (content.includes(phrase)) {
        fail(`${relativePath}: avoid positioning the project as Chinese-only: ${phrase}`);
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

if (process.exitCode) {
  process.exit();
}

console.log("All skills are valid.");
