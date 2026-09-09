const DURATION=80;
const $=s=>document.querySelector(s);
const all=s=>[...document.querySelectorAll(s)];
const cursor=$('#cursor'), scrubber=$('#scrubber'), readout=$('#timeReadout');
let startAt=0, pausedAt=0, playing=false, raf=null, lastT=-1;

function show(sel,on=true){const e=$(sel);if(!e)return;e.classList.toggle('hidden',!on)}
function clearScenes(){all('.scene').forEach(e=>{e.classList.remove('active','flip-from','flip-to');e.style.opacity='0';e.style.transform='';e.style.zIndex=''})}
function scene(id){clearScenes();const e=$('#'+id);e.classList.add('active');e.style.opacity='1';e.style.transform='rotateY(0deg)';e.style.zIndex='2'}
function flip(from,to,p){p=Math.max(0,Math.min(1,p));clearScenes();const a=$('#'+from),b=$('#'+to);a.classList.add('active','flip-from');b.classList.add('active','flip-to');a.style.zIndex='3';b.style.zIndex='2';a.style.opacity=String(Math.max(0,1-p*.9));b.style.opacity=String(Math.max(0,(p-.12)/.88));a.style.transform=`rotateY(${-100*p}deg) scale(${1-.035*p})`;b.style.transform=`rotateY(${100*(1-p)}deg) scale(${.965+.035*p})`}
function moveCursor(x,y,click=false){show('#cursor',true);cursor.style.left=x+'px';cursor.style.top=y+'px';if(click){cursor.classList.remove('click');void cursor.offsetWidth;cursor.classList.add('click')}}
function fmt(t){const m=Math.floor(t/60),s=(t%60).toFixed(1).padStart(4,'0');return `${m}:${s}`}

function resetVisual(){
  scene('desktop');show('#cursor',false);show('#rewind',false);
  ['#teams','#explorer','#pdf','#reply1','#reply2','#reply3','#prepressToast'].forEach(s=>show(s,false));
  all('.msg').forEach((e,i)=>{if(i>0)e.classList.remove('show')});
  all('.folder-row').forEach((e,i)=>{if(i>0)e.classList.remove('show')});
  show('#sellerCreate',true);show('#sellerOrder',false);$('#sellerTitle').textContent='New Order';
  show('#customerSaved',false);show('#histV2',false);show('#histConfirmed',false);show('#employeeConfirm',false);show('#submitted',false);show('#pipelineState',false);show('#readyState',false);
  $('#versionTag').textContent='Version 1';$('#sellerArtwork').src='./assets/willow-label-v1.svg';
  show('#mobileOrder',true);show('#mobileEditor',false);show('#mobileConfirmed',false);show('#confirmBtn',false);
  $('#mobileArtwork').src='./assets/willow-label-v1.svg';$('#editorArtwork').src='./assets/willow-label-v1.svg';$('#mobileVersion').textContent='Current design · Version 1';
  $('#copyField').value='Made with simple ingredients';$('#claimField').value='';show('#editSelection',false);$('#inviteBtn').textContent='Invite customer';$('#inviteBtn').style.background='';
}

