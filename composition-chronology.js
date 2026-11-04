/* HISTORY NETWORK v4.1 — analytic chronology and restrained network presentation */
(()=>{'use strict';
const root=document.getElementById('hnChronology');if(!root)return;
const dataset=window.HISTORY_NETWORK_DATA;if(!dataset?.nodes?.length)return;
const nodes=dataset.nodes.filter(n=>Number.isFinite(Number(n.year))).slice().sort((a,b)=>Number(a.year)-Number(b.year)||String(a.label).localeCompare(String(b.label)));
const edges=dataset.edges||[];const idMap=new Map(nodes.map(n=>[n.id,n]));
const controls=document.querySelector('.hnChronoControls'),body=document.querySelector('.hnChronoBody');
if(!controls||!body)return;
const switcher=document.createElement('div');switcher.id='hnChronoView';switcher.innerHTML='<button type="button" data-view="map" aria-pressed="true">時間マップ / TIME MAP</button><button type="button" data-view="list" aria-pressed="false">全年代リスト / ALL ENTRIES</button><label>倍率 <input id="hnTimeZoom" type="range" min="1" max="8" step="1" value="3" aria-label="Timeline zoom"></label><label><input id="hnShowChronoEdges" type="checkbox"> 選択した関係線</label>';
controls.after(switcher);
const panel=document.createElement('section');panel.id='hnTimeMap';panel.innerHTML='<div class="hnTimeMapIntro"><span id="hnTimeCaption">紀元前600年 → 2016年 · 3分野 · 年代順</span><span>横方向にスクロール / ピンチ操作はページ拡大に依存しません</span></div><div id="hnTimeScroll" tabindex="0" aria-label="Chronological network by year"><canvas id="hnTimeCanvas" aria-label="Chronological visualization"></canvas><div id="hnTimeHotspots"></div></div><div id="hnTimeDetail" role="status">点を選択すると、記録された年代・名称・関係を表示します。</div>';
body.before(panel);
let view='map',zoom=3,showEdges=false,active=null,hotspots=[],lastW=0;
const scroll=panel.querySelector('#hnTimeScroll'),canvas=panel.querySelector('canvas'),hotspotLayer=panel.querySelector('#hnTimeHotspots'),detail=panel.querySelector('#hnTimeDetail');
const fieldNames=['Philosophy','Art','Architecture'],colors=['#b8a4d8','#e6a384','#80bdbb'];
const fmt=y=>y<0?`${Math.abs(y)} BCE`:`${y} CE`;
const name=n=>{try{return window.HN_LOCALIZE?.name(n)||n.label}catch{return n.label}};
const rangeStart=-600,rangeEnd=2020;
function draw(){if(view!=='map'||root.hidden)return;
const vw=scroll.clientWidth||700;const width=Math.max(vw,Math.round((rangeEnd-rangeStart)*(.85+zoom*.67)));const height=420;const dpr=Math.min(devicePixelRatio||1,2);canvas.style.width=width+'px';canvas.style.height=height+'px';canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);hotspotLayer.style.width=width+'px';hotspotLayer.style.height=height+'px';
const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);const left=80,right=38,axisW=width-left-right;const xYear=y=>left+(y-rangeStart)/(rangeEnd-rangeStart)*axisW;
ctx.font='11px system-ui,sans-serif';ctx.textAlign='left';ctx.textBaseline='middle';
for(let year=-600;year<=2020;year+=100){const x=xYear(year);ctx.strokeStyle=year%500===0?'#3e4a53':'#263039';ctx.lineWidth=year%500===0?1:.6;ctx.beginPath();ctx.moveTo(x,36);ctx.lineTo(x,height-20);ctx.stroke();if(year%200===0){ctx.fillStyle='#a7b2ba';ctx.fillText(year<0?`${Math.abs(year)} BCE`:String(year),x+4,19)}}
const laneYs=[110,220,330];fieldNames.forEach((f,i)=>{ctx.fillStyle=colors[i];ctx.font='bold 11px system-ui,sans-serif';ctx.fillText(f.toUpperCase(),12,laneYs[i]-50);ctx.strokeStyle='#33404a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(left,laneYs[i]+40);ctx.lineTo(width-right,laneYs[i]+40);ctx.stroke()});
const occupancy=new Map();const positions=new Map();hotspots=[];
for(const n of nodes){const x=xYear(Number(n.year));const fields=n.fields||[];const fi=Math.max(0,fieldNames.findIndex(f=>fields.includes(f)));const lane=laneYs[fi];const bin=Math.floor(x/21),key=fi+':'+bin;const count=occupancy.get(key)||0;occupancy.set(key,count+1);
const tier=count%6,side=Math.floor(count/6)%2===0?1:-1;const y=lane+(tier-2.5)*13+side*Math.floor(count/12)*3;
const pos={x,y,n,fi};positions.set(n.id,pos);hotspots.push(pos);
ctx.fillStyle=colors[fi];ctx.globalAlpha=active===n.id?1:.72;ctx.fillRect(x-2.2,y-2.2,4.4,4.4);ctx.globalAlpha=1;
}
if(showEdges&&active){for(const e of edges){if(e.source!==active&&e.target!==active)continue;const a=positions.get(e.source),b=positions.get(e.target);if(!a||!b)continue;ctx.beginPath();ctx.moveTo(a.x,a.y);const bend=Math.min(60,Math.abs(a.x-b.x)*.18);ctx.bezierCurveTo(a.x+(b.x-a.x)*.4,a.y-bend,b.x-(b.x-a.x)*.4,b.y-bend,b.x,b.y);ctx.strokeStyle='#eac9a2';ctx.lineWidth=1.15;ctx.stroke()}}
if(active&&positions.has(active)){const p=positions.get(active);ctx.strokeStyle='#ffe1b2';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(p.x,p.y,10,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#f2e3c9';ctx.font='bold 12px system-ui,sans-serif';ctx.fillText(name(p.n),p.x+14,p.y-12)}
lastW=width;
}
function selectNode(n){active=n.id;const relations=edges.filter(e=>e.source===n.id||e.target===n.id);detail.replaceChildren();const strong=document.createElement('strong');strong.textContent=`${fmt(Number(n.year))} · ${name(n)}`;const p=document.createElement('p');p.textContent=`${(n.fields||[]).join(' / ')} · ${n.type||''} · ${n.description||''}`;const small=document.createElement('small');small.textContent=`記録済みの関係: ${relations.length}件。年代は生年ではなく代表年の場合があります。検証状態: ${n.verification||'未確認'}`;detail.append(strong,p,small);draw()}
scroll.addEventListener('click',e=>{const rect=canvas.getBoundingClientRect();const x=e.clientX-rect.left,y=e.clientY-rect.top;let best=null,dist=14*14;for(const p of hotspots){const d=(p.x-x)**2+(p.y-y)**2;if(d<dist){dist=d;best=p}}if(best)selectNode(best.n)});
const zoomInput=document.getElementById('hnTimeZoom');zoomInput.addEventListener('input',()=>{const fraction=(scroll.scrollLeft+scroll.clientWidth/2)/Math.max(1,lastW);zoom=Number(zoomInput.value);draw();scroll.scrollLeft=Math.max(0,fraction*lastW-scroll.clientWidth/2)});
document.getElementById('hnShowChronoEdges').addEventListener('change',e=>{showEdges=e.target.checked;draw()});
switcher.addEventListener('click',e=>{const b=e.target.closest('button[data-view]');if(!b)return;view=b.dataset.view;for(const btn of switcher.querySelectorAll('button'))btn.setAttribute('aria-pressed',String(btn===b));panel.hidden=view==='list';body.hidden=view!=='list';zoomInput.disabled=view==='list';if(view==='map')draw()});
const chronoObserver=new MutationObserver(()=>{if(!root.hidden&&view==='map')requestAnimationFrame(draw)});chronoObserver.observe(root,{attributes:true,attributeFilter:['hidden']});
new ResizeObserver(()=>{if(!root.hidden&&view==='map')draw()}).observe(scroll);
// Network mode: clear visual priorities without changing the historical graph.
const modes=document.createElement('div');modes.id='hnNetworkReading';modes.innerHTML='<span>COMPOSITION</span><button type="button" data-network-reading="atlas" aria-pressed="true">IMAGE ATLAS</button><button type="button" data-network-reading="study" aria-pressed="false">RELATION STUDY</button><button type="button" data-network-reading="taxonomy" aria-pressed="false">TAXONOMY</button>';
const bar=document.getElementById('hnTopbar');if(bar)bar.after(modes);
modes.addEventListener('click',e=>{const b=e.target.closest('button[data-network-reading]');if(!b)return;const v=b.dataset.networkReading;document.body.dataset.networkReading=v;for(const btn of modes.querySelectorAll('button'))btn.setAttribute('aria-pressed',String(btn===b));const display=document.querySelector(`#hnImageMode button[data-atlas-mode="${v==='study'?'structure':'image'}"]`);if(display)display.click()});
document.body.dataset.networkReading='atlas';
const graph=document.getElementById('graph'),scene=document.getElementById('scene'),stage=document.querySelector('.stage');
if(graph&&scene&&stage){
 const overlay=document.createElement('canvas');overlay.id='hnTaxonomyLayer';stage.append(overlay);const cx=overlay.getContext('2d');let scheduled=false;
 function drawTaxonomy(){scheduled=false;const r=overlay.getBoundingClientRect();if(!r.width||!r.height)return;const dpr=Math.min(devicePixelRatio||1,2);overlay.width=Math.round(r.width*dpr);overlay.height=Math.round(r.height*dpr);cx.setTransform(dpr,0,0,dpr,0,0);cx.clearRect(0,0,r.width,r.height);if(document.body.dataset.networkReading!=='taxonomy'||document.body.classList.contains('hn-chronology-open'))return;
 const m=scene.getScreenCTM();if(!m)return;const fieldPoints=fieldNames.map(()=>[]);
 for(const el of scene.querySelectorAll('g.node')){const match=(el.getAttribute('transform')||'').match(/translate\(\s*([-\d.eE]+)[ ,]+([-\d.eE]+)\s*\)/);if(!match)continue;const n=idMap.get(el.dataset.nodeId);if(!n)continue;const x=Number(match[1]),y=Number(match[2]);const px=m.a*x+m.c*y+m.e-r.left,py=m.b*x+m.d*y+m.f-r.top;for(let i=0;i<fieldNames.length;i++)if(n.fields?.includes(fieldNames[i]))fieldPoints[i].push({x:px,y:py})}
 for(let i=0;i<fieldNames.length;i++){const pts=fieldPoints[i];if(!pts.length)continue;const x=pts.reduce((v,p)=>v+p.x,0)/pts.length,y=pts.reduce((v,p)=>v+p.y,0)/pts.length;cx.save();cx.strokeStyle=colors[i];cx.fillStyle=colors[i];cx.globalAlpha=.42;cx.lineWidth=.8;const sampled=pts.filter((p,j)=>j%Math.max(1,Math.ceil(pts.length/26))===0);for(const p of sampled){cx.beginPath();cx.moveTo(x,y);cx.quadraticCurveTo((x+p.x)/2,(y+p.y)/2-14,p.x,p.y);cx.stroke()}cx.globalAlpha=.85;cx.beginPath();cx.arc(x,y,24,0,Math.PI*2);cx.stroke();cx.font='bold 10px system-ui';cx.textAlign='center';cx.textBaseline='middle';cx.fillText(fieldNames[i].toUpperCase().slice(0,5),x,y);cx.restore()}
 }
 function scheduleTaxonomy(){if(!scheduled){scheduled=true;requestAnimationFrame(drawTaxonomy)}}
 new MutationObserver(scheduleTaxonomy).observe(scene,{childList:true,subtree:false,attributes:true,attributeFilter:['transform']});new ResizeObserver(scheduleTaxonomy).observe(stage);graph.addEventListener('pointermove',scheduleTaxonomy,{passive:true});graph.addEventListener('wheel',scheduleTaxonomy,{passive:true});modes.addEventListener('click',scheduleTaxonomy);scheduleTaxonomy();
}

window.HN_TIME_MAP={draw,selectNode,show:()=>{document.getElementById('hnToggleTimeline')?.click()}};
})();
