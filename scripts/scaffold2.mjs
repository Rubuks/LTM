// ============================================================
// scripts/backup-txt.mjs
// Copie les fichiers du projet dans un dossier backup unique,
// en les renommant avec l'extension .txt.
// Le contenu des fichiers n'est pas modifié.
// ============================================================

import { mkdir, copyFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import {
  join,
  dirname,
  relative,
  basename,
  extname
} from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const stamp = new Date()
  .toISOString()
  .replace(/[:.]/g, "-");

const outDir = join(root, "backup", `txt-${stamp}`);

// Dossiers à ignorer.
const EXCLUDE_DIRS = new Set([
  "node_modules",
  ".git",
  "backup",
  "dist",
  ".vite",
  ".cache",
  "android",
  "www"
]);

// ----------------------------------------------------------
// MODE
// ----------------------------------------------------------
// true  : copie seulement les fichiers connus du jeu
// false : copie tous les fichiers texte du projet
const ONLY_GAME_FILES = true;

// Fichiers connus du projet.
const GAME_BASENAMES = new Set([
  "index.html",
  "i18n.js",
  "icons.js",
  "bestiary.js",
  "items.js",
  "events.js",
  "world.js",
  "ui.js",
  "legacy.js",
  "package.json",
  "map.js",
  "music.js",
  "acts.js",
  "content-sync".js,
  "game-data-map.js",
  "state.js",
  "registry.js",
  "item-effects.js",
  "utils.js",
  "village.js",
  "combat.js",
  "sac.js",
  "save.js",
  "hud.js",
  "index.js",
  "pierres.js"
]);

// Extensions considérées comme texte si ONLY_GAME_FILES = false.
const TEXT_EXTENSIONS = new Set([
  ".html",
  ".js",
  ".mjs",
  ".cjs",
  ".ts",
  ".json",
  ".css",
  ".md",
  ".svg",
  ".txt"
]);

function shouldInclude(filePath) {
  const name = basename(filePath).toLowerCase();

  if (ONLY_GAME_FILES) {
    return GAME_BASENAMES.has(name);
  }

  const ext = extname(filePath).toLowerCase();
  return TEXT_EXTENSIONS.has(ext);
}

async function listFiles(dir, files = []) {
  let entries;

  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!EXCLUDE_DIRS.has(entry.name)) {
        await listFiles(fullPath, files);
      }
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function flatName(relPath) {
  const safe = relPath
    .replace(/^[.\\/]+/, "")
    .split(/[\\/]+/)
    .join("--")
    .replace(/[<>:"|?*]/g, "_");

  if (safe.toLowerCase().endsWith(".txt")) {
    return safe;
  }

  return `${safe}.txt`;
}

async function run() {
  console.log("Création du backup TXT...");

  await mkdir(outDir, { recursive: true });

  const files = await listFiles(root);

  let count = 0;

  for (const file of files) {
    if (!shouldInclude(file)) {
      continue;
    }

    const rel = relative(root, file);
    const destName = flatName(rel);
    let destPath = join(outDir, destName);

    // Évite les collisions si deux fichiers produisent le même nom.
    let i = 1;
    while (existsSync(destPath)) {
      const base = destName.replace(/\.txt$/i, "");
      destPath = join(outDir, `${base}-${i}.txt`);
      i++;
    }

    await copyFile(file, destPath);

    console.log(`✅ ${rel} -> ${basename(outDir)}/${basename(destPath)}`);
    count++;
  }

  if (count === 0) {
    console.warn("⚠️ Aucun fichier copié.");
    console.warn("Vérifie les noms dans GAME_BASENAMES ou mets ONLY_GAME_FILES = false.");
  }

  console.log("");
  console.log(`📦 Backup TXT créé dans : ${outDir}`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});