function apply(t){
  if(t<lastT||t<.1)resetVisual();lastT=t;

  /* 0:00–0:15 — deliberately slower old-way prelude */
  if(t<15){scene('desktop');show('#rewind',false);
    if(t>1.2)moveCursor(520,210);
    if(t>4.4){show('#teams',true);moveCursor(1460,320,true)}
    if(t>6.4)all('.msg')[1]?.classList.add('show');
    if(t>7.8){show('#reply1',true);moveCursor(1650,120)}
    if(t>9.2)show('#reply2',true);
    if(t>10.2){show('#explorer',true);all('.folder-row')[1]?.classList.add('show')}
    if(t>11.1){all('.folder-row')[2]?.classList.add('show');show('#pdf',true)}
    if(t>12.0){all('.folder-row')[3]?.classList.add('show');all('.msg')[2]?.classList.add('show');show('#prepressToast',true)}
    if(t>13.0)all('.folder-row')[4]?.classList.add('show');
    if(t>14.0){all('.folder-row')[5]?.classList.add('show');show('#reply3',true);moveCursor(1050,650)}
  }
  /* 0:15–0:18 — rewind */
  else if(t<18){scene('desktop');show('#rewind',true);show('#cursor',false)}
  /* 0:18–0:30 — seller creates and invites */
  else if(t<30){show('#rewind',false);scene('seller');
    if(t<23){show('#sellerCreate',true);show('#sellerOrder',false);moveCursor(1640,790)}
    else{show('#sellerCreate',false);show('#sellerOrder',true);$('#sellerTitle').textContent='ORD-2482';moveCursor(1640,175,t<24)}
    if(t>=26){$('#inviteBtn').textContent='Customer invited ✓';$('#inviteBtn').style.background='#17a673'}
  }
  /* flip to customer */
  else if(t<31){show('#rewind',false);flip('seller','customer',t-30);show('#cursor',false)}
  /* 0:31–0:40 — customer reviews on mobile */
  else if(t<40){scene('customer');show('#mobileOrder',true);show('#mobileEditor',false);show('#mobileConfirmed',false);moveCursor(1125,760)}
  /* 0:40–0:49 — customer makes all artwork changes */
  else if(t<49){scene('customer');show('#mobileOrder',false);show('#mobileEditor',true);show('#mobileConfirmed',false);
    if(t>41.5){show('#editSelection',true);$('#copyField').value='No artificial flavors';$('#claimField').value='Sourdough Boule'}
    if(t>45){$('#editorArtwork').src='./assets/willow-label-v2.svg';moveCursor(1120,180,t<45.8)}
  }
  /* flip back to seller */
  else if(t<50){flip('customer','seller',t-49);show('#cursor',false)}
  /* 0:50–0:57 — seller sees Version 2 */
  else if(t<57){scene('seller');show('#sellerCreate',false);show('#sellerOrder',true);$('#sellerTitle').textContent='ORD-2482';$('#versionTag').textContent='Version 2';$('#sellerArtwork').src='./assets/willow-label-v2.svg';show('#customerSaved',true);show('#histV2',true);moveCursor(1330,490)}
  /* flip to customer for final review */
  else if(t<58){flip('seller','customer',t-57);show('#cursor',false)}
  /* 0:58–1:06 — customer confirms exact version */
  else if(t<66){scene('customer');$('#mobileArtwork').src='./assets/willow-label-v2.svg';$('#mobileVersion').textContent='Current design · Version 2';show('#mobileEditor',false);
    if(t<62.5){show('#mobileOrder',true);show('#mobileConfirmed',false);show('#confirmBtn',true);moveCursor(1110,810,t>61.5)}
    else{show('#mobileOrder',false);show('#mobileConfirmed',true)}
  }
  /* flip back to seller */
  else if(t<67){flip('customer','seller',t-66);show('#cursor',false)}
  /* 1:07–1:16 — employee confirmation and production preparation */
  else if(t<76){scene('seller');show('#sellerOrder',true);$('#versionTag').textContent='Version 2';$('#sellerArtwork').src='./assets/willow-label-v2.svg';show('#customerSaved',true);show('#histV2',true);show('#histConfirmed',true);
    if(t<70){show('#employeeConfirm',true);moveCursor(1580,850,t>69)}else{show('#employeeConfirm',false);show('#submitted',true)}
    if(t>=72){show('#submitted',false);show('#pipelineState',true)}
    if(t>=74){show('#pipelineState',false);show('#readyState',true)}
  }
  else{scene('packshot');show('#cursor',false)}

  readout.textContent=`${fmt(t)} / 1:20.0`;scrubber.max=DURATION;scrubber.value=t;
}

function tick(now){if(!playing)return;const t=Math.min(DURATION,(now-startAt)/1000);apply(t);if(t>=DURATION){playing=false;cancelAnimationFrame(raf);return}raf=requestAnimationFrame(tick)}
function play(){if(playing)return;playing=true;startAt=performance.now()-pausedAt*1000;raf=requestAnimationFrame(tick)}
function pause(){if(!playing)return;playing=false;pausedAt=(performance.now()-startAt)/1000;cancelAnimationFrame(raf)}
function restart(){playing=false;pausedAt=0;lastT=-1;resetVisual();apply(0);play()}

$('#playBtn').onclick=play;$('#pauseBtn').onclick=pause;$('#restartBtn').onclick=restart;
scrubber.oninput=e=>{pause();pausedAt=+e.target.value;lastT=-1;apply(pausedAt)};
document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='h')$('#devControls').classList.toggle('hidden');if(e.code==='Space'){e.preventDefault();playing?pause():play()}if(e.key.toLowerCase()==='r')restart()});
resetVisual();apply(0);
