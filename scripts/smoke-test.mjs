#!/usr/bin/env node
// ============================================================
// scripts/smoke-test.mjs — simulation headless du jeu (Node).
// Découvre automatiquement src/content/*/ (act1, act2, …).
// Valide : boot, 4 classes, carte, combat, village, événement,
// sauvegarde/migration, bascule d'acte + injection du contenu.
// ============================================================
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

let dir = path.dirname(fileURLToPath(import.meta.url));
while (dir !== path.dirname(dir) && !existsSync(path.join(dir, 'index.html'))) dir = path.dirname(dir);
const root = dir;

let passed = 0;
const warns = [];
function ok(cond, msg){ if(!cond) throw new Error('ASSERT ÉCHOUE : ' + msg); passed++; }
function warn(msg){ warns.push(msg); }

// ---------- stubs DOM / environnement ----------
function makeEl(tag){
  const el = {
    tag, innerHTML:'', textContent:'', hidden:false, className:'',
    dataset:{}, children:[], scrollTop:0, clientHeight:0, offsetWidth:0, offsetHeight:0,
    style:{ setProperty(){} },
    classList:{
      _s:new Set(),
      add(...a){ a.forEach(x=>el.classList._s.add(x)); },
      remove(...a){ a.forEach(x=>el.classList._s.delete(x)); },
      toggle(x,f){ const on=(f===undefined)?!el.classList._s.has(x):!!f; if(on)el.classList._s.add(x); else el.classList._s.delete(x); return on; },
      contains(x){ return el.classList._s.has(x); }
    },
    setAttribute(){}, getAttribute(){ return null; }, removeAttribute(){},
    appendChild(ch){ el.children.push(ch); return ch; },
    removeChild(){}, remove(){},
    querySelector(){ return makeEl('div'); },
    querySelectorAll(){ return []; },
    addEventListener(){}, removeEventListener(){},
    getBoundingClientRect(){ return {left:0,top:0,right:0,bottom:0,width:0,height:0}; },
    scrollTo(){}, focus(){}, click(){}
  };
  return el;
}
const els = {};
const docStub = {
  body: makeEl('body'), documentElement: makeEl('html'), title:'',
  getElementById(id){ return els[id] || (els[id] = makeEl('div#'+id)); },
  querySelector(){ return makeEl('div'); }, querySelectorAll(){ return []; },
  createElement(t){ return makeEl(t); }, createTextNode(t){ return { textContent:t }; },
  addEventListener(){}, removeEventListener(){}
};
class FakeAC {
  constructor(){ this.state='running'; this.currentTime=0; this.destination={}; }
  createGain(){ return { gain:{ value:0, setValueAtTime(){}, linearRampToValueAtTime(){}, exponentialRampToValueAtTime(){} }, connect(){} }; }
  createOscillator(){ return { type:'', frequency:{ setValueAtTime(){}, exponentialRampToValueAtTime(){} }, connect(){}, start(){}, stop(){} }; }
  createBuffer(ch,n){ return { getChannelData(){ return new Float32Array(n); } }; }
  createBufferSource(){ return { buffer:null, connect(){}, start(){}, stop(){} }; }
  createBiquadFilter(){ return { type:'', frequency:{ value:0 }, connect(){} }; }
  decodeAudioData(){ return Promise.resolve({}); }
  resume(){ return Promise.resolve(); }
}
const lsStub = {
  _m:{},
  getItem(k){ return Object.prototype.hasOwnProperty.call(this._m,k)?this._m[k]:null; },
  setItem(k,v){ this._m[k]=String(v); },
  removeItem(k){ delete this._m[k]; }
};
const sandbox = {
  console, Math, JSON, Object, Array, String, Number, Boolean, RegExp, Date, Set, Map, Symbol, Promise,
  parseInt, parseFloat, isNaN, isFinite,
  setTimeout, clearTimeout, setInterval, clearInterval,
  requestAnimationFrame: ()=>0, cancelAnimationFrame: ()=>{},
  addEventListener(){}, removeEventListener(){},
  navigator:{ vibrate(){}, language:'fr', userAgent:'smoke-test' },
  location:{ href:'smoke' },
  AudioContext: FakeAC, webkitAudioContext: FakeAC,
  fetch: ()=>Promise.reject(new Error('pas de réseau en smoke test')),
  localStorage: lsStub,
  document: docStub,
  __ok: ok, __warn: warn
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

// ---------- chargement ----------
function load(rel){
  const abs = path.join(root, rel);
  if(!existsSync(abs)) return false;
  vm.runInContext(readFileSync(abs,'utf8'), sandbox, { filename: rel });
  return true;
}
function need(rel){ if(!load(rel)){ console.error('✖ fichier requis manquant : '+rel); process.exit(1); } }

// Découverte auto des actes : src/content/act1/, act2/, …
function contentFiles(){
  const out = [];
  const base = path.join(root, 'src', 'content');
  if(!existsSync(base)) return out;
  const order = ['index.js','map.js','bestiary.js','events.js','items.js','music.js'];
  for(const act of readdirSync(base).sort()){
    const d = path.join(base, act);
    let files; try{ files = readdirSync(d); }catch(e){ continue; }
    files = files.filter(f=>f.endsWith('.js'));
    files.sort((a,b)=>{
      const ia=order.indexOf(a), ib=order.indexOf(b);
      return ((ia===-1)?99:ia)-((ib===-1)?99:ib) || a.localeCompare(b);
    });
    for(const f of files) out.push('src/content/'+act+'/'+f);
  }
  return out;
}

try{
  need('src/data/ui.js');
  need('src/core/i18n.js');
  need('src/ui/icons.js');
  need('src/data/bestiary.js');
  need('src/data/items.js');
  need('src/data/events.js');
  need('src/locales/fr/world.js');
  need('src/locales/fr/ui.js');
  load('src/core/registry.js');
  load('src/core/game-data-map.js');
  for(const rel of contentFiles()){ if(!load(rel)) warn('contenu absent : '+rel); }
  load('src/core/item-effects.js');
  load('src/core/content-sync.js');
  load('src/core/music.js');
  need('src/core/utils.js');
  need('src/core/state.js');
  need('src/systems/save.js');
  need('src/systems/map.js');
  need('src/systems/combat.js');
  need('src/systems/village.js');
  need('src/systems/events.js');
  need('src/systems/sac.js');
  need('src/core/acts.js');
  need('src/legacy.js');
}catch(e){
  for(const w of warns) console.warn('⚠ ' + w);
  console.error('✖ Erreur au chargement : '+e.message);
  process.exit(1);
}

// ---------- scénario ----------
const driver = `
(function(){
__ok(typeof newRun==='function','newRun existe');
__ok(typeof genMap==='function','genMap existe');

var classes=['loup','tisseuse','mercenaire','pisteuse'];
for(var ci=0;ci<classes.length;ci++){
  var cls=classes[ci];
  newRun(cls);
  __ok(S&&S.cls===cls,'newRun '+cls+' crée S');
  __ok(S.act==='act1','newRun sans argument = act1');
  var wantCols=(typeof actFinalColumn==='function')?actFinalColumn()+1:12;
  __ok(S.map&&Array.isArray(S.map.nodes)&&S.map.nodes.length===wantCols,'carte = '+wantCols+' colonnes ('+cls+')');
  var v0=S.map.nodes[0][0];
  __ok(v0.type==='village','colonne 0 = village');
  __ok(typeof v0.nom==='string','nom village = clé i18n');
  var last=S.map.nodes[S.map.nodes.length-1];
  __ok(last[0].type==='nid','dernière colonne = nid');
  __ok(S.map.edges.length>0,'edges générés');
  sauvegarder();
  if(typeof SAVE_VERSION!=='undefined'){__ok(S.v===SAVE_VERSION,'sauvegarde versionnée v'+SAVE_VERSION);}
  else{__warn('SAVE_VERSION absent');}
  S=null;
  reprendre();
  __ok(S&&S.cls===cls,'reprendre restaure ('+cls+')');
  var nd=null;
  for(var c=0;c<S.map.nodes.length&&!nd;c++)
    for(var k=0;k<S.map.nodes[c].length;k++)
      if(S.map.nodes[c][k].type==='combat'){nd=S.map.nodes[c][k];break;}
  __ok(!!nd,'nœud combat trouvé');
  if(nd){
    startCombat(nd.enc);
    __ok(C&&C.foes&&C.foes.length>0,'combat démarré');
    __ok(C.foes.every(function(f){return f.pvE>0;}),'foes pvE > 0');
    C=null;
  }
  rVillage(v0);
  __ok(true,'rVillage sans exception');
  if(typeof EVENTS!=='undefined'&&EVENTS.length){rEvent(EVENTS[0]);__ok(true,'rEvent sans exception');}
ouvrirSacHud();
__ok(SCENE&&SCENE.build===rSac,'sac ouvert');
ouvrirBestiaire();
__ok(_FROM_BEST!==rSac,'bestiaire : origine transférée (pas le sac)');
ouvrirSacHud();
__ok(_FROM_SAC!==rSac&&_FROM_SAC!==rBestiaire,'sac : origine = écran précédent');
fermerSac();
__ok(SCENE.build!==rSac&&SCENE.build!==rBestiaire,'fermeture sac -> écran original');

  localStorage.removeItem(KEY);
}

// ---- Acte II : enregistrement + bascule + injection ----
if(typeof actDef==='function'&&actDef('act2')){
startAct('act2');
__ok(S&&S.act==='act2','startAct bascule sur act2');
__ok(typeof choisirChemin==='function','choisirChemin existe');
choisirChemin('route');
__ok(S.chemin==='route','chemin choisi');
__ok(S.map&&S.map.nodes.length===16,'carte act2 route = 16 colonnes');
__ok(!!MONSTRES[GameData.maps.act2.bossId],'boss du chemin injecté');
__ok(S.map.nodes[S.map.nodes.length-1][0].type==='nid','nid act2 = boss du chemin');
__ok(S.map.nodes[S.map.nodes.length-1][0].m===GameData.maps.act2.bossId,'nid porte le bon boss');
localStorage.removeItem(KEY);
} else { __warn('act2 non chargé dans le smoke test'); }

// ---- migrations de sauvegarde ----
if(typeof migrateSave==='function'){
  var old={cls:'loup',pv:50,pvMax:72,or:10,map:{nodes:[[{type:'village',c:0,nom:{fr:'X',en:'Y'}}]]}};
  var m=migrateSave(old);
  __ok(m.v===2,'migrateSave v1 -> v2');
  __ok(typeof m.map.nodes[0][0].nom==='string','migrateSave convertit les noms de villages');
}else{
  __warn('migrateSave absent');
}
})();
`;

try{
  vm.runInContext(driver, sandbox, { filename: 'smoke-driver' });
}catch(e){
  for(const w of warns) console.warn('⚠ ' + w);
  console.error('✖ ' + e.message);
  process.exit(1);
}

console.log('--- smoke-test ---');
console.log('✔ ' + passed + ' assertion(s) passée(s)');
for(const w of warns) console.warn('⚠ ' + w);
console.log('\n✅ Smoke test OK');