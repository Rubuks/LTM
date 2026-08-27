// ============================================================
// LA GRANDE ROUTE — src/systems/save.js
// Versionnage + migration + sauvegarde/chargement.
// ============================================================
const SAVE_VERSION=2;
function migrateSave(sv){
if(!sv||typeof sv!=='object')return null;
let v=sv.v||1;
if(v===1){
sv.act=sv.act||'act1';
sv.trophies=sv.trophies||[];
sv.sac=sv.sac||{};
sv.flags=sv.flags||{};
if(sv.map&&sv.map.nodes){
sv.map.nodes.forEach(function(col){col.forEach(function(nd){if(nd.type==='village'&&nd.nom&&typeof nd.nom==='object'){nd.nom=villageNameForColumn(nd.c);}});});
if(!sv.map.version)sv.map.version=2;
}
v=2;
}
sv.v=v;
return sv;
}
function sauvegarder(){try{if(S)S.v=SAVE_VERSION;localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
function charger(){try{return JSON.parse(localStorage.getItem(KEY));}catch(e){return null;}}
