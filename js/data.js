const GAME_DATA = {
  version:"0.10.0",
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
    {id:"mine",name:"Stara Kopalnia",description:"Zawalane tunele pełne dezerterów, bestii i rzadkich rud.",unlockLevel:6},
    {id:"catacombs",name:"Katakumby Vallis",description:"Nieumarli strzegą zapieczętowanych grobowców.",unlockLevel:8},
    {id:"banditCamp",name:"Obóz Czerwonych Szakali",description:"Ufortyfikowany obóz rabusiów i najemników.",unlockLevel:10},
    {id:"swamp",name:"Czarne Bagna",description:"Trujące opary, wiedźmy i bestie z mokradeł.",unlockLevel:12},
    {id:"iceCave",name:"Lodowa Jaskinia",description:"Zamarznięte tunele na północy, gdzie budzą się pradawne potwory.",unlockLevel:15}
  ],

  enemies:[
    {id:"dog",image:"assets/monster-icons/dog.webp",region:"outskirts",name:"Bezpański pies",type:"Bestia",description:"Wygłodniały pies żyjący na obrzeżach Vallis.",hp:28,attack:5,xp:12,gold:[4,8],danger:"Niski",boss:false,drops:[
      {name:"Skórzany Pas",slot:null,type:"Trofeum",chance:.22,power:[1,2]},
      {name:"Drewniana Tarcza",slot:"shield",type:"Tarcza",chance:.08,power:[1,2]}
    ]},
    {id:"bandit",image:"assets/monster-icons/bandit.webp",region:"outskirts",name:"Leśny rabuś",type:"Humanoid",description:"Rabuś polujący na samotnych podróżnych.",hp:46,attack:8,xp:20,gold:[8,15],danger:"Średni",boss:false,drops:[
      {name:"Nóż Rabusia",slot:"weapon",type:"Broń",chance:.20,power:[2,4]},
      {name:"Skórzany Kaftan",slot:"armor",type:"Pancerz",chance:.12,power:[2,4]}
    ]},
    {id:"wolf",image:"assets/monster-icons/wolf.webp",region:"forest",name:"Wilk z Lasu Cieni",type:"Bestia",description:"Drapieżnik z mrocznych ostępów Lasu Cieni.",hp:65,attack:11,xp:32,gold:[12,22],danger:"Wysoki",boss:false,drops:[
      {name:"Kieł Wilka",slot:null,type:"Trofeum",chance:.30,power:[2,5]},
      {name:"Skórzany Hełm",slot:"helmet",type:"Hełm",chance:.14,power:[2,4]}
    ]},
    {id:"fenrir",image:"assets/monster-icons/fenrir.webp",region:"forest",name:"Fenrir — Alfa Lasu Cieni",type:"Boss · Bestia",description:"Olbrzymi alfa, którego wycie paraliżuje karawany.",hp:160,attack:20,xp:110,gold:[55,90],danger:"Boss",boss:true,drops:[
      {name:"Kieł Fenrira",slot:"weapon",type:"Broń",chance:1,power:[8,11],forcedRarity:"rare"},
      {name:"Wilcza Skóra",slot:"armor",type:"Pancerz",chance:.35,power:[6,9]}
    ]},
    {id:"deserter",image:"assets/monster-icons/deserter.webp",region:"ruins",name:"Weteran dezerter",type:"Humanoid",description:"Doświadczony żołnierz, który porzucił legion.",hp:88,attack:14,xp:48,gold:[20,35],danger:"Bardzo wysoki",boss:false,drops:[
      {name:"Żelazny Gladius",slot:"weapon",type:"Broń",chance:.22,power:[4,7]},
      {name:"Pancerz Dezertera",slot:"armor",type:"Pancerz",chance:.15,power:[4,7]},
      {name:"Hełm Legionisty",slot:"helmet",type:"Hełm",chance:.12,power:[3,6]},
      {name:"Pęknięta Tarcza Legionisty",slot:"shield",type:"Tarcza",chance:.18,power:[3,6]}
    ]},

    {id:"mineRaider",image:"assets/monster-icons/mineRaider.webp",region:"mine",name:"Rabuś z Kopalni",type:"Humanoid",description:"Rabuś kradnący rudę i narzędzia z kopalni.",hp:105,attack:16,xp:62,gold:[26,42],danger:"Wysoki",boss:false,drops:[
      {name:"Kilof Rabusia",slot:"weapon",type:"Broń",chance:.18,power:[5,8]},
      {name:"Bryła Żelaza",slot:null,type:"Materiał",chance:.38,power:[2,4]},
      {name:"Skórzany Pancerz Górnika",slot:"armor",type:"Pancerz",chance:.12,power:[5,8]}
    ]},
    {id:"caveBeast",image:"assets/monster-icons/caveBeast.webp",region:"mine",name:"Bestia z Głębin",type:"Bestia",description:"Ślepy drapieżnik przystosowany do życia pod ziemią.",hp:128,attack:19,xp:78,gold:[32,50],danger:"Bardzo wysoki",boss:false,drops:[
      {name:"Pazur Bestii",slot:null,type:"Materiał",chance:.35,power:[4,7]},
      {name:"Hełm Górnika",slot:"helmet",type:"Hełm",chance:.15,power:[6,9]},
      {name:"Tarcza z Czarnego Żelaza",slot:"shield",type:"Tarcza",chance:.09,power:[7,10]}
    ]},
    {id:"fallenForeman",image:"assets/monster-icons/fallenForeman.webp",region:"mine",name:"Upadły Sztygar",type:"Humanoid",description:"Dawny sztygar, dziś władca zawalonych tuneli.",hp:155,attack:22,xp:95,gold:[42,65],danger:"Ekstremalny",boss:false,drops:[
      {name:"Młot Sztygara",slot:"weapon",type:"Broń",chance:.20,power:[8,11]},
      {name:"Pancerz Sztygara",slot:"armor",type:"Pancerz",chance:.13,power:[8,11]},
      {name:"Ruda Srebra",slot:null,type:"Materiał",chance:.30,power:[5,8]}
    ]},
    {id:"stoneGuardian",image:"assets/monster-icons/stoneGuardian.webp",region:"mine",name:"Kamienny Strażnik Kopalni",type:"Boss · Konstrukty",description:"Kamienny strażnik chroniący Serce Góry.",hp:260,attack:28,xp:180,gold:[90,140],danger:"Boss",boss:true,drops:[
      {name:"Młot Kamiennego Strażnika",slot:"weapon",type:"Broń",chance:1,power:[13,17],forcedRarity:"epic"},
      {name:"Pancerz z Czarnego Żelaza",slot:"armor",type:"Pancerz",chance:.35,power:[11,15],forcedRarity:"rare"},
      {name:"Serce Góry",slot:null,type:"Relikt",chance:.22,power:[12,16],forcedRarity:"epic"}
    ]},
    {id:"skeleton",image:"assets/monster-icons/skeleton.webp",region:"catacombs",name:"Szkielet Legionisty",type:"Nieumarły",description:"Kości dawnego legionisty poruszane klątwą.",hp:175,attack:24,xp:110,gold:[48,72],danger:"Wysoki",boss:false,drops:[
      {name:"Kościany Gladius",slot:"weapon",type:"Broń",chance:.18,power:[9,12]},
      {name:"Starożytna Kość",slot:null,type:"Materiał",chance:.42,power:[4,7]}
    ]},
    {id:"cryptSpider",image:"assets/monster-icons/cryptSpider.webp",region:"catacombs",name:"Pająk Grobowy",type:"Bestia",description:"Ogromny pająk żywiący się szczątkami z katakumb.",hp:190,attack:26,xp:125,gold:[55,80],danger:"Bardzo wysoki",boss:false,drops:[
      {name:"Jad Grobowy",slot:null,type:"Materiał",chance:.38,power:[6,9]},
      {name:"Pancerz z Chityny",slot:"armor",type:"Pancerz",chance:.14,power:[9,13]}
    ]},
    {id:"graveWarden",image:"assets/monster-icons/graveWarden.webp",region:"catacombs",name:"Strażnik Grobowca",type:"Konstrukt",description:"Kamienna figura obudzona przez profanację grobowców.",hp:230,attack:29,xp:150,gold:[68,98],danger:"Ekstremalny",boss:false,drops:[
      {name:"Tarcza Strażnika Grobowca",slot:"shield",type:"Tarcza",chance:.16,power:[11,15]},
      {name:"Odłamek Runicznego Kamienia",slot:null,type:"Materiał",chance:.35,power:[7,10]}
    ]},
    {id:"lich",image:"assets/monster-icons/lich.webp",region:"catacombs",name:"Lich Katakumb",type:"Boss · Nieumarły",description:"Kapłan, który poświęcił życie, aby strzec królewskiej krypty.",hp:360,attack:35,xp:260,gold:[140,210],danger:"Boss",boss:true,drops:[
      {name:"Berło Licha",slot:"weapon",type:"Broń",chance:1,power:[16,21],forcedRarity:"epic"},
      {name:"Amulet Wiecznego Grobu",slot:null,type:"Relikt",chance:.30,power:[15,20],forcedRarity:"epic"}
    ]},
    {id:"campScout",image:"assets/monster-icons/campScout.webp",region:"banditCamp",name:"Zwiadowca Szakali",type:"Humanoid",description:"Szybki zwiadowca pilnujący dróg do obozu.",hp:215,attack:29,xp:145,gold:[65,95],danger:"Wysoki",boss:false,drops:[
      {name:"Krótki Łuk Szakali",slot:"weapon",type:"Broń",chance:.16,power:[11,15]},
      {name:"Czerwona Chusta",slot:null,type:"Trofeum",chance:.40,power:[5,8]}
    ]},
    {id:"campBrute",image:"assets/monster-icons/campBrute.webp",region:"banditCamp",name:"Łamacz Kości",type:"Humanoid",description:"Ciężkozbrojny zbir wykonujący wyroki herszta.",hp:285,attack:34,xp:180,gold:[80,115],danger:"Bardzo wysoki",boss:false,drops:[
      {name:"Topór Łamacza",slot:"weapon",type:"Broń",chance:.18,power:[13,17]},
      {name:"Ciężki Kaftan",slot:"armor",type:"Pancerz",chance:.14,power:[12,16]}
    ]},
    {id:"campArcher",image:"assets/monster-icons/campArcher.webp",region:"banditCamp",name:"Łuczniczka Szakali",type:"Humanoid",description:"Najlepsza strzelczyni w obozie Czerwonych Szakali.",hp:235,attack:36,xp:190,gold:[88,122],danger:"Ekstremalny",boss:false,drops:[
      {name:"Pierścień Sokolego Oka",slot:null,type:"Relikt",chance:.18,power:[11,15]},
      {name:"Skórzany Pancerz Zwiadowcy",slot:"armor",type:"Pancerz",chance:.13,power:[12,17]}
    ]},
    {id:"banditChief",image:"assets/monster-icons/banditChief.webp",region:"banditCamp",name:"Herszt Czerwonych Szakali",type:"Boss · Humanoid",description:"Bezwzględny dowódca bandytów, były oficer legionu.",hp:440,attack:42,xp:330,gold:[190,270],danger:"Boss",boss:true,drops:[
      {name:"Szabla Herszta",slot:"weapon",type:"Broń",chance:1,power:[20,25],forcedRarity:"epic"},
      {name:"Płaszcz Czerwonego Szakala",slot:"armor",type:"Pancerz",chance:.30,power:[18,23],forcedRarity:"epic"}
    ]},
    {id:"swampCrawler",image:"assets/monster-icons/swampCrawler.webp",region:"swamp",name:"Pełzacz Bagienny",type:"Bestia",description:"Oślizgła bestia wynurzająca się z czarnej wody.",hp:270,attack:35,xp:195,gold:[90,125],danger:"Wysoki",boss:false,drops:[
      {name:"Łuska Pełzacza",slot:null,type:"Materiał",chance:.42,power:[8,12]},
      {name:"Tarcza z Bagiennej Skóry",slot:"shield",type:"Tarcza",chance:.13,power:[14,18]}
    ]},
    {id:"bogWitch",image:"assets/monster-icons/bogWitch.webp",region:"swamp",name:"Wiedźma z Mokradeł",type:"Humanoid",description:"Alchemiczka używająca trucizn i zakazanych rytuałów.",hp:255,attack:40,xp:215,gold:[105,145],danger:"Bardzo wysoki",boss:false,drops:[
      {name:"Fiolka Czarnej Trucizny",slot:null,type:"Materiał",chance:.40,power:[9,13]},
      {name:"Amulet Wiedźmy",slot:null,type:"Relikt",chance:.16,power:[14,19]}
    ]},
    {id:"marshTroll",image:"assets/monster-icons/marshTroll.webp",region:"swamp",name:"Troll Bagienny",type:"Bestia",description:"Olbrzym odporny na ból i większość zwykłej stali.",hp:380,attack:43,xp:260,gold:[120,170],danger:"Ekstremalny",boss:false,drops:[
      {name:"Maczuga Bagiennego Trolla",slot:"weapon",type:"Broń",chance:.17,power:[17,22]},
      {name:"Skóra Trolla",slot:"armor",type:"Pancerz",chance:.14,power:[16,21]}
    ]},
    {id:"swampHydra",image:"assets/monster-icons/swampHydra.webp",region:"swamp",name:"Hydra Czarnych Bagien",type:"Boss · Bestia",description:"Wielogłowy potwór zatruwający całe mokradła.",hp:560,attack:50,xp:420,gold:[240,340],danger:"Boss",boss:true,drops:[
      {name:"Ostrze z Kła Hydry",slot:"weapon",type:"Broń",chance:1,power:[24,30],forcedRarity:"legendary"},
      {name:"Serce Hydry",slot:null,type:"Relikt",chance:.28,power:[22,28],forcedRarity:"epic"}
    ]},
    {id:"iceWolf",image:"assets/monster-icons/iceWolf.webp",region:"iceCave",name:"Lodowy Wilk",type:"Bestia",description:"Biały drapieżnik polujący w zamarzniętych tunelach.",hp:340,attack:44,xp:260,gold:[125,175],danger:"Wysoki",boss:false,drops:[
      {name:"Lodowy Kieł",slot:null,type:"Materiał",chance:.42,power:[10,15]},
      {name:"Hełm Wilka Północy",slot:"helmet",type:"Hełm",chance:.13,power:[18,23]}
    ]},
    {id:"frostRaider",image:"assets/monster-icons/frostRaider.webp",region:"iceCave",name:"Najeźdźca Północy",type:"Humanoid",description:"Wojownik z dalekiej północy szukający pradawnych reliktów.",hp:365,attack:47,xp:290,gold:[140,195],danger:"Bardzo wysoki",boss:false,drops:[
      {name:"Topór Północy",slot:"weapon",type:"Broń",chance:.17,power:[20,25]},
      {name:"Pancerz Najeźdźcy",slot:"armor",type:"Pancerz",chance:.14,power:[19,24]}
    ]},
    {id:"iceGolem",image:"assets/monster-icons/iceGolem.webp",region:"iceCave",name:"Lodowy Golem",type:"Konstrukt",description:"Kolos z lodu i kamienia obudzony przez starą magię.",hp:480,attack:52,xp:345,gold:[165,225],danger:"Ekstremalny",boss:false,drops:[
      {name:"Rdzeń Lodowego Golema",slot:null,type:"Materiał",chance:.38,power:[15,20]},
      {name:"Tarcza Wiecznego Lodu",slot:"shield",type:"Tarcza",chance:.14,power:[22,27]}
    ]},
    {id:"frostWyrm",image:"assets/monster-icons/frostWyrm.webp",region:"iceCave",name:"Wyrm Zamarzniętej Otchłani",type:"Boss · Bestia",description:"Pradawny smokopodobny potwór śpiący pod lodowcem.",hp:720,attack:60,xp:560,gold:[320,450],danger:"Boss",boss:true,drops:[
      {name:"Miecz Zamarzniętej Otchłani",slot:"weapon",type:"Broń",chance:1,power:[30,37],forcedRarity:"legendary"},
      {name:"Pancerz Lodowego Wyrma",slot:"armor",type:"Pancerz",chance:.32,power:[28,35],forcedRarity:"legendary"}
    ]}
  ],

  quests:[
    {id:"dogs",name:"Zęby Vallis",description:"Pokonaj 5 bezpańskich psów.",type:"kill",target:"dog",required:5,reward:{xp:60,gold:80}},
    {id:"belt",name:"Dowód rabunku",description:"Zdobądź Skórzany Pas.",type:"item",target:"Skórzany Pas",required:1,reward:{xp:75,gold:100,item:{name:"Miecz Varro",slot:"weapon",type:"Broń",power:[6,6],forcedRarity:"rare"}}},
    {id:"wealth",name:"Pierwszy majątek",description:"Zgromadź 300 złota.",type:"gold",target:null,required:300,reward:{xp:100,gold:50}},
    {id:"fenrirQuest",name:"Alfa Lasu",description:"Pokonaj Fenrira.",type:"kill",target:"fenrir",required:1,reward:{xp:250,gold:250,item:{name:"Amulet Alfy",slot:null,type:"Relikt",power:[10,10],forcedRarity:"epic"}}},
    {id:"mineRaiders",name:"Oczyść wejście",description:"Pokonaj 4 rabusiów ze Starej Kopalni.",type:"kill",target:"mineRaider",required:4,reward:{xp:180,gold:220}},
    {id:"mineBoss",name:"Serce Góry",description:"Pokonaj Kamiennego Strażnika Kopalni.",type:"kill",target:"stoneGuardian",required:1,reward:{xp:450,gold:500,item:{name:"Pierścień Głębin",slot:null,type:"Relikt",power:[15,15],forcedRarity:"epic"}}},
    {id:"catacombBoss",name:"Pan Katakumb",description:"Pokonaj Licha Katakumb.",type:"kill",target:"lich",required:1,reward:{xp:700,gold:800}},
    {id:"banditBoss",name:"Czerwony Szakal",description:"Pokonaj herszta Czerwonych Szakali.",type:"kill",target:"banditChief",required:1,reward:{xp:900,gold:1100}},
    {id:"swampBoss",name:"Wiele głów",description:"Pokonaj Hydrę Czarnych Bagien.",type:"kill",target:"swampHydra",required:1,reward:{xp:1200,gold:1500}},
    {id:"iceBoss",name:"Zamarznięta Otchłań",description:"Pokonaj Wyrma Zamarzniętej Otchłani.",type:"kill",target:"frostWyrm",required:1,reward:{xp:1800,gold:2200}}
  ],

  shop:[
    {id:"smallHeal",name:"Mała mikstura leczenia",kind:"consumable",effect:"heal",amount:35,price:35,description:"+35 punktów życia"},
    {id:"energyDrink",name:"Napój gladiatora",kind:"consumable",effect:"energy",amount:4,price:60,description:"+4 Wytrzymałości"},
    {id:"ragePotion",name:"Eliksir furii",kind:"consumable",effect:"damageBuff",amount:25,durationMs:600000,price:120,description:"+25% obrażeń przez 10 minut"}
  ],





  arenaOpponents:[
    {id:"rookie",name:"Titus Młody",league:"Brąz",hp:150,attack:20,defense:4,rewardPoints:18,rewardGold:[55,85],image:"assets/monster-icons/bandit.webp"},
    {id:"shieldmaiden",name:"Livia Żelazna",league:"Brąz",hp:190,attack:23,defense:8,rewardPoints:22,rewardGold:[70,100],image:"assets/monster-icons/deserter.webp"},
    {id:"veteran",name:"Cassius Weteran",league:"Srebro",hp:250,attack:29,defense:10,rewardPoints:30,rewardGold:[95,135],image:"assets/monster-icons/fallenForeman.webp"},
    {id:"champion",name:"Aurelius Czempion",league:"Złoto",hp:350,attack:38,defense:15,rewardPoints:44,rewardGold:[150,220],image:"assets/monster-icons/banditChief.webp"},
    {id:"imperial",name:"Maximus Imperialis",league:"Mistrz",hp:520,attack:50,defense:22,rewardPoints:65,rewardGold:[260,360],image:"assets/monster-icons/stoneGuardian.webp"}
  ],
  dungeons:[
    {id:"cryptOfAsh",name:"Krypta Popiołu",level:1,energy:2,rewardGold:[280,380],rewardXp:340,rooms:[{name:"Przedsionek kości",enemy:"skeleton"},{name:"Sala pajęczyn",enemy:"cryptSpider"},{name:"Zapieczętowany grobowiec",enemy:"graveWarden"},{name:"Tron Licha",enemy:"lich"}]},
    {id:"jackalVault",name:"Skarbiec Czerwonych Szakali",level:9,energy:3,rewardGold:[520,720],rewardXp:620,rooms:[{name:"Posterunek zwiadowców",enemy:"campScout"},{name:"Sala łupów",enemy:"campBrute"},{name:"Galeria łuczników",enemy:"campArcher"},{name:"Komnata herszta",enemy:"banditChief"}]},
    {id:"blackMarshTemple",name:"Świątynia Czarnych Bagien",level:12,energy:3,rewardGold:[850,1150],rewardXp:980,rooms:[{name:"Zalana krypta",enemy:"swampCrawler"},{name:"Ołtarz wiedźmy",enemy:"bogWitch"},{name:"Most trolla",enemy:"marshTroll"},{name:"Gniazdo Hydry",enemy:"swampHydra"}]},
    {id:"frozenAbyss",name:"Zamarznięta Otchłań",level:15,energy:4,rewardGold:[1300,1800],rewardXp:1450,rooms:[{name:"Lodowy przesmyk",enemy:"iceWolf"},{name:"Obóz najeźdźców",enemy:"frostRaider"},{name:"Komnata golema",enemy:"iceGolem"},{name:"Serce otchłani",enemy:"frostWyrm"}]}
  ],
  skillDefinitions:[
    {id:"powerStrike",name:"Potężne uderzenie",icon:"⚔️",max:5,description:"+4% obrażeń za poziom."},{id:"ironSkin",name:"Żelazna skóra",icon:"🛡️",max:5,description:"+5% życia za poziom."},{id:"criticalEye",name:"Krytyczne oko",icon:"🎯",max:5,description:"+3% szansy na krytyk."},{id:"secondWind",name:"Drugi oddech",icon:"❤️",max:3,description:"Po porażce odzyskujesz wytrzymałość."},{id:"goldHunter",name:"Łowca złota",icon:"🪙",max:5,description:"+5% złota z walk."},{id:"dungeonMastery",name:"Mistrz lochów",icon:"🏰",max:5,description:"+6% nagród z lochów."}
  ],
  professions:[
    {id:"miner",name:"Górnik",icon:"⛏️",description:"Wydobywa rudę i zwiększa zyski z kopalni.",baseGold:42,reputation:"freefolk"},
    {id:"blacksmith",name:"Kowal",icon:"🔨",description:"Wytwarza części uzbrojenia i obniża koszty kuźni.",baseGold:38,reputation:"legion"},
    {id:"hunter",name:"Łowca",icon:"🏹",description:"Poluje na bestie i zdobywa trofea.",baseGold:45,reputation:"freefolk"},
    {id:"merchant",name:"Kupiec",icon:"⚖️",description:"Handluje towarami i buduje kontakty.",baseGold:50,reputation:"merchants"}
  ],
  forts:[
    {id:"vallisGate",name:"Fort Bramy Vallis",level:3,cost:300,income:55,reputation:"legion",description:"Kontroluje główny trakt do Vallis."},
    {id:"riverWatch",name:"Strażnica Rzeki",level:7,cost:700,income:110,reputation:"merchants",description:"Chroni barki kupieckie i przeprawy."},
    {id:"ashPass",name:"Fort Popielnej Przełęczy",level:12,cost:1500,income:230,reputation:"freefolk",description:"Strzeże drogi prowadzącej ku Ashmoor."}
  ],
  mounts:[
    {id:"warHorse",name:"Koń wojenny",icon:"🐎",cost:450,level:3,bonus:"+5% złota z wypraw"},
    {id:"desertLizard",name:"Jaszczur pustynny",icon:"🦎",cost:950,level:8,bonus:"+1 maks. wytrzymałości"},
    {id:"direWolf",name:"Wilk bojowy",icon:"🐺",cost:1800,level:13,bonus:"+5% obrażeń"},
    {id:"imperialLion",name:"Lew Imperium",icon:"🦁",cost:4200,level:20,bonus:"+10% wszystkich nagród"}
  ],
  voyages:[
    {id:"coast",name:"Patrol wybrzeża",duration:60,reward:[110,170],cost:40,reputation:"merchants"},
    {id:"islands",name:"Wyspy Przemytników",duration:180,reward:[300,450],cost:110,reputation:"freefolk"},
    {id:"deepSea",name:"Morze Czarnego Słońca",duration:420,reward:[750,1100],cost:280,reputation:"legion"}
  ],
  estateBuildings:[
    {id:"workshop",name:"Warsztat",icon:"🔨",description:"Zwiększa dochód z posiadłości."},
    {id:"storehouse",name:"Magazyn",icon:"📦",description:"Zwiększa pojemność i wartość zapasów."},
    {id:"trainingYard",name:"Plac treningowy",icon:"⚔️",description:"Daje stały bonus do zdobywanego doświadczenia."}
  ],
  randomEvents:[
    {id:"merchant",name:"Wędrowny kupiec",text:"Kupiec płaci ci za ochronę karawany.",gold:[45,90],rep:{merchants:4}},
    {id:"ambush",name:"Zasadzka bandytów",text:"Rozbijasz zasadzkę i zabierasz łupy.",gold:[25,65],xp:[35,70],rep:{legion:3}},
    {id:"temple",name:"Ukryta świątynia",text:"Odnajdujesz relikt pozostawiony przez dawny kult.",gold:[80,130],xp:[55,100],rep:{freefolk:4}},
    {id:"refugees",name:"Uchodźcy na trakcie",text:"Oddajesz część zapasów potrzebującym. Wieść o tym szybko się rozchodzi.",gold:[-35,-20],rep:{freefolk:8,legion:2}},
    {id:"tax",name:"Poborca podatkowy",text:"Dokumenty są w porządku, ale opłata drogowa boli.",gold:[-55,-25],rep:{legion:1}},
    {id:"treasure",name:"Zakopana skrzynia",text:"Pod starym kamieniem znajdujesz zapomnianą skrzynię.",gold:[120,220],xp:[20,50]}
  ],

  auctionNames:{
    weapon:["Gladius Najemnika","Miecz Karawan","Topór Areny","Ostrze Popiołu","Miecz Strażnika"],
    armor:["Kaftan Areny","Pancerz Najemnika","Zbroja Vallis","Kolczuga Karawan","Pancerz Weterana"],
    helmet:["Hełm Strażnika","Hełm Areny","Hełm Najemnika","Hełm Centuriona","Maska Żelaza"],
    shield:["Tarcza Vallis","Okrągła Tarcza","Puklerz Najemnika","Tarcza Areny","Mur Legionisty"]
  },

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
