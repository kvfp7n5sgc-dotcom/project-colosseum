let state=loadGame();const $=id=>document.getElementById(id);
function rarityClass(r){return`rarity-${r||"common"}`;}
function showView(name){document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));$(`view-${name}`).classList.add("active");document.querySelector(`.nav-btn[data-view="${name}"]`)?.classList.add("active");window.scrollTo({top:0,behavior:"smooth"});}
function renderHeader(){ $("levelValue").textContent=state.level;$("goldValue").textContent=state.gold;$("energyValue").textContent=state.energy;$("maxEnergyValue").textContent=state.maxEnergy;$("hpValue").textContent=state.hp;$("maxHpValue").textContent=state.maxHp;$("xpLabel").textContent=`${state.xp} / ${state.xpNext}`;$("xpBar").style.width=`${Math.min(100,state.xp/state.xpNext*100)}%`;$("regenLabel").textContent=state.energy>=state.maxEnergy?"pełna":"1 punkt za sekundę";}
function isRegionUnlocked(region){return state.profileType==="gm"||state.worldUnlocked||state.level>=region.unlockLevel;}
function renderWorld(){
  $("worldMap").innerHTML=GAME_DATA.regions.map(r=>`<article class="world-node ${state.selectedRegion===r.id?"active":""} ${isRegionUnlocked(r)?"":"locked"}"><p class="eyebrow">${isRegionUnlocked(r)?"ODKRYTO":"ZABLOKOWANE"}</p><h3>${r.name}</h3><p>${r.description}</p><span class="small">Wymagany poziom: ${r.unlockLevel}</span>${isRegionUnlocked(r)?`<br><button class="item-btn primary" data-region="${r.id}">Wybierz region</button>`:""}</article>`).join("");
  document.querySelectorAll("[data-region]").forEach(b=>b.onclick=()=>{state.selectedRegion=b.dataset.region;persistAndRender();showView("expeditions");});
}
function renderEnemies(){
  const enemies=GAME_DATA.enemies.filter(e=>e.region===state.selectedRegion);
  $("enemyList").innerHTML=enemies.map(e=>`<article class="enemy-card ${e.boss?"boss-card":""}"><h3>${e.name}</h3><div class="enemy-meta">Życie: ${e.hp}<br>Atak: ${e.attack}<br>Nagroda: ${e.xp} XP, ${e.gold[0]}–${e.gold[1]} złota</div><span class="danger">${e.danger}</span><br><button class="fight-btn" data-enemy="${e.id}">Walcz</button></article>`).join("")||`<p class="small">Brak dostępnych przeciwników.</p>`;
  document.querySelectorAll("[data-enemy]").forEach(b=>b.onclick=()=>{const enemy=GAME_DATA.enemies.find(e=>e.id===b.dataset.enemy);const result=runCombat(state,enemy);$("battleReport").classList.remove("hidden");$("battleReport").innerHTML=`<strong>${result.title}</strong><p>${result.summary}</p>${result.log.length?`<details><summary>Przebieg walki</summary><ol>${result.log.map(x=>`<li>${x}</li>`).join("")}</ol></details>`:""}`;persistAndRender();});
}
function renderStats(){
  $("statsList").innerHTML=Object.entries(state.stats).map(([k,v])=>`<div class="stat-row"><span>${GAME_DATA.statLabels[k]}</span><div class="stat-actions"><strong>${v}</strong><button data-stat="${k}" ${state.statPoints<1?"disabled":""}>+</button></div></div>`).join("");
  document.querySelectorAll("[data-stat]").forEach(b=>b.onclick=()=>{if(state.statPoints<1)return;state.stats[b.dataset.stat]++;state.statPoints--;if(b.dataset.stat==="endurance"){state.maxHp+=5;state.hp+=5;}persistAndRender();});
  $("statPointsValue").textContent=state.statPoints;
}
function renderEquipment(){
  $("equipmentList").innerHTML=Object.entries(state.equipment).map(([slot,item])=>`<div class="equipment-slot"><strong>${GAME_DATA.equipmentLabels[slot]}</strong><br>${item?`<span class="${rarityClass(item.rarity)}">${item.rarityName} ${item.name}</span><br><span>Moc: ${item.power} · Trwałość: ${item.durability}%</span>`:`<span>Puste miejsce</span>`}</div>`).join("");
}
function itemSellPrice(item){const r=GAME_DATA.rarities[item.rarity]||GAME_DATA.rarities.common;return Math.max(1,Math.round((item.power||1)*5*r.sellMultiplier));}
function itemImage(item){
 if(item.kind==="consumable"){
  if(item.effect==="heal")return"assets/items/potion_health.webp";
  if(item.effect==="energy")return"assets/items/potion_energy.webp";
  if(item.effect==="damageBuff")return"assets/items/potion_damage.webp";
 }
 const r=item.rarity||"common";
 if(item.slot==="weapon")return`assets/items/sword_${r}.webp`;
 if(item.slot==="helmet")return`assets/items/helmet_${r}.webp`;
 if(item.slot==="armor")return`assets/items/armor_${r}.webp`;
 if(item.slot==="shield")return`assets/items/shield_${r}.webp`;
 return"assets/ui/game_icon.webp";
}
function filteredInventory(){
  const filter=$("inventoryFilter")?.value||"all",sort=$("inventorySort")?.value||"newest";let arr=state.inventory.map((item,index)=>({item,index}));
  if(filter!=="all")arr=arr.filter(x=>filter==="consumable"?x.item.kind==="consumable":filter==="trophy"?x.item.kind==="trophy":x.item.slot===filter);
  if(sort==="power")arr.sort((a,b)=>(b.item.power||0)-(a.item.power||0));
  if(sort==="rarity")arr.sort((a,b)=>(GAME_DATA.rarities[b.item.rarity]?.rank||0)-(GAME_DATA.rarities[a.item.rarity]?.rank||0));
  if(sort==="value")arr.sort((a,b)=>itemSellPrice(b.item)-itemSellPrice(a.item));
  if(sort==="newest")arr.reverse();return arr;
}
function renderInventory(){
  const inventoryLimit=state.profileType==="gm"?GAME_DATA.gmInventoryLimit:GAME_DATA.inventoryLimit;$("inventoryCount").textContent=`${state.inventory.length}/${inventoryLimit}`;
  const arr=filteredInventory();if(!arr.length){$("inventoryList").innerHTML=`<p class="small">Brak przedmiotów w tej kategorii.</p>`;return;}
  $("inventoryList").innerHTML=arr.map(({item,index})=>{const eq=item.slot?state.equipment[item.slot]:null,diff=item.slot?item.power-(eq?.power||0):null;
    return`<article class="inventory-card"><img class="item-image" src="${itemImage(item)}" alt="${item.name}"><strong class="${rarityClass(item.rarity)}">${item.rarityName||"Zwykły"} ${item.name}</strong><p class="small">${item.type} · Moc ${item.power||0} · Trwałość ${item.durability??100}%</p>${item.slot?`<p class="comparison ${diff>0?"good":diff<0?"bad":""}">${eq?`Założone: ${eq.power} · `:"Puste miejsce · "}Zmiana: ${diff>0?"+":""}${diff}</p>`:""}<div class="item-actions">${item.slot?`<button class="item-btn primary" data-equip="${index}">Załóż</button>`:""}${item.kind==="consumable"?`<button class="item-btn primary" data-use="${index}">Użyj</button>`:""}<button class="item-btn" data-sell="${index}">Sprzedaj za ${itemSellPrice(item)} złota</button></div></article>`;}).join("");
  document.querySelectorAll("[data-equip]").forEach(b=>b.onclick=()=>equipItem(+b.dataset.equip));document.querySelectorAll("[data-use]").forEach(b=>b.onclick=()=>useItem(+b.dataset.use));document.querySelectorAll("[data-sell]").forEach(b=>b.onclick=()=>sellItem(+b.dataset.sell));
}
function equipItem(index){const item=state.inventory[index];if(!item?.slot)return;const prev=state.equipment[item.slot];state.equipment[item.slot]=item;state.inventory.splice(index,1);if(prev)state.inventory.push(prev);state.chronicle.unshift(`Założyłeś ${item.rarityName.toLowerCase()} przedmiot „${item.name}”.`);persistAndRender();}
function sellItem(index){const item=state.inventory[index];if(!item)return;const p=itemSellPrice(item);state.gold+=p;state.inventory.splice(index,1);state.chronicle.unshift(`Sprzedałeś „${item.name}” za ${p} złota.`);persistAndRender();}
function useItem(index){const item=state.inventory[index];if(item?.kind!=="consumable")return;if(item.effect==="heal")state.hp=Math.min(state.maxHp,state.hp+item.amount);if(item.effect==="energy")state.energy=Math.min(state.maxEnergy,state.energy+item.amount);if(item.effect==="damageBuff"){state.buffs.damageUntil=Date.now()+item.durationMs;state.buffs.damagePercent=item.amount;}state.chronicle.unshift(`Użyłeś przedmiotu „${item.name}”.`);state.inventory.splice(index,1);persistAndRender();}
function renderShop(){
  $("shopList").innerHTML=GAME_DATA.shop.map(s=>`<article class="shop-card"><h3>${s.name}</h3><p class="small">${s.description}</p><strong>${s.price} złota</strong><br><button class="item-btn primary" data-buy="${s.id}">Kup</button></article>`).join("");
  document.querySelectorAll("[data-buy]").forEach(b=>b.onclick=()=>buyShopItem(b.dataset.buy));
}
function buyShopItem(id){const s=GAME_DATA.shop.find(x=>x.id===id);if(!s)return;if(state.gold<s.price){$("merchantStatus").textContent="Masz za mało złota.";return;}if(state.inventory.length>=GAME_DATA.inventoryLimit){$("merchantStatus").textContent="Plecak jest pełny.";return;}state.gold-=s.price;state.inventory.push({id:makeId(),name:s.name,type:"Mikstura",slot:null,power:1,durability:100,rarity:"common",rarityName:"Zwykły",color:"#d0d0d0",kind:"consumable",effect:s.effect,amount:s.amount,durationMs:s.durationMs||0});$("merchantStatus").textContent=`Kupiono: ${s.name}.`;persistAndRender();}
function sellAllTrophies(){const trophies=state.inventory.filter(i=>i.kind==="trophy");if(!trophies.length){$("merchantStatus").textContent="Nie masz trofeów do sprzedaży.";return;}const total=trophies.reduce((s,i)=>s+itemSellPrice(i),0);state.inventory=state.inventory.filter(i=>i.kind!=="trophy");state.gold+=total;state.chronicle.unshift(`Sprzedałeś wszystkie trofea za ${total} złota.`);$("merchantStatus").textContent=`Otrzymano ${total} złota.`;persistAndRender();}
function questProgress(q){if(q.type==="kill")return state.kills[q.target]||0;if(q.type==="gold")return state.gold;if(q.type==="item")return state.inventory.some(i=>i.name===q.target)?1:0;return 0;}
function renderQuests(){
  $("questList").innerHTML=GAME_DATA.quests.map(q=>{const status=state.quests[q.id]||"available",prog=Math.min(q.required,questProgress(q)),pct=Math.round(prog/q.required*100);return`<article class="quest-card"><h3>${q.name}</h3><p class="small">${q.description}</p><div class="quest-progress"><div style="width:${pct}%"></div></div><p class="small">${prog}/${q.required}</p><p class="small">Nagroda: ${q.reward.xp} XP, ${q.reward.gold} złota${q.reward.item?`, ${q.reward.item.name}`:""}</p>${status==="claimed"?`<span class="danger">Odebrano</span>`:`<button class="item-btn primary" data-claim="${q.id}" ${prog<q.required?"disabled":""}>Odbierz nagrodę</button>`}</article>`;}).join("");
  document.querySelectorAll("[data-claim]").forEach(b=>b.onclick=()=>claimQuest(b.dataset.claim));
}
function claimQuest(id){const q=GAME_DATA.quests.find(x=>x.id===id);if(!q||state.quests[id]==="claimed"||questProgress(q)<q.required)return;state.xp+=q.reward.xp;state.gold+=q.reward.gold;const limit=state.profileType==="gm"?GAME_DATA.gmInventoryLimit:GAME_DATA.inventoryLimit;if(q.reward.item&&state.inventory.length<limit)state.inventory.push(createLootItem(q.reward.item));state.quests[id]="claimed";state.chronicle.unshift(`Ukończyłeś zadanie „${q.name}”.`);applyLevelUps(state);persistAndRender();}
function renderBuffs(){const active=state.buffs.damageUntil>Date.now();$("activeBuffs").innerHTML=active?`<span class="buff">Furia: +${state.buffs.damagePercent}% obrażeń</span>`:`<span class="small">Brak aktywnych efektów.</span>`;}
function renderChronicle(){$("chronicleList").innerHTML=state.chronicle.map((e,i)=>`<div class="chronicle-entry"><span class="small">Wpis ${state.chronicle.length-i}</span><div>${e}</div></div>`).join("");}
function repairAll(){const d=Object.values(state.equipment).some(i=>i&&i.durability<100);if(!d){$("repairStatus").textContent="Cały ekwipunek jest już naprawiony.";return;}if(state.gold<20){$("repairStatus").textContent="Masz za mało złota.";return;}state.gold-=20;Object.values(state.equipment).forEach(i=>{if(i)i.durability=100;});state.chronicle.unshift("Brenn naprawił cały twój ekwipunek.");$("repairStatus").textContent="Ekwipunek naprawiony.";persistAndRender();}
function upgradeWeakest(){if(state.gold<60){$("repairStatus").textContent="Masz za mało złota.";return;}const items=Object.values(state.equipment).filter(Boolean);if(!items.length)return;const item=items.sort((a,b)=>a.power-b.power)[0];state.gold-=60;item.power+=1;state.chronicle.unshift(`Brenn ulepszył przedmiot „${item.name}” do mocy ${item.power}.`);$("repairStatus").textContent=`Ulepszono: ${item.name}.`;persistAndRender();}
function processEnergyRegeneration(){if(state.energy>=state.maxEnergy){state.lastEnergyTick=Date.now();return;}const now=Date.now(),points=Math.floor((now-state.lastEnergyTick)/GAME_DATA.energyRegenMs);if(points>0){state.energy=Math.min(state.maxEnergy,state.energy+points);state.lastEnergyTick+=points*GAME_DATA.energyRegenMs;saveGame(state);renderHeader();}}
function openDialogue(id){const d=GAME_DATA.dialogues[id];if(!d)return;$("dialogueImage").src=d.image||"";$("dialogueImage").alt=d.name;$("dialogueRole").textContent=d.role;$("dialogueName").textContent=d.name;$("dialogueText").textContent=d.text;$("dialogueModal").classList.remove("hidden");}


