import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const version = process.argv[2];

const versionPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

if (!version || !versionPattern.test(version)) {
  console.error("Usage: node scripts/bump-version.mjs <version>");
  console.error("Example: node scripts/bump-version.mjs 0.1.23");
  process.exit(1);
}

function updateJson(relativePath, update) {
  const filePath = join(root, relativePath);

  if (!existsSync(filePath)) {
    throw new Error(`Missing ${relativePath}`);
  }

  const before = readFileSync(filePath, "utf8");
  const data = JSON.parse(before);
  update(data);

  const after = `${JSON.stringify(data, null, 2)}\n`;
  if (after !== before) {
    writeFileSync(filePath, after);
    return true;
  }

  return false;
}

const changed = [];

for (const relativePath of [
  "package.json",
  "skills.json",
  join(".claude-plugin", "plugin.json"),
  join(".codex-plugin", "plugin.json"),
]) {
  if (updateJson(relativePath, (data) => {
    data.version = version;
  })) {
    changed.push(relativePath);
  }
}

if (updateJson(join(".claude-plugin", "marketplace.json"), (data) => {
  if (data.metadata) {
    data.metadata.version = version;
  }

  for (const plugin of data.plugins ?? []) {
    plugin.version = version;
  }
})) {
  changed.push(join(".claude-plugin", "marketplace.json"));
}

if (changed.length === 0) {
  console.log(`All version fields already set to ${version}.`);
} else {
  console.log(`Updated version to ${version}:`);
  for (const relativePath of changed) {
    console.log(`- ${relativePath}`);
  }
}
