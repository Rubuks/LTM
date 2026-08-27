import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🚀 Build pour itch.io...\n');

// 1. Nettoie le dossier dist
const distDir = path.join(rootDir, 'dist');
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 2. Copie les fichiers nécessaires
const filesToCopy = [
    'index.html',
    'assets',
    'locales',
    'src/data',
    'src/ui',
	'src/'
];

filesToCopy.forEach(item => {
    const sourcePath = path.join(rootDir, item);
    const destPath = path.join(distDir, item);
    
    if (fs.existsSync(sourcePath)) {
        const stats = fs.statSync(sourcePath);
        
        if (stats.isDirectory()) {
            fs.cpSync(sourcePath, destPath, { recursive: true });
            console.log(`📁 Copié: ${item}/`);
        } else {
            fs.copyFileSync(sourcePath, destPath);
            console.log(`📄 Copié: ${item}`);
        }
    }
});

// 3. Obfusque les fichiers critiques
console.log('\n🔒 Obfuscation du code...');
execSync('npm run obfuscate', { cwd: rootDir, stdio: 'inherit' });

// 4. Copie les fichiers obfusqués vers dist/src
const distSrcDir = path.join(distDir, 'src');
if (!fs.existsSync(distSrcDir)) {
    fs.mkdirSync(distSrcDir, { recursive: true });
}

const obfuscatedFiles = ['legacy.js', 'i18n.js'];
obfuscatedFiles.forEach(file => {
    const src = path.join(distDir, file);
    const dest = path.join(distSrcDir, file);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        fs.unlinkSync(src); // Supprime le fichier temporaire
    }
});

// 5. Minifie le CSS inline dans index.html
console.log('\n🎨 Optimisation du HTML...');
const indexPath = path.join(distDir, 'index.html');
if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf8');
    // Supprime les commentaires HTML
    html = html.replace(/<!--[\s\S]*?-->/g, '');
    fs.writeFileSync(indexPath, html);
}

console.log('\n✅ Build terminé !');
console.log('📦 Dossier prêt pour itch.io: dist/');
console.log('💡 Vous pouvez maintenant zipper le dossier dist/ et l\'uploader sur itch.io');