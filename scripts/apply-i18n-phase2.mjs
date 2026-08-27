#!/usr/bin/env node
// ============================================================
// scripts/fix-heavy-2pa.mjs
// Corrige le bouton "lourde" : 2 PA -> ui.combat.ap
// et remplace le tag ligne par ui.combat.heavyLine.
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

const legacyPath = path.join(root, 'src', 'legacy.js');
const frUiPath = path.join(root, 'src', 'locales', 'fr', 'ui.js');
const enUiPath = path.join(root, 'src', 'locales', 'en', 'ui.js');

const changes = [];
const warnings = [];

function backup(filePath) {
  if (!existsSync(filePath)) return;
  copyFileSync(filePath, `${filePath}.bak`);
}

function readFile(filePath) {
  if (!existsSync(filePath)) {
    warnings.push(`Fichier introuvable : ${filePath}`);
    return null;
  }

  return readFileSync(filePath, 'utf8');
}

function ensureKeys(filePath, label, lines) {
  if (!existsSync(filePath)) {
    warnings.push(`Fichier manquant : ${filePath}`);
    return;
  }

  backup(filePath);

  let content = readFileSync(filePath, 'utf8');
  const missing = [];

  for (const line of lines) {
    const m = line.match(/^\s*"([^"]+)"/);
    if (!m) continue;

    const key = m[1];

    if (!content.includes(`"${key}"`)) {
      missing.push(line);
    }
  }

  if (!missing.length) {
    changes.push(`[${label}] clés déjà présentes`);
    return;
  }

  const idx = content.lastIndexOf('}');

  if (idx === -1) {
    warnings.push(`[${label}] accolade fermante introuvable`);
    return;
  }

  const before = content.slice(0, idx);
  const trimmed = before.trimEnd();

  let suffix = '';

  if (!before.endsWith('\n')) {
    suffix += '\n';
  }

  if (trimmed.length && !trimmed.endsWith(',')) {
    suffix += ',\n';
  }

  suffix += missing.join('\n');
  suffix += '\n';

  content = before + suffix + content.slice(idx);
  writeFileSync(filePath, content, 'utf8');

  changes.push(`[${label}] ajout de ${missing.length} clé(s)`);
}

// ------------------------------------------------------------
// 1. Sécuriser les clés nécessaires
// ------------------------------------------------------------

ensureKeys(frUiPath, 'src/locales/fr/ui.js', [
  `"ui.combat.ap": "{n} PA",`,
  `"ui.combat.heavyLine": " · ligne",`,
  `"ui.combat.heavySingle": " · ×1.9",`,
]);

ensureKeys(enUiPath, 'src/locales/en/ui.js', [
  `"ui.combat.ap": "{n} AP",`,
  `"ui.combat.heavyLine": " · line",`,
  `"ui.combat.heavySingle": " · ×1.9",`,
]);

// ------------------------------------------------------------
// 2. Corriger le bouton lourde dans legacy.js
// ------------------------------------------------------------

backup(legacyPath);

let legacy = readFile(legacyPath);

if (legacy === null) {
  console.error('✖ Impossible de lire src/legacy.js');
  process.exit(1);
}

const guard = "t('ui.combat.ap',{n:2})";

const newHeavy =
  "<small>${t('ui.combat.ap',{n:2})}${aoeL?t('ui.combat.heavyLine'):t('ui.combat.heavySingle')}</small>";

if (legacy.includes(guard)) {
  changes.push('[src/legacy.js] déjà appliqué : heavy 2 PA');
} else {
  const variants = [
    // Cas Phase 1 déjà appliqué.
    "<small>2 PA${aoeL?(t('ui.combat.lineTag')):' · ×1.9'}</small>",

    // Cas Phase 1 sans parenthèses autour du t().
    "<small>2 PA${aoeL?t('ui.combat.lineTag'):' · ×1.9'}</small>",

    // Cas original avec traduction inline.
    "<small>2 PA${aoeL?(t({fr:' · ligne',en:' · line'})):' · ×1.9'}</small>",

    // Variante originale sans parenthèses autour du t().
    "<small>2 PA${aoeL?t({fr:' · ligne',en:' · line'}):' · ×1.9'}</small>",
  ];

  let applied = false;

  for (const old of variants) {
    if (legacy.includes(old)) {
      legacy = legacy.split(old).join(newHeavy);
      applied = true;
      changes.push('[src/legacy.js] appliqué : heavy 2 PA');
      break;
    }
  }

  if (!applied) {
    warnings.push('[src/legacy.js] motif introuvable : heavy 2 PA');
  } else {
    writeFileSync(legacyPath, legacy, 'utf8');
  }
}

// ------------------------------------------------------------
// Rapport
// ------------------------------------------------------------

console.log('--- fix-heavy-2pa ---');

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
  console.log('\n✅ Bouton lourde corrigé.');
}