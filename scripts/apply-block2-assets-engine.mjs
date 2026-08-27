#!/usr/bin/env node
// ============================================================
// scripts/apply-fluidity-combat.mjs
// Chantier 1 / étape 1 : rendu combat monté vs mis-à-jour.
// rCombat() = structurel ; uCombat() = partiel (pas de .ecran).
// ============================================================
import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let dir = path.dirname(fileURLToPath(import.meta.url));
while (dir !== path.dirname(dir) && !existsSync(path.join(dir, 'index.html'))) dir = path.dirname(dir);
const p = path.join(dir, 'src', 'systems', 'combat.js');

if (!existsSync(p)) { console.error('✖ src/systems/combat.js introuvable'); process.exit(1); }
copyFileSync(p, p + '.bak');
let c = readFileSync(p, 'utf8');
const changes = [], warnings = [];

function rep(oldStr, newStr, id){
  if (c.includes(newStr)) { changes.push('déjà appliqué : ' + id); return; }
  if (!c.includes(oldStr)) { warnings.push('motif introuvable : ' + id); return; }
  c = c.split(oldStr).join(newStr);
  changes.push('appliqué : ' + id);
}

// ---------- 1) ids stables sur les cartes ennemies ----------
rep('<div class="foe ${foe.vivant?\'\':\'mort\'} ${cible?\'cible\':\'\'}"',
    '<div id="foe${i}" class="foe ${foe.vivant?\'\':\'mort\'} ${cible?\'cible\':\'\'}"', 'id carte ennemie');
rep('<div class="fintent">${intentTxt}</div>',
    '<div class="fintent" id="foe${i}-it">${intentTxt}</div>', 'id intention');
rep('<div class="jauge"><i style="width:${Math.max(0,foe.pvE/foe.pvEMax*100)}%"></i><span>${Math.max(0,foe.pvE)}/${foe.pvEMax}</span></div>',
    '<div class="jauge"><i id="foe${i}-fill" style="width:${Math.max(0,foe.pvE/foe.pvEMax*100)}%"></i><span id="foe${i}-pv">${Math.max(0,foe.pvE)}/${foe.pvEMax}</span></div>', 'id jauge');
rep('<div class="fchips">${foeChips(foe).map(c=>`<span class="chip">${c}</span>`).join(\'\')}</div>',
    '<div class="fchips" id="foe${i}-ch">${foeChips(foe).map(c=>`<span class="chip">${c}</span>`).join(\'\')}</div>', 'id chips');
rep('<div class="journal">${C.log.slice(-5).map(l=>`<div>› ${l}</div>`).join(\'\')}</div>',
    '<div class="journal" id="journal">${C.log.slice(-5).map(l=>`<div>› ${l}</div>`).join(\'\')}</div>', 'id journal');

// ---------- 2) ids sur les boutons d'action ----------
rep(`onclick="agir('frappe')"`, `id="btn-frappe" onclick="agir('frappe')"`, 'id frappe');
rep(`onclick="agir('lourde')"`, `id="btn-lourde" onclick="agir('lourde')"`, 'id lourde');
rep(`onclick="agir('parade')"`, `id="btn-parade" onclick="agir('parade')"`, 'id parade');
rep(`onclick="agir('cri')"`, `id="btn-cri" onclick="agir('cri')"`, 'id cri');
rep(`onclick="agir('rempart')"`, `id="btn-rempart" onclick="agir('rempart')"`, 'id rempart');
rep(`onclick="agir('meteore')"`, `id="btn-meteore" onclick="agir('meteore')"`, 'id meteore');
rep(`onclick="agir('objets')"`, `id="btn-objets" onclick="agir('objets')"`, 'id objets');
rep(`onclick="finTour()"`, `id="btn-endturn" onclick="finTour()"`, 'id endturn');
rep(`onclick="agir('${s}')"`, `id="btn-s-${s}" onclick="agir('${s}')"`, 'id signes');

// ---------- 3) marqueurs structurels ----------
rep(`if(a==='objets'){C.objets=!C.objets;rCombat();return;}`,
    `if(a==='objets'){C.objets=!C.objets;C._struct=true;commitCombat();return;}`, 'objets = structurel');
