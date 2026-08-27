// ============================================================
// LA GRANDE ROUTE — src/content/act1/bestiary.js
// Créature supplémentaire : chef de bande (voie valeureuse).
// ============================================================
registerMonster('chef_bande', { act:'act1', n:'w.foe.chef_bande.name', em:'🗡️', pv:[70,84], atq:[9,13], cat:'humain', faib:null, epic:true, trophy:'chef_banniere', txt:'w.foe.chef_bande.txt', ints:[
{ n:'w.foe.chef_bande.i0n', em:'🗡️', d:[9,13] },
{ n:'w.foe.chef_bande.i1n', em:'📢', d:[0,0], fx:'peur' },
{ n:'w.foe.chef_bande.i2n', em:'🩸', d:[11,16] } ]});
registerTrophy('chef_banniere', { act:'act1', n:'w.trophy.chef_banniere.name', desc:'w.trophy.chef_banniere.desc', voice:'w.trophy.chef_banniere.voice', img:'v_rune', bonus:{ esqFlat:1 } });
