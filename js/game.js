let state=loadGame();const $=id=>document.getElementById(id);
function rarityClass(r){return`rarity-${r||"common"}`;}
function showView(name){
  const target=$(`view-${name}`);if(!target)return;
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  document.querySelectorAll(".game-dock .nav-btn").forEach(b=>b.classList.remove("active"));
  target.classList.add("active");
  document.body.classList.toggle("city-mode",name==="city");
  const direct=document.querySelector(`.game-dock .nav-btn[data-view="${name}"]`);
  if(direct)direct.classList.add("active");else $("moreNavBtn")?.classList.add("active");
  window.scrollTo({top:0,behavior:name==="city"?"auto":"smooth"});
  if(name==="city") requestAnimationFrame(()=>{
    const shell=document.querySelector("#view-city .city-map-shell");
    if(shell && !shell.dataset.centered){shell.scrollLeft=Math.max(0,(shell.scrollWidth-shell.clientWidth)/2);shell.dataset.centered="1";}
  });
}
function mountRewardMultiplier(){return state.equippedMount==="imperialLion"?1.10:state.equippedMount==="warHorse"?1.05:1;}
function mountDamageMultiplier(){return state.equippedMount==="direWolf"?1.05:1;}
function estateXpMultiplier(){return 1+Math.max(0,(state.estate?.trainingYard||1)-1)*.03;}
function renderHeader(){
  const phaseBadge=$("worldPhaseBadge");if(phaseBadge){phaseBadge.textContent=state.worldPhase==="night"?"NOC":"DZIEŃ";phaseBadge.classList.toggle("night",state.worldPhase==="night");}
  $("levelValue").textContent=state.level;$("goldValue").textContent=state.gold;$("energyValue").textContent=state.energy;$("maxEnergyValue").textContent=state.maxEnergy;$("hpValue").textContent=state.hp;$("maxHpValue").textContent=state.maxHp;$("xpLabel").textContent=`${state.xp} / ${state.xpNext}`;$("xpBar").style.width=`${Math.min(100,state.xp/state.xpNext*100)}%`;$("regenLabel").textContent=state.energy>=state.maxEnergy?"pełna":"1 punkt za sekundę";}
