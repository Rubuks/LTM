#!/usr/bin/env node
// ============================================================
// scripts/apply-phase5-music.mjs
// Phase 5 : moteur musical (procédural + fichiers par acte).
// Ne touche pas au CSS.
// ============================================================

import {
  readFileSync,
  writeFileSync,
  existsSync,
  copyFileSync,
  mkdirSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const changes = [];
const warnings = [];

const paths = {
  index: path.join(root, 'index.html'),
  legacy: path.join(root, 'src', 'legacy.js'),
  music: path.join(root, 'src', 'core', 'music.js'),
  frUi: path.join(root, 'src', 'locales', 'fr', 'ui.js'),
  enUi: path.join(root, 'src', 'locales', 'en', 'ui.js'),
};

function fail(m) { console.error(`✖ ${m}`); process.exit(1); }
function backup(p) { if (existsSync(p)) copyFileSync(p, `${p}.bak`); }
function read(p) { if (!existsSync(p)) fail(`Fichier introuvable : ${p}`); return readFileSync(p, 'utf8'); }

function replaceIn(target, oldStr, newStr, id) {
  if (target.content.includes(newStr)) { changes.push(`[${target.label}] déjà appliqué : ${id}`); return; }
  if (!target.content.includes(oldStr)) { warnings.push(`[${target.label}] motif introuvable : ${id}`); return; }
  target.content = target.content.split(oldStr).join(newStr);
  changes.push(`[${target.label}] appliqué : ${id}`);
}

function addLocaleKey(target, key, value) {
  if (target.content.includes(`"${key}"`)) { changes.push(`[${target.label}] clé déjà présente : ${key}`); return; }
  const idx = target.content.lastIndexOf('}');
  if (idx === -1) { warnings.push(`[${target.label}] accolade fermante introuvable`); return; }
  const before = target.content.slice(0, idx);
  const trimmed = before.trimEnd();
  let suffix = '';
  if (!before.endsWith('\n')) suffix += '\n';
  if (trimmed.length && !trimmed.endsWith(',')) suffix += ',\n';
  suffix += `"${key}": ${value},\n`;
  target.content = before + suffix + target.content.slice(idx);
  changes.push(`[${target.label}] clé ajoutée : ${key}`);
}

// ============================================================
// src/core/music.js
// ============================================================

const musicJs = `
// ============================================================
// LA GRANDE ROUTE — src/core/music.js
// Moteur musical : fichiers si présents, sinon génératif WebAudio.
// Aucun texte. Scènes : title, map, village, combat, boss,
// victory, defeat. Overridable par acte via GameData.music.
// ============================================================
window.MUS = window.MUS || { on: true, vol: .5, wanted: 'title' };
try { MUS.on = localStorage.getItem('lgr_mus') !== '0'; } catch (e) {}

window.GameData = window.GameData || {};
if (!window.GameData.music) window.GameData.music = {};
if (!window.GameData.music.base || !Object.keys(window.GameData.music.base).length) {
  window.GameData.music.base = {
    title: { mood: 'title' }, map: { mood: 'map' }, village: { mood: 'village' },
    combat: { mood: 'combat' }, boss: { mood: 'boss' },
    victory: { mood: 'victory' }, defeat: { mood: 'defeat' }
  };
}

let MCTX = null, master = null, schedTimer = null, curFile = null, curKey = null;
let step = 0, nextT = 0, deg = 0, unlocked = false;

const MOODS = {
  title:   { bpm: 72,  root: 57, scale: [0,2,3,5,7,9,10],  pad:1, bell:1, drone:1, perc:0, bass:1 },
  map:     { bpm: 84,  root: 55, scale: [0,2,3,5,7,8,10],  pad:0, bell:1, drone:1, perc:0, bass:1 },
  village: { bpm: 96,  root: 60, scale: [0,2,4,5,7,9,10],  pad:1, bell:1, drone:0, perc:0, bass:1 },
  combat:  { bpm: 138, root: 52, scale: [0,1,3,5,7,8,10],  pad:0, bell:0, drone:0, perc:1, bass:1, arp:1 },
  boss:    { bpm: 112, root: 50, scale: [0,1,3,5,6,8,10],  pad:1, bell:0, drone:1, perc:1, bass:1 },
  victory: { bpm: 100, root: 60, scale: [0,2,4,5,7,9,11],  pad:1, bell:1, drone:0, perc:0, bass:1 },
  defeat:  { bpm: 60,  root: 45, scale: [0,1,3,5,7,8,10],  pad:1, bell:0, drone:1, perc:0, bass:0 }
};

function mctx() {
  if (!MCTX) {
    MCTX = new (window.AudioContext || window.webkitAudioContext)();
    master = MCTX.createGain();
    master.gain.value = MUS.vol * .6;
    master.connect(MCTX.destination);
  }
  return MCTX;
}

const freq = m => 440 * Math.pow(2, (m - 69) / 12);

function tone(t, m, dur, type, vol) {
  const c = mctx(), o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(freq(m), t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + .02);
  g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(g); g.connect(master);
  o.start(t); o.stop(t + dur + .05);
}

function thump(t, vol) {
  const c = mctx(), o = c.createOscillator(), g = c.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(120, t);
  o.frequency.exponentialRampToValueAtTime(40, t + .12);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(.0001, t + .15);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + .2);
}

function tickNoise(t, vol) {
  const c = mctx(), n = Math.floor(c.sampleRate * .06);
  const b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const s = c.createBufferSource(), g = c.createGain(), f = c.createBiquadFilter();
  f.type = 'highpass'; f.frequency.value = 6000;
  s.buffer = b; g.gain.value = vol;
  s.connect(f); f.connect(g); g.connect(master);
  s.start(t);
}

function schedule(s, t, M, spb) {
  const L = M.scale.length;
  if (M.drone && s === 0) tone(t, M.root - 12, spb * 32, 'sine', .12);
  if (M.pad && s % 32 === 0) [0, 2, 4].forEach(iv => tone(t, M.root + M.scale[iv % L], spb * 30, 'triangle', .05));
  if (M.bass && s % 8 === 0) tone(t, M.root - 12 + (s % 16 === 8 ? M.scale[4] : 0), spb * 6, 'triangle', .16);
  if (M.arp && s % 2 === 0) tone(t, M.root + 12 + M.scale[(s * 3) % L], spb * 1.8, 'square', .045);
  if (M.bell && s % 2 === 0 && Math.random() < .38) {
    deg = Math.max(0, Math.min(L * 2 - 1, deg + (Math.floor(Math.random() * 5) - 2)));
    tone(t, M.root + 12 + M.scale[deg % L] + (deg >= L ? 12 : 0), spb * 6, 'sine', .09);
  }
  if (M.perc) {
    if (s % 16 === 0) thump(t, .22);
    if (s % 8 === 4) tickNoise(t, .06);
    if (s % 4 === 2) tickNoise(t, .03);
  }
}

function startProc(mood) {
  const c = mctx();
  step = 0; deg = 0;
  nextT = c.currentTime + .1;
  schedTimer = setInterval(() => {
    const M = MOODS[mood] || MOODS.map;
    const spb = 60 / M.bpm / 4;
    while (nextT < c.currentTime + .6) {
      schedule(step, nextT, M, spb);
      step = (step + 1) % 64;
      nextT += spb;
    }
  }, 200);
}

function stopAll() {
  if (schedTimer) { clearInterval(schedTimer); schedTimer = null; }
  if (curFile) { try { curFile.stop(); } catch (e) {} curFile = null; }
}

function resolveTrack(key) {
  const mus = (window.GameData || {}).music || {};
  const act = (typeof currentActId === 'function') ? currentActId() : 'act1';
  return (mus[act] && mus[act][key]) || (mus.base && mus.base[key]) || { mood: key };
}

function playFile(tr, key) {
  fetch(tr.file)
    .then(r => { if (!r.ok) throw 0; return r.arrayBuffer(); })
    .then(buf => mctx().decodeAudioData(buf))
    .then(audioBuf => {
      if (MUS.wanted !== key || !MUS.on) return;
      const c = mctx(), src = c.createBufferSource(), g = c.createGain();
      src.buffer = audioBuf; src.loop = true; g.gain.value = .8;
      src.connect(g); g.connect(master); src.start();
      curFile = src;
    })
    .catch(() => { curKey = null; startProc(tr.mood || key); });
}

function play(key) {
  if (curKey === key && (curFile || schedTimer)) return;
  stopAll();
  curKey = key;
  const tr = resolveTrack(key);
  if (tr.file) playFile(tr, key);
  else startProc(tr.mood || key);
}

window.mus = function (key) {
  MUS.wanted = key;
  if (MUS.on && unlocked) play(key);
};

window.musToggle = function () {
  MUS.on = !MUS.on;
  try { localStorage.setItem('lgr_mus', MUS.on ? '1' : '0'); } catch (e) {}
  if (MUS.on) {
    unlocked = true;
    const c = mctx();
    if (c.state === 'suspended') c.resume();
    play(MUS.wanted);
  } else {
    stopAll();
    curKey = null;
  }
  if (typeof sfx === 'function') sfx('clic');
  if (typeof rHud === 'function') rHud();
};

function unlock() {
  unlocked = true;
  const c = mctx();
  if (c.state === 'suspended') c.resume();
  if (MUS.on) play(MUS.wanted);
  document.removeEventListener('pointerdown', unlock);
  document.removeEventListener('keydown', unlock);
}
document.addEventListener('pointerdown', unlock);
document.addEventListener('keydown', unlock);
`;

backup(paths.music);
mkdirSync(path.dirname(paths.music), { recursive: true });
writeFileSync(paths.music, musicJs.trim() + '\n', 'utf8');
changes.push('src/core/music.js créé/mis à jour');

// ============================================================
// index.html : chargement avant legacy
// ============================================================

const index = { label: 'index', content: read(paths.index) };

const musicTag = '<script src="src/core/music.js"></script>';
const legacyTag = '<script src="src/legacy.js"></script>';

if (!index.content.includes(musicTag)) {
  if (!index.content.includes(legacyTag)) {
    warnings.push('[index] balise legacy.js introuvable');
  } else {
    index.content = index.content.replace(legacyTag, musicTag + '\n' + legacyTag);
    changes.push('[index] music.js inséré avant legacy.js');
  }
} else {
  changes.push('[index] music.js déjà chargé');
}

writeFileSync(paths.index, index.content, 'utf8');

// ============================================================
// legacy.js : hooks de scènes + bouton mute HUD
// ============================================================

const legacy = { label: 'legacy', content: read(paths.legacy) };

replaceIn(legacy,
  'scene(rTitre);rHud();const sv=charger();',
  'scene(rTitre);rHud();try{mus(\'title\')}catch(e){}const sv=charger();',
  'mus title');

replaceIn(legacy,
  'function rCarte(){C=null;scene(rCarte);rHud();const dispo=nextIds();',
  'function rCarte(){C=null;scene(rCarte);rHud();try{mus(\'map\')}catch(e){}const dispo=nextIds();',
  'mus map');

replaceIn(legacy,
  'scene(()=>rVillage(ND));rHud();let decime=false;',
  'scene(()=>rVillage(ND));rHud();try{mus(\'village\')}catch(e){}let decime=false;',
  'mus village');

replaceIn(legacy,
  'const foes=enc.foes.map((k,i)=>makeFoe(k,i,eliteIdx));',
  'const foes=enc.foes.map((k,i)=>makeFoe(k,i,eliteIdx));try{mus(foes.some(e=>e.boss)?\'boss\':\'combat\')}catch(e){}',
  'mus combat/boss');

replaceIn(legacy,
  'function viewVictory(){ec.innerHTML=',
  'function viewVictory(){try{mus(\'victory\')}catch(e){}ec.innerHTML=',
  'mus victory');

replaceIn(legacy,
  'function viewDefeat(){ec.innerHTML=',
  'function viewDefeat(){try{mus(\'defeat\')}catch(e){}ec.innerHTML=',
  'mus defeat');

replaceIn(legacy,
  'function viewActe(){ec.innerHTML=cineBg(\'cin_title\')',
  'function viewActe(){try{mus(\'victory\')}catch(e){}ec.innerHTML=cineBg(\'cin_title\')',
  'mus acte');

replaceIn(legacy,
  'title="${t(\'ui.best.title\')}">📖</button>',
  'title="${t(\'ui.best.title\')}">📖</button><button onclick="window.musToggle&&musToggle()" style="background:none;border:none;padding:0;cursor:pointer;font-size:1.2rem;line-height:1;opacity:.9" title="${t(\'ui.hud.music\')}">${(window.MUS&&MUS.on)?\'🎵\':\'🔇\'}</button>',
  'bouton mute HUD');

backup(paths.legacy);
writeFileSync(paths.legacy, legacy.content, 'utf8');

// ============================================================
// Locales : libellé du bouton
// ============================================================

const frUi = { label: 'fr/ui', content: read(paths.frUi) };
const enUi = { label: 'en/ui', content: read(paths.enUi) };

addLocaleKey(frUi, 'ui.hud.music', '"Musique"');
addLocaleKey(enUi, 'ui.hud.music', '"Music"');

backup(paths.frUi);
backup(paths.enUi);
writeFileSync(paths.frUi, frUi.content, 'utf8');
writeFileSync(paths.enUi, enUi.content, 'utf8');

// ============================================================
// Rapport
// ============================================================

console.log('--- apply-phase5-music ---');
for (const c of changes) console.log(`✔ ${c}`);

if (warnings.length) {
  console.warn('');
  for (const w of warnings) console.warn(`⚠ ${w}`);
  console.warn(`\n${warnings.length} avertissement(s).`);
  process.exitCode = 1;
} else {
  console.log('\n✅ Phase 5 appliquée.');
}