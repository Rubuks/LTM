// ============================================================
// LA GRANDE ROUTE — src/ui/hud.js
// HUD optimisé : monté une fois, mis à jour en place.
// Chargé après legacy.js : remplace rHud().
// ============================================================
let HUD_CLS=null,HUD_LANG=null;
function buildHud(){var hud=$('hud');var h='';
h+=portrait('hero',S.cls,ico('wolf'),'med');
h+='<div class="pv"><div class="jauge"><i id="hud-fill" style="width:100%"></i><span id="hud-pv"></span></div></div>';
h+='<span class="stat" id="hud-or"></span>';
h+='<button id="hud-bag" onclick="ouvrirSacHud()" style="background:none;border:none;padding:0;cursor:pointer" title="'+t('ui.sac.title')+'"><img src="assets/v_bag.webp" alt="" style="width:30px;height:30px;object-fit:cover;border-radius:7px;border:1px solid #6b5a34;filter:drop-shadow(0 0 6px rgba(201,162,75,.5))"></button>';
h+='<button id="hud-best" onclick="ouvrirBestiaire()" style="background:none;border:none;padding:0;cursor:pointer;font-size:1.5rem;line-height:1;filter:drop-shadow(0 0 6px rgba(195,155,216,.55))" title="'+t('ui.best.title')+'">'+ico('book')+'</button>';
h+='<button id="hud-mus" onclick="window.musToggle&&musToggle()" style="background:none;border:none;padding:0;cursor:pointer;font-size:1.2rem;line-height:1;opacity:.9" title="'+t('ui.hud.music')+'"></button>';
h+='<span class="stat" id="hud-trophy" hidden></span><span class="stat" id="hud-rep" hidden></span>';
h+='<div class="hud2" id="hud-row2" hidden></div>';
hud.innerHTML=h;HUD_CLS=S.cls;HUD_LANG=LANG;}
function rHud(){if(window.clampRep)clampRep();var hud=$('hud');if(!S||!S.cls){hud.hidden=true;return;}hud.hidden=false;
if(HUD_CLS!==S.cls||HUD_LANG!==LANG||!$('hud-fill'))buildHud();
var med=hud.querySelector('.med');if(med)med.classList.toggle('pouls',!!(C&&!C.fini));
$('hud-fill').style.width=Math.max(0,S.pv/S.pvMax*100)+'%';
$('hud-pv').innerHTML=ico('heart')+' '+S.pv+'/'+S.pvMax;
$('hud-or').innerHTML=ico('coin')+' '+S.or;
$('hud-mus').textContent=(window.MUS&&MUS.on)?'🎵':'🔇';
var tr=$('hud-trophy');if(S.worn&&S.worn.length){tr.hidden=false;tr.innerHTML=ico('trophy')+S.worn.length+'/'+BELT_MAX;}else{tr.hidden=true;}
var rp=$('hud-rep');if(S.rep){rp.hidden=false;rp.innerHTML=ico(postureIcon())+' '+S.rep;rp.title=t(postureKey());}else{rp.hidden=true;}
var r2=$('hud-row2');
if(C&&!C.fini){var ch=CHIPS;var h2=[];
if(C.hst.bouclier>0)h2.push(t(ch.shield)+C.hst.bouclier);
if(C.hst.parade)h2.push(t(ch.parry));
if(C.hst.ichor>0)h2.push(t(ch.focus[S.cls])+' '+C.hst.ichor);
if(C.hst.chat>0)h2.push(t(ch.evade[S.cls])+' '+C.hst.chat);
if(C.hst.cri>0)h2.push(t(ch.cri)+C.hst.cri);
if(C.hst.riposte)h2.push(t(ch.riposte));
if(C.rune)h2.push(t(ch.runeF));
if(C.hst.vampire>0)h2.push(t(ch.runeB)+C.hst.vampire);
if(C.hst.poisonHN>0)h2.push(t(ch.empo));
if(C.hst.peur>0)h2.push(t(ch.fear));
if(C.hst.sonne>0)h2.push(t(ch.sonne));
if(C.huile)h2.push('🧴 '+t(HUILES[C.huile]));
if(C.signeCd>0)h2.push(t('ui.hud.signRest',{cd:C.signeCd}));
if(C.hst.deséquilibre>0)h2.push(t('ui.hud.offBalance'));if(C.hst.camo>0)h2.push(t('ui.action.parade.pisteuse')+' '+C.hst.camo);if(C.hst.voile>0)h2.push(t('ui.chips.intangible')+' '+C.hst.voile);if(C.hst.voileCd>0)h2.push(t('ui.action.parade.tisseuse')+' CD '+C.hst.voileCd);
r2.hidden=false;
r2.innerHTML='<span class="pa-mini" title="'+t('ui.combat.paTurn',{n:C.tour})+'">'+'◆'.repeat(C.pa)+'◇'.repeat(Math.max(0,2-C.pa))+'</span>'+h2.map(function(c){return '<span class="chip mini-chip">'+c+'</span>';}).join('');}
else{r2.hidden=true;}}
