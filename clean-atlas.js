/* v3.8: chronological catalogue + decluttered network. No changes to source data. */
(()=>{'use strict';
const $=id=>document.getElementById(id),body=document.body;
const drawer=$('hnToolDrawer'),content=$('hnToolContent'),chron=$('hnChronology');
const originalControls=['visualControls','visualStudio','imageComposition','focusTools','lodControl','compositionBar','imageCuratorTrigger'];
for(const id of originalControls){const el=$(id);if(el)content.append(el)}
// Third-party panels are appended to body by their original modules; relocate when present.
const moved=new Set(originalControls);
function relocatePanels(){for(const el of document.querySelectorAll('body > div')){
 if(moved.has(el.id)||!el.id)continue;
 if(/^(compositionBar|imageCuratorTrigger|visualSettings)/i.test(el.id)&&!el.contains(content)){content.append(el);moved.add(el.id)}
}}
relocatePanels();
const toggleDrawer=force=>{const open=typeof force==='boolean'?force:drawer.hidden;drawer.hidden=!open;$('hnToggleTools').setAttribute('aria-expanded',String(open));};
$('hnToggleTools').onclick=()=>toggleDrawer();$('hnCloseTools').onclick=()=>toggleDrawer(false);
$('hnToggleSidebar').onclick=()=>{const on=body.classList.toggle('hn-sidebar-open');$('hnToggleSidebar').setAttribute('aria-expanded',String(on))};
const data=window.HISTORY_NETWORK_DATA;
const getNodes=()=>window.HN_CURRENT_DATA?.nodes||data?.nodes||[];
const years=n=>Number.isFinite(Number(n.year))?Number(n.year):null;
const formatYear=y=>y<0?`${Math.abs(y)} BCE`:y===0?'1 BCE':`${y}`;
const era=y=>y<0?'BCE':y<500?'1–499 CE':y<1000?'500–999':y<1400?'1000–1399':y<1500?'1400s':y<1600?'1500s':y<1700?'1600s':y<1800?'1700s':y<1900?'1800s':y<1950?'1900–1949':y<2000?'1950–1999':'2000–present';
const eraOrder=['BCE','1–499 CE','500–999','1000–1399','1400s','1500s','1600s','1700s','1800s','1900–1949','1950–1999','2000–present'];
let selectedId=null;
function localized(n){try{return window.HN_LOCALIZE?.name(n)||n.label}catch{return n.label}}
function renderChronology(){
 const q=$('hnChronoSearch').value.trim().toLocaleLowerCase(),field=$('hnChronoField').value,type=$('hnChronoType').value;
 const nodes=getNodes().filter(n=>years(n)!==null&&(field==='all'||n.fields?.includes(field))&&(type==='all'||n.type===type)&&(!q||[n.label,localized(n),n.description].some(t=>String(t||'').toLocaleLowerCase().includes(q)))).sort((a,b)=>years(a)-years(b)||a.label.localeCompare(b.label));
 $('hnChronoCount').textContent=`${nodes.length} / ${getNodes().length} RECORDS`;
 const list=$('hnChronoList'),nav=$('hnEraNav');list.replaceChildren();nav.replaceChildren();
 const groups=new Map();for(const n of nodes){const key=era(years(n));if(!groups.has(key))groups.set(key,[]);groups.get(key).push(n)}
 for(const key of eraOrder){const arr=groups.get(key);if(!arr?.length)continue;
 const section=document.createElement('section');section.id='hn-era-'+eraOrder.indexOf(key);const head=document.createElement('div');head.className='hnEra';head.textContent=`${key} · ${arr.length} ENTRIES`;section.append(head);
 const jump=document.createElement('button');jump.textContent=key;jump.onclick=()=>section.scrollIntoView({block:'start',behavior:'smooth'});nav.append(jump);
 for(const n of arr){const row=document.createElement('article');row.className='hnEntry';row.setAttribute('role','listitem');row.tabIndex=0;
 const time=document.createElement('time');time.textContent=formatYear(years(n));
 const f=document.createElement('div');f.className='hnField';f.textContent=(n.fields||[]).join(' / ');
 const main=document.createElement('div');const name=document.createElement('div');name.className='hnName';name.textContent=localized(n);main.append(name);
 const desc=document.createElement('div');desc.className='hnDesc';desc.textContent=n.description||'';main.append(desc);
 const kind=document.createElement('div');kind.className='hnType';kind.textContent=n.type||'';
 row.append(time,f,main,kind);
 const open=()=>{selectedId=n.id;const details=$('detail');if(details){const title=document.createElement('h2');title.textContent=localized(n);const p=document.createElement('p');p.textContent=n.description||'';const date=document.createElement('p');date.textContent=`${formatYear(years(n))} · ${n.type} · ${(n.fields||[]).join(' / ')}`;const note=document.createElement('p');note.textContent='Date meaning: '+(n.dateMeaning||'unspecified')+' · Verification: '+(n.verification||'not confirmed');details.replaceChildren(title,date,p,note);if(n.source&&/^https:\/\//.test(n.source)){const a=document.createElement('a');a.href=n.source;a.target='_blank';a.rel='noopener noreferrer';a.textContent='SOURCE ↗';details.append(a)}}body.classList.add('hn-sidebar-open');$('hnToggleSidebar').setAttribute('aria-expanded','true')};
 row.onclick=open;row.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}};section.append(row)
 }list.append(section)}
 if(!nodes.length){const e=document.createElement('p');e.className='hnEmpty';e.textContent='No records match these filters.';list.append(e)}
}
function showChronology(open){if(!open){const network=[...document.querySelectorAll('#modes button')].find(b=>b.textContent.trim()==='Network'||b.textContent.trim()==='ネットワーク');if(network&&!network.classList.contains('active'))network.click()}chron.hidden=!open;body.classList.toggle('hn-chronology-open',open);$('hnToggleTimeline').textContent=open?'NETWORK':'CHRONOLOGY';$('hnCurrentMode').textContent=open?'COMPLETE CHRONOLOGY':'NETWORK ATLAS';toggleDrawer(false);if(open)renderChronology()}
$('hnToggleTimeline').onclick=()=>showChronology(chron.hidden);$('hnCloseChronology').onclick=()=>showChronology(false);
for(const id of ['hnChronoSearch','hnChronoField','hnChronoType'])$(id).addEventListener('input',renderChronology);
// The original Timeline button now opens a genuinely chronological list, not a force-layout scatterplot.
$('modes')?.addEventListener('click',e=>{if(e.target?.textContent?.trim()==='Timeline'||e.target?.textContent?.trim()==='年表')requestAnimationFrame(()=>showChronology(true))});
// Keep the full-year timeline independent of the historical snapshot slider.
const stats=$('hnVisibleCount');function updateCount(){const v=($('stats')?.textContent||'').match(/(\d+) NODES/);if(v)stats.textContent=v[1]+' NODES'}
new MutationObserver(updateCount).observe($('stats'),{childList:true,characterData:true,subtree:true});updateCount();
window.HN_CHRONOLOGY={open:()=>showChronology(true),close:()=>showChronology(false),render:renderChronology};
})();
