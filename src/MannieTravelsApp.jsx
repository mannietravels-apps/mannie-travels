import { useState, useRef, useEffect } from "react";
var CN1="bg-slate-900/60 rounded-2xl border border-slate-800/60 p-4 space-y-3";
var CN2="bg-slate-900/60 rounded-2xl border border-slate-800/60 p-4";
var CN3="min-h-screen bg-slate-950 text-white";
var CN4="text-white font-semibold font-sans";
var CN5="text-slate-400 text-xs font-sans";
var CN6="text-slate-500 text-xs font-sans";
var CN7="flex items-center gap-2";
var CN8="flex items-center gap-3";
var CN9="flex items-center justify-between";
 var CN10="bg-gradient-to-b from-slate-900 to-slate-950 pt-12 px-5 pb-4 border-b border-slate-800";
 var CN11="bg-slate-800 border border-slate-700 text-slate-300 text-sm px-3 py-1.5 rounded-xl font-sans";
var CN12="text-xs text-orange-400 font-sans uppercase tracking-widest truncate";
var CN13="text-xl font-bold text-white";
 var CN14="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/70 font-sans text-sm";
 var CN15="block text-xs text-slate-400 uppercase tracking-wider mb-1.5 font-sans";
var CN16="text-orange-400";
 const DAYS_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
 const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
 const AUD = {AUD:1,USD:1.52,EUR:1.65,GBP:1.93,JPY:0.0099,THB:0.044,SGD:1.13,NZD:0.92};
function fmtFull(ds) {
  if (!ds) return "";
  var d = new Date(ds + "T12:00:00");
  if (isNaN(d.getTime())) return ds;
 return DAYS_NAMES[d.getDay()] + ", " + d.getDate() + " " + MONTH_NAMES[d.getMonth()] + " " + d.getFullYear();
}
function fmtShort(ds) {
  if (!ds) return "TBD";
  var d = new Date(ds + "T12:00:00");
  if (isNaN(d.getTime())) return ds;
 return d.getDate() + " " + MONTH_NAMES[d.getMonth()].slice(0,3) + " " + d.getFullYear();
}
function calcDuration(depDate, depTime, arrDate, arrTime) {
  if (!depTime || !arrTime) return "";
  var dp = depTime.split(":");
  var ap = arrTime.split(":");
  if (dp.length < 2 || ap.length < 2) return "";
  var depMins = parseInt(dp[0], 10) * 60 + parseInt(dp[1], 10);
  var arrMins = parseInt(ap[0], 10) * 60 + parseInt(ap[1], 10);
  var dayDiff = 0;
  if (depDate && arrDate && arrDate !== depDate) {
    var d1 = new Date(depDate + "T12:00:00");
    var d2 = new Date(arrDate + "T12:00:00");
    dayDiff = Math.round((d2 - d1) / 86400000);
  }
  var diff = arrMins - depMins + (dayDiff * 24 * 60);
  if (diff <= 0 && dayDiff === 0) diff += 24 * 60; // same-day overnight
  if (diff <= 0) return "";
  var days = Math.floor(diff / (24 * 60));
  var h    = Math.floor((diff % (24 * 60)) / 60);
  var m    = diff % 60;
  var parts = [];
  if (days > 0) parts.push(days + "d");
  if (h > 0)    parts.push(h + "h");
  if (m > 0)    parts.push(m + "m");
  return parts.join(" ");
}
function toAUD(cost, currency) {
  var rate = AUD[currency] || 1;
  return Math.round((parseFloat(cost) || 0) * rate);
}
function makeDays(startDate, count, existingEvents) {
  var result = [];
  var base = startDate ? new Date(startDate + "T12:00:00") : new Date();
  for (var i = 0; i < count; i++) {
    var d = new Date(base);
    d.setDate(base.getDate() + i);
    var yyyy = d.getFullYear();
    var mm = String(d.getMonth() + 1).padStart(2, "0");
    var dd = String(d.getDate()).padStart(2, "0");
    var ds = yyyy + "-" + mm + "-" + dd;
    var evs = (existingEvents && existingEvents[i]) ? existingEvents[i] : [];
 result.push({ id: "d" + (i + 1), label: "Day " + (i + 1), date: ds, events: evs });
  }
  return result;
}
var TRIPS0 = (function() {
  try {
    var saved = localStorage.getItem("mannie_trips");
    return saved ? JSON.parse(saved) : [];
  } catch(e) { return []; }
})();
var CN17={CN17};
var CN18={CN18};
var CN19={CN19};
var CN20={CN20};
var CN21={CN21};
var CN22={CN22};
var CN23={CN23};
var CN24={CN24};
var CN25={CN25};
var CN26={CN26};
 var AUD_RATES={AUD:1,USD:1.52,EUR:1.65,GBP:1.93,JPY:0.0099,THB:0.044,SGD:1.13,NZD:0.92};
