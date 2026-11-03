/* v3.3 — Image composition controls; renderer reads persisted state through shared VIS object. */
(()=>{'use strict';const settings=[['imageFit','hn_image_fit','adaptive'],['imageDensity','hn_density','balanced'],['imageThreads','hn_edge_style','all']];
for(const [id,key,defaultValue] of settings){const el=document.getElementById(id);if(!el)continue;el.value=localStorage.getItem(key)||defaultValue;el.addEventListener('change',()=>{localStorage.setItem(key,el.value);window.dispatchEvent(new Event('hn-image-composition-change'));});}
})();