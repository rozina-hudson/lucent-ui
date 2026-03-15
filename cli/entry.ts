#!/usr/bin/env node
/**
 * lucent-ui CLI
 *
 * Usage:
 *   npx lucent-ui init       — Interactive preset setup
 *   npx lucent-ui manifest   — Alias for lucent-manifest (see lucent-manifest --help)
 */

const command = process.argv[2];

switch (command) {
  case 'init': {
    const { runInit } = await import('./init/index.js');
    await runInit();
    break;
  }
  case 'manifest': {
    // Delegate to the existing manifest CLI by re-running it
    await import('./index.js');
    break;
  }
  default:
    console.log('lucent-ui — CLI tools for Lucent UI\n');
    console.log('Commands:');
    console.log('  init       Interactive design preset setup');
    console.log('  manifest   Generate component manifests from Figma\n');
    console.log('Usage: npx lucent-ui <command>');
    if (command) {
      console.error(`\nUnknown command: "${command}"`);
      process.exit(1);
    }
}
