// ============================================================
// LA GRANDE ROUTE — src/core/content-sync.js
// Synchronise GameData vers les structures legacy.
// Phase 3E : effets déclaratifs + kind par défaut.
// Bloc 1 : syncGameDataToLegacy(actId) EXPLICITE — plus aucune
// dépendance à une lecture implicite de S pendant la sync.
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

function actMatches(def, current) {
if (!def) return false;
if (!def.act) return true;
if (Array.isArray(def.act)) return def.act.indexOf(current) !== -1;
return def.act === current;
}

function syncMonsters(current) {
if (typeof MONSTRES === 'undefined' || !window.GameData.monsters) return;
Object.keys(window.GameData.monsters).forEach(function(id){
var def = window.GameData.monsters[id];
if (!MONSTRES[id] && actMatches(def, current)) MONSTRES[id] = def;
});
}

function syncItems(current) {
if (typeof OBJETS === 'undefined' || !window.GameData.items) return;
Object.keys(window.GameData.items).forEach(function(id){
var def = window.GameData.items[id];
if (OBJETS[id] || !actMatches(def, current)) return;
var copy = {};
for (var k in def) copy[k] = def[k];
if (!copy.kind) copy.kind = 'combat';
if (!copy.use && copy.effect && typeof window.buildItemUse === 'function') {
copy.use = window.buildItemUse(copy);
}
OBJETS[id] = copy;
});
}

function syncTrophies(current) {
if (typeof TROPHIES === 'undefined' || !window.GameData.trophies) return;
Object.keys(window.GameData.trophies).forEach(function(id){
var def = window.GameData.trophies[id];
if (!TROPHIES[id] && actMatches(def, current)) TROPHIES[id] = def;
});
}

function syncCategories(current) {
if (typeof CATNOMS === 'undefined' || !window.GameData.categories) return;
Object.keys(window.GameData.categories).forEach(function(id){
var def = window.GameData.categories[id];
if (!CATNOMS[id] && def && def.nameKey && actMatches(def, current)) CATNOMS[id] = def.nameKey;
});
}

function syncOils(current) {
if (typeof HUILES === 'undefined' || !window.GameData.oils) return;
Object.keys(window.GameData.oils).forEach(function(id){
var def = window.GameData.oils[id];
if (!HUILES[id] && def && def.nameKey && actMatches(def, current)) HUILES[id] = def.nameKey;
});
}

function syncEvents(current) {
if (typeof EVENTS === 'undefined' || !Array.isArray(EVENTS) || !window.GameData.events) return;
var knownTitre = {};
var knownId = {};
EVENTS.forEach(function(ev){
if (ev && ev.titre) knownTitre[ev.titre] = true;
if (ev && ev.__gdId) knownId[ev.__gdId] = true;
});
Object.keys(window.GameData.events).forEach(function(id){
var ev = window.GameData.events[id];
if (!actMatches(ev, current)) return;
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

function syncGameDataToLegacy(actId) {
var current = actId || getCurrentAct();
window.GameData.currentAct = current;
syncMonsters(current);
syncItems(current);
syncTrophies(current);
syncCategories(current);
syncOils(current);
syncEvents(current);
overridePickRencontre();
}

window.syncGameDataToLegacy = syncGameDataToLegacy;
syncGameDataToLegacy();
})();