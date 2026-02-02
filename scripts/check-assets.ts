#!/usr/bin/env bun

import { access } from "fs/promises";
import { join } from "path";

const REQUIRED_ASSETS = [
  "public/logo.svg",
  "public/favicon.svg",
];

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const cwd = process.cwd();

  console.log("Checking required assets...\n");

  const missingAssets: string[] = [];

  for (const asset of REQUIRED_ASSETS) {
    const fullPath = join(cwd, asset);
    const exists = await fileExists(fullPath);

    if (exists) {
      console.log(`✓ ${asset}`);
    } else {
      console.error(`✗ ${asset} (missing)`);
      missingAssets.push(asset);
    }
  }

  console.log();

  if (missingAssets.length === 0) {
    console.log("All required assets are present!");
    process.exit(0);
  } else {
    console.error(`Missing ${missingAssets.length} required asset(s):`);
    for (const asset of missingAssets) {
      console.error(`  - ${asset}`);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Error checking assets:", error);
  process.exit(1);
});
