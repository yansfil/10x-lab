#!/usr/bin/env node

import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import { parseContextFile, parseContextRegistry } from './lib/parser';
import { validateContextFile } from './lib/validator';
import { ValidationResult } from './lib/types';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function colorize(text: string, color: keyof typeof colors): string {
  return `${colors[color]}${text}${colors.reset}`;
}

async function findContextFiles(rootPath: string = '.'): Promise<string[]> {
  const patterns = [
    path.join(rootPath, '**/ctx.yml'),
    path.join(rootPath, '**/*.ctx.yml')
  ];

  const allFiles: string[] = [];
  for (const pattern of patterns) {
    const files = await glob(pattern, {
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
    });
    allFiles.push(...files);
  }

  return [...new Set(allFiles)];
}


function printValidationResult(result: ValidationResult, verbose: boolean = false): void {
  const fileName = path.basename(result.file);

  if (result.valid && result.errors.filter(e => e.severity === 'warning').length === 0) {
    console.log(`${colorize('✓', 'green')} ${colorize('Valid:', 'green')} ${fileName}`);
    return;
  }

  const errors = result.errors.filter(e => e.severity === 'error');
  const warnings = result.errors.filter(e => e.severity === 'warning');

  if (errors.length > 0) {
    console.log(`${colorize('✗', 'red')} ${colorize('Invalid:', 'red')} ${fileName}`);
  } else {
    console.log(`${colorize('⚠', 'yellow')} ${colorize('Valid with warnings:', 'yellow')} ${fileName}`);
  }

  if (verbose || errors.length > 0) {
    errors.forEach(error => {
      console.log(`  ${colorize('✗', 'red')} ${error.field}: ${error.message}`);
    });

    warnings.forEach(warning => {
      console.log(`  ${colorize('⚠', 'yellow')} ${warning.field}: ${warning.message}`);
    });
  }
}

async function validateSingleFile(filePath: string): Promise<void> {
  if (!fs.existsSync(filePath)) {
    console.error(colorize(`Error: File does not exist: ${filePath}`, 'red'));
    process.exit(1);
  }

  console.log(colorize('📋 Validating context file...', 'cyan'));
  console.log(colorize('=' .repeat(40), 'gray'));

  const content = parseContextFile(filePath);
  if (!content) {
    console.error(colorize(`Failed to parse: ${filePath}`, 'red'));
    process.exit(1);
  }

  const result = validateContextFile(content, filePath);
  printValidationResult(result, true);

  console.log(colorize('=' .repeat(40), 'gray'));

  if (!result.valid) {
    console.log(colorize('❌ Validation failed', 'red'));
    process.exit(1);
  } else {
    const warnings = result.errors.filter(e => e.severity === 'warning').length;
    if (warnings > 0) {
      console.log(colorize(`⚠️  Passed with ${warnings} warning(s)`, 'yellow'));
    } else {
      console.log(colorize('✅ Validation passed', 'green'));
    }
  }
}

