(function(){
  "use strict";
  function openDungeonFrom(target){
    var el=target.closest("[data-dungeon], [data-dungeon-card]");
    if(!el)return false;
    var id=el.getAttribute("data-dungeon")||el.getAttribute("data-dungeon-card");
    if(!id)return false;
    var card=el.closest(".dungeon-card");
    if(card&&card.getAttribute("aria-disabled")==="true")return true;
    if(typeof startDungeon==="function")startDungeon(id);
    return true;
  }
  document.addEventListener("click",function(e){
    if(openDungeonFrom(e.target)){e.preventDefault();e.stopPropagation();}
  },true);
  document.addEventListener("keydown",function(e){
    if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-dungeon-card]")){
      e.preventDefault();openDungeonFrom(e.target);
    }
  });
  document.addEventListener("click",function(e){
    var opener=e.target.closest('[data-open="dungeons"]');
    if(opener&&typeof renderDungeons==="function")setTimeout(renderDungeons,0);
  },true);
})();
