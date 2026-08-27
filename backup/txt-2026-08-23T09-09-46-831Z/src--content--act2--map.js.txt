// ============================================================
// LA GRANDE ROUTE — src/content/act2/map.js
// Acte II : 3 chemins (16 colonnes), villages, pools, POI,
// fonds de carte (mapBg/nestBg) + manifeste d'assets.
// ============================================================
window.GameData = window.GameData || {};
window.GameData.maps = window.GameData.maps || {};
window.GameData.villages = window.GameData.villages || {};
window.GameData.villagesByColumn = window.GameData.villagesByColumn || {};
window.GameData.assets = window.GameData.assets || { monster:{}, place:{}, event:{} };

// ---- manifeste d'assets Acte II (fallback émoji si absent) ----
Object.assign(window.GameData.assets.place, {
map_montagne:'assets/act2/map_montagne.png',
map_foret:'assets/act2/map_foret.png',
map_route:'assets/act2/map_route.png'
});
Object.assign(window.GameData.assets.monster, {
troll_de_pierre:'assets/act2/m_troll.png',
reine_myrrubra:'assets/act2/m_reine.png',
corrupteur:'assets/act2/m_corrupteur.png'
});

function a2map(id, extra){
return Object.assign({ id:id, columns:16, startColumn:0, finalColumn:15,
villageColumns:[0,6,11], lairColumns:[4,9,13], backgroundKey:'map' }, extra);
}

window.GameData.maps.act2_montagne = a2map('act2_montagne', {
bossId:'troll_de_pierre', mapTitleKey:'ui.map.title2.montagne',
mapBg:'map_montagne', nestBg:'map_montagne',
poiKeys:['w.poi2.m1','w.poi2.m2','w.poi2.m3','w.poi2.m4','w.poi2.m5','w.poi2.m6'],
encounterPools:{
road:[
{ minCol:1, maxCol:5, weight:2, foes:['graw_eboulis'], lead:'graw_eboulis' },
{ minCol:1, maxCol:5, weight:1, foes:['revenant_apic','revenant_apic'], lead:'revenant_apic' },
{ minCol:6, maxCol:10, weight:2, foes:['vautour_charnier','graw_eboulis'], lead:'graw_eboulis' },
{ minCol:6, maxCol:10, weight:1, foes:['revenant_apic','vautour_charnier'], lead:'revenant_apic' },
{ minCol:6, maxCol:14, weight:1, foes:['vouivre_des_cimes'], lead:'vouivre_des_cimes' },
{ minCol:11, maxCol:14, weight:2, foes:['graw_eboulis','graw_eboulis'], lead:'graw_eboulis' },
{ minCol:11, maxCol:14, weight:1, foes:['revenant_apic','revenant_apic','vautour_charnier'], lead:'revenant_apic' }
],
taniere:[
{ weight:1, foes:['graw_eboulis','graw_eboulis'], lead:'graw_eboulis' },
{ weight:1, foes:['revenant_apic','revenant_apic','vautour_charnier'], lead:'revenant_apic' }
] } });

window.GameData.maps.act2_foret = a2map('act2_foret', {
bossId:'reine_myrrubra', mapTitleKey:'ui.map.title2.foret',
mapBg:'map_foret', nestBg:'map_foret',
poiKeys:['w.poi2.f1','w.poi2.f2','w.poi2.f3','w.poi2.f4','w.poi2.f5','w.poi2.f6'],
encounterPools:{
road:[
{ minCol:1, maxCol:5, weight:2, foes:['scolopendre_geante'], lead:'scolopendre_geante' },
{ minCol:1, maxCol:5, weight:1, foes:['ronce_etrangleuse','scolopendre_geante'], lead:'ronce_etrangleuse' },
{ minCol:6, maxCol:10, weight:2, foes:['sanglier_ecorce','scolopendre_geante'], lead:'sanglier_ecorce' },
{ minCol:6, maxCol:10, weight:1, foes:['vestige_ypsenie','ronce_etrangleuse'], lead:'vestige_ypsenie' },
{ minCol:6, maxCol:14, weight:1, foes:['frelon_ambre'], lead:'frelon_ambre' },
{ minCol:11, maxCol:14, weight:2, foes:['vestige_ypsenie','sanglier_ecorce'], lead:'vestige_ypsenie' },
{ minCol:11, maxCol:14, weight:1, foes:['scolopendre_geante','scolopendre_geante','ronce_etrangleuse'], lead:'scolopendre_geante' }
],
taniere:[
{ weight:1, foes:['sanglier_ecorce','sanglier_ecorce'], lead:'sanglier_ecorce' },
{ weight:1, foes:['scolopendre_geante','scolopendre_geante','vestige_ypsenie'], lead:'vestige_ypsenie' }
] } });

window.GameData.maps.act2_route = a2map('act2_route', {
bossId:'corrupteur', mapTitleKey:'ui.map.title2.route',
mapBg:'map_route', nestBg:'map_route',
poiKeys:['w.poi2.r1','w.poi2.r2','w.poi2.r3','w.poi2.r4','w.poi2.r5','w.poi2.r6'],
encounterPools:{
road:[
{ minCol:1, maxCol:5, weight:2, foes:['matin_barbon'], lead:'matin_barbon' },
{ minCol:1, maxCol:5, weight:1, foes:['pestifere_rampant','pestifere_rampant'], lead:'pestifere_rampant' },
{ minCol:6, maxCol:10, weight:2, foes:['piqueur','matin_barbon'], lead:'piqueur' },
{ minCol:6, maxCol:10, weight:1, foes:['flagellant','pestifere_rampant'], lead:'flagellant' },
{ minCol:6, maxCol:14, weight:1, foes:['penitent_cendreux'], lead:'penitent_cendreux' },
{ minCol:11, maxCol:14, weight:2, foes:['piqueur','piqueur'], lead:'piqueur' },
{ minCol:11, maxCol:14, weight:1, foes:['corrompu','matin_barbon'], lead:'corrompu' }
],
taniere:[
{ weight:1, foes:['matin_barbon','matin_barbon'], lead:'matin_barbon' },
{ weight:1, foes:['corrompu','corrompu','piqueur'], lead:'piqueur' }
] } });

window.GameData.maps.act2 = Object.assign({}, window.GameData.maps.act2_route);

function a2v(pathKey, cols, keys){
window.GameData.villagesByColumn[pathKey] = {};
cols.forEach(function(c, i){
var id = pathKey + '.village.' + c;
window.GameData.villages[id] = { act:'act2', column:c, nameKey:keys[i], source:'act2' };
window.GameData.villagesByColumn[pathKey][c] = id;
});
}
a2v('act2_montagne', [0,6,11], ['w.village.a2m0.name','w.village.a2m6.name','w.village.a2m11.name']);
a2v('act2_foret', [0,6,11], ['w.village.a2f0.name','w.village.a2f6.name','w.village.a2f11.name']);
a2v('act2_route', [0,6,11], ['w.village.a2r0.name','w.village.a2r6.name','w.village.a2r11.name']);
window.GameData.villagesByColumn.act2 = window.GameData.villagesByColumn.act2_route;
