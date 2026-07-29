const EXPEDITION_DATA = {
  regions:[
    {id:'outskirts',name:'Obrzeża Vallis',subtitle:'Pierwsza droga poza murami',unlockLevel:1,icon:'🏕️',theme:'sunset',description:'Wyschnięte pola, porzucone wozy i bandy grasujące przy cesarskim trakcie.'},
    {id:'forest',name:'Las Cieni',subtitle:'Ostępy pradawnych bestii',unlockLevel:2,icon:'🌲',theme:'forest',description:'Gęsty las, w którym mgła tłumi kroki, a stare runy budzą drapieżniki.'},
    {id:'ruins',name:'Ruiny Świątyni',subtitle:'Złamane sanktuarium',unlockLevel:4,icon:'🏛️',theme:'violet',description:'Marmurowe kolumny i złote posągi splamione magią zakazanego kultu.'},
    {id:'mine',name:'Stara Kopalnia',subtitle:'Tunele pod Czarną Górą',unlockLevel:6,icon:'⛏️',theme:'amber',description:'Zawalające się chodniki, porzucone szyby i strażnicy wykuci z kamienia.'},
    {id:'catacombs',name:'Katakumby Vallis',subtitle:'Nekropolia legionów',unlockLevel:8,icon:'💀',theme:'blue',description:'Podziemne grobowce, gdzie umarli nadal stoją na straży cesarskich tajemnic.'},
    {id:'banditCamp',name:'Obóz Czerwonych Szakali',subtitle:'Twierdza rozbójników',unlockLevel:10,icon:'🏹',theme:'red',description:'Palisady, wieże łuczników i najemnicy dowodzeni przez byłego oficera legionu.'},
    {id:'swamp',name:'Czarne Bagna',subtitle:'Mokradła zatrutego księżyca',unlockLevel:12,icon:'🐍',theme:'toxic',description:'Czarna woda, toksyczne opary i pradawne stworzenia czające się pod powierzchnią.'}
  ],
  enemies:[
    {id:'road_hound',region:'outskirts',name:'Pies Traktu',title:'Wygłodniała bestia',symbol:'🐕',palette:'sand',hp:30,attack:5,xp:12,gold:[4,8],danger:'Niski'},
    {id:'cart_raider',region:'outskirts',name:'Rabuś Karawan',title:'Nożownik z gościńca',symbol:'🗡️',palette:'rust',hp:44,attack:8,xp:18,gold:[7,13],danger:'Średni'},
    {id:'dust_archer',region:'outskirts',name:'Łucznik z Pustkowi',title:'Strzelec ukryty w zbożu',symbol:'🏹',palette:'gold',hp:52,attack:10,xp:23,gold:[9,16],danger:'Średni'},
    {id:'iron_deserter',region:'outskirts',name:'Dezerter Żelaznej Drogi',title:'Były legionista',symbol:'🛡️',palette:'steel',hp:68,attack:12,xp:30,gold:[12,20],danger:'Wysoki'},
    {id:'road_ogre',region:'outskirts',name:'Gorak — Pożeracz Wozów',title:'Boss Obrzeży',symbol:'👹',palette:'blood',hp:145,attack:19,xp:95,gold:[45,75],danger:'Boss',boss:true},

    {id:'shadow_wolf',region:'forest',name:'Wilk Cienia',title:'Łowca w srebrnej mgle',symbol:'🐺',palette:'moon',hp:70,attack:12,xp:34,gold:[13,22],danger:'Wysoki'},
    {id:'thorn_druid',region:'forest',name:'Druid Cierni',title:'Strażnik zakazanych run',symbol:'🧙',palette:'leaf',hp:82,attack:14,xp:42,gold:[16,27],danger:'Wysoki'},
    {id:'violet_matron',region:'forest',name:'Pajęcza Matrona',title:'Tkaczka fioletowych kokonów',symbol:'🕷️',palette:'violet',hp:96,attack:16,xp:50,gold:[19,31],danger:'Bardzo wysoki'},
    {id:'moss_troll',region:'forest',name:'Troll Mchów',title:'Olbrzym z kamiennym młotem',symbol:'🧌',palette:'moss',hp:125,attack:18,xp:62,gold:[24,38],danger:'Ekstremalny'},
    {id:'fenrir_new',region:'forest',name:'Fenrir — Alfa Lasu',title:'Boss Lasu Cieni',symbol:'🐺',palette:'frostblood',hp:210,attack:25,xp:140,gold:[70,110],danger:'Boss',boss:true},

    {id:'marble_sentinel',region:'ruins',name:'Marmurowy Strażnik',title:'Ożywiony posąg wojownika',symbol:'🗿',palette:'marble',hp:115,attack:17,xp:58,gold:[25,40],danger:'Wysoki'},
    {id:'sun_priestess',region:'ruins',name:'Kapłanka Zgasłego Słońca',title:'Władczyni złotego ognia',symbol:'☀️',palette:'sun',hp:125,attack:20,xp:68,gold:[29,45],danger:'Bardzo wysoki'},
    {id:'relic_thief',region:'ruins',name:'Złodziej Relikwii',title:'Łupieżca świętych krypt',symbol:'🥷',palette:'indigo',hp:108,attack:22,xp:72,gold:[33,50],danger:'Bardzo wysoki'},
    {id:'oracle_wraith',region:'ruins',name:'Widmo Wyroczni',title:'Echo dawnej przepowiedni',symbol:'👻',palette:'aether',hp:145,attack:24,xp:84,gold:[37,56],danger:'Ekstremalny'},
    {id:'temple_colossus',region:'ruins',name:'Koloss Złamanego Ołtarza',title:'Boss Ruin',symbol:'🏺',palette:'royal',hp:300,attack:31,xp:210,gold:[105,160],danger:'Boss',boss:true},

    {id:'cave_bat',region:'mine',name:'Karmazynowy Nietoperz',title:'Drapieżnik zalanych szybów',symbol:'🦇',palette:'crimson',hp:135,attack:20,xp:78,gold:[34,52],danger:'Wysoki'},
    {id:'ore_goblin',region:'mine',name:'Goblin Rudnik',title:'Zbieracz błyszczących rud',symbol:'👺',palette:'copper',hp:150,attack:22,xp:88,gold:[39,60],danger:'Bardzo wysoki'},
    {id:'fallen_miner',region:'mine',name:'Upadły Górnik',title:'Nieumarły z pękniętym kilofem',symbol:'⛏️',palette:'ash',hp:175,attack:25,xp:102,gold:[45,68],danger:'Bardzo wysoki'},
    {id:'obsidian_golem',region:'mine',name:'Obsydianowy Golem',title:'Kolos z czarnego szkła',symbol:'🪨',palette:'obsidian',hp:225,attack:28,xp:125,gold:[56,82],danger:'Ekstremalny'},
    {id:'mountain_heart',region:'mine',name:'Serce Góry',title:'Boss Starej Kopalni',symbol:'💎',palette:'lava',hp:390,attack:37,xp:275,gold:[135,205],danger:'Boss',boss:true},

    {id:'bone_legionary',region:'catacombs',name:'Kościany Legionista',title:'Strażnik wiecznego szyku',symbol:'💀',palette:'bone',hp:190,attack:26,xp:112,gold:[50,74],danger:'Wysoki'},
    {id:'crypt_siren',region:'catacombs',name:'Syrena Krypty',title:'Widmo o lodowym głosie',symbol:'🧟‍♀️',palette:'cyan',hp:205,attack:29,xp:128,gold:[57,84],danger:'Bardzo wysoki'},
    {id:'tomb_knight',region:'catacombs',name:'Rycerz Grobowca',title:'Zakuty w przeklętą stal',symbol:'🗡️',palette:'night',hp:250,attack:32,xp:148,gold:[66,96],danger:'Bardzo wysoki'},
    {id:'plague_necromancer',region:'catacombs',name:'Nekromanta Zarazy',title:'Pan zielonego płomienia',symbol:'🧙‍♂️',palette:'plague',hp:235,attack:36,xp:165,gold:[74,108],danger:'Ekstremalny'},
    {id:'lich_emperor',region:'catacombs',name:'Cesarz-Lisz Aurelian',title:'Boss Katakumb',symbol:'👑',palette:'lich',hp:480,attack:44,xp:360,gold:[190,280],danger:'Boss',boss:true},

    {id:'jackal_scout',region:'banditCamp',name:'Zwiadowca Szakali',title:'Szybki tropiciel obozu',symbol:'🦊',palette:'scarlet',hp:225,attack:31,xp:145,gold:[68,98],danger:'Wysoki'},
    {id:'chain_brute',region:'banditCamp',name:'Łamacz Łańcuchów',title:'Ciężkozbrojny egzekutor',symbol:'🔨',palette:'ironred',hp:285,attack:35,xp:175,gold:[80,114],danger:'Bardzo wysoki'},
    {id:'red_huntress',region:'banditCamp',name:'Karmazynowa Łowczyni',title:'Mistrzyni dwóch kusz',symbol:'🎯',palette:'rose',hp:255,attack:39,xp:190,gold:[89,126],danger:'Bardzo wysoki'},
    {id:'fire_juggler',region:'banditCamp',name:'Podpalacz Obozu',title:'Alchemik płonącej oliwy',symbol:'🔥',palette:'flame',hp:270,attack:42,xp:210,gold:[96,138],danger:'Ekstremalny'},
    {id:'jackal_chief_new',region:'banditCamp',name:'Varos — Czerwony Szakal',title:'Boss Obozu',symbol:'🐺',palette:'commander',hp:565,attack:50,xp:420,gold:[230,330],danger:'Boss',boss:true},

    {id:'bog_leech',region:'swamp',name:'Krwawa Pijawka',title:'Pasożyt czarnej wody',symbol:'🪱',palette:'slime',hp:280,attack:36,xp:205,gold:[94,132],danger:'Wysoki'},
    {id:'mire_witch',region:'swamp',name:'Wiedźma Mokradeł',title:'Tkaczka toksycznych klątw',symbol:'🧙‍♀️',palette:'poison',hp:300,attack:41,xp:235,gold:[108,150],danger:'Bardzo wysoki'},
    {id:'swamp_croc',region:'swamp',name:'Pancerny Krokodyl',title:'Łowca spod czarnej tafli',symbol:'🐊',palette:'jade',hp:385,attack:44,xp:265,gold:[122,170],danger:'Bardzo wysoki'},
    {id:'fungal_titan',region:'swamp',name:'Grzybowy Tytan',title:'Olbrzym karmiony zarodnikami',symbol:'🍄',palette:'fungus',hp:440,attack:47,xp:295,gold:[137,190],danger:'Ekstremalny'},
    {id:'black_hydra_new',region:'swamp',name:'Hydra Czarnego Księżyca',title:'Boss Czarnych Bagien',symbol:'🐉',palette:'hydra',hp:760,attack:59,xp:610,gold:[340,470],danger:'Boss',boss:true}
  ]
};

for(const enemy of EXPEDITION_DATA.enemies){
  enemy.description=enemy.title;
  enemy.type=enemy.boss?'Boss':'Przeciwnik';
  enemy.drops=enemy.drops||[{name:`Trofeum: ${enemy.name}`,slot:null,type:'Trofeum',chance:.22,power:[1,Math.max(2,Math.round(enemy.xp/35))]}];
}