var ETYPES = [
  {t:"Flight",i:"✈️"},{t:"Hotel",i:"🏨"},{t:"Train",i:"🚆"},{t:"Bus",i:"🚌"},
  {t:"Taxi",i:"🚖"},{t:"Car Rental",i:"🚗"},{t:"Ferry",i:"⛴️"},{t:"Food",i:"🍽️"},
 {t:"Drinks",i:"☕"},{t:"Sightseeing",i:"🗺️"},{t:"Attractions",i:"🎡"},{t:"Activity",i:"🎭"},
  {t:"Shopping",i:"🛍️"},{t:"Beach",i:"🏖️"},{t:"Medical",i:"💊"},{t:"Other",i:"📌"}
];
var CURS = [
  {code:"AUD",sym:"A$"},{code:"USD",sym:"$"},{code:"GBP",sym:"£"},
  {code:"EUR",sym:"€"},{code:"JPY",sym:"¥"},{code:"THB",sym:"฿"},
  {code:"SGD",sym:"S$"},{code:"NZD",sym:"NZ$"}
];
 var FLIGHTS={"QF7821":{al:"Qantas",dc:"SYD",dCity:"Sydney",dTerm:"T1",dep:"06:45",ac:"NRT",aCity:"Tokyo Narita",aTerm:"T2",arr:"18:30",plane:"Boeing 787-9",dur:"11h 45m"},"QF1":{al:"Qantas",dc:"SYD",dCity:"Sydney",dTerm:"T1",dep:"16:55",ac:"DXB",aCity:"Dubai",aTerm:"T1",arr:"05:40",plane:"Airbus A380",dur:"14h 45m"},"QF11":{al:"Qantas",dc:"SYD",dCity:"Sydney",dTerm:"T1",dep:"09:00",ac:"LAX",aCity:"Los Angeles",aTerm:"T8",arr:"06:15",plane:"Airbus A380",dur:"14h 15m"},"QF9":{al:"Qantas",dc:"MEL",dCity:"Melbourne",dTerm:"T2",dep:"21:30",ac:"LHR",aCity:"London Heathrow",aTerm:"T3",arr:"05:00",plane:"Boeing 787-9",dur:"21h 30m"},"QF93":{al:"Qantas",dc:"SYD",dCity:"Sydney",dTerm:"T1",dep:"08:15",ac:"DPS",aCity:"Bali",aTerm:"T2",arr:"11:30",plane:"Boeing 737",dur:"6h 15m"},"EK409":{al:"Emirates",dc:"MEL",dCity:"Melbourne",dTerm:"T2",dep:"05:15",ac:"DXB",aCity:"Dubai",aTerm:"T3",arr:"13:05",plane:"Boeing 777",dur:"13h 50m"},"EK413":{al:"Emirates",dc:"SYD",dCity:"Sydney",dTerm:"T1",dep:"22:30",ac:"DXB",aCity:"Dubai",aTerm:"T3",arr:"05:45",plane:"Airbus A380",dur:"13h 15m"},"EK419":{al:"Emirates",dc:"BNE",dCity:"Brisbane",dTerm:"Int",dep:"19:00",ac:"DXB",aCity:"Dubai",aTerm:"T3",arr:"05:35",plane:"Airbus A380",dur:"14h 35m"},"EK304":{al:"Emirates",dc:"BKK",dCity:"Bangkok",dTerm:"Main",dep:"23:45",ac:"DXB",aCity:"Dubai",aTerm:"T3",arr:"03:55",plane:"Boeing 777",dur:"7h 10m"},"QR900":{al:"Qatar Airways",dc:"DOH",dCity:"Doha",dTerm:"Main",dep:"02:00",ac:"SYD",aCity:"Sydney",aTerm:"T1",arr:"22:00",plane:"Airbus A380",dur:"17h 00m"},"QR901":{al:"Qatar Airways",dc:"SYD",dCity:"Sydney",dTerm:"T1",dep:"23:30",ac:"DOH",aCity:"Doha",aTerm:"Main",arr:"05:45",plane:"Airbus A380",dur:"15h 15m"},"QR908":{al:"Qatar Airways",dc:"DOH",dCity:"Doha",dTerm:"Main",dep:"08:45",ac:"MEL",aCity:"Melbourne",aTerm:"T2",arr:"06:00",plane:"Airbus A380",dur:"17h 15m"},"EY454":{al:"Etihad",dc:"AUH",dCity:"Abu Dhabi",dTerm:"T3",dep:"21:55",ac:"SYD",aCity:"Sydney",aTerm:"T1",arr:"20:05",plane:"Airbus A380",dur:"14h 10m"},"EY455":{al:"Etihad",dc:"SYD",dCity:"Sydney",dTerm:"T1",dep:"21:30",ac:"AUH",aCity:"Abu Dhabi",aTerm:"T3",arr:"05:15",plane:"Airbus A380",dur:"13h 45m"},"SQ221":{al:"Singapore Airlines",dc:"SYD",dCity:"Sydney",dTerm:"T1",dep:"21:55",ac:"SIN",aCity:"Singapore",aTerm:"T3",arr:"05:55",plane:"Airbus A380",dur:"8h 00m"},"SQ231":{al:"Singapore Airlines",dc:"MEL",dCity:"Melbourne",dTerm:"T2",dep:"21:20",ac:"SIN",aCity:"Singapore",aTerm:"T3",arr:"04:55",plane:"Airbus A380",dur:"7h 35m"},"MH122":{al:"Malaysia Airlines",dc:"SYD",dCity:"Sydney",dTerm:"T1",dep:"15:15",ac:"KUL",aCity:"Kuala Lumpur",aTerm:"T1",arr:"20:45",plane:"Airbus A330",dur:"8h 30m"},"JQ15":{al:"Jetstar",dc:"SYD",dCity:"Sydney",dTerm:"T2",dep:"07:55",ac:"DPS",aCity:"Bali",aTerm:"T2",arr:"11:20",plane:"Airbus A330",dur:"6h 25m"},"TR11":{al:"Scoot",dc:"SYD",dCity:"Sydney",dTerm:"T1",dep:"07:50",ac:"SIN",aCity:"Singapore",aTerm:"T3",arr:"13:50",plane:"Boeing 787-9",dur:"8h 00m"},"VA7":{al:"Virgin Australia",dc:"SYD",dCity:"Sydney",dTerm:"T2",dep:"07:30",ac:"LAX",aCity:"Los Angeles",aTerm:"T3",arr:"04:45",plane:"Boeing 777",dur:"14h 15m"},"EK408":{al:"Emirates",dc:"DXB",dCity:"Dubai",dTerm:"T3",dep:"22:05",ac:"MEL",aCity:"Melbourne",aTerm:"T2",arr:"16:50",plane:"Airbus A380",dur:"13h 45m"},"EK410":{al:"Emirates",dc:"DXB",dCity:"Dubai",dTerm:"T3",dep:"14:10",ac:"MEL",aCity:"Melbourne",aTerm:"T2",arr:"06:20",plane:"Airbus A380",dur:"13h 10m"},"EK412":{al:"Emirates",dc:"DXB",dCity:"Dubai",dTerm:"T3",dep:"03:20",ac:"MEL",aCity:"Melbourne",aTerm:"T2",arr:"21:30",plane:"Airbus A380",dur:"13h 10m"},"EK414":{al:"Emirates",dc:"DXB",dCity:"Dubai",dTerm:"T3",dep:"02:00",ac:"SYD",aCity:"Sydney",aTerm:"T1",arr:"22:30",plane:"Airbus A380",dur:"13h 30m"},"EK416":{al:"Emirates",dc:"DXB",dCity:"Dubai",dTerm:"T3",dep:"21:40",ac:"SYD",aCity:"Sydney",aTerm:"T1",arr:"17:30",plane:"Airbus A380",dur:"13h 50m"},"EK420":{al:"Emirates",dc:"DXB",dCity:"Dubai",dTerm:"T3",dep:"10:05",ac:"MEL",aCity:"Melbourne",aTerm:"T2",arr:"04:50",plane:"Airbus A380",dur:"13h 45m"},"QR902":{al:"Qatar Airways",dc:"DOH",dCity:"Doha",dTerm:"Main",dep:"09:55",ac:"MEL",aCity:"Melbourne",aTerm:"T2",arr:"07:10",plane:"Airbus A380",dur:"16h 15m"},"QR906":{al:"Qatar Airways",dc:"DOH",dCity:"Doha",dTerm:"Main",dep:"01:40",ac:"SYD",aCity:"Sydney",aTerm:"T1",arr:"23:30",plane:"Airbus A380",dur:"14h 50m"},"QR922":{al:"Qatar Airways",dc:"DOH",dCity:"Doha",dTerm:"Main",dep:"20:55",ac:"BNE",aCity:"Brisbane",aTerm:"Int",arr:"17:00",plane:"Boeing 787",dur:"14h 5m"},"QR912":{al:"Qatar Airways",dc:"DOH",dCity:"Doha",dTerm:"Main",dep:"03:30",ac:"PER",aCity:"Perth",aTerm:"T1",arr:"17:10",plane:"Boeing 777",dur:"10h 40m"},"EY456":{al:"Etihad",dc:"AUH",dCity:"Abu Dhabi",dTerm:"T3",dep:"09:35",ac:"MEL",aCity:"Melbourne",aTerm:"T2",arr:"06:25",plane:"Airbus A380",dur:"13h 50m"},"EY476":{al:"Etihad",dc:"AUH",dCity:"Abu Dhabi",dTerm:"T3",dep:"02:30",ac:"SYD",aCity:"Sydney",aTerm:"T1",arr:"22:15",plane:"Airbus A380",dur:"13h 45m"},"EY488":{al:"Etihad",dc:"AUH",dCity:"Abu Dhabi",dTerm:"T3",dep:"09:25",ac:"BNE",aCity:"Brisbane",aTerm:"Int",arr:"05:45",plane:"Boeing 787",dur:"13h 20m"},"EY492":{al:"Etihad",dc:"AUH",dCity:"Abu Dhabi",dTerm:"T3",dep:"22:15",ac:"PER",aCity:"Perth",aTerm:"T1",arr:"09:55",plane:"Boeing 787",dur:"10h 40m"},"QF2":{al:"Qantas",dc:"LHR",dCity:"London Heathrow",dTerm:"T3",dep:"21:00",ac:"SYD",aCity:"Sydney",aTerm:"T1",arr:"05:35",plane:"Boeing 787-9",dur:"22h 5m"},"QF10":{al:"Qantas",dc:"LHR",dCity:"London Heathrow",dTerm:"T3",dep:"13:30",ac:"MEL",aCity:"Melbourne",aTerm:"T1",arr:"05:40",plane:"Airbus A380",dur:"23h 10m"},"QF26":{al:"Qantas",dc:"LAX",dCity:"Los Angeles",dTerm:"T4",dep:"23:30",ac:"MEL",aCity:"Melbourne",aTerm:"T1",arr:"08:45",plane:"Airbus A380",dur:"16h 15m"},"QF7822":{al:"Qantas",dc:"NRT",dCity:"Tokyo Narita",dTerm:"T2",dep:"10:30",ac:"SYD",aCity:"Sydney",aTerm:"T1",arr:"22:50",plane:"Boeing 787-9",dur:"9h 20m"},"QF94":{al:"Qantas",dc:"DPS",dCity:"Bali",dTerm:"T2",dep:"12:50",ac:"SYD",aCity:"Sydney",aTerm:"T1",arr:"22:30",plane:"Boeing 737",dur:"6h 40m"},"QF96":{al:"Qantas",dc:"DPS",dCity:"Bali",dTerm:"T2",dep:"07:15",ac:"MEL",aCity:"Melbourne",aTerm:"T1",arr:"17:00",plane:"Boeing 737",dur:"6h 45m"},"QF82":{al:"Qantas",dc:"SIN",dCity:"Singapore",dTerm:"T1",dep:"07:55",ac:"SYD",aCity:"Sydney",aTerm:"T1",arr:"18:05",plane:"Airbus A380",dur:"8h 10m"},"SQ222":{al:"Singapore Airlines",dc:"SIN",dCity:"Singapore",dTerm:"T3",dep:"08:00",ac:"SYD",aCity:"Sydney",aTerm:"T1",arr:"18:15",plane:"Airbus A380",dur:"8h 15m"},"SQ232":{al:"Singapore Airlines",dc:"SIN",dCity:"Singapore",dTerm:"T3",dep:"23:55",ac:"MEL",aCity:"Melbourne",aTerm:"T2",arr:"09:55",plane:"Airbus A380",dur:"8h 0m"},"SQ238":{al:"Singapore Airlines",dc:"SIN",dCity:"Singapore",dTerm:"T3",dep:"09:05",ac:"BNE",aCity:"Brisbane",aTerm:"Int",arr:"19:25",plane:"Boeing 777",dur:"8h 20m"},"SQ242":{al:"Singapore Airlines",dc:"SIN",dCity:"Singapore",dTerm:"T3",dep:"01:30",ac:"PER",aCity:"Perth",aTerm:"T1",arr:"07:25",plane:"Boeing 777",dur:"4h 55m"},"MH123":{al:"Malaysia Airlines",dc:"KUL",dCity:"Kuala Lumpur",dTerm:"T1",dep:"08:55",ac:"SYD",aCity:"Sydney",aTerm:"T1",arr:"21:05",plane:"Airbus A330",dur:"8h 10m"},"MH128":{al:"Malaysia Airlines",dc:"KUL",dCity:"Kuala Lumpur",dTerm:"T1",dep:"23:55",ac:"PER",aCity:"Perth",aTerm:"T1",arr:"04:30",plane:"Airbus A330",dur:"4h 35m"},"JQ8":{al:"Jetstar",dc:"DPS",dCity:"Bali",dTerm:"T2",dep:"16:15",ac:"SYD",aCity:"Sydney",aTerm:"T2",arr:"01:35",plane:"Airbus A330",dur:"6h 20m"},"JQ16":{al:"Jetstar",dc:"DPS",dCity:"Bali",dTerm:"T2",dep:"13:10",ac:"MEL",aCity:"Melbourne",aTerm:"T4",arr:"22:50",plane:"Airbus A330",dur:"6h 40m"},"TR12":{al:"Scoot",dc:"SIN",dCity:"Singapore",dTerm:"T3",dep:"18:10",ac:"SYD",aCity:"Sydney",aTerm:"T1",arr:"04:20",plane:"Boeing 787-9",dur:"8h 10m"},"TR14":{al:"Scoot",dc:"SIN",dCity:"Singapore",dTerm:"T3",dep:"06:50",ac:"MEL",aCity:"Melbourne",aTerm:"T4",arr:"16:55",plane:"Boeing 787-9",dur:"8h 5m"},"TR18":{al:"Scoot",dc:"SIN",dCity:"Singapore",dTerm:"T3",dep:"14:25",ac:"PER",aCity:"Perth",aTerm:"T1",arr:"20:00",plane:"Boeing 787-9",dur:"4h 35m"},"TG471":{al:"Thai Airways",dc:"BKK",dCity:"Bangkok",dTerm:"Main",dep:"23:50",ac:"SYD",aCity:"Sydney",aTerm:"T1",arr:"13:20",plane:"Airbus A350",dur:"9h 30m"},"TG476":{al:"Thai Airways",dc:"BKK",dCity:"Bangkok",dTerm:"Main",dep:"22:30",ac:"MEL",aCity:"Melbourne",aTerm:"T2",arr:"11:50",plane:"Boeing 777",dur:"9h 20m"},"JL772":{al:"Japan Airlines",dc:"NRT",dCity:"Tokyo Narita",dTerm:"T2",dep:"09:55",ac:"SYD",aCity:"Sydney",aTerm:"T1",arr:"22:15",plane:"Boeing 787-9",dur:"9h 20m"},"CX102":{al:"Cathay Pacific",dc:"HKG",dCity:"Hong Kong",dTerm:"T1",dep:"23:55",ac:"SYD",aCity:"Sydney",aTerm:"T1",arr:"10:40",plane:"Airbus A350",dur:"9h 45m"},"NZ104":{al:"Air New Zealand",dc:"AKL",dCity:"Auckland",dTerm:"Int",dep:"07:30",ac:"SYD",aCity:"Sydney",aTerm:"T1",arr:"09:05",plane:"Airbus A320",dur:"3h 35m"},"FJ912":{al:"Fiji Airways",dc:"NAN",dCity:"Nadi Fiji",dTerm:"Int",dep:"11:00",ac:"SYD",aCity:"Sydney",aTerm:"T1",arr:"15:30",plane:"Airbus A330",dur:"3h 30m"},"GA716":{al:"Garuda Indonesia",dc:"DPS",dCity:"Bali",dTerm:"T2",dep:"09:00",ac:"SYD",aCity:"Sydney",aTerm:"T1",arr:"18:40",plane:"Boeing 737",dur:"6h 40m"},"GA718":{al:"Garuda Indonesia",dc:"DPS",dCity:"Bali",dTerm:"T2",dep:"10:30",ac:"PER",aCity:"Perth",aTerm:"T1",arr:"14:30",plane:"Boeing 737",dur:"3h 0m"},"QF400":{al:"Qantas",dc:"SYD",dCity:"Sydney",dTerm:"T3",dep:"06:00",ac:"MEL",aCity:"Melbourne",aTerm:"T1",arr:"07:30",plane:"Boeing 737",dur:"1h 30m"},"QF401":{al:"Qantas",dc:"MEL",dCity:"Melbourne",dTerm:"T1",dep:"06:00",ac:"SYD",aCity:"Sydney",aTerm:"T3",arr:"07:30",plane:"Boeing 737",dur:"1h 30m"},"QF430":{al:"Qantas",dc:"SYD",dCity:"Sydney",dTerm:"T3",dep:"07:00",ac:"BNE",aCity:"Brisbane",aTerm:"Dom",arr:"08:15",plane:"Boeing 737",dur:"1h 15m"},"QF431":{al:"Qantas",dc:"BNE",dCity:"Brisbane",dTerm:"Dom",dep:"06:00",ac:"SYD",aCity:"Sydney",aTerm:"T3",arr:"07:20",plane:"Boeing 737",dur:"1h 20m"},"QF670":{al:"Qantas",dc:"SYD",dCity:"Sydney",dTerm:"T3",dep:"08:00",ac:"ADL",aCity:"Adelaide",aTerm:"Dom",arr:"09:55",plane:"Boeing 737",dur:"1h 55m"},"QF671":{al:"Qantas",dc:"ADL",dCity:"Adelaide",dTerm:"Dom",dep:"06:30",ac:"SYD",aCity:"Sydney",aTerm:"T3",arr:"09:35",plane:"Boeing 737",dur:"2h 5m"},"QF500":{al:"Qantas",dc:"SYD",dCity:"Sydney",dTerm:"T3",dep:"09:00",ac:"PER",aCity:"Perth",aTerm:"T4",arr:"13:10",plane:"Boeing 737",dur:"5h 10m"},"QF501":{al:"Qantas",dc:"PER",dCity:"Perth",dTerm:"T4",dep:"07:30",ac:"SYD",aCity:"Sydney",aTerm:"T3",arr:"14:50",plane:"Boeing 737",dur:"5h 20m"},"QF440":{al:"Qantas",dc:"SYD",dCity:"Sydney",dTerm:"T3",dep:"07:30",ac:"CNS",aCity:"Cairns",aTerm:"Dom",arr:"10:25",plane:"Boeing 737",dur:"2h 55m"},"QF441":{al:"Qantas",dc:"CNS",dCity:"Cairns",dTerm:"Dom",dep:"11:10",ac:"SYD",aCity:"Sydney",aTerm:"T3",arr:"16:05",plane:"Boeing 737",dur:"3h 55m"},"QF640":{al:"Qantas",dc:"SYD",dCity:"Sydney",dTerm:"T3",dep:"08:30",ac:"HBA",aCity:"Hobart",aTerm:"Dom",arr:"10:30",plane:"Boeing 737",dur:"2h 0m"},"QF641":{al:"Qantas",dc:"HBA",dCity:"Hobart",dTerm:"Dom",dep:"06:30",ac:"SYD",aCity:"Sydney",aTerm:"T3",arr:"08:35",plane:"Boeing 737",dur:"2h 5m"},"QF630":{al:"Qantas",dc:"MEL",dCity:"Melbourne",dTerm:"T1",dep:"07:00",ac:"HBA",aCity:"Hobart",aTerm:"Dom",arr:"08:20",plane:"Boeing 737",dur:"1h 20m"},"QF631":{al:"Qantas",dc:"HBA",dCity:"Hobart",dTerm:"Dom",dep:"06:00",ac:"MEL",aCity:"Melbourne",aTerm:"T1",arr:"07:20",plane:"Boeing 737",dur:"1h 20m"},"QF680":{al:"Qantas",dc:"MEL",dCity:"Melbourne",dTerm:"T1",dep:"06:30",ac:"ADL",aCity:"Adelaide",aTerm:"Dom",arr:"07:45",plane:"Boeing 737",dur:"1h 15m"},"QF681":{al:"Qantas",dc:"ADL",dCity:"Adelaide",dTerm:"Dom",dep:"08:30",ac:"MEL",aCity:"Melbourne",aTerm:"T1",arr:"09:45",plane:"Boeing 737",dur:"1h 15m"},"QF700":{al:"Qantas",dc:"MEL",dCity:"Melbourne",dTerm:"T1",dep:"07:30",ac:"PER",aCity:"Perth",aTerm:"T4",arr:"10:30",plane:"Boeing 737",dur:"4h 0m"},"QF701":{al:"Qantas",dc:"PER",dCity:"Perth",dTerm:"T4",dep:"08:30",ac:"MEL",aCity:"Melbourne",aTerm:"T1",arr:"14:35",plane:"Boeing 737",dur:"4h 5m"},"QF480":{al:"Qantas",dc:"MEL",dCity:"Melbourne",dTerm:"T1",dep:"06:00",ac:"BNE",aCity:"Brisbane",aTerm:"Dom",arr:"07:55",plane:"Boeing 737",dur:"1h 55m"},"QF481":{al:"Qantas",dc:"BNE",dCity:"Brisbane",dTerm:"Dom",dep:"08:00",ac:"MEL",aCity:"Melbourne",aTerm:"T1",arr:"10:00",plane:"Boeing 737",dur:"2h 0m"},"QF720":{al:"Qantas",dc:"MEL",dCity:"Melbourne",dTerm:"T1",dep:"13:30",ac:"CNS",aCity:"Cairns",aTerm:"Dom",arr:"17:10",plane:"Boeing 737",dur:"3h 40m"},"QF721":{al:"Qantas",dc:"CNS",dCity:"Cairns",dTerm:"Dom",dep:"08:00",ac:"MEL",aCity:"Melbourne",aTerm:"T1",arr:"12:55",plane:"Boeing 737",dur:"3h 55m"},"QF750":{al:"Qantas",dc:"BNE",dCity:"Brisbane",dTerm:"Dom",dep:"06:30",ac:"ADL",aCity:"Adelaide",aTerm:"Dom",arr:"09:45",plane:"Boeing 737",dur:"2h 15m"},"QF751":{al:"Qantas",dc:"ADL",dCity:"Adelaide",dTerm:"Dom",dep:"10:30",ac:"BNE",aCity:"Brisbane",aTerm:"Dom",arr:"13:45",plane:"Boeing 737",dur:"2h 15m"},"QF760":{al:"Qantas",dc:"BNE",dCity:"Brisbane",dTerm:"Dom",dep:"07:00",ac:"PER",aCity:"Perth",aTerm:"T4",arr:"11:00",plane:"Boeing 737",dur:"5h 0m"},"QF761":{al:"Qantas",dc:"PER",dCity:"Perth",dTerm:"T4",dep:"09:00",ac:"BNE",aCity:"Brisbane",aTerm:"Dom",arr:"16:00",plane:"Boeing 737",dur:"5h 0m"},"QF800":{al:"Qantas",dc:"BNE",dCity:"Brisbane",dTerm:"Dom",dep:"11:00",ac:"CNS",aCity:"Cairns",aTerm:"Dom",arr:"12:45",plane:"Boeing 737",dur:"1h 45m"},"QF801":{al:"Qantas",dc:"CNS",dCity:"Cairns",dTerm:"Dom",dep:"13:30",ac:"BNE",aCity:"Brisbane",aTerm:"Dom",arr:"15:15",plane:"Boeing 737",dur:"1h 45m"},"QF880":{al:"Qantas",dc:"SYD",dCity:"Sydney",dTerm:"T3",dep:"06:00",ac:"OOL",aCity:"Gold Coast",aTerm:"Dom",arr:"07:15",plane:"Boeing 737",dur:"1h 15m"},"QF881":{al:"Qantas",dc:"OOL",dCity:"Gold Coast",dTerm:"Dom",dep:"08:00",ac:"SYD",aCity:"Sydney",aTerm:"T3",arr:"09:20",plane:"Boeing 737",dur:"1h 20m"},"QF820":{al:"Qantas",dc:"MEL",dCity:"Melbourne",dTerm:"T1",dep:"07:00",ac:"OOL",aCity:"Gold Coast",aTerm:"Dom",arr:"08:50",plane:"Boeing 737",dur:"1h 50m"},"QF821":{al:"Qantas",dc:"OOL",dCity:"Gold Coast",dTerm:"Dom",dep:"09:30",ac:"MEL",aCity:"Melbourne",aTerm:"T1",arr:"11:25",plane:"Boeing 737",dur:"1h 55m"},"QF900":{al:"Qantas",dc:"SYD",dCity:"Sydney",dTerm:"T3",dep:"08:00",ac:"DRW",aCity:"Darwin",aTerm:"Dom",arr:"12:15",plane:"Boeing 737",dur:"4h 15m"},"QF901":{al:"Qantas",dc:"DRW",dCity:"Darwin",dTerm:"Dom",dep:"13:15",ac:"SYD",aCity:"Sydney",aTerm:"T3",arr:"21:00",plane:"Boeing 737",dur:"4h 45m"},"QF940":{al:"Qantas",dc:"MEL",dCity:"Melbourne",dTerm:"T1",dep:"09:00",ac:"DRW",aCity:"Darwin",aTerm:"Dom",arr:"12:30",plane:"Boeing 737",dur:"4h 30m"},"QF941":{al:"Qantas",dc:"DRW",dCity:"Darwin",dTerm:"Dom",dep:"13:30",ac:"MEL",aCity:"Melbourne",aTerm:"T1",arr:"21:00",plane:"Boeing 737",dur:"4h 30m"},"QF680":{al:"Qantas",dc:"SYD",dCity:"Sydney",dTerm:"T3",dep:"10:00",ac:"LST",aCity:"Launceston",aTerm:"Dom",arr:"12:05",plane:"Boeing 737",dur:"2h 5m"},"QF682":{al:"Qantas",dc:"LST",dCity:"Launceston",dTerm:"Dom",dep:"06:30",ac:"MEL",aCity:"Melbourne",aTerm:"T1",arr:"07:40",plane:"Boeing 737",dur:"1h 10m"},"QF683":{al:"Qantas",dc:"MEL",dCity:"Melbourne",dTerm:"T1",dep:"08:00",ac:"LST",aCity:"Launceston",aTerm:"Dom",arr:"09:10",plane:"Boeing 737",dur:"1h 10m"},"QF952":{al:"Qantas",dc:"SYD",dCity:"Sydney",dTerm:"T3",dep:"10:30",ac:"AYQ",aCity:"Ayers Rock",aTerm:"Dom",arr:"13:30",plane:"Boeing 737",dur:"3h 0m"},"QF953":{al:"Qantas",dc:"AYQ",dCity:"Ayers Rock",dTerm:"Dom",dep:"14:15",ac:"SYD",aCity:"Sydney",aTerm:"T3",arr:"19:30",plane:"Boeing 737",dur:"3h 15m"},"QF960":{al:"Qantas",dc:"MEL",dCity:"Melbourne",dTerm:"T1",dep:"09:30",ac:"AYQ",aCity:"Ayers Rock",aTerm:"Dom",arr:"12:00",plane:"Boeing 737",dur:"2h 30m"},"QF961":{al:"Qantas",dc:"AYQ",dCity:"Ayers Rock",dTerm:"Dom",dep:"12:45",ac:"MEL",aCity:"Melbourne",aTerm:"T1",arr:"16:30",plane:"Boeing 737",dur:"2h 45m"},"VA500":{al:"Virgin Australia",dc:"SYD",dCity:"Sydney",dTerm:"T2",dep:"06:30",ac:"MEL",aCity:"Melbourne",aTerm:"T3",arr:"08:00",plane:"Boeing 737",dur:"1h 30m"},"VA501":{al:"Virgin Australia",dc:"MEL",dCity:"Melbourne",dTerm:"T3",dep:"07:30",ac:"SYD",aCity:"Sydney",aTerm:"T2",arr:"09:00",plane:"Boeing 737",dur:"1h 30m"},"VA530":{al:"Virgin Australia",dc:"SYD",dCity:"Sydney",dTerm:"T2",dep:"07:00",ac:"BNE",aCity:"Brisbane",aTerm:"Dom",arr:"08:15",plane:"Boeing 737",dur:"1h 15m"},"VA531":{al:"Virgin Australia",dc:"BNE",dCity:"Brisbane",dTerm:"Dom",dep:"06:30",ac:"SYD",aCity:"Sydney",aTerm:"T2",arr:"07:50",plane:"Boeing 737",dur:"1h 20m"},"VA560":{al:"Virgin Australia",dc:"SYD",dCity:"Sydney",dTerm:"T2",dep:"08:00",ac:"ADL",aCity:"Adelaide",aTerm:"Dom",arr:"09:55",plane:"Boeing 737",dur:"1h 55m"},"VA561":{al:"Virgin Australia",dc:"ADL",dCity:"Adelaide",dTerm:"Dom",dep:"10:30",ac:"SYD",aCity:"Sydney",aTerm:"T2",arr:"13:35",plane:"Boeing 737",dur:"2h 5m"},"VA580":{al:"Virgin Australia",dc:"SYD",dCity:"Sydney",dTerm:"T2",dep:"09:30",ac:"PER",aCity:"Perth",aTerm:"T1",arr:"13:40",plane:"Boeing 737",dur:"5h 10m"},"VA581":{al:"Virgin Australia",dc:"PER",dCity:"Perth",dTerm:"T1",dep:"08:00",ac:"SYD",aCity:"Sydney",aTerm:"T2",arr:"15:15",plane:"Boeing 737",dur:"5h 15m"},"VA600":{al:"Virgin Australia",dc:"MEL",dCity:"Melbourne",dTerm:"T3",dep:"07:00",ac:"BNE",aCity:"Brisbane",aTerm:"Dom",arr:"08:55",plane:"Boeing 737",dur:"1h 55m"},"VA601":{al:"Virgin Australia",dc:"BNE",dCity:"Brisbane",dTerm:"Dom",dep:"09:30",ac:"MEL",aCity:"Melbourne",aTerm:"T3",arr:"11:30",plane:"Boeing 737",dur:"2h 0m"},"VA620":{al:"Virgin Australia",dc:"MEL",dCity:"Melbourne",dTerm:"T3",dep:"08:30",ac:"ADL",aCity:"Adelaide",aTerm:"Dom",arr:"09:45",plane:"Boeing 737",dur:"1h 15m"},"VA621":{al:"Virgin Australia",dc:"ADL",dCity:"Adelaide",dTerm:"Dom",dep:"10:30",ac:"MEL",aCity:"Melbourne",aTerm:"T3",arr:"11:45",plane:"Boeing 737",dur:"1h 15m"},"VA640":{al:"Virgin Australia",dc:"MEL",dCity:"Melbourne",dTerm:"T3",dep:"07:30",ac:"PER",aCity:"Perth",aTerm:"T1",arr:"10:30",plane:"Boeing 737",dur:"4h 0m"},"VA641":{al:"Virgin Australia",dc:"PER",dCity:"Perth",dTerm:"T1",dep:"09:00",ac:"MEL",aCity:"Melbourne",aTerm:"T3",arr:"15:10",plane:"Boeing 737",dur:"4h 10m"},"VA660":{al:"Virgin Australia",dc:"BNE",dCity:"Brisbane",dTerm:"Dom",dep:"07:30",ac:"PER",aCity:"Perth",aTerm:"T1",arr:"11:30",plane:"Boeing 737",dur:"5h 0m"},"VA661":{al:"Virgin Australia",dc:"PER",dCity:"Perth",dTerm:"T1",dep:"10:00",ac:"BNE",aCity:"Brisbane",aTerm:"Dom",arr:"17:00",plane:"Boeing 737",dur:"5h 0m"},"VA680":{al:"Virgin Australia",dc:"MEL",dCity:"Melbourne",dTerm:"T3",dep:"07:00",ac:"OOL",aCity:"Gold Coast",aTerm:"Dom",arr:"08:55",plane:"Boeing 737",dur:"1h 55m"},"VA681":{al:"Virgin Australia",dc:"OOL",dCity:"Gold Coast",dTerm:"Dom",dep:"09:30",ac:"MEL",aCity:"Melbourne",aTerm:"T3",arr:"11:30",plane:"Boeing 737",dur:"2h 0m"},"JQ500":{al:"Jetstar",dc:"SYD",dCity:"Sydney",dTerm:"T2",dep:"07:00",ac:"MEL",aCity:"Melbourne",aTerm:"T4",arr:"08:30",plane:"Airbus A320",dur:"1h 30m"},"JQ501":{al:"Jetstar",dc:"MEL",dCity:"Melbourne",dTerm:"T4",dep:"08:30",ac:"SYD",aCity:"Sydney",aTerm:"T2",arr:"10:00",plane:"Airbus A320",dur:"1h 30m"},"JQ520":{al:"Jetstar",dc:"SYD",dCity:"Sydney",dTerm:"T2",dep:"06:30",ac:"BNE",aCity:"Brisbane",aTerm:"Dom",arr:"07:45",plane:"Airbus A320",dur:"1h 15m"},"JQ521":{al:"Jetstar",dc:"BNE",dCity:"Brisbane",dTerm:"Dom",dep:"08:30",ac:"SYD",aCity:"Sydney",aTerm:"T2",arr:"09:50",plane:"Airbus A320",dur:"1h 20m"},"JQ540":{al:"Jetstar",dc:"MEL",dCity:"Melbourne",dTerm:"T4",dep:"07:00",ac:"BNE",aCity:"Brisbane",aTerm:"Dom",arr:"08:55",plane:"Airbus A320",dur:"1h 55m"},"JQ541":{al:"Jetstar",dc:"BNE",dCity:"Brisbane",dTerm:"Dom",dep:"09:30",ac:"MEL",aCity:"Melbourne",aTerm:"T4",arr:"11:30",plane:"Airbus A320",dur:"2h 0m"},"JQ560":{al:"Jetstar",dc:"MEL",dCity:"Melbourne",dTerm:"T4",dep:"08:00",ac:"ADL",aCity:"Adelaide",aTerm:"Dom",arr:"09:15",plane:"Airbus A320",dur:"1h 15m"},"JQ561":{al:"Jetstar",dc:"ADL",dCity:"Adelaide",dTerm:"Dom",dep:"10:00",ac:"MEL",aCity:"Melbourne",aTerm:"T4",arr:"11:15",plane:"Airbus A320",dur:"1h 15m"},"JQ580":{al:"Jetstar",dc:"MEL",dCity:"Melbourne",dTerm:"T4",dep:"07:30",ac:"OOL",aCity:"Gold Coast",aTerm:"Dom",arr:"09:25",plane:"Airbus A320",dur:"1h 55m"},"JQ581":{al:"Jetstar",dc:"OOL",dCity:"Gold Coast",dTerm:"Dom",dep:"10:00",ac:"MEL",aCity:"Melbourne",aTerm:"T4",arr:"12:00",plane:"Airbus A320",dur:"2h 0m"},"JQ600":{al:"Jetstar",dc:"SYD",dCity:"Sydney",dTerm:"T2",dep:"08:00",ac:"ADL",aCity:"Adelaide",aTerm:"Dom",arr:"09:55",plane:"Airbus A320",dur:"1h 55m"},"JQ601":{al:"Jetstar",dc:"ADL",dCity:"Adelaide",dTerm:"Dom",dep:"10:30",ac:"SYD",aCity:"Sydney",aTerm:"T2",arr:"13:35",plane:"Airbus A320",dur:"2h 5m"},"JQ620":{al:"Jetstar",dc:"SYD",dCity:"Sydney",dTerm:"T2",dep:"09:00",ac:"OOL",aCity:"Gold Coast",aTerm:"Dom",arr:"10:15",plane:"Airbus A320",dur:"1h 15m"},"JQ621":{al:"Jetstar",dc:"OOL",dCity:"Gold Coast",dTerm:"Dom",dep:"11:00",ac:"SYD",aCity:"Sydney",aTerm:"T2",arr:"12:20",plane:"Airbus A320",dur:"1h 20m"},"JQ640":{al:"Jetstar",dc:"BNE",dCity:"Brisbane",dTerm:"Dom",dep:"07:00",ac:"CNS",aCity:"Cairns",aTerm:"Dom",arr:"08:45",plane:"Airbus A320",dur:"1h 45m"},"JQ641":{al:"Jetstar",dc:"CNS",dCity:"Cairns",dTerm:"Dom",dep:"09:30",ac:"BNE",aCity:"Brisbane",aTerm:"Dom",arr:"11:15",plane:"Airbus A320",dur:"1h 45m"},"JQ660":{al:"Jetstar",dc:"MEL",dCity:"Melbourne",dTerm:"T4",dep:"09:00",ac:"HBA",aCity:"Hobart",aTerm:"Dom",arr:"10:20",plane:"Airbus A320",dur:"1h 20m"},"JQ661":{al:"Jetstar",dc:"HBA",dCity:"Hobart",dTerm:"Dom",dep:"07:00",ac:"MEL",aCity:"Melbourne",aTerm:"T4",arr:"08:20",plane:"Airbus A320",dur:"1h 20m"},"EK415":{al:"Emirates",dc:"SYD",dCity:"Sydney",dTerm:"T1",dep:"06:45",ac:"DXB",aCity:"Dubai",aTerm:"T3",arr:"14:50",plane:"Boeing 777",dur:"13h 5m"},"EK411":{al:"Emirates",dc:"BNE",dCity:"Brisbane",dTerm:"Int",dep:"09:00",ac:"DXB",aCity:"Dubai",aTerm:"T3",arr:"19:40",plane:"Airbus A380",dur:"14h 40m"},"EK417":{al:"Emirates",dc:"PER",dCity:"Perth",dTerm:"T1",dep:"17:10",ac:"DXB",aCity:"Dubai",aTerm:"T3",arr:"23:05",plane:"Airbus A380",dur:"10h 55m"},"EK418":{al:"Emirates",dc:"DXB",dCity:"Dubai",dTerm:"T3",dep:"09:25",ac:"PER",aCity:"Perth",aTerm:"T1",arr:"20:05",plane:"Airbus A380",dur:"10h 40m"},"JQ63":{al:"Jetstar",dc:"MEL",dCity:"Melbourne",dTerm:"T2",dep:"10:55",ac:"SGN",aCity:"Ho Chi Minh City",aTerm:"T2",arr:"15:59",plane:"Boeing 787-8",dur:"8h 4m"},"JQ64":{al:"Jetstar",dc:"SGN",dCity:"Ho Chi Minh City",dTerm:"T2",dep:"17:30",ac:"MEL",aCity:"Melbourne",aTerm:"T2",arr:"04:30",plane:"Boeing 787-8",dur:"8h 0m"},"VJ082":{al:"VietJet Air",dc:"MEL",dCity:"Melbourne",dTerm:"T2",dep:"01:00",ac:"SGN",aCity:"Ho Chi Minh City",aTerm:"T2",arr:"05:25",plane:"Airbus A330",dur:"8h 25m"},"VJ081":{al:"VietJet Air",dc:"SGN",dCity:"Ho Chi Minh City",dTerm:"T2",dep:"11:05",ac:"MEL",aCity:"Melbourne",aTerm:"T2",arr:"23:35",plane:"Airbus A330",dur:"8h 30m"},"JQ7":{al:"Jetstar",dc:"MEL",dCity:"Melbourne",dTerm:"T4",dep:"08:00",ac:"DPS",aCity:"Bali",aTerm:"I",arr:"11:15",plane:"Airbus A321",dur:"6h 15m"},"JQ57":{al:"Jetstar",dc:"BNE",dCity:"Brisbane",dTerm:"Dom",dep:"07:30",ac:"DPS",aCity:"Bali",aTerm:"I",arr:"11:25",plane:"Airbus A321",dur:"5h 55m"},"JQ58":{al:"Jetstar",dc:"DPS",dCity:"Bali",dTerm:"I",dep:"13:30",ac:"BNE",aCity:"Brisbane",aTerm:"Int",arr:"21:25",plane:"Airbus A321",dur:"5h 55m"},"JQ116":{al:"Jetstar",dc:"PER",dCity:"Perth",dTerm:"T1",dep:"16:45",ac:"DPS",aCity:"Bali",aTerm:"I",arr:"20:30",plane:"Airbus A321",dur:"3h 45m"},"JQ117":{al:"Jetstar",dc:"DPS",dCity:"Bali",dTerm:"I",dep:"21:30",ac:"PER",aCity:"Perth",aTerm:"T1",arr:"01:15",plane:"Airbus A321",dur:"3h 45m"},"JQ125":{al:"Jetstar",dc:"ADL",dCity:"Adelaide",dTerm:"T1",dep:"09:30",ac:"DPS",aCity:"Bali",aTerm:"I",arr:"14:00",plane:"Airbus A321",dur:"5h 30m"},"JQ126":{al:"Jetstar",dc:"DPS",dCity:"Bali",dTerm:"I",dep:"10:15",ac:"ADL",aCity:"Adelaide",aTerm:"T1",arr:"17:45",plane:"Airbus A321",dur:"5h 0m"},"QF95":{al:"Qantas",dc:"MEL",dCity:"Melbourne",dTerm:"T1",dep:"07:30",ac:"DPS",aCity:"Bali",aTerm:"I",arr:"11:45",plane:"Boeing 737",dur:"6h 15m"},"VA43":{al:"Virgin Australia",dc:"MEL",dCity:"Melbourne",dTerm:"T3",dep:"08:30",ac:"DPS",aCity:"Bali",aTerm:"I",arr:"12:45",plane:"Boeing 737",dur:"6h 15m"},"VA44":{al:"Virgin Australia",dc:"DPS",dCity:"Bali",dTerm:"I",dep:"14:00",ac:"MEL",aCity:"Melbourne",aTerm:"T3",arr:"20:15",plane:"Boeing 737",dur:"6h 15m"},"VA45":{al:"Virgin Australia",dc:"BNE",dCity:"Brisbane",dTerm:"Int",dep:"09:00",ac:"DPS",aCity:"Bali",aTerm:"I",arr:"13:00",plane:"Boeing 737",dur:"6h 0m"},"VA46":{al:"Virgin Australia",dc:"DPS",dCity:"Bali",dTerm:"I",dep:"14:30",ac:"BNE",aCity:"Brisbane",aTerm:"Int",arr:"22:15",plane:"Boeing 737",dur:"5h 45m"},"VA47":{al:"Virgin Australia",dc:"SYD",dCity:"Sydney",dTerm:"T2",dep:"09:30",ac:"DPS",aCity:"Bali",aTerm:"I",arr:"13:45",plane:"Boeing 737",dur:"6h 15m"},"VA48":{al:"Virgin Australia",dc:"DPS",dCity:"Bali",dTerm:"I",dep:"15:00",ac:"SYD",aCity:"Sydney",aTerm:"T2",arr:"22:30",plane:"Boeing 737",dur:"6h 30m"},"GA715":{al:"Garuda Indonesia",dc:"SYD",dCity:"Sydney",dTerm:"T1",dep:"10:30",ac:"DPS",aCity:"Bali",aTerm:"I",arr:"14:40",plane:"Boeing 737",dur:"6h 10m"},"GA717":{al:"Garuda Indonesia",dc:"MEL",dCity:"Melbourne",dTerm:"T2",dep:"09:00",ac:"DPS",aCity:"Bali",aTerm:"I",arr:"13:10",plane:"Boeing 737",dur:"6h 10m"},"GA719":{al:"Garuda Indonesia",dc:"DPS",dCity:"Bali",dTerm:"I",dep:"15:30",ac:"MEL",aCity:"Melbourne",aTerm:"T2",arr:"22:40",plane:"Boeing 737",dur:"6h 10m"}};
