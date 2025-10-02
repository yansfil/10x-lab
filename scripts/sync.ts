#!/usr/bin/env node

import { syncLocalContexts } from './lib/localRegistry';
import { syncGlobalContexts } from './lib/globalRegistry';

async function main() {
  try {
    const args = process.argv.slice(2);
    const target = args[0]; // 'local', 'global', or path for local

    // Determine what to sync
    if (target === 'global') {
      // Global sync only
      console.log('🌐 Syncing global contexts...\n');
      const result = await syncGlobalContexts();
      if (!result.success) {
        process.exit(1);
      }
    } else if (target === 'local') {
      // Local sync only
      console.log('📦 Syncing local contexts...\n');
      const result = await syncLocalContexts('.');
      if (!result.success) {
        process.exit(1);
      }
    } else if (!target) {
      // No argument: sync both local and global
      console.log('📦 Syncing local contexts...\n');
      const localResult = await syncLocalContexts('.');
      if (!localResult.success) {
        process.exit(1);
      }

      console.log('\n🌐 Syncing global contexts...\n');
      const globalResult = await syncGlobalContexts();
      if (!globalResult.success) {
        process.exit(1);
      }
    } else {
      // Assume target is a path for local sync
      console.log('📦 Syncing local contexts...\n');
      const result = await syncLocalContexts(target);
      if (!result.success) {
        process.exit(1);
      }
    }

    console.log('\n✅ Sync completed successfully!');
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { syncLocalContexts, syncGlobalContexts };