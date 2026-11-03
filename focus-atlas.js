/* HISTORY NETWORK v3.2 / FOCUS ATLAS — progressive enhancement */
(()=>{'use strict';
const svg=document.getElementById('graph'),scene=document.getElementById('scene'),canvas=document.getElementById('focusCanvas'),tip=document.getElementById('focusTooltip'),info=document.getElementById('focusInfo');
if(!svg||!scene||!canvas)return;
const ctx=canvas.getContext('2d'),byId=new Map((window.HISTORY_NETWORK_DATA?.nodes||[]).map(n=>[n.id,n]));
let enabled=true,depth=1,focus=null,hover=null,pending=false,lastPositions=new Map(),neighbors=new Map(),lastNodeCount=-1;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function refreshGraph(){
neighbors=new Map();for(const e of (window.HISTORY_NETWORK_DATA?.edges||[])){
if(!neighbors.has(e.source))neighbors.set(e.source,[]);
if(!neighbors.has(e.target))neighbors.set(e.target,[]);
neighbors.get(e.source).push({id:e.target,edge:e});neighbors.get(e.target).push({id:e.source,edge:e});
}}
function schedule(){if(!pending){pending=true;requestAnimationFrame(draw)}}
function points(){
const m=scene.getScreenCTM(),r=canvas.getBoundingClientRect(),out=new Map();if(!m)return out;
for(const g of scene.querySelectorAll('g.node')){const match=(g.getAttribute('transform')||'').match(/translate\(\s*([-\d.eE]+)[ ,]+([-\d.eE]+)\s*\)/);if(!match)continue;const x=+match[1],y=+match[2];out.set(g.dataset.nodeId,{x:m.a*x+m.c*y+m.e-r.left,y:m.b*x+m.d*y+m.f-r.top,g})}return out;
}
function subgraph(id){
const seen=new Map([[id,0]]),queue=[id];for(let i=0;i<queue.length;i++){const a=queue[i],d=seen.get(a);if(d>=depth)continue;for(const b of neighbors.get(a)||[])if(!seen.has(b.id)){seen.set(b.id,d+1);queue.push(b.id)}}return seen;
}
function draw(){
pending=false;const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;const dpr=Math.min(devicePixelRatio||1,2);
if(canvas.width!==Math.round(r.width*dpr)||canvas.height!==Math.round(r.height*dpr)){canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr)}
ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,r.width,r.height);
const pts=points();lastPositions=pts;
if(pts.size!==lastNodeCount){lastNodeCount=pts.size;refreshGraph()}
const target=enabled?(focus||hover):null;
if(!target||!pts.has(target)){info.textContent=focus?'FOCUSED NODE IS HIDDEN BY FILTERS':'SELECT A NODE TO TRACE RELATIONS';return}
const graph=subgraph(target),edges=(window.HISTORY_NETWORK_DATA?.edges||[]).filter(e=>graph.has(e.source)&&graph.has(e.target)&&pts.has(e.source)&&pts.has(e.target));
const selected=byId.get(target);info.textContent=`${(window.HN_LOCALIZE?.name(selected)||selected?.label)||target} · ${graph.size-1} REACHABLE · ${edges.length} LINKS · ${depth}-HOP`;
ctx.save();ctx.globalCompositeOperation='screen';
for(const e of edges){const a=pts.get(e.source),b=pts.get(e.target);const isDirect=e.source===target||e.target===target;ctx.strokeStyle=isDirect?'rgba(232,198,154,.87)':'rgba(148,198,219,.45)';ctx.lineWidth=isDirect?1.5:.8;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
for(const [id,d] of graph){const p=pts.get(id);if(!p)continue;const radius=id===target?13:d===1?7:4;ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);ctx.strokeStyle=id===target?'#ffe0b7':'#b4d5e5';ctx.lineWidth=id===target?2.2:1;ctx.stroke();if(id===target){ctx.beginPath();ctx.arc(p.x,p.y,20,0,Math.PI*2);ctx.strokeStyle='rgba(255,221,180,.25)';ctx.stroke()}}
ctx.restore();
const p=pts.get(target),n=byId.get(target);if(p&&n){const label=window.HN_LOCALIZE?.name(n)||n.label||target;ctx.font='bold 12px Arial';const width=Math.min(260,ctx.measureText(label).width+20),x=clamp(p.x+18,6,r.width-width-6),y=clamp(p.y-36,6,r.height-26);ctx.fillStyle='rgba(10,16,22,.9)';ctx.fillRect(x,y,width,22);ctx.fillStyle='#f1e3d1';ctx.fillText(label,x+9,y+15,width-18)}
}
function choose(id){focus=id;hover=null;tip.style.display='none';schedule()}
document.getElementById('focusMode')?.addEventListener('click',e=>{enabled=!enabled;e.currentTarget.classList.toggle('on',enabled);e.currentTarget.setAttribute('aria-pressed',String(enabled));schedule()});
document.getElementById('focusDepth')?.addEventListener('click',e=>{depth=depth===1?2:1;e.currentTarget.textContent='2-HOP '+(depth===2?'ON':'OFF');e.currentTarget.classList.toggle('on',depth===2);e.currentTarget.setAttribute('aria-pressed',String(depth===2));schedule()});
document.getElementById('focusClear')?.addEventListener('click',()=>{focus=null;hover=null;tip.style.display='none';schedule()});
svg.addEventListener('click',e=>{const g=e.target.closest?.('g.node');if(g){choose(g.dataset.nodeId)}else if(e.target===svg||e.target===scene){focus=null;schedule()}},false);
let lastHoverId=null;
svg.addEventListener('pointermove',e=>{
if(e.pointerType==='touch')return;
const g=e.target.closest?.('g.node'),id=g?.dataset.nodeId||null;
if(id!==lastHoverId){lastHoverId=id;hover=id;if(!focus)schedule()}
if(!id){tip.style.display='none';return}
const n=byId.get(id);if(!n)return;const rect=canvas.getBoundingClientRect();
tip.textContent=`${n.label} · ${n.fields?.join(' / ')||'Unknown'} · ${(neighbors.get(id)||[]).length} recorded links`;
tip.style.display='block';tip.style.left=clamp(e.clientX-rect.left+16,5,Math.max(5,rect.width-235))+'px';tip.style.top=clamp(e.clientY-rect.top+16,5,Math.max(5,rect.height-70))+'px';
},{passive:true});
svg.addEventListener('pointerleave',()=>{hover=null;lastHoverId=null;tip.style.display='none';schedule()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&focus){focus=null;schedule()}});
const obs=new MutationObserver(schedule);obs.observe(scene,{childList:true,subtree:false,attributes:true,attributeFilter:['transform']});
new ResizeObserver(schedule).observe(canvas);svg.addEventListener('wheel',schedule,{passive:true});svg.addEventListener('pointermove',schedule,{passive:true});document.addEventListener('input',schedule,true);
refreshGraph();schedule();
})();