async function validateAllFiles(rootPath: string = process.cwd()): Promise<void> {

  console.log(colorize('📋 Validating all context files...', 'cyan'));
  console.log(colorize('=' .repeat(40), 'gray'));

  // Find all context files
  const contextFiles = await findContextFiles(rootPath);
  console.log(`Found ${contextFiles.length} context file(s)\n`);

  if (contextFiles.length === 0) {
    console.log(colorize('No context files found', 'yellow'));
    return;
  }

  // Validate each file
  const results: ValidationResult[] = [];
  for (const filePath of contextFiles) {
    const content = parseContextFile(filePath);
    if (!content) {
      results.push({
        file: filePath,
        valid: false,
        errors: [{
          field: 'file',
          message: 'Failed to parse YAML',
          severity: 'error'
        }]
      });
      continue;
    }

    const result = validateContextFile(content, filePath);
    results.push(result);
    printValidationResult(result);
  }

  // Check registry consistency
  console.log(`\n${colorize('🔍 Checking registry consistency...', 'cyan')}`);

  const registryPath = path.join(rootPath, '.spec', 'context-registry.yml');
  const registryErrors: string[] = [];

  if (fs.existsSync(registryPath)) {
    const registry = parseContextRegistry(registryPath);

    if (registry) {
      // Check if all files are in registry
      const registryPaths = new Set(Object.values(registry.contexts).map(c => c.source));

      for (const filePath of contextFiles) {
        const relativePath = path.relative(rootPath, filePath);
        if (!registryPaths.has(relativePath)) {
          registryErrors.push(`File not in registry: ${relativePath}`);
        }
      }

      // Check if registry references exist
      for (const [, entry] of Object.entries(registry.contexts)) {
        const fullPath = path.join(rootPath, entry.source);
        if (!fs.existsSync(fullPath)) {
          registryErrors.push(`Registry references missing file: ${entry.source}`);
        }
      }

      if (registryErrors.length === 0) {
        console.log(`${colorize('✓', 'green')} All files are in sync with registry`);
      } else {
        registryErrors.forEach(error => {
          console.log(`${colorize('✗', 'red')} ${error}`);
        });
        console.log(colorize('\nRun "pnpm sync:contexts" to update the registry', 'yellow'));
      }
    } else {
      console.log(colorize('⚠ Could not parse registry file', 'yellow'));
    }
  } else {
    console.log(colorize('⚠ Registry file not found. Run "pnpm sync:contexts" to generate it', 'yellow'));
  }

  // Print summary
  console.log(colorize('\n' + '=' .repeat(40), 'gray'));
  console.log(colorize('📊 Summary', 'cyan'));
  console.log(colorize('=' .repeat(40), 'gray'));

  const validCount = results.filter(r => r.valid).length;
  const errorCount = results.filter(r => !r.valid).length;
  const warningCount = results.reduce((acc, r) =>
    acc + r.errors.filter(e => e.severity === 'warning').length, 0);

  console.log(`Total files: ${results.length}`);
  console.log(`${colorize('✓', 'green')} Valid: ${validCount}`);
  if (errorCount > 0) {
    console.log(`${colorize('✗', 'red')} Errors: ${errorCount}`);
  }
  if (warningCount > 0) {
    console.log(`${colorize('⚠', 'yellow')} Warnings: ${warningCount}`);
  }
  if (registryErrors.length > 0) {
    console.log(`${colorize('⚠', 'yellow')} Registry issues: ${registryErrors.length}`);
  }

  // Exit with error if validation failed
  if (errorCount > 0 || registryErrors.length > 0) {
    console.log(`\n${colorize('❌ Validation failed', 'red')}`);
    process.exit(1);
  } else if (warningCount > 0) {
    console.log(`\n${colorize('⚠️  Passed with warnings', 'yellow')}`);
  } else {
    console.log(`\n${colorize('✅ All validations passed', 'green')}`);
  }
}

async function main() {
  const args = process.argv.slice(2);

  // Check for help flag
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: validate-ctx [path]');
    console.log('\nArguments:');
    console.log('  path               File or directory to validate (optional)');
    console.log('\nOptions:');
    console.log('  -h, --help         Show this help message');
    console.log('  --ci               CI mode (JSON output)');
    console.log('\nExamples:');
    console.log('  validate-ctx                              # Validate all context files in current directory');
    console.log('  validate-ctx ./apps/web                   # Validate all context files in ./apps/web');
    console.log('  validate-ctx button.ctx.yml               # Validate specific file');
    console.log('  validate-ctx /absolute/path/to/project    # Validate all files in absolute path');
    process.exit(0);
  }

  // Remove flags from args
  const fileArgs = args.filter(arg => !arg.startsWith('--') && !arg.startsWith('-'));

  try {
    if (fileArgs.length > 0) {
      const inputPath = fileArgs[0];
      const resolvedPath = path.resolve(inputPath);

      // Check if input exists
      if (!fs.existsSync(resolvedPath)) {
        console.error(colorize(`Error: Path does not exist: ${inputPath}`, 'red'));
        process.exit(1);
      }

      // Check if input is a directory or a file
      if (fs.statSync(resolvedPath).isDirectory()) {
        // Validate all files in the specified directory
        console.log(colorize(`📂 Validating directory: ${resolvedPath}`, 'gray'));
        await validateAllFiles(resolvedPath);
      } else {
        // Validate specific file
        await validateSingleFile(resolvedPath);
      }
    } else {
      // Validate all files in current directory
      await validateAllFiles(process.cwd());
    }
  } catch (error) {
    console.error(colorize(`Error: ${error}`, 'red'));
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}