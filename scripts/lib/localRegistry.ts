import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { createHash } from 'crypto';
import { ContextFile, ContextRegistry, ContextRegistryEntry, SyncResult } from './types';

interface ParsedContextFile {
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

async function findContextFiles(rootPath: string = '.'): Promise<string[]> {
  const patterns = [
    path.join(rootPath, '**/ctx.yml'),
    path.join(rootPath, '**/*.ctx.yml')
  ];

  const allFiles: string[] = [];
  for (const pattern of patterns) {
    const files = await glob(pattern);
    allFiles.push(...files);
  }

  return [...new Set(allFiles)];
}

function parseContextFile(filePath: string): ParsedContextFile | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return yaml.load(content) as ParsedContextFile;
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return null;
  }
}

function calculateFileHash(content: string): string {
  return createHash('sha256').update(content).digest('hex').substring(0, 12);
}

function getModulePath(ctxFilePath: string, rootPath: string): string {
  const content = parseContextFile(ctxFilePath);
  if (content?.meta?.target) {
    return content.meta.target;
  }

  const relativePath = path.relative(rootPath, ctxFilePath);
  const fileName = path.basename(relativePath);
  const dirPath = path.dirname(relativePath);

  if (fileName === 'ctx.yml') {
    return '/' + dirPath.replace(/\\/g, '/');
  }

  const moduleName = fileName.replace('.ctx.yml', '');
  const fullPath = dirPath ? `${dirPath}/${moduleName}` : moduleName;
  return '/' + fullPath.replace(/\\/g, '/');
}

function extractDescription(context: ParsedContextFile): string {
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

async function generateLocalRegistry(rootPath: string = '.'): Promise<ContextRegistry> {
  console.log('🔍 Scanning for local context files...');
  const contextFiles = await findContextFiles(rootPath);
  console.log(`📁 Found ${contextFiles.length} context files`);

  const contexts: Record<string, ContextRegistryEntry> = {};
  const errors: string[] = [];

  for (const filePath of contextFiles) {
    const content = parseContextFile(filePath);
    if (!content) {
      errors.push(`Failed to parse: ${filePath}`);
      continue;
    }

    const modulePath = getModulePath(filePath, rootPath);
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    contexts[modulePath] = {
      what: extractDescription(content),
      use_when: content.use_when,
      category: content.meta?.category,
      source: path.relative(rootPath, filePath),
      hash: calculateFileHash(fileContent),
    };
  }

  const byCategory: Record<string, string[]> = {};

  Object.entries(contexts).forEach(([path, context]) => {
    if (context.category) {
      byCategory[context.category] = byCategory[context.category] || [];
      byCategory[context.category].push(path);
    }
  });

  const entryPoints = Object.keys(contexts).filter(path => {
    return path.includes('/app') ||
           path.includes('/pages') ||
           path.includes('/src/main') ||
           path.includes('/src/index');
  });

  return {
    meta: {
      version: '1.0.0',
      total_contexts: Object.keys(contexts).length,
      last_sync: new Date().toISOString(),
      generation_command: 'pnpm ctx:sync:local',
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

export async function syncLocalContexts(rootPath: string = '.'): Promise<SyncResult> {
  try {
    const absoluteRootPath = path.resolve(rootPath);
    console.log(`📂 Root path: ${absoluteRootPath}`);

    const registry = await generateLocalRegistry(absoluteRootPath);

    const ctxDir = path.join(process.cwd(), '.ctx');
    if (!fs.existsSync(ctxDir)) {
      fs.mkdirSync(ctxDir, { recursive: true });
    }

    const outputPath = path.join(ctxDir, '.local-context-registry.yml');

    // Load existing registry for comparison
    let existingRegistry: ContextRegistry | null = null;
    if (fs.existsSync(outputPath)) {
      try {
        const existingContent = fs.readFileSync(outputPath, 'utf-8');
        const yamlContent = existingContent
          .split('\n')
          .filter(line => !line.trim().startsWith('#'))
          .join('\n');
        existingRegistry = yaml.load(yamlContent) as ContextRegistry;
      } catch (error) {
        console.error(`⚠️  Failed to load existing registry:`, error);
      }
    }

    // Compare registries (excluding meta.last_sync)
    let hasChanges = false;
    if (existingRegistry) {
      const newRegistryWithoutTimestamp = { ...registry };
      const existingRegistryWithoutTimestamp = { ...existingRegistry };

      // Remove timestamps for comparison
      if (newRegistryWithoutTimestamp.meta) {
        delete (newRegistryWithoutTimestamp.meta as any).last_sync;
      }
      if (existingRegistryWithoutTimestamp.meta) {
        delete (existingRegistryWithoutTimestamp.meta as any).last_sync;
      }

      const newContent = JSON.stringify(newRegistryWithoutTimestamp);
      const existingContent = JSON.stringify(existingRegistryWithoutTimestamp);
      hasChanges = newContent !== existingContent;
    } else {
      hasChanges = true; // No existing registry, always write
    }

    // Only write if there are actual changes
    if (hasChanges) {
      const yamlContent = yaml.dump(registry, {
        lineWidth: -1,
        noRefs: true,
        sortKeys: false,
      });

      const header = `# Local Context Registry
# ⚠️ AUTO-GENERATED - DO NOT EDIT
# Run 'pnpm ctx:sync:local' to update
# Generated: ${new Date().toISOString()}

`;

      fs.writeFileSync(outputPath, header + yamlContent);
    }

    if (hasChanges) {
      console.log('✅ Local context registry updated successfully!');
    } else {
      console.log('✅ Local context registry is up to date (no changes)');
    }
    console.log(`📍 Location: ${outputPath}`);
    console.log(`📊 Statistics:`);
    console.log(`   - Total contexts: ${registry.meta.total_contexts}`);
    console.log(`   - Categories: ${Object.keys(registry.indexes.by_category).length}`);
    console.log(`   - Entry points: ${registry.indexes.entry_points.length}`);

    if (registry.validation.errors.length > 0) {
      console.log(`   - ⚠️ Errors: ${registry.validation.errors.length}`);
      registry.validation.errors.forEach(err => console.log(`     - ${err}`));
    }

    return {
      success: true,
      registry,
      validation: registry.validation.errors,
    };
  } catch (error) {
    console.error('❌ Failed to generate local context registry:', error);
    return {
      success: false,
      validation: [String(error)],
    };
  }
}
