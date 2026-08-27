// ============================================================
// LA GRANDE ROUTE — src/data/events.js
// Acte I : événements refondus (bonne / mauvaise / neutre +
// choix signature de classe + verrous de réputation).
// ============================================================
const EVENTS=[
{titre:'w.event.chained.title',em:'⛓️',img:'chained',txt:'w.event.chained.txt',choix:[
{t:'w.event.chained.c0t',d:'w.event.chained.c0d',eff:()=>({txt:'w.event.chained.c0eff',or:15})},
{t:'w.event.chained.c1t',d:'w.event.chained.c1d',eff:()=>{S.rep++;S.flags.fleau_epargne=true;return{txt:'w.event.chained.c1eff'};}},
{t:'w.event.chained.c2t',d:'w.event.chained.c2d',eff:()=>({txt:'w.event.chained.c2eff'})},
{t:'w.event.chained.c3t',d:'w.event.chained.c3d',cls:'loup',eff:()=>{if(window.addRep)addRep(-1);return{txt:'w.event.chained.c3eff',or:40};}},
{t:'w.event.chained.c4t',d:'w.event.chained.c4d',cls:'pisteuse',eff:()=>({txt:'w.event.chained.c4eff',combat:'fouisseur',heroique:true})}]},
{titre:'w.event.well.title',em:'🕳️',img:'well',txt:'w.event.well.txt',choix:[
{t:'w.event.well.c0t',d:'w.event.well.c0d',eff:()=>{S.rep++;S.flags.puits_net=true;return{txt:'w.event.well.c0eff'};}},
{t:'w.event.well.c1t',d:'w.event.well.c1d',eff:()=>{if(Math.random()<.5){S.pv=Math.min(S.pvMax,S.pv+12);return{txt:'w.event.well.c1effOk'};}S.pv=Math.max(1,S.pv-10);S.tox+=15;return{txt:'w.event.well.c1effNo'};}},
{t:'w.event.well.c2t',d:'w.event.well.c2d',eff:()=>({txt:'w.event.well.c2eff'})},
{t:'w.event.well.c3t',d:'w.event.well.c3d',cls:'tisseuse',eff:()=>{S.rep++;S.beni=true;return{txt:'w.event.well.c3eff'};}},
{t:'w.event.well.c4t',d:'w.event.well.c4d',cls:'mercenaire',eff:()=>{S.rep++;return{txt:'w.event.well.c4eff',or:35};}}]},
{titre:'w.event.convoy.title',em:'🛺',img:'convoy',txt:'w.event.convoy.txt',choix:[
{t:'w.event.convoy.c0t',d:'w.event.convoy.c0d',eff:()=>{if(S.flags.village_decime_nom){if(window.addRep)addRep(-1);return{txt:t('w.event.convoy.c0effRuined',{name:S.flags.village_decime_nom})};}S.rep++;return{txt:'w.event.convoy.c0effOk',or:25};}},
{t:'w.event.convoy.c1t',d:'w.event.convoy.c1d',eff:()=>{S.rep++;S.beni=true;return{txt:'w.event.convoy.c1eff'};}},
{t:'w.event.convoy.c2t',d:'w.event.convoy.c2d',eff:()=>({txt:'w.event.convoy.c2eff'})},
{t:'w.event.convoy.c3t',d:'w.event.convoy.c3d',cls:'mercenaire',eff:()=>({txt:'w.event.convoy.c3eff',or:30,combat:'brumeux'})},
{t:'w.event.convoy.c4t',d:'w.event.convoy.c4d',repMax:-1,eff:()=>{if(window.addRep)addRep(-2);return{txt:'w.event.convoy.c4eff',or:60};}}]},
{titre:'w.event.bandit.title',em:'🩹',img:'bandit',txt:'w.event.bandit.txt',choix:[
{t:'w.event.bandit.c0t',d:'w.event.bandit.c0d',eff:()=>{if(donnerSoin()){return{txt:'w.event.bandit.c0effOk',or:55};}return{txt:'w.event.bandit.c0effNo'};}},
{t:'w.event.bandit.c1t',d:'w.event.bandit.c1d',eff:()=>{if(window.addRep)addRep(-1);return{txt:'w.event.bandit.c1eff',or:40};}},
{t:'w.event.bandit.c2t',d:'w.event.bandit.c2d',eff:()=>({txt:'w.event.bandit.c2eff',heroique:true})},
{t:'w.event.bandit.c3t',d:'w.event.bandit.c3d',cls:'tisseuse',eff:()=>{S.rep++;return{txt:'w.event.bandit.c3eff',or:30};}},
{t:'w.event.bandit.c4t',d:'w.event.bandit.c4d',cls:'loup',eff:()=>({txt:'w.event.bandit.c4eff',or:25})}]},
{titre:'w.event.hanged.title',em:'🪢',img:'hanged',txt:'w.event.hanged.txt',choix:[
{t:'w.event.hanged.c0t',d:'w.event.hanged.c0d',eff:()=>{S.rep++;return{txt:'w.event.hanged.c0eff',or:40};}},
{t:'w.event.hanged.c1t',d:'w.event.hanged.c1d',eff:()=>({txt:'w.event.hanged.c1eff',combat:'brigand'})},
{t:'w.event.hanged.c2t',d:'w.event.hanged.c2d',eff:()=>{if(window.addRep)addRep(-1);return{txt:'w.event.hanged.c2eff'};}},
{t:'w.event.hanged.c3t',d:'w.event.hanged.c3d',cls:'mercenaire',eff:()=>{S.rep++;return{txt:'w.event.hanged.c3eff',or:40};}},
{t:'w.event.hanged.c4t',d:'w.event.hanged.c4d',cls:'tisseuse',eff:()=>{S.rep++;return{txt:'w.event.hanged.c4eff',or:20};}}]},
{titre:'w.event.pillaged.title',em:'🔥',img:'pillaged',txt:'w.event.pillaged.txt',choix:[
{t:'w.event.pillaged.c0t',d:'w.event.pillaged.c0d',eff:()=>({txt:'w.event.pillaged.c0eff',combat:'fouisseur',heroique:true})},
{t:'w.event.pillaged.c1t',d:'w.event.pillaged.c1d',eff:()=>({txt:'w.event.pillaged.c1eff'})},
{t:'w.event.pillaged.c2t',d:'w.event.pillaged.c2d',cls:'loup',eff:()=>{S.rep++;return{txt:'w.event.pillaged.c2eff'};}},
{t:'w.event.pillaged.c3t',d:'w.event.pillaged.c3d',repMax:-1,eff:()=>{if(window.addRep)addRep(-1);return{txt:'w.event.pillaged.c3eff',or:45};}}]},
{titre:'w.event.drowned.title',em:'🌊',img:'drowned',txt:'w.event.drowned.txt',choix:[
{t:'w.event.drowned.c0t',d:'w.event.drowned.c0d',eff:()=>({txt:'w.event.drowned.c0eff',combat:'spectre'})},
{t:'w.event.drowned.c1t',d:'w.event.drowned.c1d',eff:()=>{if(Math.random()<.5){S.rep++;return{txt:'w.event.drowned.c1effOk'};}return{txt:'w.event.drowned.c1effNo',combat:'spectre'};}},
{t:'w.event.drowned.c2t',d:'w.event.drowned.c2d',eff:()=>({txt:'w.event.drowned.c2eff'})},
{t:'w.event.drowned.c3t',d:'w.event.drowned.c3d',cls:'tisseuse',eff:()=>{S.rep++;S.beni=true;return{txt:'w.event.drowned.c3eff'};}},
{t:'w.event.drowned.c4t',d:'w.event.drowned.c4d',cls:'pisteuse',eff:()=>{S.rep++;return{txt:'w.event.drowned.c4eff',or:30};}}]},
{titre:'w.event.toll.title',em:'⛺',img:'toll',txt:'w.event.toll.txt',choix:[
{t:'w.event.toll.c0t',d:'w.event.toll.c0d',eff:()=>{if(S.or>=50){S.or-=50;return{txt:'w.event.toll.c0effOk'};}return{txt:'w.event.toll.c0effNo',combat:'brigand'};}},
{t:'w.event.toll.c1t',d:'w.event.toll.c1d',eff:()=>({txt:'w.event.toll.c1eff',combat:'brigand'})},
{t:'w.event.toll.c2t',d:'w.event.toll.c2d',eff:()=>{if(Math.random()<.6){return{txt:'w.event.toll.c2effOk'};}return{txt:'w.event.toll.c2effNo',combat:'brigand'};}},
{t:'w.event.toll.c3t',d:'w.event.toll.c3d',cls:'mercenaire',eff:()=>({txt:'w.event.toll.c3eff'})},
{t:'w.event.toll.c4t',d:'w.event.toll.c4d',cls:'pisteuse',eff:()=>({txt:'w.event.toll.c4eff',combat:'noye'})}]},
{titre:'w.event.circle.title',em:'🗿',img:'circle',txt:'w.event.circle.txt',choix:[
{t:'w.event.circle.c0t',d:'w.event.circle.c0d',eff:()=>{S.pv=Math.min(S.pvMax,S.pv+22);return{txt:'w.event.circle.c0eff'};}},
{t:'w.event.circle.c1t',d:'w.event.circle.c1d',eff:()=>{S.pv=Math.max(1,S.pv-20);return{txt:'w.event.circle.c1eff',or:90};}},
{t:'w.event.circle.c2t',d:'w.event.circle.c2d',eff:()=>({txt:'w.event.circle.c2eff'})},
{t:'w.event.circle.c3t',d:'w.event.circle.c3d',cls:'tisseuse',eff:()=>{S.pv=Math.max(1,S.pv-8);S.beni=true;S.tox+=10;return{txt:'w.event.circle.c3eff'};}},
{t:'w.event.circle.c4t',d:'w.event.circle.c4d',cls:'mercenaire',eff:()=>{S.rep++;S.beni=true;return{txt:'w.event.circle.c4eff'};}}]},
{titre:'w.event.goulenest.title',em:'🥚',img:'goulenest',txt:'w.event.goulenest.txt',choix:[
{t:'w.event.goulenest.c0t',d:'w.event.goulenest.c0d',eff:()=>({txt:'w.event.goulenest.c0eff'})},
{t:'w.event.goulenest.c1t',d:'w.event.goulenest.c1d',eff:()=>({txt:'w.event.goulenest.c1eff',combat:'goule'})},
{t:'w.event.goulenest.c2t',d:'w.event.goulenest.c2d',req:'poudre_aveuglante',consume:'poudre_aveuglante',eff:()=>{S.rep++;return{txt:'w.event.goulenest.c2eff',or:70};}},
{t:'w.event.goulenest.c3t',d:'w.event.goulenest.c3d',cls:'loup',eff:()=>{S.rep++;return{txt:'w.event.goulenest.c3eff'};}},
{t:'w.event.goulenest.c4t',d:'w.event.goulenest.c4d',repMax:-1,eff:()=>{if(window.addRep)addRep(-1);return{txt:'w.event.goulenest.c4eff',or:70};}}]},
{titre:'w.event.deserter.title',em:'🪖',img:'deserter',txt:'w.event.deserter.txt',choix:[
{t:'w.event.deserter.c0t',d:'w.event.deserter.c0d',eff:()=>{if(donnerSoin()){S.beni=true;return{txt:'w.event.deserter.c0effOk'};}return{txt:'w.event.deserter.c0effNo'};}},
{t:'w.event.deserter.c1t',d:'w.event.deserter.c1d',eff:()=>({txt:'w.event.deserter.c1eff',or:25})},
{t:'w.event.deserter.c2t',d:'w.event.deserter.c2d',eff:()=>{S.pv=Math.max(1,S.pv-15);return{txt:'w.event.deserter.c2eff',or:60};}},
{t:'w.event.deserter.c3t',d:'w.event.deserter.c3d',cls:'mercenaire',eff:()=>{S.rep++;return{txt:'w.event.deserter.c3eff',or:20};}},
{t:'w.event.deserter.c4t',d:'w.event.deserter.c4d',cls:'pisteuse',eff:()=>({txt:'w.event.deserter.c4eff',combat:'brigand'})}]},
{titre:'w.event.herbalist.title',em:'🌿',npc:'herboriste',img:'herbalist',txt:'w.event.herbalist.txt',choix:[
{t:'w.event.herbalist.c0t',d:'w.event.herbalist.c0d',eff:()=>{const id=soinClasse();S.sac[id]=(S.sac[id]||0)+1;return{txt:t('w.event.herbalist.c0eff',{name:t(OBJETS[id].n)})};}},
{t:'w.event.herbalist.c1t',d:'w.event.herbalist.c1d',eff:()=>{if(S.or>=30){S.or-=30;const id=itemClasse();S.sac[id]=(S.sac[id]||0)+1;return{txt:t('w.event.herbalist.c1effOk',{name:t(OBJETS[id].n)})};}return{txt:'w.event.herbalist.c1effNo'};}},
{t:'w.event.herbalist.c2t',d:'w.event.herbalist.c2d',eff:()=>({txt:'w.event.herbalist.c2eff'})},
{t:'w.event.herbalist.c3t',d:'w.event.herbalist.c3d',cls:'tisseuse',eff:()=>{const id=itemClasse();S.sac[id]=(S.sac[id]||0)+1;return{txt:t('w.event.herbalist.c3eff',{name:t(OBJETS[id].n)})};}},
{t:'w.event.herbalist.c4t',d:'w.event.herbalist.c4d',cls:'loup',eff:()=>{S.sac.hnecro=(S.sac.hnecro||0)+1;return{txt:t('w.event.herbalist.c4eff',{name:t(OBJETS.hnecro.n)})};}}]}
];
