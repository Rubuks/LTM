#!/usr/bin/env node
// ============================================================
// scripts/build-apk-signed.mjs (v2)
// Build + signature APK release via Gradle.
// v2 : détection automatique du JDK (jbr Android Studio, .jdks,
// Adoptium, Zulu, BellSoft, Java) + injection JAVA_HOME/PATH.
// ============================================================
import { existsSync, mkdirSync, rmSync, cpSync, writeFileSync, readFileSync, copyFileSync, readdirSync, statSync } from 'node:fs';
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
function ask(q, hide=false){
  return new Promise(resolve => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(q, a => { rl.close(); resolve(a); });
  });
}
function run(cmd, opts={}){
  const r = spawnSync(cmd, { shell: true, stdio: opts.silent ? 'pipe' : 'inherit' });
  if (r.status !== 0) throw new Error('Commande échouée : ' + cmd);
}

// ---------- 0) Détection du JDK ----------
function findJdk(){
  const cands = [];
  if (process.env.JAVA_HOME) cands.push(process.env.JAVA_HOME);
  const pf  = process.env['ProgramFiles'] || 'C:\\Program Files';
  const pf86= process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
  const loc = process.env.LOCALAPPDATA || '';
  const usr = process.env.USERPROFILE || '';
  cands.push(
    pf  + '\\Android\\Android Studio\\jbr',
    pf86+ '\\Android\\Android Studio\\jbr',
    loc + '\\Android\\Android Studio\\jbr',
    pf  + '\\Android\\Android Studio\\jre'
  );
  const scans = [usr+'\\.jdks', pf+'\\Java', pf+'\\Eclipse Adoptium', pf+'\\Microsoft', pf+'\\Zulu', pf+'\\BellSoft', pf86+'\\Java'];
  for (const dir of scans) {
    try {
      readdirSync(dir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .forEach(d => cands.push(path.join(dir, d.name)));
    } catch(e){}
  }
  for (const c of cands) {
    const kt = path.join(c, 'bin', IS_WIN ? 'keytool.exe' : 'keytool');
    if (c && existsSync(kt)) return { home: c, keytool: kt };
  }
  return null;
}

log('Recherche d’un JDK (keytool)…');
const jdk = findJdk();
if (!jdk) {
  err('Aucun JDK trouvé. Options :');
  console.log('   1) Installe Android Studio (il embarque le JBR), ou');
  console.log('   2) Installe un JDK 17 : https://adoptium.net/');
  console.log('   3) Ou définis JAVA_HOME puis relance ce script.');
  process.exit(1);
}
process.env.JAVA_HOME = jdk.home;
process.env.PATH = path.join(jdk.home, 'bin') + path.delimiter + process.env.PATH;
ok('JDK détecté : ' + jdk.home);
const KEYTOOL = jdk.keytool;

// ---------- 1) Prérequis ----------
if (!existsSync('android/gradlew') && !existsSync('android/gradlew.bat')) {
  err('android/ introuvable. Lance d’abord : npx cap add android');
  process.exit(1);
}
try { run(`"${KEYTOOL}"`, { silent: true }); } catch(e){}
ok('keytool OK');
try { run(`cd android && ${GRADLEW} --version`, { silent: true }); ok('Gradle Android OK'); }
catch { err('Gradle échoue. Ouvre d’abord "npx cap open android" pour laisser Android Studio synchroniser le projet.'); process.exit(1); }

// ---------- 2) www/ ----------
log('Préparation de www/…');
if (existsSync('www')) rmSync('www', { recursive: true, force: true });
mkdirSync('www');
cpSync('index.html', 'www/index.html');
for (const d of ['src','assets']) if (existsSync(d)) cpSync(d, path.join('www', d), { recursive: true });
ok('www/ synchronisé');

// ---------- 3) Sync Capacitor ----------
log('Sync Capacitor…');
run('npx cap sync android');
ok('Sync terminé');

// ---------- 4) Keystore ----------
const KS_PATH = path.resolve('android/app/release-key.keystore');
const KS_PROPS = path.resolve('android/keystore.properties');
const KS_ALIAS = 'les-terres-mornes';
let ksPassword = '';

if (!existsSync(KS_PATH)) {
  log('Création de la keystore (première fois)…');
  warn('Conserve cette keystore + son mot de passe : sans eux, pas de mise à jour Play Store.');
  const cn = (await ask('Nom (ex: Les Terres Mornes) : ')) || 'Les Terres Mornes';
  const ou = (await ask('Organisation : ')) || 'Studio';
  const city = (await ask('Ville : ')) || 'Paris';
  const country = (await ask('Pays (2 lettres) : ')) || 'FR';
  ksPassword = (await ask('Mot de passe keystore (min 6) : ')) || crypto.randomBytes(12).toString('hex').slice(0,16);
  run(`"${KEYTOOL}" -genkeypair -v -keystore "${KS_PATH}" -alias "${KS_ALIAS}" -keyalg RSA -keysize 2048 -validity 10000 -storepass "${ksPassword}" -keypass "${ksPassword}" -dname "CN=${cn}, OU=${ou}, L=${city}, C=${country}"`);
  ok('Keystore créée.');
} else {
  log('Keystore existante détectée.');
  ksPassword = await ask('Mot de passe de la keystore : ');
}
writeFileSync(KS_PROPS, `storeFile=release-key.keystore\nstorePassword=${ksPassword}\nkeyAlias=${KS_ALIAS}\nkeyPassword=${ksPassword}\n`, 'utf8');
ok('keystore.properties écrit');

// ---------- 5) Patch build.gradle ----------
const BG = path.resolve('android/app/build.gradle');
let bg = readFileSync(BG, 'utf8');
if (!bg.includes('keystore.properties')) {
  const head = `\ndef keystorePropertiesFile = rootProject.file("keystore.properties")\ndef keystoreProperties = new Properties()\nif (keystorePropertiesFile.exists()) { keystoreProperties.load(new FileInputStream(keystorePropertiesFile)) }\n`;
  const signing = `\n    signingConfigs {\n        release {\n            if (keystorePropertiesFile.exists()) {\n                storeFile file(keystoreProperties['storeFile'])\n                storePassword keystoreProperties['storePassword']\n                keyAlias keystoreProperties['keyAlias']\n                keyPassword keystoreProperties['keyPassword']\n            }\n        }\n    }\n`;
  bg = bg.replace(/android\s*\{/, head + 'android {');
  bg = bg.replace(/buildTypes\s*\{/, signing + '    buildTypes {');
  bg = bg.replace(/release\s*\{([^}]*?)\}/, (m, inner) => inner.includes('signingConfig') ? m : 'release {' + inner + '\n            signingConfig signingConfigs.release\n        }');
  writeFileSync(BG, bg, 'utf8');
  ok('build.gradle patché pour la signature');
} else ok('build.gradle déjà configuré');

// ---------- 6) Build ----------
log('Build APK release signé (2–5 min)…');
run(`cd android && ${GRADLEW} assembleRelease`);

// ---------- 7) Copie ----------
const apkSrc = path.resolve('android/app/build/outputs/apk/release/app-release.apk');
const apkDst = path.resolve('LesTerresMornes-release.apk');
if (existsSync(apkSrc)) {
  copyFileSync(apkSrc, apkDst);
  const mo = (statSync(apkDst).size / 1048576).toFixed(1);
  console.log('\n\x1b[32m══════════════════════════════════════\x1b[0m');
  console.log('\x1b[32m  ✅ APK SIGNÉ : ' + apkDst + ' (' + mo + ' Mo)\x1b[0m');
  console.log('\x1b[32m══════════════════════════════════════\x1b[0m');
} else { err('APK introuvable après build.'); process.exit(1); }