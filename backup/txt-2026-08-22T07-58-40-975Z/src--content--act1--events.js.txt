// ============================================================
// LA GRANDE ROUTE — src/content/act1/events.js
// 4 événements de réputation, OUVERTS à tous (verrous au choix).
// ============================================================
window.GameData = window.GameData || {};
window.GameData.assets = window.GameData.assets || { monster:{}, place:{}, event:{} };
window.GameData.assets.event = window.GameData.assets.event || {};
Object.assign(window.GameData.assets.event, {
escorte:'assets/ev_escorte.webp',
chefbande:'assets/ev_chefbande.webp',
rancon:'assets/ev_rancon.webp',
pacte:'assets/ev_pacte.webp'
});
registerEvent('w.event.escorte.title', { act:'act1', img:'escorte', titre:'w.event.escorte.title', em:'🧎', txt:'w.event.escorte.txt', choix:[
{ t:'w.event.escorte.c0t', d:'w.event.escorte.c0d', eff:()=>({txt:'w.event.escorte.c0eff', combat:'escorte', heroique:true}) },
{ t:'w.event.escorte.c1t', d:'w.event.escorte.c1d', eff:()=>({txt:'w.event.escorte.c1eff'}) },
{ t:'w.event.escorte.c2t', d:'w.event.escorte.c2d', repMin:2, eff:()=>{if(window.addRep)addRep(1);return{txt:'w.event.escorte.c2eff',or:20};} },
{ t:'w.event.escorte.c3t', d:'w.event.escorte.c3d', repMax:-1, eff:()=>{if(window.addRep)addRep(-2);return{txt:'w.event.escorte.c3eff',or:50};} },
{ t:'w.event.escorte.c4t', d:'w.event.escorte.c4d', cls:'tisseuse', eff:()=>{if(window.addRep)addRep(1);return{txt:'w.event.escorte.c4eff'};} } ]});
registerEvent('w.event.chefbande.title', { act:'act1', img:'chefbande', titre:'w.event.chefbande.title', em:'⚔️', txt:'w.event.chefbande.txt', choix:[
{ t:'w.event.chefbande.c0t', d:'w.event.chefbande.c0d', eff:()=>({txt:'w.event.chefbande.c0eff', combat:'chefbande', heroique:true}) },
{ t:'w.event.chefbande.c1t', d:'w.event.chefbande.c1d', eff:()=>({txt:'w.event.chefbande.c1eff'}) },
{ t:'w.event.chefbande.c2t', d:'w.event.chefbande.c2d', repMax:-1, eff:()=>{if(window.addRep)addRep(-1);return{txt:'w.event.chefbande.c2eff',or:60};} },
{ t:'w.event.chefbande.c3t', d:'w.event.chefbande.c3d', cls:'mercenaire', eff:()=>({txt:'w.event.chefbande.c3eff', combat:'chefduel', heroique:true}) },
{ t:'w.event.chefbande.c4t', d:'w.event.chefbande.c4d', cls:'tisseuse', eff:()=>{if(window.addRep)addRep(-1);return{txt:'w.event.chefbande.c4eff',or:40};} } ]});
registerEvent('w.event.rancon.title', { act:'act1', img:'rancon', titre:'w.event.rancon.title', em:'💰', txt:'w.event.rancon.txt', choix:[
{ t:'w.event.rancon.c0t', d:'w.event.rancon.c0d', eff:()=>{if(window.addRep)addRep(-1);return{txt:'w.event.rancon.c0eff',or:45};} },
{ t:'w.event.rancon.c1t', d:'w.event.rancon.c1d', eff:()=>({txt:'w.event.rancon.c1eff'}) },
{ t:'w.event.rancon.c2t', d:'w.event.rancon.c2d', repMin:1, eff:()=>{if(window.addRep)addRep(1);return{txt:'w.event.rancon.c2eff'};} },
{ t:'w.event.rancon.c3t', d:'w.event.rancon.c3d', cls:'mercenaire', eff:()=>({txt:'w.event.rancon.c3eff',or:40}) } ]});
registerEvent('w.event.pacte.title', { act:'act1', img:'pacte', titre:'w.event.pacte.title', em:'🤝', txt:'w.event.pacte.txt', choix:[
{ t:'w.event.pacte.c0t', d:'w.event.pacte.c0d', eff:()=>{if(window.addRep)addRep(-1);return{txt:'w.event.pacte.c0eff',or:70};} },
{ t:'w.event.pacte.c1t', d:'w.event.pacte.c1d', eff:()=>{if(window.addRep)addRep(1);return{txt:'w.event.pacte.c1eff'};} },
{ t:'w.event.pacte.c2t', d:'w.event.pacte.c2d', eff:()=>({txt:'w.event.pacte.c2eff'}) },
{ t:'w.event.pacte.c3t', d:'w.event.pacte.c3d', cls:'pisteuse', eff:()=>({txt:'w.event.pacte.c3eff', combat:'brigand', heroique:true}) } ]});
