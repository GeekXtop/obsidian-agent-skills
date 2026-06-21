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
      const requiredObinitRules = [
        "## 初始化模式选择",
        "新项目模式",
        "成熟项目接入模式",
        "重复运行模式",
        "索引型 `.agents/instructions.md`",
        "## 入口文件保护",
        "不得用 `templates/agent-entry.md` 整体替换",
        "已有非空入口文件只追加中文入口段",
        "不要把 `AGENTS.md` / `CLAUDE.md` 的长内容完整复制进 `.agents/instructions.md`",
        "默认使用简体中文",
      ];

      for (const rule of requiredObinitRules) {
        if (!markdown.includes(rule)) {
          fail(`${skillName}: missing required safety rule: ${rule}`);
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
