#!/usr/bin/env node
// ============================================================
// scripts/apply-i18n-cleanup.mjs
// Applique les corrections i18n sur index.html et src/legacy.js.
// Ne touche pas au CSS.
// ============================================================

import {
  readFileSync,
  writeFileSync,
  existsSync,
  copyFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const indexPath = path.join(root, 'index.html');
const legacyPath = path.join(root, 'src', 'legacy.js');

const changes = [];
const warnings = [];

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}

function backup(filePath) {
  if (!existsSync(filePath)) return;

  const backupPath = `${filePath}.bak`;
  copyFileSync(filePath, backupPath);
  changes.push(`Backup créé : ${backupPath}`);
}

function readFile(filePath) {
  if (!existsSync(filePath)) {
    fail(`Fichier introuvable : ${filePath}`);
  }

  return readFileSync(filePath, 'utf8');
}

function replaceRegex(content, filePath, regex, replacement, id) {
  regex.lastIndex = 0;

  if (!regex.test(content)) {
    warnings.push(`[${filePath}] motif introuvable : ${id}`);
    return content;
  }

  regex.lastIndex = 0;
  changes.push(`[${filePath}] appliqué : ${id}`);

  return content.replace(regex, replacement);
}

backup(indexPath);
backup(legacyPath);

let html = readFile(indexPath);
let legacy = readFile(legacyPath);

// ============================================================
// INDEX.HTML
// ============================================================

if (html.includes('data-i18n="ui.app.title"')) {
  changes.push('[index.html] déjà appliqué : title data-i18n');
} else {
  html = replaceRegex(
    html,
    'index.html',
    /<title>([\s\S]*?)<\/title>/i,
    '<title data-i18n="ui.app.title">$1</title>',
    'title data-i18n'
  );
}

if (html.includes('data-i18n="ui.splash.title"')) {
  changes.push('[index.html] déjà appliqué : splash title data-i18n');
} else {
  html = replaceRegex(
    html,
    'index.html',
    /<h1>\s*(LES TERRES MORNES)\s*<\/h1>/,
    '<h1 data-i18n="ui.splash.title">$1</h1>',
    'splash title data-i18n'
  );
}

