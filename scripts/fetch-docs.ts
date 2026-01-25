import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { products, type Product } from '../src/lib/products';

interface GitHubContent {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url: string | null;
}

function ghApiCall(endpoint: string): unknown {
  try {
    const result = execSync(`gh api ${endpoint}`, {
      encoding: 'utf-8',
      timeout: 30000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    try {
      const parsed = JSON.parse(result);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid API response format');
      }
      return parsed;
    } catch {
      throw new Error(`Failed to parse GitHub API response: ${result.substring(0, 200)}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('command not found') || error.message.includes('gh: not found')) {
        throw new Error(
          '✗ GitHub CLI not found.\n' +
          '  Install with: brew install gh (macOS) or see https://cli.github.com/manual/installation'
        );
      }
      if (error.message.includes('authentication') || error.message.includes('401')) {
        throw new Error(
          '✗ GitHub authentication failed.\n' +
          '  Run: gh auth login\n' +
          '  Or set GH_TOKEN environment variable'
        );
      }
      if (error.message.includes('rate limit') || error.message.includes('403')) {
        throw new Error(
          '✗ GitHub API rate limit exceeded.\n' +
          '  Wait or authenticate with MOAT_DOCS_TOKEN secret.'
        );
      }
      if (error.message.includes('Not Found') || error.message.includes('404')) {
        throw new Error(
          `✗ Resource not found: ${endpoint}\n` +
          `  Check if the repository exists and is accessible.`
        );
      }
    }
    throw new Error(`GitHub API call failed for ${endpoint}: ${error}`);
  }
}

async function fetchDirectoryContents(repo: string, repoPath: string): Promise<GitHubContent[]> {
  const endpoint = `repos/${repo}/contents/${repoPath}`;
  return ghApiCall(endpoint) as GitHubContent[];
}

async function downloadFile(
  repo: string,
  repoPath: string,
  outputPath: string,
  productId: string
): Promise<void> {
  let content: string;

  try {
    content = execSync(`gh api repos/${repo}/contents/${repoPath} --jq .content | base64 -d`, {
      encoding: 'utf-8',
      timeout: 30000,
    });
  } catch (error) {
    throw new Error(`Failed to download ${repoPath}: ${error}`);
  }

  // Validate it's text content
  if (content.includes('\0')) {
    throw new Error(`File ${repoPath} appears to be binary, not markdown`);
  }

  // Validate frontmatter exists (basic check)
  if (!content.trim().startsWith('---')) {
    console.warn(`⚠ Warning: ${repoPath} missing frontmatter, adding default`);
    const filename = path.basename(repoPath, '.md').replace(/^\d+-/, '');
    const title = filename
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    content = `---\ntitle: "${title}"\n---\n\n${content}`;
  }

  // Rewrite markdown links to match Astro URL structure
  content = rewriteMarkdownLinks(content, repoPath, productId);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, content, 'utf-8');
}

function rewriteMarkdownLinks(content: string, filePath: string, productId: string): string {
  // Extract category from file path like "docs/content/getting-started/01-introduction.md"
  const match = filePath.match(/docs\/content\/([^\/]+)\//);
  const currentCategory = match ? match[1] : '';

  // Rewrite different link patterns
  return content
    // Cross-category links: ../concepts/01-sandboxing.md -> /${productId}/concepts/sandboxing
    .replace(/\]\(\.\.\/([^\/]+)\/(\d+-)?([\w-]+)\.md\)/g, (_, category, _num, slug) => {
      return `](/${productId}/${category}/${slug})`;
    })
    // Explicit category links: concepts/01-sandboxing.md -> /${productId}/concepts/sandboxing
    .replace(/\]\(([^\/\.]+)\/(\d+-)?([\w-]+)\.md\)/g, (_, category, _num, slug) => {
      return `](/${productId}/${category}/${slug})`;
    })
    // Same-category links: ./02-installation.md or 02-installation.md -> /${productId}/getting-started/installation
    .replace(/\]\(\.?\/(\d+-)?([\w-]+)\.md\)/g, (_, _num, slug) => {
      return `](/${productId}/${currentCategory}/${slug})`;
    });
}

async function syncDirectory(
  repo: string,
  remotePath: string,
  localPath: string,
  productId: string
): Promise<void> {
  console.log(`Syncing ${remotePath}...`);

  const contents = await fetchDirectoryContents(repo, remotePath);

  for (const item of contents) {
    const itemLocalPath = path.join(localPath, item.name);

    if (item.type === 'file') {
      console.log(`  Downloading ${item.name}...`);
      await downloadFile(repo, item.path, itemLocalPath, productId);
    } else if (item.type === 'dir') {
      await syncDirectory(repo, item.path, itemLocalPath, productId);
    }
  }
}

async function fetchProductDocs(product: Product): Promise<void> {
  const outputDir = `./src/content/${product.id}`;

  console.log(`\nFetching ${product.name} documentation from GitHub...`);
  console.log(`  Repo: ${product.docsRepo}`);
  console.log(`  Path: ${product.docsPath}`);
  console.log(`  Output: ${outputDir}\n`);

  try {
    // Clean output directory
    await fs.rm(outputDir, { recursive: true, force: true });
    await fs.mkdir(outputDir, { recursive: true });

    // Sync all documentation
    await syncDirectory(product.docsRepo, product.docsPath, outputDir, product.id);

    console.log(`\n✓ ${product.name} documentation synced successfully!`);
  } catch (error) {
    // Check if we have cached content from previous build
    try {
      const cachedFiles = await fs.readdir(outputDir);
      if (cachedFiles.length > 0) {
        console.error(`✗ Error fetching ${product.name} documentation:`, error);
        console.warn(`⚠ Using cached ${product.name} documentation from previous build`);
        return;
      }
    } catch {
      // No cache available
    }

    console.error(`✗ Error fetching ${product.name} documentation:`, error);
    console.error(`✗ No cached content available for ${product.name}, build cannot continue`);
    throw error;
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const productId = args[0];

  try {
    if (productId) {
      // Fetch specific product
      const product = products[productId];
      if (!product) {
        console.error(`✗ Error: Product "${productId}" not found`);
        console.error(`Available products: ${Object.keys(products).join(', ')}`);
        process.exit(1);
      }
      await fetchProductDocs(product);
    } else {
      // Fetch all products
      console.log('Fetching documentation for all products...');
      const productList = Object.values(products);

      for (const product of productList) {
        await fetchProductDocs(product);
      }

      console.log('\n✓ All documentation synced successfully!');
    }
  } catch (error) {
    console.error('Error fetching documentation:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Error fetching documentation:', error);
  process.exit(1);
});
