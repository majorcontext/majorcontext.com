#!/usr/bin/env bun

import { readdir, readFile } from "fs/promises";
import { join } from "path";

interface ValidationResult {
  file: string;
  line: number;
  link: string;
  target: string;
}

// Read all markdown files from a directory recursively
async function getMarkdownFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  async function traverse(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await traverse(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(fullPath);
      }
    }
  }

  await traverse(dir);
  return files;
}

// Extract the path from a content file to build valid internal paths
function getPathFromFile(filePath: string): string {
  // Extract path from: src/content/moat/concepts/01-sandboxing.md
  // Result: /moat/concepts/sandboxing
  const match = filePath.match(/src\/content\/moat\/(.+)\/\d+-(.+)\.md$/);
  if (!match) {
    // Handle files without number prefix like getting-started/introduction.md
    const altMatch = filePath.match(/src\/content\/moat\/(.+?)\.md$/);
    if (!altMatch) return "";

    const [, pathPart] = altMatch;
    return `/moat/${pathPart}`;
  }

  const [, category, filename] = match;
  return `/moat/${category}/${filename}`;
}

// Find all internal links in markdown content
function findInternalLinks(content: string, filePath: string): ValidationResult[] {
  const results: ValidationResult[] = [];
  const lines = content.split("\n");

  // Match markdown links: [text](/moat/...)
  const linkPattern = /\[([^\]]+)\]\(\/moat\/([^)]+)\)/g;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let match;

    while ((match = linkPattern.exec(line)) !== null) {
      const fullLink = match[0];
      const target = `/moat/${match[2]}`;

      results.push({
        file: filePath,
        line: i + 1,
        link: fullLink,
        target: target,
      });
    }
  }

  return results;
}

async function main() {
  const contentDir = join(process.cwd(), "src/content/moat");

  console.log("Validating internal markdown links...\n");

  // Step 1: Build a set of valid paths from content files
  const markdownFiles = await getMarkdownFiles(contentDir);
  const validPaths = new Set<string>();

  for (const file of markdownFiles) {
    const path = getPathFromFile(file);
    if (path) {
      validPaths.add(path);
    }
  }

  console.log(`Found ${validPaths.size} valid pages:\n`);
  const sortedPaths = Array.from(validPaths).sort();
  for (const path of sortedPaths) {
    console.log(`  ${path}`);
  }
  console.log();

  // Step 2: Check all internal links in markdown files
  const brokenLinks: ValidationResult[] = [];

  for (const file of markdownFiles) {
    const content = await readFile(file, "utf-8");
    const links = findInternalLinks(content, file);

    for (const linkInfo of links) {
      if (!validPaths.has(linkInfo.target)) {
        brokenLinks.push(linkInfo);
      }
    }
  }

  // Step 3: Report results
  if (brokenLinks.length === 0) {
    console.log("✓ All internal links are valid!");
    process.exit(0);
  } else {
    console.error(`✗ Found ${brokenLinks.length} broken link(s):\n`);

    for (const broken of brokenLinks) {
      // Make file path relative for cleaner output
      const relPath = broken.file.replace(process.cwd() + "/", "");
      console.error(`  ${relPath}:${broken.line}`);
      console.error(`    Link: ${broken.link}`);
      console.error(`    Target: ${broken.target} (not found)`);
      console.error();
    }

    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Error validating links:", error);
  process.exit(1);
});