if (html.includes('data-i18n="ui.splash.subtitle"')) {
  changes.push('[index.html] déjà appliqué : splash subtitle data-i18n');
} else {
  html = replaceRegex(
    html,
    'index.html',
    /<p>\s*(le continent s['’]éveille…)\s*<\/p>/u,
    '<p data-i18n="ui.splash.subtitle">$1</p>',
    'splash subtitle data-i18n'
  );
}

if (html.includes('data-i18n="ui.error.persist"')) {
  changes.push('[index.html] déjà appliqué : error persist data-i18n');
} else {
  html = replaceRegex(
    html,
    'index.html',
    /<span>\s*(Si ce parchemin persiste, le moteur a trébuché\.)\s*<\/span>/,
    '<span data-i18n="ui.error.persist">$1</span>',
    'error persist data-i18n'
  );
}

if (html.includes('ui.error.crashPrefix')) {
  changes.push('[index.html] déjà appliqué : error crash prefix i18n');
} else {
  html = replaceRegex(
    html,
    'index.html',
    /(['"])Le moteur a trébuché : \1/g,
    `(typeof t==='function'?t('ui.error.crashPrefix'):$1Le moteur a trébuché : $1)`,
    'error crash prefix i18n'
  );
}

// ============================================================
// SRC/LEGACY.JS
// ============================================================

const legacyRegexReplacements = [
  {
    id: 'genMap village names',
    guard: "const noms={0:'w.village.v0.name'",
    regex:
      /const\s+noms\s*=\s*\{\s*0\s*:\s*\{\s*fr\s*:\s*"Bois-aux-Pendus"\s*,\s*en\s*:\s*"Hanged Man's Wood"\s*\}\s*,\s*5\s*:\s*\{\s*fr\s*:\s*"Mare-aux-Corbeaux"\s*,\s*en\s*:\s*"Crow's Mire"\s*\}\s*,\s*10\s*:\s*\{\s*fr\s*:\s*"Le-Rocher-Noir"\s*,\s*en\s*:\s*"Le-Rocher-Noir"\s*\}\s*\}\s*;/u,
    replacement:
      "const noms={0:'w.village.v0.name',5:'w.village.v5.name',10:'w.village.v10.name'};",
  },
  {
    id: 'hud signe repos',
    guard: "t('ui.hud.signRest',{cd:C.signeCd})",
    regex:
      /if\s*\(\s*C\.signeCd\s*>\s*0\s*\)\s*h2\.push\(\s*t\(\{\s*fr\s*:\s*'✦ repos '\s*\+\s*C\.signeCd\s*,\s*en\s*:\s*'✦ rest '\s*\+\s*C\.signeCd\s*\}\)\s*\)\s*;/u,
    replacement:
      "if(C.signeCd>0)h2.push(t('ui.hud.signRest',{cd:C.signeCd}));",
  },
  {
    id: 'hud off-balance',
    guard: "t('ui.hud.offBalance')",
    regex:
      /if\s*\(\s*C\.hst\.deséquilibre\s*>\s*0\s*\)\s*h2\.push\(\s*t\(\{\s*fr\s*:\s*'🌀 déséquilibré'\s*,\s*en\s*:\s*'🌀 off-balance'\s*\}\)\s*\)\s*;/u,
    replacement:
      "if(C.hst.deséquilibre>0)h2.push(t('ui.hud.offBalance'));",
  },
  {
    id: 'combat line tag',
    guard: "t('ui.combat.lineTag')",
    regex:
      /t\(\{\s*fr\s*:\s*' · ligne'\s*,\s*en\s*:\s*' · line'\s*\}\)/g,
    replacement: "t('ui.combat.lineTag')",
  },
  {
    id: 'combat sign cooldown',
    guard: "t('ui.combat.signCooldown',{cd:C.signeCd})",
    regex:
      /t\(\{\s*fr\s*:\s*'repos '\s*\+\s*C\.signeCd\s*\+\s*' tour\(s\)'\s*,\s*en\s*:\s*'resting '\s*\+\s*C\.signeCd\s*\+\s*' turn\(s\)'\s*\}\)/g,
    replacement: "t('ui.combat.signCooldown',{cd:C.signeCd})",
  },
  {
    id: 'fx off-balance',
    guard: "t('ui.fx.offBalance')",
    regex:
      /s\.textContent\s*=\s*t\(\{\s*fr\s*:\s*'🌀 DÉSÉQUILIBRÉ'\s*,\s*en\s*:\s*'🌀 OFF-BALANCE'\s*\}\)\s*;/u,
    replacement: "s.textContent=t('ui.fx.offBalance');",
  },
];

for (const item of legacyRegexReplacements) {
  if (legacy.includes(item.guard)) {
    changes.push(`[src/legacy.js] déjà appliqué : ${item.id}`);
    continue;
  }

  legacy = replaceRegex(
    legacy,
    'src/legacy.js',
    item.regex,
    item.replacement,
    item.id
  );
}

// ============================================================
// ÉCRITURE
// ============================================================

writeFileSync(indexPath, html, 'utf8');
writeFileSync(legacyPath, legacy, 'utf8');

console.log('--- apply-i18n-cleanup ---');

for (const change of changes) {
  console.log(`✔ ${change}`);
}

if (warnings.length) {
  console.warn('');

  for (const warning of warnings) {
    console.warn(`⚠ ${warning}`);
  }

  console.warn(`\n${warnings.length} avertissement(s).`);
  process.exitCode = 1;
} else {
  console.log('\n✅ index.html et src/legacy.js ont été mis à jour.');
}