rep(`for(let i=0;i<n;i++)C.foes.push(makeFoe('fouisseur',C.foes.length,-1));`,
    `for(let i=0;i<n;i++)C.foes.push(makeFoe('fouisseur',C.foes.length,-1));C._struct=true;`, 'rally = structurel');

// ---------- 4) rewiring des appels ----------
rep(`if(C.foes[i]&&C.foes[i].vivant){C.cible=i;sfx('clic');rCombat();}`,
    `if(C.foes[i]&&C.foes[i].vivant){C.cible=i;sfx('clic');uCombat();rHud();}`, 'setCible partiel');
rep(`sfx(it.sfx||'soin');rCombat();rHud();}`,
    `sfx(it.sfx||'soin');commitCombat();}`, 'objet partiel');
rep(`rCombat();rHud();if(C&&C._flashDes){`,
    `commitCombat();if(C&&C._flashDes){`, 'agir partiel');
rep(`recible();rCombat();rHud();}`,
    `recible();commitCombat();}`, 'finTour partiel');

// ---------- 5) uCombat + commitCombat ----------
const UPC = `
function uCombat(){
if(!C){rCombat();return;}
if(!document.getElementById('journal')&&!document.getElementById('foe0')){rCombat();return;}
const cl=CLASSES[S.cls];
const moy=it=>it?Math.round((it.d[0]+it.d[1])/2):0;
const j=document.getElementById('journal');
if(j)j.innerHTML=C.log.slice(-5).map(l=>\`<div>› \${l}</div>\`).join('');
C.foes.forEach((foe,i)=>{
const card=document.getElementById('foe'+i);if(!card)return;
card.classList.toggle('mort',!foe.vivant);
card.classList.toggle('cible',(i===C.cible&&foe.vivant));
const it=document.getElementById('foe'+i+'-it');
if(it)it.textContent=foe.vivant&&foe.intent?\`\${foe.intent.em} \${t(foe.intent.n)}\${moy(foe.intent)>0?' ~'+moy(foe.intent):''}\`:'—';
const fill=document.getElementById('foe'+i+'-fill');if(fill)fill.style.width=Math.max(0,foe.pvE/foe.pvEMax*100)+'%';
const pv=document.getElementById('foe'+i+'-pv');if(pv)pv.textContent=Math.max(0,foe.pvE)+'/'+foe.pvEMax;
const ch=document.getElementById('foe'+i+'-ch');if(ch)ch.innerHTML=foeChips(foe).map(x=>\`<span class="chip">\${x}</span>\`).join('');
});
const dis=a=>C.fini||C.pa<a;
const disSigne=(C.fini||C.pa<1||C.signeCd>0);
[['btn-frappe',dis(1)],['btn-lourde',dis(2)],['btn-parade',dis(1)],['btn-cri',dis(1)],['btn-rempart',dis(1)],['btn-endturn',C.fini],['btn-meteore',(C.meteore||C.pa<2||C.fini)],['btn-objets',false]].forEach(([id,d])=>{const b=document.getElementById(id);if(b)b.disabled=d;});
cl.sorts.forEach(s=>{const b=document.getElementById('btn-s-'+s);if(b)b.disabled=disSigne;});
dechargeFx();
}
function commitCombat(){if(!C)return;if(C._struct){C._struct=false;rCombat();}else{uCombat();}rHud();}
`;
if (c.includes('function commitCombat(){')) changes.push('déjà appliqué : uCombat/commitCombat');
else {
  const anchor = 'function victoire(){';
  if (c.includes(anchor)) { c = c.split(anchor).join(UPC + anchor); changes.push('appliqué : uCombat/commitCombat'); }
  else warnings.push('ancre victoire introuvable');
}

writeFileSync(p, c, 'utf8');
console.log('--- apply-fluidity-combat ---');
for (const s of changes) console.log('✔ ' + s);
if (warnings.length) { console.warn(''); for (const w of warnings) console.warn('⚠ ' + w); console.warn(`\n${warnings.length} avertissement(s).`); process.exitCode = 1; }
else console.log('\n✅ Combat fluide (montage vs mise-à-jour) en place.');