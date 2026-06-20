import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const skillsDir = join(root, "skills");
const commandsDir = join(root, "commands");
const packageJsonPath = join(root, "package.json");
let skillNames = [];

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
}

if (process.exitCode) {
  process.exit();
}

console.log("All skills are valid.");
