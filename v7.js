const DURATION=86;
const $=s=>document.querySelector(s);
const all=s=>[...document.querySelectorAll(s)];
const cursor=$('#cursor'),touch=$('#touch'),scrubber=$('#scrubber'),readout=$('#timeReadout');
let startAt=0,pausedAt=0,playing=false,raf=null;

const sceneIds=['desktop','seller','customer','packshot'];
const clickableSelectors=['#initialMail','#initialArtworkAttachment','#fileV1','#createOrderBtn','#inviteBtn','#mobileNotification','#editBtn','#copyField','#claimField','#saveBtn','#confirmBtn','#employeeConfirmBtn'];

function show(sel,on=true){const e=$(sel);if(!e)return;e.classList.toggle('hidden',!on)}
function scene(id){sceneIds.forEach(x=>{const e=$('#'+x);e.classList.toggle('active',x===id);e.style.opacity=x===id?'1':'0';e.style.transform='';e.style.zIndex=x===id?'2':''})}
function flip(from,to,p){p=Math.max(0,Math.min(1,p));sceneIds.forEach(x=>{const e=$('#'+x);e.classList.remove('active','flip-from','flip-to');e.style.opacity='0';e.style.transform='';e.style.zIndex='' });const a=$('#'+from),b=$('#'+to);a.classList.add('active','flip-from');b.classList.add('active','flip-to');a.style.zIndex='3';b.style.zIndex='2';a.style.opacity=String(Math.max(0,1-p*.9));b.style.opacity=String(Math.max(0,(p-.12)/.88));a.style.transform=`rotateY(${-100*p}deg) scale(${1-.035*p})`;b.style.transform=`rotateY(${100*(1-p)}deg) scale(${.965+.035*p})`}
function inRange(t,a,b){return t>=a&&t<b}
function fmt(t){const m=Math.floor(t/60),s=(t%60).toFixed(1).padStart(4,'0');return `${m}:${s}`}
function center(sel){const e=$(sel);if(!e)return null;const r=e.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}}
function pointerTo(sel,click=false){const p=center(sel);if(!p)return;show('#touch',false);show('#cursor',true);cursor.style.left=(p.x-2)+'px';cursor.style.top=(p.y-2)+'px';cursor.classList.toggle('click',click)}
function touchTo(sel,tap=false){const p=center(sel);if(!p)return;show('#cursor',false);show('#touch',true);touch.style.left=p.x+'px';touch.style.top=p.y+'px';touch.classList.toggle('tap',tap)}
function clearFeedback(){show('#cursor',false);show('#touch',false);cursor.classList.remove('click');touch.classList.remove('tap');clickableSelectors.forEach(s=>$(s)?.classList.remove('click-target'))}
function feedback(sel,kind,click){if(!sel)return;if(kind==='touch')touchTo(sel,click);else pointerTo(sel,click);if(click)$(sel)?.classList.add('click-target')}
function typed(text,t,start,end){if(t<=start)return'';if(t>=end)return text;const n=Math.max(0,Math.min(text.length,Math.floor((t-start)/(end-start)*text.length)));return text.slice(0,n)}
function z(id,v){const e=$('#'+id);if(e)e.style.zIndex=String(v)}

