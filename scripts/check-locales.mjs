#!/usr/bin/env node
// ============================================================
// scripts/check-locales.mjs
// Vérifie les locales FR/EN sans modifier le jeu.
// ============================================================

import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const LANGS = ['fr', 'en'];
const REF_LANG = 'fr';

const errors = [];
const warnings = [];

const dicts = {};
const seenKeys = {};
const loadedFiles = {};

for (const lang of LANGS) {
  dicts[lang] = {};
  seenKeys[lang] = new Set();
  loadedFiles[lang] = [];
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

function mergeDeep(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (isPlainObject(value) && isPlainObject(target[key])) {
      target[key] = mergeDeep({ ...target[key] }, value);
    } else {
      target[key] = value;
    }
  }

  return target;
}

globalThis.registerLocale = (lang, entries) => {
  if (!dicts[lang]) {
    dicts[lang] = {};
    seenKeys[lang] = new Set();
    loadedFiles[lang] = [];
    warnings.push(`Langue inattendue dans registerLocale : ${lang}`);
  }

  if (!isPlainObject(entries)) {
    errors.push(`registerLocale(${lang}, ...) a reçu une valeur invalide.`);
    return;
  }

  const temp = {};
  flatten(entries, '', temp);

  for (const key of Object.keys(temp)) {
    if (seenKeys[lang].has(key)) {
      warnings.push(`Clé potentiellement dupliquée en ${lang} : ${key}`);
    }

    seenKeys[lang].add(key);
  }

  mergeDeep(dicts[lang], entries);
};

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

for (const lang of LANGS) {
  const localeDir = path.join(root, 'src', 'locales', lang);

  if (!existsSync(localeDir)) {
    errors.push(`Dossier manquant : src/locales/${lang}`);
    continue;
  }

  const files = listJsFiles(localeDir);

  if (!files.length) {
    errors.push(`Aucun fichier .js trouvé dans src/locales/${lang}`);
    continue;
  }

  for (const file of files) {
    try {
      await import(pathToFileURL(file.abs).href);
      loadedFiles[lang].push(file.rel);
    } catch (err) {
      errors.push(
        `Impossible de charger src/locales/${lang}/${file.rel} : ${err.message}`
      );
    }
  }
}

// Compare les fichiers chargés par langue.
const refFiles = new Set(loadedFiles[REF_LANG] || []);

for (const lang of LANGS) {
  if (lang === REF_LANG) continue;

  const targetFiles = new Set(loadedFiles[lang] || []);

  for (const file of refFiles) {
    if (!targetFiles.has(file)) {
      warnings.push(
        `Fichier locale présent en ${REF_LANG} mais absent en ${lang} : ${file}`
      );
    }
  }

  for (const file of targetFiles) {
    if (!refFiles.has(file)) {
      warnings.push(
        `Fichier locale présent en ${lang} mais absent en ${REF_LANG} : ${file}`
      );
    }
  }
}

const flat = {};

for (const lang of LANGS) {
  flat[lang] = {};
  flatten(dicts[lang] || {}, '', flat[lang]);

  if (!Object.keys(flat[lang]).length) {
    errors.push(`Aucune clé de traduction chargée pour la langue ${lang}.`);
  }
}

const stats = {};

for (const lang of LANGS) {
  const keys = Object.keys(flat[lang] || {});

  stats[lang] = {
    total: keys.length,
    ui: keys.filter((key) => key.startsWith('ui.')).length,
    world: keys.filter((key) => key.startsWith('w.')).length,
    other: keys.filter(
      (key) => !key.startsWith('ui.') && !key.startsWith('w.')
    ).length,
  };

  if (stats[lang].other > 0) {
    warnings.push(
      `[${lang}] ${stats[lang].other} clé(s) ne commencent ni par ui.* ni par w.*`
    );
  }
}

function extractVars(value) {
  const matches = String(value).matchAll(/\{(\w+)\}/g);

  return Array.from(
    new Set(Array.from(matches, (m) => m[1]))
  ).sort();
}

const refKeys = new Set(Object.keys(flat[REF_LANG] || {}));

for (const lang of LANGS) {
  if (lang === REF_LANG) continue;

  const targetKeys = new Set(Object.keys(flat[lang] || {}));

  for (const key of refKeys) {
    if (!targetKeys.has(key)) {
      errors.push(`[${lang}] clé manquante : ${key}`);
    }
  }

  for (const key of targetKeys) {
    if (!refKeys.has(key)) {
      warnings.push(
        `[${lang}] clé présente mais absente de ${REF_LANG} : ${key}`
      );
    }
  }

  for (const key of refKeys) {
    if (!targetKeys.has(key)) continue;

    const refValue = flat[REF_LANG][key];
    const targetValue = flat[lang][key];

    if (typeof refValue !== typeof targetValue) {
      errors.push(
        `[${lang}] type différent pour ${key} (${typeof refValue} vs ${typeof targetValue})`
      );
      continue;
    }

    if (typeof refValue === 'string') {
      if (!refValue.trim()) {
        warnings.push(`[${REF_LANG}] valeur vide : ${key}`);
      }

      if (!targetValue.trim()) {
        warnings.push(`[${lang}] valeur vide : ${key}`);
      }

      const refVars = extractVars(refValue);
      const targetVars = extractVars(targetValue);

      if (JSON.stringify(refVars) !== JSON.stringify(targetVars)) {
        errors.push(
          `[${lang}] variables différentes pour ${key} : ` +
          `${REF_LANG}={${refVars.join(',')}} vs ${lang}={${targetVars.join(',')}}`
        );
      }
    }
  }
}

console.log('--- Vérification des locales ---');

for (const lang of LANGS) {
  console.log(
    `${lang}: ${stats[lang]?.total ?? 0} clés ` +
    `(ui=${stats[lang]?.ui ?? 0}, world=${stats[lang]?.world ?? 0}, other=${stats[lang]?.other ?? 0})`
  );
}

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

console.log('✅ Locales FR/EN OK');