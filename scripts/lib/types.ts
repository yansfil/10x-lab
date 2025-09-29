export interface ContextFileMeta {
  version?: string;
  target: string;
  type?: string;
  category?: string;
  status?: string;
}

export interface ContextFile {
  meta: ContextFileMeta;
  what: string;
  description?: string;
  use_when: string[];
  do_not_use_when: string[];
  dependencies?: string[];
  constraints?: string | string[];
  notes?: string | string[];
  future?: string[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  file: string;
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationSummary {
  totalFiles: number;
  validFiles: number;
  errorFiles: number;
  warningCount: number;
  registryErrors: string[];
}

export interface ContextRegistryEntry {
  what: string;
  use_when?: string[];
  category?: string;
  source: string;
  hash: string;
}

export interface ContextRegistry {
  meta: {
    version: string;
    total_contexts: number;
    last_sync: string;
    generation_command: string;
  };
  contexts: Record<string, ContextRegistryEntry>;
  indexes: {
    by_category: Record<string, string[]>;
    entry_points: string[];
  };
  validation: {
    missing_contexts: string[];
    errors: string[];
  };
}