function apply(t){
  t=Math.max(0,Math.min(DURATION,t));

  /* ---------- scenes ---------- */
  if(t<37)scene('desktop');
  else if(t<48)scene('seller');
  else if(t<49)flip('seller','customer',t-48);
  else if(t<72)scene('customer');
  else if(t<73)flip('customer','seller',t-72);
  else if(t<82)scene('seller');
  else scene('packshot');

  /* ---------- old way: readable setup first, then controlled escalation ---------- */
  let outlook=inRange(t,1.5,37),teams=inRange(t,8,37),explorer=inRange(t,12,37),pdf=inRange(t,15,37);
  let reply1=inRange(t,18,37),reply2=inRange(t,21,37),reply3=inRange(t,28.6,37),prepress=inRange(t,30.2,37),production=inRange(t,31.6,37);
  let msg2=inRange(t,19.5,37),msg3=inRange(t,22.3,37);
  let fv2=inRange(t,23.4,37),fv3=inRange(t,24.7,37),ffinal=inRange(t,25.8,37),fapproved=inRange(t,27,37),fapproved2=inRange(t,28,37);
  const rew=inRange(t,33,37);show('#rewind',rew);
  if(inRange(t,33.6,37))production=false;
  if(inRange(t,34.1,37)){prepress=false;reply3=false;}
  if(inRange(t,34.6,37)){fapproved2=false;fapproved=false;ffinal=false;}
  if(inRange(t,35.1,37)){fv3=false;fv2=false;}
  if(inRange(t,35.6,37)){reply2=false;msg3=false;msg2=false;}
  if(inRange(t,36,37))pdf=false;
  if(inRange(t,36.3,37))explorer=false;
  if(inRange(t,36.6,37)){teams=false;reply1=false;}

  show('#outlook',outlook);show('#teams',teams);show('#explorer',explorer);show('#pdf',pdf);show('#reply1',reply1);show('#reply2',reply2);show('#reply3',reply3);show('#prepressToast',prepress);show('#productionToast',production);
  all('.msg')[1]?.classList.toggle('show',msg2);all('.msg')[2]?.classList.toggle('show',msg3);
  const rows=all('.folder-row');rows[1]?.classList.toggle('show',fv2);rows[2]?.classList.toggle('show',fv3);rows[3]?.classList.toggle('show',ffinal);rows[4]?.classList.toggle('show',fapproved);rows[5]?.classList.toggle('show',fapproved2);
  const finalPdf=t>=25.8&&!inRange(t,35.1,37);$('#pdfTitle').textContent=finalPdf?'Willow_Label_FINAL.pdf':'Willow_Label_v1.pdf';$('#pdfArtwork').src=finalPdf?'./assets/willow-label-v2.svg':'./assets/willow-label-v1.svg';
  z('outlook',12);z('teams',18);z('explorer',22);z('pdf',28);

  /* ---------- seller ---------- */
  const created=t>=41.5;
  show('#sellerCreate',!created&&inRange(t,37,48));show('#sellerOrder',created&&(inRange(t,37,48)||inRange(t,73,82)));
  $('#sellerTitle').textContent=created?'ORD-2482':'New Order';
  let status='In review';if(t>=46)status='Invite sent';if(t>=73)status='Customer confirmed';if(t>=77)status='Preparing print files';if(t>=79.5)status='Ready for production';$('#orderStatus').textContent=status;
  const sellerV2=t>=73;$('#versionTag').textContent=sellerV2?'Version 2':'Version 1';$('#sellerArtwork').src=sellerV2?'./assets/willow-label-v2.svg':'./assets/willow-label-v1.svg';
  show('#customerSaved',inRange(t,73,82));show('#histV2',inRange(t,73,82));show('#histConfirmed',inRange(t,73,82));show('#employeeConfirm',inRange(t,73,77));show('#pipelineState',inRange(t,77,79.5));show('#readyState',inRange(t,79.5,82));

  /* ---------- customer hand-off ---------- */
  show('#mobileHome',inRange(t,48,52));show('#mobileNotification',inRange(t,49,52));show('#mobileBrowser',t>=52&&t<72);
  show('#mobileOrder',inRange(t,52,56)||inRange(t,67,70));show('#mobileEditor',inRange(t,56,67));show('#mobileConfirmed',inRange(t,70,72));
  const mobileV2=t>=67;$('#mobileArtwork').src=mobileV2?'./assets/willow-label-v2.svg':'./assets/willow-label-v1.svg';$('#mobileVersion').textContent=mobileV2?'Current design · Version 2':'Current design · Version 1';show('#confirmBtn',inRange(t,67,70));

  /* live editable copy: both field and artwork update together */
  let product='Organic Sourdough',claim='Made with simple ingredients';
  if(t>=58)product=typed('Sourdough Boule',t,58,60.4);if(t>=60.4)product='Sourdough Boule';
  if(t>=61.8)claim=typed('No artificial flavors',t,61.8,64.5);if(t>=64.5)claim='No artificial flavors';
  $('#copyField').value=product;$('#claimField').value=claim;$('#editorProductLive').textContent=product||' ';$('#editorClaimLive').textContent=claim||' ';
  $('#copyField').classList.toggle('focused',inRange(t,57.2,60.5));$('#claimField').classList.toggle('focused',inRange(t,61,64.6));
  all('.editor-copy-mask').forEach((e,i)=>e.classList.toggle('updating',i===0?inRange(t,58,60.5):inRange(t,61.8,64.6)));
  show('#editSelection',inRange(t,57.2,64.6));

  /* ---------- deterministic cursor / tap targets from actual DOM geometry ---------- */
  clearFeedback();let target=null,kind='mouse',click=false;
  if(inRange(t,2.6,5.7))target='#initialMail';
  if(inRange(t,5.7,7.2)){target='#initialArtworkAttachment';click=inRange(t,6.2,6.6);}
  if(inRange(t,9,11.4))target='#teams';
  if(inRange(t,13,14.8)){target='#fileV1';click=inRange(t,13.5,13.9);}
  if(inRange(t,38.3,41.5)){target='#createOrderBtn';click=inRange(t,40.7,41.1);}
  if(inRange(t,43.5,46)){target='#inviteBtn';click=inRange(t,45.1,45.5);}
  if(inRange(t,49.7,52)){target='#mobileNotification';kind='touch';click=inRange(t,51.1,51.55);}
  if(inRange(t,54,56)){target='#editBtn';kind='touch';click=inRange(t,55.1,55.5);}
  if(inRange(t,57.1,58)){target='#copyField';kind='touch';click=inRange(t,57.35,57.7);}
  if(inRange(t,60.8,61.8)){target='#claimField';kind='touch';click=inRange(t,61.05,61.4);}
  if(inRange(t,65.1,67)){target='#saveBtn';kind='touch';click=inRange(t,66.05,66.45);}
  if(inRange(t,68,70)){target='#confirmBtn';kind='touch';click=inRange(t,69.05,69.45);}
  if(inRange(t,74,77)){target='#employeeConfirmBtn';click=inRange(t,75.6,76);}
  if(target)feedback(target,kind,click);

  /* Rewind pointer visibly moves backwards through the same story. */
  if(rew){const rw=t<33.8?'#productionToast':t<34.5?'#reply3':t<35.2?'#fileV1':t<36?'#pdf':t<36.6?'#teams':'#initialMail';feedback(rw,'mouse',false)}

  readout.textContent=`${fmt(t)} / ${fmt(DURATION)}`;scrubber.max=DURATION;scrubber.value=t;
}

