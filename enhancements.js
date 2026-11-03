
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const style=document.createElement('style');
style.textContent=`
#researchTools{padding:14px;border:1px solid #d9dddf;margin:16px 0;background:#fafbfb}
#researchTools h3{margin:0 0 12px;font-size:12px;letter-spacing:.12em}
#researchTools select,#researchTools input{width:100%;padding:8px;margin:4px 0 9px;border:1px solid #cdd3d6;background:#fff;font-size:12px}
#researchTools button{margin:3px 4px 5px 0}
#pathStatus{font-size:11px;line-height:1.65;white-space:pre-wrap;color:#3e5057}
#pathSteps{max-height:240px;overflow:auto;font-size:11px;line-height:1.6}
#pathSteps button{display:block;text-align:left;width:100%;font-size:11px}
#graph .research-path{stroke:#d13d31!important;stroke-opacity:1!important;stroke-width:3!important;pointer-events:none}
#graph .research-node circle{stroke:#d13d31!important;stroke-width:3!important}
#graph .research-dim{opacity:.12!important}
`;
document.head.append(style);
const box=document.createElement('div');box.id='researchTools';
box.innerHTML=`<h3>12 / RESEARCH TOOLS</h3>
<label>PATH START <input id="pathStart" list="nodeSuggestions" placeholder="Search person or work"></label>
<label>PATH END <input id="pathEnd" list="nodeSuggestions" placeholder="Search destination"></label>
<datalist id="nodeSuggestions"></datalist>
<label><input type="checkbox" id="pathDirected" style="width:auto"> Respect edge direction</label>
<label><input type="checkbox" id="pathVisible" style="width:auto" checked> Use only visible relations</label>
<button id="pathFind" type="button">FIND SHORTEST PATH →</button><button id="pathClear" type="button">CLEAR PATH</button>
<div id="pathStatus" role="status">Find a connection through existing relations. A path does not prove historical causality.</div>
<div id="pathSteps"></div>
<h3>TIME EXPLORER</h3>
<label>Playback step (years) <select id="timeStep"><option>1</option><option selected>10</option><option>25</option><option>50</option><option>100</option></select></label>
<button id="timePlay" type="button">PLAY HISTORY ▶</button><button id="timeStop" type="button">PAUSE ■</button>
<h3>DATA QUALITY</h3><div id="qualityReport" class="muted"></div>
<button id="qualityDownload" type="button">DOWNLOAD QUALITY REPORT ↓</button>
<p class="muted" style="line-height:1.5">Keyboard: / search · Esc clear. Research path follows dataset edges, including unverified candidates. Always inspect evidence before interpreting.</p>`;
const aside=document.querySelector('aside');
aside.append(box);
const data=()=>db;
let pathIds=[],pathEdges=[],timer=null;
function updateOptions(){
 const list=$('nodeSuggestions');list.replaceChildren();
 for(const n of data().nodes){const o=document.createElement('option');o.value=n.label;list.append(o)}
}
function lookup(v){return data().nodes.find(n=>n.id===v||n.label.toLowerCase()===v.trim().toLowerCase())}
function visibleGraph(){
 const nids=new Set([...document.querySelectorAll('#scene .node')].map(g=>g.getAttribute('data-node-id')).filter(Boolean));
 const allNodes=data().nodes.filter(n=>n.fields.some(f=>enabled.has(f))&&(temporal==='Accumulation'?n.year<=year:n.year<=year&&n.end>=year));
 const visible=new Set(allNodes.map(n=>n.id));
 const q=$('search').value.toLowerCase();
 for(const n of allNodes)if(q&&!n.label.toLowerCase().includes(q)&&!n.description.toLowerCase().includes(q))visible.delete(n.id);
 const edges=data().edges.filter(e=>visible.has(e.source)&&visible.has(e.target)&&($('relationType').value==='all'||e.kind===$('relationType').value)&&($('evidenceFilter').value==='all'||(e.evidenceStatus||'unverified')===$('evidenceFilter').value)&&(!$('cross').checked||data().nodes.find(n=>n.id===e.source).fields.some(f=>!data().nodes.find(x=>x.id===e.target).fields.includes(f))));
 if($('connectedOnly').checked){const conn=new Set(edges.flatMap(e=>[e.source,e.target]));for(const id of visible)if(!conn.has(id))visible.delete(id)}
 return {visible,edges};
}
function shortest(a,b){
 const limited=$('pathVisible').checked;
 const {visible,edges}=limited?visibleGraph():{visible:new Set(data().nodes.map(n=>n.id)),edges:data().edges};
 if(!visible.has(a.id)||!visible.has(b.id))return null;
 const adj=new Map([...visible].map(id=>[id,[]]));
 for(const e of edges){if(!adj.has(e.source)||!adj.has(e.target))continue;
 adj.get(e.source).push([e.target,e]);
 if(!$('pathDirected').checked)adj.get(e.target).push([e.source,e]);
 }
 const queue=[a.id],seen=new Set(queue),prev=new Map();
 for(let i=0;i<queue.length;i++){const id=queue[i];if(id===b.id)break;
 for(const [next,e] of adj.get(id)||[]){if(seen.has(next))continue;seen.add(next);prev.set(next,[id,e]);queue.push(next)}
 }
 if(!seen.has(b.id))return null;
 const ids=[b.id],es=[];
 while(ids[0]!==a.id){const [parent,e]=prev.get(ids[0]);es.unshift(e);ids.unshift(parent)}
 return {ids,edges:es};
}
function decorate(){
 const scene=$('scene');if(!scene)return;
 scene.querySelectorAll('.node').forEach(g=>{const title=g.querySelector('title');const transform=g.getAttribute('transform');const label=g.querySelector('text')?.textContent;
 const id=g.dataset.nodeId||data().nodes.find(n=>n.label===label)?.id;
 if(id)g.dataset.nodeId=id;
 });
 if(!pathIds.length)return;
 const allEdges=Array.from(scene.querySelectorAll('.edge'));
 const candidates=visibleGraph().edges;
 // SVG edges are rendered in the same order as the currently filtered edge collection.
 const selectedSet=new Set(pathEdges.map(e=>e.id||`${e.source}|${e.target}|${e.kind}`));
 allEdges.forEach((el,i)=>{const e=candidates[i];if(e&&selectedSet.has(e.id||`${e.source}|${e.target}|${e.kind}`))el.classList.add('research-path');else el.classList.add('research-dim')});
 const nodePositions=new Map();
 scene.querySelectorAll('.node').forEach(g=>{const text=g.querySelector('text')?.textContent;const n=data().nodes.find(n=>n.id===g.dataset.nodeId);if(n){nodePositions.set(n.id,g);if(pathIds.includes(n.id))g.classList.add('research-node');else g.classList.add('research-dim')}});
}
const originalRender=render;
render=function(){originalRender();requestAnimationFrame(decorate)};
function find(){
 const a=lookup($('pathStart').value),b=lookup($('pathEnd').value);
 if(!a||!b){$('pathStatus').textContent='Select two existing nodes using their exact labels.';return}
 const result=shortest(a,b);
 if(!result){pathIds=[];pathEdges=[];$('pathStatus').textContent='No path found with the current filters and direction settings.';$('pathSteps').replaceChildren();render();return}
 pathIds=result.ids;pathEdges=result.edges;
 $('pathStatus').textContent=`${result.edges.length} relation(s) · ${result.ids.length} nodes · ${result.edges.filter(e=>e.evidenceStatus!=='verified').length} relations not verified. This is a graph route, not a causal claim.`;
 const steps=$('pathSteps');steps.replaceChildren();
 result.ids.forEach((id,i)=>{const n=data().nodes.find(x=>x.id===id);const button=document.createElement('button');button.textContent=(i+1)+'. '+n.label+(i<result.edges.length?' → '+result.edges[i].kind:'');button.onclick=()=>{selected=id;selectedEdge=null;render()};steps.append(button)});
 render();
}
$('pathFind').onclick=find;
$('pathClear').onclick=()=>{pathIds=[];pathEdges=[];$('pathStatus').textContent='Path cleared.';$('pathSteps').replaceChildren();render()};
function pause(){if(timer)clearInterval(timer);timer=null;$('timePlay').textContent='PLAY HISTORY ▶'}
$('timeStop').onclick=pause;
$('timePlay').onclick=()=>{if(timer){pause();return} $('timePlay').textContent='PLAYING…';timer=setInterval(()=>{const slider=$('year');const step=Number($('timeStep').value);const next=Number(slider.value)+step;if(next>Number(slider.max)){pause();return}slider.value=next;slider.dispatchEvent(new Event('input',{bubbles:true}))},400)};
function quality(){
 const d=data(),ids=new Set(d.nodes.map(n=>n.id)),seen=new Set(),duplicateIds=[],missingEndpoints=[],missingDates=[],unverified=0,withoutEvidence=0;
 for(const n of d.nodes){if(seen.has(n.id))duplicateIds.push(n.id);seen.add(n.id);if(!Number.isFinite(Number(n.year)))missingDates.push(n.id)}
 for(const e of d.edges){if(!ids.has(e.source)||!ids.has(e.target))missingEndpoints.push(e.id||'?');if(e.evidenceStatus!=='verified')unverified++;if(!e.evidence?.length)withoutEvidence++}
 const result={release:'v2.0',nodes:d.nodes.length,edges:d.edges.length,duplicateIds,missingEndpoints,missingDates,unverified,withoutEvidence,editorialNodes:d.nodes.filter(n=>n.provenance==='editorial_seed_v2').length};
 $('qualityReport').textContent=`${result.nodes} nodes / ${result.edges} edges\n${unverified} non-verified edges · ${withoutEvidence} edges without evidence\n${duplicateIds.length} duplicate IDs · ${missingEndpoints.length} missing endpoints\n${result.editorialNodes} new editorial work entries (not independently verified)`;
 return result;
}
$('qualityDownload').onclick=()=>{const blob=new Blob([JSON.stringify(quality(),null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='history-network-quality-v2.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('pathClear').click();selected=null;selectedEdge=null;render()}else if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();$('search').focus()}});
updateOptions();quality();
const originalImport=$('importData').onchange;
if(originalImport)$('importData').onchange=async function(e){await originalImport.call(this,e);updateOptions();quality()};
window.addEventListener('beforeunload',pause);
})();
