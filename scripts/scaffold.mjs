// ============================================================
// scripts/backup-txt.mjs
// Copie les fichiers du projet dans backup/...
// Les fichiers copiés ont uniquement leur nom + .txt
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

const EXCLUDE_DIRS = new Set([
  "node_modules",
  ".git",
  "backup",
  "dist",
  ".vite",
  ".cache"
]);

// true  : copie seulement les fichiers connus du jeu
// false : copie tous les fichiers texte du projet
const ONLY_GAME_FILES = true;

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
  "package.json"
]);

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

function txtName(relPath) {
  const name = basename(relPath);

  if (extname(name).toLowerCase() === ".txt") {
    return name;
  }

  return `${name}.txt`;
}

async function run() {
  await mkdir(outDir, { recursive: true });

  const files = await listFiles(root);

  let count = 0;

  for (const file of files) {
    if (!shouldInclude(file)) {
      continue;
    }

    const rel = relative(root, file);
    const destName = txtName(rel);
    let destPath = join(outDir, destName);

    let i = 1;
    while (existsSync(destPath)) {
      const base = destName.replace(/\.txt$/i, "");
      destPath = join(outDir, `${base}-${i}.txt`);
      i++;
    }

    await copyFile(file, destPath);

    // Sortie : uniquement le nom du fichier
    console.log(basename(destPath));

    count++;
  }

  if (count === 0) {
    console.error("Aucun fichier copié.");
    process.exit(1);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});