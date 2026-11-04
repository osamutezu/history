/* v3.9: unobstructed viewing and explicit representation modes */
(()=>{'use strict';
const stage=document.querySelector('.stage');if(!stage)return;
const bar=document.createElement('div');bar.id='hnImageMode';bar.setAttribute('role','group');bar.setAttribute('aria-label','Network image presentation');
bar.innerHTML='<span>DISPLAY</span><button type="button" data-atlas-mode="image">IMAGES</button><button type="button" data-atlas-mode="hybrid">HYBRID</button><button type="button" data-atlas-mode="structure">STRUCTURE</button>';
stage.append(bar);
const valid=['image','hybrid','structure'];let mode=localStorage.getItem('hn_display_mode');if(!valid.includes(mode))mode='hybrid';
function apply(){
 document.body.dataset.atlasDisplay=mode;
 for(const b of bar.querySelectorAll('button'))b.setAttribute('aria-pressed',String(b.dataset.atlasMode===mode));
 window.dispatchEvent(new Event('hn-display-mode-change'));
}
bar.addEventListener('click',e=>{const b=e.target.closest('button[data-atlas-mode]');if(!b)return;mode=b.dataset.atlasMode;try{localStorage.setItem('hn_display_mode',mode)}catch(_){}apply()});
apply();
const chron=document.getElementById('hnChronology'),list=document.getElementById('hnChronoList'),nav=document.getElementById('hnEraNav');
if(chron&&list&&nav){nav.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const labels=[...nav.querySelectorAll('button')],i=labels.indexOf(b),section=list.querySelectorAll('section')[i];if(section)list.scrollTo({top:section.offsetTop-list.offsetTop,behavior:'smooth'})});
}
})();