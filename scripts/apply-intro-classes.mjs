#!/usr/bin/env node
// ============================================================
// scripts/apply-event-assets.mjs
// Ajoute les bannières (img + manifeste assets) aux 4 événements
// de réputation de l'Acte I, directement dans le fichier.
// ============================================================
import { writeFileSync, existsSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let dir = path.dirname(fileURLToPath(import.meta.url));
while (dir !== path.dirname(dir) && !existsSync(path.join(dir, 'index.html'))) dir = path.dirname(dir);
const p = path.join(dir, 'src', 'content', 'act1', 'events.js');

if (!existsSync(p)) { console.error('✖ src/content/act1/events.js introuvable'); process.exit(1); }
copyFileSync(p, p + '.bak');

const FILE = `// ============================================================
// LA GRANDE ROUTE — src/content/act1/events.js
// Événements filtrés par réputation (valeureux = combats aussi).
// Bannières illustrées : img + manifeste d'assets intégré.
// ============================================================
window.GameData = window.GameData || {};
window.GameData.assets = window.GameData.assets || { monster:{}, place:{}, event:{} };
window.GameData.assets.event = window.GameData.assets.event || {};
Object.assign(window.GameData.assets.event, {
escorte:'assets/ev_escorte.png',
chefbande:'assets/ev_chefbande.png',
rancon:'assets/ev_rancon.png',
pacte:'assets/ev_pacte.png'
});

registerEvent('w.event.escorte.title', { act:'act1', repMin:1, img:'escorte', titre:'w.event.escorte.title', em:'🧎', txt:'w.event.escorte.txt', choix:[
{ t:'w.event.escorte.c0t', d:'w.event.escorte.c0d', eff:()=>({txt:'w.event.escorte.c0eff', combat:'escorte', heroique:true}) },
{ t:'w.event.escorte.c1t', d:'w.event.escorte.c1d', eff:()=>({txt:'w.event.escorte.c1eff'}) },
{ t:'w.event.escorte.c2t', d:'w.event.escorte.c2d', repMin:2, eff:()=>{if(window.addRep)addRep(1);return{txt:'w.event.escorte.c2eff',or:20};} } ]});

registerEvent('w.event.chefbande.title', { act:'act1', repMin:1, img:'chefbande', titre:'w.event.chefbande.title', em:'⚔️', txt:'w.event.chefbande.txt', choix:[
{ t:'w.event.chefbande.c0t', d:'w.event.chefbande.c0d', eff:()=>({txt:'w.event.chefbande.c0eff', combat:'chefbande', heroique:true}) },
{ t:'w.event.chefbande.c1t', d:'w.event.chefbande.c1d', eff:()=>({txt:'w.event.chefbande.c1eff'}) },
{ t:'w.event.chefbande.c2t', d:'w.event.chefbande.c2d', repMax:-1, eff:()=>{if(window.addRep)addRep(-1);return{txt:'w.event.chefbande.c2eff',or:60};} } ]});

registerEvent('w.event.rancon.title', { act:'act1', repMax:-1, img:'rancon', titre:'w.event.rancon.title', em:'💰', txt:'w.event.rancon.txt', choix:[
{ t:'w.event.rancon.c0t', d:'w.event.rancon.c0d', eff:()=>{if(window.addRep)addRep(-1);return{txt:'w.event.rancon.c0eff',or:45};} },
{ t:'w.event.rancon.c1t', d:'w.event.rancon.c1d', eff:()=>({txt:'w.event.rancon.c1eff'}) } ]});

registerEvent('w.event.pacte.title', { act:'act1', repMax:-1, img:'pacte', titre:'w.event.pacte.title', em:'🤝', txt:'w.event.pacte.txt', choix:[
{ t:'w.event.pacte.c0t', d:'w.event.pacte.c0d', eff:()=>{if(window.addRep)addRep(-1);return{txt:'w.event.pacte.c0eff',or:70};} },
{ t:'w.event.pacte.c1t', d:'w.event.pacte.c1d', eff:()=>{if(window.addRep)addRep(1);return{txt:'w.event.pacte.c1eff'};} } ]});
`;

writeFileSync(p, FILE, 'utf8');
console.log('✔ src/content/act1/events.js réécrit avec img + manifeste assets.');
console.log('\n📂 Dépose ces 4 images dans assets/ (fallback émoji si absentes) :');
console.log('   ev_escorte.png   → pèlerins en fuite sur la route, brume, charrette');
console.log('   ev_chefbande.png → chef de bande + 4 lames au gué, armes tirées');
console.log('   ev_rancon.png    → marchand apeuré tendant une bourse, silhouette encapuchonnée');
console.log('   ev_pacte.png     → brigands autour d\'une cache en forêt, dagues & dés');