#!/usr/bin/env node
// ============================================================
// scripts/apply-phase3-map-villages.mjs
// Phase 3C : branche la carte et les villages sur GameData.
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
  legacy: path.join(root, 'src', 'legacy.js'),
  frWorld: path.join(root, 'src', 'locales', 'fr', 'world.js'),
  enWorld: path.join(root, 'src', 'locales', 'en', 'world.js'),
  registry: path.join(root, 'src', 'core', 'registry.js'),
  gameDataMap: path.join(root, 'src', 'core', 'game-data-map.js'),
  act1Index: path.join(root, 'src', 'content', 'act1', 'index.js'),
  act1Map: path.join(root, 'src', 'content', 'act1', 'map.js'),
};

const content = {};

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}

function backup(filePath) {
  if (!existsSync(filePath)) return;
  copyFileSync(filePath, `${filePath}.bak`);
}

function readFile(filePath) {
  if (!existsSync(filePath)) {
    fail(`Fichier introuvable : ${filePath}`);
  }
  return readFileSync(filePath, 'utf8');
}

function ensureDirFor(filePath) {
  mkdirSync(path.dirname(filePath), { recursive: true });
}

function createFileIfMissing(filePath, fileContent, label) {
  if (existsSync(filePath)) {
    changes.push(`${label} déjà présent`);
    return;
  }

  ensureDirFor(filePath);
  writeFileSync(filePath, fileContent, 'utf8');
  changes.push(`${label} créé`);
}

function overwriteFile(filePath, fileContent, label) {
  backup(filePath);
  ensureDirFor(filePath);
  writeFileSync(filePath, fileContent, 'utf8');
  changes.push(`${label} mis à jour`);
}

function replaceString(targetKey, oldStr, newStr, id, guard) {
  if (guard && content[targetKey].includes(guard)) {
    changes.push(`[legacy] déjà appliqué : ${id}`);
    return;
  }

  if (!content[targetKey].includes(oldStr)) {
    warnings.push(`[legacy] motif introuvable : ${id}`);
    return;
  }

  content[targetKey] = content[targetKey].split(oldStr).join(newStr);
  changes.push(`[legacy] appliqué : ${id}`);
}

function replaceRegex(targetKey, regex, replacement, id, guard) {
  if (guard && content[targetKey].includes(guard)) {
    changes.push(`[legacy] déjà appliqué : ${id}`);
    return;
  }

  regex.lastIndex = 0;

  if (!regex.test(content[targetKey])) {
    warnings.push(`[legacy] regex introuvable : ${id}`);
    return;
  }

  regex.lastIndex = 0;
  content[targetKey] = content[targetKey].replace(regex, replacement);
  changes.push(`[legacy] appliqué : ${id}`);
}

function addLocaleKeys(targetKey, label, lines) {
  const c = content[targetKey];

  if (!c) {
    warnings.push(`[${label}] contenu absent`);
    return;
  }

  const missing = [];

  for (const line of lines) {
    const m = line.match(/^\s*"([^"]+)"/);
    if (!m) continue;

    const key = m[1];

    if (!c.includes(`"${key}"`)) {
      missing.push(line);
    }
  }

  if (!missing.length) {
    changes.push(`[${label}] clés déjà présentes`);
    return;
  }

  const idx = c.lastIndexOf('}');

  if (idx === -1) {
    warnings.push(`[${label}] accolade fermante introuvable`);
    return;
  }

  const before = c.slice(0, idx);
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

  content[targetKey] = before + suffix + c.slice(idx);
  changes.push(`[${label}] ajout de ${missing.length} clé(s)`);
}

// ============================================================
// Fichiers GameData
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
  oils: {},
  maps: {}
};

if (!window.GameData.maps) {
  window.GameData.maps = {};
}

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

window.registerAct = registerAct;
window.registerMonster = registerMonster;
window.registerItem = registerItem;
window.registerEvent = registerEvent;
window.registerTrophy = registerTrophy;
window.registerVillage = registerVillage;
window.registerCategory = registerCategory;
window.registerOil = registerOil;
`;

const gameDataMapJs = `
// ============================================================
// LA GRANDE ROUTE — src/core/game-data-map.js
// Helpers carte / villages pour GameData. Aucun CSS.
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
  oils: {},
  maps: {}
};

