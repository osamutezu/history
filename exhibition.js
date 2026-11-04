/* Exhibition view: preserves underlying graph and existing pan/pinch interactions. */
(()=>{'use strict';
const stage=document.querySelector('.stage');if(!stage)return;
const bar=document.createElement('div');bar.id='hnExhibitionBar';bar.innerHTML='<button type="button" id="hnExhibition" aria-pressed="false">EXHIBITION VIEW</button><button type="button" id="hnAnalytic" aria-pressed="true">RESEARCH VIEW</button><span class="hnCaption">IMAGE-LED / VERIFIED LINKS ONLY</span>';stage.append(bar);
const b1=bar.querySelector('#hnExhibition'),b2=bar.querySelector('#hnAnalytic');
let exhibition=false;
function update(){document.body.classList.toggle('hn-exhibition',exhibition);document.body.dataset.atlasDisplay=exhibition?'image':'hybrid';b1.setAttribute('aria-pressed',String(exhibition));b2.setAttribute('aria-pressed',String(!exhibition));window.dispatchEvent(new Event('hn-display-mode-change'));window.HN_IMAGE_ATLAS?.schedule?.()}
b1.onclick=()=>{exhibition=true;update()};b2.onclick=()=>{exhibition=false;update()};update();
})();