function tick(now){if(!playing)return;const t=Math.min(DURATION,(now-startAt)/1000);pausedAt=t;apply(t);if(t>=DURATION){playing=false;cancelAnimationFrame(raf);return}raf=requestAnimationFrame(tick)}
function play(){if(playing)return;playing=true;startAt=performance.now()-pausedAt*1000;raf=requestAnimationFrame(tick)}
function pause(){if(!playing)return;playing=false;pausedAt=(performance.now()-startAt)/1000;cancelAnimationFrame(raf);apply(pausedAt)}
function restart(){playing=false;pausedAt=0;cancelAnimationFrame(raf);apply(0)}
$('#playBtn').onclick=play;$('#pauseBtn').onclick=pause;$('#restartBtn').onclick=restart;scrubber.oninput=e=>{pause();pausedAt=+e.target.value;apply(pausedAt)};
document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='h')$('#devControls').classList.toggle('hidden');if(e.code==='Space'){e.preventDefault();playing?pause():play()}if(e.key.toLowerCase()==='r')restart();if(e.key==='ArrowRight'){pause();pausedAt=Math.min(DURATION,pausedAt+5);apply(pausedAt)}if(e.key==='ArrowLeft'){pause();pausedAt=Math.max(0,pausedAt-5);apply(pausedAt)}});
const params=new URLSearchParams(location.search);if(params.get('controls')==='0')show('#devControls',false);const start=Number(params.get('start')||0);pausedAt=Number.isFinite(start)?Math.max(0,Math.min(DURATION,start)):0;apply(pausedAt);if(params.get('autoplay')==='1')play();
