import { createHash } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

/**
 * Compute SHA-256 checksum for a file's content
 */
export function computeFileChecksum(filePath: string): string {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return createHash('sha256').update(content).digest('hex').substring(0, 12);
  } catch (error) {
    console.error(`Error computing checksum for ${filePath}:`, error);
    return 'error';
  }
}

/**
 * Compute combined checksum for all files in a folder
 * Uses sorted file checksums to ensure consistency
 */
export async function computeFolderChecksum(folderPath: string, pattern: string = '*.md'): Promise<string> {
  try {
    const files = await glob(path.join(folderPath, pattern));

    if (files.length === 0) {
      return 'empty';
    }

    // Sort files for consistent ordering
    const sortedFiles = files.sort();

    // Compute individual checksums
    const checksums = sortedFiles.map(f => computeFileChecksum(f));

    // Combine into single checksum
    const combined = checksums.join('|');
    return createHash('sha256').update(combined).digest('hex').substring(0, 12);
  } catch (error) {
    console.error(`Error computing folder checksum for ${folderPath}:`, error);
    return 'error';
  }
}

/**
 * Get file's last modified timestamp
 */
export function getFileModifiedTime(filePath: string): string {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime.toISOString();
  } catch (error) {
    console.error(`Error getting modified time for ${filePath}:`, error);
    return new Date().toISOString();
  }
}

/**
 * Get the most recent modification time among files in a folder
 */
export async function getFolderModifiedTime(folderPath: string, pattern: string = '*.md'): Promise<string> {
  try {
    const files = await glob(path.join(folderPath, pattern));

    if (files.length === 0) {
      return new Date().toISOString();
    }

    const times = files.map(f => {
      const stats = fs.statSync(f);
      return stats.mtime.getTime();
    });

    const mostRecent = Math.max(...times);
    return new Date(mostRecent).toISOString();
  } catch (error) {
    console.error(`Error getting folder modified time for ${folderPath}:`, error);
    return new Date().toISOString();
  }
}
