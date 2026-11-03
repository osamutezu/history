/* v3.5 layout presets: configure existing controls, do not replace graph data. */
(()=>{'use strict';
const presets={
atlas:{spatialMode:'constellation',communitySeparation:'60',linkLength:'110',imageDensity:'balanced',cardPlacement:'adaptive',imageThreads:'soft',cardTethers:'on'},
clusters:{spatialMode:'disciplines',communitySeparation:'75',linkLength:'125',imageDensity:'airy',cardPlacement:'adaptive',imageThreads:'soft',cardTethers:'on'},
threads:{spatialMode:'classic',communitySeparation:'35',linkLength:'150',imageDensity:'dense',cardPlacement:'anchored',imageThreads:'all',cardTethers:'off'}
};
const keys={imageDensity:'hn_image_density',cardPlacement:'hn_card_placement',imageThreads:'hn_edge_style',cardTethers:'hn_card_tethers'};
document.querySelectorAll('[data-layout-preset]').forEach(button=>button.addEventListener('click',()=>{
const preset=presets[button.dataset.layoutPreset];if(!preset)return;
for(const [id,value] of Object.entries(preset)){
const input=document.getElementById(id);if(!input)continue;
input.value=value;
if(keys[id]){try{localStorage.setItem(keys[id],value)}catch(_){}}
input.dispatchEvent(new Event('change',{bubbles:true}));
}
window.dispatchEvent(new Event('hn-image-composition-change'));
document.querySelectorAll('[data-layout-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
}));
})();