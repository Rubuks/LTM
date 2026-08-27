#!/usr/bin/env node
// Musique par chemin Acte II : 3 pistes map (montagne/foret/route).
import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
let dir = path.dirname(fileURLToPath(import.meta.url));
while (dir !== path.dirname(dir) && !existsSync(path.join(dir, 'index.html'))) dir = path.dirname(dir);
const root = dir;
const changes = [], warnings = [];
function patch(rel, oldStr, newStr, id){
  const p = path.join(root, rel);
  if (!existsSync(p)) { warnings.push(rel + ' introuvable'); return; }
  copyFileSync(p, p + '.bak');
  let c = readFileSync(p, 'utf8');
  if (c.includes(newStr)) { changes.push('déjà : ' + id); return; }
  if (!c.includes(oldStr)) { warnings.push('motif introuvable : ' + id); return; }
  c = c.split(oldStr).join(newStr);
  writeFileSync(p, c, 'utf8');
  changes.push('ok : ' + id);
}

// 1) registre des 3 pistes map par chemin
writeFileSync(path.join(root, 'src', 'content', 'act2', 'music.js'),
`// ============================================================
// LA GRANDE ROUTE — src/content/act2/music.js
// Pistes de carte par chemin (Acte II).
// ============================================================
window.GameData = window.GameData || {};
window.GameData.music = window.GameData.music || {};
window.GameData.music.act2_montagne = { map:{ mood:'map', file:'assets/act2/mus_montagne.mp3' } };
window.GameData.music.act2_foret    = { map:{ mood:'map', file:'assets/act2/mus_foret.mp3' } };
window.GameData.music.act2_route    = { map:{ mood:'map', file:'assets/act2/mus_route.mp3' } };
`, 'utf8');
changes.push('ok : src/content/act2/music.js (3 pistes map)');

// 2) music.js : lookup par chemin + refresh
patch('src/core/music.js',
"function trackFor(ch){\nvar sk=(ch==='general')?'map':ch;\nvar g=(window.GameData||{}).music||{};\nvar act=(typeof currentActId==='function')?currentActId():'act1';\nreturn (g[act]&&g[act][sk])||(g.base&&g.base[sk])||{mood:sk};\n}",
"function trackFor(ch){\nvar sk=(ch==='general')?'map':ch;\nvar g=(window.GameData||{}).music||{};\nvar act=(typeof currentActId==='function')?currentActId():'act1';\nvar pk=(typeof S!=='undefined'&&S&&S.chemin)?(act+'_'+S.chemin):null;\nif(pk&&g[pk]&&g[pk][sk])return g[pk][sk];\nreturn (g[act]&&g[act][sk])||(g.base&&g.base[sk])||{mood:sk};\n}",
'trackFor par chemin');
patch('src/core/music.js',
"window.musSetFileVol=function(v){MUS.fileVol=v;if(fileGain)fileGain.gain.value=v;};",
"window.musSetFileVol=function(v){MUS.fileVol=v;if(fileGain)fileGain.gain.value=v;};\nwindow.musRefresh=function(){if(MUS.on&&unlocked){curChannel=null;startChannel(channelFor(MUS.wanted));}};",
'musRefresh');

// 3) acts.js : refresh au choix de chemin + reprise
patch('src/core/acts.js', "sfx('cor');\nrCarte();", "sfx('cor');\nif(window.musRefresh)window.musRefresh();\nrCarte();", 'refresh choisirChemin');
patch('src/core/acts.js', "_rp();\ntry{", "_rp();\nif(window.musRefresh)window.musRefresh();\ntry{", 'refresh reprendre');

console.log('--- apply-act2-music ---');
for (const s of changes) console.log('✔ ' + s);
if (warnings.length) { console.warn(''); for (const w of warnings) console.warn('⚠ ' + w); process.exitCode = 1; }
else console.log('\n✅ Musique par chemin câblée. Dépose les 3 .mp3 dans assets/act2/.');