/* v4.4: visual explanation and mode-aware visibility. No fabricated image or relation. */
(()=>{'use strict';
const stage=document.querySelector('.stage');if(!stage)return;
const key=document.createElement('div');key.id='hnVisualKey';key.setAttribute('role','status');
key.innerHTML='<span class="hnKeyLine" aria-hidden="true"></span><span id="hnVisualKeyText">IMAGES = VERIFIED SOURCE MEDIA · THREADS = RECORDED RELATIONS</span>';
stage.append(key);
const update=()=>{
 const t=document.getElementById('hnVisualKeyText');if(!t)return;
 const isJa=document.documentElement.lang==='ja'||document.querySelector('[data-lang="ja"].active');
 t.textContent=document.body.classList.contains('hn-exhibition')
  ?(isJa?'画像：出典のある資料 ／ 線：登録済みの関係':'IMAGES: SOURCE MEDIA · THREADS: RECORDED LINKS')
  :(isJa?'研究表示：画像・文字・関係線':'RESEARCH VIEW · IMAGE / TEXT / LINKS');
};
new MutationObserver(update).observe(document.body,{attributes:true,attributeFilter:['class']});
new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
update();
})();
