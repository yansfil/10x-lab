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

// Global Context Registry Types

export interface GlobalContextFile {
  path: string;
  checksum: string;
  last_modified: string;
  ai_comment?: string | null;
}

export interface GlobalContextFolder {
  folder_checksum: string;
  file_count: number;
  last_file_modified: string;
  ai_comment?: string | null;
  files: GlobalContextFile[];
}

export interface GlobalContextRegistry {
  meta: {
    version: string;
    last_synced: string;
    last_ai_update?: string | null;
  };
  [folderName: string]: GlobalContextFolder | GlobalContextRegistry['meta'];
}

export interface SyncResult {
  success: boolean;
  changes?: string[];
  registry?: any;
  needsAnnotation?: AnnotationNeeded[];
  validation?: string[];
}

export interface AnnotationNeeded {
  type: 'file' | 'folder';
  path: string;
  reason?: 'new' | 'content_changed' | 'missing_comment';
}