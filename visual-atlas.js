/* HISTORY NETWORK visual atlas: progressive enhancement; no libraries. */
(()=>{'use strict';
const svg=document.getElementById('graph'),scene=document.getElementById('scene'),canvas=document.getElementById('visualCanvas');
if(!svg||!scene||!canvas)return;
const ctx=canvas.getContext('2d',{alpha:true}),state={enabled:true,cards:true,lines:true,labels:false};
const palette={Philosophy:'#e8bfa1',Art:'#e5d7b4',Architecture:'#a8c7d0'};
let scheduled=false,cache=new Map(),imageCache=new Map();
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
function rounded(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function fitText(text,width,size){ctx.font=`${size}px Arial`;let s=text;while(s.length>4&&ctx.measureText(s).width>width)s=s.slice(0,-2)+'…';return s}
function draw(){
scheduled=false;if(!state.enabled||!document.body.classList.contains('visual-atlas'))return;
const box=canvas.getBoundingClientRect();if(!box.width||!box.height)return;
const dpr=Math.min(devicePixelRatio||1,2),w=box.width,h=box.height;
if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}
ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
const matrix=scene.getScreenCTM();if(!matrix)return;
const pt=(x,y)=>({x:matrix.a*x+matrix.c*y+matrix.e-box.left,y:matrix.b*x+matrix.d*y+matrix.f-box.top});
const nodes=Array.from(scene.querySelectorAll('g.node'));
const pts=new Map();const nodeMap=new Map((db.nodes).map(n=>[n.id,n]));
for(const g of nodes){let t=g.getAttribute('transform')||'',m=t.match(/translate\(\s*([-\d.]+)[ ,]+([-\d.]+)\s*\)/);if(m)pts.set(g.dataset.nodeId,pt(+m[1],+m[2]))}
const zoom=clamp(Math.abs(matrix.a),.3,3);
if(state.lines){
ctx.save();ctx.globalCompositeOperation='screen';
for(const edge of (db.edges||[])){
const a=pts.get(edge.source),b=pts.get(edge.target);if(!a||!b)continue;
let focus=selected===edge.source||selected===edge.target;
ctx.strokeStyle=focus?'rgba(190,216,228,.66)':'rgba(150,169,179,.17)';
ctx.lineWidth=focus?1.05:.48;ctx.beginPath();ctx.moveTo(a.x,a.y);
const midx=(a.x+b.x)/2,midy=(a.y+b.y)/2,dx=b.x-a.x,dy=b.y-a.y;
ctx.quadraticCurveTo(midx-dy*.045,midy+dx*.045,b.x,b.y);ctx.stroke();
}ctx.restore();}
const count=pts.size;
for(const [id,p] of pts){
if(p.x<-100||p.y<-100||p.x>w+100||p.y>h+100)continue;
const n=nodeMap.get(id)||{id,label:id,type:'Person',fields:['Art']};
const col=palette[n.fields?.[0]]||'#b4c5cf';
const selected=selected===id;
const k=hash(id),sz=clamp((n.type==='Work'?19:15)*Math.sqrt(zoom),10,46),cw=sz*.76,ch=sz*1.14;
ctx.save();if(selected){ctx.shadowBlur=19;ctx.shadowColor=col;}
if(state.cards){
const colors=['#1d3e45','#a05e47','#3e5666','#76645b','#53654b','#8d7a58','#5b4059','#4b5d72'];
const bg=colors[k%colors.length],x=p.x-cw/2,y=p.y-ch/2;
rounded(x,y,cw,ch,1);ctx.fillStyle=bg;ctx.fill();
ctx.save();rounded(x,y,cw,ch,1);ctx.clip();
ctx.fillStyle='rgba(255,255,255,.07)';
for(let i=0;i<5;i++){const yy=y+((k>>i)%17)/17*ch;ctx.fillRect(x,yy,cw,Math.max(.5,ch*.018))}
ctx.fillStyle=col;ctx.globalAlpha=.75;ctx.beginPath();
if(n.fields?.[0]==='Architecture'){ctx.moveTo(x+cw*.12,y+ch*.73);ctx.lineTo(x+cw*.52,y+ch*.17);ctx.lineTo(x+cw*.89,y+ch*.73);ctx.closePath();}
else if(n.fields?.[0]==='Philosophy'){ctx.arc(x+cw*.5,y+ch*.4,cw*.23,0,Math.PI*2);}
else{ctx.rect(x+cw*.2,y+ch*.2,cw*.56,ch*.46)}
ctx.fill();ctx.restore();
ctx.fillStyle='#fff';ctx.font=`bold ${clamp(cw*.17,4,9)}px Arial`;
ctx.fillText((n.label||'').slice(0,10).toUpperCase(),x+2,y+ch-3,cw-4);
ctx.strokeStyle=selected?'#fff':'rgba(255,255,255,.48)';ctx.lineWidth=selected?1.8:.6;ctx.strokeRect(x,y,cw,ch);
}else{
ctx.beginPath();ctx.arc(p.x,p.y,selected?4:2.2,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();
}
ctx.restore();
if(selected||state.labels||(zoom>1.45&&count<600)){
ctx.font=`${selected?'bold ':''}${clamp(10*zoom,9,13)}px Arial`;ctx.textBaseline='middle';
const name=fitText(n.label||id,160,clamp(10*zoom,9,13));
ctx.fillStyle=selected?'#fff':'#d2dce4';ctx.fillText(name,p.x+cw/2+6,p.y,170);
}
}
}
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(draw)}}
const controls=[['visualToggle','enabled','VISUAL ATLAS'],['visualCards','cards','IMAGE CARDS'],['visualLines','lines','RELATION THREADS'],['visualLabels','labels','ALL LABELS']];
for(const [id,key,label] of controls){const b=document.getElementById(id);if(!b)continue;b.onclick=()=>{state[key]=!state[key];b.classList.toggle('on',state[key]);b.textContent=label+(key==='enabled'?(state[key]?' ON':' OFF'):'');document.body.classList.toggle('visual-atlas',state.enabled);schedule()}}
document.body.classList.add('visual-atlas');
const obs=new MutationObserver(schedule);obs.observe(scene,{childList:true,subtree:false,attributes:true,attributeFilter:['transform']});
new ResizeObserver(schedule).observe(canvas);
svg.addEventListener('wheel',schedule,{passive:true});svg.addEventListener('pointermove',schedule,{passive:true});
document.addEventListener('input',schedule,true);document.addEventListener('click',schedule,true);
schedule();
})();