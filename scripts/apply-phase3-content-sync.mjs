#!/usr/bin/env node
// ============================================================
// scripts/apply-phase3-content-sync.mjs
// Phase 3D : synchronise GameData vers les structures legacy.
// Ne touche pas au CSS.
// ============================================================

import {
  readFileSync,
  writeFileSync,
  existsSync,
  copyFileSync,
  mkdirSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const changes = [];
const warnings = [];

const paths = {
  index: path.join(root, 'index.html'),
  contentSync: path.join(root, 'src', 'core', 'content-sync.js'),
};

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}

function backup(filePath) {
  if (!existsSync(filePath)) return;
  copyFileSync(filePath, `${filePath}.bak`);
}

function ensureDirFor(filePath) {
  mkdirSync(path.dirname(filePath), { recursive: true });
}

const contentSyncJs = `
// ============================================================
// LA GRANDE ROUTE — src/core/content-sync.js
// Synchronise GameData vers les structures legacy.
// Aucun CSS.
// ============================================================
(function(){
  if (!window.GameData) return;

  window.GameData.currentAct = window.GameData.currentAct || 'act1';

  function actMatches(def) {
    if (!def) return false;
    if (!def.act) return true;

    var current = window.GameData.currentAct;

    if (Array.isArray(def.act)) {
      return def.act.indexOf(current) !== -1;
    }

    return def.act === current;
  }

  function syncMonsters() {
    if (typeof MONSTRES === 'undefined' || !window.GameData.monsters) return;

    Object.keys(window.GameData.monsters).forEach(function(id){
      var def = window.GameData.monsters[id];

      if (!MONSTRES[id] && actMatches(def)) {
        MONSTRES[id] = def;
      }
    });
  }

  function syncItems() {
    if (typeof OBJETS === 'undefined' || !window.GameData.items) return;

    Object.keys(window.GameData.items).forEach(function(id){
      var def = window.GameData.items[id];

      if (!OBJETS[id] && actMatches(def)) {
        OBJETS[id] = def;
      }
    });
  }

  function syncTrophies() {
    if (typeof TROPHIES === 'undefined' || !window.GameData.trophies) return;

    Object.keys(window.GameData.trophies).forEach(function(id){
      var def = window.GameData.trophies[id];

      if (!TROPHIES[id] && actMatches(def)) {
        TROPHIES[id] = def;
      }
    });
  }

  function syncCategories() {
    if (typeof CATNOMS === 'undefined' || !window.GameData.categories) return;

    Object.keys(window.GameData.categories).forEach(function(id){
      var def = window.GameData.categories[id];

      if (!CATNOMS[id] && def && def.nameKey && actMatches(def)) {
        CATNOMS[id] = def.nameKey;
      }
    });
  }

  function syncOils() {
    if (typeof HUILES === 'undefined' || !window.GameData.oils) return;

    Object.keys(window.GameData.oils).forEach(function(id){
      var def = window.GameData.oils[id];

      if (!HUILES[id] && def && def.nameKey && actMatches(def)) {
        HUILES[id] = def.nameKey;
      }
    });
  }

  function syncEvents() {
    if (typeof EVENTS === 'undefined' || !Array.isArray(EVENTS) || !window.GameData.events) return;

    var known = {};

    EVENTS.forEach(function(ev){
      if (ev && ev.titre) known[ev.titre] = true;
    });

    Object.keys(window.GameData.events).forEach(function(id){
      var ev = window.GameData.events[id];

      if (!actMatches(ev)) return;

      var key = ev.titre || id;

      if (!known[key]) {
        EVENTS.push(ev);
        known[key] = true;
      }
    });
  }

  function overridePickRencontre() {
    if (typeof pickRencontre !== 'function') return;
    if (window.__pickRencontreLegacy) return;

    window.__pickRencontreLegacy = pickRencontre;

    window.pickRencontre = function(c, type){
      try {
        var map = window.GameData.maps ? window.GameData.maps[window.GameData.currentAct] : null;

        if (map && map.encounterPools) {
          var pool = null;

          if (type === 'taniere' && map.encounterPools.taniere) {
            pool = map.encounterPools.taniere;
          } else if (map.encounterPools.road) {
            pool = map.encounterPools.road.filter(function(p){
              return (!p.minCol || c >= p.minCol) && (!p.maxCol || c <= p.maxCol);
            });
          }

          if (pool && pool.length) {
            var choice = pool[Math.floor(Math.random() * pool.length)];

            if (choice && choice.foes && choice.lead) {
              return { foes: choice.foes.slice(), lead: choice.lead };
            }
          }
        }
      } catch (e) {}

      return window.__pickRencontreLegacy(c, type);
    };

    try {
      pickRencontre = window.pickRencontre;
    } catch (e) {}
  }

  function syncGameDataToLegacy() {
    syncMonsters();
    syncItems();
    syncTrophies();
    syncCategories();
    syncOils();
    syncEvents();
    overridePickRencontre();
  }

  window.syncGameDataToLegacy = syncGameDataToLegacy;
  syncGameDataToLegacy();
})();
`;

backup(paths.contentSync);
ensureDirFor(paths.contentSync);
writeFileSync(paths.contentSync, contentSyncJs.trim() + '\n', 'utf8');
changes.push('src/core/content-sync.js créé/mis à jour');

backup(paths.index);

if (!existsSync(paths.index)) {
  fail('Fichier introuvable : index.html');
}

let html = readFileSync(paths.index, 'utf8');

const syncTag = '<script src="src/core/content-sync.js"></script>';
const legacyTag = '<script src="src/legacy.js"></script>';

if (html.includes(syncTag)) {
  html = html.split(syncTag).join('');
  changes.push('[index.html] ancienne balise content-sync retirée');
}

if (!html.includes(legacyTag)) {
  warnings.push('[index.html] balise legacy.js introuvable');
} else {
  html = html.replace(legacyTag, syncTag + '\n' + legacyTag);
  writeFileSync(paths.index, html, 'utf8');
  changes.push('[index.html] content-sync inséré avant legacy.js');
}

console.log('--- apply-phase3-content-sync ---');

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
  console.log('\n✅ Phase 3D appliquée.');
}