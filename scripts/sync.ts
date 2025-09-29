#!/usr/bin/env node

import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { createHash } from 'crypto';

interface ContextFile {
  meta?: {
    version?: string;
    type?: string;
    category?: string;
    status?: string;
    target?: string;
  };
  what?: string;
  description?: string;
  use_when?: string[];
  do_not_use_when?: string[];
  dependencies?: string[];
  notes?: string | string[];
  future?: string[];
}

interface ContextEntry {
  what: string;
  use_when?: string[];
  category?: string;
  source: string;
  hash: string;
}

interface ContextRegistry {
  meta: {
    version: string;
    total_contexts: number;
    last_sync: string;
    generation_command: string;
  };
  contexts: Record<string, ContextEntry>;
  indexes: {
    by_category: Record<string, string[]>;
    entry_points: string[];
  };
  validation: {
    missing_contexts: string[];
    errors: string[];
  };
}

async function findContextFiles(rootPath: string = '.'): Promise<string[]> {
  // Support both ctx.yml and *.ctx.yml patterns
  const patterns = [
    path.join(rootPath, '**/ctx.yml'),
    path.join(rootPath, '**/*.ctx.yml')
  ];

  const allFiles: string[] = [];
  for (const pattern of patterns) {
    // No hardcoded ignore patterns - let all projects decide what to scan
    const files = await glob(pattern);
    allFiles.push(...files);
  }

  // Remove duplicates (in case both patterns match same file)
  return [...new Set(allFiles)];
}

function parseContextFile(filePath: string): ContextFile | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return yaml.load(content) as ContextFile;
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return null;
  }
}

function calculateFileHash(content: string): string {
  return createHash('sha256').update(content).digest('hex').substring(0, 12);
}

function getModulePath(ctxFilePath: string, rootPath: string): string {
  // If there's a target in the meta, use that instead
  const content = parseContextFile(ctxFilePath);
  if (content?.meta?.target) {
    return content.meta.target;
  }

  // Make path relative to the provided root path
  const relativePath = path.relative(rootPath, ctxFilePath);
  const fileName = path.basename(relativePath);
  const dirPath = path.dirname(relativePath);

  // If it's just ctx.yml, use the directory as module path
  if (fileName === 'ctx.yml') {
    return '/' + dirPath.replace(/\\/g, '/');
  }

  // If it's *.ctx.yml, use the filename (without .ctx.yml) as part of module path
  // e.g., button.ctx.yml -> /path/to/button
  const moduleName = fileName.replace('.ctx.yml', '');
  const fullPath = dirPath ? `${dirPath}/${moduleName}` : moduleName;
  return '/' + fullPath.replace(/\\/g, '/');
}

function extractDescription(context: ContextFile): string {
  // Priority: what > description > notes (first line)
  if (context.what) {
    return context.what.split('\n')[0].trim();
  }
  if (context.description) {
    return context.description.split('\n')[0].trim();
  }
  if (context.notes) {
    const notes = typeof context.notes === 'string' ? context.notes : context.notes[0];
    return notes.split('\n')[0].trim();
  }
  return 'No description available';
}

async function generateRegistry(rootPath: string = '.'): Promise<ContextRegistry> {
  console.log('🔍 Scanning for context files...');
  const contextFiles = await findContextFiles(rootPath);
  console.log(`📁 Found ${contextFiles.length} context files`);

  const contexts: Record<string, ContextEntry> = {};
  const errors: string[] = [];

  // Process each context file
  for (const filePath of contextFiles) {
    const content = parseContextFile(filePath);
    if (!content) {
      errors.push(`Failed to parse: ${filePath}`);
      continue;
    }

    const modulePath = getModulePath(filePath, rootPath);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const stats = fs.statSync(filePath);

    contexts[modulePath] = {
      what: extractDescription(content),
      use_when: content.use_when,
      category: content.meta?.category,
      source: path.relative(rootPath, filePath),
      hash: calculateFileHash(fileContent),
    };
  }

  // Create indexes - simplified to just category
  const byCategory: Record<string, string[]> = {};

  Object.entries(contexts).forEach(([path, context]) => {
    // Index by category
    if (context.category) {
      byCategory[context.category] = byCategory[context.category] || [];
      byCategory[context.category].push(path);
    }
  });

  // Detect entry points (heuristic: app, main, index files in root directories)
  const entryPoints = Object.keys(contexts).filter(path => {
    return path.includes('/app') ||
           path.includes('/pages') ||
           path.includes('/src/main') ||
           path.includes('/src/index');
  });

  // Skip dependency analysis for now

  return {
    meta: {
      version: '1.0.0',
      total_contexts: Object.keys(contexts).length,
      last_sync: new Date().toISOString(),
      generation_command: 'pnpm sync:contexts',
    },
    contexts,
    indexes: {
      by_category: byCategory,
      entry_points: entryPoints,
    },
    validation: {
      missing_contexts: [],
      errors,
    },
  };
}

async function main() {
  try {
    // Get root path from command line argument or use current directory
    const rootPath = process.argv[2] || '.';
    const absoluteRootPath = path.resolve(rootPath);

    console.log(`📂 Root path: ${absoluteRootPath}`);

    const registry = await generateRegistry(absoluteRootPath);

    // Ensure .spec directory exists
    const specDir = path.join(process.cwd(), '.spec');
    if (!fs.existsSync(specDir)) {
      fs.mkdirSync(specDir, { recursive: true });
    }

    // Write registry file
    const outputPath = path.join(specDir, 'context-registry.yml');
    const yamlContent = yaml.dump(registry, {
      lineWidth: -1,
      noRefs: true,
      sortKeys: false,
    });

    // Add header comment
    const header = `# Context Registry
# ⚠️ AUTO-GENERATED - DO NOT EDIT
# Run 'pnpm sync:contexts' to update
# Generated: ${new Date().toISOString()}

`;

    fs.writeFileSync(outputPath, header + yamlContent);

    console.log('✅ Context registry generated successfully!');
    console.log(`📍 Location: ${outputPath}`);
    console.log(`📊 Statistics:`);
    console.log(`   - Total contexts: ${registry.meta.total_contexts}`);
    console.log(`   - Categories: ${Object.keys(registry.indexes.by_category).length}`);
    console.log(`   - Entry points: ${registry.indexes.entry_points.length}`);
    if (registry.validation.errors.length > 0) {
      console.log(`   - ⚠️ Errors: ${registry.validation.errors.length}`);
      registry.validation.errors.forEach(err => console.log(`     - ${err}`));
    }
  } catch (error) {
    console.error('❌ Failed to generate context registry:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { generateRegistry, findContextFiles };