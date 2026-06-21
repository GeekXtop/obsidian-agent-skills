#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import process from "node:process";

const forbiddenPhrases = [
  "Read `.agents/instructions.md` first",
  "# Agent Instructions",
  "## Project Protocol",
  "## Bootstrap Scope",
  "## Normal Work",
  "## Memory",
  "# Agent Memory",
  "## Knowledge Used",
  "## Knowledge Extracted",
  "Knowledge Note",
  "Frontend Design Pitfalls",
  "React Project Conventions",
  "## 待查知识",
];

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

function walkFiles(root, relativePath, result = []) {
  const path = join(root, relativePath);
  if (!existsSync(path)) return result;

  const stat = statSync(path);
  if (stat.isFile()) {
    result.push(relativePath);
    return result;
  }

  for (const name of readdirSync(path)) {
    walkFiles(root, join(relativePath, name), result);
  }
  return result;
}

function readIfExists(root, relativePath) {
  const path = join(root, relativePath);
  if (!existsSync(path) || !statSync(path).isFile()) return "";
  return readFileSync(path, "utf8");
}

const root = findRoot(process.argv[2] ? resolve(process.argv[2]) : process.cwd());
const files = [
  "AGENTS.md",
  "CLAUDE.md",
  ...walkFiles(root, ".agents"),
  ...walkFiles(root, "docs/adr"),
  ...walkFiles(root, "docs/superpowers"),
].filter((path, index, all) => all.indexOf(path) === index);

const issues = [];

for (const relativePath of files) {
  const content = readIfExists(root, relativePath);
  if (!content) continue;

  for (const phrase of forbiddenPhrases) {
    if (content.includes(phrase)) {
      issues.push(`${relativePath}: contains forbidden generated phrase: ${phrase}`);
    }
  }
}

for (const entry of ["AGENTS.md", "CLAUDE.md"]) {
  const content = readIfExists(root, entry).trim();
  if (!content) continue;

  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (content.includes(".agents/instructions.md") && lines.length <= 3) {
    issues.push(`${entry}: looks like an existing guide may have been replaced by a short pointer`);
  }
}

if (issues.length > 0) {
  console.error(issues.join("\n"));
  process.exit(1);
}

console.log(`Generated docs check passed for ${root}`);
