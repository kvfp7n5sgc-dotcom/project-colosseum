function randomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function rollRarity(){const r=Math.random();if(r<.03)return"legendary";if(r<.10)return"epic";if(r<.30)return"rare";return"common";}
function createLootItem(drop){
  const rarity=drop.forcedRarity||rollRarity(),rd=GAME_DATA.rarities[rarity],base=randomInt(drop.power[0],drop.power[1]);
  return {id:makeId(),name:drop.name,slot:drop.slot,type:drop.type,rarity,rarityName:rd.name,color:rd.color,power:Math.max(1,Math.round(base*rd.multiplier)),durability:100,kind:drop.slot?"equipment":"trophy"};
}
function addItemToInventory(state,item){
  if(state.inventory.length>=GAME_DATA.inventoryLimit)return false;
  state.inventory.push(item);return true;
}
function runCombat(state,enemy){
  if(state.energy<1)return{ok:false,title:"Brak Wytrzymałości",summary:"Poczekaj chwilę na regenerację.",log:[]};
  state.energy--;state.lastEnergyTick=Date.now();state.hp=state.maxHp;
  let enemyHp=enemy.hp,round=1;const log=[];
  while(state.hp>0&&enemyHp>0&&round<=30){
    let damage=playerAttack(state);const crit=Math.random()<Math.min(.25,state.stats.luck*.015);if(crit)damage*=2;
    enemyHp-=damage;log.push(`Runda ${round}: zadajesz ${damage} obrażeń${crit?" — cios krytyczny":""}.`);if(enemyHp<=0)break;
    if(Math.random()<Math.min(.30,state.stats.dexterity*.012)){log.push(`${enemy.name} atakuje, ale unikasz ciosu.`);}
    else{const incoming=Math.max(1,enemy.attack+randomInt(-2,2)-playerDefense(state));state.hp-=incoming;log.push(`${enemy.name} zadaje ci ${incoming} obrażeń.`);}
    round++;
  }
  damageEquipment(state);
  if(state.hp>0){
    const gold=randomInt(enemy.gold[0],enemy.gold[1]);state.gold+=gold;state.xp+=enemy.xp;state.kills[enemy.id]=(state.kills[enemy.id]||0)+1;
    state.chronicle.unshift(`Pokonałeś przeciwnika: ${enemy.name}.`);
    const found=[];
    enemy.drops.forEach(drop=>{if(Math.random()<drop.chance){const item=createLootItem(drop);if(addItemToInventory(state,item)){found.push(item);state.chronicle.unshift(`Zdobyłeś ${item.rarityName.toLowerCase()} przedmiot „${item.name}”.`);}}});
    applyLevelUps(state);
    const lootText=found.length?` Zdobyto: ${found.map(i=>`${i.rarityName} ${i.name}`).join(", ")}.`:(state.inventory.length>=GAME_DATA.inventoryLimit?" Plecak jest pełny.":" Brak dodatkowego łupu.");
    return{ok:true,title:enemy.boss?"Boss pokonany":"Zwycięstwo",summary:`Zdobywasz ${enemy.xp} XP i ${gold} złota.${lootText}`,log};
  }
  state.hp=Math.ceil(state.maxHp*.35);state.chronicle.unshift(`Zostałeś pokonany przez: ${enemy.name}.`);
  return{ok:true,title:"Porażka",summary:"Wracasz do Vallis ciężko ranny, ale zachowujesz przedmioty.",log};
}
