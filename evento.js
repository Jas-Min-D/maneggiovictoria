// Evento in evidenza: legge evento.json. In home appare come pop-up, nella pagina Esperienze come riquadro.
(function(){
  var PHONE="393737560870";
  var esc=function(t){return String(t==null?"":t).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
  fetch("evento.json",{cache:"no-cache"}).then(function(r){return r.ok?r.json():null}).then(function(ev){
    if(!ev||!ev.attivo)return;
    if(ev.fino_al){var end=new Date(ev.fino_al+"T23:59:59");if(new Date()>end)return;}
    var wa="https://wa.me/"+PHONE+"?text="+encodeURIComponent(ev.messaggio_whatsapp||("Ciao! Vorrei informazioni su: "+ev.titolo));
    var inner='<img class="ev-img" src="'+esc(String(ev.locandina||"").replace(/^\/+/,""))+'" alt="Locandina: '+esc(ev.titolo)+'">'+
      '<div class="ev-body"><span class="label">Evento in programma</span><h2>'+esc(ev.titolo)+'</h2>'+
      (ev.data?'<p class="ev-date">'+esc(ev.data)+'</p>':'')+(ev.testo?'<p>'+esc(ev.testo)+'</p>':'')+
      '<div><a class="btn" href="'+wa+'" target="_blank" rel="noopener">Partecipa su WhatsApp</a></div></div>';
    var box=document.getElementById("evento-box");
    if(box){box.innerHTML='<section class="section ev-section"><div class="wrap"><div class="ev-card">'+inner+'</div></div></section>';}
    if(document.querySelector(".hero-logo")){
      var key="ev-visto-"+ev.titolo, seen=false;
      try{seen=sessionStorage.getItem(key)==="1"}catch(e){}
      var pop=document.createElement("div");pop.className="ev-pop";pop.setAttribute("role","dialog");pop.setAttribute("aria-modal","true");pop.setAttribute("aria-label",ev.titolo);
      pop.innerHTML='<div class="ev-card ev-modal"><button class="ev-close" type="button" aria-label="Chiudi">×</button>'+inner+'</div>';
      var pill=document.createElement("button");pill.type="button";pill.className="ev-pill";pill.innerHTML="Evento in<br>programma";pill.setAttribute("aria-label","Evento in programma");
      document.body.appendChild(pop);document.body.appendChild(pill);
      function open(){pop.hidden=false;pill.hidden=true;}
      function close(){pop.hidden=true;pill.classList.add("instant");pill.classList.remove("away");pill.hidden=false;requestAnimationFrame(function(){pill.classList.remove("instant")});try{sessionStorage.setItem(key,"1")}catch(e){}}
      pop.querySelector(".ev-close").onclick=close;
      pop.addEventListener("click",function(e){if(e.target===pop)close()});
      document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!pop.hidden)close()});
      pill.onclick=open;
      // Su telefono il pulsante compare appena si inizia a scorrere, per non coprire i pulsanti della foto all'apertura
      var mq=window.matchMedia("(max-width:820px)");
      function upd(){pill.classList.toggle("away",mq.matches&&window.scrollY<12);}
      window.addEventListener("scroll",upd,{passive:true});window.addEventListener("resize",upd);upd();
      // Il pop-up compare poco dopo che si inizia a scorrere (stessa soglia del pulsante), non all'apertura
      pop.hidden=true;
      if(seen){pill.hidden=false;}
      else{
        pill.hidden=true;
        var armed=false;
        function trigger(){
          if(armed||window.scrollY<12)return;
          armed=true;window.removeEventListener("scroll",trigger);
          setTimeout(function(){if(pill.hidden){pop.classList.add("ev-enter");pop.hidden=false;}},600);
        }
        window.addEventListener("scroll",trigger,{passive:true});
      }
    }
  }).catch(function(){});
})();
