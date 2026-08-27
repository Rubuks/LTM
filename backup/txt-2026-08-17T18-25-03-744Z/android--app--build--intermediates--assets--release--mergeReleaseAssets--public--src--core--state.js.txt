// ============================================================
// LA GRANDE ROUTE — src/core/state.js
// État global de la partie + bestiaire persistant.
// ============================================================
const KEY='lgr_v5';
const KEY_BEST='lgr_best';
const BELT_MAX=3;
let S=null,C=null,ND=null,EV=null,CURCLS=null,FX=[];
let _FROM_SAC=null,_FROM_BEST=null;
let BEST=chargerBest();
function chargerBest(){try{return JSON.parse(localStorage.getItem(KEY_BEST))||[]}catch(e){return[]}}
function sauverBest(){try{localStorage.setItem(KEY_BEST,JSON.stringify(BEST))}catch(e){}}

function clampRep(){if(S)S.rep=Math.max(-5,Math.min(5,S.rep||0));}
function addRep(n){if(!S)return;S.rep=(S.rep||0)+n;clampRep();}
function posture(){var r=(S&&S.rep)||0;return r>=3?'saint':r>=1?'respect':r===0?'neutre':r>=-2?'suspect':'paria';}
function postureKey(){return 'ui.posture.'+posture();}
function postureIcon(){return {saint:'halo',respect:'star',neutre:'dot',suspect:'warn',paria:'skull'}[posture()];}
