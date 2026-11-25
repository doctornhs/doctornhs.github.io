/* orthonam — 진료실의 노벨상 (interactive timeline). Static HTML works without this file. */
(function(){
  var root=document.getElementById('nb');if(!root)return;
  var D;try{D=JSON.parse(document.getElementById('nb-data').textContent)}catch(e){return}
  var L=D.L,P=D.P;
  function $(s,c){return (c||root).querySelector(s)}
  function $$(s,c){return Array.prototype.slice.call((c||root).querySelectorAll(s))}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

  /* ---------- status filter + search (grid and table) ---------- */
  var state={s:'all',q:''};
  function matchS(st){return state.s==='all'||st.split('/').indexOf(state.s)>=0}
  function norm(s){return String(s).toLowerCase().replace(/\s+/g,'')}
  function apply(){
    var q=norm(state.q),shown=0;
    $$('.nb-cell[data-y]').forEach(function(c){
      var p=P[c.getAttribute('data-y')];var ok=matchS(p.s)&&(!q||norm(c.getAttribute('data-y')+p.l+p.t+(p.k||'')).indexOf(q)>=0);
      c.classList.toggle('dim',!ok);
    });
    $$('#nb-table tbody tr').forEach(function(r){
      var ok=matchS(r.getAttribute('data-s'))&&(!q||norm(r.textContent+(r.getAttribute('data-k')||'')).indexOf(q)>=0);
      r.hidden=!ok;if(ok)shown++;
    });
    var cnt=$('#nb-count');if(cnt)cnt.textContent=L.count.replace('{n}',shown);
    var none=$('#nb-none');if(none)none.hidden=shown>0;
  }
  $$('.nb-filter button').forEach(function(b){
    b.addEventListener('click',function(){
      state.s=b.getAttribute('data-f');
      $$('.nb-filter button').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
      apply();
    });
  });
  var qi=$('#nb-q');if(qi){qi.addEventListener('input',function(){state.q=qi.value;apply()})}

  /* ---------- grid detail ---------- */
  var box=$('#nb-detail');
  function stTag(s){return s.split('/').map(function(x){return '<em class="tag t-'+x+'">'+esc(L.st[x])+'</em>'}).join(' ')}
  function show(y,focus){
    var p=P[y];if(!p||!box)return;
    $$('.nb-cell[data-y]').forEach(function(c){c.setAttribute('aria-pressed',c.getAttribute('data-y')===String(y)?'true':'false')});
    var h='<p class="nd-y"><b>'+y+'</b> '+stTag(p.s)+'</p><p class="nd-t">'+esc(p.t)+'</p><p class="nd-l">'+esc(p.l)+'</p>';
    if(p.j&&p.j.length){h+='<p class="nd-j">'+esc(L.jour)+' '+p.j.map(function(k){return '<a href="#j-'+k+'" data-j="'+k+'">'+esc(D.J[k])+'</a>'}).join(', ')+'</p>'}
    if(p.r){h+='<p class="nd-r"><a href="'+esc(p.r[0])+'">'+esc(p.r[1])+' →</a></p>'}
    box.innerHTML=h;
    if(focus)box.focus({preventScroll:true});
  }
  $$('.nb-cell[data-y]').forEach(function(c){c.addEventListener('click',function(){show(c.getAttribute('data-y'))})});
  /* arrow keys across the year grid */
  var grid=$('.nb-grid');
  if(grid){grid.addEventListener('keydown',function(e){
    var t=e.target;if(!t.classList||!t.classList.contains('nb-cell'))return;
    var ys=$$('.nb-cell[data-y]').map(function(c){return +c.getAttribute('data-y')});
    var y=+t.getAttribute('data-y'),d={ArrowRight:1,ArrowLeft:-1,ArrowDown:10,ArrowUp:-10}[e.key];if(!d)return;
    e.preventDefault();var n=y+d;
    while(n>=1901&&n<=2026&&ys.indexOf(n)<0)n+=(Math.abs(d)===10?(d>0?1:-1):d);
    var nc=$('.nb-cell[data-y="'+n+'"]');if(nc){nc.focus();show(n)}
  })}
  show(D.first);

  /* jump from the detail box to a journey row */
  root.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[data-j]');if(!a)return;
    var row=document.getElementById('j-'+a.getAttribute('data-j'));if(!row)return;
    e.preventDefault();row.open=true;row.scrollIntoView({behavior:'smooth',block:'center'});
    row.classList.add('flash');setTimeout(function(){row.classList.remove('flash')},1600);
    var s=row.querySelector('summary');if(s)s.focus({preventScroll:true});
  });

  /* ---------- journey sorting ---------- */
  var list=$('#nb-jlist');
  function sortBy(mode){
    var rows=$$('details.jr',list),heads=$$('.jg',list);
    heads.forEach(function(h){h.hidden=mode!=='group'});
    var key={
      prize:function(r){return +r.getAttribute('data-p')},
      wait:function(r){return -(+r.getAttribute('data-w'))+(+r.getAttribute('data-p'))/1e4},
      group:function(r){return (+r.getAttribute('data-g'))*1e4+(+r.getAttribute('data-p'))}
    }[mode];
    rows.sort(function(a,b){return key(a)-key(b)});
    if(mode==='group'){
      heads.sort(function(a,b){return a.getAttribute('data-g')-b.getAttribute('data-g')});
      heads.forEach(function(h){
        var g=h.getAttribute('data-g');list.appendChild(h);
        rows.filter(function(r){return r.getAttribute('data-g')===g}).forEach(function(r){list.appendChild(r)});
      });
    }else{rows.forEach(function(r){list.appendChild(r)})}
  }
  $$('.nb-sort button').forEach(function(b){
    b.addEventListener('click',function(){
      $$('.nb-sort button').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
      sortBy(b.getAttribute('data-sort'));
    });
  });
  root.classList.add('js');
  apply();
})();
