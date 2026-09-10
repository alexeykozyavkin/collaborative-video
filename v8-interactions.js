(()=>{
  let currentT=0;
  const q=s=>document.querySelector(s);
  const touch=q('#touch');
  const touchPulse=touch?.querySelector('span');

  /* Restore the one-click recording action: restart, hide controls, play. */
  const controls=q('#devControls');
  if(controls&&!q('#actionBtn')){
    const action=document.createElement('button');
    action.id='actionBtn';
    action.textContent='▶ Action';
    action.title='Restart from the beginning, hide controls, and play';
    controls.prepend(action);
    action.addEventListener('click',()=>{
      if(typeof window.restart==='function')window.restart();
      controls.classList.add('hidden');
      requestAnimationFrame(()=>{ if(typeof window.play==='function')window.play(); });
    });
  }

  /* Natural touch feedback: a short contact + ripple, never a hovering pointer. */
  const style=document.createElement('style');
  style.textContent=`
    #actionBtn{background:#e66000!important;color:#fff!important;font-weight:700}
    #actionBtn:hover{background:#c84f00!important}
    .touch.natural-tap{display:block!important;opacity:1!important;transition:none!important}
    .touch.natural-tap span{animation:none!important;opacity:var(--touch-ring-opacity,0)!important;transform:scale(var(--touch-ring-scale,.65))!important;background:rgba(230,96,0,.08)!important;border-color:rgba(230,96,0,.58)!important;box-shadow:0 0 0 5px rgba(230,96,0,.07)!important}
    .touch.natural-tap::after{content:"";position:absolute;left:50%;top:50%;width:12px;height:12px;border-radius:50%;background:rgba(230,96,0,.72);transform:translate(-50%,-50%) scale(var(--touch-dot-scale,1));opacity:var(--touch-dot-opacity,0)}
  `;
  document.head.appendChild(style);

  const tapMoments={
    '#mobileNotification':60.225,
    '#editBtn':64.325,
    '#copyField':66.05,
    '#claimField':70.15,
    '#saveBtn':75.225,
    '#confirmBtn':78.225
  };

  function hideNaturalTouch(){
    if(!touch)return;
    touch.classList.remove('natural-tap','tap');
    touch.style.removeProperty('--touch-ring-opacity');
    touch.style.removeProperty('--touch-ring-scale');
    touch.style.removeProperty('--touch-dot-opacity');
    touch.style.removeProperty('--touch-dot-scale');
  }

  function renderNaturalTouch(sel){
    if(!touch||!touchPulse)return;
    const at=tapMoments[sel];
    if(typeof at!=='number')return;
    const dt=currentT-at;
    const pre=.18,post=.42;
    if(dt < -pre || dt > post){
      touch.classList.add('hidden');
      hideNaturalTouch();
      return;
    }

    const el=q(sel);if(!el)return;
    const r=el.getBoundingClientRect();
    q('#cursor')?.classList.add('hidden');
    touch.classList.remove('hidden','tap');
    touch.classList.add('natural-tap');
    touch.style.left=(r.left+r.width/2)+'px';
    touch.style.top=(r.top+r.height/2)+'px';

    let ringOpacity,ringScale,dotOpacity,dotScale;
    if(dt<0){
      const p=(dt+pre)/pre;
      ringOpacity=.25+.45*p;
      ringScale=.82-.20*p;
      dotOpacity=.18+.62*p;
      dotScale=1.18-.26*p;
    }else{
      const p=Math.min(1,dt/post);
      ringOpacity=.70*(1-p);
      ringScale=.62+1.00*p;
      dotOpacity=.80*Math.max(0,1-p*1.7);
      dotScale=.92-.18*Math.min(1,p*1.7);
    }
    touch.style.setProperty('--touch-ring-opacity',ringOpacity.toFixed(3));
    touch.style.setProperty('--touch-ring-scale',ringScale.toFixed(3));
    touch.style.setProperty('--touch-dot-opacity',dotOpacity.toFixed(3));
    touch.style.setProperty('--touch-dot-scale',dotScale.toFixed(3));
  }

  const originalFeedback=window.feedback;
  if(typeof originalFeedback==='function'){
    window.feedback=function(sel,kind,click){
      /* Teams is removed in v8-polish. The old v8 target made the cursor jump
         to the hidden Teams window and back to Explorer every frame around 11 s. */
      if(currentT>=8.4&&currentT<11.5&&sel==='#teams')sel='#explorer';

      if(kind==='touch'&&Object.prototype.hasOwnProperty.call(tapMoments,sel)){
        renderNaturalTouch(sel);
        return;
      }
      hideNaturalTouch();
      originalFeedback(sel,kind,click);
    };
  }

  const polishedApply=window.apply;
  if(typeof polishedApply==='function'){
    window.apply=function(t){
      currentT=t;
      polishedApply(t);
      const activeTap=Object.entries(tapMoments).some(([sel,at])=>{
        const dt=t-at;
        return dt>=-.18&&dt<=.42&&q(sel)&&q('#customer')?.classList.contains('active');
      });
      if(!activeTap)hideNaturalTouch();
    };
  }
})();