function isRegionUnlocked(region){return state.profileType==="gm"||state.worldUnlocked||state.level>=region.unlockLevel;}
function expeditionRegions(){return typeof EXPEDITION_DATA!=="undefined"?EXPEDITION_DATA.regions:GAME_DATA.regions;}
function expeditionEnemies(){return typeof EXPEDITION_DATA!=="undefined"?EXPEDITION_DATA.enemies:GAME_DATA.enemies;}
function regionWins(regionId){return expeditionEnemies().filter(e=>e.region===regionId&&!e.boss).reduce((sum,e)=>sum+(state.kills[e.id]||0),0);}
function bossUnlocked(regionId){const regular=expeditionEnemies().filter(e=>e.region===regionId&&!e.boss);return state.profileType==="gm"||(regular.every(e=>(state.kills[e.id]||0)>0)&&regionWins(regionId)>=10);}
function renderWorld(){
  const map=$("worldMap");if(!map)return;const regions=expeditionRegions();
  map.innerHTML=regions.map((r,index)=>{const unlocked=isRegionUnlocked(r);const wins=regionWins(r.id);return`<article class="continent-location theme-${r.theme} ${state.selectedRegion===r.id?"active":""} ${unlocked?"":"locked"}">
    <div class="location-art"><span>${r.icon}</span><b>${index+1}</b></div><div class="location-copy"><span class="location-kicker">${r.subtitle}</span><h3>${r.name}</h3><p>${r.description}</p><div class="location-meta"><span>Poziom ${r.unlockLevel}+</span><span>${wins} zwycięstw</span></div>${unlocked?`<button class="primary-btn" data-region="${r.id}">Wejdź do lokacji</button>`:`<button class="primary-btn" disabled>🔒 Wymagany poziom ${r.unlockLevel}</button>`}</div>
  </article>`}).join("");
  document.querySelectorAll("[data-region]").forEach(b=>b.onclick=()=>{state.selectedRegion=b.dataset.region;persistAndRender();showView("expeditions");});
}
function renderEnemies(){
  const regions=expeditionRegions(),allEnemies=expeditionEnemies();let region=regions.find(r=>r.id===state.selectedRegion);
  if(!region){state.selectedRegion=regions[0].id;region=regions[0];}
  const title=document.querySelector("#view-expeditions h2");if(title)title.textContent=region.name;
  const intro=document.querySelector("#view-expeditions .expedition-zone-head p:last-child");if(intro)intro.textContent=region.description;
  const strip=$("expeditionRegionStrip");if(strip){strip.innerHTML=regions.map(r=>`<button class="region-chip ${r.id===state.selectedRegion?"active":""}" data-quick-region="${r.id}" ${isRegionUnlocked(r)?"":"disabled"}>${r.icon} ${r.name}</button>`).join("");document.querySelectorAll("[data-quick-region]").forEach(b=>b.onclick=()=>{state.selectedRegion=b.dataset.quickRegion;persistAndRender();});}
  const enemies=allEnemies.filter(e=>e.region===state.selectedRegion),wins=regionWins(region.id),bossOpen=bossUnlocked(region.id);
  const progress=`<div class="boss-progress panel"><div><span>Postęp lokacji</span><strong>${Math.min(10,wins)}/10 zwycięstw</strong></div><div class="boss-progress-track"><i style="width:${Math.min(100,wins*10)}%"></i></div><small>Boss odblokuje się po pokonaniu każdego zwykłego przeciwnika przynajmniej raz i zdobyciu 10 zwycięstw.</small></div>`;
  $("enemyList").innerHTML=progress+enemies.map((e,i)=>{const locked=e.boss&&!bossOpen,kills=state.kills[e.id]||0;return`<article class="expedition-enemy-card palette-${e.palette} ${e.boss?"boss-card":""} ${locked?"locked":""}"><div class="enemy-portrait"><span>${e.symbol}</span><em>${e.boss?"BOSS":String(i+1).padStart(2,"0")}</em></div><div class="enemy-content"><span class="enemy-title">${e.title}</span><h3>${e.name}</h3><div class="enemy-stat-row"><span>❤️ ${e.hp}</span><span>⚔️ ${e.attack}</span><span>🏆 ${kills}</span></div><p>Nagroda: <strong>${e.xp} XP</strong> · ${e.gold[0]}–${e.gold[1]} złota</p><button class="fight-btn" data-enemy="${e.id}" ${locked?"disabled":""}>${locked?"🔒 Boss zablokowany":e.boss?"Rzuć wyzwanie bossowi":"Walcz — 1 wytrzymałość"}</button></div></article>`}).join("");
  document.querySelectorAll("[data-enemy]").forEach(b=>b.onclick=()=>{const enemy=allEnemies.find(e=>e.id===b.dataset.enemy);if(!enemy)return;const beforeGold=state.gold,beforeXp=state.xp;const result=runCombat(state,enemy);if(result.ok&&result.title!=="Porażka"){const goldBonus=Math.max(0,Math.round((state.gold-beforeGold)*(mountRewardMultiplier()-1))),xpBonus=Math.max(0,Math.round((state.xp-beforeXp)*(estateXpMultiplier()-1)));state.gold+=goldBonus;state.xp+=xpBonus;if(state.worldPhase==="night")state.gold+=Math.round((state.gold-beforeGold)*.08);}$("battleReport").classList.remove("hidden");$("battleReport").innerHTML=`<strong>${result.title}</strong><p>${result.summary}</p>${result.log.length?`<details><summary>Przebieg walki</summary><ol>${result.log.map(x=>`<li>${x}</li>`).join("")}</ol></details>`:""}`;persistAndRender();});
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

function renderBestiaryFilters(){
  const regionSelect=$("bestiaryRegionFilter");
  if(!regionSelect)return;
  const current=regionSelect.value||"all";
  regionSelect.innerHTML='<option value="all">Wszystkie regiony</option>'+GAME_DATA.regions.map(r=>`<option value="${r.id}">${r.name}</option>`).join("");
  regionSelect.value=[...regionSelect.options].some(o=>o.value===current)?current:"all";
}
function renderBestiary(){
  const list=$("bestiaryList");if(!list)return;
  renderBestiaryFilters();
  const region=$("bestiaryRegionFilter")?.value||"all";
  const stateFilter=$("bestiaryStateFilter")?.value||"all";
  const visible=GAME_DATA.enemies.filter(e=>region==="all"||e.region===region).filter(e=>{
    const unlocked=state.profileType==="gm"||(state.kills[e.id]||0)>0;
    return stateFilter==="all"||(stateFilter==="unlocked"&&unlocked)||(stateFilter==="locked"&&!unlocked);
  });
  list.innerHTML=visible.map(e=>{
    const kills=state.kills[e.id]||0;
    const unlocked=state.profileType==="gm"||kills>0;
    const regionName=GAME_DATA.regions.find(r=>r.id===e.region)?.name||e.region;
    if(!unlocked)return `<article class="bestiary-card locked"><div class="unknown-monster">?</div><div><span class="enemy-type">${regionName}</span><h3>Nieodkryty przeciwnik</h3><p>Pokonaj go przynajmniej raz, aby odblokować kartę.</p></div></article>`;
    const drops=e.drops.map(d=>`${d.name} (${Math.round(d.chance*100)}%)`).join(" · ");
    return `<article class="bestiary-card ${e.boss?"boss":""}"><img src="${e.image}" alt="${e.name}"><div><span class="enemy-type">${e.type||"Przeciwnik"} · ${regionName}</span><h3>${e.name}</h3><p>${e.description||""}</p><div class="bestiary-stats"><span>❤️ ${e.hp}</span><span>⚔️ ${e.attack}</span><span>🏆 ${kills}</span></div><p class="small"><strong>Łupy:</strong> ${drops}</p></div></article>`;
  }).join("")||'<div class="panel"><p>Brak wpisów pasujących do filtra.</p></div>';
}

function renderChronicle(){$("chronicleList").innerHTML=state.chronicle.map((e,i)=>`<div class="chronicle-entry"><span class="small">Wpis ${state.chronicle.length-i}</span><div>${e}</div></div>`).join("");}
function forgeItemLevel(item){return Number(item?.upgradeLevel)||0;}
function forgeUpgradeCost(item){const level=forgeItemLevel(item);return Math.round(55+level*45+(item?.power||1)*3);}
function forgeUpgradeChance(item){const level=forgeItemLevel(item);return Math.max(35,100-level*5);}
function renderForge(){
  const list=$("forgeEquipmentList");if(!list)return;
  $("forgeGold").textContent=state.gold;
  const slots=Object.keys(state.equipment);
  if(!state.equipment[state.forgeSelectedSlot])state.forgeSelectedSlot=slots.find(s=>state.equipment[s])||"weapon";
  list.innerHTML=slots.map(slot=>{
    const item=state.equipment[slot],selected=state.forgeSelectedSlot===slot;
    return `<button class="forge-item ${selected?"selected":""}" data-forge-slot="${slot}" ${item?"":"disabled"}>
      <span>${GAME_DATA.equipmentLabels[slot]}</span>
      <strong>${item?item.name:"Puste miejsce"}</strong>
      <small>${item?`Moc ${item.power} · +${forgeItemLevel(item)} · Trwałość ${item.durability}%`:"Brak przedmiotu"}</small>
    </button>`;
  }).join("");
  document.querySelectorAll("[data-forge-slot]").forEach(b=>b.onclick=()=>{state.forgeSelectedSlot=b.dataset.forgeSlot;saveGame(state);renderForge();});
  const item=state.equipment[state.forgeSelectedSlot];
  $("forgeSelectedName").textContent=item?item.name:"Brak";
  $("forgeSelectedLevel").textContent=item?`+${forgeItemLevel(item)}`:"+0";
  if(item){
    const cost=forgeUpgradeCost(item),chance=forgeUpgradeChance(item);
    $("forgeChanceBox").innerHTML=`Koszt ulepszenia: <strong>${cost} złota</strong> · Szansa powodzenia: <strong>${chance}%</strong> · Maksymalny poziom: <strong>+20</strong>`;
    $("upgradeBtn").disabled=forgeItemLevel(item)>=20;
  }else{
    $("forgeChanceBox").textContent="Załóż przedmiot, aby móc go ulepszyć.";
    $("upgradeBtn").disabled=true;
  }
}
function repairAll(){
  const damaged=Object.values(state.equipment).filter(i=>i&&i.durability<100);
  if(!damaged.length){$("repairStatus").textContent="Cały ekwipunek jest już naprawiony.";return;}
  const cost=damaged.reduce((sum,i)=>sum+Math.max(5,Math.ceil((100-i.durability)/5)),0);
  if(state.gold<cost){$("repairStatus").textContent=`Naprawa kosztuje ${cost} złota. Masz za mało.`;return;}
  state.gold-=cost;damaged.forEach(i=>i.durability=100);
  state.chronicle.unshift(`Brenn naprawił ekwipunek za ${cost} złota.`);
  $("repairStatus").textContent=`Naprawiono ekwipunek za ${cost} złota.`;persistAndRender();
}
function upgradeSelected(){
  const item=state.equipment[state.forgeSelectedSlot];
  if(!item){$("repairStatus").textContent="Najpierw wybierz założony przedmiot.";return;}
  const level=forgeItemLevel(item);
  if(level>=20){$("repairStatus").textContent="Ten przedmiot osiągnął maksymalny poziom +20.";return;}
  const cost=forgeUpgradeCost(item),chance=forgeUpgradeChance(item);
  if(state.gold<cost){$("repairStatus").textContent=`Potrzebujesz ${cost} złota.`;return;}
  state.gold-=cost;
  const success=Math.random()*100<chance;
  if(success){
    item.upgradeLevel=level+1;item.power+=Math.max(1,Math.ceil(item.power*.08));
    state.chronicle.unshift(`Brenn ulepszył „${item.name}” do +${item.upgradeLevel}.`);
    $("repairStatus").textContent=`Sukces! ${item.name} ma teraz +${item.upgradeLevel}.`;
  }else{
    item.durability=Math.max(10,item.durability-8);
    state.chronicle.unshift(`Ulepszenie „${item.name}” nie powiodło się.`);
    $("repairStatus").textContent="Ulepszenie nie powiodło się. Przedmiot stracił 8% trwałości, ale nie został zniszczony.";
  }
  persistAndRender();
}
function auctionRarityByPower(power){
  if(power>=34)return"legendary";if(power>=23)return"epic";if(power>=13)return"rare";return"common";
}
function createAuctionOffers(){
  const slots=["weapon","armor","helmet","shield"],offers=[];
  for(let i=0;i<8;i++){
    const slot=slots[(state.auctionSeed+i)%slots.length];
    const names=GAME_DATA.auctionNames[slot];
    const power=Math.max(5,Math.round(state.level*1.7+6+((state.auctionSeed*7+i*5)%14)));
    const rarity=auctionRarityByPower(power);
    const r=GAME_DATA.rarities[rarity];
    offers.push({id:`auction-${state.auctionSeed}-${i}`,name:names[(state.auctionSeed+i)%names.length],slot,type:GAME_DATA.equipmentLabels[slot],
      power,durability:100,upgradeLevel:0,rarity,rarityName:r.name,color:r.color,kind:"equipment",
      price:Math.round(power*12*r.sellMultiplier+35)});
  }
  state.auctionOffers=offers;
}
function renderAuction(){
  const list=$("auctionList");if(!list)return;
  if(!state.auctionOffers.length)createAuctionOffers();
  const filter=$("auctionFilter")?.value||"all",sort=$("auctionSort")?.value||"priceAsc";
  let offers=[...state.auctionOffers].filter(o=>filter==="all"||o.slot===filter);
  if(sort==="priceAsc")offers.sort((a,b)=>a.price-b.price);
  if(sort==="priceDesc")offers.sort((a,b)=>b.price-a.price);
  if(sort==="powerDesc")offers.sort((a,b)=>b.power-a.power);
  list.innerHTML=offers.map(o=>`<article class="auction-card">
    <img class="item-image" src="${itemImage(o)}" alt="${o.name}">
    <span class="${rarityClass(o.rarity)}">${o.rarityName}</span><h3>${o.name}</h3>
    <p>${o.type} · Moc ${o.power}</p><strong>${o.price} złota</strong>
    <button class="item-btn primary" data-auction-buy="${o.id}">Kup</button>
  </article>`).join("")||'<div class="panel"><p>Brak ofert w tej kategorii.</p></div>';
  document.querySelectorAll("[data-auction-buy]").forEach(b=>b.onclick=()=>buyAuctionItem(b.dataset.auctionBuy));
}
function buyAuctionItem(id){
  const index=state.auctionOffers.findIndex(o=>o.id===id);if(index<0)return;
  const offer=state.auctionOffers[index],limit=state.profileType==="gm"?GAME_DATA.gmInventoryLimit:GAME_DATA.inventoryLimit;
  if(state.gold<offer.price){$("auctionStatus").textContent="Masz za mało złota.";return;}
  if(state.inventory.length>=limit){$("auctionStatus").textContent="Plecak jest pełny.";return;}
  state.gold-=offer.price;const item={...offer,id:makeId()};delete item.price;
  state.inventory.push(item);state.auctionOffers.splice(index,1);
  state.chronicle.unshift(`Kupiono na aukcji „${item.name}” za ${offer.price} złota.`);
  $("auctionStatus").textContent=`Kupiono: ${item.name}.`;persistAndRender();
}
function refreshAuction(){
  if(state.gold<10){$("auctionStatus").textContent="Potrzebujesz 10 złota na nowe oferty.";return;}
  state.gold-=10;state.auctionSeed++;createAuctionOffers();
  state.chronicle.unshift("Odświeżono oferty Domu Aukcyjnego.");
  $("auctionStatus").textContent="Pojawiły się nowe oferty.";persistAndRender();
}

function randBetween(range){return Math.floor(Math.random()*(range[1]-range[0]+1))+range[0];}
function addReputation(faction,amount){
  state.reputation[faction]=Math.max(0,(state.reputation[faction]||0)+amount);
}
function reputationRank(value){
  if(value>=100)return"Legenda";if(value>=60)return"Sprzymierzeniec";if(value>=30)return"Zaufany";if(value>=10)return"Znany";return"Obcy";
}
function renderImperium(){
  if(!$("professionList"))return;
  $("phaseLabel").textContent=state.worldPhase==="night"?"Noc":"Dzień";
  $("dayNightDescription").textContent=state.worldPhase==="night"
    ?"Nocne wyprawy dają 8% więcej złota, ale świat staje się bardziej niebezpieczny."
    :"Za dnia handel i podróże są bezpieczniejsze. Noc możesz włączyć testowo.";
  const profession=GAME_DATA.professions.find(p=>p.id===state.profession);
  $("professionSummary").textContent=profession?`${profession.name} · poz. ${state.professionLevel}`:"Nie wybrano";
  const mount=GAME_DATA.mounts.find(m=>m.id===state.equippedMount);
  $("mountSummary").textContent=mount?mount.name:"Brak";
  $("fortSummary").textContent=`${Object.values(state.forts).filter(Boolean).length}/${GAME_DATA.forts.length}`;

  $("professionList").innerHTML=GAME_DATA.professions.map(p=>`<button class="system-option ${state.profession===p.id?"selected":""}" data-profession="${p.id}">
    <span class="system-icon">${p.icon}</span><span><strong>${p.name}</strong><small>${p.description}</small></span>
  </button>`).join("");
  document.querySelectorAll("[data-profession]").forEach(b=>b.onclick=()=>{
    state.profession=b.dataset.profession;state.professionLevel=1;state.professionXp=0;
    state.chronicle.unshift(`Wybrano profesję: ${GAME_DATA.professions.find(p=>p.id===state.profession).name}.`);
    persistAndRender();
  });

  $("fortList").innerHTML=GAME_DATA.forts.map(f=>{
    const owned=Boolean(state.forts[f.id]),locked=state.level<f.level&&state.profileType!=="gm";
    return `<div class="fort-card ${owned?"owned":""}">
      <strong>${f.name}</strong><p>${f.description}</p><small>Dochód: ${f.income} złota · wymagany poziom ${f.level}</small>
      <button class="item-btn primary" data-fort="${f.id}" ${owned||locked?"disabled":""}>${owned?"Przejęty":locked?"Za niski poziom":`Przejmij za ${f.cost} złota`}</button>
    </div>`;
  }).join("");
  document.querySelectorAll("[data-fort]").forEach(b=>b.onclick=()=>captureFort(b.dataset.fort));

  $("mountList").innerHTML=GAME_DATA.mounts.map(m=>{
    const owned=state.ownedMounts.includes(m.id),equipped=state.equippedMount===m.id,locked=state.level<m.level&&state.profileType!=="gm";
    return `<div class="mount-row"><span class="system-icon">${m.icon}</span><div><strong>${m.name}</strong><small>${m.bonus}</small></div>
      <button class="item-btn ${equipped?"":"primary"}" data-mount="${m.id}" ${locked?"disabled":""}>${equipped?"Założony":owned?"Dosiądź":`Kup ${m.cost}`}</button></div>`;
  }).join("");
  document.querySelectorAll("[data-mount]").forEach(b=>b.onclick=()=>handleMount(b.dataset.mount));

  const factionNames={legion:"Legion Vallis",merchants:"Liga Kupców",freefolk:"Wolne Klany"};
  $("reputationList").innerHTML=Object.entries(state.reputation).map(([id,value])=>`<div class="reputation-row">
    <div><strong>${factionNames[id]}</strong><small>${reputationRank(value)} · ${value} pkt</small></div>
    <div class="rep-track"><span style="width:${Math.min(100,value)}%"></span></div>
  </div>`).join("");

  renderVoyages();
  renderEstate();
}
function toggleWorldPhase(){
  state.worldPhase=state.worldPhase==="day"?"night":"day";
  state.chronicle.unshift(`Nastała ${state.worldPhase==="night"?"noc":"pora dnia"}.`);
  persistAndRender();
}
function workProfession(){
  const p=GAME_DATA.professions.find(x=>x.id===state.profession);
  if(!p){$("professionStatus").textContent="Najpierw wybierz profesję.";return;}
  const now=Date.now(),cooldown=30000;
  if(now-state.professionLastWork<cooldown&&state.profileType!=="gm"){
    $("professionStatus").textContent=`Odpoczynek: ${Math.ceil((cooldown-(now-state.professionLastWork))/1000)} s.`;return;
  }
  const earned=Math.round((p.baseGold+state.professionLevel*8)*mountRewardMultiplier());
  state.gold+=earned;state.professionXp+=25;state.professionLastWork=now;addReputation(p.reputation,2);
  if(state.professionXp>=state.professionLevel*100){state.professionXp-=state.professionLevel*100;state.professionLevel++;state.chronicle.unshift(`Profesja ${p.name} awansowała na poziom ${state.professionLevel}.`);}
  $("professionStatus").textContent=`Zarobiono ${earned} złota. Postęp profesji: ${state.professionXp}/${state.professionLevel*100}.`;
  persistAndRender();
}
function captureFort(id){
  const f=GAME_DATA.forts.find(x=>x.id===id);if(!f||state.forts[id])return;
  if(state.level<f.level&&state.profileType!=="gm"){return;}
  if(state.gold<f.cost){$("fortStatus").textContent="Masz za mało złota.";return;}
  state.gold-=f.cost;state.forts[id]=true;addReputation(f.reputation,10);
  state.chronicle.unshift(`Przejęto ${f.name}.`);$("fortStatus").textContent=`${f.name} jest pod twoją kontrolą.`;persistAndRender();
}
function claimFortIncome(){
  const owned=GAME_DATA.forts.filter(f=>state.forts[f.id]);
  if(!owned.length){$("fortStatus").textContent="Nie kontrolujesz żadnego fortu.";return;}
  const now=Date.now(),cooldown=60000;
  if(now-state.fortIncomeLastClaim<cooldown&&state.profileType!=="gm"){
    $("fortStatus").textContent=`Kolejny pobór za ${Math.ceil((cooldown-(now-state.fortIncomeLastClaim))/1000)} s.`;return;
  }
  const income=Math.round(owned.reduce((s,f)=>s+f.income,0)*mountRewardMultiplier());
  state.gold+=income;state.fortIncomeLastClaim=now;$("fortStatus").textContent=`Odebrano ${income} złota.`;
  state.chronicle.unshift(`Forty przekazały ${income} złota.`);persistAndRender();
}
function handleMount(id){
  const m=GAME_DATA.mounts.find(x=>x.id===id);if(!m)return;
  if(!state.ownedMounts.includes(id)){
    if(state.gold<m.cost){$("mountStatus").textContent="Masz za mało złota.";return;}
    state.gold-=m.cost;state.ownedMounts.push(id);state.chronicle.unshift(`Kupiono wierzchowca: ${m.name}.`);
  }
  state.equippedMount=id;$("mountStatus").textContent=`Aktywny wierzchowiec: ${m.name}.`;persistAndRender();
}
function renderVoyages(){
  const now=Date.now();
  if(state.voyage){
    const v=GAME_DATA.voyages.find(x=>x.id===state.voyage.id),remaining=Math.max(0,state.voyage.endsAt-now);
    if(remaining<=0){
      $("voyageList").innerHTML=`<div class="voyage-card ready"><strong>${v.name}</strong><p>Statek wrócił do portu.</p><button class="primary-btn" id="claimVoyageBtn">Odbierz nagrodę</button></div>`;
      $("claimVoyageBtn").onclick=claimVoyage;return;
    }
    $("voyageList").innerHTML=`<div class="voyage-card active"><strong>${v.name}</strong><p>Powrót za ${Math.ceil(remaining/1000)} s.</p><div class="progress-track"><div class="progress-fill" style="width:${Math.max(2,100-remaining/(v.duration*10))}%"></div></div></div>`;
    return;
  }
  $("voyageList").innerHTML=GAME_DATA.voyages.map(v=>`<div class="voyage-card"><strong>${v.name}</strong><p>Czas: ${v.duration} s · koszt: ${v.cost} złota</p><small>Nagroda: ${v.reward[0]}–${v.reward[1]} złota</small><button class="item-btn primary" data-voyage="${v.id}">Wyślij statek</button></div>`).join("");
  document.querySelectorAll("[data-voyage]").forEach(b=>b.onclick=()=>startVoyage(b.dataset.voyage));
}
function startVoyage(id){
  const v=GAME_DATA.voyages.find(x=>x.id===id);if(!v)return;
  if(state.gold<v.cost){$("voyageStatus").textContent="Masz za mało złota.";return;}
  state.gold-=v.cost;state.voyage={id,endsAt:Date.now()+v.duration*1000};
  state.chronicle.unshift(`Wysłano statek: ${v.name}.`);persistAndRender();
}
function claimVoyage(){
  if(!state.voyage)return;const v=GAME_DATA.voyages.find(x=>x.id===state.voyage.id);
  if(Date.now()<state.voyage.endsAt&&state.profileType!=="gm")return;
  const reward=Math.round(randBetween(v.reward)*mountRewardMultiplier());
  state.gold+=reward;addReputation(v.reputation,5);state.voyageHistory.unshift({id:v.id,reward,time:Date.now()});state.voyage=null;
  $("voyageStatus").textContent=`Flota przywiozła ${reward} złota.`;state.chronicle.unshift(`Ekspedycja „${v.name}” wróciła z ${reward} złota.`);persistAndRender();
}
function estateUpgradeCost(level){return 180*level*level;}
function estateIncome(){return state.estate.workshop*45+state.estate.storehouse*30+state.estate.trainingYard*20;}
function renderEstate(){
  $("estateList").innerHTML=GAME_DATA.estateBuildings.map(b=>{
    const level=state.estate[b.id]||1,cost=estateUpgradeCost(level);
    return `<div class="estate-card"><span class="system-icon">${b.icon}</span><strong>${b.name} · poziom ${level}</strong><p>${b.description}</p><button class="item-btn primary" data-estate="${b.id}">Ulepsz za ${cost} złota</button></div>`;
  }).join("");
  document.querySelectorAll("[data-estate]").forEach(b=>b.onclick=()=>upgradeEstate(b.dataset.estate));
}
function upgradeEstate(id){
  const level=state.estate[id]||1,cost=estateUpgradeCost(level);
  if(state.gold<cost){$("estateStatus").textContent="Masz za mało złota.";return;}
  state.gold-=cost;state.estate[id]=level+1;state.chronicle.unshift(`Ulepszono ${GAME_DATA.estateBuildings.find(b=>b.id===id).name} do poziomu ${level+1}.`);
  persistAndRender();
}
function claimEstateIncome(){
  const now=Date.now(),cooldown=60000;
  if(now-state.estateIncomeLastClaim<cooldown&&state.profileType!=="gm"){
    $("estateStatus").textContent=`Dochód będzie gotowy za ${Math.ceil((cooldown-(now-state.estateIncomeLastClaim))/1000)} s.`;return;
  }
  const income=Math.round(estateIncome()*mountRewardMultiplier());state.gold+=income;state.estateIncomeLastClaim=now;
  $("estateStatus").textContent=`Odebrano ${income} złota z posiadłości.`;state.chronicle.unshift(`Posiadłość przyniosła ${income} złota.`);persistAndRender();
}
function triggerRandomEvent(){
  if(state.energy<1&&state.profileType!=="gm"){$("eventStatus").textContent="Brakuje wytrzymałości.";return;}
  if(state.profileType!=="gm")state.energy--;
  const event=GAME_DATA.randomEvents[Math.floor(Math.random()*GAME_DATA.randomEvents.length)];
  let gold=event.gold?randBetween(event.gold):0,xp=event.xp?randBetween(event.xp):0;
  if(gold>0)gold=Math.round(gold*mountRewardMultiplier());
  state.gold=Math.max(0,state.gold+gold);state.xp+=xp;Object.entries(event.rep||{}).forEach(([f,v])=>addReputation(f,v));
  state.lastRandomEvent={id:event.id,name:event.name,text:event.text,gold,xp};state.randomEventCount++;
  $("eventCard").innerHTML=`<strong>${event.name}</strong><p>${event.text}</p><div class="event-reward">${gold?`${gold>0?"+":""}${gold} złota`:""} ${xp?`+${xp} XP`:""}</div>`;
  $("eventStatus").textContent=`Liczba odkrytych wydarzeń: ${state.randomEventCount}.`;state.chronicle.unshift(`Wydarzenie: ${event.name}.`);
  persistAndRender();
}


function skillBonus(id){return Number(state.skills?.[id])||0;}function availableSkillPoints(){return Math.max(0,Math.floor(state.level/2)-state.skillPointsSpent);}function arenaLeague(p){return p>=600?"Mistrz":p>=350?"Złoto":p>=150?"Srebro":"Brąz";}function combatPower(){const s=calculateStats(state);return{hp:Math.round(s.maxHp*(1+skillBonus("ironSkin")*.05)),attack:Math.round(s.damage*(1+skillBonus("powerStrike")*.04)),defense:s.defense||0};}
function renderArena(){if(!$("arenaOpponentList"))return;$("arenaLeague").textContent=arenaLeague(state.arena.points);$("arenaPoints").textContent=state.arena.points;$("arenaStreak").textContent=state.arena.streak;$("arenaBestStreak").textContent=state.arena.bestStreak;$("arenaOpponentList").innerHTML=GAME_DATA.arenaOpponents.map(o=>{const ok=state.profileType==="gm"||o.league==="Brąz"||(o.league==="Srebro"&&state.arena.points>=150)||(o.league==="Złoto"&&state.arena.points>=350)||(o.league==="Mistrz"&&state.arena.points>=600);return`<article class="arena-opponent ${ok?"":"locked"}"><img src="${o.image}" alt="${o.name}"><div><span class="enemy-type">${o.league}</span><h3>${o.name}</h3><p>Życie ${o.hp} · Atak ${o.attack} · Obrona ${o.defense}</p><button class="primary-btn" data-arena="${o.id}" ${ok?"":"disabled"}>${ok?"Walcz — 1 wytrzymałość":"Zablokowany"}</button></div></article>`}).join("");document.querySelectorAll("[data-arena]").forEach(b=>b.onclick=()=>fightArena(b.dataset.arena));}
function fightArena(id){const o=GAME_DATA.arenaOpponents.find(x=>x.id===id);if(!o)return;if(state.energy<1&&state.profileType!=="gm"){$("arenaReport").innerHTML="<p>Brakuje wytrzymałości.</p>";return;}if(state.profileType!=="gm")state.energy--;const p=combatPower();let ph=p.hp,eh=o.hp,r=0,log=[];while(ph>0&&eh>0&&r++<30){let c=Math.random()<.08+skillBonus("criticalEye")*.03,dm=Math.max(1,Math.round(p.attack*(.82+Math.random()*.36)-o.defense));if(c)dm=Math.round(dm*1.75);eh-=dm;log.push(`Runda ${r}: zadajesz ${dm}${c?" obrażeń krytycznych":" obrażeń"}.`);if(eh<=0)break;let ed=Math.max(1,Math.round(o.attack*(.82+Math.random()*.36)-p.defense*.35));ph-=ed;log.push(`${o.name} zadaje ${ed} obrażeń.`);}if(ph>0){let gold=Math.round(randBetween(o.rewardGold)*(1+skillBonus("goldHunter")*.05)*mountRewardMultiplier());state.gold+=gold;state.arena.points+=o.rewardPoints;state.arena.wins++;state.arena.streak++;state.arena.bestStreak=Math.max(state.arena.bestStreak,state.arena.streak);log.unshift(`<strong>Zwycięstwo!</strong> +${o.rewardPoints} pkt ligi, +${gold} złota.`);}else{let lost=Math.min(12,state.arena.points);state.arena.points-=lost;state.arena.losses++;state.arena.streak=0;if(skillBonus("secondWind"))state.energy=Math.min(state.maxEnergy,state.energy+1);log.unshift(`<strong>Porażka.</strong> -${lost} pkt ligi.`);}$("arenaReport").innerHTML=log.map(x=>`<p>${x}</p>`).join("");persistAndRender();}
function dungeonTheme(id){return({cryptOfAsh:"ash",jackalVault:"jackal",blackMarshTemple:"marsh",frozenAbyss:"frost"})[id]||"ash";}
function dungeonEnemy(room){return GAME_DATA.enemies.find(x=>x.id===room.enemy);}
function dungeonImage(enemy){return enemy?.image||"assets/monster-icons/skeleton.webp";}
function renderDungeons(){
  if(!$('dungeonList'))return;
  // Czyścimy uszkodzony zapis aktywnego lochu ze starszych wersji.
  if(state.dungeonRun&&!GAME_DATA.dungeons.some(d=>d.id===state.dungeonRun.id))state.dungeonRun=null;
  $('dungeonList').innerHTML=GAME_DATA.dungeons.map(d=>{
    const lock=state.level<d.level&&state.profileType!=="gm", completed=state.dungeonsCompleted[d.id]||0, theme=dungeonTheme(d.id);
    const active=state.dungeonRun&&state.dungeonRun.id===d.id;
    const rooms=d.rooms.map((room,i)=>{const e=dungeonEnemy(room);return `<div class="dungeon-preview-room ${i===d.rooms.length-1?'boss-room':''}"><img src="${dungeonImage(e)}" alt="${e?.name||room.name}"><span>${i===d.rooms.length-1?'BOSS':'KOMNATA '+(i+1)}</span><strong>${e?.name||room.name}</strong></div>`}).join('');
    return `<article class="dungeon-card dungeon-card-v2 theme-${theme} ${lock?'locked':''} ${active?'active-dungeon':''}" data-dungeon-card="${d.id}" role="button" tabindex="${lock?'-1':'0'}" aria-disabled="${lock}"><div class="dungeon-card-top"><div><span class="dungeon-level">Poziom ${d.level}</span><h3>${d.name}</h3><p>${d.rooms.length} komnaty · koszt ${d.energy} wytrzymałości</p></div><div class="dungeon-completions">Ukończenia<strong>${completed}</strong></div></div><div class="dungeon-room-preview">${rooms}</div><div class="dungeon-reward"><span>Nagroda</span><strong>${d.rewardGold[0]}–${d.rewardGold[1]} złota · ${d.rewardXp} XP</strong></div><button type="button" class="primary-btn dungeon-enter-btn" data-dungeon="${d.id}" ${lock?'disabled':''}>${lock?'🔒 Wymagany poziom '+d.level:(active?'Przejdź do aktywnego lochu':(state.dungeonRun?'Rozpocznij ten loch':'Wejdź do lochu'))}</button></article>`
  }).join('');
  renderDungeonRun();
}
function startDungeon(id){
  const d=GAME_DATA.dungeons.find(x=>x.id===id);if(!d)return;
  const locked=state.level<d.level&&state.profileType!=="gm";
  if(locked){if($('dungeonReport'))$('dungeonReport').innerHTML=`<p>Ten loch wymaga poziomu ${d.level}.</p>`;return;}
  if(state.dungeonRun){
    if(state.dungeonRun.id===id){setTimeout(()=>document.getElementById('dungeonRunPanel')?.scrollIntoView({behavior:'smooth',block:'start'}),30);return;}
    if($('dungeonReport'))$('dungeonReport').innerHTML='<p>Najpierw opuść obecnie aktywny loch.</p>';
    setTimeout(()=>document.getElementById('dungeonRunPanel')?.scrollIntoView({behavior:'smooth',block:'start'}),30);return;
  }
  if(state.energy<d.energy&&state.profileType!=="gm"){$('dungeonReport').innerHTML='<p>Brakuje wytrzymałości.</p>';return;}
  if(state.profileType!=="gm")state.energy-=d.energy;
  state.dungeonRun={id,room:0,hp:combatPower().hp};
  $('dungeonReport').innerHTML='<p><strong>Wrota otwarte.</strong> Pierwsza komnata czeka.</p>';
  persistAndRender();
  setTimeout(()=>document.getElementById('dungeonRunPanel')?.scrollIntoView({behavior:'smooth',block:'start'}),50);
}
function renderDungeonRun(){
  const run=state.dungeonRun,current=$('dungeonCurrentEnemy');
  if(!run){$('dungeonRunTitle').textContent='Brak aktywnego lochu';$('dungeonRunDescription').textContent='Wybierz jeden z dostępnych lochów.';$('dungeonProgress').innerHTML='';$('dungeonFightBtn').disabled=true;$('dungeonLeaveBtn').disabled=true;if($('dungeonRunHp'))$('dungeonRunHp').textContent='HP —';if(current){current.classList.add('hidden');current.innerHTML='';}return;}
  const d=GAME_DATA.dungeons.find(x=>x.id===run.id),room=d.rooms[run.room],e=room?dungeonEnemy(room):null;
  $('dungeonRunTitle').textContent=d.name;$('dungeonRunDescription').textContent=room?`${room.name} · ${run.room+1}/${d.rooms.length}`:'Loch ukończony';
  if($('dungeonRunHp'))$('dungeonRunHp').textContent=`HP ${Math.max(0,run.hp)} / ${combatPower().hp}`;
  $('dungeonProgress').innerHTML=d.rooms.map((x,i)=>{const en=dungeonEnemy(x);return `<div class="dungeon-step ${i<run.room?'done':i===run.room?'active':''}"><img src="${dungeonImage(en)}" alt=""><span>${i+1}</span><small>${en?.name||x.name}</small></div>`}).join('');
  $('dungeonFightBtn').disabled=!room;$('dungeonLeaveBtn').disabled=false;
  if(current&&e){current.classList.remove('hidden');current.innerHTML=`<img src="${dungeonImage(e)}" alt="${e.name}"><div><span class="dungeon-enemy-tag">${run.room===d.rooms.length-1?'BOSS LOCHU':'PRZECIWNIK KOMNATY'}</span><h3>${e.name}</h3><p>${room.name}</p><div class="dungeon-enemy-stats"><span>Życie <strong>${e.hp}</strong></span><span>Atak <strong>${e.attack}</strong></span></div></div>`;}
}
function fightDungeonRoom(){
  const run=state.dungeonRun;if(!run)return;const d=GAME_DATA.dungeons.find(x=>x.id===run.id),room=d.rooms[run.room],e=dungeonEnemy(room),p=combatPower();let ph=run.hp,eh=e.hp,r=0,log=[];
  while(ph>0&&eh>0&&r++<35){let c=Math.random()<.08+skillBonus('criticalEye')*.03,dm=Math.max(1,Math.round(p.attack*(.8+Math.random()*.4)));if(c)dm=Math.round(dm*1.75);eh-=dm;log.push(`Runda ${r}: zadajesz ${dm}${c?' obrażeń krytycznych':' obrażeń'}.`);if(eh<=0)break;let ed=Math.max(1,Math.round(e.attack*(.8+Math.random()*.4)-p.defense*.25));ph-=ed;log.push(`${e.name} zadaje ${ed} obrażeń.`);}
  if(ph>0){run.hp=ph;run.room++;log.unshift(`<strong>Komnata oczyszczona:</strong> ${room.name}.`);if(run.room>=d.rooms.length){let m=1+skillBonus('dungeonMastery')*.06,gold=Math.round(randBetween(d.rewardGold)*m*mountRewardMultiplier()),xp=Math.round(d.rewardXp*m*estateXpMultiplier());state.gold+=gold;state.xp+=xp;state.dungeonsCompleted[d.id]=(state.dungeonsCompleted[d.id]||0)+1;state.chronicle.unshift(`Ukończono loch: ${d.name}.`);state.dungeonRun=null;applyLevelUps(state);log.unshift(`<strong>Boss pokonany — loch ukończony!</strong> +${gold} złota, +${xp} XP.`);}}else{state.dungeonRun=null;if(skillBonus('secondWind'))state.energy=Math.min(state.maxEnergy,state.energy+1);log.unshift('<strong>Porażka. Wyprawa zakończona.</strong>');}
  $('dungeonReport').innerHTML=log.slice(0,10).map(x=>`<p>${x}</p>`).join('');persistAndRender();
}
function leaveDungeon(){state.dungeonRun=null;$('dungeonReport').innerHTML='<p>Opuszczono loch. Zużyta wytrzymałość nie wraca.</p>';persistAndRender();}
function renderSkills(){if(!$("skillTree"))return;$("skillPointsValue").textContent=availableSkillPoints();$("skillTree").innerHTML=GAME_DATA.skillDefinitions.map(s=>{const l=skillBonus(s.id),can=availableSkillPoints()>0&&l<s.max;return`<article class="skill-card ${l>=s.max?"maxed":""}"><span class="skill-icon">${s.icon}</span><h3>${s.name}</h3><p>${s.description}</p><div class="skill-level">Poziom ${l}/${s.max}</div><button class="primary-btn" data-skill="${s.id}" ${can?"":"disabled"}>${l>=s.max?"Maksymalny poziom":"Rozwiń"}</button></article>`}).join("");document.querySelectorAll("[data-skill]").forEach(b=>b.onclick=()=>{const s=GAME_DATA.skillDefinitions.find(x=>x.id===b.dataset.skill);if(availableSkillPoints()>0&&skillBonus(s.id)<s.max){state.skills[s.id]++;state.skillPointsSpent++;persistAndRender();}});}

function processEnergyRegeneration(){if(state.energy>=state.maxEnergy){state.lastEnergyTick=Date.now();return;}const now=Date.now(),points=Math.floor((now-state.lastEnergyTick)/GAME_DATA.energyRegenMs);if(points>0){state.energy=Math.min(state.maxEnergy,state.energy+points);state.lastEnergyTick+=points*GAME_DATA.energyRegenMs;saveGame(state);renderHeader();}}
function openDialogue(id){const d=GAME_DATA.dialogues[id];if(!d)return;$("dialogueImage").src=d.image||"";$("dialogueImage").alt=d.name;$("dialogueRole").textContent=d.role;$("dialogueName").textContent=d.name;$("dialogueText").textContent=d.text;$("dialogueModal").classList.remove("hidden");}



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
function renderAll(){renderHeader();renderWorld();renderEnemies();renderStats();renderEquipment();renderInventory();renderShop();renderQuests();renderBuffs();renderForge();renderAuction();renderBestiary();renderImperium();renderArena();renderDungeons();renderSkills();renderChronicle();renderGm();}
document.body.classList.add("city-mode");
document.querySelectorAll(".nav-btn[data-view]").forEach(b=>b.onclick=()=>showView(b.dataset.view));
document.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>{showView(b.dataset.open);closeMoreMenu();});
const moreMenu=$("moreMenu"),moreNavBtn=$("moreNavBtn");
function openMoreMenu(){moreMenu?.classList.remove("hidden");moreMenu?.setAttribute("aria-hidden","false");moreNavBtn?.setAttribute("aria-expanded","true");}
function closeMoreMenu(){moreMenu?.classList.add("hidden");moreMenu?.setAttribute("aria-hidden","true");moreNavBtn?.setAttribute("aria-expanded","false");}
moreNavBtn&&(moreNavBtn.onclick=openMoreMenu);$("closeMoreMenu")&&($("closeMoreMenu").onclick=closeMoreMenu);moreMenu?.querySelector(".more-menu-backdrop")?.addEventListener("click",closeMoreMenu);
document.querySelectorAll("[data-dialogue]").forEach(b=>b.onclick=()=>openDialogue(b.dataset.dialogue));$("closeDialogue").onclick=()=>$("dialogueModal").classList.add("hidden");$("dialogueModal").onclick=e=>{if(e.target===$("dialogueModal"))$("dialogueModal").classList.add("hidden");};
if($("bestiaryRegionFilter"))$("bestiaryRegionFilter").onchange=renderBestiary;
if($("bestiaryStateFilter"))$("bestiaryStateFilter").onchange=renderBestiary;
if($("auctionFilter"))$("auctionFilter").onchange=renderAuction;
if($("auctionSort"))$("auctionSort").onchange=renderAuction;
if($("refreshAuctionBtn"))$("refreshAuctionBtn").onclick=refreshAuction;

if($("dungeonFightBtn"))$("dungeonFightBtn").onclick=fightDungeonRoom;if($("dungeonLeaveBtn"))$("dungeonLeaveBtn").onclick=leaveDungeon;
if($("togglePhaseBtn"))$("togglePhaseBtn").onclick=toggleWorldPhase;
if($("professionWorkBtn"))$("professionWorkBtn").onclick=workProfession;
if($("claimFortIncomeBtn"))$("claimFortIncomeBtn").onclick=claimFortIncome;
if($("claimEstateIncomeBtn"))$("claimEstateIncomeBtn").onclick=claimEstateIncome;
if($("randomEventBtn"))$("randomEventBtn").onclick=triggerRandomEvent;

$("repairBtn").onclick=repairAll;$("upgradeBtn").onclick=upgradeSelected;$("sellJunkBtn").onclick=sellAllTrophies;$("inventoryFilter").onchange=renderInventory;$("inventorySort").onchange=renderInventory;

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
processEnergyRegeneration();renderAll();setInterval(()=>{processEnergyRegeneration();renderBuffs();if(document.getElementById("view-imperium")?.classList.contains("active"))renderImperium();},1000);
