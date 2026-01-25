import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

interface GitHubContent {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url: string | null;
}

const REPO = 'majorcontext/moat';
const DOCS_PATH = 'docs/content';
const OUTPUT_DIR = './src/content/moat';

function ghApiCall(endpoint: string): unknown {
  const result = execSync(`gh api ${endpoint}`, { encoding: 'utf-8' });
  return JSON.parse(result);
}

async function fetchDirectoryContents(repoPath: string): Promise<GitHubContent[]> {
  const endpoint = `repos/${REPO}/contents/${repoPath}`;
  return ghApiCall(endpoint) as GitHubContent[];
}

async function downloadFile(repoPath: string, outputPath: string): Promise<void> {
  let content = execSync(`gh api repos/${REPO}/contents/${repoPath} --jq .content | base64 -d`, {
    encoding: 'utf-8',
  });

  // Rewrite markdown links to match Astro URL structure
  content = rewriteMarkdownLinks(content, repoPath);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, content, 'utf-8');
}

function rewriteMarkdownLinks(content: string, filePath: string): string {
  // Extract category from file path like "docs/content/getting-started/01-introduction.md"
  const match = filePath.match(/docs\/content\/([^\/]+)\//);
  const currentCategory = match ? match[1] : '';

  // Rewrite different link patterns
  return content
    // Cross-category links: ../concepts/01-sandboxing.md -> /moat/concepts/sandboxing
    .replace(/\]\(\.\.\/([^\/]+)\/(\d+-)?([\w-]+)\.md\)/g, (_, category, _num, slug) => {
      return `](/moat/${category}/${slug})`;
    })
    // Explicit category links: concepts/01-sandboxing.md -> /moat/concepts/sandboxing
    .replace(/\]\(([^\/\.]+)\/(\d+-)?([\w-]+)\.md\)/g, (_, category, _num, slug) => {
      return `](/moat/${category}/${slug})`;
    })
    // Same-category links: ./02-installation.md or 02-installation.md -> /moat/getting-started/installation
    .replace(/\]\(\.?\/(\d+-)?([\w-]+)\.md\)/g, (_, _num, slug) => {
      return `](/moat/${currentCategory}/${slug})`;
    });
}

async function syncDirectory(remotePath: string, localPath: string): Promise<void> {
  console.log(`Syncing ${remotePath}...`);

  const contents = await fetchDirectoryContents(remotePath);

  for (const item of contents) {
    const itemLocalPath = path.join(localPath, item.name);

    if (item.type === 'file') {
      console.log(`  Downloading ${item.name}...`);
      await downloadFile(item.path, itemLocalPath);
    } else if (item.type === 'dir') {
      await syncDirectory(item.path, itemLocalPath);
    }
  }
}

async function main(): Promise<void> {
  console.log('Fetching moat documentation from GitHub...\n');

  // Clean output directory
  await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Sync all documentation
  await syncDirectory(DOCS_PATH, OUTPUT_DIR);

  console.log('\n✓ Documentation synced successfully!');
}

main().catch((error) => {
  console.error('Error fetching documentation:', error);
  process.exit(1);
});
