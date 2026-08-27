#!/usr/bin/env node
// ============================================================
// scripts/check-data.mjs
// Vérifie la cohérence des données de contenu.
// Ne modifie aucun fichier, ne touche pas au CSS.
// ============================================================

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const errors = [];
const warnings = [];

const locales = {
  fr: {},
  en: {},
};

const seenLocaleKeys = {
  fr: new Set(),
  en: new Set(),
};

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function flatten(value, basePath, out) {
  if (value === null || value === undefined) {
    if (basePath) out[basePath] = '';
    return;
  }

  if (typeof value === 'string') {
    if (basePath) out[basePath] = value;
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      flatten(item, `${basePath}[${index}]`, out);
    });
    return;
  }

  if (isPlainObject(value)) {
    for (const [key, item] of Object.entries(value)) {
      const nextPath = basePath ? `${basePath}.${key}` : key;
      flatten(item, nextPath, out);
    }
    return;
  }

  if (basePath) out[basePath] = String(value);
}

function registerLocale(lang, entries) {
  if (!entries || typeof entries !== 'object') return;

  if (!locales[lang]) locales[lang] = {};
  if (!seenLocaleKeys[lang]) seenLocaleKeys[lang] = new Set();

  const temp = {};
  flatten(entries, '', temp);

  for (const key of Object.keys(temp)) {
    if (seenLocaleKeys[lang].has(key)) {
      warnings.push(`[locales:${lang}] clé potentiellement dupliquée : ${key}`);
    }

    seenLocaleKeys[lang].add(key);
  }

  Object.assign(locales[lang], entries);
}

const sandbox = vm.createContext({
  console,
  Math,
  JSON,
  Object,
  Array,
  String,
  Number,
  Boolean,
  RegExp,
  Date,
  Set,
  Map,
  Symbol,
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
  registerLocale,
});

function readFile(relPath) {
  const abs = path.join(root, relPath);

  if (!existsSync(abs)) {
    fail(`Fichier introuvable : ${relPath}`);
  }

  return readFileSync(abs, 'utf8');
}

function runFile(relPath) {
  const code = readFile(relPath);
  vm.runInContext(code, sandbox, { filename: relPath });
}

function runAndExpose(relPath, expose) {
  const source = readFile(relPath);
  const code = `${source}\n;globalThis.__OUT__ = {${expose}};`;

  sandbox.__OUT__ = undefined;

  vm.runInContext(code, sandbox, { filename: relPath });

  const out = sandbox.__OUT__;
  delete sandbox.__OUT__;

  if (!out) {
    fail(`Impossible de lire (${expose}) depuis ${relPath}`);
  }

  return out;
}