if (!window.GameData.maps) {
  window.GameData.maps = {};
}

if (!window.GameData.villagesByColumn) {
  window.GameData.villagesByColumn = {};
}

function registerMap(id, def) {
  if (!id || !def) return;

  if (window.GameData.maps[id]) {
    try {
      console.warn('[GameData] map déjà enregistrée : ' + id);
    } catch (e) {}
  }

  window.GameData.maps[id] = def;
}

function getMap(id) {
  return window.GameData.maps[id] || null;
}

function getVillageNameKey(actId, column) {
  const byColumn = window.GameData.villagesByColumn && window.GameData.villagesByColumn[actId];

  if (byColumn && byColumn[column]) {
    const village = window.GameData.villages[byColumn[column]];
    if (village && village.nameKey) return village.nameKey;
  }

  const villages = window.GameData.villages || {};

  for (const id in villages) {
    const v = villages[id];
    if (v && v.act === actId && v.column === column && v.nameKey) {
      return v.nameKey;
    }
  }

  return null;
}

window.registerMap = registerMap;
window.getMap = getMap;
window.getVillageNameKey = getVillageNameKey;
`;

const act1MapJs = `
// ============================================================
// LA GRANDE ROUTE — src/content/act1/map.js
// Phase 3C : données carte / villages de l'Acte I.
// Aucun texte affiché directement : uniquement des clés i18n.
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
  oils: {},
  maps: {}
};

if (!window.GameData.maps) {
  window.GameData.maps = {};
}

if (!window.GameData.villages) {
  window.GameData.villages = {};
}

if (!window.GameData.villagesByColumn) {
  window.GameData.villagesByColumn = {};
}

if (!window.GameData.acts) {
  window.GameData.acts = {};
}

if (!window.GameData.acts.act1) {
  window.GameData.acts.act1 = {
    id: 'act1',
    order: 1,
    titleKey: 'ui.title.act',
    mapTitleKey: 'ui.map.title',
    bossId: 'griffon',
    startColumn: 0,
    finalColumn: 11,
    villageColumns: [0, 5, 10],
    lairColumns: [3, 7],
    teaserKey: 'w.act2.teaser'
  };
}

if (!window.GameData.maps.act1) {
  window.GameData.maps.act1 = {
    id: 'act1',
    columns: 12,
    startColumn: 0,
    finalColumn: 11,
    villageColumns: [0, 5, 10],
    lairColumns: [3, 7],
    bossId: 'griffon',
    mapTitleKey: 'ui.map.title',
    backgroundKey: 'map'
  };
}

if (!window.GameData.villages['act1.village.0']) {
  window.GameData.villages['act1.village.0'] = {
    act: 'act1',
    column: 0,
    nameKey: 'w.village.v0.name',
    source: 'phase3c'
  };
}

if (!window.GameData.villages['act1.village.5']) {
  window.GameData.villages['act1.village.5'] = {
    act: 'act1',
    column: 5,
    nameKey: 'w.village.v5.name',
    source: 'phase3c'
  };
}

if (!window.GameData.villages['act1.village.10']) {
  window.GameData.villages['act1.village.10'] = {
    act: 'act1',
    column: 10,
    nameKey: 'w.village.v10.name',
    source: 'phase3c'
  };
}

