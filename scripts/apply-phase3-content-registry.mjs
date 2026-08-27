#!/usr/bin/env node
// ============================================================
// scripts/apply-phase3-content-registry.mjs
// Phase 3B : crée GameData + index de contenu Acte I.
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

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}

function backup(filePath) {
  if (!existsSync(filePath)) return;
  copyFileSync(filePath, `${filePath}.bak`);
}

function ensureFile(relPath, content) {
  const abs = path.join(root, relPath);
  const dir = path.dirname(abs);

  mkdirSync(dir, { recursive: true });

  if (existsSync(abs)) {
    backup(abs);
  }

  writeFileSync(abs, content, 'utf8');
  changes.push(`Fichier créé/mis à jour : ${relPath}`);
}

// ============================================================
// src/core/registry.js
// ============================================================

const registryJs = `
// ============================================================
// LA GRANDE ROUTE — src/core/registry.js
// Registre central de contenu. Aucun texte, aucun CSS.
// ============================================================
window.GameData = window.GameData || {
  version: 1,
  acts: {},
  monsters: {},
  items: {},
  events: {},
  trophies: {},
  villages: {},
  categories: {},
  oils: {}
};

function gdWarn(message) {
  try {
    console.warn('[GameData] ' + message);
  } catch (e) {}
}

function gdRegister(type, id, def) {
  if (!type || !id || !def) return;

  if (!window.GameData[type]) {
    window.GameData[type] = {};
  }

  if (window.GameData[type][id]) {
    gdWarn('Contenu déjà enregistré : ' + type + '.' + id);
  }

  window.GameData[type][id] = def;
}

function registerAct(def) {
  if (!def || !def.id) {
    gdWarn('Acte sans id');
    return;
  }

  if (window.GameData.acts[def.id]) {
    gdWarn('Acte déjà enregistré : ' + def.id);
  }

  window.GameData.acts[def.id] = def;
}

function registerMonster(id, def) {
  gdRegister('monsters', id, def);
}

function registerItem(id, def) {
  gdRegister('items', id, def);
}

function registerEvent(id, def) {
  gdRegister('events', id, def);
}

function registerTrophy(id, def) {
  gdRegister('trophies', id, def);
}

function registerVillage(id, def) {
  gdRegister('villages', id, def);
}

function registerCategory(id, def) {
  gdRegister('categories', id, def);
}

function registerOil(id, def) {
  gdRegister('oils', id, def);
}

function getAct(id) {
  return window.GameData.acts[id] || null;
}

function getMonster(id) {
  return window.GameData.monsters[id] || null;
}

function getItem(id) {
  return window.GameData.items[id] || null;
}

function getEvent(id) {
  return window.GameData.events[id] || null;
}

function getTrophy(id) {
  return window.GameData.trophies[id] || null;
}

function getVillage(id) {
  return window.GameData.villages[id] || null;
}

function listActContent(actId) {
  var g = window.GameData;

  function keysByAct(type) {
    return Object.keys(g[type] || {}).filter(function(id) {
      return g[type][id] && g[type][id].act === actId;
    });
  }

  return {
    act: g.acts[actId] || null,
    monsters: keysByAct('monsters'),
    items: keysByAct('items'),
    events: keysByAct('events'),
    trophies: keysByAct('trophies'),
    villages: keysByAct('villages')
  };
}

window.registerAct = registerAct;
window.registerMonster = registerMonster;
window.registerItem = registerItem;
window.registerEvent = registerEvent;
window.registerTrophy = registerTrophy;
window.registerVillage = registerVillage;
window.registerCategory = registerCategory;
window.registerOil = registerOil;
window.getAct = getAct;
window.getMonster = getMonster;
window.getItem = getItem;
window.getEvent = getEvent;
window.getTrophy = getTrophy;
window.getVillage = getVillage;
window.listActContent = listActContent;
`;

// ============================================================
// src/content/act1/index.js
// ============================================================

