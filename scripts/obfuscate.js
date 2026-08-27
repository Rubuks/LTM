import JavaScriptObfuscator from 'javascript-obfuscator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fichiers à obfusquer (code critique du jeu)
const filesToObfuscate = [
    {
        input: 'src/legacy.js',
        output: 'dist/legacy.js'
    },
    {
        input: 'src/core/i18n.js',
        output: 'dist/core/i18n.js'
    }
];

// Configuration de l'obfuscation
const obfuscatorOptions = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: false, // Désactivé pour éviter les problèmes
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: true,
    renameGlobals: false, // Garde les noms globaux pour la compatibilité
    selfDefending: false,
    simplify: true,
    stringArray: true,
    stringArrayCallsTransform: false,
    stringArrayCallsTransformThreshold: 0.5,
    stringArrayEncoding: ['base64'],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 1,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 2,
    stringArrayWrappersType: 'variable',
    stringArrayThreshold: 0.75,
    transformObjectKeys: true,
    unicodeEscapeSequence: false
};

console.log('🔒 Début de l\'obfuscation...\n');

filesToObfuscate.forEach(file => {
    try {
        const inputPath = path.join(__dirname, '..', file.input);
        const outputPath = path.join(__dirname, '..', file.output);
        
        // Vérifie que le fichier source existe
        if (!fs.existsSync(inputPath)) {
            console.warn(`⚠️  Fichier non trouvé: ${file.input}`);
            return;
        }
        
        // Crée le dossier de sortie si nécessaire
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // Lit le code source
        const code = fs.readFileSync(inputPath, 'utf8');
        const originalSize = (Buffer.byteLength(code, 'utf8') / 1024).toFixed(2);
        
        // Obfusque
        const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, obfuscatorOptions);
        const obfuscatedSize = (Buffer.byteLength(obfuscatedCode.getObfuscatedCode(), 'utf8') / 1024).toFixed(2);
        
        // Écrit le résultat
        fs.writeFileSync(outputPath, obfuscatedCode.getObfuscatedCode());
        
        console.log(`✅ ${file.input} → ${file.output}`);
        console.log(`   Taille: ${originalSize} KB → ${obfuscatedSize} KB`);
        
    } catch (error) {
        console.error(`❌ Erreur pour ${file.input}:`, error.message);
    }
});

console.log('\n🎉 Obfuscation terminée !');
console.log('📁 Les fichiers protégés sont dans le dossier dist/');