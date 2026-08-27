// ============================================================
// LA GRANDE ROUTE — src/core/item-effects.js
// Effets d'objets déclaratifs. Aucun texte affiché ici.
// Un objet GameData peut porter effect:{...} au lieu de use().
// ============================================================
window.buildItemUse = function(def){
  var e = def && def.effect;
  if (!e) return null;

  return function(){
    var f;

    if (e.heal) S.pv = Math.min(S.pvMax, S.pv + e.heal);
    if (e.regen) { C.hst.regen = e.regen.d; C.hst.regenN = e.regen.n; }
    if (e.shield) C.hst.bouclier += e.shield;
    if (e.focus) C.hst.ichor = e.focus;
    if (e.evade) C.hst.chat = e.evade;
    if (e.vampire) C.hst.vampire = e.vampire;
    if (e.furyCombat) C.rune = true;
    if (e.renewMeteor) C.meteore = false;
    if (e.oil) C.huile = e.oil;

    if (e.breakIntangible) {
      C.foes.forEach(function(x){
        if (x.vivant && x.st.intangible > 0) x.st.intangible = 0;
      });
    }

    if (e.poisonLine) {
      C.foes.forEach(function(x){
        if (x.vivant) x.st.poison = { d: e.poisonLine.d, n: e.poisonLine.n };
      });
    }

    if (e.hit) {
      blesserEnnemi(e.hit.d, null, (def.em ? def.em + ' ' : '') + t(def.n), false, false, !!e.hit.fly);
      if (!C || C.fini) { if (e.log) log(t(e.log)); return; }
      f = curFoe();
      if (f && f.vivant) {
        if (e.hit.knock && f.vole) f.chute++;
        if (e.hit.stun && f.pvE > 0 && Math.random() < e.hit.stun) f.st.etourdi = 1;
      }
    }

    if (e.stunTarget) {
      f = curFoe();
      if (f && f.vivant) {
        f.st.etourdi = e.stunTarget;
        if (e.antiFly && f.vole) f.chute += e.antiFly;
      }
    }

    if (e.antiFlyGround) {
      f = curFoe();
      if (f && f.vivant) {
        if (f.vole) f.chute += e.antiFlyGround;
        else f.st.etourdi = 2;
      }
    }

    if (e.log) log(t(e.log));
  };
};
