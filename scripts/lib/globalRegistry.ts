import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import {
  computeFileChecksum,
  computeFolderChecksum,
  getFileModifiedTime,
  getFolderModifiedTime,
} from './checksumUtil';
import {
  GlobalContextRegistry,
  GlobalContextFolder,
  GlobalContextFile,
  SyncResult,
  AnnotationNeeded,
} from './types';

const CTX_ROOT = '.ctx';
const OUTPUT_FILE = '.global-context-registry.yml';

/**
 * Find all markdown files in .ctx/ except overview.md and hidden files
 */
async function findGlobalContextFiles(): Promise<Record<string, string[]>> {
  const folders = ['architecture', 'rules'];
  const result: Record<string, string[]> = {};

  for (const folder of folders) {
    const folderPath = path.join(CTX_ROOT, folder);

    // Check if folder exists
    if (!fs.existsSync(folderPath)) {
      console.log(`⚠️  Folder not found: ${folderPath}, skipping...`);
      result[folder] = [];
      continue;
    }

    // Find all .md files, excluding hidden files (starting with .)
    const pattern = path.join(folderPath, '*.md');
    const files = await glob(pattern);

    // Filter out hidden files
    const visibleFiles = files.filter(f => {
      const basename = path.basename(f);
      return !basename.startsWith('.');
    });

    result[folder] = visibleFiles;
  }

  return result;
}

/**
 * Load existing global registry if it exists
 */
