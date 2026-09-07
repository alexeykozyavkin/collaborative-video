(()=>{
  const SOURCE_URL='app-v8.js?v=8';
  const BUG='scrubber.value=Math.round(t*100);base=t;lastT=t';
  const FIX='scrubber.value=Math.round(t*100);lastT=t';

  fetch(SOURCE_URL,{cache:'no-store'})
    .then(r=>{if(!r.ok)throw new Error(`Failed to load ${SOURCE_URL}: ${r.status}`);return r.text()})
    .then(src=>{
      if(!src.includes(BUG))throw new Error('Timing patch target was not found in app-v8.js');
      const fixed=src.replace(BUG,FIX);
      (0,eval)(fixed);
    })
    .catch(err=>{
      console.error('Collaborative Order video bootstrap failed',err);
      const el=document.getElementById('time');
      if(el)el.textContent='Playback error — check console';
    });
})();
