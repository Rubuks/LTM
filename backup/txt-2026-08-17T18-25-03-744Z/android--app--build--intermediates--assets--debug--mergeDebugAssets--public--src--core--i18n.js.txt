// ============================================================
//  LA GRANDE ROUTE — src/i18n.js
//  Couche de langue, hybride et résiliente. Aucun texte ici.
//  RÈGLE DE CRAFT : commentaires en // uniquement.
// ============================================================
const FALLBACK = 'en';
const LOCALES  = {};
let   DICT     = {};
let   LANG     = (()=>{ try{ return localStorage.getItem('lgr_lang') || 'fr'; }catch(e){ return 'fr'; } })();
function registerLocale(lang, data){
  if(!data || typeof data !== 'object') return;
  LOCALES[lang] = Object.assign(LOCALES[lang] || {}, data);
  if(lang === LANG){ DICT = LOCALES[lang]; applyI18n(); if(SCENE) SCENE.build(); }
}
async function loadLang(lang){
  const m = {};
  for(const file of ['ui','world']){
    try{
      const r = await fetch('locales/' + lang + '/' + file + '.json', {cache:'no-cache'});
      if(r.ok){ const j = await r.json(); if(j && typeof j === 'object') Object.assign(m, j); }
    }catch(e){}
  }
  LOCALES[lang] = Object.assign(m, LOCALES[lang] || {});
  if(lang === LANG){ DICT = LOCALES[lang]; applyI18n(); if(SCENE) SCENE.build(); if(typeof rHud === 'function') rHud(); }
}
function pluralBucket(lang, n){ return (n === 1) ? 'one' : 'other'; }
function t(key, vars){
  if(key && typeof key === 'object' && !Array.isArray(key)){
    const v = (key[LANG] != null) ? key[LANG] : key[FALLBACK];
    return (v == null) ? '' : v;
  }
  if(key == null) return '';
  if(typeof key !== 'string') return String(key);
  let s = DICT[key];
  if(s === undefined) s = (LOCALES[FALLBACK] || {})[key];
  if(s === undefined) s = key;
  if(Array.isArray(s)) return s;
  if(s && typeof s === 'object'){
    const b = (vars && vars.count != null) ? pluralBucket(LANG, vars.count) : null;
    s = (b && s[b] != null) ? s[b] : (s.other != null) ? s.other : (s.one != null) ? s.one : JSON.stringify(s);
  }
  if(vars) s = String(s).replace(/{(\w+)}/g, (_, k) => (vars[k] == null ? '' : vars[k]));
  return s;
}
async function setLang(l){
  LANG = l; try{ localStorage.setItem('lgr_lang', l); }catch(e){}
  await loadLang(l);
  updLang();
}
function updLang(){
  const fr = document.getElementById('lb_fr'), en = document.getElementById('lb_en');
  if(fr) fr.classList.toggle('on', LANG === 'fr');
  if(en) en.classList.toggle('on', LANG === 'en');
  document.documentElement.lang = LANG;
  document.documentElement.dir  = (DICT['_dir'] === 'rtl') ? 'rtl' : 'ltr';
applyI18n();
}
let SCENE = null;
const scene = b => { SCENE = { build: b }; };
function checkLocale(){
  const rep = {};
  for(const lang in LOCALES){
    let ui = 0, world = 0;
    for(const k in LOCALES[lang]){ if(k.indexOf('ui.') === 0) ui++; else if(k.indexOf('w.') === 0) world++; }
    rep[lang] = { ui: ui, world: world, total: Object.keys(LOCALES[lang]).length };
  }
  console.table(rep);
  return rep;
}
function applyI18n(){
document.querySelectorAll('[data-i18n]').forEach(el=>{
const key=el.dataset.i18n;
if(!key)return;
const val=t(key);
if(el.dataset.i18nAttr){el.setAttribute(el.dataset.i18nAttr,val);}else{el.textContent=val;}
});
const titleEl=document.querySelector('title[data-i18n]');
if(titleEl)document.title=t(titleEl.dataset.i18n);
}
window.applyI18n = applyI18n;
window.checkLocale = checkLocale;
window.__I18N_READY = loadLang(LANG).catch(()=>{});