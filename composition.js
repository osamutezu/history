/* HISTORY NETWORK v2.7 — composition controls. No external dependencies. */
(()=>{'use strict';
const key='hn_composition_v27',defaults={preset:'hierarchy',focus:'all',labels:'key'};
let state={...defaults};try{const old=JSON.parse(localStorage.getItem(key)||'{}');for(const k of Object.keys(defaults))if(typeof old[k]==='string')state[k]=old[k]}catch{}
window.HN_COMPOSITION=state;
const css=document.createElement('style');css.textContent=`
#compositionBar{position:fixed;left:16px;bottom:16px;z-index:74;display:flex;align-items:center;gap:6px;flex-wrap:wrap;max-width:min(680px,calc(100vw - 32px));padding:9px 11px;background:#0c1118e8;border:1px solid #3a4653;box-shadow:0 12px 35px #0008;color:#c4cdd5;font:10px/1.4 Arial;letter-spacing:.07em;backdrop-filter:blur(12px)}
#compositionBar select,#compositionBar button{color:#e4edf3;background:#1b2631;border:1px solid #536271;padding:6px 8px;font:10px Arial;max-width:130px}
#compositionBar label{display:flex;align-items:center;gap:5px}#compositionBar .tiny{opacity:.6}
body.cinema #compositionBar{bottom:14px} @media(max-width:680px){#compositionBar{bottom:60px;left:8px;right:8px;max-width:none}}
`;document.head.append(css);
const bar=document.createElement('div');bar.id='compositionBar';bar.innerHTML=`<strong>COMPOSITION</strong><label>SIZE<select id="hnCompPreset"><option value="hierarchy">HIERARCHY</option><option value="constellation">UNIFORM</option><option value="threads">THREAD STUDY</option></select></label><label>FOCUS<select id="hnCompFocus"><option value="all">ALL NODES</option><option value="connected">DIM ISOLATES</option></select></label><label>LABELS<select id="hnCompLabels"><option value="key">KEY NODES</option><option value="auto">ON ZOOM</option></select></label><button id="hnCompReset">RESET</button>`;
document.body.append(bar);
const fields=[['hnCompPreset','preset'],['hnCompFocus','focus'],['hnCompLabels','labels']];
const redraw=()=>{try{localStorage.setItem(key,JSON.stringify(state))}catch{}window.dispatchEvent(new Event('hn-visual-change'))};
for(const [id,k] of fields){const el=document.getElementById(id);if(![...el.options].some(o=>o.value===state[k]))state[k]=defaults[k];el.value=state[k];el.onchange=()=>{state[k]=el.value;redraw()}}
document.getElementById('hnCompReset').onclick=()=>{Object.assign(state,defaults);for(const [id,k] of fields)document.getElementById(id).value=state[k];redraw()};
})();
