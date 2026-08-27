#!/usr/bin/env node
// Contenu réputation : chef de bande, événements valeureux/sombres, locales.
import { readFileSync, writeFileSync, existsSync, copyFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
let dir = path.dirname(fileURLToPath(import.meta.url));
while (dir !== path.dirname(dir) && !existsSync(path.join(dir, 'index.html'))) dir = path.dirname(dir);
const root = dir;
const changes = [], warnings = [];

function appendKeys(rel, lines){
  const p = path.join(root, rel);
  if (!existsSync(p)) { warnings.push(rel + ' introuvable'); return; }
  copyFileSync(p, p + '.bak');
  let c = readFileSync(p, 'utf8');
  const missing = lines.filter(l => { const m = l.match(/^"([^"]+)"/); return m && !c.includes('"' + m[1] + '"'); });
  if (!missing.length) { changes.push('locales à jour : ' + rel); return; }
  const i = c.lastIndexOf('}');
  const before = c.slice(0, i); const trimmed = before.trimEnd();
  let suffix = ''; if (!before.endsWith('\n')) suffix += '\n'; if (trimmed.length && !trimmed.endsWith(',')) suffix += ',\n';
  suffix += missing.join('\n') + '\n';
  writeFileSync(p, before + suffix + c.slice(i), 'utf8');
  changes.push('+' + missing.length + ' clés : ' + rel);
}

// ---------- nouvelles rencontres (rencontreEvent) ----------
{
  const p = path.join(root, 'src', 'data', 'bestiary.js');
  if (existsSync(p)) {
    copyFileSync(p, p + '.bak');
    let c = readFileSync(p, 'utf8');
    const oldC = "case 'spectre':return{foes:['spectre'],lead:'spectre'};default:";
    const newC = "case 'spectre':return{foes:['spectre'],lead:'spectre'};case 'escorte':return{foes:['brumeux','brumeux'],lead:'brumeux'};case 'chefbande':return{foes:['chef_bande','brigand','brigand','brigand','brigand'],lead:'chef_bande'};default:";
    if (c.includes(newC)) changes.push('déjà : rencontres escorte/chefbande');
    else if (c.includes(oldC)) { c = c.split(oldC).join(newC); writeFileSync(p, c, 'utf8'); changes.push('ok : rencontres escorte/chefbande'); }
    else warnings.push('rencontreEvent non reconnu');
  }
}

// ---------- contenu Acte I : bestiaire + événements ----------
mkdirSync(path.join(root, 'src', 'content', 'act1'), { recursive: true });

writeFileSync(path.join(root, 'src', 'content', 'act1', 'bestiary.js'), `// ============================================================
// LA GRANDE ROUTE — src/content/act1/bestiary.js
// Créature supplémentaire : chef de bande (voie valeureuse).
// ============================================================
registerMonster('chef_bande', { act:'act1', n:'w.foe.chef_bande.name', em:'🗡️', pv:[70,84], atq:[9,13], cat:'humain', faib:null, epic:true, trophy:'chef_banniere', txt:'w.foe.chef_bande.txt', ints:[
{ n:'w.foe.chef_bande.i0n', em:'🗡️', d:[9,13] },
{ n:'w.foe.chef_bande.i1n', em:'📢', d:[0,0], fx:'peur' },
{ n:'w.foe.chef_bande.i2n', em:'🩸', d:[11,16] } ]});
registerTrophy('chef_banniere', { act:'act1', n:'w.trophy.chef_banniere.name', desc:'w.trophy.chef_banniere.desc', voice:'w.trophy.chef_banniere.voice', img:'v_rune', bonus:{ esqFlat:1 } });
`, 'utf8'); // <-- Corrigé ici (ajout de 'utf8' au lieu de l'ID)
changes.push('créé : act1/bestiary.js');

writeFileSync(path.join(root, 'src', 'content', 'act1', 'events.js'), `// ============================================================
// LA GRANDE ROUTE — src/content/act1/events.js
// Événements filtrés par réputation (valeureux = combats aussi).
// ============================================================
registerEvent('w.event.escorte.title', { act:'act1', repMin:1, titre:'w.event.escorte.title', em:'🧎', txt:'w.event.escorte.txt', choix:[
{ t:'w.event.escorte.c0t', d:'w.event.escorte.c0d', eff:()=>({txt:'w.event.escorte.c0eff', combat:'escorte', heroique:true}) },
{ t:'w.event.escorte.c1t', d:'w.event.escorte.c1d', eff:()=>({txt:'w.event.escorte.c1eff'}) },
{ t:'w.event.escorte.c2t', d:'w.event.escorte.c2d', repMin:2, eff:()=>{if(window.addRep)addRep(1);return{txt:'w.event.escorte.c2eff',or:20};} } ]});
registerEvent('w.event.chefbande.title', { act:'act1', repMin:1, titre:'w.event.chefbande.title', em:'⚔️', txt:'w.event.chefbande.txt', choix:[
{ t:'w.event.chefbande.c0t', d:'w.event.chefbande.c0d', eff:()=>({txt:'w.event.chefbande.c0eff', combat:'chefbande', heroique:true}) },
{ t:'w.event.chefbande.c1t', d:'w.event.chefbande.c1d', eff:()=>({txt:'w.event.chefbande.c1eff'}) },
{ t:'w.event.chefbande.c2t', d:'w.event.chefbande.c2d', repMax:-1, eff:()=>{if(window.addRep)addRep(-1);return{txt:'w.event.chefbande.c2eff',or:60};} } ]});
registerEvent('w.event.rancon.title', { act:'act1', repMax:-1, titre:'w.event.rancon.title', em:'💰', txt:'w.event.rancon.txt', choix:[
{ t:'w.event.rancon.c0t', d:'w.event.rancon.c0d', eff:()=>{if(window.addRep)addRep(-1);return{txt:'w.event.rancon.c0eff',or:45};} },
{ t:'w.event.rancon.c1t', d:'w.event.rancon.c1d', eff:()=>({txt:'w.event.rancon.c1eff'}) } ]});
registerEvent('w.event.pacte.title', { act:'act1', repMax:-1, titre:'w.event.pacte.title', em:'🤝', txt:'w.event.pacte.txt', choix:[
{ t:'w.event.pacte.c0t', d:'w.event.pacte.c0d', eff:()=>{if(window.addRep)addRep(-1);return{txt:'w.event.pacte.c0eff',or:70};} },
{ t:'w.event.pacte.c1t', d:'w.event.pacte.c1d', eff:()=>{if(window.addRep)addRep(1);return{txt:'w.event.pacte.c1eff'};} } ]});
`, 'utf8'); // <-- Corrigé ici
changes.push('créé : act1/events.js');

// ---------- balises + smoke ----------
{
  const p = path.join(root, 'index.html');
  if (existsSync(p)) {
    copyFileSync(p, p + '.bak');
    let h = readFileSync(p, 'utf8');
    const tags = '<script src="src/content/act1/bestiary.js"></script>\n<script src="src/content/act1/events.js"></script>';
    const anchor = '<script src="src/content/act1/map.js"></script>';
    if (!h.includes('act1/bestiary.js') && h.includes(anchor)) { h = h.replace(anchor, anchor + '\n' + tags); writeFileSync(p, h, 'utf8'); changes.push('index.html : act1 bestiaire+événements'); }
    else changes.push('index.html : déjà à jour ou ancre introuvable');
  }
}
{
  const p = path.join(root, 'scripts', 'smoke-test.mjs');
  if (existsSync(p)) {
    copyFileSync(p, p + '.bak');
    let s = readFileSync(p, 'utf8');
    const add = "  'src/content/act1/bestiary.js',\n  'src/content/act1/events.js',\n";
    const anchor = "  'src/content/act1/map.js',";
    if (!s.includes('act1/bestiary.js') && s.includes(anchor)) { s = s.replace(anchor, add + anchor); writeFileSync(p, s, 'utf8'); changes.push('smoke : act1 contenu'); }
  }
}

// ---------- locales ----------
appendKeys('src/locales/fr/ui.js', [
`"ui.posture.saint": "😇 Saint — on te bénit",`,
`"ui.posture.respect": "🙂 Respecté",`,
`"ui.posture.neutre": "· Inconnu",`,
`"ui.posture.suspect": "😠 Suspect — on te surveille",`,
`"ui.posture.paria": "👹 Paria — chassé",`,
`"ui.choice.needMin": "requiert ★ {n}",`,
`"ui.choice.needMax": "requiert ★ ≤ {n}",`,
]);
appendKeys('src/locales/en/ui.js', [
`"ui.posture.saint": "😇 Saint — blessed",`,
`"ui.posture.respect": "🙂 Respected",`,
`"ui.posture.neutre": "· Unknown",`,
`"ui.posture.suspect": "😠 Suspect — watched",`,
`"ui.posture.paria": "👹 Pariah — hunted",`,
`"ui.choice.needMin": "requires ★ {n}",`,
`"ui.choice.needMax": "requires ★ ≤ {n}",`,
]);
appendKeys('src/locales/fr/world.js', [
`"w.foe.chef_bande.name": "Chef de Bande",`,
`"w.foe.chef_bande.txt": "Un géant bardé de cicatrices, cinq lames à sa ceinture. Ses bandits attendent son sifflet.",`,
`"w.foe.chef_bande.i0n": "Lame de chef",`,
`"w.foe.chef_bande.i1n": "Sifflet de guerre",`,
`"w.foe.chef_bande.i2n": "Frappe du bourreau",`,
`"w.trophy.chef_banniere.name": "Bannière du Chef",`,
`"w.trophy.chef_banniere.desc": "Un lambeau d'étendard. +1 esquive.",`,
`"w.trophy.chef_banniere.voice": "« Les bandits n'avaient pas de roi. Tu as tué le leur. »",`,
`"w.event.escorte.title": "L'Escorte de Pèlerins",`,
`"w.event.escorte.txt": "Des pèlerins tremblants veulent franchir le marais. Au loin, deux silhouettes de brume les suivent déjà.",`,
`"w.event.escorte.c0t": "Les escorter",`,
`"w.event.escorte.c0d": "La brume n'attendra pas.",`,
`"w.event.escorte.c0eff": "La traversée tourne à l'embuscade — mais tu tiens la ligne.",`,
`"w.event.escorte.c1t": "Les presser d'avancer",`,
`"w.event.escorte.c1d": "Vite, avant la nuit.",`,
`"w.event.escorte.c1eff": "Ils filent sans demander leur reste.",`,
`"w.event.escorte.c2t": "Bénir leur marche",`,
`"w.event.escorte.c2d": "Un geste qui vaut de l'or.",`,
`"w.event.escorte.c2eff": "Ils glissent une offrande dans ta main.",`,
`"w.event.chefbande.title": "Le Chef de Bande",`,
`"w.event.chefbande.txt": "Un chef de bande et ses quatre lames rançonnent le gué. Ils ne te connaissent pas. Pas encore.",`,
`"w.event.chefbande.c0t": "Les défier",`,
`"w.event.chefbande.c0d": "Cinq contre un.",`,
`"w.event.chefbande.c0eff": "Le gué rougit, mais le passage est libre.",`,
`"w.event.chefbande.c1t": "Les contourner",`,
`"w.event.chefbande.c1d": "Pas de gloire, pas de risque.",`,
`"w.event.chefbande.c1eff": "Tu passes par les roseaux.",`,
`"w.event.chefbande.c2t": "Rejoindre le pillage",`,
`"w.event.chefbande.c2d": "L'or n'a pas d'odeur.",`,
`"w.event.chefbande.c2eff": "Ta part est lourde. Ta conscience, légère de trop.",`,
`"w.event.rancon.title": "La Rançon",`,
`"w.event.rancon.txt": "Un marchand riche à crever est seul, sans garde. Il te voit et blêmit.",`,
`"w.event.rancon.c0t": "Le rançonner",`,
`"w.event.rancon.c0d": "Il paiera pour ses torts.",`,
`"w.event.rancon.c0eff": "Il crache la bourse sans un mot.",`,
`"w.event.rancon.c1t": "Le laisser passer",`,
`"w.event.rancon.c1d": "Tu n'es pas un brigand.",`,
`"w.event.rancon.c1eff": "Il détale, soulagé.",`,
`"w.event.pacte.title": "Le Pacte du Brigand",`,
`"w.event.pacte.txt": "Des brigands te proposent un coup sûr : une caravane sans escorte. Ils attendent ta réponse.",`,
`"w.event.pacte.c0t": "Accepter le coup",`,
`"w.event.pacte.c0d": "L'or facile.",`,
`"w.event.pacte.c0eff": "Le butin est tien. Le mépris aussi.",`,
`"w.event.pacte.c1t": "Refuser et les disperser",`,
`"w.event.pacte.c1d": "Pas de ça sur ta route.",`,
`"w.event.pacte.c1eff": "Ils détalent. On saura que tu veilles.",`,
]);
appendKeys('src/locales/en/world.js', [
`"w.foe.chef_bande.name": "Band Chief",`,
`"w.foe.chef_bande.txt": "A scarred giant, five blades at his belt. His bandits await his whistle.",`,
`"w.foe.chef_bande.i0n": "Chief's Blade",`,
`"w.foe.chef_bande.i1n": "War Whistle",`,
`"w.foe.chef_bande.i2n": "Executioner's Blow",`,
`"w.trophy.chef_banniere.name": "Chief's Banner",`,
`"w.trophy.chef_banniere.desc": "A shred of standard. +1 dodge.",`,
`"w.trophy.chef_banniere.voice": "“The bandits had no king. You slew theirs.”",`,
`"w.event.escorte.title": "The Pilgrim Escort",`,
`"w.event.escorte.txt": "Trembling pilgrims want to cross the marsh. Far off, two mist-shapes already follow them.",`,
`"w.event.escorte.c0t": "Escort them",`,
`"w.event.escorte.c0d": "The mist will not wait.",`,
`"w.event.escorte.c0eff": "The crossing turns to ambush—but you hold the line.",`,
`"w.event.escorte.c1t": "Hurry them on",`,
`"w.event.escorte.c1d": "Fast, before nightfall.",`,
`"w.event.escorte.c1eff": "They flee without asking more.",`,
`"w.event.escorte.c2t": "Bless their march",`,
`"w.event.escorte.c2d": "A gesture worth gold.",`,
`"w.event.escorte.c2eff": "They slip an offering into your hand.",`,
`"w.event.chefbande.title": "The Band Chief",`,
`"w.event.chefbande.txt": "A band chief and his four blades toll the ford. They do not know you. Not yet.",`,
`"w.event.chefbande.c0t": "Challenge them",`,
`"w.event.chefbande.c0d": "Five against one.",`,
`"w.event.chefbande.c0eff": "The ford reddens, but the way is free.",`,
`"w.event.chefbande.c1t": "Skirt them",`,
`"w.event.chefbande.c1d": "No glory, no risk.",`,
`"w.event.chefbande.c1eff": "You pass through the reeds.",`,
`"w.event.chefbande.c2t": "Join the pillage",`,
`"w.event.chefbande.c2d": "Gold has no smell.",`,
`"w.event.chefbande.c2eff": "Your share is heavy. Your conscience, too light.",`,
`"w.event.rancon.title": "The Ransom",`,
`"w.event.rancon.txt": "A rich merchant, alone, no guard. He sees you and pales.",`,
`"w.event.rancon.c0t": "Ransom him",`,
`"w.event.rancon.c0d": "He will pay for his wrongs.",`,
`"w.event.rancon.c0eff": "He spits the purse without a word.",`,
`"w.event.rancon.c1t": "Let him pass",`,
`"w.event.rancon.c1d": "You are no brigand.",`,
`"w.event.rancon.c1eff": "He scurries off, relieved.",`,
`"w.event.pacte.title": "The Brigand Pact",`,
`"w.event.pacte.txt": "Brigands offer a sure score: an unescorted caravan. They await your answer.",`,
`"w.event.pacte.c0t": "Take the job",`,
`"w.event.pacte.c0d": "Easy gold.",`,
`"w.event.pacte.c0eff": "The loot is yours. So is the scorn.",`,
`"w.event.pacte.c1t": "Refuse and scatter them",`,
`"w.event.pacte.c1d": "Not on your road.",`,
`"w.event.pacte.c1eff": "They scatter. Word will spread that you watch.",`,
]);

console.log('--- apply-reputation-content ---');
for (const s of changes) console.log('✔ ' + s);
if (warnings.length) { console.warn(''); for (const w of warnings) console.warn('⚠ ' + w); process.exitCode = 1; }
else console.log('\n✅ Contenu réputation en place.');