// v0.5: prosty ambient miasta generowany przez Web Audio API.
let cityAudio=null;
function toggleCitySound(){
  const button=$("soundToggle");
  if(!button)return;
  if(cityAudio){
    cityAudio.ctx.close();cityAudio=null;
    button.setAttribute("aria-pressed","false");button.textContent="🔇 Dźwięk miasta";return;
  }
  const AudioContext=window.AudioContext||window.webkitAudioContext;
  if(!AudioContext){button.textContent="Dźwięk niedostępny";return;}
  const ctx=new AudioContext(),master=ctx.createGain(),osc1=ctx.createOscillator(),osc2=ctx.createOscillator(),gain1=ctx.createGain(),gain2=ctx.createGain();
  master.gain.value=.035;osc1.type="sine";osc2.type="triangle";osc1.frequency.value=82;osc2.frequency.value=123;gain1.gain.value=.6;gain2.gain.value=.22;
  osc1.connect(gain1).connect(master);osc2.connect(gain2).connect(master);master.connect(ctx.destination);osc1.start();osc2.start();
  cityAudio={ctx,osc1,osc2};button.setAttribute("aria-pressed","true");button.textContent="🔊 Dźwięk miasta";
}


function gmItemFromTemplate(template){
  const rarity=template.rarity||"common";
  const rarityData=GAME_DATA.rarities[rarity]||GAME_DATA.rarities.common;
  return {
    id:makeId(),name:template.name,slot:template.slot??null,type:template.type||(template.slot?GAME_DATA.equipmentLabels[template.slot]:"Przedmiot"),
    power:Number(template.power)||1,durability:100,rarity,rarityName:rarityData.name,color:rarityData.color,
    kind:template.kind||(template.effect?"consumable":(template.slot?"equipment":"trophy")),
    effect:template.effect||null,amount:template.amount||0,durationMs:template.durationMs||0
  };
}
function setGmMessage(message){const el=$("gmMessage");if(el)el.textContent=message;}
function renderGm(){
  const active=state.profileType==="gm";
  $("gmNavBtn")?.classList.toggle("hidden",!active);
  if($("profileBadge")){
    $("profileBadge").textContent=active?"GAME MASTER":"GRACZ";
    $("profileBadge").classList.toggle("active",active);
  }
  if($("gmLoginBtn"))$("gmLoginBtn").textContent=active?"Panel GM":"Profil GM";
  if($("gmLevelStatus"))$("gmLevelStatus").textContent=state.level;
  if($("gmItemStatus"))$("gmItemStatus").textContent=state.inventory.length;
}
function activateGm(){
  if(state.profileType==="gm"){showView("gm");return;}
  const code=prompt("Wpisz kod profilu Game Master:");
  if(code===null)return;
  if(code.trim()!=="COLOSSEUM-GM"){
    alert("Nieprawidłowy kod.");
    return;
  }
  state.profileType="gm";
  state.worldUnlocked=true;
  state.chronicle.unshift("Aktywowano profil Game Master.");
  persistAndRender();
  showView("gm");
  setGmMessage("Profil GM aktywny. Kod testowy: COLOSSEUM-GM");
}
function gmGrantAllItems(){
  const existing=new Set(state.inventory.map(item=>`${item.name}|${item.rarity}`));
  let added=0;
  GAME_DATA.gmCatalog.forEach(template=>{
    const key=`${template.name}|${template.rarity||"common"}`;
    if(!existing.has(key)&&state.inventory.length<GAME_DATA.gmInventoryLimit){
      state.inventory.push(gmItemFromTemplate(template));existing.add(key);added++;
    }
  });
  state.chronicle.unshift(`Game Master dodał ${added} przedmiotów testowych.`);
  persistAndRender();setGmMessage(`Dodano ${added} brakujących przedmiotów. Plecak: ${state.inventory.length}/${GAME_DATA.gmInventoryLimit}.`);
}
function gmMaxCharacter(){
  state.level=99;state.xp=0;state.xpNext=999999;state.statPoints=99;
  state.stats={strength:100,endurance:100,dexterity:100,cunning:100,luck:100};
  state.maxHp=9999;state.hp=9999;state.maxEnergy=999;state.energy=999;
  state.worldUnlocked=true;
  state.chronicle.unshift("Game Master ustawił maksymalne statystyki postaci.");
  persistAndRender();setGmMessage("Postać ma teraz poziom 99 i maksymalne statystyki testowe.");
}
function gmUnlockWorld(){
  state.worldUnlocked=true;state.level=Math.max(state.level,99);
  state.chronicle.unshift("Game Master odblokował wszystkie regiony.");
  persistAndRender();setGmMessage("Wszystkie obecne i przyszłe regiony korzystające z blokady poziomu są odblokowane.");
}
function gmAddGold(){
  state.gold=999999;state.chronicle.unshift("Game Master ustawił 999 999 złota.");
  persistAndRender();setGmMessage("Stan złota ustawiono na 999 999.");
}
function gmHeal(){
  state.hp=state.maxHp;state.energy=state.maxEnergy;state.lastEnergyTick=Date.now();
  persistAndRender();setGmMessage("Życie i wytrzymałość zostały uzupełnione.");
}
function gmCompleteQuests(){
  GAME_DATA.quests.forEach(q=>{
    if(q.type==="kill")state.kills[q.target]=Math.max(state.kills[q.target]||0,q.required);
    if(q.type==="gold")state.gold=Math.max(state.gold,q.required);
    if(q.type==="item"&&!state.inventory.some(i=>i.name===q.target)&&state.inventory.length<GAME_DATA.gmInventoryLimit){
      state.inventory.push(gmItemFromTemplate({name:q.target,type:"Przedmiot zadania",power:1,rarity:"common"}));
    }
  });
  state.chronicle.unshift("Game Master spełnił wymagania wszystkich zadań.");
  persistAndRender();setGmMessage("Wymagania wszystkich zadań zostały spełnione. Nagrody możesz odebrać ręcznie.");
}
function gmClearInventory(){
  if(!confirm("Wyczyścić cały plecak profilu GM? Założone przedmioty pozostaną."))return;
  state.inventory=[];state.chronicle.unshift("Game Master wyczyścił plecak.");
  persistAndRender();setGmMessage("Plecak został wyczyszczony.");
}
function exitGm(){
  if(!confirm("Wyłączyć profil Game Master i wrócić do trybu gracza? Przedmioty i statystyki pozostaną w tym zapisie."))return;
  state.profileType="player";state.worldUnlocked=false;
  state.chronicle.unshift("Wyłączono profil Game Master.");
  persistAndRender();showView("city");
}

