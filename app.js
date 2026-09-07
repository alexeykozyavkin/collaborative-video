(()=>{
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const stage=$('#stage'), cursor=$('#cursor'), ring=$('#clickRing'), film=$('#rewindFilm'), toast=$('#toast'), browser=$('#browser');
  const W={outlook:$('#outlook'),teams:$('#teams'),explorer:$('#explorer'),pdf1:$('#pdf1'),pdf2:$('#pdf2'),qa:$('#qa'),production:$('#production')};
  const END=46;
  let topZ=80,playing=false,startPerf=0,base=0,speed=1,raf=0,rewinding=false;
  const fired=new Set();

  const initialMail={
    subject:'New order request — Roll label 60 × 40 mm',
    meta:'Emma Cole <emma@willowandco.example> · Today 9:41 AM',
    body:'<p>Hi Dana,</p><p>We need <b>5,000 roll labels</b> for our sourdough bread line.</p><p>Size: <b>60 × 40 mm</b><br>Needed by: <b>Jun 18</b></p><p>I attached the current label artwork, our brief and logo. We may need a few text updates before approval.</p>',
    attachments:[['PDF','Willow_Brief.pdf'],['PDF','Willow_Label_v1.pdf'],['PNG','Willow_Logo.png']]
  };
  const revisionMail={
    subject:'Re: New order request — text update',
    meta:'Emma Cole <emma@willowandco.example> · Today 10:03 AM',
    body:'<p>Hi Dana,</p><p>Could you change the text to <b>“No artificial flavors”</b>?</p><p>Also, can you confirm that <b>60 × 40 mm</b> is the final trim size?</p><p>And should the product name read <b>“Sourdough Boule”</b> or <b>“Organic Sourdough”</b>?</p>',
    attachments:[]
  };

  function fit(){const s=Math.max(innerWidth/1920,innerHeight/1080);stage.style.transform=`scale(${s})`}
  addEventListener('resize',fit);fit();
  if(new URLSearchParams(location.search).get('record')==='1') document.body.classList.add('recording');

  function front(el){el.style.zIndex=++topZ}
  Object.values(W).forEach(w=>w.addEventListener('mousedown',()=>front(w)));
  function task(id,on=true){$('#'+id)?.classList.toggle('active',on)}
  function show(name){const w=W[name];if(!w)return;w.classList.remove('hiding');w.classList.add('visible');front(w);const map={outlook:'tbOutlook',teams:'tbTeams',explorer:'tbExplorer',pdf1:'tbPdf',pdf2:'tbPdf'};if(map[name])task(map[name])}
  function hide(name){const w=W[name];if(!w)return;w.classList.add('hiding');w.classList.remove('visible');setTimeout(()=>w.classList.remove('hiding'),300/speed)}

  function renderMail(m){const a=m.attachments.map(([t,n])=>`<div class="attachment"><span class="file-badge ${t==='PNG'?'png':''}">${t}</span><div><b>${n}</b><br><small>attached file</small></div></div>`).join('');$('#mailView').innerHTML=`<h1>${m.subject}</h1><div class="mail-meta">${m.meta}</div>${m.body}<div class="attachments">${a}</div>`}
  function selectMail(sel){$$('.mail-item').forEach(x=>x.classList.remove('selected','current'));const el=$(sel);if(el){el.classList.add('selected','current','flash');setTimeout(()=>el.classList.remove('flash'),350/speed)}}
  function addMail(id,sender,subject,preview){if($('#'+id))return;const d=document.createElement('div');d.id=id;d.className='mail-item';d.innerHTML=`<b>${sender}</b><span>${subject}</span><small>${preview}</small>`;$('#mailList').prepend(d)}
  function removeMail(id){$('#'+id)?.remove()}

  function seedFiles(){if($('#f-v1'))return;[['f-brief','Willow_Brief.pdf','Jun 10, 9:42 AM','1.2 MB',''],['f-v1','Willow_Label_v1.pdf','Jun 10, 9:43 AM','2.1 MB',''],['f-logo','Willow_Logo.png','Jun 10, 9:43 AM','680 KB','png']].forEach(x=>addFile(...x))}
  function addFile(id,name,date,size,type=''){if($('#'+id))return;const d=document.createElement('div');d.id=id;d.className='file-row';d.innerHTML=`<div class="name"><span class="mini-file ${type}"></span>${name}</div><span>${date}</span><span>${size}</span>`;$('#fileList').appendChild(d)}
  function removeFile(id){$('#'+id)?.remove()}
  function selectFile(id){$$('.file-row').forEach(x=>x.classList.remove('selected'));const el=$('#'+id);if(el){el.classList.add('selected','flash');setTimeout(()=>el.classList.remove('flash'),350/speed)}}

  function msg(id,initial,cls,name,role,text){if($('#'+id))return;const d=document.createElement('div');d.id=id;d.className='thread-msg';d.innerHTML=`<div class="avatar ${cls}">${initial}</div><div class="msg"><b>${name}</b><small>${role}</small><p>${text}</p></div>`;$('#thread').appendChild(d)}
  function removeMsg(id){$('#'+id)?.remove()}
  function seedMsgs(){msg('m1','D','blue','Dana','CSR','New Willow & Co. order: 5,000 roll labels needed by Jun 18. Initial artwork arrived by email.');msg('m2','N','purple','Nora','Designer','Do we have the final trim size confirmed before I touch the artwork?')}

  function move(x,y,d=650){cursor.style.opacity=1;const from=cursor.style.transform||'translate3d(1700px,980px,0)',to=`translate3d(${x}px,${y}px,0)`;const a=cursor.animate([{transform:from},{transform:to}],{duration:d/speed,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'});a.onfinish=()=>cursor.style.transform=to}
  function click(x,y,target){ring.classList.remove('go');void ring.offsetWidth;ring.style.left=x+'px';ring.style.top=y+'px';ring.classList.add('go');cursor.classList.remove('press');void cursor.offsetWidth;cursor.classList.add('press');setTimeout(()=>cursor.classList.remove('press'),250/speed);if(target){const el=$(target);if(el){el.classList.add('flash','portal-flash');setTimeout(()=>el.classList.remove('flash','portal-flash'),350/speed)}}}
  function notice(title,body,hold=1600){$('#toastTitle').textContent=title;$('#toastBody').textContent=body;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),hold/speed)}
  function chaosPing(id,type,title,body,left,top){if($('#'+id))return;const d=document.createElement('div');d.id=id;d.className=`chaos-ping ${type}`;d.style.left=left+'px';d.style.top=top+'px';d.innerHTML=`<b>${title}</b><span>${body}</span>`;stage.appendChild(d);requestAnimationFrame(()=>d.classList.add('show'))}
  function removePing(id){const el=$('#'+id);if(!el)return;el.classList.remove('show');setTimeout(()=>el.remove(),220/speed)}

  function orderSidebar(){return `<aside class="orders"><h2>Orders</h2><div class="order active"><b>Emma Cole</b><span>ORD-2482 &nbsp; Roll label · 60 × 40 mm</span><small>● Draft</small></div><div class="order"><b>Sam Fenwick</b><span>ORD-2431 &nbsp; Kraft label roll</span><small>● In collaboration</small></div><div class="order"><b>Iris Vogel</b><span>ORD-2435 &nbsp; Folding carton sleeve</span><small>● Preparing print files</small></div></aside>`}
  const summaryAside=`<aside class="order-so-far"><small>Order so far</small><div><b>Customer</b><br>Emma Cole</div><div><b>Product</b><br>Roll label</div><div><b>Needed by</b><br>Jun 18, 2026</div></aside>`;
  function wizardSteps(active){const labels=['Customer','Product','Options','Summary'];return `<div class="wizard-steps">${labels.map((x,i)=>`<div class="wizard-step ${i===active?'active':''} ${i<active?'done':''}"><b>${i+1} &nbsp; ${x}</b><span>${i<active?'Completed':i===active?'In progress':'Not started'}</span></div>`).join('')}</div>`}
  function setPortal(mode){
    const layout=$('.portal-layout');if(!layout)return;layout.className='portal-layout';
    if(mode==='orders'){
      layout.innerHTML=`${orderSidebar()}<main class="order-main"><div class="order-title"><span>ORD-2482</span><h1>Roll label · 60 × 40 mm</h1><small>Draft &nbsp; Emma Cole &nbsp; Due Jun 18, 2026</small></div><div class="order-timeline"><span>Order created</span></div><div class="reply">Public reply · customer sees it<div>Reply to the customer…</div></div></main><aside class="next-action"><h3>Next action</h3><div class="action-card"><b>YOUR MOVE</b><p>Start the order with the customer and product details.</p><button>Create order</button></div><h3>Current design</h3><img src="assets/willow-label-v1.svg" /></aside>`;return;
    }
    layout.className='portal-layout wizard-layout';
    if(mode==='customer'){
      layout.innerHTML=`<div class="portal-wizard"><h1 class="wizard-title">New Order</h1>${wizardSteps(0)}<div class="wizard-card"><div class="wizard-main"><h2>Customer</h2><p>Find an existing customer by name or email.</p><div class="customer-row"><div class="customer-avatar">EC</div><div><b>Emma Cole</b><br><small>emma@willowandco.example</small></div></div></div>${summaryAside}<div class="wizard-actions"><button>Back</button><button class="primary" id="continueCustomer">Continue to product</button></div></div></div>`;
    } else if(mode==='product'){
      layout.innerHTML=`<div class="portal-wizard"><h1 class="wizard-title">New Order</h1>${wizardSteps(1)}<div class="wizard-card"><div class="wizard-main"><h2>Choose a product</h2><div class="product-grid"><div class="product-card selected" id="rollLabelCard"><span class="product-check">✓</span><img src="assets/willow-label-v1.svg"><b>Roll label</b><small>Kraft / BOPP · 20–120 mm</small></div><div class="product-card"><div style="height:95px;background:#f3f5f7"></div><b>Wraparound label</b><small>Coffee & retail bags</small></div><div class="product-card"><div style="height:95px;background:#f3f5f7"></div><b>Business card</b><small>350–400 g</small></div><div class="product-card"><div style="height:95px;background:#f3f5f7"></div><b>Flyer A5 / A4</b><small>115–250 g</small></div></div></div>${summaryAside}<div class="wizard-actions"><button>Back</button><button class="primary" id="continueProduct">Continue to options</button></div></div></div>`;
    } else if(mode==='options'){
      layout.innerHTML=`<div class="portal-wizard"><h1 class="wizard-title">New Order</h1>${wizardSteps(2)}<div class="wizard-card"><div class="wizard-main"><h2>Options</h2><div class="option-groups"><div class="option-group"><b>Size</b><div class="option-pills"><span class="option-pill selected">60 × 40 mm</span><span class="option-pill">76 × 51 mm</span><span class="option-pill">100 × 150 mm</span></div></div><div class="option-group"><b>Stock</b><div class="option-pills"><span class="option-pill selected">Kraft uncoated</span><span class="option-pill">White BOPP</span></div></div><div class="option-group"><b>Finish</b><div class="option-pills"><span class="option-pill selected">None</span><span class="option-pill">Matte lamination</span></div></div><div class="option-group"><b>Quantity</b><div class="option-pills"><span class="option-pill">1,000 pcs</span><span class="option-pill selected">5,000 pcs</span><span class="option-pill">10,000 pcs</span></div></div><div class="variant-preview"><div><b>PRODUCT VARIANT</b><p>60 × 40 mm · Kraft uncoated · No finish · Permanent adhesive · Outside wound · 40 mm core</p><small>SKU RL-6040-KRAFT-NF-5000</small></div><img src="assets/willow-label-v1.svg"></div></div></div>${summaryAside}<div class="wizard-actions"><button>Back</button><button class="primary" id="continueOptions">Continue to summary</button></div></div></div>`;
    } else if(mode==='summary'){
      layout.innerHTML=`<div class="portal-wizard"><h1 class="wizard-title">New Order</h1>${wizardSteps(3)}<div class="wizard-card"><div class="wizard-main"><h2>Summary</h2><div class="summary-grid"><div><span>Customer</span><b>Emma Cole</b></div><div><span>Email</span><b>emma@willowandco.example</b></div><div><span>Product</span><b>Roll label</b></div><div><span>SKU</span><b>RL-6040-KRAFT-NF-5000</b></div><div><span>Variant</span><b>60 × 40 mm · Kraft uncoated</b></div><div><span>Quantity</span><b>5,000 pcs</b></div></div></div>${summaryAside}<div class="wizard-actions"><button>Back</button><button class="primary" id="createDraft">Create order as Draft</button></div></div></div>`;
    }
  }
  function setOrderState(mode){const layout=$('.portal-layout');if(!layout)return;layout.className='portal-layout order-screen-relief';const isReady=mode==='ready';layout.innerHTML=`${orderSidebar()}<main class="order-main"><div class="order-title"><span>ORD-2482</span><h1>Roll label · 60 × 40 mm</h1><small>${isReady?'Waiting on the customer':'Draft'} &nbsp; Emma Cole &nbsp; Due Jun 18, 2026</small></div><div class="order-timeline"><span>Order created</span>${isReady?'<article><b>Initial version published</b><small>Saved from the editor</small></article>':''}</div><div class="reply">Public reply · customer sees it<div>Reply to the customer…</div></div></main><aside class="next-action"><h3>Next action</h3><div class="action-card"><b>YOUR MOVE</b><p>${isReady?'Initial version is ready. Invite Emma Cole to continue.':'Create the initial design version before inviting the customer.'}</p><button>${isReady?'Invite customer':'Make changes first'}</button></div><h3>Current design</h3>${isReady?'<img src="assets/willow-label-v1.svg">':'<div style="height:180px;border:1px dashed #cfd8e3;background:#f8fafc;display:grid;place-items:center;color:#98a2b3">No version yet</div>'}</aside>`}
  function openBrowser(){setPortal('orders');browser.classList.add('visible');task('tbBrowser',true)}

  function reset(){cancelAnimationFrame(raf);playing=false;base=0;rewinding=false;topZ=80;fired.clear();stage.classList.remove('rewinding','climax-hold');film.classList.remove('on');browser.classList.remove('visible');toast.classList.remove('show');$$('.chaos-ping').forEach(x=>x.remove());Object.values(W).forEach(w=>{w.style.zIndex=''});$('#outlook').className='window outlook';$('#teams').className='window teams';$('#explorer').className='window explorer';$('#pdf1').className='window pdf';$('#pdf2').className='window pdf second';$('#qa').className='window qa';$('#production').className='window production';$$('.task-icon').forEach(x=>x.classList.remove('active'));$('#fileList').innerHTML='';$('#thread').innerHTML='';removeMail('mail-rev');removeMail('mail-approve');removeMail('mail-last');renderMail(initialMail);selectMail('[data-mail="initial"]');cursor.style.opacity=0;cursor.style.transform='translate3d(1700px,980px,0)';$('#time').textContent=`0.0 / ${END.toFixed(1)}`;setPortal('orders')}

  const ops=[];const op=(at,doFn,undoFn)=>ops.push({at,do:doFn,undo:undoFn});
  op(2.6,()=>{show('outlook');move(760,410,920)},()=>hide('outlook'));
  op(6.0,()=>{show('teams');seedMsgs();move(1490,320,700)},()=>{hide('teams');$('#thread').innerHTML='' });
  op(8.9,()=>{show('explorer');seedFiles();move(420,760,650)},()=>{hide('explorer');$('#fileList').innerHTML='' });
  op(10.0,()=>{move(430,806,430);click(430,806,'#f-v1');selectFile('f-v1')},()=>$$('.file-row').forEach(x=>x.classList.remove('selected')));
  op(11.1,()=>{show('pdf1');move(1180,650,600)},()=>hide('pdf1'));
  op(14.0,()=>{notice('Outlook · Emma Cole','Can you change the text and confirm the final size?',1700);addMail('mail-rev','Emma · Willow & Co.','Re: New order request','Can you change the text to “No artificial flavors”?');renderMail(revisionMail);selectMail('#mail-rev');show('outlook')},()=>{removeMail('mail-rev');renderMail(initialMail);selectMail('[data-mail="initial"]')});
  op(16.4,()=>msg('m3','N','purple','Nora','Designer','Updated the copy. Saving a v2 now, but I still need the final product name.'),()=>removeMsg('m3'));
  op(17.7,()=>msg('m4','L','green','Leo','Prepress','I still need confirmed trim size and bleed before I can sign this off.'),()=>removeMsg('m4'));
  op(18.9,()=>addFile('f-v2','Willow_Label_v2.pdf','Jun 10, 10:11 AM','2.3 MB'),()=>removeFile('f-v2'));
  op(19.8,()=>addFile('f-v3','Willow_Label_v3.pdf','Jun 10, 10:18 AM','2.3 MB'),()=>removeFile('f-v3'));
  op(20.8,()=>{addFile('f-final','Willow_Label_FINAL.pdf','Jun 10, 10:27 AM','2.4 MB');move(450,900,360)},()=>removeFile('f-final'));
  op(21.6,()=>{click(450,900,'#f-final');selectFile('f-final');show('pdf2');move(1350,650,560)},()=>hide('pdf2'));
  op(22.8,()=>addFile('f-approved','Willow_Label_FINAL_APPROVED.pdf','Jun 10, 10:34 AM','2.4 MB'),()=>removeFile('f-approved'));
  op(23.6,()=>addFile('f-approved2','Willow_Label_FINAL_APPROVED_2.pdf','Jun 10, 10:38 AM','2.4 MB'),()=>removeFile('f-approved2'));
  op(24.6,()=>{notice('Outlook · Emma Cole','Which version should I approve?',1700);addMail('mail-approve','Emma · Willow & Co.','Approval question','Which version should I approve?');show('outlook')},()=>removeMail('mail-approve'));
  op(25.7,()=>{chaosPing('ping-customer','mail','Emma · Willow & Co.','I just sent another logo file. Please use the newest one.',1460,735)},()=>removePing('ping-customer'));
  op(26.6,()=>show('qa'),()=>hide('qa'));
  op(27.5,()=>{show('production');msg('m5','M','orange','Maya','Production','If we want to run this today, I need the approved file before noon.')},()=>{hide('production');removeMsg('m5')});
  op(28.4,()=>{chaosPing('ping-prod','warn','Production','Press slot is being held for 20 more minutes.',1030,170)},()=>removePing('ping-prod'));
  op(29.1,()=>{msg('m6','R','red','Ryan','Ops Director','What is blocking ORD-2482? Can we release it today?');notice('Teams · Ryan','What is blocking ORD-2482?',1800)},()=>removeMsg('m6'));
  op(29.7,()=>{addMail('mail-last','Emma · Willow & Co.','One last thing','Can we make the bakery name a little larger?');chaosPing('ping-last','teams','Nora · Designer','Which file is actually approved now?',610,122)},()=>{removeMail('mail-last');removePing('ping-last')});
  op(30.2,()=>stage.classList.add('climax-hold'),()=>stage.classList.remove('climax-hold'));

  function rewind(){if(rewinding)return;rewinding=true;stage.classList.remove('climax-hold');stage.classList.add('rewinding');film.classList.add('on');cursor.style.opacity=1;const back=[[1580,800],[1040,220],[1450,760],[1350,650],[450,900],[1180,650],[430,806],[420,760],[1490,320],[760,410],[970,1010]];back.forEach((p,i)=>setTimeout(()=>move(p[0],p[1],88),i*92));const done=ops.filter((_,i)=>fired.has('op'+i)).reverse();done.forEach((x,i)=>setTimeout(()=>{try{x.undo()}catch(e){}},i*94));setTimeout(()=>{Object.values(W).forEach(w=>{w.classList.remove('visible','hiding');w.style.zIndex='' });$('#fileList').innerHTML='';$('#thread').innerHTML='';removeMail('mail-rev');removeMail('mail-approve');removeMail('mail-last');$$('.chaos-ping').forEach(x=>x.remove());renderMail(initialMail);selectMail('[data-mail="initial"]');stage.classList.remove('rewinding');film.classList.remove('on');cursor.style.opacity=0;rewinding=false},2600)}

  const events=[
    [.8,()=>move(970,1010,900)],
    ...ops.map((x,i)=>[x.at,()=>{fired.add('op'+i);x.do()}]),
    [31.9,rewind],
    [35.0,()=>{move(1110,1010,760)}],
    [35.7,()=>{click(1110,1010);openBrowser()}],
    [36.6,()=>{move(1590,121,520)}],
    [37.1,()=>{click(1590,121,'.portal-header button');setPortal('customer')}],
    [38.0,()=>{move(1480,836,500)}],
    [38.4,()=>{click(1480,836,'#continueCustomer');setPortal('product')}],
    [39.1,()=>{move(676,455,450);click(676,455,'#rollLabelCard')}],
    [39.8,()=>{move(1470,836,480);click(1470,836,'#continueProduct');setPortal('options')}],
    [40.7,()=>{move(770,454,420);click(770,454,'.option-pill.selected')}],
    [41.2,()=>{move(1465,836,460);click(1465,836,'#continueOptions');setPortal('summary')}],
    [42.1,()=>{move(1462,836,470);click(1462,836,'#createDraft');setOrderState('draft')}],
    [43.0,()=>{move(1690,262,460);click(1690,262,'.action-card button')}],
    [44.0,()=>{setOrderState('ready');notice('Collaborative Order','Initial version published. Ready to invite the customer.',1500)}],
    [44.7,()=>{move(1690,310,520);click(1690,310,'.action-card button')}],
    [45.3,()=>{notice('Collaborative Order','Invitation sent to Emma Cole.',1200);cursor.style.opacity=0}]
  ];

  function tick(now){if(!playing)return;const t=base+(now-startPerf)/1000*speed;$('#time').textContent=`${Math.min(t,END).toFixed(1)} / ${END.toFixed(1)}`;events.forEach((e,i)=>{const k='e'+i;if(!fired.has(k)&&t>=e[0]){fired.add(k);try{e[1]()}catch(err){console.warn(err)}}});if(t<END)raf=requestAnimationFrame(tick);else playing=false}
  function play(){if(playing)return;playing=true;startPerf=performance.now();raf=requestAnimationFrame(tick)}
  function pause(){if(!playing)return;base+=(performance.now()-startPerf)/1000*speed;playing=false;cancelAnimationFrame(raf)}
  function snap(name){reset();if(name==='initial')show('outlook');else if(name==='peak'){show('outlook');show('teams');seedMsgs();msg('m3','N','purple','Nora','Designer','Updated the copy. Saving a v2 now, but I still need the final product name.');msg('m4','L','green','Leo','Prepress','I still need confirmed trim size and bleed before I can sign this off.');msg('m5','M','orange','Maya','Production','If we want to run this today, I need the approved file before noon.');msg('m6','R','red','Ryan','Ops Director','What is blocking ORD-2482? Can we release it today?');show('explorer');seedFiles();[['f-v2','Willow_Label_v2.pdf'],['f-v3','Willow_Label_v3.pdf'],['f-final','Willow_Label_FINAL.pdf'],['f-approved','Willow_Label_FINAL_APPROVED.pdf'],['f-approved2','Willow_Label_FINAL_APPROVED_2.pdf']].forEach((x,i)=>addFile(x[0],x[1],'Jun 10, 10:'+(11+i*6).toString().padStart(2,'0')+' AM','2.4 MB'));selectFile('f-final');show('pdf1');show('pdf2');show('qa');show('production');chaosPing('ping-customer','mail','Emma · Willow & Co.','I just sent another logo file. Please use the newest one.',1460,735);chaosPing('ping-prod','warn','Production','Press slot is being held for 20 more minutes.',1030,170);chaosPing('ping-last','teams','Nora · Designer','Which file is actually approved now?',610,122);stage.classList.add('climax-hold')}else if(name==='product'){openBrowser();setOrderState('ready')}}

  $('#play').onclick=play;$('#pause').onclick=pause;$('#restart').onclick=()=>{reset();play()};
  $('#speed').onclick=()=>{speed=speed===1?1.5:speed===1.5?.75:1;$('#speed').textContent=speed+'×'};
  $$('[data-snap]').forEach(b=>b.onclick=()=>snap(b.dataset.snap));
  addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();playing?pause():play()}if(e.key.toLowerCase()==='r'){reset();play()}});
  reset();
  if(new URLSearchParams(location.search).get('autoplay')==='1'||new URLSearchParams(location.search).get('record')==='1')setTimeout(play,350);
})();
