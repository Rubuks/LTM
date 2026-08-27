#!/usr/bin/env node
// ============================================================
// scripts/fix-genmap-villages.mjs
// Corrige uniquement le remplacement des noms de villages
// dans genMap() si le script précédent ne les a pas trouvés.
// ============================================================

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const legacyPath = path.join(root, 'src', 'legacy.js');

let legacy = readFileSync(legacyPath, 'utf8');

const guard = "const noms={0:'w.village.v0.name'";

if (legacy.includes(guard)) {
  console.log('✔ genMap village names déjà appliqué.');
  process.exit(0);
}

const regex =
  /const\s+noms\s*=\s*\{\s*0\s*:\s*\{\s*fr\s*:\s*"Bois-aux-Pendus"\s*,\s*en\s*:\s*"Hanged Man[’']s Wood"\s*\}\s*,\s*5\s*:\s*\{\s*fr\s*:\s*"Mare-aux-Corbeaux"\s*,\s*en\s*:\s*"Crow[’']s Mire"\s*\}\s*,\s*10\s*:\s*\{\s*fr\s*:\s*"Le-Rocher-Noir"\s*,\s*en\s*:\s*"Le-Rocher-Noir"\s*\}\s*\}\s*;/u;

const replacement =
  "const noms={0:'w.village.v0.name',5:'w.village.v5.name',10:'w.village.v10.name'};";

regex.lastIndex = 0;

if (!regex.test(legacy)) {
  console.error('✖ Motif genMap introuvable. Vérifie la ligne const noms dans src/legacy.js.');
  process.exit(1);
}

legacy = legacy.replace(regex, replacement);
writeFileSync(legacyPath, legacy, 'utf8');

console.log('✔ genMap village names corrigé.');