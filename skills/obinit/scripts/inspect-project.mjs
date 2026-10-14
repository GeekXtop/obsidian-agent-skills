#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import process from "node:process";

function toPosix(path) {
  return path.replace(/\\/g, "/");
}

function findRoot(cwd) {
  try {
    return toPosix(execFileSync("git", ["rev-parse", "--show-toplevel"], {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim());
  } catch {
    return toPosix(resolve(cwd));
  }
}

function readFileState(root, relativePath) {
  const path = join(root, relativePath);
  if (!existsSync(path)) {
    return { path: relativePath, exists: false, nonEmpty: false, hasInstructionsPointer: false };
  }

  const stat = statSync(path);
  const content = stat.isFile() ? readFileSync(path, "utf8") : "";
  return {
    path: relativePath,
    exists: true,
    nonEmpty: content.trim().length > 0,
    hasInstructionsPointer: content.includes(".agents/instructions.md"),
  };
}

function pathExists(root, relativePath) {
  return existsSync(join(root, relativePath));
}

function listDocsTopLevel(root) {
  const docsPath = join(root, "docs");
  if (!existsSync(docsPath) || !statSync(docsPath).isDirectory()) {
    return { directories: [], indexFiles: [] };
  }

  const entries = readdirSync(docsPath, { withFileTypes: true });
  return {
    directories: entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort(),
    indexFiles: entries.filter((entry) => entry.isFile() && /\.(md|mdx)$/i.test(entry.name)).map((entry) => entry.name).sort(),
  };
}

const root = findRoot(process.argv[2] ? resolve(process.argv[2]) : process.cwd());
const entryFiles = ["AGENTS.md", "CLAUDE.md"].map((path) => readFileState(root, path));
const memoryFiles = [".agents/instructions.md", ".agents/active.md", ".agents/progress.md", ".agents/lessons.md"].map((path) => readFileState(root, path));
const docsSignals = ["README.md", "docs"].map((path) => ({
  path,
  exists: pathExists(root, path),
}));

// 重复运行判定只认 .agents/instructions.md：obinit 每次初始化必建它，只有它能证明
// .agents/ 是 obinit 代际产物；非 obinit 项目自建的 active.md 等文件不得误判（LP-Bot 反例）。
const hasObinitMemory = memoryFiles.some((file) => file.path === ".agents/instructions.md" && file.exists);
const hasNonEmptyEntry = entryFiles.some((file) => file.nonEmpty);
const hasProjectDocs = docsSignals.some((item) => item.exists);
const mode = hasObinitMemory ? "repeat" : hasNonEmptyEntry || hasProjectDocs ? "mature" : "new";

const allowlist = [
  "AGENTS.md",
  "CLAUDE.md",
  ".agents",
  "docs/adr",
  ".gitignore",
];

const result = {
  root,
  project: basename(root),
  mode,
  entryFiles,
  memoryFiles,
  docsSignals,
  docsTopLevel: listDocsTopLevel(root),
  missingAllowlist: allowlist.filter((path) => !pathExists(root, path)),
  obsidianProjectNote: `Agent/Projects/${basename(root)}.md`,
};

console.log(JSON.stringify(result, null, 2));
