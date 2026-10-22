// Prenotazione: livello → durata → giorno e orario → dati, invio della richiesta su WhatsApp
(function(){
var PHONE="393737560870";
var LEVELS=[
  {id:"principiante",name:"Principiante",sub:"Passeggiata al passo"},
  {id:"amatore",name:"Amatore",sub:"Cavaliere occasionale"},
  {id:"esperto",name:"Esperto",sub:"Corse adrenaliniche"},
  {id:"carrozza",name:"Carrozza",sub:"Giro in carrozza, per chi non monta"}
];
var DURS=[60,90,120,180];
var PRICES={60:25,90:35,120:45,180:60}; // euro a persona, uguali per tutte le esperienze
var fmt=function(m){return (m%60?Math.floor(m/60)+"."+String(m%60).padStart(2,"0"):m/60)+" h"};
var WD=["Dom","Lun","Mar","Mer","Gio","Ven","Sab"];
var MONTHS=["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];
var $=function(id){return document.getElementById(id)};
var days=[];(function(){var t=new Date();t.setHours(12,0,0,0);for(var i=1;i<=14;i++){var d=new Date(t);d.setDate(t.getDate()+i);days.push(d)}})();
var key=function(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
var state={level:(LEVELS.some(function(l){return "#"+l.id===location.hash})?location.hash.slice(1):"principiante"),dur:60,day:key(days[0]),slot:null};

function radio(group,value,checked,inner,disabled){
  var id=(group+"-"+value).replace(/[^\w-]/g,"");
  return '<div class="choice"><input type="radio" name="'+group+'" id="'+id+'" value="'+value+'"'+(checked?" checked":"")+(disabled?" disabled":"")+'><label for="'+id+'">'+inner+'</label></div>';
}
function renderStatic(){
  $("levels").innerHTML=LEVELS.map(function(l){return radio("level",l.id,l.id===state.level,'<span class="c-name">'+l.name+'</span><span class="c-sub">'+l.sub+'</span>')}).join("");
  $("durs").innerHTML=DURS.map(function(d){return radio("dur",d,d===state.dur,'<span class="c-big">'+fmt(d).replace(" h",'<span class="unit"> h</span>')+'</span><span class="c-sub">'+PRICES[d]+' € a persona</span>')}).join("");
  $("days").innerHTML=days.map(function(d){return radio("day",key(d),key(d)===state.day,'<span class="d-w">'+WD[d.getDay()]+'</span><span class="d-n">'+d.getDate()+'</span>')}).join("");
}
function renderSlots(){
  var out=[];
  for(var s=9*60;s<=19*60;s+=30){
    var t=String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");
    out.push({t:t});
  }
  if(state.slot&&!out.some(function(o){return o.t===state.slot}))state.slot=null;
  $("slots").innerHTML=out.map(function(o){return radio("slot",o.t,o.t===state.slot,o.t,false)}).join("");
  $("slotHint").hidden=true;
}
function people(){var n=parseInt($("fPeople").value,10);return isNaN(n)||n<1?1:Math.min(n,20)}
function tot(ppl){var p=PRICES[state.dur];return ppl>1?(p*ppl)+" € ("+p+" € × "+ppl+")":p+" €"}
// Link alla pagina Conferma con i dati della prenotazione (per aggiungerla al calendario)
function confLink(name,ppl){
  var q=new URLSearchParams({n:name,e:state.level,g:state.day,o:state.slot||"",m:state.dur,p:ppl});
  return new URL("conferma.html?"+q.toString(),location.href).href;
}
function summary(){
  var lv=LEVELS.find(function(l){return l.id===state.level});
  var d=new Date(state.day+"T12:00:00");
  var dayTxt=WD[d.getDay()]+" "+d.getDate()+" "+MONTHS[d.getMonth()];
  var name=$("fName").value.trim(),ppl=people();
  var row=function(k,v){return "<dt>"+k+"</dt><dd>"+(v?String(v).replace(/</g,"&lt;"):'<span class="empty">da inserire</span>')+"</dd>"};
  $("sum").innerHTML=row("Nome",name)+row("Persone",ppl)+row(lv.id==="carrozza"?"Esperienza":"Livello",lv.name)+row("Durata",fmt(state.dur))+row("Giorno",dayTxt)+row("Orario",state.slot)+row("Totale",tot(ppl));
  var ok=!!(state.slot&&name);
  $("sendBtn").disabled=!ok;
  $("sendBtn").textContent=ok?"Invia su WhatsApp":(!name?"Inserisci il tuo nome":"Scegli un orario");
  return "Nome: "+name+"\n\nRichiesta di prenotazione "+(lv.id==="carrozza"?"giro in carrozza":"passeggiata a cavallo")+"\nPersone: "+ppl+(lv.id==="carrozza"?"":"\nLivello: "+lv.name)+"\nDurata: "+fmt(state.dur)+"\nGiorno: "+dayTxt+"\nOrario: "+state.slot+"\nTotale: "+tot(ppl)+"\n\nLink calendario (valido dopo la conferma del maneggio):\n"+confLink(name,ppl);
}
document.addEventListener("change",function(e){
  var n=e.target.name,v=e.target.value;
  if(n==="level")state.level=v;
  if(n==="dur"){state.dur=+v;renderSlots()}
  if(n==="day"){state.day=v;renderSlots()}
  if(n==="slot")state.slot=v;
  summary();
});
["fName","fPeople"].forEach(function(id){$(id).addEventListener("input",summary)});
$("fPeople").addEventListener("blur",function(){$("fPeople").value=people();summary()});
$("pMinus").addEventListener("click",function(){$("fPeople").value=Math.max(1,people()-1);summary()});
$("pPlus").addEventListener("click",function(){$("fPeople").value=Math.min(20,people()+1);summary()});
$("bookForm").addEventListener("submit",function(e){
  e.preventDefault();
  var a=document.createElement("a");
  a.href="https://wa.me/"+PHONE+"?text="+encodeURIComponent(summary());a.target="_blank";a.rel="noopener";
  document.body.appendChild(a);a.click();a.remove();
  $("sent").hidden=false;
});
renderStatic();renderSlots();summary();
})();
