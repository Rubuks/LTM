#!/usr/bin/env node
// ============================================================
// scripts/fix-pierres-rewrite.mjs
// Réécrit src/systems/pierres.js depuis la source PROPRE
// (vérifiée par parse avant écriture).
// ============================================================
import { writeFileSync, existsSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let dir = path.dirname(fileURLToPath(import.meta.url));
while (dir !== path.dirname(dir) && !existsSync(path.join(dir, 'index.html'))) dir = path.dirname(dir);
const p = path.join(dir, 'src', 'systems', 'pierres.js');
if (existsSync(p)) copyFileSync(p, p + '.broken');

const SRC = `// ============================================================
// LES CINQ PIERRES — jeu de cartes d'auberge (original)
// 5 pierres-signes, 2 voilées. Pose, éveil, capture, charnier.
// ============================================================
(function(){
if(window.PIERRES_OK)return;window.PIERRES_OK=1;
function ensureIcon(k,d){if(window.ICONS&&!ICONS[k])ICONS[k]=d;}
ensureIcon('claw','<path d="M7 4c-1 4 0 8 2 11M12 3c-1 5 0 9 1 13M17 4c1 4 0 8-2 11"/>');
ensureIcon('gem','<path d="M7 4h10l4 5-9 11L3 9z"/><path d="M3 9h18M9 4l3 5 3-5"/>');
ensureIcon('wing','<path d="M4 18C6 8 14 4 21 4c-2 3-2 5-6 6 2 0 3 0 5-1-2 4-5 6-9 6 1 1 3 1 5 1-3 3-8 4-12 2z"/>');
ensureIcon('stone','<path d="M6 16l-2-5 4-6h8l4 6-3 5z"/><path d="M8 5l2 6-4 5M16 5l-2 6 3 5"/>');
ensureIcon('leaf','<path d="M5 19C5 9 12 4 20 4c0 9-5 15-13 15"/><path d="M5 19c3-6 7-9 11-11"/>');
ensureIcon('wind','<path d="M3 8h9a3 3 0 1 0-3-3M3 12h13a3 3 0 1 1-3 3M3 16h7"/>');
ensureIcon('flame','<path d="M12 3c1 3 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 2-5 1 2 2 2 2-4z"/>');
ensureIcon('shield','<path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z"/>');
ensureIcon('trap','<rect x="5" y="11" width="14" height="8" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>');
ensureIcon('swirl','<path d="M12 12a1 1 0 1 1 2 0 3 3 0 1 1-6 0 5 5 0 1 1 10 0 7 7 0 1 1-14 0 9 9 0 1 1 18 0"/>');
var SIGNES=['souffle','embrasement','egide','sceau','murmure'];
var SIGNE_ICON={souffle:'wind',embrasement:'flame',egide:'shield',sceau:'trap',murmure:'swirl'};
var CATICO={bete:'claw',necrophage:'skull',spectre:'ghost',ogroide:'axe',relique:'gem',draconide:'wing',humain:'hand',insectoide:'bug',vestige:'stone',vegetal:'leaf',mort:'skull'};
var AB={bete:'ui.pierres.ab.bete',insectoide:'ui.pierres.ab.insectoide',necrophage:'ui.pierres.ab.necrophage',spectre:'ui.pierres.ab.spectre',ogroide:'ui.pierres.ab.ogroide',relique:'ui.pierres.ab.relique',humain:'ui.pierres.ab.humain',vegetal:'ui.pierres.ab.vegetal',mort:'ui.pierres.ab.mort',draconide:'ui.pierres.ab.draconide',vestige:'ui.pierres.ab.vestige'};
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
function basePow(k){var M=MONSTRES[k];if(!M)return 2;var p=Math.round((M.pv[0]+M.pv[1])/6+((M.atq[0]+M.atq[1])/2)*.8);if(M.epic)p+=2;if(M.boss)p+=4;return Math.max(1,Math.min(11,p));}
function mkCard(k){var M=MONSTRES[k];return{key:k,cat:M.cat||'humain',cur:basePow(k),garde:false,rune:!!(M.epic||M.boss)};}
var CHAMPS=[
{m:['potence','gallows'],c:{name:'w.champ.aldric.name',npc:'ealdorman',pass:{cat:'humain'},trick:'reserve',or:50,deck:['brigand','brigand','chien','chien','goule','noye','charognard','fouisseur','brigand','chien','goule','noye','charognard','fouisseur']}},
{m:['mare','crow','corbeaux'],c:{name:'w.champ.corbaude.name',npc:'herboriste',pass:{cat:'spectre'},trick:'hex',or:60,deck:['noye','spectre','loup','brumeux','noye','spectre','loup','brumeux','noye','spectre','loup','brumeux','goule','noye']}},
{m:['rocher','rock'],c:{name:'w.champ.fenn.name',npc:'woodcutter',pass:{cat:'relique'},trick:'ward',or:80,deck:['diable_des_champs','leshy','brute_fouisseur','goule','bleme','diable_des_champs','leshy','brute_fouisseur','goule','bleme','diable_des_champs','leshy','brute_fouisseur','bleme']}}];
var A2C={montagne:{name:'w.champ.montagne.name',npc:'ealdorman',pass:{cat:'mort'},trick:'reserve',or:70,deck:['graw_eboulis','revenant_apic','vautour_charnier','vouivre_des_cimes','graw_eboulis','revenant_apic','vautour_charnier','vouivre_des_cimes','graw_eboulis','revenant_apic','vautour_charnier','vouivre_des_cimes','graw_eboulis','revenant_apic']},
foret:{name:'w.champ.foret.name',npc:'herboriste',pass:{cat:'vegetal'},trick:'hex',or:70,deck:['ronce_etrangleuse','vestige_ypsenie','frelon_ambre','scolopendre_geante','sanglier_ecorce','ronce_etrangleuse','vestige_ypsenie','frelon_ambre','scolopendre_geante','sanglier_ecorce','ronce_etrangleuse','vestige_ypsenie','frelon_ambre','scolopendre_geante']},
route:{name:'w.champ.route.name',npc:'woodcutter',pass:{cat:'humain'},trick:'ward',or:70,deck:['matin_barbon','piqueur','corrompu','flagellant','pestifere_rampant','penitent_cendreux','matin_barbon','piqueur','corrompu','flagellant','pestifere_rampant','penitent_cendreux','matin_barbon','piqueur']}};
function champDef(){var nom=(ND&&ND.nom)?String(t(ND.nom)).toLowerCase():'';for(var i=0;i<CHAMPS.length;i++){for(var j=0;j<CHAMPS[i].m.length;j++){if(nom.indexOf(CHAMPS[i].m[j])!==-1)return CHAMPS[i].c;}}return A2C[S.chemin]||A2C.route;}
var P=null;
function log(s){P.log.push(s);}
function sum(a){return a.reduce(function(x,c){return x+c.cur;},0);}
function draw(s,n){for(var i=0;i<n;i++){if(!P[s].deck.length)break;P[s].hand.push(P[s].deck.pop());}}
function openStones(){var out=[];P.stones.forEach(function(st,i){if(!st.captured&&!st.sealed)out.push({st:st,i:i});});return out;}
function alliesInPlay(s){var out=[];P.stones.forEach(function(st){out=out.concat(st[s]);});return out;}
function champKey(){return S.act+':'+(ND?ND.c:0)+':'+(ND&&ND.nom?ND.nom:'');}
function startGame(){var ch=champDef();P={ch:ch,stones:[],you:{deck:[],hand:[],charnier:[]},foe:{deck:[],hand:[],charnier:[]},caps:{you:0,foe:0},charPow:{you:0,foe:0},turn:'you',sel:null,over:false,win:null,draw:false,trickUsed:false,lastCapture:null,resolved:0,log:[t('ui.pierres.start')]};
var signs=shuffle(SIGNES.slice());for(var i=0;i<5;i++)P.stones.push({signe:signs[i],veiled:i>=3,wasVeiled:i>=3,revealed:i<3,you:[],foe:[],captured:null,sealed:false});
var keys=(typeof BEST!=='undefined'?BEST:[]).filter(function(k){return MONSTRES[k];});
var pad=['brigand','chien','goule','noye','charognard','fouisseur'];var pi=0;
while(keys.length<12){keys.push(pad[pi%pad.length]);pi++;}
P.you.deck=shuffle(keys.map(mkCard));P.you.hand=P.you.deck.splice(0,4);
var dk=ch.deck.filter(function(k){return MONSTRES[k];});while(dk.length<12){dk.push('brigand');}
P.foe.deck=shuffle(dk.map(mkCard));P.foe.hand=P.foe.deck.splice(0,4);
scene(rPierres);rPierres();}
window.lancerPierres=function(){if(!ND||ND.pierres)return;ND.pierres=true;if(window.sauvegarder)sauvegarder();sfx('page');startGame();};
function talent(c,s,st,idx){switch(c.cat){
case 'bete':c.cur+=alliesInPlay(s).filter(function(x){return x!==c&&x.cat==='bete';}).length;break;
case 'insectoide':c.cur+=alliesInPlay(s).filter(function(x){return x!==c&&x.cat==='insectoide';}).length;break;
case 'necrophage':c.cur+=P[s].charnier.length;break;
case 'ogroide':if(st.you.length+st.foe.length===1)c.cur+=2;break;
case 'relique':[idx-1,idx+1].forEach(function(j){var n=P.stones[j];if(n)n[s].forEach(function(a){a.cur+=1;});});break;
case 'humain':draw(s,1);break;
case 'vegetal':c.cur+=st[s].filter(function(x){return x!==c;}).length;break;
case 'mort':if(P.lastCapture&&P.lastCapture!==s)c.cur+=3;break;
case 'draconide':{var best=null;alliesInPlay(s==='you'?'foe':'you').forEach(function(x){if(!x.garde&&(!best||x.cur>best.cur))best=x;});if(best)best.cur=Math.max(0,best.cur-2);}break;
case 'vestige':c.garde=true;break;}}
function place(s,handIdx,stoneIdx){var st=P.stones[stoneIdx];var c=P[s].hand.splice(handIdx,1)[0];st[s].push(c);
if(st.veiled&&!st.revealed){st.revealed=true;log(t('ui.pierres.log.reveal',{s:t('ui.pierres.sign.'+st.signe)}));}
if(s==='foe'&&P.ch.pass.cat===c.cat)c.cur+=1;
talent(c,s,st,stoneIdx);
if(st.you.length&&st.foe.length)resolve(st);
var need=4-P[s].hand.length;if(need>0)draw(s,need);
if(!P.over){P.turn=(s==='you')?'foe':'you';if(P.turn==='foe'){setTimeout(aiMove,650);}else if(!canPlay('you')){if(!canPlay('foe'))endGame();else setTimeout(aiMove,650);}}
rPierres();}
function canPlay(s){return P[s].hand.length>0&&openStones().length>0;}
function immune(c,st){return c.garde||c.cat==='spectre'||(c.rune&&st.wasVeiled)||c.warded;}
function resolve(st){log(t('ui.pierres.log.awaken',{s:t('ui.pierres.sign.'+st.signe)}));sfx('clang');
if(st.wasVeiled&&P.ch.trick==='ward'&&!P.trickUsed&&st.foe.length){P.trickUsed=true;st.foe.forEach(function(c){c.warded=true;});log(t('ui.pierres.log.trickWard'));}
['you','foe'].forEach(function(s){st[s].forEach(function(c){var M=MONSTRES[c.key];if(!immune(c,st)&&M.faib===st.signe){c.cur=Math.max(0,c.cur-3);log(t('ui.pierres.log.strike',{s:t('ui.pierres.sign.'+st.signe),n:t(M.n)}));}});});
var ys=sum(st.you),fs=sum(st.foe);
if(fs<ys&&P.ch.trick==='reserve'&&!P.trickUsed){P.trickUsed=true;st.foe.forEach(function(c){c.cur+=3;});fs=sum(st.foe);log(t('ui.pierres.log.trickReserve'));}
if(ys>fs){st.captured='you';P.caps.you++;P.lastCapture='you';st.foe.concat(st.you).forEach(function(c){P.you.charnier.push(c);P.charPow.you+=c.cur;});log(t('ui.pierres.log.captureYou',{s:t('ui.pierres.sign.'+st.signe)}));sfx('chest');}
else if(fs>ys){st.captured='foe';P.caps.foe++;P.lastCapture='foe';st.you.concat(st.foe).forEach(function(c){P.foe.charnier.push(c);P.charPow.foe+=c.cur;});log(t('ui.pierres.log.captureFoe',{s:t('ui.pierres.sign.'+st.signe)}));}
else{st.sealed=true;st.you.forEach(function(c){P.you.charnier.push(c);P.charPow.you+=c.cur;});st.foe.forEach(function(c){P.foe.charnier.push(c);P.charPow.foe+=c.cur;});log(t('ui.pierres.log.seal',{s:t('ui.pierres.sign.'+st.signe)}));}
P.resolved++;
if(P.resolved===2&&P.ch.trick==='hex'&&!P.trickUsed){P.trickUsed=true;var best=null;alliesInPlay('you').forEach(function(x){if(!x.garde&&(!best||x.cur>best.cur))best=x;});if(best){best.cur=Math.max(0,best.cur-2);log(t('ui.pierres.log.trickHex'));}}
checkEnd();}
function checkEnd(){if(P.over)return;if(P.caps.you>=3||P.caps.foe>=3||openStones().length===0||(!canPlay('you')&&!canPlay('foe')))endGame();}
function endGame(){P.over=true;P.win=P.caps.you>P.caps.foe||(P.caps.you===P.caps.foe&&P.charPow.you>P.charPow.foe);P.draw=P.caps.you===P.caps.foe&&P.charPow.you===P.charPow.foe;
if(P.win){var first=!S.flags['pierres_'+champKey()];var gold=first?P.ch.or:15;S.or+=gold;P.rwOr=gold;if(first){var it=(window.itemClasse?itemClasse():'seve_rouge');S.sac[it]=(S.sac[it]||0)+1;P.rwItem=it;S.flags['pierres_'+champKey()]=1;}sfx('cor');}
if(window.sauvegarder)sauvegarder();}
function simWin(st,c){var sign=st.signe;function ps(cards,extra){var s=0;cards.concat(extra||[]).forEach(function(x){var M=MONSTRES[x.key];var v=x.cur;if(!(x.garde||x.cat==='spectre'||(x.rune&&st.wasVeiled)||x.warded)&&M.faib===sign)v=Math.max(0,v-3);s+=v;});return s;}
return ps([c])>ps(st.you);}
function aiMove(){if(!P||P.over)return;var open=openStones();if(!P.foe.hand.length||!open.length){P.turn='you';if(!canPlay('you'))endGame();rPierres();return;}
var best=null;open.forEach(function(o){if(o.st.you.length&&!o.st.foe.length){P.foe.hand.forEach(function(c,ci){if(simWin(o.st,c)&&(!best||c.cur<best.c.cur))best={o:o,ci:ci,c:c};});}});
if(best){place('foe',best.ci,best.o.i);return;}
var target=open.filter(function(o){return !o.st.you.length&&!o.st.foe.length;})[0]||open.filter(function(o){return !o.st.foe.length;})[0]||open[0];
var ci=0;if(target.st.revealed){var i2=-1;P.foe.hand.forEach(function(cc,i){if(MONSTRES[cc.key].faib!==target.st.signe&&(i2===-1||cc.cur<P.foe.hand[i2].cur))i2=i;});if(i2>-1)ci=i2;}else{var r=-1;P.foe.hand.forEach(function(cc,i){if(cc.rune&&(r===-1||cc.cur<P.foe.hand[r].cur))r=i;});if(r>-1)ci=r;}
place('foe',ci,target.i);}
window.pSel=function(i){if(P.turn!=='you'||P.over)return;P.sel=(P.sel===i?null:i);sfx('clic');rPierres();};
window.pPlace=function(i){if(P.turn!=='you'||P.over||P.sel==null)return;var st=P.stones[i];if(st.captured||st.sealed)return;place('you',P.sel,i);P.sel=null;};
window.pQuit=function(){rVillage(ND);};
function pcard(c,click,i){var M=MONSTRES[c.key];
return '<div class="pcard'+(click&&P.sel===i?' sel':'')+(c.rune?' rune':'')+'" '+(click?'onclick="pSel('+i+')"':'')+'><div class="pc-art">'+portrait('monster',c.key,M.em,'pcw')+'</div><span class="pc-pow">'+c.cur+'</span><span class="pc-cat">'+ico(CATICO[c.cat]||'dot')+'</span><div class="pc-name">'+t(M.n)+'</div><div class="pc-ab">'+(AB[c.cat]?t(AB[c.cat]):'')+'</div></div>';}
function stoneHTML(st,i){var drop=P.sel!=null&&P.turn==='you'&&!P.over&&!st.captured&&!st.sealed;
var cls='pstone'+(st.captured?' cap-'+st.captured:'')+(st.sealed?' sealed':'')+(drop?' drop':'');
return '<div class="'+cls+'" onclick="pPlace('+i+')"><div class="ps-sign">'+(st.revealed?ico(SIGNE_ICON[st.signe]):ico('signpost'))+'<span>'+t('ui.pierres.sign.'+st.signe)+'</span></div><div class="ps-foe">'+st.foe.map(function(c){return pcard(c,false);}).join('')+'</div><div class="ps-sum">'+sum(st.foe)+' · '+sum(st.you)+'</div><div class="ps-you">'+st.you.map(function(c){return pcard(c,false);}).join('')+'</div><div class="ps-state">'+(st.captured?t('ui.pierres.captured'):(st.sealed?t('ui.pierres.sealed'):''))+'</div></div>';}
function rPierres(){if(!P)return;scene(rPierres);rHud();var ch=P.ch;
ec.innerHTML='<div class="ecran pierres"><div class="pi-tete">'+portrait('npc',ch.npc,'🧙','npc')+'<div><b>'+t(ch.name)+'</b><div class="pi-caps">'+'◆'.repeat(P.caps.foe)+'◇'.repeat(Math.max(0,3-P.caps.foe))+' · '+t('ui.pierres.charnier')+' '+P.charPow.foe+'</div></div><div class="pi-you">'+t('ui.pierres.you')+' '+'◆'.repeat(P.caps.you)+'◇'.repeat(Math.max(0,3-P.caps.you))+' · '+t('ui.pierres.charnier')+' '+P.charPow.you+'</div></div><div class="pi-foehand">'+P.foe.hand.map(function(){return '<span class="pback"></span>';}).join('')+'</div><div class="pi-stones">'+P.stones.map(stoneHTML).join('')+'</div><div class="pi-log">'+P.log.slice(-2).map(function(l){return '› '+l;}).join('<br>')+'</div><div class="pi-hand">'+P.you.hand.map(function(c,i){return pcard(c,P.turn==='you'&&!P.over,i);}).join('')+'</div><div class="pi-hint">'+(P.over?(P.draw?t('ui.pierres.draw'):(P.win?t('ui.pierres.victory')+(P.rwItem?' +1 '+t(OBJETS[P.rwItem].n):'')+' +'+P.rwOr+' '+t('ui.pierres.crowns'):t('ui.pierres.defeat')):(P.turn==='you'?t('ui.pierres.select'):t('ui.pierres.foeturn')))+'</div>'+(P.over?'<button class="btn btn-or gros" onclick="pQuit()">'+t('ui.pierres.quit')+'</button>':'')+'</div>';}
(function(){if(typeof rVillage!=='function')return;var _rv=rVillage;window.rVillage=function(nd){_rv(nd);try{var inn=$('v-inn');if(inn&&!inn.parentNode.querySelector('.pierres-btn')){var b=document.createElement('button');b.className='btn btn-or pierres-btn';b.disabled=!!nd.pierres;b.onclick=function(){lancerPierres();};b.innerHTML=ico('stone')+' '+t('ui.pierres.challenge')+'<small>'+t('ui.pierres.once')+'</small>';inn.insertAdjacentElement('afterend',b);}}catch(e){}};})();
(function(){var st=document.createElement('style');st.textContent='.pierres{max-width:560px;margin:0 auto}.pi-tete{display:flex;gap:.6rem;align-items:center;margin:.4rem 0}.pi-caps{font-size:.75rem;color:#c39bd8}.pi-you{margin-left:auto;font-size:.8rem;color:#d8e88a}.pi-foehand{display:flex;gap:.3rem;min-height:26px}.pback{width:20px;height:28px;background:linear-gradient(160deg,#3a2c18,#241a10);border:1px solid #6b5a34;border-radius:5px}.pi-stones{display:flex;gap:.4rem;overflow-x:auto;padding:.4rem 0}.pstone{flex:0 0 108px;background:rgba(20,14,8,.6);border:1px solid #3a2c18;border-radius:10px;padding:.4rem;min-height:210px;position:relative}.pstone.drop{outline:2px dashed #c9a24b88;cursor:pointer}.pstone.cap-you{border-color:#8fae52}.pstone.cap-foe{border-color:#c07a3c}.pstone.sealed{opacity:.55}.ps-sign{display:flex;align-items:center;gap:.3rem;font-size:.7rem;color:#c9a24b}.ps-sign .ico{width:16px;height:16px}.ps-foe,.ps-you{display:flex;gap:.25rem;flex-wrap:wrap;min-height:78px}.ps-sum{text-align:center;font-size:.7rem;color:#8d7d58}.ps-state{position:absolute;bottom:2px;right:6px;font-size:.6rem;color:#8d7d58}.pcard{position:relative;width:48px;background:linear-gradient(160deg,#2a2018,#1a130c);border:1px solid #6b5a34;border-radius:7px;overflow:hidden}.pcard.sel{outline:2px solid #c9a24b;transform:translateY(-4px)}.pcard.rune{border-color:#c39bd8}.pc-art{height:44px;display:flex;align-items:center;justify-content:center}.pc-art img,.pc-art .pw{width:100%;height:100%;object-fit:cover}.pc-pow{position:absolute;top:1px;left:2px;background:#c9a24b;color:#1a130c;font-weight:700;font-size:.7rem;border-radius:50%;width:16px;height:16px;line-height:16px;text-align:center}.pc-cat{position:absolute;top:2px;right:2px;color:#c9a24b}.pc-cat .ico{width:12px;height:12px}.pc-name{font-size:.5rem;color:#e8dcc0;padding:1px 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pc-ab{font-size:.45rem;color:#8d7d58;padding:0 2px 2px}.pi-hand{display:flex;gap:.4rem;justify-content:center;flex-wrap:wrap;margin:.5rem 0}.pi-hand .pcard{width:64px}.pi-hand .pc-art{height:56px}.pi-log{font-size:.72rem;color:#9a8a64;min-height:2em}.pi-hint{text-align:center;font-size:.85rem;color:#e8dcc0;margin:.4rem 0}.pierres-btn{margin-left:.4rem}';document.head.appendChild(st);})();
})();
`;

try { new Function(SRC); } catch (e) { console.error('✖ source embarquée invalide :', e.message); process.exit(1); }
writeFileSync(p, SRC, 'utf8');
console.log('✔ src/systems/pierres.js réécrit proprement (' + SRC.length + ' caractères, parse OK).');
console.log('✅ Ctrl+Shift+R — plus de SyntaxError, les Cinq Pierres sont jouables.');