var TC = {
  Flight:"text-blue-300 bg-blue-500/15 border-blue-500/30",
  Hotel:"text-purple-300 bg-purple-500/15 border-purple-500/30",
  Train:"text-green-300 bg-green-500/15 border-green-500/30",
  Taxi:"text-amber-300 bg-amber-500/15 border-amber-500/30",
  Bus:"text-lime-300 bg-lime-500/15 border-lime-500/30",
  Ferry:"text-cyan-300 bg-cyan-500/15 border-cyan-500/30",
  Food:"text-orange-300 bg-orange-500/15 border-orange-500/40",
  Drinks:"text-yellow-300 bg-yellow-500/15 border-yellow-500/30",
  Sightseeing:"text-teal-300 bg-teal-500/15 border-teal-500/30",
  Attractions:"text-indigo-300 bg-indigo-500/15 border-indigo-500/30",
  Activity:"text-pink-300 bg-pink-500/15 border-pink-500/30",
  Shopping:"text-rose-300 bg-rose-500/15 border-rose-500/30",
  Beach:"text-sky-300 bg-sky-500/15 border-sky-500/30",
  Medical:"text-red-300 bg-red-500/15 border-red-500/30",
  Other:"text-slate-300 bg-slate-500/15 border-slate-500/30"
};
var SC = {
 upcoming:{label:"Upcoming",color:"bg-orange-500/20 text-orange-300 border-orange-500/40"},
 planning:{label:"Planning",color:"bg-indigo-500/20 text-indigo-300 border-indigo-500/40"},
 completed:{label:"Completed",color:"bg-emerald-500/20 text-emerald-300 border-emerald-500/40"}
};
function CopyBtn(props) {
  var text = props.text;
  var copied = useState(false);
  var isCopied = copied[0];
  var setCopied = copied[1];
  function handleClick(e) {
    e.stopPropagation();
    try { navigator.clipboard.writeText(text); } catch(err) {}
    setCopied(true);
    setTimeout(function() { setCopied(false); }, 1400);
  }
  return (
 <button onClick={handleClick} className="ml-1 text-xs px-1.5 py-0.5 rounded bg-slate-700/60 hover:bg-slate-600 text-slate-500 hover:text-white shrink-0">
      {isCopied ? "Copied" : "Copy"}
    </button>
  );
}
var ADDRS="Sydney Kingsford Smith Airport, Terminal 1, Sydney NSW 2020|Sydney Airport Terminal 2 Domestic, NSW 2020|Melbourne Airport, Tullamarine VIC 3045|Brisbane Airport, Brisbane QLD 4008|Perth Airport, Perth WA 6105|Adelaide Airport, Adelaide SA 5950|Gold Coast Airport, Bilinga QLD 4225|Cairns Airport, Cairns QLD 4870|Dubai International Airport Terminal 1, Dubai, UAE|Dubai International Airport Terminal 3, Dubai, UAE|Abu Dhabi International Airport, Abu Dhabi, UAE|Doha Hamad International Airport, Qatar|Narita International Airport, Narita, Chiba, Japan|Haneda Airport, Ota City, Tokyo, Japan|Kansai International Airport, Osaka, Japan|Suvarnabhumi Airport, Bangkok, Thailand|Singapore Changi Airport, Singapore|Bali Ngurah Rai International Airport, Denpasar, Bali|Kuala Lumpur International Airport, Sepang, Malaysia|Incheon International Airport, Seoul, South Korea|Hong Kong International Airport, Lantau|Heathrow Airport, London TW6, UK|Charles de Gaulle Airport, Paris, France|New York JFK Airport, Queens, New York, USA|Los Angeles International Airport, Los Angeles, USA|Maldives Velana International Airport, Male, Maldives|Tokyo Station, Chiyoda City, Tokyo, Japan|Shinjuku Station, Shinjuku, Tokyo, Japan|Shinjuku Granbell Hotel, 2-14-5 Kabukicho, Shinjuku, Tokyo|Park Hyatt Tokyo, 3-7-1 Nishi-Shinjuku, Tokyo|The Ritz-Carlton Tokyo, 9-7-1 Akasaka, Minato, Tokyo|Andaz Tokyo, 1-23-4 Toranomon, Minato, Tokyo|Conrad Tokyo, 1-9-1 Higashi-Shinbashi, Minato, Tokyo|Senso-ji Temple, 2-3-1 Asakusa, Taito City, Tokyo|Shibuya Crossing, Shibuya City, Tokyo, Japan|Kyoto Station, Shimogyo Ward, Kyoto, Japan|Nishiki Market, Nakagyo, Kyoto, Japan|Gion, Higashiyama Ward, Kyoto, Japan|Fushimi Inari Shrine, Fushimi Ward, Kyoto, Japan|The Ritz-Carlton Kyoto, Kamogawa Nijo, Nakagyo, Kyoto|Four Seasons Hotel Kyoto, Sanjusangendo, Higashiyama, Kyoto|Dotonbori, Namba, Chuo Ward, Osaka, Japan|Capella Bangkok, 300-2 Charoenkrung Road, Bangrak, Bangkok|Mandarin Oriental Bangkok, 48 Oriental Avenue, Bang Rak, Bangkok|The Peninsula Bangkok, 333 Charoennakorn Road, Khlong San, Bangkok|COMO Metropolitan Bangkok, 27 South Sathorn Road, Bangkok|Four Seasons Hotel Bangkok, Charoen Krung Road, Bangkok|Khao San Road, Banglamphu, Phra Nakhon, Bangkok|Sukhumvit Road, Khlong Toei, Bangkok|Grand Palace, Phra Nakhon, Bangkok|Marina Bay Sands, 10 Bayfront Avenue, Singapore|Raffles Hotel Singapore, 1 Beach Road, Singapore|The Fullerton Hotel Singapore, 1 Fullerton Square, Singapore|Gardens by the Bay, 18 Marina Gardens Drive, Singapore|Atlantis The Palm, Crescent Road, Palm Jumeirah, Dubai, UAE|Atlantis The Royal, Palm Jumeirah, Dubai, UAE|Burj Al Arab, Jumeirah Beach Road, Umm Suqeim, Dubai, UAE|Burj Khalifa, 1 Sheikh Mohammed bin Rashid Blvd, Downtown Dubai|Dubai Mall, Financial Centre Road, Downtown Dubai, UAE|Palm Jumeirah, Dubai, UAE|Jumeirah Beach Hotel, Jumeirah Beach Road, Dubai, UAE|Four Seasons Resort Dubai at Jumeirah Beach, Jumeirah, Dubai|Waldorf Astoria Dubai Palm Jumeirah, Palm Jumeirah, Dubai, UAE|One and Only Royal Mirage, Al Sufouh Road, Dubai, UAE|Sofitel Dubai The Palm, East Crescent, Palm Jumeirah, Dubai, UAE|W Dubai The Palm, West Crescent, Palm Jumeirah, Dubai, UAE|The Ritz-Carlton Dubai, JBR Walk, Jumeirah Beach Residence, Dubai|FIVE Palm Jumeirah, Palm Jumeirah, Dubai, UAE|Anantara The Palm Dubai Resort, Palm Jumeirah, Dubai, UAE|Caesars Palace Dubai, West Crescent, Palm Jumeirah, Dubai, UAE|Madinat Jumeirah, Al Sufouh Road, Umm Suqeim, Dubai, UAE|Emirates Palace, Corniche Road West, Abu Dhabi, UAE|The Savoy, Strand, London WC2R, UK|Claridges, Brook Street, Mayfair, London W1K, UK|The Ritz London, 150 Piccadilly, London W1J, UK|The Dorchester, Park Lane, London W1K, UK|Hotel Ritz Paris, 15 Place Vendome, Paris, France|Four Seasons Hotel George V, 31 Avenue George V, Paris, France|Eiffel Tower, Champ de Mars, Paris, France|Louvre Museum, Rue de Rivoli, Paris, France|Hotel Hassler Roma, Piazza Trinita dei Monti, Rome, Italy|Colosseum, Piazza del Colosseo, Rome, Italy|Hotel Arts Barcelona, 19-21 Carrer de la Marina, Barcelona|La Sagrada Familia, Carrer de Mallorca, Barcelona, Spain|JK Place Capri, Via Provinciale Marina Grande, Capri, Italy|Santorini, Cyclades, Greece|Mykonos, Cyclades, Greece|Four Seasons Resort Bali at Sayan, Sayan, Ubud, Bali|COMO Uma Ubud, Jalan Raya Sanggingan, Ubud, Bali|Alila Villas Uluwatu, Jalan Belimbing Sari, Uluwatu, Bali|Seminyak Beach, Seminyak, Kuta, Badung Regency, Bali|Kuta Beach, Kuta, Badung Regency, Bali, Indonesia|Tanah Lot Temple, Beraban, Tabanan Regency, Bali|Ubud, Gianyar Regency, Bali, Indonesia|Nusa Penida, Klungkung Regency, Bali, Indonesia|Velaa Private Island, Noonu Atoll, Maldives|Soneva Jani, Noonu Atoll, Maldives|Conrad Maldives Rangali Island, South Ari Atoll, Maldives|Park Hyatt Maldives Hadahaa, Gaafu Alifu Atoll, Maldives|Anantara Kihavah Maldives Villas, Baa Atoll, Maldives|Gili Lankanfushi, North Male Atoll, Maldives|The Plaza Hotel, Fifth Avenue, New York, NY, USA|The Beverly Hills Hotel, 9641 Sunset Blvd, Beverly Hills, CA, USA|Hotel de Russie, Via del Babuino 9, Rome, Italy|Rome Cavalieri Waldorf Astoria, Via Alberto Cadlolo 101, Rome, Italy|The St Regis Rome, Via Vittorio Emanuele Orlando 3, Rome, Italy|Hotel Eden Rome, Via Ludovisi 49, Rome, Italy|Hotel Cipriani, Giudecca 10, Venice, Italy|Aman Venice, Calle Tiepolo, San Polo, Venice, Italy|The Gritti Palace, Campo Santa Maria del Giglio, Venice, Italy|Belmond Hotel Splendido, Viale Baratta 16, Portofino, Italy|Grand Hotel Tremezzo, Via Regina 8, Lake Como, Italy|Villa d Este, Via Regina 40, Cernobbio, Lake Como, Italy|Four Seasons Hotel Firenze, Borgo Pinti 99, Florence, Italy|Il San Pietro di Positano, Via Laurito 2, Positano, Italy|Le Sirenuse, Via Cristoforo Colombo 30, Positano, Italy|Palazzo Avino, Via San Giovanni del Toro 28, Ravello, Amalfi Coast, Italy|Capri Palace Jumeirah, Via Capodimonte 14, Capri, Italy|Mandarin Oriental Barcelona, Passeig de Gracia 38, Barcelona, Spain|Cotton House Hotel, Gran Via de les Corts Catalanes 670, Barcelona, Spain|Four Seasons Hotel Madrid, Calle de Sevilla 3, Madrid, Spain|Hotel Villa Magna, Paseo de la Castellana 22, Madrid, Spain|La Alhambra, Calle Real de la Alhambra, Granada, Spain|Marbella Club Hotel, Boulevard Principe Alfonso von Hohenlohe, Marbella, Spain|Mandarin Oriental Paris, 251 Rue Saint-Honore, Paris, France|Hotel Lutetia, 45 Boulevard Raspail, Paris, France|Shangri-La Hotel Paris, 10 Avenue d Iena, Paris, France|Cheval Blanc Paris, 8 Quai du Louvre, Paris, France|Hotel de Crillon, 10 Place de la Concorde, Paris, France|Hotel du Cap-Eden-Roc, Boulevard Kennedy, Antibes, France|Hotel Martinez, 73 Boulevard de la Croisette, Cannes, France|45 Park Lane, 45 Park Lane, London W1K, UK|Mandarin Oriental Hyde Park, 66 Knightsbridge, London SW1X, UK|Four Seasons London at Park Lane, Hamilton Place, London W1J, UK|The Berkeley, Wilton Place, Knightsbridge, London SW1X, UK|Bvlgari Hotel London, 171 Knightsbridge, London SW7, UK|Gleneagles Hotel, Auchterarder, Perthshire, Scotland, UK|Katikies Hotel, Oia, Santorini, Greece|Canaves Oia Suites, Oia, Santorini, Greece|Mystique Hotel Santorini, Oia, Santorini, Greece|Grace Hotel Santorini, Imerovigli, Santorini, Greece|Belvedere Hotel Mykonos, School of Fine Arts, Mykonos, Greece|Santa Marina Mykonos, Ornos Bay, Mykonos, Greece|Hotel Grande Bretagne, Syntagma Square, Athens, Greece|Amanzoe, Porto Heli, Argolida, Greece|Bairro Alto Hotel, Praca Luis de Camoes 2, Lisbon, Portugal|Four Seasons Hotel Ritz Lisbon, Rua Rodrigo da Fonseca 88, Lisbon, Portugal|Hotel Adlon Kempinski, Unter den Linden 77, Berlin, Germany|Hotel Sacher Wien, Philharmoniker Strasse 4, Vienna, Austria|The Chedi Andermatt, Gotthardstrasse 4, Andermatt, Switzerland|Badrutt Palace Hotel, Via Serlas 27, St Moritz, Switzerland|Conservatorium Hotel Amsterdam, Van Baerlestraat 27, Amsterdam, Netherlands|Capella Ubud, Desa Keliki, Tegallalang, Ubud, Bali, Indonesia|Alila Ubud, Desa Melinggih Kelod, Payangan, Ubud, Bali, Indonesia|Komaneka at Bisma, Jalan Bisma, Ubud, Bali, Indonesia|Mandapa Ritz-Carlton Reserve, Jalan Kedewatan, Ubud, Bali, Indonesia|Viceroy Bali, Jalan Lanyahan, Ubud, Bali, Indonesia|Bulgari Resort Bali, Jalan Goa Lempeh, Uluwatu, Bali, Indonesia|Banyan Tree Ungasan, Jalan Melasti, Ungasan, Bali, Indonesia|The Mulia Bali, Jalan Raya Nusa Dua Selatan, Nusa Dua, Bali|St Regis Bali Resort, Kawasan Pariwisata, Nusa Dua, Bali, Indonesia|COMO Shambhala Estate, Banjar Begawan, Payangan, Ubud, Bali|Ayana Resort and Spa Bali, Jalan Karang Mas Sejahtera, Jimbaran, Bali|Locavore, Jalan Dewi Sita, Ubud, Bali, Indonesia|Mozaic Restaurant, Jalan Raya Sanggingan, Ubud, Bali, Indonesia|Tegallalang Rice Terraces, Tegallalang, Ubud, Bali, Indonesia|Mount Batur, Kintamani, Bangli Regency, Bali, Indonesia|Uluwatu Temple, Pecatu, Kuta Selatan, Bali, Indonesia|Park Hyatt Saigon, 2 Lam Son Square, Ho Chi Minh City, Vietnam|Capella Hanoi, 11 Le Phung Hieu, Hoan Kiem, Hanoi, Vietnam|Sofitel Legend Metropole Hanoi, 15 Ngo Quyen, Hoan Kiem, Hanoi, Vietnam|JW Marriott Hotel Hanoi, 8 Do Duc Duc, Me Tri, Hanoi, Vietnam|Four Seasons Hotel Hanoi, 4 Ngo Quyen, Hoan Kiem, Hanoi, Vietnam|Four Seasons Resort The Nam Hai Hoi An, Dien Ban, Quang Nam, Vietnam|Anantara Hoi An Resort, 1 Pham Hong Thai, Hoi An, Quang Nam, Vietnam|Rosewood Phu Quoc, Ong Lang Beach, Phu Quoc, Kien Giang, Vietnam|JW Marriott Phu Quoc Emerald Bay, Khem Beach, Phu Quoc, Vietnam|InterContinental Phu Quoc Long Beach Resort, Bai Truong, Phu Quoc, Vietnam|Six Senses Con Dao, Dat Doc Beach, Con Dao, Vietnam|Amanoi, Vinh Hy Bay, Ninh Hai, Ninh Thuan, Vietnam|Noi Bai International Airport, Soc Son, Hanoi, Vietnam|Tan Son Nhat International Airport, Tan Binh, Ho Chi Minh City, Vietnam|Da Nang International Airport, Hai Chau, Da Nang, Vietnam|Phu Quoc International Airport, Phu Quoc, Kien Giang, Vietnam|Hoan Kiem Lake, Hoan Kiem, Hanoi, Vietnam|Old Quarter Hanoi, Hoan Kiem, Hanoi, Vietnam|Hoi An Ancient Town, Hoi An, Quang Nam, Vietnam|Ha Long Bay, Quang Ninh, Vietnam".split("|");
function AddrField(props) {
  var value = props.value;
  var onChange = props.onChange;
  var hitsState = useState([]);
  var hits = hitsState[0];
  var setHits = hitsState[1];
  var openState = useState(false);
  var open = openState[0];
  var setOpen = openState[1];
  function handleType(v) {
    onChange(v);
    if (v.length > 1) {
      var q = v.toLowerCase().trim();
      var words = q.split(/\s+/);
      var matches = [];
      for (var i = 0; i < ADDRS.length; i++) {
        var addr = ADDRS[i].toLowerCase();
        var hit = false;
        for (var w = 0; w < words.length; w++) {
 if (words[w].length > 1 && addr.indexOf(words[w]) !== -1) { hit = true; break; }
        }
        if (hit) {
          matches.push(ADDRS[i]);
          if (matches.length >= 8) break;
        }
      }
      setHits(matches);
      setOpen(matches.length > 0);
    } else {
      setOpen(false);
    }
  }
  function pick(s) { onChange(s); setOpen(false); }
  function handleBlur() { setTimeout(function() { setOpen(false); }, 180); }
 function handleFocus() { if (value.length > 1 && hits.length > 0) setOpen(true); }
  return (
    <div className="relative">
 <input type="text" value={value} onChange={function(e) { handleType(e.target.value); }}
        onBlur={handleBlur} onFocus={handleFocus}
        placeholder="Start typing — suggestions appear"
        className={CN14} />
      {open && hits.length > 0 && (
 <div className="absolute left-0 right-0 top-full mt-1 bg-slate-800 border border-slate-600 rounded-xl overflow-hidden z-50 shadow-2xl">
          {hits.map(function(s, i) {
            return (
              <button key={i} type="button" onClick={function() { pick(s); }}
 className="w-full text-left px-4 py-2.5 text-slate-300 text-xs font-sans hover:bg-slate-700 border-b border-slate-700/40 last:border-0 flex items-start gap-2">
                <span className="shrink-0 text-slate-500 mt-0.5">📍</span>
                <span>{s}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
function BottomNav(props) {
  var active = props.active;
  var go = props.go;
  var items = [
    {label:"Trips", s:"dashboard", icon:"🗺️"},
    {label:"Timeline", s:"timeline", icon:"📅"},
    {label:"Add", s:"addEvent", icon:"+", primary:true},
    {label:"Wishlist", s:"wishlist", icon:"✨"},
    {label:"Glance", s:"glance", icon:"📋"},
    {label:"Settings", s:"settings", icon:"⚙️"}
  ];
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgb(2,6,23)",borderTop:"1px solid rgba(30,41,59,0.8)",display:"flex",alignItems:"center",justifyContent:"space-around",padding:"4px 0 8px",zIndex:100}}>
      {items.map(function(it) {
        var isActive = active === it.s;
        if (it.primary) return (
          <button key={it.s} onClick={(function(s){return function(){go(s);};})(it.s)}
            style={{width:"48px",height:"48px",borderRadius:"50%",background:"rgb(249,115,22)",border:"none",color:"white",fontSize:"24px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"8px",boxShadow:"0 4px 12px rgba(249,115,22,0.5)",fontWeight:"bold"}}>
            +
          </button>
        );
        return (
          <button key={it.s} onClick={(function(s){return function(){go(s);};})(it.s)}
            style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"2px",background:"none",border:"none",cursor:"pointer",padding:"4px 6px"}}>
            <span style={{fontSize:"18px"}}>{it.icon}</span>
            <span style={{fontSize:"9px",fontFamily:"sans-serif",color:isActive?"rgb(249,115,22)":"rgb(100,116,139)"}}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}
function PhotoEntry(props) {
  var tripId = props.tripId;
  var currentPhoto = props.currentPhoto;
  var setTrips = props.setTrips;
  function handleFile(e) {
    var f = e.target.files && e.target.files[0];
    if (!f) return;
    var reader = new FileReader();
    reader.onload = function(evt) {
      var dataUrl = evt.target.result;
      setTrips(function(prev) {
        return prev.map(function(t) {
          if (t.id !== tripId) return t;
          return { id:t.id, name:t.name, dests:t.dests, start:t.start, end:t.end, days:t.days, tripDays:t.tripDays, budget:t.budget, spent:t.spent, status:t.status, accent:t.accent, flags:t.flags, grad:t.grad, photo:dataUrl };
        });
      });
    };
    reader.readAsDataURL(f);
  }
  return (
    <label style={{cursor:"pointer",display:"inline-block"}}>
      <span style={{background:"rgba(0,0,0,0.7)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:"9999px",padding:"6px 12px",color:"white",fontSize:"12px",fontFamily:"sans-serif",display:"inline-block"}}>
        📷 {currentPhoto ? "Change Photo" : "Add Photo"}
      </span>
      <input type="file" accept="image/*" onChange={handleFile} style={{display:"none"}} />
    </label>
  );
}
function DocEntry(props) {
  var docs = props.docs;
  var setDocs = props.setDocs;
  function handleFiles(e) {
    if (!e.target.files) return;
    var names = [];
    for (var i = 0; i < e.target.files.length; i++) {
      names.push(e.target.files[i].name);
    }
    if (names.length > 0) setDocs(docs.concat(names));
  }
  function removeDoc(idx) {
    setDocs(docs.filter(function(_, j) { return j !== idx; }));
  }
  return (
    <div className="space-y-2">
      <label className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-slate-600/60 text-slate-400 text-sm font-sans cursor-pointer">
        📎 Attach Document
        <input type="file" multiple onChange={handleFiles} style={{display:"none"}} />
      </label>
      {docs.length > 0 && (
        <div className="space-y-1.5">
          {docs.map(function(d, i) {
            var idx = i;
            var docName = typeof d === "string" ? d : d.name;
            return (
              <div key={idx} className="flex items-center justify-between bg-slate-800/60 border border-slate-700/40 rounded-xl px-3 py-2">
                <div className={CN7}><span>📄</span><span className={CN20}>{docName}</span></div>
                <button onClick={function() { removeDoc(idx); }} className="text-slate-500 hover:text-red-400 text-xs font-sans">Remove</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SmartDatePicker(props) {
  var value = props.value;   // "YYYY-MM-DD" internally
  var onChange = props.onChange;
  var placeholder = props.placeholder || "Select date";
  var className = props.className || "";
  function displayVal() {
    if (!value) return placeholder;
    var parts = value.split("-");
    if (parts.length !== 3) return placeholder;
 var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var m = parseInt(parts[1], 10) - 1;
    return parts[2] + " " + (months[m] || parts[1]) + " " + parts[0];
  }
  return (
    <div style={{position:"relative", display:"block"}}>
      <div style={{
        background:"rgba(30,41,59,0.8)",
        border:"1px solid rgba(71,85,105,0.6)",
        borderRadius:"12px",
        padding:"12px 16px",
        color: value ? "white" : "rgba(100,116,139,1)",
        fontFamily:"sans-serif",
        fontSize:"14px",
        pointerEvents:"none",
        userSelect:"none"
      }}>
        {displayVal()}
      </div>
      <input
        type="date"
        value={value}
        onChange={function(e) { onChange(e.target.value); }}
        style={{
          position:"absolute",
          top:0, left:0,
          width:"100%",
          height:"100%",
          opacity:0.01,
          cursor:"pointer",
          zIndex:2
        }}
      />
    </div>
  );
}
function AddEditScreen(props) {
  var go = props.go;
  var tripName = props.tripName;
  var dayIndex = props.dayIndex;
  var days = props.days;
  var onSave = props.onSave;
  var ev = props.editEv;
  var isEdit = ev !== null && ev !== undefined;
  var initCur = CURS[0];
  if (isEdit) {
    for (var ci = 0; ci < CURS.length; ci++) {
      if (CURS[ci].code === ev.cur) { initCur = CURS[ci]; break; }
    }
  }
  var stSelType = useState(isEdit ? ev.type : null);
  var selType = stSelType[0]; var setSelType = stSelType[1];
  var stShowTypes = useState(false);
  var showTypes = stShowTypes[0]; var setShowTypes = stShowTypes[1];
  var stShowCur = useState(false);
  var showCur = stShowCur[0]; var setShowCur = stShowCur[1];
  var stFlight = useState(isEdit && ev.type === "Flight" ? (ev.ref || "") : "");
  var flightNum = stFlight[0]; var setFlightNum = stFlight[1];
  var stLk = useState("idle");
  var lkState = stLk[0]; var setLkState = stLk[1];
  var stLkRes = useState(null);
  var lkRes = stLkRes[0]; var setLkRes = stLkRes[1];
  var selDay = props.selDay !== undefined ? props.selDay : dayIndex;
  var setSelDay = props.setSelDay;
  var selDayRef = useRef(selDay);
  selDayRef.current = selDay;
  var stSaved = useState(false);
  var saved = stSaved[0]; var setSaved = stSaved[1];
  var stDate = useState(isEdit ? (ev.date || "") : "");
  var stDep = useState(isEdit ? (ev.dep || "") : "");
  var stArr    = useState(isEdit ? (ev.arr    || "") : "");
  var stArrDate= useState(isEdit ? (ev.arrDate|| "") : "");
  var stDur = useState(isEdit ? (ev.dur || "") : "");
  var stTitle = useState(isEdit ? (ev.title || "") : "");
  var stAddr = useState(isEdit ? (ev.addr || "") : "");
  var stCName = useState(isEdit && ev.contact ? (ev.contact.name || "") : "");
  var stCPhone = useState(isEdit && ev.contact ? (ev.contact.phone || "") : "");
  var stWA = useState(isEdit && ev.contact ? (ev.contact.wa || false) : false);
  var stRef = useState(isEdit ? (ev.ref || "") : "");
  var stCost = useState(isEdit ? String(ev.cost || "") : "");
  var stCur = useState(initCur);
  var stPlane = useState(isEdit ? (ev.aircraft || "") : "");
  var stNote = useState(isEdit ? (ev.note || "") : "");
  var stDocs = useState(isEdit ? (ev.docs || []) : []);
  var date = stDate[0]; var setDate = stDate[1];
  var dep = stDep[0]; var setDep = stDep[1];
  var arr     = stArr[0];     var setArr     = stArr[1];
  var arrDate = stArrDate[0]; var setArrDate = stArrDate[1];
  var dur = stDur[0]; var setDur = stDur[1];
  var title = stTitle[0]; var setTitle = stTitle[1];
  var addr = stAddr[0]; var setAddr = stAddr[1];
  var cName = stCName[0]; var setCName = stCName[1];
  var cPhone = stCPhone[0]; var setCPhone = stCPhone[1];
  var wa = stWA[0]; var setWA = stWA[1];
  var bookRef = stRef[0]; var setRef = stRef[1];
  var cost = stCost[0]; var setCost = stCost[1];
  var cur = stCur[0]; var setCur = stCur[1];
  var plane = stPlane[0]; var setPlane = stPlane[1];
  var note = stNote[0]; var setNote = stNote[1];
  var docs = stDocs[0]; var setDocs = stDocs[1];
  var isFlight = selType === "Flight";
  var isHotel  = selType === "Hotel";
  var isTrain  = selType === "Train";
 var hasTimes    = selType === "Flight" || selType === "Train" || selType === "Ferry" || selType === "Bus" || selType === "Taxi" || selType === "Car Rental";
 var hasArrDate  = selType === "Ferry" || selType === "Car Rental" || selType === "Train" || selType === "Bus";
  var typeObj = null;
  for (var ti = 0; ti < ETYPES.length; ti++) {
    if (ETYPES[ti].t === selType) { typeObj = ETYPES[ti]; break; }
  }
  function doLookup() {
    var raw = flightNum.trim().toUpperCase();
    var key = raw.split(" ").join("").split("\t").join("");
    if (!key) return;
    setLkState("loading");
    setTimeout(function() {
      var r = FLIGHTS[key];
      if (r) {
        setLkRes(r);
        setLkState("found");
      } else {
        var found = null;
        var fkeys = Object.keys(FLIGHTS);
        for (var ki = 0; ki < fkeys.length; ki++) {
          var fk = fkeys[ki];
          if (fk.indexOf(key) !== -1 || key.indexOf(fk) !== -1) {
            found = FLIGHTS[fk];
            break;
          }
        }
        if (found) { setLkRes(found); setLkState("found"); }
        else setLkState("notfound");
      }
    }, 500);
  }
  function applyLookup() {
    if (!lkRes) return;
    setDep(lkRes.dep);
    setArr(lkRes.arr);
    setDur(lkRes.dur);
    setPlane(lkRes.plane);
    setTitle(lkRes.dc + " to " + lkRes.aCity);
    setAddr(lkRes.dCity + " Airport, Terminal " + lkRes.dTerm);
    setRef(flightNum.trim().toUpperCase());
    setLkState("applied");
  }
  function doSave() {
    if (!selType || !title) return;
    var event = {
      id: isEdit ? ev.id : Date.now(),
      date: date,
      dep: dep || "TBD",
      arr: arr || "",
      arrDate: arrDate || "",
      dur: dur || "",
      icon: typeObj ? typeObj.i : "📌",
      type: selType,
      title: title,
      addr: addr || "",
 contact: cPhone ? { name: cName || "Contact", phone: cPhone, wa: wa } : null,
      ref: bookRef || null,
      cost: parseFloat(cost) || 0,
      cur: cur.code,
      aircraft: plane || null,
      note: note || "",
      docs: docs
    };
    onSave(selDayRef.current, event, isEdit);
    setSaved(true);
    setTimeout(function() { setSaved(false); go("timeline", selDayRef.current); }, 1100);
  }
  var inp = CN14;
  var lbl = CN15;
  var saveDisabled = !selType || !title;
  var saveCls = saved
 ? "flex-[2] py-3.5 rounded-2xl font-semibold font-sans flex items-center justify-center bg-emerald-500 text-white"
    : saveDisabled
 ? "flex-[2] py-3.5 rounded-2xl font-semibold font-sans flex items-center justify-center bg-slate-700 text-slate-500 cursor-not-allowed"
 : "flex-[2] py-3.5 rounded-2xl font-semibold font-sans flex items-center justify-center bg-orange-500 hover:bg-orange-400 text-white";
  return (
    <div className={CN3} style={{fontFamily:"Georgia,serif"}}>
 <div className="bg-gradient-to-b from-slate-900 to-slate-950 pt-12 px-5 pb-4 border-b border-slate-800/60">
        <div className={CN8}>
 <button onClick={function() { go("timeline"); }} className="shrink-0 bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-sm px-3 py-1.5 rounded-xl font-sans">Back</button>
          <div className="flex-1 min-w-0">
            <div className={CN12}>{tripName}</div>
            <h1 className={CN13}>{isEdit ? "Edit Event" : "Add Event"}</h1>
          </div>
          {selType && typeObj && (
 <span className={"text-xs font-semibold px-2.5 py-1 rounded-full border font-sans shrink-0 " + (TC[selType] || "")}>
              {typeObj.i} {selType}
            </span>
          )}
        </div>
        {isEdit && (
 <div className="mt-2 bg-orange-500/10 border border-orange-500/20 rounded-xl px-3 py-2">
 <p className="text-orange-300 text-xs font-sans">Editing <strong>{ev.title}</strong> — only change what you need</p>
          </div>
        )}
      </div>
      <div className="px-4 pb-6 pt-4 space-y-4">
        <div className={CN2}>
          <div className={lbl}>Add to Day</div>
          <div className="flex gap-2 flex-wrap">
            {days.map(function(d, i) {
              var isSelected = selDay === i;
              var di = i;
              return (
                <button key={di} type="button"
                  onClick={function() { setSelDay(di); if (days[di] && days[di].date) setDate(days[di].date); }}
                  style={{
                    padding:"8px 12px", borderRadius:"12px", fontSize:"12px",
 fontFamily:"sans-serif", fontWeight:"600", border:"2px solid",
                    cursor:"pointer",
 background: isSelected ? "rgb(249,115,22)" : "rgba(30,41,59,0.8)",
                    color: isSelected ? "white" : "rgb(148,163,184)",
 borderColor: isSelected ? "rgb(234,88,12)" : "rgba(71,85,105,0.5)"
                  }}>
                  <div>{d.label}</div>
 <div style={{opacity:0.7,fontWeight:"normal",fontSize:"11px"}}>{fmtShort(d.date)}</div>
                </button>
              );
            })}
          </div>
 {days[selDay] && <p style={{marginTop:"8px",fontSize:"12px",fontFamily:"sans-serif",color:"rgb(249,115,22)"}}>Adding to: {days[selDay].label} — {fmtFull(days[selDay].date)}</p>}
        </div>
 <div className="bg-slate-900/60 rounded-2xl border border-slate-800/60 overflow-hidden">
 <button onClick={function() { setShowTypes(!showTypes); }} className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-slate-800/30">
            <div className={CN8}>
              <span className={CN16}>🎯</span>
              <span className={CN4}>Event Type</span>
 {!selType && <span className="text-orange-400 text-xs font-sans ml-1">required</span>}
            </div>
            <div className={CN7}>
              {selType && typeObj && <span>{typeObj.i}</span>}
              <span className={CN6}>{showTypes ? "Hide" : "Select"}</span>
            </div>
          </button>
          {showTypes && (
            <div className="border-t border-slate-800 p-3">
              <div className="grid grid-cols-4 gap-2">
                {ETYPES.map(function(et) {
                  var cls = selType === et.t
 ? "flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-sans font-semibold " + (TC[et.t] || "border-orange-500 bg-orange-500/15 text-orange-300")
 : "flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-sans font-semibold border-slate-700/50 bg-slate-800/40 text-slate-400 hover:border-slate-600 hover:text-white";
                  return (
 <button key={et.t} onClick={function() { setSelType(et.t); setShowTypes(false); }} className={cls}>
                      <span className="text-xl">{et.i}</span>
                      <span>{et.t}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {selType && !showTypes && (
            <div className="border-t border-slate-800/40 px-4 py-2">
 <button onClick={function() { setShowTypes(true); }} className="text-xs text-orange-400 font-sans">Change type</button>
            </div>
          )}
        </div>
        {isFlight && (
 <div className="rounded-2xl border border-blue-500/25 bg-blue-500/5 overflow-hidden">
            <div className={CN26}>
              <span>🔍</span>
 <span className="text-blue-300 font-semibold font-sans text-sm">Flight Lookup</span>
 <span className="text-blue-400/60 text-xs font-sans ml-auto">Auto-fills times and aircraft</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-2">
                <input type="text" placeholder="e.g. QF7821" value={flightNum}
 onChange={function(e) { setFlightNum(e.target.value.toUpperCase()); setLkState("idle"); setLkRes(null); }}
                  className={inp + " flex-1 font-mono tracking-widest"} />
 <button onClick={doLookup} disabled={!flightNum.trim() || lkState === "loading"}
 className={"px-4 py-3 rounded-xl text-sm font-bold font-sans " + (lkState === "loading" ? "bg-slate-700 text-slate-400" : "bg-blue-500 hover:bg-blue-400 text-white")}>
                  {lkState === "loading" ? "..." : "Look Up"}
                </button>
              </div>
              <div className="flex gap-1.5 flex-wrap items-center">
                <span className="text-slate-600 text-xs font-sans">Try:</span>
 {["QF7821","EK304","EY454","QR900","JQ15","UA838","DL41","AA292"].map(function(fn) {
                  var fkey = fn;
                  return (
 <button key={fkey} onClick={function() { setFlightNum(fkey); setLkState("idle"); setLkRes(null); }}
 className="text-xs text-blue-400/80 font-mono hover:text-blue-300 border border-blue-500/25 px-2 py-0.5 rounded-lg">
                      {fkey}
                    </button>
                  );
                })}
              </div>
              {lkState === "notfound" && (
 <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm font-sans">Flight not found — fill in details manually below</div>
              )}
              {lkState === "found" && lkRes && (
 <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 space-y-3">
                  <div className={CN9}>
                    <div>
                      <p className={CN25}>{flightNum} — {lkRes.al}</p>
 <p className="text-blue-300 text-xs font-sans">{lkRes.plane}</p>
                    </div>
 <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-sans">Found</span>
                  </div>
 <div className="bg-slate-800/60 rounded-xl p-3 flex items-center">
                    <div className="flex-1 text-center">
 <p className="text-white font-bold font-mono text-2xl">{lkRes.dc}</p>
 <p className="text-blue-300 font-mono font-bold text-lg">{lkRes.dep}</p>
                      <p className={CN5}>{lkRes.dCity}</p>
                    </div>
                    <div className="flex-shrink-0 text-center px-3">
                      <p className="text-2xl">✈️</p>
 <p className="text-blue-400 text-xs font-sans font-semibold">{lkRes.dur}</p>
                    </div>
                    <div className="flex-1 text-center">
 <p className="text-white font-bold font-mono text-2xl">{lkRes.ac}</p>
 <p className="text-blue-300 font-mono font-bold text-lg">{lkRes.arr}</p>
                      <p className={CN5}>{lkRes.aCity}</p>
                    </div>
                  </div>
 <button onClick={applyLookup} className="w-full py-3 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white font-bold font-sans">Apply to Event</button>
                </div>
              )}
              {lkState === "applied" && (
 <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 text-emerald-300 text-sm font-sans font-semibold">Applied — review fields below</div>
              )}
            </div>
          </div>
        )}
        <div className={CN1}>
 <div className={CN7}><span className={CN16}>🕐</span><span className={CN4}>Date and Time</span></div>
          {isHotel ? (
            <div className="space-y-3">
              <div className="flex gap-3">
 <div className="flex-[2]"><label className={lbl}>Check-in Date</label><input type="date" value={date} onChange={function(e) { setDate(e.target.value); }} style={{width:"100%",background:"rgba(30,41,59,0.8)",border:"1px solid rgba(71,85,105,0.6)",borderRadius:"12px",padding:"12px 16px",color:"white",fontSize:"14px",fontFamily:"sans-serif",outline:"none",colorScheme:"dark"}} />
{date && <div style={{fontSize:"12px",color:"rgb(251,146,60)",fontFamily:"sans-serif",marginTop:"4px"}}>{fmtShort(date)}</div>}</div>
 <div className="flex-1"><label className={lbl}>Check-in Time</label><input type="time" value={dep} onChange={function(e) { setDep(e.target.value); }} className={inp} /></div>
              </div>
              <div className="flex gap-3">
 <div className="flex-[2]"><label className={lbl}>Check-out Date</label><input type="date" value={arr} onChange={function(e) { setArr(e.target.value); }} style={{width:"100%",background:"rgba(30,41,59,0.8)",border:"1px solid rgba(71,85,105,0.6)",borderRadius:"12px",padding:"12px 16px",color:"white",fontSize:"14px",fontFamily:"sans-serif",outline:"none",colorScheme:"dark"}} /></div>
 <div className="flex-1"><label className={lbl}>Check-out Time</label><input type="time" value={dur} onChange={function(e) { setDur(e.target.value); }} className={inp} /></div>
              </div>
              {date && arr && (function() {
                var d1 = new Date(date + "T12:00:00");
                var d2 = new Date(arr + "T12:00:00");
                var nights = Math.round((d2 - d1) / 86400000);
                return nights > 0 ? (
 <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl px-3 py-2 flex items-center gap-2">
                    <span className="text-purple-400">🌙</span>
 <span className="text-purple-300 text-sm font-sans font-semibold">{nights} night{nights !== 1 ? "s" : ""}</span>
 <span className="text-slate-400 text-xs font-sans ml-1">{fmtShort(date)} — {fmtShort(arr)}</span>
                  </div>
                ) : null;
              })()}
 {date && <div className={CN17}><span className={CN16}>📅</span><span className={CN18}>Check-in: {fmtFull(date)}{dep ? " at " + dep : ""}{arr ? " — Check-out: " + fmtFull(arr) : ""}{dur ? " at " + dur : ""}</span></div>}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-3">
 <div className="flex-[2]"><label className={lbl}>{selType === "Car Rental" ? "Pick-up Date" : hasArrDate ? "Departure Date" : "Date"}</label><input type="date" value={date} onChange={function(e) { var v=e.target.value; setDate(v); if (hasTimes && dep && arr) setDur(calcDuration(v, dep, arrDate||v, arr)); }} style={{width:"100%",background:"rgba(30,41,59,0.8)",border:"1px solid rgba(71,85,105,0.6)",borderRadius:"12px",padding:"12px 16px",color:"white",fontSize:"14px",fontFamily:"sans-serif",outline:"none",colorScheme:"dark"}} />
{date && <div style={{fontSize:"12px",color:"rgb(251,146,60)",fontFamily:"sans-serif",marginTop:"4px"}}>{fmtShort(date)}</div>}</div>
 <div className="flex-1"><label className={lbl}>{selType === "Car Rental" ? "Pick-up Time" : hasTimes ? "Departs" : "Time"}</label><input type="time" value={dep} onChange={function(e) { var v = e.target.value; setDep(v); if (hasTimes && arr) setDur(calcDuration(date, v, arrDate||date, arr)); }} className={inp} /></div>
              </div>
              {hasArrDate && (
                <div className="flex gap-3">
 <div className="flex-[2]"><label className={lbl}>{selType === "Car Rental" ? "Return Date" : "Arrival Date"}</label><input type="date" value={arrDate} onChange={function(e) { var v=e.target.value; setArrDate(v); if (hasTimes && dep && arr) setDur(calcDuration(date, dep, v, arr)); }} style={{width:"100%",background:"rgba(30,41,59,0.8)",border:"1px solid rgba(71,85,105,0.6)",borderRadius:"12px",padding:"12px 16px",color:"white",fontSize:"14px",fontFamily:"sans-serif",outline:"none",colorScheme:"dark"}} /></div>
 <div className="flex-1"><label className={lbl}>{selType === "Car Rental" ? "Return Time" : "Arrives"}</label><input type="time" value={arr} onChange={function(e) { var v = e.target.value; setArr(v); if (hasTimes && dep) setDur(calcDuration(date, dep, arrDate||date, v)); }} className={inp} /></div>
                </div>
              )}
              {!hasArrDate && hasTimes && (
                <div className="flex gap-3">
 <div className="flex-1"><label className={lbl}>Arrives</label><input type="time" value={arr} onChange={function(e) { var v = e.target.value; setArr(v); if (hasTimes && dep) setDur(calcDuration(date, dep, arrDate||date, v)); }} className={inp} /></div>
 <div className="flex-1"><label className={lbl}>Duration {dep && arr ? <span className="text-emerald-400 text-xs normal-case">auto</span> : ""}</label><input type="text" placeholder="e.g. 11h 45m" value={dur} onChange={function(e) { setDur(e.target.value); }} className={inp} /></div>
                </div>
              )}
              {hasArrDate && (
                <div>
 <label className={lbl}>Duration {dep && arr && date ? <span className="text-emerald-400 text-xs normal-case">auto</span> : ""}</label>
 <input type="text" placeholder="e.g. 3d 4h 30m" value={dur} onChange={function(e) { setDur(e.target.value); }} className={inp} />
                </div>
              )}
 {date && <div className={CN17}><span className={CN16}>📅</span><span className={CN18}>{hasTimes ? "Dep: " : ""}{fmtFull(date)}{dep ? " at " + dep : ""}{arrDate && hasArrDate ? " — Arr: " + fmtFull(arrDate) : ""}{arr && hasTimes ? " at " + arr : ""}{dur ? " (" + dur + ")" : ""}</span></div>}
            </div>
          )}
        </div>
        <div className={CN1}>
 <div className={CN7}><span className={CN16}>📝</span><span className={CN4}>Event Details</span></div>
          <div>
 <label className={lbl}>Event Name <span className={CN16}>*</span></label>
 <input type="text" placeholder={isFlight ? "e.g. Sydney to Tokyo Narita" : "e.g. Check-in Shinjuku Granbell Hotel"} value={title} onChange={function(e) { setTitle(e.target.value); }} className={inp} />
          </div>
 <div><label className={lbl}>Address</label><AddrField value={addr} onChange={setAddr} placeholder="Start typing — suggestions appear" /></div>
 <div><label className={lbl}>Booking Reference</label><input type="text" placeholder="e.g. QF7821 or HB-990234" value={bookRef} onChange={function(e) { setRef(e.target.value); }} className={inp + " font-mono"} /></div>
 {isFlight && <div><label className={lbl}>Aircraft Type</label><input type="text" placeholder="e.g. Boeing 787-9 Dreamliner" value={plane} onChange={function(e) { setPlane(e.target.value); }} className={inp} /></div>}
        </div>
        <div className={CN1}>
 <div className={CN7}><span className={CN16}>📞</span><span className={CN4}>Contact</span></div>
 <div><label className={lbl}>Name</label><input type="text" placeholder="e.g. Hotel Front Desk" value={cName} onChange={function(e) { setCName(e.target.value); }} className={inp} /></div>
 <div><label className={lbl}>Phone</label><input type="tel" placeholder="e.g. +61 2 9691 3636" value={cPhone} onChange={function(e) { setCPhone(e.target.value); }} className={inp + " font-mono"} /></div>
 <div className={"flex items-center justify-between rounded-xl px-4 py-3 border " + (wa ? "bg-green-500/10 border-green-500/30" : "bg-slate-800/40 border-slate-700/40")}>
            <div className="flex items-center gap-2.5">
              <span>💬</span>
 <div><p className="text-white text-sm font-sans font-semibold">Available on WhatsApp</p><p className={CN6}>Adds a tap-to-chat button on the card</p></div>
            </div>
 <button onClick={function() { setWA(!wa); }} className={"w-11 h-6 rounded-full relative " + (wa ? "bg-green-500" : "bg-slate-700")}>
 <div className={"absolute top-0.5 w-5 h-5 bg-white rounded-full shadow " + (wa ? "left-5" : "left-0.5")} />
            </button>
          </div>
        </div>
        <div className={CN1}>
 <div className={CN7}><span className={CN16}>💰</span><span className={CN4}>Cost</span></div>
          <div className="flex gap-3">
            <div className="w-28 shrink-0">
              <label className={lbl}>Currency</label>
 <button onClick={function() { setShowCur(!showCur); }} className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-3 text-white font-sans text-sm flex items-center justify-between">
 <span className="font-bold">{cur.code}</span><span className="text-slate-500 text-xs">v</span>
              </button>
            </div>
            <div className="flex-1">
              <label className={lbl}>Amount</label>
              <div className="relative">
 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-sans text-sm font-bold">{cur.sym}</span>
 <input type="number" placeholder="0.00" value={cost} onChange={function(e) { setCost(e.target.value); }} className={inp + " pl-8"} />
              </div>
            </div>
          </div>
          {showCur && (
 <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              {CURS.map(function(c) {
 var cls = "w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-700/50 font-sans border-b border-slate-700/30 last:border-0 " + (cur.code === c.code ? {CN16} : "text-white");
                return (
 <button key={c.code} onClick={function() { setCur(c); setShowCur(false); }} className={cls}>
                    <span className="font-semibold text-sm">{c.code}</span>
                    <span className="text-slate-400">{c.sym}</span>
                  </button>
                );
              })}
            </div>
          )}
          {cost && cur.code !== "AUD" && (
 <div className="text-slate-400 text-xs font-sans bg-slate-800/40 rounded-xl px-3 py-2">
 Approx. A${Math.round(parseFloat(cost) * (AUD[cur.code] || 1)).toLocaleString()} AUD
            </div>
          )}
        </div>
        <div className={CN1}>
 <div className={CN7}><span className={CN16}>📝</span><span className={CN4}>Notes</span></div>
 <textarea rows={3} placeholder="Seat number, dress code, special instructions..." value={note} onChange={function(e) { setNote(e.target.value); }} className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/70 font-sans text-sm resize-none" />
        </div>
        <div className={CN1}>
 <div className={CN7}><span className={CN16}>📎</span><span className={CN4}>Documents</span></div>
          {docs.length > 0 && (
            <div className="space-y-2">
              {docs.map(function(d, i) {
                return (
 <div key={i} className="flex items-center justify-between bg-slate-800/60 border border-slate-700/40 rounded-xl px-3 py-2">
 <div className={CN7}><span>📄</span><span className={CN20}>{d}</span></div>
 <button onClick={function() { setDocs(docs.filter(function(_, j) { return j !== i; })); }} className="text-slate-500 hover:text-red-400 text-xs font-sans">Remove</button>
                  </div>
                );
              })}
            </div>
          )}
          <DocEntry docs={docs} setDocs={setDocs} />
        </div>
      </div>
      <div className="bg-slate-950 border-t border-slate-800 px-4 pt-3 pb-6">
        <div className="flex gap-3 max-w-lg mx-auto">
 <button onClick={function() { go("timeline"); }} className="flex-1 py-3.5 rounded-2xl border border-slate-700 text-slate-400 hover:text-white font-sans font-semibold">Cancel</button>
          <button onClick={doSave} disabled={saveDisabled} className={saveCls}>
 {saved ? (isEdit ? "Saved!" : "Added!") : (isEdit ? "Save Changes" : "Save Event")}
          </button>
        </div>
      </div>
    </div>
  );
}
function TimelineScreen(props) {
  var go = props.go;
  var trip = props.trip;
  var days = props.days;
  var setDays = props.setDays;
  var onEdit = props.onEdit;
  var onAdd  = props.onAdd;
  var activeDay = props.activeDay || 0;
  var setActiveDay = props.setActiveDay;
  var stExp = useState(null);
  var expandedId = stExp[0]; var setExpandedId = stExp[1];
  var stDel = useState(null);
  var delConfirm = stDel[0]; var setDelConfirm = stDel[1];
  var cur = days[activeDay];
  var pct = Math.min(100, Math.round((trip.spent / trip.budget) * 100));
  function doDelete(di, id) {
    setDays(function(prev) {
      return prev.map(function(d, i) {
        if (i !== di) return d;
 return { id: d.id, label: d.label, date: d.date, events: d.events.filter(function(e) { return e.id !== id; }) };
      });
    });
    setDelConfirm(null);
    setExpandedId(null);
  }
 var SYM = {AUD:"A$",USD:"$",GBP:"£",EUR:"€",JPY:"¥",THB:"฿",SGD:"S$",NZD:"NZ$"};
  return (
    <div className={CN3} style={{fontFamily:"Georgia,serif"}}>
      <div className="relative" style={{height:"200px"}}>
        {trip.photo ? (
          <img src={trip.photo} alt="" className="w-full h-full object-cover" />
        ) : (
 <div className={"w-full h-full bg-gradient-to-br " + trip.grad + " flex flex-col items-center justify-center gap-3"}
 style={{backgroundImage:"radial-gradient(ellipse at 20% 40%, " + trip.accent + "44 0%, transparent 55%)"}}>
 <div className="flex gap-2 text-5xl">{trip.flags.map(function(f, i) { return <span key={i}>{f}</span>; })}</div>
 <p className="text-white/25 text-xs font-sans uppercase tracking-widest">Go to Trips tab to add a cover photo</p>
          </div>
        )}
 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
 <button onClick={function() { go("dashboard"); }} className="absolute top-12 left-4 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full border border-white/20 font-sans z-10">Back</button>
        <div className="absolute bottom-4 left-5 right-5 z-10">
 <div className="flex gap-1 mb-1">{trip.flags.map(function(f, i) { return <span key={i} className="text-xl">{f}</span>; })}</div>
          <h1 className="text-2xl font-bold text-white">{trip.name}</h1>
 <div style={{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>
            <p className="text-orange-300 text-sm font-sans">{trip.dests.join(", ")}</p>

          </div>
        </div>
      </div>
      <div className="bg-slate-900/95 px-5 py-3 border-b border-slate-800">
        <div className="flex justify-between mb-1.5 font-sans text-sm">
 <span className="text-white font-semibold">{fmtShort(trip.start)}<span className="text-white/30 text-xs mx-1.5">to</span>{fmtShort(trip.end)}</span>
          <span className="text-slate-400 text-xs">{trip.tripDays} days</span>
        </div>
        <div className="flex justify-between mb-1.5 font-sans">
 <div><span className="text-white font-bold">A${trip.spent.toLocaleString()}</span><span className="text-slate-500 text-xs ml-1">spent</span></div>
 <div><span className="text-emerald-400 font-bold">A${(trip.budget - trip.spent).toLocaleString()}</span><span className="text-slate-500 text-xs ml-1">left</span></div>
 <div><span className="text-slate-400">A${trip.budget.toLocaleString()}</span><span className="text-slate-500 text-xs ml-1">budget</span></div>
        </div>
        <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
 <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400" style={{width: pct + "%"}} />
        </div>
 <button onClick={function() { go("costs"); }} className="w-full text-xs text-orange-400/70 font-sans hover:text-orange-400 text-center pt-1">View full costs breakdown</button>
      </div>
 <div className="flex gap-2 px-4 py-3 overflow-x-auto bg-slate-900/60 border-b border-slate-800/50">
        {days.map(function(d, i) {
          var cls = activeDay === i
 ? "shrink-0 px-3 py-2 rounded-xl text-xs font-sans bg-orange-500 text-white shadow-lg"
 : "shrink-0 px-3 py-2 rounded-xl text-xs font-sans bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700/50";
          var idx = i;
          return (
 <button key={idx} onClick={function() { setActiveDay(idx); }} className={cls}>
              <div className="font-bold">{d.label}</div>
              <div className="opacity-70">{fmtShort(d.date)}</div>
            </button>
          );
        })}
      </div>
      <div className="px-4 pt-4 pb-28">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className={CN25}>{cur.label}</span>
 <span className="text-slate-400 text-sm font-sans ml-2">{fmtFull(cur.date)}</span>
          </div>
 <div style={{display:"flex",gap:"6px",alignItems:"center",flexWrap:"wrap"}}>
            <button onClick={function() {
              var day = days[activeDay];
              if (!day) return;
              var addrs = day.events.filter(function(e) { return e.addr; }).map(function(e) { return encodeURIComponent(e.addr); });
              if (addrs.length === 0) { alert("No locations with addresses on this day."); return; }
              window.open("https://www.google.com/maps/dir/" + addrs.join("/"), "_blank");
            }} className="text-xs text-blue-400 font-sans border border-blue-500/30 px-3 py-1.5 rounded-full hover:bg-blue-500/10">🗺️ Map</button>
            <button onClick={function() {
              var day = days[activeDay];
              var city = "";
              if (day && day.events.length > 0) {
                for (var ei = 0; ei < day.events.length; ei++) {
                  var ev = day.events[ei];
                  if (ev.type === "Hotel" && ev.addr) { city = ev.addr.split(",").slice(-2,-1)[0] || ""; break; }
                  if (ev.aCity) { city = ev.aCity; break; }
                }
              }
              if (!city) city = trip.dests && trip.dests[0] ? trip.dests[0] : trip.name;
              city = city.trim();
              window.open("https://www.google.com/search?q=weather+" + encodeURIComponent(city), "_blank");
            }} className="text-xs text-sky-400 font-sans border border-sky-500/30 px-3 py-1.5 rounded-full hover:bg-sky-500/10">🌤️ Weather</button>
            <button onClick={function() { onAdd(activeDay); }} className="text-xs text-orange-400 font-sans border border-orange-500/30 px-3 py-1.5 rounded-full hover:bg-orange-500/10">+ Add Event</button>
          </div>
        </div>
        {cur.events.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📅</div>
 <p className="text-slate-400 font-sans">No events yet for {cur.label}</p>
 <button onClick={function() { onAdd(activeDay); }} className="mt-4 bg-orange-500 text-white px-6 py-2.5 rounded-2xl text-sm font-semibold font-sans">+ Add First Event</button>
          </div>
        )}
        <div className="relative">
          {cur.events.length > 0 && (
 <div className="absolute left-3.5 top-5 bottom-5 w-px bg-gradient-to-b from-orange-500/60 via-slate-600/30 to-transparent" />
          )}
          <div className="space-y-3">
            {cur.events.map(function(ev, i) {
              var isExp = expandedId === ev.id;
              var isNext = activeDay === 0 && i === 0;
              var sym = SYM[ev.cur] || ev.cur;
              var tc = TC[ev.type] || TC.Other;
              var isFl = ev.type === "Flight";
              var cardCls = isNext
 ? "rounded-2xl border overflow-hidden cursor-pointer border-orange-500/70 bg-gradient-to-br from-orange-950/50 via-slate-800/90 to-slate-900 shadow-lg"
 : "rounded-2xl border overflow-hidden cursor-pointer border-slate-700/50 bg-slate-800/60 hover:border-slate-600";
              return (
                <div key={ev.id} className="flex gap-3 items-start">
                  <div className="shrink-0 mt-4 z-10">
 <div className={"w-7 h-7 rounded-full flex items-center justify-center text-xs " + (i === 0 ? "bg-orange-500 text-white ring-2 ring-orange-500/30" : "bg-slate-800 border-2 border-slate-600 text-slate-400")}>
                      {i === 0 ? ">" : i + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
 <div onClick={function() { setExpandedId(isExp ? null : ev.id); }} className={cardCls}>
 {isNext && <div className="h-0.5 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
 <span className="text-white font-bold text-sm font-sans flex-1">{fmtFull(ev.date)}{ev.dep && ev.dep !== "TBD" ? " at " + ev.dep : ""}</span>
                          <div className="flex items-center gap-1 shrink-0">
 <CopyBtn text={fmtFull(ev.date) + (ev.dep && ev.dep !== "TBD" ? " at " + ev.dep : "")} />
 {isNext && <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full font-sans">NEXT</span>}
                          </div>
                        </div>
                        <div className="flex items-start justify-between gap-2">
 <p className="text-white font-semibold text-base flex-1">{ev.title}</p>
                          <CopyBtn text={ev.title} />
                        </div>
 <span className={"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border font-sans " + tc}>{ev.icon} {ev.type}</span>
 {ev.type === "Hotel" && ev.date && ev.arr && (function() {
                          var d1 = new Date(ev.date + "T12:00:00");
                          var d2 = new Date(ev.arr + "T12:00:00");
                          var nights = Math.round((d2 - d1) / 86400000);
 return nights > 0 ? <span className="ml-2 text-purple-300 text-xs font-sans bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded-full">🌙 {nights} night{nights !== 1 ? "s" : ""}</span> : null;
                        })()}
 {(ev.type === "Flight" || ev.type === "Train" || ev.type === "Ferry" || ev.type === "Bus" || ev.type === "Taxi" || ev.type === "Car Rental") && (ev.arr || ev.dur) && (
 <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex items-center">
                            <div className="flex-1 text-center">
 <p className="text-white font-mono font-bold text-lg">{ev.dep}</p>
                              <p className={CN5}>Departs</p>
                            </div>
                            <div className="flex-shrink-0 text-center px-2">
 <p className="text-xl">{ev.type === "Train" ? "🚆" : ev.type === "Ferry" ? "⛴️" : ev.type === "Bus" ? "🚌" : ev.type === "Taxi" ? "🚖" : ev.type === "Car Rental" ? "🚗" : "✈️"}</p>
 {ev.dur && <p className="text-blue-400 text-xs font-sans font-semibold">{ev.dur}</p>}
                            </div>
                            <div className="flex-1 text-center">
 <p className="text-white font-mono font-bold text-lg">{ev.arr}</p>
                              <p className={CN5}>Arrives</p>
                            </div>
                          </div>
                        )}
                        {ev.addr ? (
                          <div className="flex items-start gap-2">
                            <span className="shrink-0 mt-0.5">📍</span>
 <a href={"https://maps.google.com/?q=" + encodeURIComponent(ev.addr)} target="_blank" rel="noreferrer" onClick={function(e) { e.stopPropagation(); }} className="text-slate-300 text-sm font-sans flex-1 underline decoration-dotted hover:text-orange-300">{ev.addr}</a>
                            <CopyBtn text={ev.addr} />
                          </div>
                        ) : null}
                        {ev.contact ? (
                          <div className="flex items-start gap-2">
                            <span>📞</span>
                            <div className="flex-1 min-w-0">
                              <p className={CN5}>{ev.contact.name}</p>
 <div className="flex items-center gap-1 flex-wrap">
 <a href={"tel:" + ev.contact.phone} onClick={function(e) { e.stopPropagation(); window.location.href = "tel:" + ev.contact.phone; }} className="text-emerald-400 font-mono text-sm font-semibold underline">{ev.contact.phone}</a>
                                <CopyBtn text={ev.contact.phone} />
 {ev.contact.wa && <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-sans">WhatsApp</span>}
                              </div>
                            </div>
                          </div>
                        ) : (
 <div className={CN7}><span>📞</span><span className="text-slate-600 text-xs italic font-sans">No contact</span></div>
                        )}
                        {ev.ref ? (
                          <div className={CN7}>
                            <span>🎫</span>
 <span className="font-mono text-xs bg-slate-700/80 border border-slate-600/50 px-2.5 py-1 rounded-lg text-slate-200 tracking-wider">{ev.ref}</span>
                            <CopyBtn text={ev.ref} />
                          </div>
                        ) : (
 <div className={CN7}><span>🎫</span><span className="text-slate-600 text-xs italic font-sans">No booking ref</span></div>
                        )}
                        {ev.aircraft && (
                          <div className={CN7}>
                            <span>🛩️</span>
 <span className="text-blue-300 text-sm font-sans">{ev.aircraft}</span>
                            <CopyBtn text={ev.aircraft} />
                          </div>
                        )}
                        <div className={CN7}>
                          <span>💰</span>
                          {ev.cost > 0 ? (
                            <div className="flex items-center flex-wrap gap-1">
 <span className="text-emerald-400 font-bold font-sans">{sym}{ev.cost.toLocaleString()}</span>
 <span className="text-slate-500 text-xs">{ev.cur}</span>
 {ev.cur !== "AUD" && <span className="text-slate-500 text-xs">≈ A${toAUD(ev.cost, ev.cur).toLocaleString()}</span>}
 <CopyBtn text={sym + ev.cost.toLocaleString() + " " + ev.cur} />
                            </div>
                          ) : (
 <span className="text-slate-500 text-sm font-sans">Free</span>
                          )}
                        </div>
                      </div>
                      {isExp && (
 <div className="border-t border-slate-700/50 bg-slate-900/50 px-4 py-3 space-y-3">
                          {ev.note ? (
                            <div className="flex gap-2">
                              <span>📝</span>
 <p className="text-slate-300 text-sm font-sans flex-1">{ev.note}</p>
                              <CopyBtn text={ev.note} />
                            </div>
                          ) : null}
                          {ev.docs && ev.docs.length > 0 && (
                            <div className="space-y-1">
                              {ev.docs.map(function(d, di) {
                                var docName = typeof d === "string" ? d : (d && d.name ? d.name : "Document");
                                return (
                                  <div key={di} onClick={function(e) { e.stopPropagation(); }} className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/40 rounded-xl px-3 py-2">
                                    <span>📄</span>
                                    <span className={CN20} style={{flex:1}}>{docName}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          <div className="flex gap-2">
 <button onClick={function(e) { e.stopPropagation(); onEdit(activeDay, ev); }} className="flex-1 text-xs text-slate-300 border border-slate-600/60 rounded-xl py-2.5 hover:border-orange-500/50 hover:text-orange-400 font-sans">Edit</button>
 <button onClick={function(e) { e.stopPropagation(); setDelConfirm({ di: activeDay, id: ev.id, title: ev.title }); }} className="flex-1 text-xs text-red-400/80 border border-red-500/30 rounded-xl py-2.5 hover:bg-red-500/10 hover:text-red-400 font-sans">Delete</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {delConfirm && (
 <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-5">
 <div className="w-full max-w-sm bg-slate-900 rounded-3xl border border-slate-700 p-6 space-y-4">
            <div className="text-center">
              <div className="text-4xl mb-3">🗑️</div>
 <h2 className="text-white font-bold text-lg">Delete this event?</h2>
 <p className="text-slate-300 text-sm font-sans mt-1 font-semibold">{delConfirm.title}</p>
 <p className="text-slate-500 text-sm font-sans mt-1">This cannot be undone.</p>
            </div>
            <div className="flex gap-3">
 <button onClick={function() { setDelConfirm(null); }} className="flex-1 py-3 rounded-2xl border border-slate-700 text-slate-400 hover:text-white font-sans font-semibold">Cancel</button>
 <button onClick={function() { doDelete(delConfirm.di, delConfirm.id); }} className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-400 text-white font-semibold font-sans">Delete</button>
            </div>
          </div>
        </div>
      )}
      <div style={{height:"72px"}} />
      <BottomNav active="timeline" go={go} />
    </div>
  );
}
function DashboardScreen(props) {
  var go = props.go;
  var setActiveTripId = props.setActiveTripId;
  var trips = props.trips;
  var setTrips = props.setTrips;
  var stFilter = useState("all");
  var filter = stFilter[0]; var setFilter = stFilter[1];
  var stNew = useState(false);
  var showNew = stNew[0]; var setShowNew = stNew[1];
  var stNT = useState({ name:"", dests:"", start:"", end:"", budget:"" });
  var nt = stNT[0]; var setNT = stNT[1];
  var stDelTrip = useState(null);
  var delTrip = stDelTrip[0]; var setDelTrip = stDelTrip[1];
 var filtered = filter === "all" ? trips : trips.filter(function(t) { return t.status === filter; });
  function updateNT(key, val) {
 var next = { name: nt.name, dests: nt.dests, start: nt.start, end: nt.end, budget: nt.budget };
    next[key] = val;
    setNT(next);
  }
  return (
    <div className={CN3} style={{fontFamily:"Georgia,serif"}}>
 <div className="bg-gradient-to-b from-slate-900 to-slate-950 pt-12 pb-4 px-5">
        <div className="flex items-center justify-between mb-5">
          <div>
 <div className="flex items-center gap-2 mb-1"><img src="/logo.png" style={{height:"64px",width:"auto",borderRadius:"8px"}} alt="Mannie Travels" /></div>
            <h1 className="text-3xl font-bold text-white">My Trips</h1>
          </div>
 <button onClick={function() { setShowNew(true); }} className="bg-orange-500 hover:bg-orange-400 text-white px-4 py-2.5 rounded-2xl text-sm font-semibold font-sans shadow-lg shadow-orange-900/50">+ New Trip</button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 font-sans">
          {["all","upcoming","planning","completed"].map(function(f) {
 var cls = filter === f ? "shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold capitalize bg-orange-500 text-white" : "shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold capitalize bg-slate-800 text-slate-400 hover:text-white border border-slate-700";
 var lbl2 = f === "all" ? "All (" + trips.length + ")" : f.charAt(0).toUpperCase() + f.slice(1) + " (" + trips.filter(function(t) { return t.status === f; }).length + ")";
 return <button key={f} onClick={function() { setFilter(f); }} className={cls}>{lbl2}</button>;
          })}
        </div>
      </div>
      <div className="px-4 space-y-5">
        {filtered.map(function(trip) {
          var st = SC[trip.status] || SC.upcoming;
          var pct = Math.min(100, Math.round((trip.spent / trip.budget) * 100));
          return (
 <div key={trip.id} className="rounded-3xl overflow-hidden border border-white/10 bg-slate-900 shadow-xl">
              <div className="relative" style={{height:"190px"}}>
                {trip.photo ? (
 <img src={trip.photo} alt={trip.name} className="w-full h-full object-cover" />
                ) : (
 <div className={"w-full h-full bg-gradient-to-br " + trip.grad + " flex flex-col items-center justify-center gap-2"}
 style={{backgroundImage:"radial-gradient(ellipse at 20% 40%, " + trip.accent + "44 0%, transparent 55%)"}}>
 <div className="flex gap-2 text-4xl">{trip.flags.map(function(f, i) { return <span key={i}>{f}</span>; })}</div>
 <p className="text-white/25 text-xs font-sans uppercase tracking-widest">Tap to add cover photo</p>
                  </div>
                )}
 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                <div className="absolute top-3 right-3 z-20">
 <span className={"text-xs font-semibold px-3 py-1 rounded-full border backdrop-blur-sm font-sans " + st.color}>{st.label}</span>
                </div>
                <div className="absolute top-3 left-3 z-20">
 <PhotoEntry tripId={trip.id} currentPhoto={trip.photo} setTrips={setTrips} trips={trips} />
                </div>
                <div className="absolute bottom-4 left-5 right-16 z-10">
 <div className="flex gap-1 mb-1">{trip.flags.map(function(f, i) { return <span key={i} className="text-xl">{f}</span>; })}</div>
                  <h2 className={CN13}>{trip.name}</h2>
 <p className="text-orange-300 text-sm font-sans">{trip.dests.join(", ")}</p>
                </div>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="flex justify-between font-sans">
                  <div>
 <div className="text-white/40 text-xs uppercase mb-0.5">Dates</div>
                    <div className="flex items-center gap-1">
 <span className="text-white text-sm font-semibold">{fmtShort(trip.start)}</span>
                      <span className="text-white/30 text-xs">to</span>
 <span className="text-white text-sm font-semibold">{fmtShort(trip.end)}</span>
                    </div>
                  </div>
                  <div className="text-right">
 <div className="text-white/40 text-xs uppercase mb-0.5">Length</div>
 <div className="text-white/80 text-sm font-semibold">{trip.tripDays} days</div>
                  </div>
                </div>
                <div>
 <div className="flex justify-between text-xs font-sans mb-1"><span className="text-white/40">Budget</span><span className="text-white/40">{pct}% used</span></div>
 <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
 <div className="h-full rounded-full" style={{width: pct + "%", background: "linear-gradient(90deg," + trip.accent + "," + trip.accent + "99)"}} />
                  </div>
                  <div className="flex justify-between font-sans">
                    <div>
                      <div className="text-white/35 text-xs">Spent</div>
 <div className="flex items-center"><span className="text-white font-bold text-sm">A${trip.spent.toLocaleString()}</span><CopyBtn text={"A$" + trip.spent.toLocaleString()} /></div>
                    </div>
                    {trip.status !== "completed" && (
                      <div className="text-center">
                        <div className="text-white/35 text-xs">Left</div>
 <div className="font-bold text-sm" style={{color: trip.accent}}>A${(trip.budget - trip.spent).toLocaleString()}</div>
                      </div>
                    )}
                    <div className="text-right">
                      <div className="text-white/35 text-xs">Budget</div>
 <div className="text-white/60 font-bold text-sm">A${trip.budget.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
 <button onClick={function() { setActiveTripId(trip.id); go("timeline"); }}
 className="flex-1 py-3 rounded-2xl border border-white/15 text-white text-sm font-semibold font-sans hover:bg-white/10" style={{backgroundColor:"rgba(255,255,255,0.06)"}}>
                    {trip.status === "completed" ? "View Archive" : "Open Trip"}
                  </button>
                  <button onClick={function() { setDelTrip(trip); }}
 className="px-4 py-3 rounded-2xl border border-red-500/30 text-red-400 text-sm font-sans hover:bg-red-500/10">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {trips.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">✈️</div>
            <h2 className="text-white text-xl font-bold mb-2">No trips yet</h2>
 <p className="text-slate-400 font-sans text-sm mb-6">Tap + New Trip to plan your first adventure</p>
 <button onClick={function() { setShowNew(true); }} className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-3 rounded-2xl font-semibold font-sans shadow-lg shadow-orange-900/50">+ New Trip</button>
          </div>
        )}
      </div>
      {showNew && (
 <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-end">
 <div className="w-full bg-slate-900 rounded-t-3xl border-t border-slate-700 p-6 space-y-4 max-h-screen overflow-y-auto">
            <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-2" />
            <h2 className={CN13}>New Trip</h2>
            <div className="space-y-3 font-sans">
              <div>
 <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5">Trip Name</label>
 <input type="text" value={nt.name} onChange={function(e) { updateNT("name", e.target.value); }} placeholder="e.g. Japan Adventure 2026" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500" />
              </div>
              <div>
 <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5">Destinations</label>
 <input type="text" value={nt.dests} onChange={function(e) { updateNT("dests", e.target.value); }} placeholder="e.g. Tokyo, Kyoto, Bangkok" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
 <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5">Start Date</label>
 <input type="date" value={nt.start} onChange={function(e) { updateNT("start", e.target.value); }} style={{width:"100%",background:"rgba(30,41,59,0.8)",border:"1px solid rgba(71,85,105,0.6)",borderRadius:"12px",padding:"12px 16px",color:"white",fontSize:"14px",fontFamily:"sans-serif",outline:"none",colorScheme:"dark"}} />
                </div>
                <div className="flex-1">
 <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5">End Date</label>
 <input type="date" value={nt.end} onChange={function(e) { updateNT("end", e.target.value); }} style={{width:"100%",background:"rgba(30,41,59,0.8)",border:"1px solid rgba(71,85,105,0.6)",borderRadius:"12px",padding:"12px 16px",color:"white",fontSize:"14px",fontFamily:"sans-serif",outline:"none",colorScheme:"dark"}} />
                </div>
              </div>
              <div>
 <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5">Budget (AUD)</label>
 <input type="number" value={nt.budget} onChange={function(e) { updateNT("budget", e.target.value); }} placeholder="e.g. 5000" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
 <button onClick={function() { setShowNew(false); }} className="flex-1 py-3.5 rounded-2xl border border-slate-700 text-slate-400 font-sans font-semibold hover:text-white">Cancel</button>
              <button onClick={function() {
                if (!nt.name) return;
 var destArr = nt.dests.split(",").map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
                var dayCount = 7;
                if (nt.start && nt.end) {
 var ms = new Date(nt.end + "T12:00:00") - new Date(nt.start + "T12:00:00");
                  dayCount = Math.max(1, Math.round(ms / 86400000) + 1);
                }
 var newT = { id: Date.now(), name: nt.name, dests: destArr, start: nt.start || "", end: nt.end || "", tripDays: dayCount, budget: parseInt(nt.budget) || 0, spent: 0, wishlist: [], status: "planning", accent: "#f97316", flags: ["🌍"], grad: "from-slate-800 to-slate-700" };
                props.addTrip(newT);
                setShowNew(false);
                setNT({ name:"", dests:"", start:"", end:"", budget:"" });
 }} className="flex-1 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-semibold font-sans shadow-lg shadow-orange-900/50">Create Trip</button>
            </div>
          </div>
        </div>
      )}
      {delTrip && (
 <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-5">
 <div className="w-full max-w-sm bg-slate-900 rounded-3xl border border-slate-700 p-6 space-y-4">
            <div className="text-center">
              <div className="text-4xl mb-3">🗑️</div>
 <h2 className="text-white font-bold text-lg">Delete this trip?</h2>
 <p className="text-slate-300 text-sm font-sans mt-1 font-semibold">{delTrip.name}</p>
 <p className="text-slate-500 text-sm font-sans mt-1">All events will be permanently deleted.</p>
            </div>
            <div className="flex gap-3">
 <button onClick={function() { setDelTrip(null); }} className="flex-1 py-3 rounded-2xl border border-slate-700 text-slate-400 hover:text-white font-sans font-semibold">Cancel</button>
              <button onClick={function() {
 setTrips(function(prev) { return prev.filter(function(t) { return t.id !== delTrip.id; }); });
                setDelTrip(null);
 }} className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-400 text-white font-semibold font-sans">Delete Trip</button>
            </div>
          </div>
        </div>
      )}
      <div style={{height:"72px"}} /><BottomNav active="dashboard" go={go} />
    </div>
  );
}
function GlanceScreen(props) {
  var go = props.go;
  var trip = props.trip;
  var days = props.days;
  var setActiveDay = props.setActiveDay;
 var SYM = {AUD:"A$",USD:"$",GBP:"£",EUR:"€",JPY:"¥",THB:"฿",SGD:"S$",NZD:"NZ$"};
  var stView = useState("full");
  var view = stView[0]; var setView = stView[1];
  var stWeek = useState(0);
  var weekStart = stWeek[0]; var setWeek = stWeek[1];
  var WEEK = 7;
  var totalDays = days.length;
  var totalWeeks = Math.ceil(totalDays / WEEK);
  var visibleDays = view === "week"
    ? days.slice(weekStart * WEEK, weekStart * WEEK + WEEK)
    : days;
  function buildText(hc) {
    var lines = [];
    lines.push(trip.name.toUpperCase());
    lines.push(trip.dests.join(", "));
    if (trip.start) lines.push(fmtShort(trip.start) + " to " + fmtShort(trip.end));
    lines.push("");
    for (var di = 0; di < days.length; di++) {
      var day = days[di];
      lines.push("---- " + day.label.toUpperCase() + " | " + fmtFull(day.date) + " ----");
      if (day.events.length === 0) {
        lines.push("  No events");
      } else {
        for (var ei = 0; ei < day.events.length; ei++) {
          var ev = day.events[ei];
          var sym = SYM[ev.cur] || ev.cur;
          var line = "  " + ev.icon + " " + ev.title;
          if (ev.dep && ev.dep !== "TBD") line += "  " + ev.dep;
          if (ev.arr && ev.type === "Flight") line += " - " + ev.arr;
          if (ev.dur) line += " (" + ev.dur + ")";
          lines.push(line);
          if (ev.addr) lines.push("     📍 " + ev.addr);
          if (ev.contact) lines.push("     📞 " + ev.contact.name + " " + ev.contact.phone);
          if (ev.ref) lines.push("     Ref: " + ev.ref);
          if (ev.aircraft) lines.push("     " + ev.aircraft);
          if (ev.cost > 0 && !hc) lines.push("     💰 " + sym + ev.cost.toLocaleString() + " " + ev.cur);
          if (ev.notes) lines.push("     📝 " + ev.notes);
        }
      }
      lines.push("");
    }
    var total = days.reduce(function(s,d) { return s + d.events.reduce(function(ss,e) { return ss + (e.cost||0); }, 0); }, 0);
    if (!hc) lines.push("Total spent: A$" + total.toLocaleString() + " / Budget: A$" + trip.budget.toLocaleString());
    return lines.join("\n");
  }
  function buildHtmlEmail(hc) {
    var sym = "A$";
    var rows = "";
    var grandTotal = 0;
    for (var di = 0; di < days.length; di++) {
      var day = days[di];
      rows += '<tr><td colspan="5" style="background:#1e293b;color:#f97316;font-weight:bold;padding:10px 12px;font-size:14px;border-top:2px solid #f97316">' + day.label + ' &mdash; ' + fmtFull(day.date) + '</td></tr>';
      if (day.events.length === 0) {
        rows += '<tr><td colspan="5" style="padding:8px 12px;color:#64748b;font-style:italic">No events planned</td></tr>';
      } else {
        for (var ei = 0; ei < day.events.length; ei++) {
          var ev = day.events[ei];
          var evSym = SYM[ev.cur] || ev.cur;
          grandTotal += ev.cost || 0;
          var timeStr = ev.dep && ev.dep !== "TBD" ? ev.dep : "";
          if (ev.arr && ev.type === "Flight") timeStr += " &rarr; " + ev.arr;
          var costStr = ev.cost > 0 && !hc ? evSym + ev.cost.toLocaleString() + " " + ev.cur : "";
          var details = "";
          if (ev.dur) details += ev.dur;
          if (ev.ref) details += (details?" &bull; ":"") + "Ref: " + ev.ref;
          if (ev.aircraft) details += (details?" &bull; ":"") + ev.aircraft;
          if (ev.addr) details += (details?"<br>":"") + "📍 " + ev.addr;
          if (ev.notes) details += (details?"<br>":"") + "📝 " + ev.notes;
          rows += '<tr style="border-bottom:1px solid #1e293b">' +
            '<td style="padding:8px 12px;font-size:16px;width:36px">' + ev.icon + '</td>' +
            '<td style="padding:8px 12px;color:#f1f5f9;font-weight:600;font-size:13px">' + ev.title + '</td>' +
            '<td style="padding:8px 12px;color:#94a3b8;font-size:12px">' + timeStr + '</td>' +
            '<td style="padding:8px 12px;color:#94a3b8;font-size:12px">' + details + '</td>' +
            '<td style="padding:8px 12px;color:#4ade80;font-weight:bold;font-size:13px;text-align:right">' + costStr + '</td>' +
            '</tr>';
        }
      }
    }
    var totalRow = !hc ? '<tr><td colspan="4" style="padding:12px;color:#94a3b8;font-size:13px;border-top:2px solid #334155">Total Spent</td><td style="padding:12px;color:#4ade80;font-weight:bold;font-size:15px;text-align:right;border-top:2px solid #334155">A$' + grandTotal.toLocaleString() + '</td></tr>' : '';
    return '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#0f172a;font-family:Georgia,serif">' +
      '<div style="max-width:680px;margin:0 auto;padding:24px">' +
      '<div style="background:#1e293b;border-radius:12px;padding:20px 24px;margin-bottom:16px">' +
      '<h1 style="color:#f97316;font-size:24px;margin:0 0 4px">' + trip.name + '</h1>' +
      '<p style="color:#94a3b8;margin:0;font-size:14px">' + trip.dests.join(" &bull; ") + '</p>' +
      (trip.start ? '<p style="color:#94a3b8;margin:4px 0 0;font-size:13px">' + fmtShort(trip.start) + ' &ndash; ' + fmtShort(trip.end) + ' &bull; ' + days.length + ' days</p>' : '') +
      '</div>' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border-radius:12px;overflow:hidden;border:1px solid #1e293b">' +
      '<thead><tr style="background:#1e293b">' +
      '<th style="padding:10px 12px;color:#64748b;font-size:11px;text-align:left;width:36px"></th>' +
      '<th style="padding:10px 12px;color:#64748b;font-size:11px;text-align:left">EVENT</th>' +
      '<th style="padding:10px 12px;color:#64748b;font-size:11px;text-align:left">TIME</th>' +
      '<th style="padding:10px 12px;color:#64748b;font-size:11px;text-align:left">DETAILS</th>' +
      '<th style="padding:10px 12px;color:#64748b;font-size:11px;text-align:right">' + (!hc ? 'COST' : '') + '</th>' +
      '</tr></thead>' +
      '<tbody>' + rows + totalRow + '</tbody>' +
      '</table>' +
      '<p style="color:#475569;font-size:11px;text-align:center;margin-top:16px">Generated by Mannie Travels</p>' +
      '</div></body></html>';
  }

  var stHideCosts = useState(false);
  var hideCosts = stHideCosts[0]; var setHideCosts = stHideCosts[1];
  var stCopied = useState(false);
  var copied = stCopied[0]; var setCopied = stCopied[1];
  var stShowText = useState(false);
  var showText = stShowText[0]; var setShowText = stShowText[1];
  function handleCopy() {
    var text = buildText(hideCosts);
    try {
      navigator.clipboard.writeText(text).then(function() {
        setCopied(true);
        setTimeout(function() { setCopied(false); }, 2500);
      });
    } catch(e) {
      setShowText(true);
    }
  }
  return (
    <div className={CN3} style={{fontFamily:"Georgia,serif"}}>
      <div className={CN10}>
        <div className="flex items-center justify-between mb-3">
          <div className={CN8}>
 <button onClick={function() { go("timeline"); }} className={CN11}>Back</button>
            <div>
              <div className={CN12}>{trip.name}</div>
              <h1 className={CN13}>Itinerary</h1>
            </div>
          </div>
<div style={{display:"flex",flexWrap:"wrap",gap:"6px",marginTop:"4px"}}>
            <button onClick={function() { setHideCosts(!hideCosts); }}
              style={{fontSize:"11px",padding:"6px 10px",borderRadius:"10px",fontFamily:"sans-serif",cursor:"pointer",border:"1px solid",background:hideCosts?"rgba(245,158,11,0.2)":"rgba(30,41,59,0.8)",borderColor:hideCosts?"rgba(245,158,11,0.4)":"rgba(71,85,105,0.7)",color:hideCosts?"rgb(252,211,77)":"rgb(148,163,184)"}}>
              {hideCosts ? "💰 Costs Hidden" : "💰 Hide Costs"}
            </button>
            <button onClick={handleCopy} style={{fontSize:"11px",padding:"6px 10px",borderRadius:"10px",fontFamily:"sans-serif",cursor:"pointer",border:"1px solid rgba(71,85,105,0.7)",background:copied?"rgba(16,185,129,0.2)":"rgba(30,41,59,0.8)",color:copied?"rgb(110,231,183)":"rgb(148,163,184)"}}>
              {copied ? "✓ Copied!" : "📋 Copy"}
            </button>
            <button onClick={function() {
              var html = buildHtmlEmail(hideCosts);
              var subject = trip.name + " Itinerary";
              var text = buildText(hideCosts);
              var newWin = window.open("", "_blank");
              if (newWin) {
                var shareBtn = '<div style="position:fixed;top:0;left:0;right:0;background:#1e293b;padding:12px 16px;display:flex;gap:8px;align-items:center;z-index:999">' +
                  '<a href="mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text) + '" style="background:#f97316;color:white;padding:8px 16px;border-radius:8px;text-decoration:none;font-family:sans-serif;font-size:14px;font-weight:bold">✉️ Send Email</a>' +
                  '<button onclick="window.print()" style="background:#334155;color:white;padding:8px 16px;border-radius:8px;border:none;font-family:sans-serif;font-size:14px;cursor:pointer">🖨️ Print</button>' +
                  '<button onclick="window.close()" style="background:transparent;color:#94a3b8;padding:8px 12px;border-radius:8px;border:1px solid #475569;font-family:sans-serif;font-size:14px;cursor:pointer">✕ Close</button>' +
                  '</div><div style="margin-top:56px">';
                newWin.document.write(shareBtn + html + '</div>');
                newWin.document.close();
              }
            }} style={{fontSize:"11px",padding:"6px 10px",borderRadius:"10px",fontFamily:"sans-serif",cursor:"pointer",border:"1px solid rgba(71,85,105,0.7)",background:"rgba(30,41,59,0.8)",color:"rgb(148,163,184)"}}>
              ✉️ Email
            </button>
            <button onClick={function() {
              var text = buildText(hideCosts);
              var win = window.open("", "_blank");
              if (win) {
                win.document.write("<html><head><title>" + trip.name + " Itinerary</title><style>body{font-family:Georgia,serif;padding:32px;max-width:700px;margin:0 auto;color:#111;line-height:1.6}pre{white-space:pre-wrap;font-family:Georgia,serif;font-size:14px}</style></head><body><pre>" + text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;") + "</pre></body></html>");
                win.document.close();
                setTimeout(function() { win.print(); }, 400);
              }
            }} style={{fontSize:"11px",padding:"6px 10px",borderRadius:"10px",fontFamily:"sans-serif",cursor:"pointer",border:"1px solid rgba(71,85,105,0.7)",background:"rgba(30,41,59,0.8)",color:"rgb(148,163,184)"}}>
              🖨️ Print
            </button>
          </div>
        </div>
        <div className="flex gap-2">
 <button onClick={function() { setView("week"); }} className={"flex-1 py-2 rounded-xl text-xs font-semibold font-sans border " + (view === "week" ? "bg-orange-500 text-white border-orange-600" : "bg-slate-800 text-slate-400 border-slate-700")}>
            Weekly View
          </button>
 <button onClick={function() { setView("full"); }} className={"flex-1 py-2 rounded-xl text-xs font-semibold font-sans border " + (view === "full" ? "bg-orange-500 text-white border-orange-600" : "bg-slate-800 text-slate-400 border-slate-700")}>
            Full Trip
          </button>
        </div>
        {showText && (
          <div className="mt-3">
 <p className="text-slate-400 text-xs font-sans mb-1">Select all text below and copy:</p>
            <textarea readOnly value={buildText(hideCosts)} rows={8}
 className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 text-xs font-mono resize-none focus:outline-none"
              onFocus={function(e) { e.target.select(); }}
            />
          </div>
        )}
        {view === "week" && totalWeeks > 1 && (
          <div className="flex items-center justify-between mt-2">
 <button onClick={function() { setWeek(Math.max(0, weekStart - 1)); }} disabled={weekStart === 0} className="text-slate-400 text-sm px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 disabled:opacity-30 font-sans">Prev</button>
            <span className={CN5}>Week {weekStart + 1} of {totalWeeks}</span>
 <button onClick={function() { setWeek(Math.min(totalWeeks - 1, weekStart + 1)); }} disabled={weekStart === totalWeeks - 1} className="text-slate-400 text-sm px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 disabled:opacity-30 font-sans">Next</button>
          </div>
        )}
      </div>
      <div className="px-4 py-4 space-y-3">
        {visibleDays.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-3">📋</div>
 <p className="text-slate-400 font-sans">No days yet. Add events on the Timeline tab.</p>
          </div>
        )}
        {visibleDays.map(function(day) { var di = days.indexOf(day);
          var hasEvents = day.events.length > 0;
          return (
 <div key={day.id} className="bg-slate-900/60 rounded-2xl border border-slate-800/60 overflow-hidden">
              <button
                onClick={function() { setActiveDay(di); go("timeline"); }}
 className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/40 border-b border-slate-800/60 hover:bg-slate-700/40 transition-colors text-left">
                <div>
                  <span className={CN25}>{day.label}</span>
 <span className="text-slate-400 text-sm font-sans ml-2">{fmtFull(day.date)}</span>
                </div>
                <div className={CN7}>
 <span className={CN6}>{day.events.length} event{day.events.length !== 1 ? "s" : ""}</span>
 <span className="text-orange-400 text-xs font-sans">Open →</span>
                </div>
              </button>
              {!hasEvents ? (
 <div className="px-4 py-3 text-slate-600 text-sm font-sans italic">No events</div>
              ) : (
                <div className="divide-y divide-slate-800/40">
                  {day.events.map(function(ev) {
                    var sym = SYM[ev.cur] || ev.cur;
                    var isFl = ev.type === "Flight";
                    return (
 <div key={ev.id} className="px-4 py-3 flex items-start gap-3">
 <span className="text-xl shrink-0 mt-0.5">{ev.icon}</span>
                        <div className="flex-1 min-w-0 space-y-0.5">
 <div className="flex items-start justify-between gap-2">
 <p className="text-white font-semibold font-sans text-sm leading-snug">{ev.title}</p>
 {ev.cost > 0 && <span className="text-emerald-400 font-sans text-xs font-bold shrink-0">{sym}{ev.cost.toLocaleString()}</span>}
                          </div>
                          {ev.dep && ev.dep !== "TBD" && (
                            <div className="flex items-center gap-2 flex-wrap">
 <span className="text-orange-300 text-xs font-sans font-semibold">{ev.dep}</span>
 {isFl && ev.arr && <span className="text-slate-500 text-xs">to</span>}
 {isFl && ev.arr && <span className="text-orange-300 text-xs font-sans font-semibold">{ev.arr}</span>}
 {ev.dur && <span className={CN5}>({ev.dur})</span>}
                            </div>
                          )}
 {ev.aircraft && <p className="text-blue-300 text-xs font-sans">🛩️ {ev.aircraft}</p>}
                          {ev.addr ? (
 <a href={"https://maps.google.com/?q=" + encodeURIComponent(ev.addr)} target="_blank" rel="noreferrer"
 className="text-slate-400 text-xs font-sans block truncate hover:text-orange-300">📍 {ev.addr}</a>
                          ) : null}
                          {ev.contact && (
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={CN6}>{ev.contact.name}</span>
 <a href={"tel:" + ev.contact.phone} className="text-emerald-400 text-xs font-mono">{ev.contact.phone}</a>
                            </div>
                          )}
 {ev.ref && <p className="text-slate-500 text-xs font-mono">Ref: {ev.ref}</p>}
 {ev.note && <p className="text-slate-500 text-xs font-sans italic">{ev.note}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {days.length > 0 && (
 <div className="bg-slate-900/60 rounded-2xl border border-slate-800/60 p-4 space-y-2">
 <p className="text-white font-semibold font-sans text-sm">Trip Summary</p>
            <div className="flex justify-between font-sans text-sm">
              <span className="text-slate-400">Total events</span>
 <span className="text-white font-semibold">{days.reduce(function(s,d) { return s + d.events.length; }, 0)}</span>
            </div>
            <div className="flex justify-between font-sans text-sm">
              <span className="text-slate-400">Total spent</span>
 <span className="text-emerald-400 font-bold">A${trip.spent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-sans text-sm">
              <span className="text-slate-400">Budget remaining</span>
 <span className="text-white font-semibold">A${(trip.budget - trip.spent).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
      <div style={{height:"72px"}} /><BottomNav active="glance" go={go} />
    </div>
  );
}
function SettingsScreen(props) {
  var go = props.go;
  var trip = props.trip;
  var trips = props.trips;
  var setTrips = props.setTrips;
  var activeTripId = props.activeTripId;
  var stStatus = useState(trip ? trip.status : "upcoming");
  var status = stStatus[0]; var setStatus = stStatus[1];
  var stBudget = useState(trip ? String(trip.budget) : "");
  var budget = stBudget[0]; var setBudget = stBudget[1];
  var stName = useState(trip ? trip.name : "");
  var tname = stName[0]; var setTname = stName[1];
  var stDests = useState(trip ? trip.dests.join(", ") : "");
  var dests = stDests[0]; var setDests = stDests[1];
  var stStart = useState(trip ? trip.start : "");
  var tstart = stStart[0]; var setTstart = stStart[1];
  var stEnd = useState(trip ? trip.end : "");
  var tend = stEnd[0]; var setTend = stEnd[1];
  var stSaved = useState(false);
  var saved = stSaved[0]; var setSaved = stSaved[1];
  function save() {
    setTrips(function(prev) {
      return prev.map(function(t) {
        if (t.id !== activeTripId) return t;
        var destArr = dests.split(",").map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
        if (destArr.length === 0) destArr = t.dests;
        var newStart = tstart || t.start;
        var newEnd = tend || t.end;
        var dayCount = t.tripDays;
        if (newStart && newEnd) {
          var ms = new Date(newEnd + "T12:00:00") - new Date(newStart + "T12:00:00");
          var dc = Math.max(1, Math.round(ms / 86400000) + 1);
          if (dc !== t.tripDays) dayCount = dc;
        }
        return { id:t.id, name:tname||t.name, dests:destArr, start:newStart, end:newEnd, tripDays:dayCount, budget:parseInt(budget)||t.budget, spent:t.spent, status:status, accent:t.accent, flags:t.flags, grad:t.grad, photo:t.photo, days:t.days };
      });
    });
    setSaved(true);
    setTimeout(function() { setSaved(false); }, 1500);
  }
  return (
    <div className={CN3} style={{fontFamily:"Georgia,serif"}}>
      <div className={CN10}>
        <div className={CN8}>
 <button onClick={function() { go("timeline"); }} className={CN11}>Back</button>
          <div>
 <div className="text-xs text-orange-400 font-sans uppercase tracking-widest">{trip ? trip.name : ""}</div>
            <h1 className={CN13}>Trip Settings</h1>
          </div>
        </div>
      </div>
      <div className="px-4 py-4 space-y-4">
        <div className={CN1}>
          <p className={CN4}>Trip Details</p>
          <div>
            <label className={CN15}>Trip Name</label>
 <input type="text" value={tname} onChange={function(e) { setTname(e.target.value); }} className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-3 text-white font-sans text-sm focus:outline-none focus:border-orange-500/70" />
          </div>
          <div>
            <label className={CN15}>Destinations</label>
            <input type="text" value={dests} onChange={function(e) { setDests(e.target.value); }} placeholder="e.g. Dubai, Barcelona, Paris" className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-3 text-white font-sans text-sm focus:outline-none focus:border-orange-500/70 placeholder-slate-500" />
            <p className="text-slate-600 text-xs font-sans mt-1">Separate multiple destinations with commas</p>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className={CN15}>Start Date</label>
              <input type="date" value={tstart} onChange={function(e) { setTstart(e.target.value); }} style={{width:"100%",background:"rgba(30,41,59,0.8)",border:"1px solid rgba(71,85,105,0.6)",borderRadius:"12px",padding:"12px 16px",color:"white",fontSize:"14px",fontFamily:"sans-serif",outline:"none",colorScheme:"dark"}} />
            </div>
            <div className="flex-1">
              <label className={CN15}>End Date</label>
              <input type="date" value={tend} onChange={function(e) { setTend(e.target.value); }} style={{width:"100%",background:"rgba(30,41,59,0.8)",border:"1px solid rgba(71,85,105,0.6)",borderRadius:"12px",padding:"12px 16px",color:"white",fontSize:"14px",fontFamily:"sans-serif",outline:"none",colorScheme:"dark"}} />
            </div>
          </div>
          <div>
            <label className={CN15}>Budget (AUD)</label>
 <input type="number" value={budget} onChange={function(e) { setBudget(e.target.value); }} className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-3 text-white font-sans text-sm focus:outline-none focus:border-orange-500/70" />
          </div>
          <div>
            <label className={CN15}>Trip Status</label>
            <div className="flex gap-2">
              {["upcoming","planning","completed"].map(function(s) {
                var cls = status === s
 ? "flex-1 py-2.5 rounded-xl text-xs font-semibold font-sans bg-orange-500 text-white"
 : "flex-1 py-2.5 rounded-xl text-xs font-semibold font-sans bg-slate-800 text-slate-400 border border-slate-700";
                var si = s;
 return <button key={si} onClick={function() { setStatus(si); }} className={cls}>{si.charAt(0).toUpperCase() + si.slice(1)}</button>;
              })}
            </div>
          </div>
        </div>
        <button onClick={save}
          style={{
            width:"100%", padding:"18px", borderRadius:"16px",
            fontSize:"18px", fontWeight:"800", fontFamily:"sans-serif",
            border:"none", cursor:"pointer",
            background: saved ? "rgb(16,185,129)" : "linear-gradient(135deg, rgb(249,115,22), rgb(234,88,12))",
            color:"white",
            boxShadow: saved ? "0 4px 20px rgba(16,185,129,0.5)" : "0 6px 24px rgba(249,115,22,0.6)"
          }}>
          {saved ? "✓  Saved!" : "💾  Save Changes"}
        </button>
      </div>
      <div style={{height:"72px"}} /><BottomNav active="settings" go={go} />
    </div>
  );
}
function CostsScreen(props) {
  var go   = props.go;
  var trip = props.trip;
  var days = props.days;
 var SYM = {AUD:"A$",USD:"$",GBP:"£",EUR:"€",JPY:"¥",THB:"฿",SGD:"S$",NZD:"NZ$"};
 var AUD_RATES = {AUD:1,USD:1.52,EUR:1.65,GBP:1.93,JPY:0.0099,THB:0.044,SGD:1.13,NZD:0.92};
  var CAT_COLOR = TC;
  var catMap = {};
  var allEvents = [];
  for (var di = 0; di < days.length; di++) {
    for (var ei = 0; ei < days[di].events.length; ei++) {
      var ev = days[di].events[ei];
      allEvents.push({ ev: ev, day: days[di].label, date: days[di].date });
      var cat = ev.type || "Other";
      if (!catMap[cat]) catMap[cat] = { total: 0, count: 0, icon: ev.icon };
 catMap[cat].total += Math.round((parseFloat(ev.cost) || 0) * (AUD_RATES[ev.cur] || 1));
      catMap[cat].count += 1;
    }
  }
 var cats = Object.keys(catMap).sort(function(a, b) { return catMap[b].total - catMap[a].total; });
 var grandTotal = cats.reduce(function(s, c) { return s + catMap[c].total; }, 0);
  var budget = trip.budget || 0;
  var remaining = budget - grandTotal;
 var pct = budget > 0 ? Math.min(100, Math.round((grandTotal / budget) * 100)) : 0;
  return (
    <div className={CN3} style={{fontFamily:"Georgia,serif"}}>
      <div className={CN10}>
        <div className="flex items-center gap-3 mb-3">
 <button onClick={function() { go("timeline"); }} className={CN11}>Back</button>
          <div>
            <div className={CN12}>{trip.name}</div>
            <h1 className={CN13}>Costs Breakdown</h1>
          </div>
        </div>
        
 <div className="bg-slate-800/60 rounded-2xl border border-slate-700/50 p-4 space-y-3">
          <div className="flex justify-between font-sans text-sm">
 <div><p className="text-slate-400 text-xs uppercase tracking-wider mb-0.5">Total Spent</p><p className="text-white font-bold text-xl">A${grandTotal.toLocaleString()}</p></div>
 <div className="text-center"><p className="text-slate-400 text-xs uppercase tracking-wider mb-0.5">Remaining</p><p className={"font-bold text-xl " + (remaining < 0 ? "text-red-400" : "text-emerald-400")}>A${Math.abs(remaining).toLocaleString()}{remaining < 0 ? " over" : ""}</p></div>
 <div className="text-right"><p className="text-slate-400 text-xs uppercase tracking-wider mb-0.5">Budget</p><p className="text-slate-300 font-bold text-xl">A${budget.toLocaleString()}</p></div>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
 <div className={"h-full rounded-full " + (pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-amber-500" : "bg-gradient-to-r from-orange-500 to-amber-400")} style={{width: pct + "%"}} />
          </div>
 <p className="text-slate-500 text-xs font-sans text-center">{pct}% of budget used across {allEvents.length} events</p>
        </div>
      </div>
      <div className="px-4 py-4 space-y-3">
        
 <p className="text-white font-semibold font-sans text-sm">By Category</p>
        {cats.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">💰</div>
 <p className="text-slate-400 font-sans text-sm">No costs yet — add events with costs on the Timeline</p>
          </div>
        )}
        {cats.map(function(cat) {
          var info = catMap[cat];
 var catPct = grandTotal > 0 ? Math.round((info.total / grandTotal) * 100) : 0;
          var clr = CAT_COLOR[cat] || CAT_COLOR.Other;
          return (
            <div key={cat} className={CN2}>
              <div className="flex items-center justify-between mb-2">
                <div className={CN7}>
 <span className={"text-xs font-semibold px-2.5 py-1 rounded-full border font-sans " + clr}>{info.icon} {cat}</span>
 <span className={CN6}>{info.count} event{info.count !== 1 ? "s" : ""}</span>
                </div>
                <div className="text-right">
                  <p className={CN25}>A${info.total.toLocaleString()}</p>
                  <p className={CN6}>{catPct}%</p>
                </div>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
 <div className="h-full rounded-full bg-orange-500/70" style={{width: catPct + "%"}} />
              </div>
            </div>
          );
        })}
        
        {days.length > 0 && (
          <div className="space-y-2">
 <p className="text-white font-semibold font-sans text-sm pt-2">By Day</p>
            {days.map(function(day) {
 var dayTotal = day.events.reduce(function(s, ev) { return s + Math.round((parseFloat(ev.cost) || 0) * (AUD_RATES[ev.cur] || 1)); }, 0);
              if (dayTotal === 0 && day.events.length === 0) return null;
              return (
                <div key={day.id} className={CN2}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
 <span className="text-white font-semibold font-sans text-sm">{day.label}</span>
 <span className="text-slate-500 text-xs font-sans ml-2">{fmtShort(day.date)}</span>
                    </div>
                    <span className={CN25}>A${dayTotal.toLocaleString()}</span>
                  </div>
 {day.events.filter(function(ev) { return ev.cost > 0; }).map(function(ev) {
                    var sym = SYM[ev.cur] || ev.cur;
 var evAUD = Math.round((parseFloat(ev.cost) || 0) * (AUD_RATES[ev.cur] || 1));
                    return (
 <div key={ev.id} className="flex items-center justify-between py-1.5 border-t border-slate-800/40 first:border-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base shrink-0">{ev.icon}</span>
 <span className="text-slate-300 text-xs font-sans truncate">{ev.title}</span>
                        </div>
                        <div className="text-right shrink-0 ml-2">
 <p className={CN20}>{sym}{(parseFloat(ev.cost)||0).toLocaleString()} {ev.cur}</p>
 {ev.cur !== "AUD" && <p className={CN6}>A${evAUD.toLocaleString()}</p>}
                        </div>
                      </div>
                    );
                  })}
 {day.events.filter(function(ev) { return ev.cost > 0; }).length === 0 && (
 <p className="text-slate-600 text-xs font-sans italic">No costs</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {grandTotal > 0 && (
 <div className="bg-gradient-to-br from-orange-950/50 to-slate-900 rounded-2xl border border-orange-500/30 p-4 space-y-2">
 <p className="text-orange-300 font-semibold font-sans text-sm">Trip Total</p>
            <div className="flex justify-between font-sans">
 <span className="text-slate-400 text-sm">Total spent (AUD equiv.)</span>
 <span className="text-white font-bold text-lg">A${grandTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-sans">
              <span className="text-slate-400 text-sm">Budget</span>
 <span className="text-slate-300 text-sm">A${budget.toLocaleString()}</span>
            </div>
            <div className="h-px bg-slate-700 my-1" />
            <div className="flex justify-between font-sans">
 <span className={"text-sm font-semibold " + (remaining < 0 ? "text-red-400" : "text-emerald-400")}>{remaining < 0 ? "Over budget by" : "Remaining"}</span>
 <span className={"font-bold text-lg " + (remaining < 0 ? "text-red-400" : "text-emerald-400")}>A${Math.abs(remaining).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
      <div style={{height:"72px"}} /><BottomNav active="" go={go} />
    </div>
  );
}

function WishlistScreen(props) {
  var trip = props.trip;
  var setTrips = props.setTrips;
  var go = props.go;
  var items = trip.wishlist || [];

  var WISH_CATS = [
    {id:"restaurant",label:"Restaurant / Cafe",icon:"🍽️"},
    {id:"bar",label:"Bar / Club",icon:"🍸"},
    {id:"attraction",label:"Attraction / Tour",icon:"🎡"},
    {id:"sightseeing",label:"Sightseeing",icon:"🗺️"},
    {id:"activity",label:"Activity",icon:"🎭"},
    {id:"shopping",label:"Shopping",icon:"🛍️"},
    {id:"beach",label:"Beach",icon:"🏖️"},
    {id:"hotel",label:"Accommodation",icon:"🏨"},
    {id:"other",label:"Other",icon:"📌"},
  ];

  var stShowAdd = useState(false);
  var showAdd = stShowAdd[0]; var setShowAdd = stShowAdd[1];
  var stName = useState("");
  var name = stName[0]; var setName = stName[1];
  var stCat = useState("restaurant");
  var cat = stCat[0]; var setCat = stCat[1];
  var stNotes = useState("");
  var notes = stNotes[0]; var setNotes = stNotes[1];
  var stAddr = useState("");
  var addr = stAddr[0]; var setAddr = stAddr[1];
  var stFilter = useState("all");
  var filter = stFilter[0]; var setFilter = stFilter[1];

  function save() {
    if (!name.trim()) return;
    var item = {id: Date.now(), name: name.trim(), cat: cat, notes: notes.trim(), addr: addr.trim(), done: false};
    setTrips(function(prev) {
      return prev.map(function(t) {
        if (t.id !== trip.id) return t;
        return Object.assign({}, t, {wishlist: (t.wishlist || []).concat([item])});
      });
    });
    setName(""); setNotes(""); setAddr(""); setShowAdd(false);
  }

  function toggle(id) {
    setTrips(function(prev) {
      return prev.map(function(t) {
        if (t.id !== trip.id) return t;
        return Object.assign({}, t, {wishlist: (t.wishlist || []).map(function(w) {
          return w.id === id ? Object.assign({}, w, {done: !w.done}) : w;
        })});
      });
    });
  }

  function remove(id) {
    setTrips(function(prev) {
      return prev.map(function(t) {
        if (t.id !== trip.id) return t;
        return Object.assign({}, t, {wishlist: (t.wishlist || []).filter(function(w) { return w.id !== id; })});
      });
    });
  }

  var catMap = {};
  WISH_CATS.forEach(function(c) { catMap[c.id] = c; });

  var filtered = filter === "all" ? items : filter === "done" ? items.filter(function(w) { return w.done; }) : items.filter(function(w) { return w.cat === filter && !w.done; });

  return (
    <div style={{minHeight:"100vh",background:"rgb(15,23,42)",color:"white",display:"flex",flexDirection:"column"}}>
      <div style={{background:"linear-gradient(to bottom, rgb(15,23,42), rgb(2,6,23))",padding:"48px 20px 16px",borderBottom:"1px solid rgba(30,41,59,0.8)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"4px"}}>
          <button onClick={function() { go("timeline"); }} style={{background:"rgba(30,41,59,0.8)",border:"1px solid rgba(71,85,105,0.6)",borderRadius:"12px",padding:"8px 16px",color:"rgb(148,163,184)",fontSize:"14px",fontFamily:"sans-serif",cursor:"pointer"}}>Back</button>
          <button onClick={function() { setShowAdd(true); }} style={{background:"rgb(249,115,22)",border:"none",borderRadius:"12px",padding:"8px 16px",color:"white",fontSize:"14px",fontFamily:"sans-serif",cursor:"pointer",fontWeight:"bold"}}>+ Add</button>
        </div>
        <div style={{marginTop:"8px"}}>
          <p style={{color:"rgb(249,115,22)",fontSize:"12px",fontFamily:"sans-serif",textTransform:"uppercase",letterSpacing:"0.1em",margin:"0 0 2px"}}>{trip.name}</p>
          <h1 style={{color:"white",fontSize:"22px",fontFamily:"Georgia,serif",fontWeight:"bold",margin:0}}>Wish List</h1>
          <p style={{color:"rgb(100,116,139)",fontSize:"12px",fontFamily:"sans-serif",margin:"4px 0 0"}}>{items.filter(function(w){return !w.done;}).length} to do &bull; {items.filter(function(w){return w.done;}).length} done</p>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 20px 100px"}}>
        
        <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"16px"}}>
          {[{id:"all",label:"All",icon:"✨"}].concat(WISH_CATS).concat([{id:"done",label:"Done",icon:"✅"}]).map(function(c) {
            var isActive = filter === c.id;
            return (
              <button key={c.id} onClick={function() { setFilter(c.id); }}
                style={{fontSize:"12px",padding:"6px 12px",borderRadius:"9999px",border:"1px solid",fontFamily:"sans-serif",cursor:"pointer",
                  background:isActive?"rgb(249,115,22)":"rgba(30,41,59,0.8)",
                  borderColor:isActive?"rgb(234,88,12)":"rgba(71,85,105,0.5)",
                  color:isActive?"white":"rgb(148,163,184)"}}>
                {c.icon} {c.label}
              </button>
            );
          })}
        </div>
        
        {showAdd && (
          <div style={{background:"rgba(30,41,59,0.9)",border:"1px solid rgba(71,85,105,0.5)",borderRadius:"16px",padding:"16px",marginBottom:"16px"}}>
            <p style={{color:"white",fontFamily:"sans-serif",fontWeight:"bold",fontSize:"14px",margin:"0 0 12px"}}>Add to Wish List</p>
            <input value={name} onChange={function(e) { setName(e.target.value); }} placeholder="Place or activity name *"
              style={{width:"100%",background:"rgba(15,23,42,0.8)",border:"1px solid rgba(71,85,105,0.6)",borderRadius:"10px",padding:"10px 12px",color:"white",fontSize:"13px",fontFamily:"sans-serif",boxSizing:"border-box",marginBottom:"8px",outline:"none"}} />
            <select value={cat} onChange={function(e) { setCat(e.target.value); }}
              style={{width:"100%",background:"rgba(15,23,42,0.8)",border:"1px solid rgba(71,85,105,0.6)",borderRadius:"10px",padding:"10px 12px",color:"white",fontSize:"13px",fontFamily:"sans-serif",boxSizing:"border-box",marginBottom:"8px",outline:"none"}}>
              {WISH_CATS.map(function(c) { return <option key={c.id} value={c.id}>{c.icon} {c.label}</option>; })}
            </select>
            <input value={addr} onChange={function(e) { setAddr(e.target.value); }} placeholder="Address or area (optional)"
              style={{width:"100%",background:"rgba(15,23,42,0.8)",border:"1px solid rgba(71,85,105,0.6)",borderRadius:"10px",padding:"10px 12px",color:"white",fontSize:"13px",fontFamily:"sans-serif",boxSizing:"border-box",marginBottom:"8px",outline:"none"}} />
            <textarea value={notes} onChange={function(e) { setNotes(e.target.value); }} placeholder="Notes, opening hours, why you want to go..."
              rows={2} style={{width:"100%",background:"rgba(15,23,42,0.8)",border:"1px solid rgba(71,85,105,0.6)",borderRadius:"10px",padding:"10px 12px",color:"white",fontSize:"13px",fontFamily:"sans-serif",boxSizing:"border-box",marginBottom:"12px",outline:"none",resize:"none"}} />
            <div style={{display:"flex",gap:"8px"}}>
              <button onClick={function() { setShowAdd(false); setName(""); setNotes(""); setAddr(""); }}
                style={{flex:1,padding:"10px",background:"transparent",border:"1px solid rgba(71,85,105,0.5)",borderRadius:"10px",color:"rgb(148,163,184)",fontSize:"13px",fontFamily:"sans-serif",cursor:"pointer"}}>Cancel</button>
              <button onClick={save} disabled={!name.trim()}
                style={{flex:2,padding:"10px",background:"rgb(249,115,22)",border:"none",borderRadius:"10px",color:"white",fontSize:"13px",fontFamily:"sans-serif",cursor:"pointer",fontWeight:"bold",opacity:name.trim()?1:0.5}}>Save</button>
            </div>
          </div>
        )}
        
        {filtered.length === 0 && (
          <div style={{textAlign:"center",padding:"48px 0",color:"rgb(71,85,105)"}}>
            <div style={{fontSize:"48px",marginBottom:"12px"}}>✨</div>
            <p style={{fontFamily:"sans-serif",fontSize:"14px"}}>Nothing here yet</p>
            <p style={{fontFamily:"sans-serif",fontSize:"12px",marginTop:"4px"}}>Tap + Add to start your wish list</p>
          </div>
        )}
        {filtered.map(function(w) {
          var c = catMap[w.cat] || {icon:"📌",label:"Other"};
          return (
            <div key={w.id} style={{background:w.done?"rgba(16,185,129,0.05)":"rgba(30,41,59,0.6)",border:"1px solid",borderColor:w.done?"rgba(16,185,129,0.2)":"rgba(71,85,105,0.4)",borderRadius:"14px",padding:"14px",marginBottom:"10px",opacity:w.done?0.7:1}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:"12px"}}>
                <button onClick={function() { toggle(w.id); }}
                  style={{width:"22px",height:"22px",borderRadius:"50%",border:"2px solid",borderColor:w.done?"rgb(16,185,129)":"rgba(71,85,105,0.6)",background:w.done?"rgb(16,185,129)":"transparent",cursor:"pointer",flexShrink:0,marginTop:"1px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px"}}>
                  {w.done ? "✓" : ""}
                </button>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"4px"}}>
                    <span style={{fontSize:"14px"}}>{c.icon}</span>
                    <span style={{color:w.done?"rgb(16,185,129)":"white",fontFamily:"sans-serif",fontWeight:"600",fontSize:"14px",textDecoration:w.done?"line-through":"none"}}>{w.name}</span>
                    <span style={{fontSize:"10px",color:"rgb(100,116,139)",fontFamily:"sans-serif",background:"rgba(71,85,105,0.3)",padding:"1px 6px",borderRadius:"9999px"}}>{c.label}</span>
                  </div>
                  {w.addr && (
                    <button onClick={function() { window.open("https://www.google.com/maps/search/" + encodeURIComponent(w.addr), "_blank"); }}
                      style={{background:"none",border:"none",padding:0,cursor:"pointer",textAlign:"left"}}>
                      <span style={{fontSize:"11px",color:"rgb(96,165,250)",fontFamily:"sans-serif"}}>📍 {w.addr}</span>
                    </button>
                  )}
                  {w.notes && <p style={{color:"rgb(148,163,184)",fontFamily:"sans-serif",fontSize:"12px",margin:"4px 0 0"}}>{w.notes}</p>}
                </div>
                <button onClick={function() { remove(w.id); }}
                  style={{background:"none",border:"none",cursor:"pointer",color:"rgb(71,85,105)",fontSize:"16px",padding:"2px"}}>×</button>
              </div>
            </div>
          );
        })}
      </div>
      <BottomNav active="wishlist" go={go} />
    </div>
  );
}

export default function MannieTravelsApp() {
  var stScreen = useState("dashboard");
  var screen = stScreen[0]; var setScreen = stScreen[1];
  var stTripId = useState(null);
  var activeTripId = stTripId[0]; var setActiveTripId = stTripId[1];
  var stTrips = useState(TRIPS0);
  var trips = stTrips[0]; var setTrips = stTrips[1];
  useEffect(function() {
    try { localStorage.setItem("mannie_trips", JSON.stringify(trips)); } catch(e) {}
  }, [trips]);
  var stDayIdx = useState(0);
  var addDayIdx = stDayIdx[0]; var setAddDayIdx = stDayIdx[1];
  var stActiveDay = useState(0);
  var activeDay = stActiveDay[0]; var setActiveDay = stActiveDay[1];
  var stSelDay = useState(0);
  var selDay = stSelDay[0]; var setSelDay = stSelDay[1];
  var stEditEv = useState(null);
  var editEv = stEditEv[0]; var setEditEv = stEditEv[1];
  var trip = null;
  for (var ti = 0; ti < trips.length; ti++) {
    if (trips[ti].id === activeTripId) { trip = trips[ti]; break; }
  }
  var days = trip ? (trip.days || []) : [];
  function setDays(updater) {
    if (!trip) return;
    setTrips(function(prev) {
      return prev.map(function(t) {
        if (t.id !== activeTripId) return t;
 var newDays = typeof updater === "function" ? updater(t.days || []) : updater;
        var total = 0;
        for (var di = 0; di < newDays.length; di++) {
          for (var ei = 0; ei < newDays[di].events.length; ei++) {
 total += toAUD(newDays[di].events[ei].cost, newDays[di].events[ei].cur);
          }
        }
 return { id:t.id, name:t.name, dests:t.dests, start:t.start, end:t.end, tripDays:t.tripDays, budget:t.budget, spent:total, status:t.status, accent:t.accent, flags:t.flags, grad:t.grad, photo:t.photo, days:newDays };
      });
    });
  }
  function saveEvent(dayIdx, event, isEdit) {
    setDays(function(prev) {
      if (isEdit) {
        // Find which day currently has this event
        var originalDayIdx = -1;
        for (var di = 0; di < prev.length; di++) {
          for (var ei = 0; ei < prev[di].events.length; ei++) {
            if (prev[di].events[ei].id === event.id) { originalDayIdx = di; break; }
          }
          if (originalDayIdx !== -1) break;
        }
        // Remove from original day, add/update on new day
        return prev.map(function(d, i) {
          if (i === originalDayIdx && i !== dayIdx) {
            // Remove from original day
            return { id:d.id, label:d.label, date:d.date, events: d.events.filter(function(e) { return e.id !== event.id; }) };
          }
          if (i === dayIdx && i !== originalDayIdx) {
            // Add to new day
            return { id:d.id, label:d.label, date:d.date, events: d.events.concat([event]) };
          }
          if (i === dayIdx && i === originalDayIdx) {
            // Same day - just update
            return { id:d.id, label:d.label, date:d.date, events: d.events.map(function(e) { return e.id === event.id ? event : e; }) };
          }
          return d;
        });
      }
      // New event - just add to the selected day
      return prev.map(function(d, i) {
        if (i !== dayIdx) return d;
        return { id:d.id, label:d.label, date:d.date, events: d.events.concat([event]) };
      });
    });
  }
  function addEvent(dayIdx) {
    setAddDayIdx(dayIdx);
    setActiveDay(dayIdx);
    setSelDay(dayIdx);
    setEditEv(null);
    setScreen("addEvent");
  }
  function editEvent(dayIdx, ev) {
    setAddDayIdx(dayIdx);
    setActiveDay(dayIdx);
    setSelDay(dayIdx);
    setEditEv(ev);
    setScreen("addEvent");
  }
  function go(s, dayIdx) {
    if (s !== "addEvent") setEditEv(null);
    if (s === "timeline" && dayIdx !== undefined) setActiveDay(dayIdx);
    setScreen(s);
  }
  function addTrip(t) {
    var newDays = makeDays(t.start, t.tripDays || 7, {});
 var fullTrip = { id:t.id, name:t.name, dests:t.dests, start:t.start, end:t.end, tripDays:t.tripDays||7, budget:t.budget, spent:0, status:t.status, accent:t.accent, flags:t.flags, grad:t.grad, photo:null, days:newDays };
    setTrips(function(prev) { return [fullTrip].concat(prev); });
    setActiveTripId(t.id);
  }
 var dashEl = <DashboardScreen go={go} setActiveTripId={setActiveTripId} trips={trips} setTrips={setTrips} addTrip={addTrip} />;
  if (screen === "dashboard" || !trip) return dashEl;
 if (screen === "timeline")  return <TimelineScreen  go={go} trip={trip} days={days} setDays={setDays} onEdit={editEvent} onAdd={addEvent} activeDay={activeDay} setActiveDay={setActiveDay} />;
 if (screen === "addEvent")  return <AddEditScreen   go={go} tripName={trip.name} dayIndex={addDayIdx} days={days} onSave={saveEvent} editEv={editEv} selDay={selDay} setSelDay={setSelDay} />;
 if (screen === "glance")    return <GlanceScreen    go={go} trip={trip} days={days} setActiveDay={setActiveDay} />;
 if (screen === "settings")  return <SettingsScreen  go={go} trip={trip} trips={trips} setTrips={setTrips} activeTripId={activeTripId} />;
 if (screen === "costs")     return <CostsScreen     go={go} trip={trip} days={days} />;
 if (screen === "wishlist")  return <WishlistScreen  go={go} trip={trip} setTrips={setTrips} />;
  return dashEl;
}