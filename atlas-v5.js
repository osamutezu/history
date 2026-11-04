(()=>{'use strict';
const $=id=>document.getElementById(id), raw=window.HISTORY_DATA||window.HISTORY_NETWORK_DATA||window.DATA||{};
let data=raw.nodes?raw:(window.historyData||{});
if(!data.nodes&&window.ATLAS_DATA?.nodes)data=window.ATLAS_DATA;
if(!data.nodes){for(const k of Object.keys(window)){if(window[k]&&Array.isArray(window[k].nodes)&&Array.isArray(window[k].edges)){data=window[k];break}}}
const nodes=data.nodes||[],edges=data.edges||[],byId=new Map(nodes.map(n=>[n.id,n])),neighbors=new Map(nodes.map(n=>[n.id,[]]));
for(const e of edges){if(neighbors.has(e.source))neighbors.get(e.source).push({id:e.target,edge:e});if(neighbors.has(e.target))neighbors.get(e.target).push({id:e.source,edge:e})}
const fields=['Philosophy','Art','Architecture'],colors={Philosophy:'#857ba6',Art:'#c58b6c',Architecture:'#609b9b'},translations={Plato:'プラトン',Aristotle:'アリストテレス',Immanuel_Kant:'イマヌエル・カント',Kant:'カント',Hegel:'ヘーゲル',Socrates:'ソクラテス',Le_Corbusier:'ル・コルビュジエ',Picasso:'ピカソ',Bauhaus:'バウハウス'};
let lang=localStorage.getItem('hn-v5-lang')||'ja',view='network',style='editorial',lineMode='focus',selected=null,hover=null,search='',imageScale=1,groupLabels=true,allowed=new Set(fields),camera={x:0,y:0,k:1},drag=null,gesture=null,dirty=true,imagesLoaded=0,requested=0;
const canvas=$('networkCanvas'),ctx=canvas.getContext('2d',{alpha:false}),pictures=new Map(),failed=new Set(),positions=new Map(),size={w:0,h:0,dpr:1};
function label(n){if(lang==='ja'){return n.labelJa||n.ja||translations[n.label]||translations[n.id]||n.label}return n.label}
function yr(y){return y<0?`${Math.abs(y)} BCE`:String(y)}
function visible(n){return n.fields?.some(f=>allowed.has(f))&&(!search||(n.label+' '+(n.description||'')).toLowerCase().includes(search))}
function hash(str){let h=2166136261;for(let i=0;i<str.length;i++)h=Math.imul(h^str.charCodeAt(i),16777619);return(h>>>0)/4294967295}
function layout(){
positions.clear();
const fw=2800,fh=1550;
const groupNodes=new Map(fields.map(f=>[f,[]]));
for(const n of nodes){const f=n.fields?.find(x=>fields.includes(x))||'Art';groupNodes.get(f).push(n)}
for(let fi=0;fi<fields.length;fi++){
const field=fields[fi],arr=groupNodes.get(field);
const types=['Movement','Person','Work','Institution','Concept'];
for(let ti=0;ti<types.length;ti++){
const set=arr.filter(n=>n.type===types[ti]).sort((a,b)=>a.year-b.year||a.id.localeCompare(b.id));
const count=set.length;
const cols=ti===1?15:ti===2?12:ti===0?9:4;
set.forEach((n,i)=>{
const col=i%cols,row=Math.floor(i/cols);
const bandX=fi*915+85,bandW=780;
const x=bandX+((col+.5)/cols)*bandW+(hash(n.id+'x')-.5)*28;
const base=ti===0?255:ti===1?430:ti===2?950:1270;
const gap=ti===0?58:ti===1?44:ti===2?44:50;
const y=base+row*gap+(hash(n.id+'y')-.5)*16;
positions.set(n.id,{x,y,field,type:n.type,degree:neighbors.get(n.id)?.length||0});
});
}
}
}
layout();
function fit(){const r=canvas.getBoundingClientRect();const all=[...positions.values()].filter(p=>nodes.some(n=>n.id&&positions.get(n.id)===p&&visible(n)));if(!all.length)return;let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;for(const p of all){minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x);minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y)}camera.k=Math.min((r.width-70)/(maxX-minX+140),(r.height-80)/(maxY-minY+120),1.4);camera.k=Math.max(.12,camera.k);camera.x=r.width/2-(minX+maxX)/2*camera.k;camera.y=r.height/2-(minY+maxY)/2*camera.k;invalidate()}
function invalidate(){dirty=true}
function resize(){const r=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);if(!r.width||!r.height)return;size={w:r.width,h:r.height,dpr};canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);invalidate()}
function worldToScreen(p){return{x:p.x*camera.k+camera.x,y:p.y*camera.k+camera.y}}
function screenToWorld(x,y){return{x:(x-camera.x)/camera.k,y:(y-camera.y)/camera.k}}
function zoomAt(x,y,mult){const old=camera.k;camera.k=Math.max(.14,Math.min(5.5,old*mult));camera.x=x-(x-camera.x)*camera.k/old;camera.y=y-(y-camera.y)*camera.k/old;invalidate()}
function bezier(a,b){const dx=b.x-a.x,dy=b.y-a.y;ctx.moveTo(a.x,a.y);ctx.bezierCurveTo(a.x+dx*.1,a.y+dy*.52,b.x-dx*.1,b.y-dy*.52,b.x,b.y)}
function draw(){
if(!dirty)return;dirty=false;const {w,h,dpr}=size;if(!w||!h)return;
const dark=document.body.classList.contains('dark'),bg=dark?'#0b0e12':'#f7f7f3',fg=dark?'#e5e9eb':'#252d31';
ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
const shown=nodes.filter(visible),showIds=new Set(shown.map(n=>n.id));
const active=selected||hover,adj=new Set(active?[active,...(neighbors.get(active)||[]).map(o=>o.id)]:[]);
const lineSet=lineMode==='none'?[]:edges.filter(e=>showIds.has(e.source)&&showIds.has(e.target)&&(lineMode==='all'||(active&&(e.source===active||e.target===active))));
ctx.save();ctx.lineWidth=lineMode==='all'?.65:1.15;
for(const e of lineSet){const a=worldToScreen(positions.get(e.source)),b=worldToScreen(positions.get(e.target));if(!a||!b)continue;ctx.beginPath();bezier(a,b);ctx.strokeStyle=lineMode==='all'?(dark?'rgba(175,184,190,.15)':'rgba(72,83,88,.15)'):(dark?'rgba(211,180,133,.74)':'rgba(102,83,63,.57)');ctx.stroke()}
ctx.restore();
if(groupLabels){ctx.textAlign='left';for(let fi=0;fi<3;fi++){const x=worldToScreen({x:fi*915+100,y:140}).x,y=worldToScreen({x:0,y:140}).y;const title=lang==='ja'?['哲学 / PHILOSOPHY','美術 / ART','建築 / ARCHITECTURE'][fi]:fields[fi].toUpperCase();ctx.font=`600 ${Math.max(11,Math.min(18,13*camera.k+6))}px Arial`;ctx.fillStyle=colors[fields[fi]];ctx.fillText(title,x,y);ctx.fillStyle=dark?'#566168':'#b6bcba';ctx.fillRect(x,y+13,Math.min(210,700*camera.k),1)}}
const candidates=[];
for(const n of shown){const p=positions.get(n.id);if(!p)continue;const v=worldToScreen(p);if(v.x<-100||v.x>w+100||v.y<-100||v.y>h+100)continue;
const isSelected=n.id===selected,isRelated=adj.has(n.id),deg=p.degree;
const radius=Math.max(1.5,Math.min(7,(n.type==='Movement'?5:2.8)*Math.sqrt(camera.k)))*(isSelected?1.8:1);
ctx.beginPath();ctx.arc(v.x,v.y,radius,0,Math.PI*2);ctx.fillStyle=colors[p.field];ctx.globalAlpha=active&&!isRelated?.24:.85;ctx.fill();ctx.globalAlpha=1;
if(n.type==='Movement'&&camera.k>.3&&style!=='images'){ctx.fillStyle=fg;ctx.font=`${Math.max(9,Math.min(12,11*camera.k+5))}px Arial`;ctx.textAlign='center';ctx.fillText(label(n),v.x,v.y-12)}
if(isSelected){ctx.beginPath();ctx.arc(v.x,v.y,11,0,Math.PI*2);ctx.strokeStyle='#c98256';ctx.lineWidth=1.5;ctx.stroke()}
if(style!=='structure'&&(n.type==='Work'||n.type==='Person')&&(pictures.has(n.id)||deg>=2))candidates.push({n,p,v,deg,rank:(pictures.has(n.id)?100:0)+deg*3+(isSelected?1000:0)});
}
candidates.sort((a,b)=>b.rank-a.rank);
const occupied=[],maxCards=Math.min(170,Math.max(25,Math.round(w*h/6500)));
let drawn=0;
for(const o of candidates){if(drawn>=maxCards)break;const im=pictures.get(o.n.id);if(!im&&style==='images')continue;
if(!im&&style==='editorial'&&camera.k<.6)continue;
const base=(o.n.type==='Work'?56:48)*imageScale,scale=Math.max(.58,Math.min(1.55,camera.k*1.6)),cardW=base*scale,cardH=cardW*(im?Math.max(.75,Math.min(1.4,im.height/im.width)):1.14);
let x=o.v.x-cardW/2,y=o.v.y+8;
if(x<5||y<5||x+cardW>w-5||y+cardH>h-8)continue;
if(occupied.some(q=>x<q.x+q.w+5&&x+cardW+5>q.x&&y<q.y+q.h+5&&y+cardH+5>q.y))continue;
occupied.push({x,y,w:cardW,h:cardH});drawn++;
ctx.globalAlpha=active&&!adj.has(o.n.id)?.27:1;
if(im){ctx.save();ctx.beginPath();ctx.rect(x,y,cardW,cardH);ctx.clip();const fit=Math.max(cardW/im.width,cardH/im.height);ctx.drawImage(im,x+(cardW-im.width*fit)/2,y+(cardH-im.height*fit)/2,im.width*fit,im.height*fit);ctx.restore()}
else{ctx.fillStyle=dark?'#1d252a':'#e6e6e0';ctx.fillRect(x,y,cardW,cardH);ctx.fillStyle=dark?'#9faeb4':'#717a7c';ctx.textAlign='center';ctx.font=`${Math.max(11,cardW*.35)}px Georgia`;ctx.fillText((o.n.label||'?').slice(0,1),x+cardW/2,y+cardH*.62)}
ctx.strokeStyle=dark?'#68747a':'#afb7b6';ctx.lineWidth=.65;ctx.strokeRect(x+.5,y+.5,cardW-1,cardH-1);
if(camera.k>.75||o.n.id===selected){ctx.textAlign='center';ctx.fillStyle=fg;ctx.font=`${Math.max(9,Math.min(11,9*camera.k+3))}px Arial`;ctx.fillText(label(o.n).slice(0,22),x+cardW/2,y+cardH+12)}
ctx.globalAlpha=1;
}
if(active&&positions.has(active)){const p=worldToScreen(positions.get(active)),n=byId.get(active);ctx.fillStyle=fg;ctx.font='600 13px Arial';ctx.textAlign='left';ctx.fillText(label(n),Math.min(w-190,p.x+16),Math.max(30,p.y-17))}
$('imageStats').textContent=`${imagesLoaded} IMAGES · ${requested} LOOKUPS · ${nodes.length} RECORDS`;
}
function loop(){draw();requestAnimationFrame(loop)}requestAnimationFrame(loop);
function local(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
const pointers=new Map();
canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;canvas.setPointerCapture(e.pointerId);const p=local(e);pointers.set(e.pointerId,p);if(pointers.size===1)drag={start:p,x:camera.x,y:camera.y,moved:false};else if(pointers.size===2){const [a,b]=[...pointers.values()];gesture={dist:Math.hypot(a.x-b.x,a.y-b.y),k:camera.k,mid:{x:(a.x+b.x)/2,y:(a.y+b.y)/2},x:camera.x,y:camera.y};drag=null}});
canvas.addEventListener('pointermove',e=>{const p=local(e);if(!pointers.has(e.pointerId)){if(e.pointerType==='mouse'){let best=null,dist=18;for(const n of nodes){if(!visible(n))continue;const q=worldToScreen(positions.get(n.id));const d=Math.hypot(q.x-p.x,q.y-p.y);if(d<dist){best=n.id;dist=d}}if(best!==hover){hover=best;invalidate()}}return}pointers.set(e.pointerId,p);if(pointers.size===2&&gesture){const [a,b]=[...pointers.values()],mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2},dist=Math.hypot(a.x-b.x,a.y-b.y);camera.k=Math.max(.14,Math.min(5.5,gesture.k*dist/Math.max(1,gesture.dist)));camera.x=mid.x-(gesture.mid.x-gesture.x)*camera.k/gesture.k;camera.y=mid.y-(gesture.mid.y-gesture.y)*camera.k/gesture.k;invalidate()}else if(drag){const dx=p.x-drag.start.x,dy=p.y-drag.start.y;if(Math.hypot(dx,dy)>5)drag.moved=true;camera.x=drag.x+dx;camera.y=drag.y+dy;invalidate()}});
function release(e){if(!pointers.has(e.pointerId))return;const moved=drag?.moved||pointers.size>1;const p=local(e);pointers.delete(e.pointerId);if(!moved&&pointers.size===0){let best=null,dist=24;for(const n of nodes){if(!visible(n))continue;const q=worldToScreen(positions.get(n.id));const d=Math.hypot(q.x-p.x,q.y-p.y);if(d<dist){best=n.id;dist=d}}if(best)inspect(best);else{selected=null;$('inspector').hidden=true;invalidate()}}if(pointers.size===1){const q=[...pointers.values()][0];drag={start:q,x:camera.x,y:camera.y,moved:true};gesture=null}else{drag=null;gesture=null}};
canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);drag=null;gesture=null});
canvas.addEventListener('wheel',e=>{e.preventDefault();const p=local(e);zoomAt(p.x,p.y,Math.exp(-e.deltaY*.0012))},{passive:false});
canvas.addEventListener('dblclick',e=>{const p=local(e);zoomAt(p.x,p.y,1.6)});
$('minus').onclick=()=>zoomAt(size.w/2,size.h/2,.75);$('plus').onclick=()=>zoomAt(size.w/2,size.h/2,1.35);$('fit').onclick=fit;
function inspect(id){const n=byId.get(id);if(!n)return;selected=id;invalidate();$('inspector').hidden=false;$('inspectorType').textContent=`${n.type.toUpperCase()} / ${(n.fields||[]).join(' / ').toUpperCase()}`;$('inspectorName').textContent=label(n);$('inspectorYear').textContent=yr(n.year);$('inspectorDescription').textContent=n.description||'';$('inspectorAudit').textContent=lang==='ja'?'登録年・関係は暫定データです。史料による検証が必要です。':'Dates and relations are provisional and require source verification.';const im=pictures.get(id);$('inspectorImage').hidden=!im;if(im)$('inspectorImage').src=im.src;const rel=$('inspectorRelations');rel.replaceChildren();for(const a of neighbors.get(id)||[]){const b=document.createElement('button');b.textContent=`${a.edge.kind} · ${label(byId.get(a.id))}`;b.onclick=()=>inspect(a.id);rel.append(b)}if(!rel.childElementCount)rel.textContent=lang==='ja'?'登録済みの関係なし':'No recorded relations';const src=n.source||'';$('inspectorSource').hidden=!/^https:\/\//.test(src);$('inspectorSource').href=src}
$('closeInspector').onclick=()=>{selected=null;$('inspector').hidden=true;invalidate()};$('menu').onclick=()=>{const open=$('settings').hidden;$('settings').hidden=!open;$('menu').setAttribute('aria-expanded',String(open))};$('closeSettings').onclick=()=>{$('settings').hidden=true;$('menu').setAttribute('aria-expanded','false')};
$('search').oninput=e=>{search=e.target.value.toLowerCase();invalidate()};$('fields').onchange=()=>{allowed=new Set([...$('fields').querySelectorAll('input:checked')].map(e=>e.value));invalidate();fit()};
$('lineMode').onchange=e=>{lineMode=e.target.value;invalidate()};$('imageScale').oninput=e=>{imageScale=+e.target.value/100;invalidate()};$('groupLabels').onchange=e=>{groupLabels=e.target.checked;invalidate()};
document.querySelectorAll('[data-style]').forEach(b=>b.onclick=()=>{style=b.dataset.style;document.querySelectorAll('[data-style]').forEach(x=>x.classList.toggle('active',x===b));invalidate()});
$('theme').onclick=()=>{document.body.classList.toggle('dark');localStorage.setItem('hn-v5-dark',document.body.classList.contains('dark')?'1':'0');invalidate()};if(localStorage.getItem('hn-v5-dark')==='1')document.body.classList.add('dark');
function translate(){document.documentElement.lang=lang;for(const e of document.querySelectorAll('[data-ja][data-en]'))e.textContent=e.dataset[lang];$('subtitle').textContent=lang==='ja'?'歴史の関係を読む、視覚アトラス':'A visual atlas of historical relations';$('chronoTitle').textContent=lang==='ja'?'歴史を時間で読む。':'Reading history through time.';$('chronoIntro').textContent=lang==='ja'?'全時代を古い順に。年は登録上の代表年であり、生年とは限りません。':'Every recorded era, oldest first. Dates are representative milestones, not necessarily birth years.';$('relationHeading').textContent=lang==='ja'?'登録された関係':'RECORDED RELATIONS';invalidate();if(view==='timeline')renderChronology()}
$('lang').onclick=()=>{lang=lang==='ja'?'en':'ja';localStorage.setItem('hn-v5-lang',lang);translate()};
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x===b));$('networkView').hidden=view!=='network';$('timelineView').hidden=view!=='timeline';$('viewNote').textContent=view==='timeline'?'ALL YEARS / OLDEST TO NEWEST':'IMAGE / RELATION / TAXONOMY';if(view==='timeline')renderChronology();else{resize();invalidate()}});
let chronoMode='all';$('timelineCompact').onclick=()=>{chronoMode='all';$('timelineCompact').classList.add('active');$('timelineTracks').classList.remove('active');renderChronology()};$('timelineTracks').onclick=()=>{chronoMode='tracks';$('timelineTracks').classList.add('active');$('timelineCompact').classList.remove('active');renderChronology()};
$('chronoQuery').oninput=renderChronology;$('chronoDiscipline').onchange=renderChronology;
function era(y){if(y<0)return 'BCE / ANTIQUITY';if(y<500)return '1–499 CE';if(y<1000)return '500–999';if(y<1400)return '1000–1399';if(y<1600)return '1400–1599';if(y<1800)return '1600–1799';if(y<1900)return '1800–1899';if(y<1950)return '1900–1949';if(y<2000)return '1950–1999';return '2000–PRESENT'}
function renderChronology(){const q=$('chronoQuery').value.toLowerCase(),f=$('chronoDiscipline').value;const arr=nodes.filter(n=>(f==='all'||n.fields?.includes(f))&&(n.label+' '+(n.description||'')).toLowerCase().includes(q)).sort((a,b)=>a.year-b.year||a.label.localeCompare(b.label));$('chronoCount').textContent=arr.length+' / '+nodes.length;const box=$('chronoContent');box.replaceChildren();box.className=chronoMode==='tracks'?'chronoTracks':'';let lastEra='';for(const n of arr){const e=era(n.year);if(e!==lastEra){const h=document.createElement('div');h.className='eraHead';h.textContent=e;box.append(h);lastEra=e}const row=document.createElement('div');row.className='chronoRow';const date=document.createElement('div');date.className='date';date.textContent=yr(n.year);row.append(date);if(chronoMode==='tracks'){for(const field of fields){const cell=document.createElement('div');if(n.fields?.includes(field))makeChronoName(cell,n);row.append(cell)}}else{const kind=document.createElement('div');kind.className='kind';kind.textContent=n.type.toUpperCase();row.append(kind);const name=document.createElement('div');makeChronoName(name,n);row.append(name);const discipline=document.createElement('div');discipline.className='discipline';discipline.textContent=n.fields?.join(' / ')||'';row.append(discipline)}box.append(row)}if(!arr.length){const d=document.createElement('p');d.className='empty';d.textContent='No matching records';box.append(d)}}
function makeChronoName(cell,n){const b=document.createElement('button');b.textContent=label(n);b.onclick=()=>inspect(n.id);cell.append(b)}
// Load images only for explicitly identified Wikimedia entities. No fuzzy name-to-image matching.
const imageCandidates=nodes.filter(n=>/^https:\/\/www\.wikidata\.org\/wiki\/Q\d+$/.test(n.source||'')).sort((a,b)=>(neighbors.get(b.id)?.length||0)-(neighbors.get(a.id)?.length||0));
let index=0,activeLoads=0;
function loadNext(){while(activeLoads<3&&index<imageCandidates.length&&requested<130){const n=imageCandidates[index++],qid=n.source.split('/').pop();requested++;activeLoads++;const url='https://www.wikidata.org/w/api.php?action=wbgetentities&ids='+qid+'&props=claims&format=json&origin=*';fetch(url).then(r=>r.json()).then(d=>{const file=d.entities?.[qid]?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;if(typeof file!=='string'||!file)return;const img=new Image();img.decoding='async';img.onload=()=>{pictures.set(n.id,img);imagesLoaded++;invalidate();if(selected===n.id)inspect(n.id)};img.src='https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(file)+'?width=320'}).catch(()=>{}).finally(()=>{activeLoads--;loadNext()})}}
loadNext();
$('totalCount').textContent=nodes.length+' ENTRIES';$('dataCaution').textContent=nodes.length+' records · '+edges.length+' provisional relations · representative dates';translate();resize();fit();new ResizeObserver(()=>{resize();invalidate()}).observe(canvas);
})();