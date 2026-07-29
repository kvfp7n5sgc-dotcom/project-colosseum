(function(){
  'use strict';
  function byId(id){ return document.getElementById(id); }
  function safeShow(name){
    var target=byId('view-'+name);
    if(!target){ return false; }
    document.querySelectorAll('.view').forEach(function(view){ view.classList.remove('active'); });
    target.classList.add('active');
    document.body.classList.toggle('city-mode', name==='city');
    document.querySelectorAll('.game-dock .nav-btn').forEach(function(btn){ btn.classList.remove('active'); });
    var direct=document.querySelector('.game-dock .nav-btn[data-view="'+name+'"]');
    if(direct){ direct.classList.add('active'); }
    var menu=byId('moreMenu');
    if(menu){ menu.classList.add('hidden'); menu.setAttribute('aria-hidden','true'); }
    var more=byId('moreNavBtn');
    if(more){ more.setAttribute('aria-expanded','false'); }
    window.scrollTo(0,0);
    return true;
  }
  function ensureExpeditions(){
    try{
      if(typeof renderWorld==='function') renderWorld();
      if(typeof renderEnemies==='function') renderEnemies();
    }catch(err){ console.error('Expeditions render error:',err); }
  }
  function bind(){
    document.addEventListener('click',function(event){
      var nav=event.target.closest('.game-dock .nav-btn[data-view]');
      if(nav){
        event.preventDefault();
        event.stopPropagation();
        var view=nav.getAttribute('data-view');
        safeShow(view);
        if(view==='world'||view==='expeditions') ensureExpeditions();
        return;
      }
      var opener=event.target.closest('[data-open]');
      if(opener){
        var viewName=opener.getAttribute('data-open');
        if(viewName && safeShow(viewName)){
          event.preventDefault();
          if(viewName==='world'||viewName==='expeditions') ensureExpeditions();
        }
      }
    },true);

    // iOS Safari can keep an old body class after restoring a page from cache.
    window.addEventListener('pageshow',function(){
      var active=document.querySelector('.view.active');
      document.body.classList.toggle('city-mode', !!active && active.id==='view-city');
      ensureExpeditions();
    });
    ensureExpeditions();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind);
  else bind();
  window.safeShowGameView=safeShow;
})();
