// Galleria: legge l'elenco da galleria.json e le foto dalla cartella foto/
(async function(){
  var grid=document.getElementById("gallery"),filters=document.getElementById("filters");
  var NAMES={passeggiate:"Passeggiate",struttura:"La struttura"};
  var esc=function(t){return String(t==null?"":t).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
  var foto=[],shown=[],cur=0;
  // Accetta sia il nome del file ("bosco.jpg") sia il percorso scritto dal gestionale ("/foto/bosco.jpg")
  function src(p){p=String(p||"").replace(/^\/+/,"");return p.indexOf("/")>-1?p.split("/").map(encodeURIComponent).join("/"):"foto/"+encodeURIComponent(p);}
  try{
    var res=await fetch("galleria.json",{cache:"no-cache"});
    if(!res.ok)throw new Error(res.status);
    foto=await res.json();
  }catch(e){
    grid.innerHTML='<p class="muted">Non è stato possibile caricare la galleria. Controlla che galleria.json sia scritto correttamente.</p>';
    return;
  }
  var cats=[...new Set(foto.map(function(f){return f.categoria}).filter(Boolean))];
  filters.innerHTML=['<button type="button" data-c="" aria-pressed="true">Tutte</button>'].concat(cats.map(function(c){return '<button type="button" data-c="'+esc(c)+'" aria-pressed="false">'+esc(NAMES[c]||c)+'</button>'})).join("");
  function render(cat){
    shown=foto.filter(function(f){return !cat||f.categoria===cat});
    grid.innerHTML=shown.map(function(f,i){
      if(/\.mp4$/i.test(f.file))
        return '<figure class="is-video" data-i="'+i+'" tabindex="0"><video src="'+src(f.file)+'"'+(f.poster?' poster="'+src(f.poster)+'"':'')+' muted loop playsinline autoplay preload="metadata" aria-label="'+esc(f.alt)+'"></video></figure>';
      return '<figure data-i="'+i+'" tabindex="0"><img src="'+src(f.file)+'" alt="'+esc(f.alt||f.didascalia)+'" loading="lazy"></figure>';
    }).join("");
  }
  filters.addEventListener("click",function(e){
    var b=e.target.closest("button");if(!b)return;
    filters.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed",x===b)});
    render(b.dataset.c);
  });
  var lb=document.getElementById("lightbox"),img=document.getElementById("lbImg"),vid=document.getElementById("lbVid");
  function show(i){cur=(i+shown.length)%shown.length;var f=shown[cur],url=src(f.file);
    if(/\.mp4$/i.test(f.file)){img.hidden=true;vid.hidden=false;vid.src=url;vid.play().catch(function(){});}
    else{vid.pause();vid.hidden=true;vid.removeAttribute("src");img.hidden=false;img.src=url;img.alt=f.alt||"";}
    lb.hidden=false;}
  function close(){lb.hidden=true;vid.pause();}
  function open(e){var fig=e.target.closest("figure[data-i]");if(fig)show(+fig.dataset.i);}
  grid.addEventListener("click",open);
  grid.addEventListener("keydown",function(e){if(e.key==="Enter")open(e)});
  document.getElementById("lbClose").onclick=close;
  document.getElementById("lbPrev").onclick=function(){show(cur-1)};
  document.getElementById("lbNext").onclick=function(){show(cur+1)};
  lb.addEventListener("click",function(e){if(e.target===lb)close()});
  document.addEventListener("keydown",function(e){if(lb.hidden)return;if(e.key==="Escape")close();if(e.key==="ArrowLeft")show(cur-1);if(e.key==="ArrowRight")show(cur+1)});
  render("");
})();
