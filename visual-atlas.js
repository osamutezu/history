/* HISTORY NETWORK — IMAGE ATLAS v2.4. Progressive enhancement; no build step. */
(()=>{'use strict';
const svg=document.getElementById('graph'),scene=document.getElementById('scene'),canvas=document.getElementById('visualCanvas');
if(!svg||!scene||!canvas)return;
const ctx=canvas.getContext('2d'),S={enabled:true,cards:true,lines:true,labels:false,images:true,expanded:false};
const colors={Philosophy:'#e7bda4',Art:'#e6d2a3',Architecture:'#a9ced9'};
const nodesById=new Map((window.HISTORY_NETWORK_DATA?.nodes||[]).map(n=>[n.id,n]));
const imgById=new Map(),urlById=new Map(),missing=new Set(),inflight=new Set();
const curated=window.HN_IMAGE_CURATIONS||{};
const validImageUrl=u=>/^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//.test(u)||/^https:\/\/upload\.wikimedia\.org\/wikipedia\/en\//.test(u);
let queued=false,loading=false,lastSignature='',visibleNodes=[],edges=[],imageCount=0,failCount=0;
const status=document.getElementById('visualStatus');
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0}
function rounded(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function schedule(){if(!queued){queued=true;requestAnimationFrame(draw)}}
function nodesOnScreen(){const m=scene.getScreenCTM();if(!m)return[];const rect=canvas.getBoundingClientRect();let a=[];
for(const g of scene.querySelectorAll('g.node')){
const t=g.getAttribute('transform')||'',match=t.match(/translate\(\s*([-\d.eE]+)[ ,]+([-\d.eE]+)\s*\)/);
if(!match)continue;const id=g.getAttribute('data-node-id'),x=+match[1],y=+match[2];
const px=m.a*x+m.c*y+m.e-rect.left,py=m.b*x+m.d*y+m.f-rect.top;
a.push({id,x:px,y:py,n:nodesById.get(id),g});}
return a;
}
function edgesOnScreen(){const list=[];for(const path of scene.querySelectorAll('path.edge')){const d=path.getAttribute('d')||'';const m=d.match(/M\s*([-\d.eE]+)[ ,]+([-\d.eE]+)\s*L\s*([-\d.eE]+)[ ,]+([-\d.eE]+)/);if(m)list.push({coords:m.slice(1).map(Number),selected:path.classList.contains('selected-edge')});}return list;}
function getArticleTitle(n){if(!n||!n.label)return null;
// Only direct, literal Wikipedia title candidates. Avoid misleading search-result substitutions.
let s=n.label.trim();if(s.length>100||/[\[\]{}<>]/.test(s))return null;
return s;
}
function requestImages(){if(!S.enabled||!S.images||loading)return;
for(const o of visibleNodes){const item=curated[o.id];if(!item||!item.url||imgById.has(o.id)||inflight.has(o.id))continue;
if(!validImageUrl(item.url)){missing.add(o.id);continue;}
inflight.add(o.id);const im=new Image();im.crossOrigin='anonymous';im.onload=()=>{imgById.set(o.id,im);urlById.set(o.id,{page:item.source||item.url,title:o.n?.label,url:item.url,curated:true});missing.delete(o.id);inflight.delete(o.id);schedule()};im.onerror=()=>{missing.add(o.id);inflight.delete(o.id);schedule()};im.src=item.url;
}
const candidates=visibleNodes.filter(o=>o.n&&!curated[o.id]&&!imgById.has(o.id)&&!missing.has(o.id)&&!inflight.has(o.id));
if(!candidates.length)return;
const batch=candidates.slice(0,24);batch.forEach(o=>inflight.add(o.id));loading=true;
const titles=batch.map(o=>getArticleTitle(o.n)).filter(Boolean);
if(!titles.length){batch.forEach(o=>{inflight.delete(o.id);missing.add(o.id)});loading=false;return;}
const api='https://en.wikipedia.org/w/api.php?'+new URLSearchParams({action:'query',format:'json',origin:'*',redirects:'1',prop:'pageimages|info',inprop:'url',piprop:'thumbnail',pithumbsize:'240',titles:titles.join('|')});
fetch(api,{mode:'cors',credentials:'omit'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(data=>{
const query=data.query||{};const pages=Object.values(query.pages||{});
const redirects=new Map((query.redirects||[]).map(r=>[r.from.toLowerCase(),r.to.toLowerCase()]));
const normalized=new Map((query.normalized||[]).map(r=>[r.from.toLowerCase(),r.to.toLowerCase()]));
const pageByTitle=new Map(pages.map(p=>[(p.title||'').toLowerCase(),p]));
for(const o of batch){const title=getArticleTitle(o.n);let key=(title||'').toLowerCase();key=normalized.get(key)||key;key=redirects.get(key)||key;const p=pageByTitle.get(key);
if(!p||!p.thumbnail?.source){missing.add(o.id);continue;}
const url=p.thumbnail.source;
// Wikimedia image URLs are only accepted from Wikimedia-operated image hosts.
if(!/^https:\/\/upload\.wikimedia\.org\//.test(url)){missing.add(o.id);continue;}
const image=new Image();image.crossOrigin='anonymous';image.onload=()=>{imgById.set(o.id,image);urlById.set(o.id,{page:p.fullurl||'https://en.wikipedia.org/wiki/'+encodeURIComponent(p.title),title:p.title,url});imageCount++;schedule();};
image.onerror=()=>{missing.add(o.id);failCount++;schedule()};image.src=url;
}
}).catch(()=>{batch.forEach(o=>missing.add(o.id));failCount+=batch.length}).finally(()=>{batch.forEach(o=>inflight.delete(o.id));loading=false;updateStatus();schedule();setTimeout(requestImages,300)});
}
function updateStatus(){if(status)status.textContent=`${visibleNodes.length} VISIBLE NODES · ${imageCount} WIKIMEDIA IMAGES LOADED · ${missing.size} WITHOUT IMAGE · ${S.images?'LIVE IMAGE DISCOVERY':'IMAGES PAUSED'}`}
function draw(){queued=false;if(!S.enabled)return;const box=canvas.getBoundingClientRect();if(!box.width||!box.height)return;
const dpr=Math.min(devicePixelRatio||1,2),w=box.width,h=box.height;if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}
ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
visibleNodes=nodesOnScreen();edges=edgesOnScreen();const matrix=scene.getScreenCTM();const zoom=clamp(Math.abs(matrix?.a||1),.35,4);
const studio=getComputedStyle(document.documentElement);const cardScale=Number(studio.getPropertyValue('--atlas-card-scale'))||1;const threadAlpha=Number(studio.getPropertyValue('--atlas-thread-alpha'))||.42;const atmosphere=Number(studio.getPropertyValue('--atlas-atmosphere'))||.4;const scale=clamp(zoom*.75,.48,2.4)*cardScale;
if(atmosphere>0){ctx.save();const rad=Math.min(w,h)*.53;const grad=ctx.createRadialGradient(w*.52,h*.52,rad*.05,w*.52,h*.52,rad);grad.addColorStop(0,`rgba(128,85,78,${(.12*atmosphere).toFixed(3)})`);grad.addColorStop(.5,`rgba(67,83,98,${(.06*atmosphere).toFixed(3)})`);grad.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);ctx.restore()}if(S.lines){ctx.save();const m=scene.getScreenCTM();const r=canvas.getBoundingClientRect();for(const edge of edges){const [x1,y1,x2,y2]=edge.coords;const a={x:m.a*x1+m.c*y1+m.e-r.left,y:m.b*x1+m.d*y1+m.f-r.top},b={x:m.a*x2+m.c*y2+m.e-r.left,y:m.b*x2+m.d*y2+m.f-r.top};ctx.strokeStyle=edge.selected?'rgba(235,244,255,.86)':`rgba(155,181,193,${(.03+threadAlpha*.40).toFixed(3)})`;ctx.lineWidth=edge.selected?1.2:.46;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}ctx.restore();}
for(const o of visibleNodes){const {id,x,y,n}=o;if(!n||x<-100||y<-100||x>w+100||y>h+100)continue;
const field=n.fields?.[0]||'Art',col=colors[field]||'#c9d4db',selected=scene.querySelector(`g.node[data-node-id="${CSS.escape(id)}"]`)?.querySelector('circle')?.getAttribute('stroke-width')==='2.4';
const size=clamp((n.type==='Work'?27:23)*scale,9,100),cw=size*.82,ch=size*1.18,left=x-cw/2,top=y-ch/2;
if(S.cards){ctx.save();if(selected){ctx.shadowBlur=19;ctx.shadowColor=col;}
rounded(left,top,cw,ch,1);ctx.fillStyle=['#293d48','#5d4b4d','#3e4b40','#56505c','#5c5044'][hash(id)%5];ctx.fill();ctx.save();rounded(left,top,cw,ch,1);ctx.clip();
const img=S.images?imgById.get(id):null;
if(img){const aspect=img.width/img.height,rat=cw/ch;let sx=0,sy=0,sw=img.width,sh=img.height;if(aspect>rat){sw=img.height*rat;sx=(img.width-sw)/2}else{sh=img.width/rat;sy=(img.height-sh)/2}ctx.drawImage(img,sx,sy,sw,sh,left,top,cw,ch);}
else{const hsh=hash(id);ctx.fillStyle=col;ctx.globalAlpha=.78;if(field==='Architecture'){ctx.beginPath();ctx.moveTo(left+cw*.13,top+ch*.79);ctx.lineTo(left+cw*.55,top+ch*.14);ctx.lineTo(left+cw*.88,top+ch*.79);ctx.fill()}else if(field==='Philosophy'){ctx.beginPath();ctx.arc(x,top+ch*.39,cw*.23,0,Math.PI*2);ctx.fill();ctx.fillRect(x-cw*.28,top+ch*.64,cw*.56,ch*.17)}else{ctx.fillRect(left+cw*.17,top+ch*.17,cw*.66,ch*.54);ctx.fillStyle='#101215';ctx.fillRect(left+cw*.25,top+ch*.24,cw*.50,ch*.39)}}
ctx.restore();ctx.shadowBlur=0;ctx.strokeStyle=selected?'#fff':'rgba(255,255,255,.52)';ctx.lineWidth=selected?1.5:.65;ctx.strokeRect(left,top,cw,ch);ctx.restore();}
else{ctx.beginPath();ctx.arc(x,y,selected?4:2.3,0,Math.PI*2);ctx.fillStyle=col;ctx.fill()}
if(S.labels||selected||(zoom>1.5&&visibleNodes.length<650)){ctx.font=`${selected?'bold ':''}${clamp(9*zoom,9,13)}px Arial`;ctx.fillStyle=selected?'#fff':'#d3dce4';ctx.textBaseline='middle';let label=n.label;while(label.length>4&&ctx.measureText(label).width>150)label=label.slice(0,-2)+'…';ctx.fillText(label,x+cw/2+5,y)}
}
updateStatus();requestImages();}
function button(id,key,label){const b=document.getElementById(id);if(!b)return;b.onclick=()=>{S[key]=!S[key];b.classList.toggle('on',S[key]);b.textContent=label+(key==='enabled'?(S[key]?' ON':' OFF'):'');if(key==='enabled'){document.body.classList.toggle('visual-atlas',S.enabled);if(!S.enabled)ctx.clearRect(0,0,canvas.width,canvas.height)}schedule()}}
button('visualToggle','enabled','VISUAL ATLAS');button('visualCards','cards','IMAGE CARDS');button('visualLines','lines','RELATION THREADS');button('visualLabels','labels','ALL LABELS');button('visualImages','images','WIKIMEDIA IMAGES');
const layout=document.getElementById('visualLayout');if(layout)layout.onclick=()=>{S.expanded=!S.expanded;layout.classList.toggle('on',S.expanded);layout.textContent=S.expanded?'COMPACT NETWORK':'EXPAND NETWORK';const slider=document.getElementById('linkLength');if(slider){slider.value=S.expanded?'200':'110';slider.dispatchEvent(new Event('input',{bubbles:true}));slider.dispatchEvent(new Event('change',{bubbles:true}));}schedule()};
const save=document.getElementById('visualExport');if(save)save.onclick=()=>{try{const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download='HISTORY_NETWORK_image_atlas.png';a.click()}catch(e){alert('Image export is blocked by browser image permissions. Try disabling Wikimedia images and export again.')}};
// Attribution/accessibility: node information links to the Wikipedia article used for thumbnail discovery.
const detail=document.getElementById('detail');if(detail){const obs=new MutationObserver(()=>{const title=detail.querySelector('h2,h4,strong');if(!title)return;const text=title.textContent.trim();const entry=[...urlById.entries()].find(([id])=>nodesById.get(id)?.label===text);detail.querySelector('#visualImageCredit')?.remove();if(entry){const a=document.createElement('a');a.id='visualImageCredit';a.href=entry[1].page;a.target='_blank';a.rel='noopener noreferrer';a.textContent='IMAGE SOURCE / WIKIPEDIA ↗ (CHECK FILE LICENSE)';a.style.cssText='display:block;margin-top:12px;font-size:10px;letter-spacing:.06em;color:#a9ced9';detail.appendChild(a)}});obs.observe(detail,{childList:true})}
const observer=new MutationObserver(schedule);observer.observe(scene,{childList:true,subtree:false,attributes:true,attributeFilter:['transform']});
new ResizeObserver(schedule).observe(canvas);svg.addEventListener('wheel',schedule,{passive:true});svg.addEventListener('pointermove',schedule,{passive:true});document.addEventListener('click',schedule,true);document.addEventListener('input',schedule,true);window.addEventListener('hn-visual-change',schedule);window.addEventListener('resize',schedule);
window.HN_IMAGE_ATLAS={curated,imgById,urlById,missing,schedule,validImageUrl,clear(id){imgById.delete(id);urlById.delete(id);missing.delete(id);schedule()}};
document.body.classList.add('visual-atlas');schedule();
})();
