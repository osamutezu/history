(()=>{
'use strict';
const $=id=>document.getElementById(id);
const container=document.createElement('section');container.id='researchLab';
container.style.cssText='margin:18px 0;padding:14px;border:1px solid #ccd3d7;background:#f8fafb;font:12px/1.6 system-ui,sans-serif';
container.innerHTML=`<h3 style="margin:0 0 10px;letter-spacing:.1em">13 / RESEARCH LAB</h3><p style="margin:0 0 10px">Inspect coverage, network connectivity and unverified relations. Analysis reflects the currently loaded dataset, not historical truth.</p><button id="labRefresh" type="button">REFRESH ANALYSIS ↻</button> <button id="labDownload" type="button">EXPORT ANALYSIS JSON ↓</button><div id="labSummary" style="white-space:pre-wrap;margin:10px 0"></div><label>RANK BY <select id="labRank"><option value="degree">Connections</option><option value="out">Outgoing</option><option value="in">Incoming</option></select></label><div id="labTop" style="max-height:220px;overflow:auto;margin-top:10px"></div><h4 style="margin:14px 0 6px">DATA INTEGRITY</h4><div id="labWarnings" style="max-height:200px;overflow:auto;white-space:pre-wrap"></div>`;
const anchor=$('researchTools')||$('auditSummary');
if(anchor)anchor.insertAdjacentElement('afterend',container);else document.querySelector('aside')?.append(container);
function analyze(){
 const nodes=db.nodes||[],edges=db.edges||[],ids=new Map(nodes.map(n=>[n.id,n]));
 const degree=new Map(nodes.map(n=>[n.id,{in:0,out:0,degree:0}]));
 const problems=[],pairs=new Set(),adj=new Map(nodes.map(n=>[n.id,new Set()]));
 const provenance={},types={},disciplines={};
 for(const n of nodes){const p=n.provenance||'unspecified';provenance[p]=(provenance[p]||0)+1;types[n.type||'unknown']=(types[n.type||'unknown']||0)+1;for(const f of n.fields||[])disciplines[f]=(disciplines[f]||0)+1;if(!Number.isFinite(Number(n.year)))problems.push('Missing date: '+n.id)}
 for(const e of edges){if(!ids.has(e.source)||!ids.has(e.target)){problems.push('Broken relation: '+(e.id||'?'));continue}const key=[e.source,e.target,e.kind].join('|');if(pairs.has(key))problems.push('Duplicate relation: '+key);pairs.add(key);degree.get(e.source).out++;degree.get(e.target).in++;degree.get(e.source).degree++;degree.get(e.target).degree++;adj.get(e.source).add(e.target);adj.get(e.target).add(e.source)}
 const seen=new Set(),components=[];
 for(const id of ids.keys()){if(seen.has(id))continue;const q=[id];seen.add(id);let size=0;for(let i=0;i<q.length;i++){const cur=q[i];size++;for(const other of adj.get(cur)){if(!seen.has(other)){seen.add(other);q.push(other)}}}components.push(size)}
 components.sort((a,b)=>b-a);
 const ranked=[...degree].map(([id,v])=>({id,label:ids.get(id).label,...v}));
 const statuses={};for(const e of edges){const k=e.evidenceStatus||'unverified';statuses[k]=(statuses[k]||0)+1}
 return {generatedAt:new Date().toISOString(),nodes:nodes.length,edges:edges.length,types,disciplines,provenance,statuses,components:components.length,largestComponent:components[0]||0,isolated:components.filter(x=>x===1).length,problems,ranked};
}
let report;
function refresh(){report=analyze();$('labSummary').textContent=`${report.nodes} nodes / ${report.edges} relations\n${report.components} connected components · largest ${report.largestComponent} nodes · ${report.isolated} isolated\nDisciplines: ${Object.entries(report.disciplines).map(([k,v])=>k+' '+v).join(' / ')}\nEvidence: ${Object.entries(report.statuses).map(([k,v])=>k+' '+v).join(' / ')}\nProvenance: ${Object.entries(report.provenance).map(([k,v])=>k+' '+v).join(' / ')}`;
const rank=$('labRank').value;const top=[...report.ranked].sort((a,b)=>b[rank]-a[rank]).slice(0,20);$('labTop').replaceChildren(...top.map((n,i)=>{const b=document.createElement('button');b.type='button';b.style.cssText='display:block;width:100%;text-align:left;margin:2px 0';b.textContent=`${i+1}. ${n.label} — ${n[rank]}`;b.onclick=()=>{selected=n.id;selectedEdge=null;render()};return b}));$('labWarnings').textContent=report.problems.length?report.problems.slice(0,80).join('\n'):'No broken references, duplicate directed relations, or missing numeric dates detected. This does NOT validate historical accuracy.'}
$('labRefresh').onclick=refresh;$('labRank').onchange=refresh;
$('labDownload').onclick=()=>{refresh();const blob=new Blob([JSON.stringify(report,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='history-network-research-report.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500)};
const imp=$('importData');if(imp){imp.addEventListener('change',()=>setTimeout(refresh,250))}
refresh();
})();
