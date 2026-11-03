/* HISTORY NETWORK 2.5 / visual controls and persistent presentation preferences */
(()=>{'use strict';
const defaults={size:100,threads:42,glow:40};let cfg={...defaults};
try{cfg={...cfg,...JSON.parse(localStorage.getItem('hn_visual_studio_v25')||'{}')}}catch{}
const $=id=>document.getElementById(id);
function apply(){for(const [key,id] of [['size','atlasSize'],['threads','atlasThreads'],['glow','atlasGlow']])if($(id))$(id).value=cfg[key];
 document.documentElement.style.setProperty('--atlas-card-scale',String(cfg.size/100));
 document.documentElement.style.setProperty('--atlas-thread-alpha',String(cfg.threads/100));
 document.documentElement.style.setProperty('--atlas-atmosphere',String(cfg.glow/100));
 window.dispatchEvent(new Event('hn-visual-change'));
 try{localStorage.setItem('hn_visual_studio_v25',JSON.stringify(cfg))}catch{}
}
for(const [key,id] of [['size','atlasSize'],['threads','atlasThreads'],['glow','atlasGlow']])$(id)?.addEventListener('input',e=>{cfg[key]=Number(e.target.value);apply()});
$('atlasCinema')?.addEventListener('click',()=>{const on=document.body.classList.toggle('cinema');$('atlasCinema').textContent=on?'EXIT IMMERSIVE':'IMMERSIVE VIEW';window.dispatchEvent(new Event('resize'))});
$('atlasReset')?.addEventListener('click',()=>{cfg={...defaults};apply()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('cinema')){$('atlasCinema')?.click()}});
apply();
})();
