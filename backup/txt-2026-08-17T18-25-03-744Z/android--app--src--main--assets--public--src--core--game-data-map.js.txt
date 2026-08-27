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
