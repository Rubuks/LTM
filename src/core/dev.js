// ============================================================
// LA GRANDE ROUTE — src/core/dev.js
// Helpers de test : démarrer directement en Acte II.
// Aucun texte : clés i18n uniquement.
// Pour désactiver : retirer la balise <script src="src/core/dev.js">.
// ============================================================
window.devAct2 = function(cls, opts){
cls = cls || 'loup';
opts = opts || {};
try{ document.body.classList.add('in-game'); }catch(e){}
newRun(cls, 'act2');
if (window.syncGameDataToLegacy) window.syncGameDataToLegacy('act2');
recalcTrophyStats();
S.pv = S.pvMax;
if (opts.or != null) S.or = opts.or;
if (opts.rep != null) S.rep = opts.rep;
sauvegarder(); // ⚠ écrase la sauvegarde courante (outil de test)
var a = (typeof actDef === 'function') ? actDef('act2') : null;
if (a && a.paths && typeof viewPrologueBaron === 'function') { viewPrologueBaron(a); }
else { rCarte(); }
};
window.devAct2Skip = function(cls, chemin){
window.devAct2(cls);
if (chemin && typeof choisirChemin === 'function') choisirChemin(chemin);
};
(function(){
try{
var q = new URLSearchParams(window.location.search);
if (q.get('dev') === 'act2') {
var cls = q.get('cls') || 'loup';
var chemin = q.get('chemin') || null;
window.addEventListener('load', function(){
setTimeout(function(){
if (chemin) window.devAct2Skip(cls, chemin);
else window.devAct2(cls);
}, 60);
});
}
}catch(e){}
})();