window.GameData.villagesByColumn.act1 = Object.assign(
  {},
  window.GameData.villagesByColumn.act1 || {},
  {
    0: 'act1.village.0',
    5: 'act1.village.5',
    10: 'act1.village.10'
  }
);
`;

createFileIfMissing(paths.registry, registryJs.trim() + '\n', 'src/core/registry.js');
overwriteFile(paths.gameDataMap, gameDataMapJs.trim() + '\n', 'src/core/game-data-map.js');
overwriteFile(paths.act1Map, act1MapJs.trim() + '\n', 'src/content/act1/map.js');

// ============================================================
// Lecture des fichiers à modifier
// ============================================================

for (const key of ['index', 'legacy', 'frWorld', 'enWorld']) {
  backup(paths[key]);
  content[key] = readFile(paths[key]);
}

// ============================================================
// Locales — noms des villages
// ============================================================

const FR_WORLD_KEYS = [
  `"w.village.v0.name": "Bois-aux-Pendus",`,
  `"w.village.v5.name": "Mare-aux-Corbeaux",`,
  `"w.village.v10.name": "Le-Rocher-Noir",`,
];

const EN_WORLD_KEYS = [
  `"w.village.v0.name": "Hanged Man's Wood",`,
  `"w.village.v5.name": "Crow's Mire",`,
  `"w.village.v10.name": "Le-Rocher-Noir",`,
];

addLocaleKeys('frWorld', 'src/locales/fr/world.js', FR_WORLD_KEYS);
addLocaleKeys('enWorld', 'src/locales/en/world.js', EN_WORLD_KEYS);

// ============================================================
// src/legacy.js — helpers GameData
// ============================================================

const helpersJs = `
function currentActId(){return (S&&S.act)?S.act:'act1';}
function currentAct(){return (window.GameData&&window.GameData.acts&&window.GameData.acts[currentActId()])?window.GameData.acts[currentActId()]:null;}
function currentMap(){return (window.GameData&&window.GameData.maps&&window.GameData.maps[currentActId()])?window.GameData.maps[currentActId()]:null;}
function actFinalColumn(){var a=currentAct();if(a&&typeof a.finalColumn==='number')return a.finalColumn;var m=currentMap();if(m&&typeof m.finalColumn==='number')return m.finalColumn;return 11;}
function actVillageColumns(){var a=currentAct();if(a&&Array.isArray(a.villageColumns))return a.villageColumns;var m=currentMap();if(m&&Array.isArray(m.villageColumns))return m.villageColumns;return [0,5,10];}
function actLairColumns(){var a=currentAct();if(a&&Array.isArray(a.lairColumns))return a.lairColumns;var m=currentMap();if(m&&Array.isArray(m.lairColumns))return m.lairColumns;return [3,7];}
function currentMapTitleKey(){var a=currentAct();if(a&&a.mapTitleKey)return a.mapTitleKey;var m=currentMap();if(m&&m.mapTitleKey)return m.mapTitleKey;return 'ui.map.title';}
function villageNameForColumn(column){if(window.getVillageNameKey){var key=window.getVillageNameKey(currentActId(),column);if(key)return key;}var fallback={0:'w.village.v0.name',5:'w.village.v5.name',10:'w.village.v10.name'};return fallback[column]||'w.village.v0.name';}
`.trim();

const oldTypeCol = `function typeCol(c,i){if(c===0||c===5||c===10)return 'village';if(c===11)return 'nid';if((c===3||c===7)&&i===0)return 'taniere';const r=Math.random();return r<.48?'combat':r<.8?'event':'tresor';}`;

const newTypeCol = `function typeCol(c,i){var villages=actVillageColumns();var finalCol=actFinalColumn();var lairs=actLairColumns();if(villages.indexOf(c)!==-1)return 'village';if(c===finalCol)return 'nid';if(lairs.indexOf(c)!==-1&&i===0)return 'taniere';var r=Math.random();return r<.48?'combat':r<.8?'event':'tresor';}`;

replaceString(
  'legacy',
  oldTypeCol,
  helpersJs + '\n' + newTypeCol,
  'helpers GameData + typeCol',
  'function currentActId()'
);

replaceString(
  'legacy',
  oldTypeCol,
  newTypeCol,
  'typeCol GameData',
  'var villages=actVillageColumns();'
);

// ============================================================
// src/legacy.js — nouvelle partie / sauvegarde
// ============================================================

replaceString(
  'legacy',
  'S={cls,pv:c.pv,pvMax:c.pv',
  "S={cls,act:'act1',pv:c.pv,pvMax:c.pv",
  'newRun : S.act',
  "S={cls,act:'act1',pv:c.pv"
);

replaceString(
  'legacy',
  'S=sv;S.trophies',
  "S=sv;S.act=S.act||'act1';if(S.map&&S.map.nodes){S.map.nodes.forEach(function(col){col.forEach(function(nd){if(nd.type==='village'&&nd.nom&&typeof nd.nom==='object'){nd.nom=villageNameForColumn(nd.c);}});});}S.trophies",
  'reprendre : migration S.act + villages',
  "S.act=S.act||'act1';if(S.map&&S.map.nodes)"
);

// ============================================================
// src/legacy.js — generation de carte
// ============================================================

replaceRegex(
  'legacy',
  /const N=12,nodes=\[\],edges=\[\];let id=0;const noms=\{[\s\S]*?\};const isVillage=c=>c===0\|\|c===5\|\|c===10;const isNid=c=>c===11;/,
  'const map=currentMap();const N=(map&&map.columns)?map.columns:12,nodes=[],edges=[];let id=0;const isVillage=c=>actVillageColumns().indexOf(c)!==-1;const isNid=c=>c===actFinalColumn();',
  'genMap : structure GameData',
  'const map=currentMap();'
);

replaceString(
  'legacy',
  "if(type==='village')nd.nom=noms[c];",
  "if(type==='village')nd.nom=villageNameForColumn(c);",
  'genMap : nom de village GameData',
  'villageNameForColumn(c)'
);

replaceString(
  'legacy',
  'const y=7+(nd.c/11)*85;',
  'const y=7+(nd.c/actFinalColumn())*85;',
  'coord : colonne finale GameData',
  'nd.c/actFinalColumn()'
);

// ============================================================
// src/legacy.js — affichage carte / titre
// ============================================================

replaceString(
  'legacy',
  "<b>${t('ui.map.title')}</b><span>${t('ui.map.step')}${S.etape}/11</span>",
  "<b>${t(currentMapTitleKey())}</b><span>${t('ui.map.step')}${S.etape}/${actFinalColumn()}</span>",
  'rCarte : titre + étape GameData',
  'currentMapTitleKey()'
);

replaceString(
  'legacy',
  "${t('ui.title.resume')}${sv.etape}/11",
  "${t('ui.title.resume')}${sv.etape}/${actFinalColumn()}",
  'rTitre : reprise + étape finale GameData',
  "${sv.etape}/${actFinalColumn()}"
);

// ============================================================
// index.html — chargement des scripts GameData
// ============================================================

const legacyTag = '<script src="src/legacy.js"></script>';

if (!content.index.includes(legacyTag)) {
  warnings.push('[index.html] balise legacy.js introuvable');
} else {
  const tags = [];

  if (existsSync(paths.registry)) {
    tags.push('<script src="src/core/registry.js"></script>');
  }

  if (existsSync(paths.gameDataMap)) {
    tags.push('<script src="src/core/game-data-map.js"></script>');
  }

  if (existsSync(paths.act1Index)) {
    tags.push('<script src="src/content/act1/index.js"></script>');
  }

  if (existsSync(paths.act1Map)) {
    tags.push('<script src="src/content/act1/map.js"></script>');
  }

  for (const tag of tags) {
    content.index = content.index.split(tag).join('');
  }

  content.index = content.index.replace(/\n{3,}/g, '\n\n');
  content.index = content.index.replace(
    legacyTag,
    tags.join('\n') + '\n' + legacyTag
  );

  changes.push('[index.html] scripts GameData insérés/réordonnés avant legacy.js');
}

// ============================================================
// Écriture
// ============================================================

writeFileSync(paths.index, content.index, 'utf8');
writeFileSync(paths.legacy, content.legacy, 'utf8');
writeFileSync(paths.frWorld, content.frWorld, 'utf8');
writeFileSync(paths.enWorld, content.enWorld, 'utf8');

console.log('--- apply-phase3-map-villages ---');

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
  console.log('\n✅ Phase 3C appliquée.');
}