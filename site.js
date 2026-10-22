// Ogni pagina si apre dall'inizio (o dalla sezione indicata nel link)
(function(){
  if("scrollRestoration" in history)history.scrollRestoration="manual";
  function top(){if(!location.hash)window.scrollTo(0,0);else{var el=document.getElementById(location.hash.slice(1));if(el)el.scrollIntoView();}}
  top();window.addEventListener("load",top);window.addEventListener("pageshow",function(e){if(!e.persisted)top();});
})();

// Menu mobile
(function(){
  var btn=document.getElementById("menuBtn"),nav=document.getElementById("nav");
  if(!btn||!nav)return;
  btn.addEventListener("click",function(){
    var open=nav.classList.toggle("open");
    var h=document.querySelector(".site-header");if(h)h.classList.toggle("menu-open",open);
    btn.setAttribute("aria-expanded",open);
    btn.setAttribute("aria-label",open?"Chiudi il menu":"Apri il menu");
  });
})();

// Home: il logo dell'header compare quando il logo grande nella foto esce dallo schermo
(function(){
  var big=document.querySelector(".hero-logo"),header=document.querySelector(".site-header");
  if(!big||!header)return;
  if(!("IntersectionObserver" in window)){header.classList.add("show-logo");return;}
  new IntersectionObserver(function(entries){
    header.classList.toggle("show-logo",!entries[0].isIntersecting);
  },{rootMargin:"-"+header.offsetHeight+"px 0px 0px 0px"}).observe(big);
})();
