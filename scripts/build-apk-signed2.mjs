#!/usr/bin/env node
// ============================================================
// scripts/build-apk-signed.mjs (v3)
// Build APK signé à partir de ./dist (code obfusqué).
// - vérifie dist/index.html (+ copie assets/ si manquants)
// - capacitor webDir = "dist"
// - keystore + signature release + assembleRelease
// ============================================================
import { existsSync, mkdirSync, cpSync, writeFileSync, readFileSync, copyFileSync, readdirSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import path from 'node:path';
import crypto from 'node:crypto';

const IS_WIN = process.platform === 'win32';
const GRADLEW = IS_WIN ? 'gradlew.bat' : './gradlew';

function log(s){ console.log('\x1b[36m▶\x1b[0m ' + s); }
function ok(s){ console.log('\x1b[32m✔\x1b[0m ' + s); }
function warn(s){ console.warn('\x1b[33m⚠\x1b[0m ' + s); }
function err(s){ console.error('\x1b[31m✖\x1b[0m ' + s); }
function ask(q){ return new Promise(res => { const rl = createInterface({ input: process.stdin, output: process.stdout }); rl.question(q, a => { rl.close(); res(a); }); }); }
function run(cmd, opts={}){ const r = spawnSync(cmd, { shell: true, stdio: opts.silent ? 'pipe' : 'inherit' }); if (r.status !== 0) throw new Error('Commande échouée : ' + cmd); }

// ---------- 0) Détection JDK ----------
function findJdk(){
  const cands = [];
  if (process.env.JAVA_HOME) cands.push(process.env.JAVA_HOME);
  const pf = process.env['ProgramFiles'] || 'C:\\Program Files';
  const pf86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
  const loc = process.env.LOCALAPPDATA || '';
  const usr = process.env.USERPROFILE || '';
  cands.push(pf + '\\Android\\Android Studio\\jbr', pf86 + '\\Android\\Android Studio\\jbr', loc + '\\Android\\Android Studio\\jbr', pf + '\\Android\\Android Studio\\jre');
  for (const dir of [usr + '\\.jdks', pf + '\\Java', pf + '\\Eclipse Adoptium', pf + '\\Microsoft', pf + '\\Zulu', pf + '\\BellSoft', pf86 + '\\Java']) {
    try { readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory()).forEach(d => cands.push(path.join(dir, d.name))); } catch(e){}
  }
  for (const c of cands) { const kt = path.join(c, 'bin', IS_WIN ? 'keytool.exe' : 'keytool'); if (c && existsSync(kt)) return { home: c, keytool: kt }; }
  return null;
}
log('Recherche d’un JDK…');
const jdk = findJdk();
if (!jdk) { err('Aucun JDK trouvé. Installe Android Studio ou un JDK 17 (adoptium.net), ou définis JAVA_HOME.'); process.exit(1); }
process.env.JAVA_HOME = jdk.home;
process.env.PATH = path.join(jdk.home, 'bin') + path.delimiter + process.env.PATH;
ok('JDK : ' + jdk.home);
const KEYTOOL = jdk.keytool;

// ---------- 1) Prérequis ----------
if (!existsSync('android/gradlew') && !existsSync('android/gradlew.bat')) { err('android/ introuvable. Lance d’abord : npx cap add android'); process.exit(1); }

// ---------- 2) dist/ (code obfusqué) ----------
log('Vérification de dist/…');
if (!existsSync('dist/index.html')) {
  err('dist/index.html introuvable. Lance d’abord ton build d’obfuscation pour produire dist/.');
  process.exit(1);
}
if (!existsSync('dist/assets') && existsSync('assets')) {
  cpSync('assets', path.join('dist', 'assets'), { recursive: true });
  warn('dist/assets manquant → assets/ copiés dans dist/.');
}
ok('dist/ prêt (index.html + assets)');

// ---------- 3) capacitor.config.json -> webDir dist ----------
writeFileSync('capacitor.config.json', JSON.stringify({
  appId: 'com.lesterresmornes.app',
  appName: 'Les Terres Mornes',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: { androidScheme: 'https' },
  android: { allowMixedContent: true, captureInput: true, webContentsDebuggingEnabled: false }
}, null, 2), 'utf8');
ok('capacitor.config.json : webDir = "dist"');

