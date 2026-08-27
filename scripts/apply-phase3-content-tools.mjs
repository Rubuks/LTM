#!/usr/bin/env node
// ============================================================
// scripts/apply-phase3-content-tools.mjs
// Phase 3E : effets déclaratifs + autoload du contenu act1.
// Ne touche pas au CSS.
// ============================================================

import {
  readFileSync,
  writeFileSync,
  existsSync,
  copyFileSync,
  readdirSync,
  mkdirSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const changes = [];
const warnings = [];

const paths = {
  index: path.join(root, 'index.html'),
  itemEffects: path.join(root, 'src', 'core', 'item-effects.js'),
  contentSync: path.join(root, 'src', 'core', 'content-sync.js'),
  act1Dir: path.join(root, 'src', 'content', 'act1'),
};

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}

function backup(p) {
  if (!existsSync(p)) return;
  copyFileSync(p, `${p}.bak`);
}

function ensureDirFor(p) {
  mkdirSync(path.dirname(p), { recursive: true });
}

// ============================================================
// src/core/item-effects.js
// ============================================================

const itemEffectsJs = `
// ============================================================
// LA GRANDE ROUTE — src/core/item-effects.js
// Effets d'objets déclaratifs. Aucun texte affiché ici.
// Un objet GameData peut porter effect:{...} au lieu de use().
// ============================================================
window.buildItemUse = function(def){
  var e = def && def.effect;
  if (!e) return null;

  return function(){
    var f;

    if (e.heal) S.pv = Math.min(S.pvMax, S.pv + e.heal);
    if (e.regen) { C.hst.regen = e.regen.d; C.hst.regenN = e.regen.n; }
    if (e.shield) C.hst.bouclier += e.shield;
    if (e.focus) C.hst.ichor = e.focus;
    if (e.evade) C.hst.chat = e.evade;
    if (e.vampire) C.hst.vampire = e.vampire;
    if (e.furyCombat) C.rune = true;
    if (e.renewMeteor) C.meteore = false;
    if (e.oil) C.huile = e.oil;

    if (e.breakIntangible) {
      C.foes.forEach(function(x){
        if (x.vivant && x.st.intangible > 0) x.st.intangible = 0;
      });
    }

    if (e.poisonLine) {
      C.foes.forEach(function(x){
        if (x.vivant) x.st.poison = { d: e.poisonLine.d, n: e.poisonLine.n };
      });
    }

    if (e.hit) {
      blesserEnnemi(e.hit.d, null, (def.em ? def.em + ' ' : '') + t(def.n), false, false, !!e.hit.fly);
      if (!C || C.fini) { if (e.log) log(t(e.log)); return; }
      f = curFoe();
      if (f && f.vivant) {
        if (e.hit.knock && f.vole) f.chute++;
        if (e.hit.stun && f.pvE > 0 && Math.random() < e.hit.stun) f.st.etourdi = 1;
      }
    }

    if (e.stunTarget) {
      f = curFoe();
      if (f && f.vivant) {
        f.st.etourdi = e.stunTarget;
        if (e.antiFly && f.vole) f.chute += e.antiFly;
      }
    }

    if (e.antiFlyGround) {
      f = curFoe();
      if (f && f.vivant) {
        if (f.vole) f.chute += e.antiFlyGround;
        else f.st.etourdi = 2;
      }
    }

    if (e.log) log(t(e.log));
  };
};
`;

// ============================================================
// src/core/content-sync.js (version Phase 3E)
// ============================================================

