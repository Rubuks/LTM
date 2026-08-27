// ============================================================
// LA GRANDE ROUTE — src/data/items.js
// L'arsenal de l'Acte I. Aucun texte : noms/desc = clés w.item.*.
// kind absent = 'combat' (fiole/bombe/huile). La bague (kind
// 'quest') est intégrée ici.
// EFFECTS/registerEffect = seam déclarative pour effets futurs.
// ============================================================
const EFFECTS={};
function registerEffect(n,fn){EFFECTS[n]=fn;}
const OBJETS={
seve_rouge:{img:'v_heal',n:'w.item.seve_rouge.name',em:"🧪",cls:"loup",p:45,tox:25,d:'w.item.seve_rouge.desc',use(){S.pv=Math.min(S.pvMax,S.pv+30);C.hst.regen=6;C.hst.regenN=2;log(t('w.itemlog.seve_rouge.drink'));}},
ichor:{img:'v_vigor',n:'w.item.ichor.name',em:"⚗️",cls:"loup",p:65,tox:25,d:'w.item.ichor.desc',use(){C.hst.ichor=3;log(t('w.itemlog.ichor.drink'));}},
chat:{img:'v_mist',n:'w.item.chat.name',em:"🐈",cls:"loup",p:55,tox:25,d:'w.item.chat.desc',use(){C.hst.chat=3;log(t('w.itemlog.chat.drink'));}},
poudre_aveuglante:{img:'v_bomb',n:'w.item.poudre_aveuglante.name',em:"💨",cls:"loup",p:60,tox:10,sfx:"crit",d:'w.item.poudre_aveuglante.desc',use(){const e=curFoe();if(!e)return;e.st.etourdi=1;if(e.vole){e.chute+=2;log(t('w.itemlog.poudre_aveuglante.fly'));}else log(t('w.itemlog.poudre_aveuglante.ground'));}},
vesse_de_loup:{img:'v_toxin',n:'w.item.vesse_de_loup.name',em:"🍄",cls:"loup",p:50,tox:10,sfx:"sort",d:'w.item.vesse_de_loup.desc',use(){C.foes.forEach(e=>{if(e.vivant)e.st.poison={d:5,n:3};});log(t('w.itemlog.vesse_de_loup.cloud'));}},
hnecro:{img:'v_oil',n:'w.item.hnecro.name',em:"🧴",cls:"loup",p:70,d:'w.item.hnecro.desc',use(){C.huile="necrophage";log(t('w.itemlog.hnecro.coat'));}},
hspectre:{img:'v_oil',n:'w.item.hspectre.name',em:"🧴",cls:"loup",p:70,d:'w.item.hspectre.desc',use(){C.huile="spectre";log(t('w.itemlog.hspectre.coat'));}},
hbete:{img:'v_oil',n:'w.item.hbete.name',em:"🧴",cls:"loup",p:70,d:'w.item.hbete.desc',use(){C.huile="bete";log(t('w.itemlog.hbete.coat'));}},
hdrag:{img:'v_oil',n:'w.item.hdrag.name',em:"🧴",cls:"loup",p:85,d:'w.item.hdrag.desc',use(){C.huile="draconide";log(t('w.itemlog.hdrag.coat'));}},
nectar:{img:'v_heal',n:'w.item.nectar.name',em:"🌙",cls:"tisseuse",p:50,tox:15,d:'w.item.nectar.desc',use(){S.pv=Math.min(S.pvMax,S.pv+35);C.hst.regen=6;C.hst.regenN=2;log(t('w.itemlog.nectar.drink'));}},
poudre:{img:'v_vigor',n:'w.item.poudre.name',em:"💠",cls:"tisseuse",p:65,tox:15,d:'w.item.poudre.desc',use(){C.hst.ichor=3;log(t('w.itemlog.poudre.drink'));}},
voile:{img:'v_mist',n:'w.item.voile.name',em:"🌫️",cls:"tisseuse",p:55,tox:15,d:'w.item.voile.desc',use(){C.hst.chat=3;log(t('w.itemlog.voile.drink'));}},
cristal:{img:'v_crystal',n:'w.item.cristal.name',em:"⚡",cls:"tisseuse",p:60,sfx:"crit",d:'w.item.cristal.desc',use(){blesserEnnemi(14,null,'⚡ '+t('w.item.cristal.name'),false,false);if(!C||C.fini)return;const e=curFoe();if(e&&e.vivant&&e.vole){e.chute++;log(t('w.itemlog.cristal.fly'));}if(e&&e.vivant&&e.pvE>0&&Math.random()<.3){e.st.etourdi=1;log(t('w.itemlog.cristal.stun'));}}},
glyphe:{img:'v_glyph',n:'w.item.glyphe.name',em:"🔯",cls:"tisseuse",p:75,d:'w.item.glyphe.desc',use(){C.meteore=false;S.pv=Math.min(S.pvMax,S.pv+10);log(t('w.itemlog.glyphe.renew'));}},
esprit:{img:'v_mug',n:'w.item.esprit.name',em:"🍺",cls:"mercenaire",p:45,d:'w.item.esprit.desc',use(){S.pv=Math.min(S.pvMax,S.pv+25);C.hst.ichor=Math.max(C.hst.ichor,2);log(t('w.itemlog.esprit.drink'));}},
kvas:{img:'v_mead',n:'w.item.kvas.name',em:"🍯",cls:"mercenaire",p:50,d:'w.item.kvas.desc',use(){C.hst.bouclier+=18;log(t('w.itemlog.kvas.drink'));}},
gnome:{img:'v_mug',n:'w.item.gnome.name',em:"🥃",cls:"mercenaire",p:65,d:'w.item.gnome.desc',use(){C.hst.ichor=3;log(t('w.itemlog.gnome.roar'));}},
runeFoudre:{img:'v_rune',n:'w.item.runeFoudre.name',em:"🪨",cls:"mercenaire",p:70,d:'w.item.runeFoudre.desc',use(){C.rune=true;C.foes.forEach(e=>{if(e.vivant&&e.st.intangible>0){e.st.intangible=0;log(t('w.log.intangibleBreak',{n:t(e.nom)}));}});log(t('w.itemlog.runeFoudre.etch'));}},
runePierre:{img:'v_rune',n:'w.item.runePierre.name',em:"🛡️",cls:"mercenaire",p:60,d:'w.item.runePierre.desc',use(){C.hst.bouclier+=20;log(t('w.itemlog.runePierre.pulse'));}},
runeSang:{img:'v_rune',n:'w.item.runeSang.name',em:"🩸",cls:"mercenaire",p:75,d:'w.item.runeSang.desc',use(){C.hst.vampire=2;log(t('w.itemlog.runeSang.drink'));}},
grappin:{img:'v_bolt',n:'w.item.grappin.name',em:"⛓️",cls:"mercenaire",p:55,sfx:"crit",d:'w.item.grappin.desc',use(){
 const e=curFoe();
 if(!e||!e.vivant)return;
 if(e.vole){e.chute+=2;log(t('w.itemlog.grappin.fly'));}
 else{e.st.etourdi=2;log(t('w.itemlog.grappin.ground'));}
}}, 
carreauArgent:{img:'v_bolt',n:'w.item.carreauArgent.name',em:"🏹",cls:"pisteuse",p:50,sfx:"crit",d:'w.item.carreauArgent.desc',use(){blesserEnnemi(12,null,'🏹 '+t('w.item.carreauArgent.name'),false,false,true);}},
carreauExplosif:{img:'v_bomb',n:'w.item.carreauExplosif.name',em:"💥",cls:"pisteuse",p:60,sfx:"crit",d:'w.item.carreauExplosif.desc',use(){blesserEnnemi(8,null,'💥 '+t('w.item.carreauExplosif.name'),false,false);if(!C||C.fini)return;const e=curFoe();if(e&&e.vivant&&e.vole){e.chute++;log(t('w.itemlog.carreauExplosif.fly'));}if(e&&e.vivant&&e.pvE>0&&Math.random()<.4){e.st.etourdi=1;log(t('w.itemlog.carreauExplosif.stun'));}}},
carreauPoison:{img:'v_toxin',n:'w.item.carreauPoison.name',em:"☠️",cls:"pisteuse",p:55,sfx:"sort",d:'w.item.carreauPoison.desc',use(){blesserEnnemi(6,null,'☠️ '+t('w.item.carreauPoison.name'),false,false);if(!C||C.fini)return;const e=curFoe();if(e&&e.vivant&&e.pvE>0){e.st.poison={d:4,n:3};log(t('w.itemlog.carreauPoison.curare'));}}},
carreauPerforant:{img:'v_bolt',n:'w.item.carreauPerforant.name',em:"🎯",cls:"pisteuse",p:65,sfx:"crit",d:'w.item.carreauPerforant.desc',use(){blesserEnnemi(16,null,'🎯 '+t('w.item.carreauPerforant.name'),false,false);}},
mixture:{img:'v_herb',n:'w.item.mixture.name',em:"🌿",cls:"pisteuse",p:45,tox:15,d:'w.item.mixture.desc',use(){S.pv=Math.min(S.pvMax,S.pv+30);C.hst.regen=6;C.hst.regenN=2;log(t('w.itemlog.mixture.drink'));}},
seve:{img:'v_mist',n:'w.item.seve.name',em:"🌙",cls:"pisteuse",p:55,tox:15,d:'w.item.seve.desc',use(){C.hst.chat=3;log(t('w.itemlog.seve.drink'));}},
elan:{img:'v_vigor',n:'w.item.elan.name',em:"🍃",cls:"pisteuse",p:60,tox:15,d:'w.item.elan.desc',use(){C.hst.ichor=3;log(t('w.itemlog.elan.drink'));}},
bague:{img:'v_rune',n:'w.item.ring.name',em:"💍",kind:'quest',d:'w.item.ring.desc'}
};
function soinClasse(){return{loup:"seve_rouge",tisseuse:"nectar",mercenaire:"esprit",pisteuse:"mixture"}[S.cls];}
function itemClasse(){const ids=Object.keys(OBJETS).filter(id=>OBJETS[id].cls===S.cls&&id!==soinClasse());return pick(ids);}
function donnerSoin(){const id=soinClasse();if((S.sac[id]||0)>0){S.sac[id]--;return true;}return false;}