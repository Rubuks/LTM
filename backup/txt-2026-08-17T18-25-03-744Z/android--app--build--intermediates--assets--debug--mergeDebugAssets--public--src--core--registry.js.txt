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
