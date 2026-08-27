#!/usr/bin/env node
// ============================================================
// scripts/apply-title-tome.mjs
// Remplace la tête de loup du titre par un livre + plume gravé.
// ============================================================
import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let dir = path.dirname(fileURLToPath(import.meta.url));
while (dir !== path.dirname(dir) && !existsSync(path.join(dir, 'index.html'))) dir = path.dirname(dir);
const root = dir;
const changes = [], warnings = [];

// Symbole gravé : livre ouvert + plume d'oie
const TOME = '<path d="M3.5 20v-8.5c2.8-1.4 5.7-1.4 8.5 0 2.8-1.4 5.7-1.4 8.5 0V20"/><path d="M3.5 20c2.8-1.4 5.7-1.4 8.5 0 2.8-1.4 5.7-1.4 8.5 0"/><path d="M12 11.5V20"/><path d="M6 14c1.5-.5 3-.5 4.5 0M6 16.5c1.5-.5 3-.5 4.5 0" stroke-width="1" opacity=".7"/><path d="M20.5 2.5c-5.2 1-8.8 3.9-10.6 8.4l-.5 1.8 1.9-.4c4.7-1.7 7.8-5.2 9.2-9.8z"/><path d="M9.4 12.7L7.8 15.8"/><circle cx="7.6" cy="16.2" r=".8" fill="currentColor" stroke="none"/><path d="M14.5 5.5l1.7 1.2M12.4 7.6l1.7 1.2" stroke-width="1" opacity=".7"/>';

// ---------- 1) icons.js : ajoute ICONS.tome ----------
{
  const p = path.join(root, 'src', 'ui', 'icons.js');
  if (!existsSync(p)) { warnings.push('icons.js introuvable'); }
  else {
    copyFileSync(p, p + '.bak');
    let c = readFileSync(p, 'utf8');
    if (c.includes('ICONS.tome')) changes.push('déjà : ICONS.tome');
    else {
      c += "\nif(!ICONS.tome){ICONS.tome='" + TOME + "';}\n";
      writeFileSync(p, c, 'utf8');
      changes.push('ok : ICONS.tome ajouté');
    }
  }
}

// ---------- 2) index.html : splash avec le livre+plume ----------
{
  const p = path.join(root, 'index.html');
  if (!existsSync(p)) { warnings.push('index.html introuvable'); }
  else {
    copyFileSync(p, p + '.bak');
    let h = readFileSync(p, 'utf8');
    if (h.includes('M3.5 20v-8.5')) changes.push('déjà : splash tome');
    else {
      const s1 = h.indexOf('<div class="pl"><svg');
      const s2 = h.indexOf('</svg>', s1);
      if (s1 !== -1 && s2 !== -1) {
        const openEnd = h.indexOf('>', h.indexOf('<svg', s1)) + 1;
        h = h.slice(0, openEnd) + TOME + h.slice(s2);
        writeFileSync(p, h, 'utf8');
        changes.push('ok : splash livre+plume');
      } else warnings.push('splash svg introuvable');
    }
  }
}

// ---------- 3) legacy.js : sceau du titre ----------
{
  const p = path.join(root, 'src', 'legacy.js');
  if (!existsSync(p)) { warnings.push('legacy.js introuvable'); }
  else {
    copyFileSync(p, p + '.bak');
    let c = readFileSync(p, 'utf8');
    const oldS = "tp-seal\">${ico('wolf')}";
    const newS = "tp-seal\">${ico('tome')}";
    if (c.includes(newS)) changes.push('déjà : sceau tome');
    else if (c.includes(oldS)) {
      c = c.split(oldS).join(newS);
      writeFileSync(p, c, 'utf8');
      changes.push('ok : sceau titre livre+plume');
    } else warnings.push('tp-seal introuvable');
  }
}

console.log('--- apply-title-tome ---');
for (const s of changes) console.log('✔ ' + s);
if (warnings.length) { console.warn(''); for (const w of warnings) console.warn('⚠ ' + w); process.exitCode = 1; }
else console.log('\n✅ Titre : livre + plume gravés.');