const act1Js = `
// ============================================================
// LA GRANDE ROUTE — src/content/act1/index.js
// Indexe le contenu existant de l'Acte I dans GameData.
// Aucun texte, aucun CSS.
// ============================================================
registerAct({
  id: 'act1',
  order: 1,
  titleKey: 'ui.title.act',
  mapTitleKey: 'ui.map.title',
  bossId: 'griffon',
  startColumn: 0,
  finalColumn: 11,
  villageColumns: [0, 5, 10],
  teaserKey: 'w.act2.teaser'
});

(function() {
  var actId = 'act1';

  if (typeof MONSTRES !== 'undefined') {
    for (var id in MONSTRES) {
      if (Object.prototype.hasOwnProperty.call(MONSTRES, id)) {
        registerMonster(id, Object.assign({ act: actId, source: 'legacy' }, MONSTRES[id]));
      }
    }
  }

  if (typeof TROPHIES !== 'undefined') {
    for (var trophyId in TROPHIES) {
      if (Object.prototype.hasOwnProperty.call(TROPHIES, trophyId)) {
        registerTrophy(trophyId, Object.assign({ act: actId, source: 'legacy' }, TROPHIES[trophyId]));
      }
    }
  }

  if (typeof OBJETS !== 'undefined') {
    for (var itemId in OBJETS) {
      if (Object.prototype.hasOwnProperty.call(OBJETS, itemId)) {
        registerItem(itemId, Object.assign({ act: actId, source: 'legacy' }, OBJETS[itemId]));
      }
    }
  }

  if (typeof EVENTS !== 'undefined' && Array.isArray(EVENTS)) {
    EVENTS.forEach(function(ev, index) {
      var eventId = ev.titre || ('act1.event.' + index);
      registerEvent(eventId, Object.assign({ act: actId, source: 'legacy' }, ev));
    });
  }

  if (typeof CATNOMS !== 'undefined') {
    for (var catId in CATNOMS) {
      if (Object.prototype.hasOwnProperty.call(CATNOMS, catId)) {
        registerCategory(catId, {
          act: actId,
          source: 'legacy',
          nameKey: CATNOMS[catId]
        });
      }
    }
  }

  if (typeof HUILES !== 'undefined') {
    for (var oilId in HUILES) {
      if (Object.prototype.hasOwnProperty.call(HUILES, oilId)) {
        registerOil(oilId, {
          act: actId,
          source: 'legacy',
          nameKey: HUILES[oilId]
        });
      }
    }
  }

  registerVillage('act1.village.0', {
    act: actId,
    column: 0,
    nameKey: 'w.village.v0.name',
    source: 'registry'
  });

  registerVillage('act1.village.5', {
    act: actId,
    column: 5,
    nameKey: 'w.village.v5.name',
    source: 'registry'
  });

  registerVillage('act1.village.10', {
    act: actId,
    column: 10,
    nameKey: 'w.village.v10.name',
    source: 'registry'
  });
})();
`;

ensureFile(path.join('src', 'core', 'registry.js'), registryJs.trim() + '\n');
ensureFile(path.join('src', 'content', 'act1', 'index.js'), act1Js.trim() + '\n');

// ============================================================
// index.html — insertion des scripts
// ============================================================

const indexPath = path.join(root, 'index.html');

if (!existsSync(indexPath)) {
  fail('Fichier introuvable : index.html');
}

backup(indexPath);

let html = readFileSync(indexPath, 'utf8');

const registryTag = '<script src="src/core/registry.js"></script>';
const act1Tag = '<script src="src/content/act1/index.js"></script>';
const legacyTag = '<script src="src/legacy.js"></script>';

if (!html.includes(legacyTag)) {
  warnings.push('[index.html] balise legacy.js introuvable');
} else {
  let insertion = '';

  if (!html.includes(registryTag)) {
    insertion += registryTag + '\n';
  }

  if (!html.includes(act1Tag)) {
    insertion += act1Tag + '\n';
  }

  if (insertion) {
    html = html.replace(legacyTag, insertion + legacyTag);
    writeFileSync(indexPath, html, 'utf8');
    changes.push('[index.html] scripts GameData insérés avant legacy.js');
  } else {
    changes.push('[index.html] scripts GameData déjà présents');
  }
}

// ============================================================
// Rapport
// ============================================================

console.log('--- apply-phase3-content-registry ---');

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
  console.log('\n✅ Phase 3B installée.');
}