/* orthonam site helper: search link, font size, clinic notice */
(function(){
  var cs=document.currentScript;
  var base=(cs&&cs.src)?cs.src.slice(0,cs.src.lastIndexOf('/')+1):'/';
  /* 진료 안내 문구는 여기 한 곳만 고치면 모든 글에 반영됩니다. tel/url/hours는 비워 두면 표시되지 않습니다. */
  var CFG={org:'인천힘찬종합병원 정형외과',addr:'인천 남동구 논현로 72',tel:'1899-2220',telLabel:'대표전화 1899-2220',url:'',urlLabel:'진료 예약 안내',hours:''};
  var EN=document.documentElement.lang==='en';
  var pb=EN?base+'en/':base;
  var T=EN?{org:'Orthopedic Surgery, Incheon Himchan General Hospital',addr:'72 Nonhyeon-ro, Namdong-gu, Incheon, Korea',telLabel:'Main line 1899-2220 (within Korea)',
    lv:['Normal','Large','Extra large'],srch:'Search this site',srchTxt:'Search',fsA:'Text size: ',fsB:'. Tap to change',fsC:' (tap to change)',fsx:'A',
    fsrch:'Search site',lang:'한국어',langL:'한국어로 보기',ctaH:'If you need care',ctaP1:'I currently see patients at ',ctaP2:'. Please contact the hospital for appointments and hours.',
    aside:'Clinic information',contact:'Contact and inquiries',note:'I cannot give personal diagnoses or prescriptions by email through this site. For severe trauma or an emergency, call 119 (Korea) or go to the nearest emergency room.'}
   :{org:CFG.org,addr:CFG.addr,telLabel:CFG.telLabel,lv:['보통','크게','아주 크게'],srch:'사이트 안에서 검색',srchTxt:'검색',fsA:'글자 크기: ',fsB:'. 누르면 바뀝니다',fsC:' (누르면 바뀝니다)',fsx:'가',
    fsrch:'사이트 검색',lang:'English',langL:'View in English',ctaH:'진료가 필요하시다면',ctaP1:'현재 ',ctaP2:'에서 진료하고 있습니다. 진료 예약과 시간은 병원으로 문의해 주세요.',
    aside:'진료 안내',contact:'연락처·문의 안내',note:'이 사이트의 이메일로는 개인의 진단과 처방을 해 드릴 수 없습니다. 심한 외상이나 응급 상황은 119 또는 가까운 응급실로 가세요.'};
  var LV=T.lv;
  function otherLang(){var root;try{root=new URL(base).pathname}catch(e){root='/'}var p=location.pathname,rest=p.indexOf(root)===0?p.slice(root.length):p.replace(/^\//,'');
    if(EN){rest=rest.replace(/^en\//,'');return root+rest+location.search+location.hash}
    return root+'en/'+rest+location.search+location.hash}
  function get(){try{var n=parseInt(localStorage.getItem('orthonam-fs'),10);return n>=0&&n<=2?n:0}catch(e){return 0}}
  function put(n){try{localStorage.setItem('orthonam-fs',String(n))}catch(e){}}
  function apply(n){var r=document.documentElement;if(n)r.setAttribute('data-fs',String(n));else r.removeAttribute('data-fs');}
  function tools(){
    var nav=document.querySelector('header nav');if(!nav||nav.querySelector('.site-tools'))return;
    var box=document.createElement('span');box.className='site-tools';
    var a=document.createElement('a');a.href=pb+'search.html';a.setAttribute('aria-label',T.srch);
    a.innerHTML='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"/><path d="M13 13l4.5 4.5"/></svg>'+T.srchTxt;
    var b=document.createElement('button');b.type='button';b.className='t-fs';
    b.innerHTML='<span aria-hidden="true">'+T.fsx+'</span><b aria-hidden="true">'+T.fsx+'</b>';
    function label(){var n=get();b.setAttribute('aria-label',T.fsA+LV[n]+T.fsB);b.title=T.fsA+LV[n]+T.fsC;}
    b.addEventListener('click',function(){var n=(get()+1)%3;put(n);apply(n);label();});
    var lg=document.createElement('a');lg.className='t-lang';lg.textContent=T.lang;lg.setAttribute('hreflang',EN?'ko':'en');lg.setAttribute('lang',EN?'ko':'en');lg.setAttribute('aria-label',T.langL);lg.href=otherLang();
    label();box.appendChild(a);box.appendChild(b);box.appendChild(lg);nav.appendChild(box);
  }
  function footer(){
    var f=document.querySelector('.fnav');if(!f||f.querySelector('.f-search'))return;
    var a=document.createElement('a');a.href=pb+'search.html';a.className='f-search';a.textContent=T.fsrch;f.insertBefore(a,f.firstChild);
  }
  function cta(){
    if(document.querySelector('.cta-box'))return;
    var slot=document.getElementById('cta-slot'),host=document.querySelector('article .author-box');
    if(!slot&&!host)return;
    var d=document.createElement('aside');d.className='cta-box';d.setAttribute('aria-label',T.aside);
    var h='<h2>'+T.ctaH+'</h2><p>'+T.ctaP1+'<strong>'+T.org+'</strong>'+(T.addr?(EN?' (':'(')+T.addr+')':'')+T.ctaP2+'</p>';
    var row='';
    if(CFG.tel)row+='<a class="p" href="tel:'+CFG.tel.replace(/[^0-9+]/g,'')+'">'+(T.telLabel||CFG.tel)+'</a>';
    if(CFG.url)row+='<a class="'+(CFG.tel?'':'p')+'" href="'+CFG.url+'" target="_blank" rel="noopener">'+CFG.urlLabel+'</a>';
    row+='<a href="'+pb+'contact.html">'+T.contact+'</a>';
    h+='<div class="cta-row">'+row+'</div><p class="cta-note">'+T.note+'</p>';
    d.innerHTML=h;
    if(slot)slot.appendChild(d);else host.parentNode.insertBefore(d,host.nextSibling);
  }
  function run(){tools();footer();cta();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
