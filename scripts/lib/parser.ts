import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { ContextFile, ContextRegistry } from './types';

export function parseContextFile(filePath: string): ContextFile | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return yaml.load(content) as ContextFile;
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return null;
  }
}

export function parseContextRegistry(filePath: string): ContextRegistry | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return yaml.load(content) as ContextRegistry;
  } catch (error) {
    console.error(`Error parsing registry ${filePath}:`, error);
    return null;
  }
}