function persistAndRender(){saveGame(state);renderAll();}
function renderAll(){renderHeader();renderWorld();renderEnemies();renderStats();renderEquipment();renderInventory();renderShop();renderQuests();renderBuffs();renderChronicle();renderGm();}
document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>showView(b.dataset.view));document.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>showView(b.dataset.open));
document.querySelectorAll("[data-dialogue]").forEach(b=>b.onclick=()=>openDialogue(b.dataset.dialogue));$("closeDialogue").onclick=()=>$("dialogueModal").classList.add("hidden");$("dialogueModal").onclick=e=>{if(e.target===$("dialogueModal"))$("dialogueModal").classList.add("hidden");};
$("soundToggle").onclick=toggleCitySound;
$("repairBtn").onclick=repairAll;$("upgradeBtn").onclick=upgradeWeakest;$("sellJunkBtn").onclick=sellAllTrophies;$("inventoryFilter").onchange=renderInventory;$("inventorySort").onchange=renderInventory;

$("gmLoginBtn").onclick=activateGm;
$("gmGrantAllBtn").onclick=gmGrantAllItems;
$("gmMaxCharacterBtn").onclick=gmMaxCharacter;
$("gmUnlockWorldBtn").onclick=gmUnlockWorld;
$("gmGoldBtn").onclick=gmAddGold;
$("gmHealBtn").onclick=gmHeal;
$("gmCompleteQuestsBtn").onclick=gmCompleteQuests;
$("gmClearInventoryBtn").onclick=gmClearInventory;
$("gmExitBtn").onclick=exitGm;

$("resetGameBtn").onclick=()=>{if(!confirm("Usunąć zapis i rozpocząć nową grę?"))return;resetSave();state=createNewState();$("battleReport").classList.add("hidden");persistAndRender();showView("city");};
processEnergyRegeneration();renderAll();setInterval(()=>{processEnergyRegeneration();renderBuffs();},250);
