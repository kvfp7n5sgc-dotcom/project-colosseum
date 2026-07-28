function playerAttack(state){
  const weaponPower=state.equipment.weapon?.power||1;
  const variance=randomInt(-2,3);
  let value=Math.max(1,Math.round(state.stats.strength*1.25+state.stats.dexterity*.35+weaponPower+variance));
  if(state.buffs.damageUntil>Date.now()) value=Math.round(value*(1+state.buffs.damagePercent/100));
  return value;
}
function playerDefense(state){
  const armor=state.equipment.armor?.power||0,helmet=state.equipment.helmet?.power||0,shield=state.equipment.shield?.power||0;
  return Math.round(state.stats.endurance*.4+armor+helmet*.35+shield*.5);
}
function applyLevelUps(state){
  while(state.xp>=state.xpNext){state.xp-=state.xpNext;state.level++;state.xpNext=Math.round(state.xpNext*1.35);state.statPoints+=3;state.maxHp+=10;state.hp=state.maxHp;state.chronicle.unshift(`Awansowałeś na poziom ${state.level}.`);}
}
function damageEquipment(state){Object.values(state.equipment).forEach(i=>{if(i)i.durability=Math.max(0,i.durability-randomInt(1,3));});}
