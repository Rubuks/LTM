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
