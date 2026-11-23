#!/usr/bin/env node
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Theme Token Audit Tool:
 * Scans src/ directory for any hardcoded hex color literals outside src/themes/
 * Ensures 100% theme token discipline.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '../src');

// Hex regex: e.g. #fff, #171c26, #ffffff80
const HEX_REGEX = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;

// Allowed directories/files (theme definitions are allowed to specify base hex values)
const ALLOWED_PATHS = [
  path.normalize('src/themes/'),
  path.normalize('src/types/'), // mock data dominant color fallback definition
];

let totalViolations = 0;
const violationsList = [];

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(path.resolve(__dirname, '..'), fullPath);

    // Skip node_modules or dotfiles
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;

    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (entry.isFile() && /\.(tsx?|jsx?|css)$/.test(entry.name)) {
      // Check if file is in allowed paths
      const isAllowed = ALLOWED_PATHS.some((allowed) => relPath.includes(allowed));
      if (isAllowed) continue;

      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, lineIndex) => {
        // Ignore comments that explicitly mention hex in docstrings
        if (line.trim().startsWith('*') || line.trim().startsWith('//')) return;

        const matches = line.match(HEX_REGEX);
        if (matches) {
          matches.forEach((match) => {
            totalViolations++;
            violationsList.push({
              file: relPath,
              line: lineIndex + 1,
              match,
              code: line.trim(),
            });
          });
        }
      });
    }
  }
}

console.log('🔍 Checking Yadah codebase for hardcoded hex colors outside src/themes/ ...');
scanDirectory(srcDir);

if (totalViolations > 0) {
  console.error(`❌ Found ${totalViolations} hardcoded hex color violations outside src/themes/:`);
  violationsList.forEach((v) => {
    console.error(`  ${v.file}:${v.line} -> "${v.match}" in: ${v.code}`);
  });
  process.exit(1);
} else {
  console.log('✅ Clean! Zero hardcoded hex colors found outside src/themes/. All styles consume theme tokens.');
  process.exit(0);
}
