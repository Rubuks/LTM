// ============================================================
// LA GRANDE ROUTE — src/content/act1/map.js
// Source de vérité de la géométrie de l'Acte I.
// Object.assign écrase les valeurs posées par index.js.
// RÈGLE : columns = finalColumn + 1
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

if (!window.GameData.maps) window.GameData.maps = {};
if (!window.GameData.villages) window.GameData.villages = {};
if (!window.GameData.villagesByColumn) window.GameData.villagesByColumn = {};
if (!window.GameData.acts) window.GameData.acts = {};

// ---------------------------------------------------------------
// Géométrie de l'Acte I (écrase index.js)
// ---------------------------------------------------------------
window.GameData.acts.act1 = Object.assign(
  window.GameData.acts.act1 || {},
  {
    id: 'act1',
    order: 1,
    titleKey: 'ui.title.act',
    mapTitleKey: 'ui.map.title',
    bossId: 'griffon',
    startColumn: 0,
    finalColumn: 15,
    villageColumns: [0, 5, 10],
    lairColumns: [3, 7, 12],
    teaserKey: 'w.act2.teaser'
  }
);

window.GameData.maps.act1 = Object.assign(
  window.GameData.maps.act1 || {},
  {
    id: 'act1',
    columns: 16,
    startColumn: 0,
    finalColumn: 15,
    villageColumns: [0, 5, 10],
    lairColumns: [3, 7, 12],
    bossId: 'griffon',
    mapTitleKey: 'ui.map.title',
    backgroundKey: 'map'
  }
);

// ---------------------------------------------------------------
// Villages
// ---------------------------------------------------------------
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