// Pagina Conferma: legge i dati della prenotazione dal link e permette di aggiungerla al calendario
(function(){
  var LEVELS={principiante:"Passeggiata a cavallo · Principiante",amatore:"Passeggiata a cavallo · Amatore",esperto:"Passeggiata a cavallo · Esperto",carrozza:"Giro in carrozza"};
  var PLACE="Maneggio Victoria Country Club, presso Trulli di Piano Mangieri, Corato (BA)";
  var MAPS="https://maps.app.goo.gl/tzsDVYJ72u7W7R2o7";
  var MONTHS=["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];
  var WD=["domenica","lunedì","martedì","mercoledì","giovedì","venerdì","sabato"];
  var $=function(id){return document.getElementById(id)};
  var q=new URLSearchParams(location.search);
  var name=q.get("n")||"",lev=q.get("e")||"",day=q.get("g")||"",time=q.get("o")||"",mins=parseInt(q.get("m"),10),ppl=parseInt(q.get("p"),10)||1;
  var ok=/^\d{4}-\d{2}-\d{2}$/.test(day)&&/^\d{2}:\d{2}$/.test(time)&&mins>0&&LEVELS[lev];
  if(!ok){$("conf-ok").hidden=true;$("conf-err").hidden=false;return;}
  var Y=+day.slice(0,4),M=+day.slice(5,7),D=+day.slice(8,10),h=+time.slice(0,2),mi=+time.slice(3,5);
  // ora di Roma -> UTC (gestisce ora legale e solare)
  function romeOffsetMin(utcMs){
    try{var s=new Intl.DateTimeFormat("en-US",{timeZone:"Europe/Rome",timeZoneName:"shortOffset"}).formatToParts(new Date(utcMs)).find(function(x){return x.type==="timeZoneName"}).value;
      var m=s.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);return m?(m[1]==="-"?-1:1)*(+m[2]*60+(+m[3]||0)):0;}catch(e){return 60}
  }
  var guess=Date.UTC(Y,M-1,D,h,mi),start=guess-romeOffsetMin(guess)*60000,end=start+mins*60000;
  var z=function(n){return String(n).padStart(2,"0")};
  var utc=function(ms){var d=new Date(ms);return d.getUTCFullYear()+z(d.getUTCMonth()+1)+z(d.getUTCDate())+"T"+z(d.getUTCHours())+z(d.getUTCMinutes())+"00Z"};
  var dur=(mins%60?Math.floor(mins/60)+"."+z(mins%60):mins/60)+" h";
  var title=LEVELS[lev]+" · Maneggio Victoria";
  var details="Prenotazione a nome di "+name+" · "+ppl+(ppl===1?" persona":" persone")+" · durata "+dur+"\nIndicazioni: "+MAPS+"\nInfo: +39 373 756 08 70";
  var dObj=new Date(Y,M-1,D);
  $("c-what").textContent=LEVELS[lev];
  $("c-when").textContent=WD[dObj.getDay()]+" "+D+" "+MONTHS[M-1]+" "+Y+", ore "+time+" ("+dur+")";
  $("c-who").textContent=(name?name+" · ":"")+ppl+(ppl===1?" persona":" persone");
  $("c-google").href="https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(title)+"&dates="+utc(start)+"/"+utc(end)+"&details="+encodeURIComponent(details)+"&location="+encodeURIComponent(PLACE);
  var esc=function(s){return s.replace(/\\/g,"\\\\").replace(/;/g,"\;").replace(/,/g,"\\,").replace(/\n/g,"\\n")};
  var ics=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Maneggio Victoria//Prenotazioni//IT","CALSCALE:GREGORIAN","METHOD:PUBLISH","BEGIN:VEVENT",
    "UID:"+utc(start)+"-"+lev+"-"+Math.random().toString(36).slice(2)+"@maneggiovictoria","DTSTAMP:"+utc(Date.now()),
    "DTSTART:"+utc(start),"DTEND:"+utc(end),"SUMMARY:"+esc(title),"DESCRIPTION:"+esc(details),"LOCATION:"+esc(PLACE),
    "BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:"+esc(title),"TRIGGER:-P1D","END:VALARM",
    "BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:"+esc(title),"TRIGGER:-PT2H","END:VALARM",
    "END:VEVENT","END:VCALENDAR"].join("\r\n");
  $("c-ics").addEventListener("click",function(){
    var blob=new Blob([ics],{type:"text/calendar;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download="maneggio-victoria-"+day+".ics";document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url)},2000);
  });
})();
