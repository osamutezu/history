/* HISTORY NETWORK — IMAGE ATLAS v2.4. Progressive enhancement; no build step. */
(()=>{'use strict';
const svg=document.getElementById('graph'),scene=document.getElementById('scene'),canvas=document.getElementById('visualCanvas');
if(!svg||!scene||!canvas)return;
const ctx=canvas.getContext('2d'),S={enabled:true,cards:true,lines:true,labels:false,images:true,expanded:false};
const colors={Philosophy:'#e7bda4',Art:'#e6d2a3',Architecture:'#a9ced9'};
const nodesById=new Map((window.HISTORY_NETWORK_DATA?.nodes||[]).map(n=>[n.id,n]));
const imgById=new Map(),urlById=new Map(),missing=new Set(),inflight=new Set();
const curated=window.HN_IMAGE_CURATIONS||{};
const composition=()=>window.HN_COMPOSITION||{preset:"constellation",focus:"all",edgeMode:"all",labels:"auto"};
const degree=new Map();for(const e of (window.HISTORY_NETWORK_DATA?.edges||[])){degree.set(e.source,(degree.get(e.source)||0)+1);degree.set(e.target,(degree.get(e.target)||0)+1)}
const validImageUrl=u=>/^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//.test(u)||/^https:\/\/upload\.wikimedia\.org\/wikipedia\/en\//.test(u);
let queued=false,loading=false,lastSignature='',visibleNodes=[],edges=[],imageCount=0,failCount=0;let fetchTimer=null,requestsMade=0;const maxBatch=8,MAX_IMAGES=180;
const status=document.getElementById('visualStatus');
const LOD={mode:localStorage.getItem('hn_lod_mode')||'auto',labelLimit:120,collision:true};
const VIS={imageFit:localStorage.getItem('hn_image_fit')||'adaptive',density:localStorage.getItem('hn_density')||'dense',edges:localStorage.getItem('hn_edge_style')||'all'};
const PLACEMENT={mode:localStorage.getItem('hn_card_placement')||'adaptive',tethers:localStorage.getItem('hn_card_tethers')!=='off'};
const palettes=['#293d48','#5d4b4d','#3e4b40','#56505c','#5c5044'];
const lodControl=document.createElement('div');lodControl.id='lodControl';lodControl.innerHTML='<span>DETAIL</span> <button data-lod="auto">AUTO</button><button data-lod="overview">OVERVIEW</button><button data-lod="detail">DETAIL</button><span id="lodReadout" aria-live="polite"></span>';
const host=document.querySelector('.stage')||canvas.parentElement;host.appendChild(lodControl);
for(const b of lodControl.querySelectorAll('[data-lod]'))b.addEventListener('click',()=>{LOD.mode=b.dataset.lod;localStorage.setItem('hn_lod_mode',LOD.mode);updateLODButtons();schedule()});
function updateLODButtons(){for(const b of lodControl.querySelectorAll('[data-lod]')){b.classList.toggle('on',b.dataset.lod===LOD.mode);b.setAttribute('aria-pressed',String(b.dataset.lod===LOD.mode))}}updateLODButtons();

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
function scheduleImageDiscovery(){if(fetchTimer!==null)return;fetchTimer=setTimeout(()=>{fetchTimer=null;requestImages()},260)}
function requestImages(){if(!S.enabled||!S.images||loading)return;
const viewport=canvas.getBoundingClientRect();
const priority=visibleNodes.filter(o=>o.n&&o.x>-80&&o.y>-80&&o.x<viewport.width+80&&o.y<viewport.height+80)
.sort((a,b)=>{const da=degree.get(a.id)||0,db=degree.get(b.id)||0;return db-da});
const candidatesVisible=priority.slice(0,MAX_IMAGES);

for(const o of candidatesVisible){const item=(window.HN_IMAGE_CURATIONS||{})[o.id];if(!item||!item.url||imgById.has(o.id)||inflight.has(o.id))continue;
if(!validImageUrl(item.url)){missing.add(o.id);continue;}
inflight.add(o.id);const im=new Image();im.crossOrigin='anonymous';im.decoding='async';im.onload=()=>{imgById.set(o.id,im);urlById.set(o.id,{page:item.source||item.url,title:o.n?.label,url:item.url,curated:true});missing.delete(o.id);inflight.delete(o.id);schedule()};im.onerror=()=>{missing.add(o.id);inflight.delete(o.id);schedule()};im.src=item.url;
}
const candidates=candidatesVisible.filter(o=>o.n&&!((window.HN_IMAGE_CURATIONS||{})[o.id])&&!imgById.has(o.id)&&!missing.has(o.id)&&!inflight.has(o.id));
if(!candidates.length)return;
const batch=candidates.slice(0,maxBatch);requestsMade++;batch.forEach(o=>inflight.add(o.id));loading=true;
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
const image=new Image();image.crossOrigin='anonymous';image.decoding='async';image.onload=()=>{imgById.set(o.id,image);urlById.set(o.id,{page:p.fullurl||'https://en.wikipedia.org/wiki/'+encodeURIComponent(p.title),title:p.title,url});imageCount++;schedule();};
image.onerror=()=>{missing.add(o.id);failCount++;schedule()};image.src=url;
}
}).catch(()=>{batch.forEach(o=>missing.add(o.id));failCount+=batch.length}).finally(()=>{batch.forEach(o=>inflight.delete(o.id));loading=false;updateStatus();schedule();scheduleImageDiscovery()});
}
function updateStatus(){if(status)status.textContent=`${visibleNodes.length} VISIBLE NODES · ${imageCount} WIKIMEDIA IMAGES LOADED · ${missing.size} WITHOUT IMAGE · ${S.images?'LIVE IMAGE DISCOVERY':'IMAGES PAUSED'}`}
function draw(){queued=false;if(!S.enabled)return;const box=canvas.getBoundingClientRect();if(!box.width||!box.height)return;
const dpr=Math.min(devicePixelRatio||1,2),w=box.width,h=box.height;if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}
ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
visibleNodes=nodesOnScreen();edges=edgesOnScreen();const matrix=scene.getScreenCTM();const zoom=clamp(Math.abs(matrix?.a||1),.35,4);
const level=LOD.mode==='auto'?(zoom<.72?'overview':zoom<1.65?'browse':'detail'):LOD.mode;
const lodFactor=level==='overview'?.84:level==='browse'?1.02:1.28;
const showAllCards=level==='detail';
const readout=document.getElementById('lodReadout');if(readout)readout.textContent=`${zoom.toFixed(2)}× · ${level.toUpperCase()}`;
const cfg=composition();const studio=getComputedStyle(document.documentElement);const cardScale=Number(studio.getPropertyValue('--atlas-card-scale'))||1;const threadAlpha=Number(studio.getPropertyValue('--atlas-thread-alpha'))||.42;const atmosphere=Number(studio.getPropertyValue('--atlas-atmosphere'))||.4;const scale=clamp(zoom*.75,.68,2.4)*cardScale*lodFactor;
if(atmosphere>0){ctx.save();const rad=Math.min(w,h)*.53;const grad=ctx.createRadialGradient(w*.52,h*.52,rad*.05,w*.52,h*.52,rad);grad.addColorStop(0,`rgba(128,85,78,${(.12*atmosphere).toFixed(3)})`);grad.addColorStop(.5,`rgba(67,83,98,${(.06*atmosphere).toFixed(3)})`);grad.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);ctx.restore()}if(S.lines){ctx.save();const m=scene.getScreenCTM();const r=canvas.getBoundingClientRect();for(const edge of edges){if(VIS.edges==='selected'&&!edge.selected)continue;const [x1,y1,x2,y2]=edge.coords;const a={x:m.a*x1+m.c*y1+m.e-r.left,y:m.b*x1+m.d*y1+m.f-r.top},b={x:m.a*x2+m.c*y2+m.e-r.left,y:m.b*x2+m.d*y2+m.f-r.top};ctx.strokeStyle=edge.selected?'rgba(235,244,255,.86)':`rgba(155,181,193,${(.055+threadAlpha*.48*(VIS.edges==='soft'?.48:1)).toFixed(3)})`;ctx.lineWidth=edge.selected?1.25:(cfg.preset==='threads'?.68:.52);ctx.beginPath();ctx.moveTo(a.x,a.y);
const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy);
const bend=Math.min(26,len*.055)*(edge.selected?0.35:1);
const midX=(a.x+b.x)/2-(dy/(len||1))*bend,midY=(a.y+b.y)/2+(dx/(len||1))*bend;
ctx.quadraticCurveTo(midX,midY,b.x,b.y);ctx.stroke();}ctx.restore();}
const labelBoxes=[];let labelCount=0;const occupied=[];
function collides(rect,margin){return occupied.some(b=>rect.x<b.x+b.w+margin&&rect.x+rect.w+margin>b.x&&rect.y<b.y+b.h+margin&&rect.y+rect.h+margin>b.y)}
function placeCard(x,y,cw,ch,importance,selected){
const origin={x:x-cw/2,y:y-ch/2,w:cw,h:ch};
if(PLACEMENT.mode==='anchored'||VIS.density==='dense')return {...origin,shifted:false,blocked:false};
const margin=VIS.density==='airy'?8:3;
const maxOffset=VIS.density==='airy'?Math.max(cw,ch)*2.4:Math.max(cw,ch)*1.6;
const offsets=[[0,0],[0,-1],[1,0],[0,1],[-1,0],[1,-1],[-1,-1],[1,1],[-1,1],[0,-2],[2,0],[0,2],[-2,0]];
for(const [dx,dy] of offsets){
const step=Math.max(cw,ch)*.57;
const ox=dx*step,oy=dy*step;
if(Math.hypot(ox,oy)>maxOffset)continue;
const r={x:origin.x+ox,y:origin.y+oy,w:cw,h:ch};
if(r.x<2||r.y<2||r.x+cw>w-2||r.y+ch>h-2)continue;
if(!collides(r,margin)){occupied.push(r);return {...r,shifted:dx!==0||dy!==0,blocked:false}}
}
if(selected||importance>=3){occupied.push(origin);return {...origin,shifted:false,blocked:false}}
return {...origin,shifted:false,blocked:true};
}
const imageFit=VIS.imageFit;
const candidateNodes=visibleNodes.slice().sort((a,b)=>{const da=degree.get(a.id)||0,db=degree.get(b.id)||0;return db-da||(hash(a.id)-hash(b.id))});
for(const o of candidateNodes){const {id,x,y,n}=o;if(!n||x<-100||y<-100||x>w+100||y>h+100)continue;
const field=n.fields?.[0]||'Art',col=colors[field]||'#c9d4db',selected=scene.querySelector(`g.node[data-node-id="${CSS.escape(id)}"]`)?.querySelector('circle')?.getAttribute('stroke-width')==='2.4';
const deg=degree.get(id)||0;const importance=cfg.preset==='hierarchy'?clamp(.76+Math.log2(1+deg)*.21,.76,1.9):1;const size=clamp((n.type==='Work'?32:29)*scale*importance,11,105),cw=size*.82,ch=size*1.18;
const fade=cfg.focus==='connected'&&deg===0?.17:1;ctx.globalAlpha=fade;
const placement=placeCard(x,y,cw,ch,deg,selected);
const left=placement.x,top=placement.y,cardX=left+cw/2,cardY=top+ch/2;
const skipCard=placement.blocked&&level!=='detail';
if(!skipCard&&placement.shifted&&PLACEMENT.tethers){ctx.save();ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(cardX,cardY);ctx.strokeStyle='rgba(185,205,218,.48)';ctx.lineWidth=.65;ctx.stroke();ctx.restore()}
if(S.cards&&!skipCard){ctx.save();if(selected){ctx.shadowBlur=19;ctx.shadowColor=col;}
rounded(left,top,cw,ch,1);ctx.fillStyle=palettes[hash(id)%palettes.length];ctx.fill();ctx.save();rounded(left,top,cw,ch,1);ctx.clip();
const img=S.images?imgById.get(id):null;
if(img){const aspect=img.width/img.height,rat=cw/ch;let sx=0,sy=0,sw=img.width,sh=img.height;const contain=imageFit==='contain'||(imageFit==='adaptive'&&(aspect>1.65||aspect<.55));if(contain){const rw=aspect>rat?cw:ch*aspect,rh=aspect>rat?cw/aspect:ch;ctx.drawImage(img,left+(cw-rw)/2,top+(ch-rh)/2,rw,rh)}else{if(aspect>rat){sw=img.height*rat;sx=(img.width-sw)/2}else{sh=img.width/rat;sy=(img.height-sh)/2}ctx.drawImage(img,sx,sy,sw,sh,left,top,cw,ch)}}
else{const hsh=hash(id);ctx.fillStyle=col;ctx.globalAlpha=.78;if(field==='Architecture'){ctx.beginPath();ctx.moveTo(left+cw*.13,top+ch*.79);ctx.lineTo(left+cw*.55,top+ch*.14);ctx.lineTo(left+cw*.88,top+ch*.79);ctx.fill()}else if(field==='Philosophy'){ctx.beginPath();ctx.arc(cardX,top+ch*.39,cw*.23,0,Math.PI*2);ctx.fill();ctx.fillRect(cardX-cw*.28,top+ch*.64,cw*.56,ch*.17)}else{ctx.fillRect(left+cw*.17,top+ch*.17,cw*.66,ch*.54);ctx.fillStyle='#101215';ctx.fillRect(left+cw*.25,top+ch*.24,cw*.50,ch*.39)}}
ctx.restore();ctx.shadowBlur=0;ctx.strokeStyle=selected?'#fff':'rgba(255,255,255,.52)';ctx.lineWidth=selected?1.5:.65;ctx.strokeRect(left,top,cw,ch);ctx.restore();}
else{ctx.beginPath();ctx.arc(x,y,selected?4:2.3,0,Math.PI*2);ctx.fillStyle=col;ctx.fill()}
const wantLabel=selected||S.labels||(cfg.labels==='key'&&deg>=3)||(cfg.labels==='auto'&&((level==='detail'&&deg>=1)||(level==='browse'&&deg>=3)));
if(wantLabel&&!skipCard&&(selected||labelCount<LOD.labelLimit)){ctx.font=`${selected?'bold ':''}${clamp(9*zoom,9,13)}px Arial, sans-serif`;ctx.fillStyle=selected?'#fff':'#d3dce4';ctx.textBaseline='middle';let label=window.HN_LOCALIZE?.name(n)||n.label;while(label.length>4&&ctx.measureText(label).width>150)label=label.slice(0,-2)+'…';const lx=left+cw+5,ly=cardY,tw=ctx.measureText(label).width,lh=13;
const collide=labelBoxes.some(b=>lx<b.x+b.w+3&&lx+tw>b.x-3&&ly-lh/2<b.y+b.h+2&&ly+lh/2>b.y-2);
if(selected||!LOD.collision||!collide){ctx.fillText(label,lx,ly);labelBoxes.push({x:lx,y:ly-lh/2,w:tw,h:lh});labelCount++}}
ctx.globalAlpha=1;
}
updateStatus();scheduleImageDiscovery();}
function button(id,key,label){const b=document.getElementById(id);if(!b)return;b.onclick=()=>{S[key]=!S[key];b.classList.toggle('on',S[key]);b.textContent=label+(key==='enabled'?(S[key]?' ON':' OFF'):'');if(key==='enabled'){document.body.classList.toggle('visual-atlas',S.enabled);if(!S.enabled)ctx.clearRect(0,0,canvas.width,canvas.height)}schedule()}}
button('visualToggle','enabled','VISUAL ATLAS');button('visualCards','cards','IMAGE CARDS');button('visualLines','lines','RELATION THREADS');button('visualLabels','labels','ALL LABELS');button('visualImages','images','WIKIMEDIA IMAGES');
const layout=document.getElementById('visualLayout');if(layout)layout.onclick=()=>{S.expanded=!S.expanded;layout.classList.toggle('on',S.expanded);layout.textContent=S.expanded?'COMPACT NETWORK':'EXPAND NETWORK';const slider=document.getElementById('linkLength');if(slider){slider.value=S.expanded?'200':'110';slider.dispatchEvent(new Event('input',{bubbles:true}));slider.dispatchEvent(new Event('change',{bubbles:true}));}schedule()};
const save=document.getElementById('visualExport');if(save)save.onclick=()=>{try{const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download='HISTORY_NETWORK_image_atlas.png';a.click()}catch(e){alert('Image export is blocked by browser image permissions. Try disabling Wikimedia images and export again.')}};
// Attribution/accessibility: node information links to the Wikipedia article used for thumbnail discovery.
const detail=document.getElementById('detail');if(detail){const obs=new MutationObserver(()=>{const title=detail.querySelector('h2,h4,strong');if(!title)return;const text=title.textContent.trim();const entry=[...urlById.entries()].find(([id])=>nodesById.get(id)?.label===text);detail.querySelector('#visualImageCredit')?.remove();if(entry){const a=document.createElement('a');a.id='visualImageCredit';a.href=entry[1].page;a.target='_blank';a.rel='noopener noreferrer';a.textContent='IMAGE SOURCE / WIKIPEDIA ↗ (CHECK FILE LICENSE)';a.style.cssText='display:block;margin-top:12px;font-size:10px;letter-spacing:.06em;color:#a9ced9';detail.appendChild(a)}});obs.observe(detail,{childList:true})}
const observer=new MutationObserver(schedule);observer.observe(scene,{childList:true,subtree:false,attributes:true,attributeFilter:['transform']});
new ResizeObserver(schedule).observe(canvas);svg.addEventListener('wheel',schedule,{passive:true});svg.addEventListener('pointermove',schedule,{passive:true});document.addEventListener('click',schedule,true);document.addEventListener('input',schedule,true);window.addEventListener('hn-visual-change',schedule);window.addEventListener('hn-image-composition-change',()=>{PLACEMENT.mode=localStorage.getItem('hn_card_placement')||'adaptive';PLACEMENT.tethers=localStorage.getItem('hn_card_tethers')!=='off';VIS.imageFit=localStorage.getItem('hn_image_fit')||'adaptive';VIS.density=localStorage.getItem('hn_density')||'balanced';VIS.edges=localStorage.getItem('hn_edge_style')||'all';schedule()});window.addEventListener('resize',schedule);
window.HN_IMAGE_ATLAS={get curated(){return window.HN_IMAGE_CURATIONS||{}},get imageRequests(){return requestsMade},imgById,urlById,missing,schedule,validImageUrl,clear(id){imgById.delete(id);urlById.delete(id);missing.delete(id);schedule()}};
document.body.classList.add('visual-atlas');schedule();
})();
