/* Mobile v4.0: status, responsive controls, and accessible error fallback */
(()=>{'use strict';
const stage=document.querySelector('.stage'),svg=document.getElementById('graph');if(!stage||!svg)return;
const status=document.createElement('div');status.id='hnMobileStatus';status.setAttribute('role','status');status.style.cssText='position:absolute;top:101px;left:10px;right:10px;z-index:14;pointer-events:none;color:#d7e2e9;background:#101923c9;padding:9px 12px;font:12px/1.5 Arial,sans-serif;display:none;border:1px solid #354755';
stage.append(status);
const mobile=()=>matchMedia('(max-width:800px)').matches;
function check(){if(!mobile()){status.style.display='none';return}const count=svg.querySelectorAll('g.node').length;if(count===0){status.style.display='block';status.textContent='ネットワークを読み込んでいます… / Loading network…'}else status.style.display='none'}
window.addEventListener('error',e=>{if(!mobile())return;if(svg.querySelectorAll('g.node').length===0){status.style.display='block';status.textContent='表示を読み込めませんでした。ページを再読み込みしてください。 / Display failed to load. Please refresh.'}},false);
const chron=document.getElementById('hnChronology');
const mo=new MutationObserver(check);mo.observe(svg,{childList:true,subtree:true});check();
window.addEventListener('resize',check);
const originalToggle=document.getElementById('hnToggleSidebar');if(originalToggle)originalToggle.addEventListener('click',()=>{if(mobile()&&document.body.classList.contains('hn-sidebar-open'))document.getElementById('hnToolDrawer').hidden=true});
if(chron)chron.addEventListener('click',e=>{if(mobile()&&e.target.closest('.hnEntry'))document.body.classList.remove('hn-sidebar-open')});
})();
