const SAVE_KEY="project_colosseum_save";

function makeId(){return `${Date.now()}-${Math.random().toString(36).slice(2)}`;}

function createStarterItem(name,slot,type,power,durability=100){
  return {id:makeId(),name,slot,type,power,durability,rarity:"common",rarityName:GAME_DATA.rarities.common.name,color:GAME_DATA.rarities.common.color,kind:"equipment"};
}

function createNewState(){
  return {
    saveVersion:"0.6.0",level:1,xp:0,xpNext:100,gold:120,energy:10,maxEnergy:10,lastEnergyTick:Date.now(),
    hp:100,maxHp:100,statPoints:0,selectedRegion:"outskirts",
    stats:{strength:8,endurance:8,dexterity:7,cunning:5,luck:5},
    equipment:{weapon:createStarterItem("Zużyty Gladius","weapon","Broń",5,72),armor:createStarterItem("Skórzany Kaftan","armor","Pancerz",3,81),helmet:null,shield:null},
    inventory:[],kills:{},quests:{},buffs:{damageUntil:0,damagePercent:0},
    profileType:"player",worldUnlocked:false,chronicle:["Przybyłeś do Vallis jako niewolnik Domu Żelaza."]
  };
}

function normalizeItem(item,fallbackSlot=null){
  if(!item)return null;
  const rarity=item.rarity||"common";const r=GAME_DATA.rarities[rarity]||GAME_DATA.rarities.common;
  return {id:item.id||makeId(),name:item.name||"Nieznany przedmiot",slot:item.slot??fallbackSlot,type:item.type||(fallbackSlot?GAME_DATA.equipmentLabels[fallbackSlot]:"Trofeum"),
    power:Number(item.power)||1,durability:Number.isFinite(item.durability)?item.durability:100,rarity,rarityName:item.rarityName||r.name,color:item.color||r.color,
    kind:item.kind||(item.effect?"consumable":(fallbackSlot||item.slot?"equipment":"trophy")),effect:item.effect||null,amount:item.amount||0,durationMs:item.durationMs||0};
}

function migrateState(raw){
  const fresh=createNewState();const state={...fresh,...raw};
  state.stats={...fresh.stats,...(raw.stats||{})};
  state.equipment={weapon:normalizeItem(raw.equipment?.weapon,"weapon")||fresh.equipment.weapon,armor:normalizeItem(raw.equipment?.armor,"armor")||fresh.equipment.armor,
    helmet:normalizeItem(raw.equipment?.helmet,"helmet"),shield:normalizeItem(raw.equipment?.shield,"shield")};
  state.inventory=Array.isArray(raw.inventory)?raw.inventory.map(i=>normalizeItem(i,i.slot??null)):[];
  state.chronicle=Array.isArray(raw.chronicle)?raw.chronicle:fresh.chronicle;
  state.kills=raw.kills||{};state.quests=raw.quests||{};state.buffs={...fresh.buffs,...(raw.buffs||{})};
  state.maxEnergy=Number(state.maxEnergy)||10;state.energy=Math.min(state.maxEnergy,Number(state.energy)||0);state.lastEnergyTick=Number(state.lastEnergyTick)||Date.now();
  state.selectedRegion=state.selectedRegion||"outskirts";state.profileType=state.profileType||"player";state.worldUnlocked=Boolean(state.worldUnlocked);state.saveVersion="0.6.0";return state;
}

function saveGame(state){localStorage.setItem(SAVE_KEY,JSON.stringify(state));}
function loadGame(){try{const raw=localStorage.getItem(SAVE_KEY);return raw?migrateState(JSON.parse(raw)):createNewState();}catch(e){console.warn(e);return createNewState();}}
function resetSave(){localStorage.removeItem(SAVE_KEY);}
