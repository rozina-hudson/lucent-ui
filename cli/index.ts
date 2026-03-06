#!/usr/bin/env node
/**
 * lucent-manifest init
 *
 * Usage:
 *   npx lucent-manifest init --figma-token <token> --file-key <key> [options]
 *   npx lucent-manifest init --template                              (manual fallback)
 *
 * Options:
 *   --figma-token  <token>   Figma personal access token
 *   --file-key     <key>     Figma file key (from the file URL)
 *   --light-mode   <name>    Mode name to treat as light theme (default: "light")
 *   --dark-mode    <name>    Mode name to treat as dark theme  (default: "dark")
 *   --name         <name>    Design system name written into the manifest
 *   --out          <path>    Output file path (default: lucent.manifest.json)
 *   --template               Write an empty JSON template instead of fetching Figma
 */

import fs from 'node:fs';
import path from 'node:path';
import { fetchFigmaVariables } from './figma.js';
import { mapFigmaToTokens } from './mapper.js';
import type { LucentDesignManifest } from './types.js';

// ─── Arg parsing ──────────────────────────────────────────────────────────────

function parseArgs(argv: string[]): Record<string, string | true> {
  const args: Record<string, string | true> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith('--')) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    }
  }
  return args;
}

function required(args: Record<string, string | true>, key: string): string {
  const v = args[key];
  if (!v || v === true) {
    console.error(`Error: --${key} is required.`);
    process.exit(1);
  }
  return v;
}

function optional(args: Record<string, string | true>, key: string, fallback: string): string {
  const v = args[key];
  return typeof v === 'string' ? v : fallback;
}

// ─── Template fallback ────────────────────────────────────────────────────────

function writeTemplate(outPath: string) {
  const templateSrc = new URL('./template.manifest.json', import.meta.url);
  fs.copyFileSync(templateSrc, outPath);
  console.log(`Template written to ${outPath}`);
  console.log('Fill in the token values and load it with LucentProvider.');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const outPath = path.resolve(optional(args, 'out', 'lucent.manifest.json'));

  if (args['template']) {
    writeTemplate(outPath);
    return;
  }

  const figmaToken = required(args, 'figma-token');
  const fileKey = required(args, 'file-key');
  const lightModeName = optional(args, 'light-mode', 'light');
  const darkModeName = optional(args, 'dark-mode', 'dark');
  const systemName = optional(args, 'name', 'My Design System');

  console.log(`Fetching Figma variables for file ${fileKey}…`);
  const response = await fetchFigmaVariables(figmaToken, fileKey);

  const manifest: LucentDesignManifest = {
    version: '1.0',
    name: systemName,
    tokens: {},
  };

  // Light theme
  try {
    const { tokens: lightTokens, unmapped: lightUnmapped } = mapFigmaToTokens(response, lightModeName);
    manifest.tokens.light = lightTokens;
    console.log(`Light theme: mapped ${Object.keys(lightTokens).length} token(s).`);
    if (lightUnmapped.length > 0) {
      console.warn(`  ${lightUnmapped.length} variable(s) didn't match a Lucent token key and were skipped:`);
      for (const u of lightUnmapped) {
        console.warn(`    "${u.figmaName}" → candidate "${u.candidateKey}" (value: ${u.value})`);
      }
    }
  } catch (err) {
    console.warn(`Skipping light theme: ${(err as Error).message}`);
  }

  // Dark theme
  try {
    const { tokens: darkTokens, unmapped: darkUnmapped } = mapFigmaToTokens(response, darkModeName);
    manifest.tokens.dark = darkTokens;
    console.log(`Dark theme: mapped ${Object.keys(darkTokens).length} token(s).`);
    if (darkUnmapped.length > 0) {
      console.warn(`  ${darkUnmapped.length} variable(s) didn't match a Lucent token key and were skipped:`);
      for (const u of darkUnmapped) {
        console.warn(`    "${u.figmaName}" → candidate "${u.candidateKey}" (value: ${u.value})`);
      }
    }
  } catch (err) {
    console.warn(`Skipping dark theme: ${(err as Error).message}`);
  }

  if (!manifest.tokens.light && !manifest.tokens.dark) {
    console.error('No tokens were mapped. Check your --light-mode and --dark-mode names match the Figma file.');
    process.exit(1);
  }

  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(`\nManifest written to ${outPath}`);
}

main().catch(err => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
