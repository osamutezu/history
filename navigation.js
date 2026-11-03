/* HISTORY NETWORK v3.1 navigation: minimap, touch targets, keyboard zoom, fit */
(()=>{'use strict';
const api=window.HN_NAV,svg=document.getElementById('graph'),scene=document.getElementById('scene'),canvas=document.getElementById('navMinimap'),panel=document.getElementById('navTools');
if(!api||!svg||!scene||!canvas||!panel)return;
const ctx=canvas.getContext('2d'),bounds={minX:0,minY:0,maxX:1000,maxY:700};let pending=false,positions=[];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function refreshPositions(){positions=[];for(const g of scene.querySelectorAll('g.node')){const t=g.getAttribute('transform')||'',m=t.match(/translate\(\s*([-\d.]+)[ ,]+([-\d.]+)\s*\)/);if(m)positions.push({x:+m[1],y:+m[2]})}
if(!positions.length)return;
bounds.minX=Math.min(...positions.map(p=>p.x))-35;bounds.maxX=Math.max(...positions.map(p=>p.x))+35;bounds.minY=Math.min(...positions.map(p=>p.y))-35;bounds.maxY=Math.max(...positions.map(p=>p.y))+35;
}
function draw(){pending=false;const w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);ctx.fillStyle='#090d12';ctx.fillRect(0,0,w,h);if(!positions.length)refreshPositions();const bw=Math.max(1,bounds.maxX-bounds.minX),bh=Math.max(1,bounds.maxY-bounds.minY),pad=12,k=Math.min((w-2*pad)/bw,(h-2*pad)/bh),ox=(w-bw*k)/2,oy=(h-bh*k)/2;
const xy=(x,y)=>({x:ox+(x-bounds.minX)*k,y:oy+(y-bounds.minY)*k});
ctx.fillStyle='#93a9b9';for(const p of positions){const q=xy(p.x,p.y);ctx.fillRect(q.x,q.y,2,2)}
const {scale,panX,panY}=api.get(),left=-panX/scale,top=-panY/scale,right=(1000-panX)/scale,bottom=(700-panY)/scale,a=xy(left,top),b=xy(right,bottom);
ctx.strokeStyle='#e4c7a5';ctx.lineWidth=2;ctx.strokeRect(a.x,a.y,b.x-a.x,b.y-a.y);ctx.fillStyle='rgba(228,199,165,.10)';ctx.fillRect(a.x,a.y,b.x-a.x,b.y-a.y);
const readout=document.getElementById('navScale');if(readout)readout.textContent='ZOOM '+Math.round(scale*100)+'% · '+positions.length+' VISIBLE NODES';
canvas._map={k,ox,oy};}
function schedule(){if(!pending){pending=true;requestAnimationFrame(draw)}}
function zoom(f){api.zoom(f);schedule()}
document.getElementById('navPlus').addEventListener('click',()=>zoom(1.3));document.getElementById('navMinus').addEventListener('click',()=>zoom(1/1.3));
document.getElementById('navFit').addEventListener('click',()=>{document.getElementById('fitView')?.click();schedule()});
document.getElementById('navMapToggle').addEventListener('click',()=>{panel.classList.toggle('minimized');schedule()});
canvas.addEventListener('pointerdown',e=>{e.preventDefault();const r=canvas.getBoundingClientRect(),m=canvas._map;if(!m)return;const x=(e.clientX-r.left)*canvas.width/r.width,y=(e.clientY-r.top)*canvas.height/r.height;api.center(bounds.minX+(x-m.ox)/m.k,bounds.minY+(y-m.oy)/m.k);schedule()});
document.addEventListener('keydown',e=>{if(e.target.closest('input,textarea,select,[contenteditable]'))return;if(e.key==='+'||e.key==='='){e.preventDefault();zoom(1.3)}else if(e.key==='-'){e.preventDefault();zoom(1/1.3)}else if(e.key==='0'){e.preventDefault();document.getElementById('fitView')?.click()}});
new MutationObserver(m=>{if(m.some(x=>x.type==='childList'))refreshPositions();schedule()}).observe(scene,{childList:true,subtree:false,attributes:true,attributeFilter:['transform']});
new ResizeObserver(schedule).observe(svg);svg.addEventListener('wheel',schedule,{passive:true});svg.addEventListener('pointermove',schedule,{passive:true});
refreshPositions();schedule();
})();
