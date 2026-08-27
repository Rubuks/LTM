#!/usr/bin/env node
// ============================================================
// scripts/fix-phase4-chained-fr.mjs
// Corrige la ligne FR de w.event.chained.c0eff (récompense +15 or),
// quel que soit le type d'apostrophe présent dans le fichier.
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
const p = path.join(root, 'src', 'locales', 'fr', 'world.js');

if (!existsSync(p)) {
  console.error(`✖ Fichier introuvable : ${p}`);
  process.exit(1);
}

copyFileSync(p, `${p}.bak`);

let c = readFileSync(p, 'utf8');

// Matche la valeur actuelle de la clé, peu importe son contenu.
const re = /"w\.event\.chained\.c0eff"\s*:\s*"[^"]*",?/;

if (!re.test(c)) {
  console.error('✖ Clé w.event.chained.c0eff introuvable dans fr/world.js');
  process.exit(1);
}

c = c.replace(
  re,
  `"w.event.chained.c0eff": "La bête s’effondre sans un cri de plus. Vous récupérez le collier de cuir et la chaîne du piège — un maroquinier du prochain village en donnera bien <b>15 couronnes</b>. Le village en aval dormira tranquille — grâce à vous, cette fois.",`
);

writeFileSync(p, c, 'utf8');

console.log('✔ [fr/world] appliqué : chained c0 récompense');