function listJsFiles(dir, rel = '') {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    const nextRel = rel ? `${rel}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      files.push(...listJsFiles(abs, nextRel));
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push({ abs, rel: nextRel });
    }
  }

  return files.sort((a, b) => a.rel.localeCompare(b.rel));
}

// ============================================================
// Chargement des locales
// ============================================================

for (const lang of ['fr', 'en']) {
  const localeDir = path.join(root, 'src', 'locales', lang);

  if (!existsSync(localeDir)) {
    fail(`Dossier manquant : src/locales/${lang}`);
  }

  const files = listJsFiles(localeDir);

  if (!files.length) {
    fail(`Aucun fichier .js trouvé dans src/locales/${lang}`);
  }

  for (const file of files) {
    runFile(path.join('src', 'locales', lang, file.rel));
  }
}

const flat = {
  fr: {},
  en: {},
};

for (const lang of ['fr', 'en']) {
  flatten(locales[lang] || {}, '', flat[lang]);
}

function hasKey(lang, key) {
  return Object.prototype.hasOwnProperty.call(flat[lang] || {}, key);
}

function checkKey(key, context) {
  if (!key || typeof key !== 'string') return;

  if (!hasKey('fr', key)) {
    errors.push(`[${context}] clé FR manquante : ${key}`);
  }

  if (!hasKey('en', key)) {
    errors.push(`[${context}] clé EN manquante : ${key}`);
  }
}

// ============================================================
// Chargement des données
// ============================================================

const ui = runAndExpose(
  path.join('src', 'data', 'ui.js'),
  'STLAB, POI, CHIPS, FXW'
);

const bestiary = runAndExpose(
  path.join('src', 'data', 'bestiary.js'),
  'MONSTRES, TROPHIES, CATNOMS, HUILES'
);

const items = runAndExpose(
  path.join('src', 'data', 'items.js'),
  'OBJETS, EFFECTS'
);

const events = runAndExpose(
  path.join('src', 'data', 'events.js'),
  'EVENTS'
);

// ============================================================
// Lecture de IMG depuis legacy.js (pour vérifications d'images)
// ============================================================

let IMG = null;

try {
  const legacySource = readFile(path.join('src', 'legacy.js'));
  const imgMatch = legacySource.match(/const IMG=(\{[\s\S]*?\n\});/);

  if (imgMatch) {
    IMG = vm.runInContext(`(${imgMatch[1]})`, sandbox);
  } else {
    warnings.push('[src/legacy.js] bloc IMG introuvable');
  }
} catch (err) {
  warnings.push(`[src/legacy.js] impossible de lire IMG : ${err.message}`);
}

// ============================================================
// Vérification de src/data/ui.js
// ============================================================

for (const [key, value] of Object.entries(ui.STLAB)) {
  checkKey(value, `STLAB.${key}`);
}

ui.POI.forEach((key, index) => {
  checkKey(key, `POI[${index}]`);
});

function checkChipValue(value, label) {
  if (typeof value === 'string') {
    checkKey(value, label);
    return;
  }

  if (isPlainObject(value)) {
    for (const [k, v] of Object.entries(value)) {
      checkChipValue(v, `${label}.${k}`);
    }
  }
}

for (const [key, value] of Object.entries(ui.CHIPS)) {
  checkChipValue(value, `CHIPS.${key}`);
}

for (const [key, value] of Object.entries(ui.FXW)) {
  checkKey(value, `FXW.${key}`);
}

// ============================================================
// Vérification du bestiaire
// ============================================================

const SIGNS = new Set([
  'souffle',
  'embrasement',
  'egide',
  'sceau',
  'murmure',
]);

const INTENT_FX = new Set([
  'poison',
  'peur',
  'sonne',
  'brume',
]);

const SPECIAL_FX = new Set([
  'devour',
  'rally',
  'swoop',
  'brume',
]);

function checkIntent(intent, label) {
  if (!intent) {
    errors.push(`[${label}] intent vide`);
    return;
  }

  if (!intent.n) {
    errors.push(`[${label}] intent sans clé n`);
  } else {
    checkKey(intent.n, `${label}.n`);
  }

  if (intent.fx && !INTENT_FX.has(intent.fx)) {
    warnings.push(`[${label}] fx inconnu : ${intent.fx}`);
  }
}

for (const [id, m] of Object.entries(bestiary.MONSTRES)) {
  const label = `MONSTRES.${id}`;

  if (!m.n) {
    errors.push(`[${label}] champ n manquant`);
  } else {
    checkKey(m.n, `${label}.n`);
  }

  if (!m.txt) {
    errors.push(`[${label}] champ txt manquant`);
  } else {
    checkKey(m.txt, `${label}.txt`);
  }

  if (!m.cat) {
    errors.push(`[${label}] champ cat manquant`);
  } else if (!bestiary.CATNOMS[m.cat]) {
    errors.push(`[${label}] catégorie inconnue : ${m.cat}`);
  } else {
    checkKey(bestiary.CATNOMS[m.cat], `${label}.cat`);
  }

  if (m.faib !== null && m.faib !== undefined && !SIGNS.has(m.faib)) {
    errors.push(`[${label}] faiblesse inconnue : ${m.faib}`);
  }

  if (m.trophy && !bestiary.TROPHIES[m.trophy]) {
    errors.push(`[${label}] trophée inconnu : ${m.trophy}`);
  }

  if (m.special) {
    if (m.special.n) {
      checkKey(m.special.n, `${label}.special.n`);
    } else {
      warnings.push(`[${label}] special sans clé n`);
    }

    if (m.special.fx && !SPECIAL_FX.has(m.special.fx)) {
      warnings.push(`[${label}] special fx inconnu : ${m.special.fx}`);
    }
  }

  if (!Array.isArray(m.pv) || m.pv.length !== 2) {
    errors.push(`[${label}] pv invalide`);
  }

  if (!Array.isArray(m.atq) || m.atq.length !== 2) {
    errors.push(`[${label}] atq invalide`);
  }

  if (m.ints) {
    m.ints.forEach((intent, index) => {
      checkIntent(intent, `${label}.ints[${index}]`);
    });
  } else if (!m.boss) {
    errors.push(`[${label}] ints manquant`);
  }

  if (m.intsVol) {
    m.intsVol.forEach((intent, index) => {
      checkIntent(intent, `${label}.intsVol[${index}]`);
    });
  }

  if (m.intsSol) {
    m.intsSol.forEach((intent, index) => {
      checkIntent(intent, `${label}.intsSol[${index}]`);
    });
  }

  if (m.boss && !m.ints && !m.intsVol && !m.intsSol) {
    errors.push(`[${label}] boss sans intents`);
  }
}

for (const [key, value] of Object.entries(bestiary.CATNOMS)) {
  checkKey(value, `CATNOMS.${key}`);
}

for (const [key, value] of Object.entries(bestiary.HUILES)) {
  checkKey(value, `HUILES.${key}`);
}

for (const [id, trophy] of Object.entries(bestiary.TROPHIES)) {
  const label = `TROPHIES.${id}`;

  if (!trophy.n) {
    errors.push(`[${label}] champ n manquant`);
  } else {
    checkKey(trophy.n, `${label}.n`);
  }

  if (!trophy.desc) {
    errors.push(`[${label}] champ desc manquant`);
  } else {
    checkKey(trophy.desc, `${label}.desc`);
  }

  if (!trophy.voice) {
    errors.push(`[${label}] champ voice manquant`);
  } else {
    checkKey(trophy.voice, `${label}.voice`);
  }

  if (!trophy.bonus) {
    warnings.push(`[${label}] aucun bonus défini`);
  }

  if (trophy.img && IMG && IMG.item && !IMG.item[trophy.img]) {
    warnings.push(`[${label}] img inconnue dans IMG.item : ${trophy.img}`);
  }
}

// ============================================================
// Vérification des objets
// ============================================================

const CLASSES = new Set([
  'loup',
  'tisseuse',
  'mercenaire',
  'pisteuse',
]);

const KINDS = new Set([
  'combat',
  'quest',
  'trophy',
]);

for (const [id, it] of Object.entries(items.OBJETS)) {
  const label = `OBJETS.${id}`;

  if (!it.n) {
    errors.push(`[${label}] champ n manquant`);
  } else {
    checkKey(it.n, `${label}.n`);
  }

  if (!it.d) {
    errors.push(`[${label}] champ d manquant`);
  } else {
    checkKey(it.d, `${label}.d`);
  }

  if (it.cls && !CLASSES.has(it.cls)) {
    errors.push(`[${label}] classe inconnue : ${it.cls}`);
  }

  if (it.kind && !KINDS.has(it.kind)) {
    warnings.push(`[${label}] kind inconnu : ${it.kind}`);
  }

  if (!it.cls && it.kind !== 'quest') {
    warnings.push(`[${label}] pas de classe définie (hors objet de quête ?)`);
  }

  if (it.effect && !items.EFFECTS[it.effect]) {
    errors.push(`[${label}] effect inconnu : ${it.effect}`);
  }

  if (it.kind !== 'quest' && typeof it.use !== 'function' && !it.effect) {
    warnings.push(`[${label}] pas de fonction use ni d’effect`);
  }

  if (it.kind !== 'quest' && typeof it.p !== 'number') {
    warnings.push(`[${label}] pas de prix p défini`);
  }

  if (it.img && IMG && IMG.item && !IMG.item[it.img]) {
    warnings.push(`[${label}] img inconnue dans IMG.item : ${it.img}`);
  }
}

// ============================================================
// Vérification des événements
// ============================================================

const seenEvents = new Set();

events.EVENTS.forEach((ev, index) => {
  const label = `EVENTS[${index}:${ev.titre || 'sans-titre'}]`;

  if (!ev.titre) {
    errors.push(`[${label}] champ titre manquant`);
  } else {
    if (seenEvents.has(ev.titre)) {
      warnings.push(`[${label}] titre déjà vu : ${ev.titre}`);
    }

    seenEvents.add(ev.titre);
    checkKey(ev.titre, `${label}.titre`);
  }

  if (!ev.txt) {
    errors.push(`[${label}] champ txt manquant`);
  } else {
    checkKey(ev.txt, `${label}.txt`);
  }

  if (ev.npc && IMG && IMG.npc && !IMG.npc[ev.npc]) {
    warnings.push(`[${label}] npc inconnu dans IMG.npc : ${ev.npc}`);
  }

  (ev.choix || []).forEach((choice, choiceIndex) => {
    const choiceLabel = `${label}.choix[${choiceIndex}]`;

    if (!choice.t) {
      errors.push(`[${choiceLabel}] champ t manquant`);
    } else {
      checkKey(choice.t, `${choiceLabel}.t`);
    }

    if (!choice.d) {
      errors.push(`[${choiceLabel}] champ d manquant`);
    } else {
      checkKey(choice.d, `${choiceLabel}.d`);
    }

    if (choice.req && !items.OBJETS[choice.req]) {
      errors.push(`[${choiceLabel}] req objet inconnu : ${choice.req}`);
    }

    if (choice.consume && !items.OBJETS[choice.consume]) {
      errors.push(`[${choiceLabel}] consume objet inconnu : ${choice.consume}`);
    }
  });
});

// Vérification statique des combats déclarés dans les événements.
try {
  const eventsSource = readFile(path.join('src', 'data', 'events.js'));

  for (const match of eventsSource.matchAll(/combat\s*:\s*'([^']+)'/g)) {
    const foeId = match[1];

    if (!bestiary.MONSTRES[foeId]) {
      errors.push(`[EVENTS] combat référence un monstre inconnu : ${foeId}`);
    }
  }
} catch (err) {
  warnings.push(`[EVENTS] impossible de scanner les combats : ${err.message}`);
}

// ============================================================
// Vérification des assets
// ============================================================

const assetsDir = path.join(root, 'assets');

function checkAssetsInText(relPath, label) {
  const abs = path.join(root, relPath);

  if (!existsSync(abs)) return;

  const text = readFileSync(abs, 'utf8');
  const refs = text.match(/assets\/[\w\-\/\.]+\.webp/g) || [];

  for (const ref of new Set(refs)) {
    const assetPath = path.join(root, ref);

    if (!existsSync(assetPath)) {
      warnings.push(`[${label}] asset manquant : ${ref}`);
    }
  }
}

if (existsSync(assetsDir)) {
  checkAssetsInText(path.join('index.html'), 'index.html');
  checkAssetsInText(path.join('src', 'legacy.js'), 'src/legacy.js');
} else {
  warnings.push('Dossier assets/ introuvable — les images ne peuvent pas être vérifiées.');
}

// ============================================================
// Rapport
// ============================================================

console.log('--- check-data ---');

console.log(
  `Locales : fr=${Object.keys(flat.fr).length} clés, ` +
  `en=${Object.keys(flat.en).length} clés`
);

console.log(
  `Monstres : ${Object.keys(bestiary.MONSTRES).length} | ` +
  `Trophées : ${Object.keys(bestiary.TROPHIES).length} | ` +
  `Objets : ${Object.keys(items.OBJETS).length} | ` +
  `Événements : ${events.EVENTS.length}`
);

for (const warning of warnings) {
  console.warn(`⚠ ${warning}`);
}

if (errors.length) {
  for (const error of errors) {
    console.error(`✖ ${error}`);
  }

  console.error(`\n${errors.length} erreur(s) détectée(s).`);
  process.exit(1);
}

console.log('\n✅ Données de contenu OK');