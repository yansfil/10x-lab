import * as fs from 'fs';
import * as path from 'path';
import { ContextFile, ValidationError, ValidationResult } from './types';

export class ContextValidator {
  private errors: ValidationError[] = [];
  private filePath: string = '';

  validate(content: ContextFile, filePath: string): ValidationResult {
    this.errors = [];
    this.filePath = filePath;

    // Check required fields
    this.checkRequiredField(content, 'meta', 'object');
    if (content.meta) {
      this.checkRequiredField(content.meta, 'target', 'string', 'meta.target');
      this.checkVersion(content.meta.version);
    }

    this.checkRequiredField(content, 'what', 'string');
    this.checkRequiredField(content, 'use_when', 'array');
    this.checkRequiredField(content, 'do_not_use_when', 'array');

    // Check array fields have items
    this.checkArrayNotEmpty(content.use_when, 'use_when');
    this.checkArrayNotEmpty(content.do_not_use_when, 'do_not_use_when');

    // Check optional fields
    if (content.dependencies) {
      this.checkArrayField(content.dependencies, 'dependencies');
    }

    if (content.future) {
      this.checkArrayField(content.future, 'future');
    }

    if (content.constraints) {
      if (typeof content.constraints === 'string') {
        // String is valid
      } else if (Array.isArray(content.constraints)) {
        this.checkArrayField(content.constraints, 'constraints');
      } else {
        this.addError('constraints', 'Must be a string or array of strings');
      }
    }

    // Check target path validity if meta.target exists
    if (content.meta?.target) {
      this.checkTargetPath(content.meta.target);
    }

    return {
      file: filePath,
      valid: !this.errors.some(e => e.severity === 'error'),
      errors: this.errors
    };
  }

  private checkRequiredField(obj: any, field: string, type: string, fieldPath?: string): void {
    const displayField = fieldPath || field;

    if (!(field in obj) || obj[field] === undefined || obj[field] === null) {
      this.addError(displayField, `Required field is missing`);
      return;
    }

    if (type === 'string' && typeof obj[field] !== 'string') {
      this.addError(displayField, `Must be a string`);
    } else if (type === 'array' && !Array.isArray(obj[field])) {
      this.addError(displayField, `Must be an array`);
    } else if (type === 'object' && typeof obj[field] !== 'object') {
      this.addError(displayField, `Must be an object`);
    }
  }

  private checkArrayField(arr: any, field: string): void {
    if (!Array.isArray(arr)) {
      this.addError(field, 'Must be an array');
      return;
    }

    arr.forEach((item, index) => {
      if (typeof item !== 'string') {
        this.addError(`${field}[${index}]`, 'Must be a string');
      }
    });
  }

  private checkArrayNotEmpty(arr: any, field: string): void {
    if (Array.isArray(arr) && arr.length === 0) {
      this.addWarning(field, 'Array should have at least one item');
    }
  }

  private checkVersion(version?: string): void {
    if (!version) {
      this.addWarning('meta.version', 'Version is recommended');
      return;
    }

    const semverRegex = /^\d+\.\d+\.\d+$/;
    if (!semverRegex.test(version)) {
      this.addWarning('meta.version', `Version format should be x.y.z (found: ${version})`);
    }
  }

  private checkTargetPath(target: string): void {
    if (!target.startsWith('/')) {
      this.addError('meta.target', 'Target path must start with / (absolute path from project root)');
    }
  }

  private addError(field: string, message: string): void {
    this.errors.push({
      field,
      message,
      severity: 'error'
    });
  }

  private addWarning(field: string, message: string): void {
    this.errors.push({
      field,
      message,
      severity: 'warning'
    });
  }
}

export function validateContextFile(content: ContextFile, filePath: string): ValidationResult {
  const validator = new ContextValidator();
  return validator.validate(content, filePath);
}

// Global Context Validation

import { GlobalContextRegistry, GlobalContextFolder } from './types';
import * as yaml from 'js-yaml';

export interface GlobalValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export async function validateGlobalContexts(): Promise<GlobalValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  const registryPath = path.join(process.cwd(), '.ctx', '.global-context-registry.yml');

  // Check if registry exists
  if (!fs.existsSync(registryPath)) {
    errors.push('Global context registry not found. Run "pnpm ctx:sync:global" to generate it.');
    return { valid: false, errors, warnings };
  }

  try {
    // Load registry
    const content = fs.readFileSync(registryPath, 'utf-8');
    const yamlContent = content
      .split('\n')
      .filter(line => !line.trim().startsWith('#') || line.includes('ai_comment'))
      .join('\n');

    const registry = yaml.load(yamlContent) as GlobalContextRegistry;

    if (!registry || !registry.meta) {
      errors.push('Registry format is invalid');
      return { valid: false, errors, warnings };
    }

    // Validate each folder
    for (const [folderName, folderData] of Object.entries(registry)) {
      if (folderName === 'meta') continue;

      const folder = folderData as GlobalContextFolder;

      // Check if folder-level comment exists
      if (!folder.ai_comment) {
        warnings.push(`Folder "${folderName}" has no AI comment`);
      }

      // Validate each file
      for (const file of folder.files) {
        const fullPath = path.join(process.cwd(), '.ctx', file.path);

        // Check if file exists
        if (!fs.existsSync(fullPath)) {
          errors.push(`File referenced in registry does not exist: ${file.path}`);
          continue;
        }

        // Check if AI comment exists
        if (!file.ai_comment) {
          warnings.push(`File "${file.path}" has no AI comment`);
        }

        // Check checksum consistency
        const actualChecksum = computeFileChecksum(fullPath);
        if (actualChecksum !== file.checksum) {
          warnings.push(`File "${file.path}" checksum mismatch - content may have changed since last sync`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    errors.push(`Failed to validate global registry: ${error}`);
    return { valid: false, errors, warnings };
  }
}

function computeFileChecksum(filePath: string): string {
  const { computeFileChecksum: compute } = require('./checksumUtil');
  return compute(filePath);
}