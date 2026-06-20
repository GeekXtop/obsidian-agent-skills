import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const skillsDir = join(root, "skills");

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
  const skillNames = readdirSync(skillsDir).filter((name) => {
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
  }
}

if (process.exitCode) {
  process.exit();
}

console.log("All skills are valid.");