// ---------- 4) Sync ----------
log('Sync Capacitor…');
run('npx cap sync android');
ok('Sync terminé');

// ---------- 5) Keystore ----------
const KS_PATH = path.resolve('android/app/release-key.keystore');
const KS_PROPS = path.resolve('android/keystore.properties');
const KS_ALIAS = 'les-terres-mornes';
let ksPassword = '';
if (!existsSync(KS_PATH)) {
  log('Création de la keystore…');
  warn('Conserve keystore + mot de passe : indispensables aux mises à jour Play Store.');
  const cn = (await ask('Nom (ex: Les Terres Mornes) : ')) || 'Les Terres Mornes';
  const ou = (await ask('Organisation : ')) || 'Studio';
  const city = (await ask('Ville : ')) || 'Paris';
  const country = (await ask('Pays (2 lettres) : ')) || 'FR';
  ksPassword = (await ask('Mot de passe keystore (min 6) : ')) || crypto.randomBytes(12).toString('hex').slice(0, 16);
  run(`"${KEYTOOL}" -genkeypair -v -keystore "${KS_PATH}" -alias "${KS_ALIAS}" -keyalg RSA -keysize 2048 -validity 10000 -storepass "${ksPassword}" -keypass "${ksPassword}" -dname "CN=${cn}, OU=${ou}, L=${city}, C=${country}"`);
  ok('Keystore créée.');
} else {
  log('Keystore existante.');
  ksPassword = await ask('Mot de passe de la keystore : ');
}
writeFileSync(KS_PROPS, `storeFile=release-key.keystore\nstorePassword=${ksPassword}\nkeyAlias=${KS_ALIAS}\nkeyPassword=${ksPassword}\n`, 'utf8');
ok('keystore.properties écrit');

// ---------- 6) build.gradle (patch signature, version corrigée) ----------
const BG = path.resolve('android/app/build.gradle');
let bg = readFileSync(BG, 'utf8');
if (!bg.includes('keystore.properties')) {
  const head = `\ndef keystorePropertiesFile = rootProject.file("keystore.properties")\ndef keystoreProperties = new Properties()\nif (keystorePropertiesFile.exists()) { keystoreProperties.load(new FileInputStream(keystorePropertiesFile)) }\n`;
  const signing = `\n    signingConfigs {\n        release {\n            if (keystorePropertiesFile.exists()) {\n                storeFile file(keystoreProperties['storeFile'])\n                storePassword keystoreProperties['storePassword']\n                keyAlias keystoreProperties['keyAlias']\n                keyPassword keystoreProperties['keyPassword']\n            }\n        }\n    }\n`;
  bg = bg.replace(/android\s*\{/, head + 'android {');
  bg = bg.replace(/buildTypes\s*\{/, signing + '    buildTypes {');
  const btIdx = bg.indexOf('buildTypes');
  const relIdx = bg.indexOf('release', btIdx);
  const openIdx = bg.indexOf('{', relIdx);
  if (btIdx !== -1 && openIdx !== -1 && !bg.slice(btIdx, openIdx + 200).includes('signingConfig signingConfigs.release')) {
    bg = bg.slice(0, openIdx + 1) + '\n            signingConfig signingConfigs.release' + bg.slice(openIdx + 1);
  }
  writeFileSync(BG, bg, 'utf8');
  ok('build.gradle patché pour la signature');
} else ok('build.gradle déjà configuré');

// ---------- 7) Build ----------
log('Build APK release signé (2–5 min)…');
run(`cd android && ${GRADLEW} assembleRelease`);

// ---------- 8) Copie ----------
const apkSrc = path.resolve('android/app/build/outputs/apk/release/app-release.apk');
const apkDst = path.resolve('LesTerresMornes-release.apk');
if (existsSync(apkSrc)) {
  copyFileSync(apkSrc, apkDst);
  const mo = (statSync(apkDst).size / 1048576).toFixed(1);
  console.log('\n\x1b[32m══════════════════════════════════════\x1b[0m');
  console.log('\x1b[32m  ✅ APK SIGNÉ : ' + apkDst + ' (' + mo + ' Mo)\x1b[0m');
  console.log('\x1b[32m══════════════════════════════════════\x1b[0m');
  console.log('  Source embarquée : ./dist (code obfusqué).');
} else { err('APK introuvable après build.'); process.exit(1); }