function loadExistingRegistry(): GlobalContextRegistry | null {
  const registryPath = path.join(CTX_ROOT, OUTPUT_FILE);

  if (!fs.existsSync(registryPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(registryPath, 'utf-8');
    // Remove header comments before parsing
    const yamlContent = content
      .split('\n')
      .filter(line => !line.trim().startsWith('#') || line.includes('ai_comment'))
      .join('\n');
    return yaml.load(yamlContent) as GlobalContextRegistry;
  } catch (error) {
    console.error(`⚠️  Failed to load existing registry:`, error);
    return null;
  }
}

/**
 * Detect files that need AI annotation
 */
function detectAnnotationNeeds(
  newRegistry: GlobalContextRegistry,
  oldRegistry: GlobalContextRegistry | null
): AnnotationNeeded[] {
  const needs: AnnotationNeeded[] = [];

  for (const [folderName, folderData] of Object.entries(newRegistry)) {
    if (folderName === 'meta') continue;

    const folder = folderData as GlobalContextFolder;
    const oldFolder = oldRegistry?.[folderName] as GlobalContextFolder | undefined;

    // Check folder-level comment
    if (!folder.ai_comment) {
      needs.push({
        type: 'folder',
        path: folderName,
        reason: 'missing_comment',
      });
    }

    // Check file-level comments
    for (const file of folder.files) {
      const oldFile = oldFolder?.files?.find(f => f.path === file.path);

      if (!file.ai_comment) {
        needs.push({
          type: 'file',
          path: file.path,
          reason: oldFile ? 'missing_comment' : 'new',
        });
      } else if (oldFile && oldFile.checksum !== file.checksum) {
        // Content changed but comment exists
        needs.push({
          type: 'file',
          path: file.path,
          reason: 'content_changed',
        });
      }
    }
  }

  return needs;
}

/**
 * Sync global contexts (mechanical part only)
 */
export async function syncGlobalContexts(): Promise<SyncResult> {
  try {
    console.log('🔍 Scanning global context files...');

    // Find all files by folder
    const filesByFolder = await findGlobalContextFiles();

    // Load existing registry to preserve AI comments
    const existingRegistry = loadExistingRegistry();

    // Build new registry
    const newRegistry: GlobalContextRegistry = {
      meta: {
        version: '1.0.0',
        last_synced: new Date().toISOString(),
        last_ai_update: existingRegistry?.meta?.last_ai_update || null,
      },
    };

    // Process each folder
    for (const [folderName, files] of Object.entries(filesByFolder)) {
      const folderPath = path.join(CTX_ROOT, folderName);

      // Get existing folder data to preserve AI comments
      const existingFolder = existingRegistry?.[folderName] as GlobalContextFolder | undefined;

      // Build file list
      const fileList: GlobalContextFile[] = [];

      for (const filePath of files) {
        const relativePath = path.relative(CTX_ROOT, filePath);
        const existingFile = existingFolder?.files?.find(f => f.path === relativePath);

        fileList.push({
          path: relativePath,
          checksum: computeFileChecksum(filePath),
          last_modified: getFileModifiedTime(filePath),
          ai_comment: existingFile?.ai_comment || null,
        });
      }

      // Compute folder checksum
      const folderChecksum = await computeFolderChecksum(folderPath, '*.md');
      const lastFileModified = await getFolderModifiedTime(folderPath, '*.md');

      newRegistry[folderName] = {
        folder_checksum: folderChecksum,
        file_count: files.length,
        last_file_modified: lastFileModified,
        ai_comment: existingFolder?.ai_comment || null,
        files: fileList,
      };
    }

    // Detect what needs AI annotation
    const needsAnnotation = detectAnnotationNeeds(newRegistry, existingRegistry);

    // Compare with existing registry (excluding meta.last_synced)
    let hasChanges = false;
    if (existingRegistry) {
      const newRegistryWithoutTimestamp = { ...newRegistry };
      const existingRegistryWithoutTimestamp = { ...existingRegistry };

      // Remove timestamps for comparison
      if (newRegistryWithoutTimestamp.meta) {
        delete (newRegistryWithoutTimestamp.meta as any).last_synced;
      }
      if (existingRegistryWithoutTimestamp.meta) {
        delete (existingRegistryWithoutTimestamp.meta as any).last_synced;
      }

      const newContent = JSON.stringify(newRegistryWithoutTimestamp);
      const existingContent = JSON.stringify(existingRegistryWithoutTimestamp);
      hasChanges = newContent !== existingContent;
    } else {
      hasChanges = true; // No existing registry, always write
    }

    const outputPath = path.join(CTX_ROOT, OUTPUT_FILE);

    // Only write if there are actual changes
    if (hasChanges) {
      const yamlContent = yaml.dump(newRegistry, {
        lineWidth: -1,
        noRefs: true,
        sortKeys: false,
      });

      const header = `# Global Context Registry
# ⚠️ AUTO-GENERATED - DO NOT EDIT
# Run 'pnpm ctx:sync:global' to update
# Generated: ${new Date().toISOString()}

`;

      fs.writeFileSync(outputPath, header + yamlContent);
    }

    // Report results
    if (hasChanges) {
      console.log('✅ Global context registry updated successfully!');
    } else {
      console.log('✅ Global context registry is up to date (no changes)');
    }
    console.log(`📍 Location: ${outputPath}`);
    console.log(`📊 Statistics:`);

    for (const [folderName, folderData] of Object.entries(newRegistry)) {
      if (folderName === 'meta') continue;
      const folder = folderData as GlobalContextFolder;
      console.log(`   - ${folderName}: ${folder.file_count} files`);
    }

    if (needsAnnotation.length > 0) {
      console.log(`\n⚠️  AI Annotation Needed (${needsAnnotation.length} items):`);
      needsAnnotation.forEach(item => {
        const icon = item.type === 'folder' ? '📁' : '📄';
        const reason = item.reason === 'new' ? 'new file' :
          item.reason === 'content_changed' ? 'content changed' :
            'missing comment';
        console.log(`   ${icon} ${item.path} (${reason})`);
      });
      console.log('\n💡 Run /sync-global-ctx in Claude Code to generate AI annotations');
    } else {
      console.log('\n✅ All contexts have AI annotations');
    }

    return {
      success: true,
      registry: newRegistry,
      needsAnnotation,
    };
  } catch (error) {
    console.error('❌ Failed to sync global contexts:', error);
    return {
      success: false,
      validation: [String(error)],
    };
  }
}
