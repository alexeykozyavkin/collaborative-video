(()=>{
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const stage=$('#stage'), cursor=$('#cursor'), ring=$('#clickRing'), film=$('#rewindFilm'), browser=$('#browser');
  const scrubber=$('#scrubber'), timeEl=$('#time');
  const W={outlook:$('#outlook'),explorer:$('#explorer'),pdf1:$('#pdf1'),pdf2:$('#pdf2'),qa:$('#qa'),production:$('#production'),designer:$('#designerChat'),prepress:$('#prepressChat'),director:$('#directorChat')};
  const END=86;
  let playing=false,startPerf=0,base=0,speed=1,raf=0,topZ=80,lastT=0;
  let lastMailKey='',lastFilesKey='',lastPortalKey='',lastChatKey='',lastPingKey='';
  let cursorAnim=null,cursorHideTimer=0;
  const firedActions=new Set();
  const params=new URLSearchParams(location.search);
  if(params.get('record')==='1')document.body.classList.add('recording');

  const initialMail={subject:'New order request — Roll label 60 × 40 mm',meta:'Emma Cole <emma@willowandco.example> · Today 9:41 AM',body:'<p>Hi Dana,</p><p>We need <b>5,000 roll labels</b> for our sourdough bread line.</p><p>Size: <b>60 × 40 mm</b><br>Needed by: <b>Jun 18</b></p><p>I attached our brief, the current label for reference, and the latest logo. We may need a few text updates before approval.</p>',attachments:[['PDF','Willow_Brief.pdf'],['PDF','Current_Label_Reference.pdf'],['PNG','Willow_Logo.png']]};
  const revisionMail={subject:'Re: New order request — text update',meta:'Emma Cole <emma@willowandco.example> · Today 10:03 AM',body:'<p>Hi Dana,</p><p>Could you change the text to <b>“No artificial flavors”</b>?</p><p>Also, can you confirm that <b>60 × 40 mm</b> is the final trim size?</p><p>And should the product name read <b>“Sourdough Boule”</b> or <b>“Organic Sourdough”</b>?</p>',attachments:[]};

  function fit(){const s=Math.max(innerWidth/1920,innerHeight/1080);stage.style.transform=`scale(${s})`}
  addEventListener('resize',fit); fit();
  function front(el){if(el)el.style.zIndex=++topZ}
  Object.values(W).forEach(w=>w?.addEventListener('mousedown',()=>front(w)));
  function task(id,on){$('#'+id)?.classList.toggle('active',!!on)}
  function setVisible(name,on){const w=W[name];if(!w)return;const was=w.classList.contains('visible');w.classList.toggle('visible',!!on);w.classList.remove('hiding');if(on&&!was)front(w)}
  function hideAllWindows(){Object.keys(W).forEach(k=>setVisible(k,false));$$('.task-icon').forEach(x=>x.classList.remove('active'))}
  function showBrowser(on){const was=browser.classList.contains('visible');browser.classList.toggle('visible',!!on);task('tbBrowser',!!on);if(on&&!was)browser.style.zIndex=++topZ}

  function renderMail(m,key){
    if(lastMailKey===key)return; lastMailKey=key;
    const a=m.attachments.map(([t,n])=>`<div class="attachment" data-attachment="${n}"><span class="file-badge ${t==='PNG'?'png':''}">${t}</span><div><b>${n}</b><br><small>attached file</small></div></div>`).join('');
    $('#mailView').innerHTML=`<h1>${m.subject}</h1><div class="mail-meta">${m.meta}</div>${m.body}<div class="attachments">${a}</div>`;
  }
  function ensureMailRows(mode){
    const list=$('#mailList'); $('#mail-revision')?.remove(); $('#mail-approval')?.remove();
    if(mode==='revision'||mode==='approval'){const d=document.createElement('div');d.id='mail-revision';d.className='mail-item';d.innerHTML='<b>Emma · Willow & Co.</b><span>Re: New order request</span><small>Can you change the text and confirm the size?</small>';list.prepend(d)}
    if(mode==='approval'){const d=document.createElement('div');d.id='mail-approval';d.className='mail-item';d.innerHTML='<b>Emma · Willow & Co.</b><span>Approval question</span><small>Which version should I approve?</small>';list.prepend(d)}
    $$('.mail-item').forEach(x=>x.classList.remove('current','selected'));
    const sel=mode==='approval'?'#mail-approval':mode==='revision'?'#mail-revision':'[data-mail="initial"]'; $(sel)?.classList.add('current','selected');
  }
  function renderChaosFiles(t){
    const rows=[[8,'f-brief','Willow_Brief.pdf','Jun 10, 9:42 AM','1.2 MB',''],[8,'f-ref','Current_Label_Reference.pdf','Jun 10, 9:43 AM','2.1 MB',''],[8,'f-logo','Willow_Logo.png','Jun 10, 9:43 AM','680 KB','png'],[18.5,'f-v2','Willow_Label_v2.pdf','Jun 10, 10:11 AM','2.3 MB',''],[20,'f-v3','Willow_Label_v3.pdf','Jun 10, 10:18 AM','2.3 MB',''],[21,'f-final','Willow_Label_FINAL.pdf','Jun 10, 10:27 AM','2.4 MB',''],[23.3,'f-approved','Willow_Label_FINAL_APPROVED.pdf','Jun 10, 10:34 AM','2.4 MB',''],[24.5,'f-approved2','Willow_Label_FINAL_APPROVED_2.pdf','Jun 10, 10:38 AM','2.4 MB','']];
    const active=t>=24.5?'f-approved2':t>=21?'f-final':t>=10?'f-ref':'';
    const visible=rows.filter(r=>t>=r[0]); const key=visible.map(r=>r[1]).join('|')+'@'+active; if(lastFilesKey===key)return; lastFilesKey=key;
    $('#fileList').innerHTML=visible.map(r=>`<div id="${r[1]}" class="file-row ${r[1]===active?'selected':''}"><div class="name"><span class="mini-file ${r[5]}"></span>${r[2]}</div><span>${r[3]}</span><span>${r[4]}</span></div>`).join('');
  }
  function chatMessage(side,name,role,text){return `<div class="staff-msg ${side}"><div><b>${name}</b><small>${role}</small><p>${text}</p></div></div>`}
  function pinThread(id){const el=$(id);if(el)requestAnimationFrame(()=>{el.scrollTop=el.scrollHeight})}
  function renderStaffChats(t){
    const designer=t<6?'off':t<15?'start':t<24?'update':'late';
    const prepress=t<17?'off':t<24?'start':'late'; const director=t<30?'off':'start';
    const key=[designer,prepress,director].join('|'); if(lastChatKey===key)return; lastChatKey=key;
    if(designer!=='off'){$('#designerThread').innerHTML=chatMessage('me','Dana','CSR','New Willow order. Brief, reference label and logo are in the job folder. Need 5,000 labels by Jun 18.')+chatMessage('them','Nora','Designer','Got it. Is 60 × 40 mm the final trim size or the finished size?')+(designer!=='start'?chatMessage('them','Nora','Designer','I updated the copy and saved v2, but I still need the final product name.'):'')+(designer==='late'?chatMessage('me','Dana','CSR','Client says “No artificial flavors”. Still waiting on whether the name is Sourdough Boule or Organic Sourdough.'):'');pinThread('#designerThread')}
    if(prepress!=='off'){$('#prepressThread').innerHTML=chatMessage('me','Dana','CSR','Can you sanity-check trim and bleed before we release this?')+chatMessage('them','Leo','Prepress','I need the confirmed trim size and 3 mm bleed. Also, which PDF is current?')+(prepress==='late'?chatMessage('them','Leo','Prepress','I now see FINAL_APPROVED and FINAL_APPROVED_2. They do not match, so I can’t sign this off yet.'):'');pinThread('#prepressThread')}
    if(director!=='off'){$('#directorThread').innerHTML=chatMessage('them','Ryan','Ops Director','What is blocking ORD-2482? Can we release it today?')+chatMessage('me','Dana','CSR','Waiting on final wording and trying to establish which artwork file is actually approved.');pinThread('#directorThread')}
  }
  function renderPings(t){
    const key=t>=28.5?'two':t>=25.5?'one':'none'; if(lastPingKey===key)return; lastPingKey=key; $$('.chaos-ping').forEach(x=>x.remove());
    const ping=(id,type,title,body,left,top)=>{const d=document.createElement('div');d.id=id;d.className=`chaos-ping ${type} show`;d.style.left=left+'px';d.style.top=top+'px';d.innerHTML=`<b>${title}</b><span>${body}</span>`;stage.appendChild(d)};
    if(t>=25.5)ping('p1','mail','Emma Cole','Which version should I approve?',1410,748);
    if(t>=28.5)ping('p2','warn','Production','Need approved artwork before noon.',1440,826);
  }

  function wizardSteps(active){const labels=['Customer','Product','Options','Summary'];return `<div class="wizard-steps">${labels.map((x,i)=>`<div class="wizard-step ${i===active?'active':''} ${i<active?'done':''}"><b>${i+1} &nbsp; ${x}</b><span>${i<active?'Completed':i===active?'In progress':'Not started'}</span></div>`).join('')}</div>`}
  const summaryAside=`<aside class="order-so-far"><small>Order so far</small><div><b>Customer</b><br>Emma Cole</div><div><b>Product</b><br>Roll label</div><div><b>Needed by</b><br>Jun 18, 2026</div></aside>`;
  function statusChip(label,tone='blue'){return `<span class="co-status ${tone}">${label}</span>`}
  function feedSystem(text){return `<div class="co-feed-system"><span>●</span><p>${text}</p></div>`}
  function feedVersion(n,author,img,current=true){return `<div class="co-version-event"><div class="co-version-thumb"><img src="${img}"></div><div><small>DESIGN VERSION</small><b>Version ${n} published</b><p>${author}${current?' · Current design':''}</p></div></div>`}
  function feedMessage({who,role='Customer',text,version=1,internal=false}){
    const cls=internal?'internal':role==='Customer'?'customer':'employee';
    return `<div class="co-message ${cls}"><div class="co-avatar">${who.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase()}</div><div class="co-message-body"><div><b>${who}</b>${internal?'<span class="co-internal-badge">Internal</span>':''}<small>${internal?'Staff only':`On Version ${version}`}</small></div><p>${text}</p></div></div>`;
  }
  function feedConfirmation(text){return `<div class="co-confirm-event"><span>✓</span><div><b>${text}</b><small>Confirmation recorded in the order history</small></div></div>`}
  function composer(mode='public',text='',enabled=true){
    const internal=mode==='internal';
    return `<div class="co-composer ${internal?'internal':''}"><div class="co-composer-tabs"><button class="${!internal?'active':''}" id="publicMode">Public reply · customer sees it</button><button class="${internal?'active':''}" id="internalMode">Internal note · staff only</button></div><div class="co-compose-box"><div class="co-compose-text ${text?'has-text':''}">${text||'Write a message…'}${text?'<span class="typing-caret"></span>':''}</div><button class="co-send" id="sendMessage" ${enabled?'':'disabled'}>Send</button></div></div>`;
  }
  function proofPanel(version=1){const v2=version===2;return `<section class="co-proof-panel"><div class="co-panel-title"><div><small>CURRENT DESIGN</small><b>Version ${version}</b></div><span>${v2?'Latest revision':'Initial version'}</span></div><div class="co-proof-wrap"><img src="assets/willow-label-${v2?'v2':'v1'}.svg"></div><div class="co-version-list"><div class="${version===1?'current':''}"><b>Version 1</b><small>Initial design</small></div>${version>=2?'<div class="current"><b>Version 2</b><small>Customer changes applied</small></div>':''}</div></section>`}
  function actionRail({title,body,button='',id='',tone='blue',meta=''}){return `<aside class="co-action-rail"><small>NEXT ACTION</small><div class="co-action-card ${tone}"><b>${title}</b><p>${body}</p>${button?`<button id="${id}" class="co-primary">${button}</button>`:''}</div>${meta?`<div class="co-order-meta">${meta}</div>`:''}</aside>`}
  function orderScreen({status='Draft',statusTone='gray',version=1,events='',mode='public',draftText='',action,sub='Roll label · 60 × 40 mm · 5,000 pcs · Due Jun 18'}){
    return `<main class="co-order-screen"><header class="co-order-head"><div><small>ORD-2482 · Willow &amp; Co.</small><h1>Roll label · 60 × 40 mm</h1><p>${sub}</p></div>${statusChip(status,statusTone)}</header><div class="co-workspace">${proofPanel(version)}<section class="co-conversation"><div class="co-conversation-head"><div><small>COLLABORATION</small><h2>Conversation & activity</h2></div><span>Emma Cole · Customer</span></div><div class="co-feed" id="coFeed">${events}</div>${composer(mode,draftText,true)}</section>${actionRail(action)}</div></main>`;
  }
  function scrollFeed(){const feed=$('#coFeed');if(feed)requestAnimationFrame(()=>{feed.scrollTop=feed.scrollHeight})}
  function typed(full,t,start,duration){const p=Math.max(0,Math.min(1,(t-start)/duration));const steps=Math.max(1,Math.ceil(full.length/7));const n=Math.min(full.length,Math.floor(p*steps)*7);return full.slice(0,n)}

  function renderPortal(key,data={}){
    const composite=key+(data.signature||''); if(lastPortalKey===composite)return; lastPortalKey=composite;
    const layout=$('.portal-layout'); if(!layout)return; layout.className='portal-layout v14-layout';
    if(key==='orders'){
      layout.innerHTML=`<main class="portal-home"><div class="portal-home-head"><div><small>ORDER MANAGEMENT</small><h1>Orders</h1><p>Track customer orders, design versions and collaboration.</p></div><button class="home-new-order co-primary" id="homeNewOrder">＋ New Order</button></div><div class="home-order-list"><div><b>ORD-2431</b><span>Sam Fenwick · Kraft label roll</span><small>In collaboration</small></div><div><b>ORD-2435</b><span>Iris Vogel · Folding carton sleeve</span><small>Print files ready</small></div></div></main>`;
    } else if(key==='customer'){
      layout.innerHTML=`<div class="portal-wizard"><h1 class="wizard-title">New Order</h1>${wizardSteps(0)}<div class="wizard-card"><div class="wizard-main"><h2>Customer</h2><p>Find an existing customer by name or email.</p><div class="customer-row"><div class="customer-avatar">EC</div><div><b>Emma Cole</b><br><small>emma@willowandco.example</small></div></div></div>${summaryAside}<div class="wizard-actions"><button>Back</button><button class="primary co-primary" id="continueCustomer">Continue to product</button></div></div></div>`;
    } else if(key==='product'){
      layout.innerHTML=`<div class="portal-wizard"><h1 class="wizard-title">New Order</h1>${wizardSteps(1)}<div class="wizard-card"><div class="wizard-main"><h2>Choose a product</h2><div class="product-grid"><div class="product-card selected"><span class="product-check">✓</span><img src="assets/willow-label-v1.svg"><b>Roll label</b><small>Kraft / BOPP · 20–120 mm</small></div><div class="product-card"><div class="product-placeholder"></div><b>Business card</b><small>350–400 g</small></div></div></div>${summaryAside}<div class="wizard-actions"><button>Back</button><button class="primary co-primary" id="continueProduct">Continue to options</button></div></div></div>`;
    } else if(key==='options'){
      layout.innerHTML=`<div class="portal-wizard"><h1 class="wizard-title">New Order</h1>${wizardSteps(2)}<div class="wizard-card"><div class="wizard-main"><h2>Options</h2><div class="option-groups"><div class="option-group"><b>Size</b><div class="option-pills"><span class="option-pill selected">60 × 40 mm</span><span class="option-pill">76 × 51 mm</span></div></div><div class="option-group"><b>Stock</b><div class="option-pills"><span class="option-pill selected">Kraft uncoated</span><span class="option-pill">White BOPP</span></div></div><div class="option-group"><b>Quantity</b><div class="option-pills"><span class="option-pill selected">5,000 pcs</span><span class="option-pill">10,000 pcs</span></div></div></div></div>${summaryAside}<div class="wizard-actions"><button>Back</button><button class="primary co-primary" id="continueOptions">Continue to summary</button></div></div></div>`;
    } else if(key==='summary'){
      layout.innerHTML=`<div class="portal-wizard"><h1 class="wizard-title">New Order</h1>${wizardSteps(3)}<div class="wizard-card"><div class="wizard-main"><h2>Summary</h2><div class="summary-grid"><div><span>Customer</span><b>Emma Cole</b></div><div><span>Product</span><b>Roll label</b></div><div><span>Variant</span><b>60 × 40 mm · Kraft uncoated</b></div><div><span>Quantity</span><b>5,000 pcs</b></div></div><div class="incoming-assets-summary"><b>Customer files</b><span>3 source assets will be attached to the order</span></div></div>${summaryAside}<div class="wizard-actions"><button>Back</button><button class="primary co-primary" id="createDraft">Create order as Draft</button></div></div></div>`;
    } else if(key==='draft'){
      const events=feedSystem('Order created as Draft · customer not invited yet');
      layout.innerHTML=orderScreen({status:'Draft',statusTone:'gray',version:1,events,action:{title:'Make changes to the design, or send it as is',body:'The product template is ready to become Version 1. You can edit it first or send it to Emma as-is.',button:'Send as is',id:'sendAsIs',tone:'orange',meta:'Customer · Emma Cole<br>Due · Jun 18, 2026<br>Quantity · 5,000 pcs'}});
    } else {
      const v1=feedSystem('Order created as Draft')+feedVersion(1,'Published from the product template','assets/willow-label-v1.svg')+feedSystem('Invitation sent to emma@willowandco.example · secure link + 6-digit access code');
      const dana1=feedMessage({who:'Dana Whitfield',role:'Employee',text:'Hi Emma, Version 1 is ready. Please review the copy and size.',version:1});
      const emma1=feedMessage({who:'Emma Cole',text:'Please change the text to “No artificial flavors” and use “Sourdough Boule” as the product name.',version:1});
      const note=feedMessage({who:'Dana Whitfield',role:'Employee',text:'Nora, please update the copy per Emma’s comments. Keep the 60 × 40 mm format.',version:1,internal:true});
      const v2=feedVersion(2,'Nora Petrov · Designer','assets/willow-label-v2.svg');
      const dana2=feedMessage({who:'Dana Whitfield',role:'Employee',text:'Version 2 is ready. I’ve updated the copy and product name.',version:2});
      const emma2=feedMessage({who:'Emma Cole',text:'Looks perfect. Approved.',version:2});
      const confirmed=feedConfirmation('Emma Cole confirmed Version 2');
      if(key==='awaiting-customer'){
        layout.innerHTML=orderScreen({status:'Awaiting customer',statusTone:'amber',version:1,events:v1,action:{title:'Waiting on the customer',body:'Emma has the secure order link. Her next message will stay attached to Version 1.',tone:'amber',meta:'Customer invited · Today 10:41 AM'},mode:'public'});
      } else if(key==='public-typing'){
        layout.innerHTML=orderScreen({status:'Awaiting customer',statusTone:'amber',version:1,events:v1,mode:'public',draftText:data.text,action:{title:'Waiting on the customer',body:'Send a public reply to Emma. Public replies are visible to the customer and hand the turn back to her.',tone:'amber'}});
      } else if(key==='public-sent'){
        layout.innerHTML=orderScreen({status:'Awaiting customer',statusTone:'amber',version:1,events:v1+dana1,action:{title:'Waiting on the customer',body:'Dana’s reply is now part of the order history on Version 1.',tone:'amber'},mode:'public'});
      } else if(key==='emma-feedback'){
        layout.innerHTML=orderScreen({status:'In collaboration',statusTone:'blue',version:1,events:v1+dana1+emma1,action:{title:'Your turn',body:'Emma commented on Version 1. Respond publicly, or keep staff coordination internal.',tone:'blue'},mode:'public'});
      } else if(key==='internal-typing'){
        layout.innerHTML=orderScreen({status:'In collaboration',statusTone:'blue',version:1,events:v1+dana1+emma1,mode:'internal',draftText:data.text,action:{title:'Your turn',body:'Internal notes are visible only to staff and do not send anything to the customer.',tone:'blue'}});
      } else if(key==='internal-sent'){
        layout.innerHTML=orderScreen({status:'In collaboration',statusTone:'blue',version:1,events:v1+dana1+emma1+note,action:{title:'Design update in progress',body:'Nora has the customer context without another email or Teams thread.',tone:'blue'},mode:'internal'});
      } else if(key==='v2-published'){
        layout.innerHTML=orderScreen({status:'In collaboration',statusTone:'blue',version:2,events:v1+dana1+emma1+note+v2,action:{title:'Your turn',body:'Version 2 is now the current design. Tell Emma it is ready for review.',tone:'blue'},mode:'public'});
      } else if(key==='v2-public-typing'){
        layout.innerHTML=orderScreen({status:'In collaboration',statusTone:'blue',version:2,events:v1+dana1+emma1+note+v2,action:{title:'Your turn',body:'Reply publicly to return the next action to Emma.',tone:'blue'},mode:'public',draftText:data.text});
      } else if(key==='v2-public-sent'){
        layout.innerHTML=orderScreen({status:'In collaboration',statusTone:'blue',version:2,events:v1+dana1+emma1+note+v2+dana2,action:{title:'Waiting on the customer',body:'Emma is reviewing Version 2, not a loose PDF attachment.',tone:'amber'},mode:'public'});
      } else if(key==='emma-approved'){
        layout.innerHTML=orderScreen({status:'In collaboration',statusTone:'blue',version:2,events:v1+dana1+emma1+note+v2+dana2+emma2,action:{title:'Customer is ready to confirm',body:'Emma approved the current revision in the same conversation.',tone:'blue'},mode:'public'});
      } else if(key==='customer-confirmed'){
        layout.innerHTML=orderScreen({status:'Awaiting employee confirmation',statusTone:'blue',version:2,events:v1+dana1+emma1+note+v2+dana2+emma2+confirmed,action:{title:'Your turn to confirm',body:'Emma confirmed Version 2. Confirm the same version to submit the agreed order.',button:'Confirm & submit',id:'confirmSubmit',tone:'orange'},mode:'public'});
      } else if(key==='submitted'){
        const done=feedConfirmation('Dana Whitfield confirmed Version 2 · Order submitted');
        layout.innerHTML=`<main class="co-order-screen co-finale"><header class="co-order-head"><div><small>ORD-2482 · Willow & Co.</small><h1>Roll label · 60 × 40 mm</h1><p>Roll label · 60 × 40 mm · 5,000 pcs · Due Jun 18</p></div>${statusChip('Submitted','green')}</header><div class="co-workspace">${proofPanel(2)}<section class="co-conversation"><div class="co-conversation-head"><div><small>COLLABORATION</small><h2>Conversation & activity</h2></div><span>Emma Cole · Customer</span></div><div class="co-feed" id="coFeed">${v1+dana1+emma1+note+v2+dana2+emma2+confirmed+done}</div><div class="co-agreed"><span>✓</span><div><b>Order agreed</b><p>Customer and employee confirmed the same Version 2.</p></div></div></section>${actionRail({title:'Collaboration complete',body:'One order. One conversation. One agreed design version.',tone:'green',meta:'Version 2 · Confirmed<br>Customer · Emma Cole<br>Employee · Dana Whitfield'})}</div></main>`;
      }
    }
    scrollFeed();
  }

  function resetVisual(){
    hideAllWindows(); showBrowser(false); film.classList.remove('on'); stage.classList.remove('rewinding','climax-hold');
    $$('.chaos-ping,.clipboard-toast,.paste-hint').forEach(x=>x.remove());
    $('#fileList').innerHTML=''; $('#designerThread').innerHTML=''; $('#prepressThread').innerHTML=''; $('#directorThread').innerHTML='';
    lastMailKey=lastFilesKey=lastPortalKey=lastChatKey=lastPingKey=''; topZ=80; hideCursor(true);
  }

  function renderAt(t,seeking=false){
    t=Math.max(0,Math.min(END,t)); const chaos=t<33,rew=t>=33&&t<36.5,happy=t>=36.5;
    stage.classList.toggle('climax-hold',t>=31.2&&t<33); stage.classList.toggle('rewinding',rew); film.classList.toggle('on',rew);
    if(chaos){
      showBrowser(false); setVisible('outlook',t>=2); task('tbOutlook',t>=2); setVisible('designer',t>=6); setVisible('explorer',t>=8); setVisible('pdf1',t>=10.5); setVisible('prepress',t>=17); setVisible('pdf2',t>=24.5); setVisible('qa',t>=27); setVisible('production',t>=28.5); setVisible('director',t>=30); task('tbTeams',t>=6); task('tbExplorer',t>=8); task('tbPdf',t>=10.5);
      if(t>=25.5){ensureMailRows('approval');renderMail(revisionMail,'revision-approval')} else if(t>=13){ensureMailRows('revision');renderMail(revisionMail,'revision')} else {ensureMailRows('initial');renderMail(initialMail,'initial')}
      renderChaosFiles(t); renderStaffChats(t); renderPings(t);
    } else if(rew){
      showBrowser(false); hideCursor(true); const rt=33-(t-33)*8.2,ct=Math.max(2,Math.min(32.5,rt));
      setVisible('outlook',ct>=2);setVisible('designer',ct>=6);setVisible('explorer',ct>=8);setVisible('pdf1',ct>=10.5);setVisible('prepress',ct>=17);setVisible('pdf2',ct>=24.5);setVisible('qa',ct>=27);setVisible('production',ct>=28.5);setVisible('director',ct>=30);
      if(ct>=25.5){ensureMailRows('approval');renderMail(revisionMail,'rw-approval')}else if(ct>=13){ensureMailRows('revision');renderMail(revisionMail,'rw-revision')}else{ensureMailRows('initial');renderMail(initialMail,'rw-initial')}
      renderChaosFiles(ct);renderStaffChats(ct);renderPings(ct);
    } else if(happy){
      setVisible('explorer',false);setVisible('pdf1',false);setVisible('pdf2',false);setVisible('qa',false);setVisible('production',false);setVisible('designer',false);setVisible('prepress',false);setVisible('director',false);task('tbTeams',false);task('tbExplorer',false);task('tbPdf',false);$$('.chaos-ping').forEach(x=>x.remove());
      if(t<39){showBrowser(false);setVisible('outlook',true);task('tbOutlook',true);ensureMailRows('initial');renderMail(initialMail,'happy-initial')}
      else{
        setVisible('outlook',false);task('tbOutlook',false);showBrowser(true);
        if(t<40.4)renderPortal('orders');
        else if(t<41.9)renderPortal('customer');
        else if(t<43.5)renderPortal('product');
        else if(t<45.1)renderPortal('options');
        else if(t<47.1)renderPortal('summary');
        else if(t<49.4)renderPortal('draft');
        else if(t<52.0)renderPortal('awaiting-customer');
        else if(t<55.3){const text=typed('Hi Emma, Version 1 is ready. Please review the copy and size.',t,52.0,3.3);renderPortal('public-typing',{text,signature:'-'+text.length})}
        else if(t<57.4)renderPortal('public-sent');
        else if(t<60.2)renderPortal('emma-feedback');
        else if(t<63.2){const text=typed('Nora, please update the copy per Emma’s comments. Keep the 60 × 40 mm format.',t,60.2,3.0);renderPortal('internal-typing',{text,signature:'-'+text.length})}
        else if(t<66.0)renderPortal('internal-sent');
        else if(t<68.7)renderPortal('v2-published');
        else if(t<71.8){const text=typed('Version 2 is ready. I’ve updated the copy and product name.',t,68.7,3.1);renderPortal('v2-public-typing',{text,signature:'-'+text.length})}
        else if(t<74.0)renderPortal('v2-public-sent');
        else if(t<76.6)renderPortal('emma-approved');
        else if(t<80.0)renderPortal('customer-confirmed');
        else renderPortal('submitted');
      }
    }
    timeEl.textContent=`${t.toFixed(1)} / ${END.toFixed(1)}`; scrubber.value=Math.round(t*100); if(seeking)hideCursor(true);
  }

  function localCenter(sel){const el=typeof sel==='string'?$(sel):sel;if(!el||!el.getClientRects().length)return null;const r=el.getBoundingClientRect(),s=stage.getBoundingClientRect(),scale=s.width/1920;return{x:(r.left+r.width/2-s.left)/scale,y:(r.top+r.height/2-s.top)/scale,el}}
  let cursorX=96,cursorY=980,cursorVisible=false;
  function setCursorNow(x,y){cursorX=x;cursorY=y;cursor.style.transform=`translate3d(${x}px,${y}px,0)`}
  function setCursorXY(x,y,animate=true){clearTimeout(cursorHideTimer);if(cursorAnim){try{cursorAnim.cancel()}catch(e){}}const dist=Math.hypot(x-cursorX,y-cursorY);cursor.style.opacity=1;cursorVisible=true;const to=`translate3d(${x}px,${y}px,0)`;if(!animate||dist<3){setCursorNow(x,y);return}const from=`translate3d(${cursorX}px,${cursorY}px,0)`;const dur=Math.max(250,Math.min(620,dist*.9))/speed;cursorAnim=cursor.animate([{transform:from},{transform:to}],{duration:dur,easing:'cubic-bezier(.2,.75,.2,1)',fill:'forwards'});cursorAnim.onfinish=()=>{setCursorNow(x,y);cursorAnim=null}}
  function hideCursor(immediate=false){clearTimeout(cursorHideTimer);cursorVisible=false;if(immediate){cursor.style.opacity=0;return}cursorHideTimer=setTimeout(()=>cursor.style.opacity=0,600/speed)}
  function clickTarget(sel){const p=localCenter(sel);if(!p){hideCursor(true);return false}if(!cursorVisible){setCursorNow(p.x-34,p.y+26)}setCursorXY(p.x,p.y,true);setTimeout(()=>{ring.classList.remove('go');void ring.offsetWidth;ring.style.left=p.x+'px';ring.style.top=p.y+'px';ring.classList.add('go');cursor.classList.remove('press');void cursor.offsetWidth;cursor.classList.add('press');p.el.classList.add('flash','portal-flash');setTimeout(()=>p.el.classList.remove('flash','portal-flash'),340/speed);setTimeout(()=>cursor.classList.remove('press'),220/speed);hideCursor(false)},380/speed);return true}

  const actions=[
    [2.15,'[data-mail="initial"]'],[6.15,'#tbTeams'],[8.15,'#tbExplorer'],[10.15,'#f-ref'],[13.15,'#mail-revision'],[21.7,'#f-final'],[24.65,'#f-approved2'],
    [36.9,'[data-mail="initial"]'],[39.35,'#tbBrowser'],[40.05,'#newOrderBtn'],[41.0,'#continueCustomer'],[42.65,'#continueProduct'],[44.2,'#continueOptions'],[46.0,'#createDraft'],[49.0,'#sendAsIs'],
    [52.15,'.co-compose-text'],[55.35,'#sendMessage'],[58.1,'.co-message.customer'],[60.35,'#internalMode'],[63.25,'#sendMessage'],[66.3,'.co-version-event'],[68.85,'.co-compose-text'],[71.85,'#sendMessage'],[74.4,'.co-message.customer'],[77.1,'.co-confirm-event'],[79.35,'#confirmSubmit']
  ];
  function fireAction(idx,sel){if(firedActions.has(idx))return;firedActions.add(idx);clickTarget(sel)}
  function fireCrossedActions(from,to){if(to<=from)return;actions.forEach((a,i)=>{if(a[0]>from&&a[0]<=to)fireAction(i,a[1])})}

  function tick(now){if(!playing)return;const t=Math.min(END,base+(now-startPerf)/1000*speed);renderAt(t,false);fireCrossedActions(lastT,t);lastT=t;if(t>=END){playing=false;hideCursor(false);return}raf=requestAnimationFrame(tick)}
  function play(){if(playing)return;playing=true;startPerf=performance.now();lastT=base;raf=requestAnimationFrame(tick)}
  function pause(){if(!playing)return;const now=performance.now();base=Math.min(END,base+(now-startPerf)/1000*speed);playing=false;cancelAnimationFrame(raf);lastT=base;renderAt(base,true)}
  function seek(t){playing=false;cancelAnimationFrame(raf);base=Math.max(0,Math.min(END,t));lastT=base;firedActions.clear();actions.forEach((a,i)=>{if(a[0]<=base)firedActions.add(i)});renderAt(base,true)}
  function restart(){playing=false;cancelAnimationFrame(raf);resetVisual();base=0;lastT=0;firedActions.clear();setCursorNow(96,980);hideCursor(true);renderAt(0,true)}

  $('#play').onclick=play; $('#pause').onclick=pause; $('#restart').onclick=restart;
  $('#action').onclick=()=>{document.body.classList.add('recording');restart();setTimeout(()=>play(),1000)};
  $('#speed').onclick=()=>{speed=speed===1?1.5:speed===1.5?.75:1;$('#speed').textContent=speed+'×'};
  scrubber.addEventListener('input',()=>seek(Number(scrubber.value)/100));
  $$('[data-snap]').forEach(b=>b.onclick=()=>{const map={clean:0,initial:3,peak:31.5,product:49.8};seek(map[b.dataset.snap]??0)});
  addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();playing?pause():play()}if(e.key.toLowerCase()==='r')restart();if(e.key==='ArrowLeft')seek(base-1);if(e.key==='ArrowRight')seek(base+1)});
  restart(); if(params.get('autoplay')==='1'||params.get('record')==='1')setTimeout(play,500);
})();
