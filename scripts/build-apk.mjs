#!/usr/bin/env node
// ============================================================
// scripts/build-apk.mjs
// Prépare un dossier www/ propre pour Capacitor.
// ============================================================
import { writeFileSync, existsSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

const CAP_CONFIG = `{
  "appId": "com.lesterresmornes.app",
  "appName": "Les Terres Mornes",
  "webDir": "www",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https"
  },
  "android": {
    "allowMixedContent": true,
    "captureInput": true,
    "webContentsDebuggingEnabled": false
  }
}`;

// Nettoyer et recréer www/
if (existsSync('www')) {
  rmSync('www', { recursive: true, force: true });
}
mkdirSync('www');
console.log('✔ Dossier www/ créé');

// Copier index.html
cpSync('index.html', 'www/index.html');
console.log('✔ index.html copié');

// Copier les dossiers nécessaires
const dirs = ['src', 'assets'];
for (const dir of dirs) {
  if (existsSync(dir)) {
    cpSync(dir, path.join('www', dir), { recursive: true });
    console.log(`✔ ${dir}/ copié`);
  }
}

console.log('\n🔒 Obfuscation du code...');
try {
  execSync('npm run obfuscate', { stdio: 'inherit' });
} catch (e) {
  console.warn('⚠️  Échec de l\'obfuscation, build continué...');
}

// Créer capacitor.config.json
writeFileSync('capacitor.config.json', CAP_CONFIG, 'utf8');
console.log('✔ capacitor.config.json créé (webDir: "www")');

console.log('\n📦 Synchronisation Capacitor...');
try {
  execSync('npx cap sync android', { stdio: 'inherit' });
  console.log('\n✅ Sync terminé !');
  console.log('\nProchaines étapes :');
  console.log('   npx cap open android');
  console.log('   → Build → Build Bundle(s) / APK(s) → Build APK(s)');
  console.log('\nL\'APK sera dans : android/app/build/outputs/apk/debug/app-debug.apk');
} catch (e) {
  console.error('✖ Erreur sync:', e.message);
  process.exit(1);
}