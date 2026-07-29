const GAME_DATA = {
  version:"0.6.0",
  energyRegenMs:1000,
  inventoryLimit:30,
  gmInventoryLimit:250,

  rarities:{
    common:{name:"Zwykły",color:"#d0d0d0",multiplier:1,sellMultiplier:1,rank:1},
    rare:{name:"Rzadki",color:"#4ea3ff",multiplier:1.3,sellMultiplier:1.5,rank:2},
    epic:{name:"Epicki",color:"#b96cff",multiplier:1.7,sellMultiplier:2.2,rank:3},
    legendary:{name:"Legendarny",color:"#ffb400",multiplier:2.5,sellMultiplier:4,rank:4}
  },

  regions:[
    {id:"outskirts",name:"Obrzeża Vallis",description:"Psy, rabusie i pierwsi łowcy okazji.",unlockLevel:1},
    {id:"forest",name:"Las Cieni",description:"Wilki i bestie kryjące się pod pradawnymi drzewami.",unlockLevel:2},
    {id:"ruins",name:"Ruiny Świątyni",description:"Dezerterzy, kultystki i kamienne strażniki.",unlockLevel:4},
    {id:"mine",name:"Stara Kopalnia",description:"Miejsce przyszłych ekspedycji i rzadkich rud.",unlockLevel:6}
  ],

  enemies:[
    {id:"dog",image:"assets/monsters/dog.webp",region:"outskirts",name:"Bezpański pies",hp:28,attack:5,xp:12,gold:[4,8],danger:"Niski",boss:false,drops:[
      {name:"Skórzany Pas",slot:null,type:"Trofeum",chance:.22,power:[1,2]},
      {name:"Drewniana Tarcza",slot:"shield",type:"Tarcza",chance:.08,power:[1,2]}
    ]},
    {id:"bandit",image:"assets/monsters/bandit.webp",region:"outskirts",name:"Leśny rabuś",hp:46,attack:8,xp:20,gold:[8,15],danger:"Średni",boss:false,drops:[
      {name:"Nóż Rabusia",slot:"weapon",type:"Broń",chance:.20,power:[2,4]},
      {name:"Skórzany Kaftan",slot:"armor",type:"Pancerz",chance:.12,power:[2,4]}
    ]},
    {id:"wolf",image:"assets/monsters/wolf.webp",region:"forest",name:"Wilk z Lasu Cieni",hp:65,attack:11,xp:32,gold:[12,22],danger:"Wysoki",boss:false,drops:[
      {name:"Kieł Wilka",slot:null,type:"Trofeum",chance:.30,power:[2,5]},
      {name:"Skórzany Hełm",slot:"helmet",type:"Hełm",chance:.14,power:[2,4]}
    ]},
    {id:"fenrir",image:"assets/monsters/fenrir.webp",region:"forest",name:"Fenrir — Alfa Lasu Cieni",hp:160,attack:20,xp:110,gold:[55,90],danger:"Boss",boss:true,drops:[
      {name:"Kieł Fenrira",slot:"weapon",type:"Broń",chance:1,power:[8,11],forcedRarity:"rare"},
      {name:"Wilcza Skóra",slot:"armor",type:"Pancerz",chance:.35,power:[6,9]}
    ]},
    {id:"deserter",image:"assets/monsters/deserter.webp",region:"ruins",name:"Weteran dezerter",hp:88,attack:14,xp:48,gold:[20,35],danger:"Bardzo wysoki",boss:false,drops:[
      {name:"Żelazny Gladius",slot:"weapon",type:"Broń",chance:.22,power:[4,7]},
      {name:"Pancerz Dezertera",slot:"armor",type:"Pancerz",chance:.15,power:[4,7]},
      {name:"Hełm Legionisty",slot:"helmet",type:"Hełm",chance:.12,power:[3,6]},
      {name:"Pęknięta Tarcza Legionisty",slot:"shield",type:"Tarcza",chance:.18,power:[3,6]}
    ]}
  ],

  quests:[
    {id:"dogs",name:"Zęby Vallis",description:"Pokonaj 5 bezpańskich psów.",type:"kill",target:"dog",required:5,reward:{xp:60,gold:80}},
    {id:"belt",name:"Dowód rabunku",description:"Zdobądź Skórzany Pas.",type:"item",target:"Skórzany Pas",required:1,reward:{xp:75,gold:100,item:{name:"Miecz Varro",slot:"weapon",type:"Broń",power:[6,6],forcedRarity:"rare"}}},
    {id:"wealth",name:"Pierwszy majątek",description:"Zgromadź 300 złota.",type:"gold",target:null,required:300,reward:{xp:100,gold:50}},
    {id:"fenrirQuest",name:"Alfa Lasu",description:"Pokonaj Fenrira.",type:"kill",target:"fenrir",required:1,reward:{xp:250,gold:250,item:{name:"Amulet Alfy",slot:null,type:"Relikt",power:[10,10],forcedRarity:"epic"}}}
  ],

  shop:[
    {id:"smallHeal",name:"Mała mikstura leczenia",kind:"consumable",effect:"heal",amount:35,price:35,description:"+35 punktów życia"},
    {id:"energyDrink",name:"Napój gladiatora",kind:"consumable",effect:"energy",amount:4,price:60,description:"+4 Wytrzymałości"},
    {id:"ragePotion",name:"Eliksir furii",kind:"consumable",effect:"damageBuff",amount:25,durationMs:600000,price:120,description:"+25% obrażeń przez 10 minut"}
  ],


  gmCatalog:[
    {name:"Gladius Rekruta",slot:"weapon",type:"Broń",power:8,rarity:"common"},
    {name:"Gladius Legionisty",slot:"weapon",type:"Broń",power:18,rarity:"rare"},
    {name:"Ostrze Centuriona",slot:"weapon",type:"Broń",power:34,rarity:"epic"},
    {name:"Miecz Cesarza",slot:"weapon",type:"Broń",power:60,rarity:"legendary"},
    {name:"Skórzany Kaftan",slot:"armor",type:"Pancerz",power:7,rarity:"common"},
    {name:"Pancerz Legionisty",slot:"armor",type:"Pancerz",power:17,rarity:"rare"},
    {name:"Zbroja Pretorianina",slot:"armor",type:"Pancerz",power:32,rarity:"epic"},
    {name:"Pancerz Marsa",slot:"armor",type:"Pancerz",power:58,rarity:"legendary"},
    {name:"Hełm Rekruta",slot:"helmet",type:"Hełm",power:6,rarity:"common"},
    {name:"Hełm Centuriona",slot:"helmet",type:"Hełm",power:15,rarity:"rare"},
    {name:"Hełm Areny",slot:"helmet",type:"Hełm",power:29,rarity:"epic"},
    {name:"Korona Wojny",slot:"helmet",type:"Hełm",power:52,rarity:"legendary"},
    {name:"Drewniana Tarcza",slot:"shield",type:"Tarcza",power:5,rarity:"common"},
    {name:"Tarcza Legionu",slot:"shield",type:"Tarcza",power:14,rarity:"rare"},
    {name:"Egida Vallis",slot:"shield",type:"Tarcza",power:28,rarity:"epic"},
    {name:"Mur Tytanów",slot:"shield",type:"Tarcza",power:50,rarity:"legendary"},
    {name:"Mikstura pełnego leczenia",kind:"consumable",effect:"heal",amount:9999,rarity:"rare"},
    {name:"Napój nieskończonej wytrzymałości",kind:"consumable",effect:"energy",amount:999,rarity:"epic"},
    {name:"Eliksir mocy Game Mastera",kind:"consumable",effect:"damageBuff",amount:100,durationMs:3600000,rarity:"legendary"},
    {name:"Kieł Fenrira",slot:"weapon",type:"Broń",power:40,rarity:"epic"},
    {name:"Amulet Alfy",slot:null,type:"Relikt",power:25,rarity:"epic"},
    {name:"Pieczęć Game Mastera",slot:null,type:"Relikt",power:100,rarity:"legendary"}
  ],

  dialogues:{
    marcus:{image:"assets/npcs/marcus_varro.webp",role:"MENTOR",name:"Marcus Varro",text:"Siła bez dyscypliny jest tylko hałasem. Wykonuj moje zadania, a nauczę cię przeżyć na arenie."},
    lydia:{image:"assets/npcs/lydia.webp",role:"KUPIEC",name:"Lydia",text:"Złoto nie ma zapachu, ale strach pachnie z daleka. Kup mikstury, zanim poczujesz go na sobie."},
    brenn:{image:"assets/npcs/brenn.webp",role:"KOWAL",name:"Brenn",text:"Przynieś mi złoto i zniszczoną stal. Z jednego zrobię mniej, z drugiego więcej."}
  },

  statLabels:{strength:"Siła",endurance:"Wytrzymałość",dexterity:"Zręczność",cunning:"Spryt",luck:"Szczęście"},
  equipmentLabels:{weapon:"Broń",armor:"Pancerz",helmet:"Hełm",shield:"Tarcza"}
};