const contentSyncJs = `
// ============================================================
// LA GRANDE ROUTE — src/core/content-sync.js
// Synchronise GameData vers les structures legacy.
// Phase 3E : effets déclaratifs + kind par défaut.
// ============================================================
(function(){
  if (!window.GameData) return;

  window.GameData.currentAct = window.GameData.currentAct || 'act1';

  function getCurrentAct() {
    try {
      if (typeof S !== 'undefined' && S && S.act) return S.act;
    } catch (e) {}
    return window.GameData.currentAct || 'act1';
  }

  function actMatches(def) {
    if (!def) return false;
    if (!def.act) return true;
    var current = getCurrentAct();
    if (Array.isArray(def.act)) return def.act.indexOf(current) !== -1;
    return def.act === current;
  }

  function syncMonsters() {
    if (typeof MONSTRES === 'undefined' || !window.GameData.monsters) return;
    Object.keys(window.GameData.monsters).forEach(function(id){
      var def = window.GameData.monsters[id];
      if (!MONSTRES[id] && actMatches(def)) MONSTRES[id] = def;
    });
  }

  function syncItems() {
    if (typeof OBJETS === 'undefined' || !window.GameData.items) return;
    Object.keys(window.GameData.items).forEach(function(id){
      var def = window.GameData.items[id];
      if (OBJETS[id] || !actMatches(def)) return;

      var copy = {};
      for (var k in def) copy[k] = def[k];

      if (!copy.kind) copy.kind = 'combat';
      if (!copy.use && copy.effect && typeof window.buildItemUse === 'function') {
        copy.use = window.buildItemUse(copy);
      }

      OBJETS[id] = copy;
    });
  }

  function syncTrophies() {
    if (typeof TROPHIES === 'undefined' || !window.GameData.trophies) return;
    Object.keys(window.GameData.trophies).forEach(function(id){
      var def = window.GameData.trophies[id];
      if (!TROPHIES[id] && actMatches(def)) TROPHIES[id] = def;
    });
  }

  function syncCategories() {
    if (typeof CATNOMS === 'undefined' || !window.GameData.categories) return;
    Object.keys(window.GameData.categories).forEach(function(id){
      var def = window.GameData.categories[id];
      if (!CATNOMS[id] && def && def.nameKey && actMatches(def)) CATNOMS[id] = def.nameKey;
    });
  }

  function syncOils() {
    if (typeof HUILES === 'undefined' || !window.GameData.oils) return;
    Object.keys(window.GameData.oils).forEach(function(id){
      var def = window.GameData.oils[id];
      if (!HUILES[id] && def && def.nameKey && actMatches(def)) HUILES[id] = def.nameKey;
    });
  }

  function syncEvents() {
    if (typeof EVENTS === 'undefined' || !Array.isArray(EVENTS) || !window.GameData.events) return;

    var knownTitre = {};
    var knownId = {};

    EVENTS.forEach(function(ev){
      if (ev && ev.titre) knownTitre[ev.titre] = true;
      if (ev && ev.__gdId) knownId[ev.__gdId] = true;
    });

    Object.keys(window.GameData.events).forEach(function(id){
      var ev = window.GameData.events[id];
      if (!actMatches(ev)) return;
      ev.__gdId = ev.__gdId || id;
      var key = ev.titre || id;
      if (knownTitre[key] || knownId[id]) return;
      EVENTS.push(ev);
      knownTitre[key] = true;
      knownId[id] = true;
    });
  }

  function chooseWeighted(pool) {
    var total = 0;
    pool.forEach(function(p){ total += (p && p.weight) ? p.weight : 1; });
    var r = Math.random() * total;
    for (var i = 0; i < pool.length; i++) {
      var p = pool[i];
      var w = (p && p.weight) ? p.weight : 1;
      if (r <= w) return p;
      r -= w;
    }
    return pool[pool.length - 1];
  }

  function overridePickRencontre() {
    if (typeof pickRencontre !== 'function') return;
    if (window.__pickRencontreLegacy) return;

    window.__pickRencontreLegacy = pickRencontre;

    window.pickRencontre = function(c, type){
      try {
        var map = window.GameData.maps ? window.GameData.maps[getCurrentAct()] : null;

        if (map && map.encounterPools) {
          var pool = null;

          if (type === 'taniere' && Array.isArray(map.encounterPools.taniere)) {
            pool = map.encounterPools.taniere;
          } else if (Array.isArray(map.encounterPools.road)) {
            pool = map.encounterPools.road.filter(function(p){
              return p &&
                (!p.minCol || c >= p.minCol) &&
                (!p.maxCol || c <= p.maxCol);
            });
          }

          if (pool && pool.length) {
            var choice = chooseWeighted(pool);
            if (choice && choice.foes && choice.lead) {
              return { foes: choice.foes.slice(), lead: choice.lead };
            }
          }
        }
      } catch (e) {}

      return window.__pickRencontreLegacy(c, type);
    };

    try { pickRencontre = window.pickRencontre; } catch (e) {}
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

backup(paths.itemEffects);
ensureDirFor(paths.itemEffects);
writeFileSync(paths.itemEffects, itemEffectsJs.trim() + '\n', 'utf8');
changes.push('src/core/item-effects.js créé/mis à jour');

backup(paths.contentSync);
ensureDirFor(paths.contentSync);
writeFileSync(paths.contentSync, contentSyncJs.trim() + '\n', 'utf8');
changes.push('src/core/content-sync.js créé/mis à jour (Phase 3E)');

// ============================================================
// index.html : autoload de src/content/act1/*.js
// ============================================================

backup(paths.index);

if (!existsSync(paths.index)) fail('Fichier introuvable : index.html');

let html = readFileSync(paths.index, 'utf8');

const registryTag = '<script src="src/core/registry.js"></script>';
const gameDataMapTag = '<script src="src/core/game-data-map.js"></script>';
const itemEffectsTag = '<script src="src/core/item-effects.js"></script>';
const contentSyncTag = '<script src="src/core/content-sync.js"></script>';
const legacyTag = '<script src="src/legacy.js"></script>';

// Retire les balises gérées (elles seront réinsérées dans l'ordre).
[registryTag, gameDataMapTag, itemEffectsTag, contentSyncTag].forEach(tag => {
  html = html.split(tag).join('');
});

// Retire aussi les balises act1 existantes.
if (existsSync(paths.act1Dir)) {
  readdirSync(paths.act1Dir)
    .filter(f => f.endsWith('.js'))
    .forEach(f => {
      html = html.split(`<script src="src/content/act1/${f}"></script>`).join('');
    });
}

html = html.replace(/\n{3,}/g, '\n\n');

// Construit la liste ordonnée des fichiers de contenu act1.
let contentTags = [];

if (existsSync(paths.act1Dir)) {
  const files = readdirSync(paths.act1Dir).filter(f => f.endsWith('.js'));

  const ordered = files.sort((a, b) => {
    const rank = f => (f === 'index.js' ? 0 : f === 'map.js' ? 1 : 2);
    if (rank(a) !== rank(b)) return rank(a) - rank(b);
    return a.localeCompare(b);
  });

  contentTags = ordered.map(f => `<script src="src/content/act1/${f}"></script>`);
  changes.push(`[index.html] contenu act1 détecté : ${ordered.join(', ') || '(aucun)'}`);
} else {
  warnings.push('src/content/act1/ introuvable — aucun contenu act1 chargé');
}

if (!html.includes(legacyTag)) {
  warnings.push('[index.html] balise legacy.js introuvable');
} else {
  const insertion =
    [registryTag, gameDataMapTag]
      .concat(contentTags)
      .concat([itemEffectsTag, contentSyncTag])
      .join('\n') + '\n';

  html = html.replace(legacyTag, insertion + legacyTag);
  writeFileSync(paths.index, html, 'utf8');
  changes.push('[index.html] scripts réordonnés (autoload contenu act1)');
}

console.log('--- apply-phase3-content-tools ---');

for (const change of changes) console.log(`✔ ${change}`);

if (warnings.length) {
  console.warn('');
  for (const warning of warnings) console.warn(`⚠ ${warning}`);
  console.warn(`\n${warnings.length} avertissement(s).`);
  process.exitCode = 1;
} else {
  console.log('\n✅ Phase 3E appliquée.');
}