/* Shared persisted monument collections. Preserves existing storage keys and array order. */
window.ArchiSpotterStorage=(function(){
  var keys=Object.freeze({favorites:'archispotter_preview_favorites',trip:'archispotter_preview_trip'});
  function read(key){
    try{
      var value=JSON.parse(localStorage.getItem(key)||'[]');
      return Array.isArray(value)?value.filter(function(item){return typeof item==='string';}):[];
    }catch(_){return [];}
  }
  function write(key,items){
    if(!Array.isArray(items))return false;
    try{
      localStorage.setItem(key,JSON.stringify(items.filter(function(item){return typeof item==='string';})));
      return true;
    }catch(_){return false;}
  }
  return Object.freeze({keys:keys,read:read,write:write});
})();
