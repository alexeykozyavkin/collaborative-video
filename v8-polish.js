(()=>{
  /* Product catalog: use real raster PNG previews generated during the Pages build. */
  const productPreviews=[
    ['./assets/products/roll-label.png','Roll label preview'],
    ['./assets/products/wraparound-label.png','Wraparound label preview'],
    ['./assets/products/business-card.png','Business card preview'],
    ['./assets/products/flyer.png','Flyer preview'],
    ['./assets/products/folding-carton-sleeve.png','Folding carton sleeve preview'],
    ['./assets/products/roll-up-banner.png','Roll-up banner preview']
  ];
  [...document.querySelectorAll('#wizardProduct .product-card')].forEach((card,i)=>{
    const thumb=card.querySelector('.product-thumb'),preview=productPreviews[i];
    if(!thumb||!preview)return;
    const img=document.createElement('img');
    img.src=preview[0];img.alt=preview[1];img.width=900;img.height=525;
    img.style.cssText='width:100%;height:100%;object-fit:contain;padding:8px;display:block;background:#f7f8fa';
    thumb.replaceChildren(img);
  });

  /* The customer sends an editable InDesign source alongside the PDF proof. */
  const initialSource=document.querySelector('.attachments div:first-child');
  if(initialSource)initialSource.textContent='📄 Willow_Label_v1.idml';

  /* Old way: email + files + proofs, without a full Teams window competing for attention. */
  const desktop=document.querySelector('#desktop');
  const teams=document.querySelector('#teams');
  if(teams)teams.setAttribute('aria-hidden','true');

  const rows=[...document.querySelectorAll('#explorer .folder-row')];
  const fileNames=[
    'Willow_Label_v1.pdf',
    'Willow_Label_v2.pdf',
    'Willow_Label_v3.pdf',
    'Willow_Label_print-ready-for-approval.pdf',
    'Willow_Label_APPROVED.pdf',
    'Willow_Label_APPROVED_2.pdf'
  ];
  const fileTimes=['10:03 AM','10:08 AM','10:11 AM','10:12 AM','10:13 AM','10:14 AM'];
  rows.forEach((row,i)=>{
    const name=row.querySelector('b'),time=row.querySelector('small');
    if(name&&fileNames[i])name.textContent=fileNames[i];
    if(time&&fileTimes[i])time.textContent=fileTimes[i];
  });

  const toastDefs=[
    ['#reply1','outlook','O','Emma Cole · Client','Can we change the product name to “Sourdough Boule”?'],
    ['#reply2','outlook','O','Emma Cole · Client','Please use “No artificial flavors”.'],
    ['#prepressToast','teamsapp','T','Leo · Prepress','Preflight is done. I exported the latest artwork as print-ready-for-approval.'],
    ['#reply3','outlook','O','Emma Cole · Client','Which version should I approve?'],
    ['#productionToast','teamsapp','T','Maya · Production','Production is waiting. Can we release ORD-2482 today?']
  ];
  const stack=document.createElement('div');
  stack.className='oldway-toast-stack';
  toastDefs.forEach(([sel,kind,glyph,author,message])=>{
    const toast=document.querySelector(sel);if(!toast)return;
    const copy=document.createElement('div');copy.className='oldway-toast-copy';
    const b=toast.querySelector('b'),span=toast.querySelector('span');
    if(b)b.textContent=author;if(span)span.textContent=message;
    while(toast.firstChild)copy.appendChild(toast.firstChild);
    const icon=document.createElement('div');icon.className=`oldway-app-icon ${kind}`;icon.textContent=glyph;
    toast.append(icon,copy);stack.appendChild(toast);
  });
  if(desktop)desktop.appendChild(stack);

  /* A second proof window makes the version sprawl visible without opening Teams. */
  const pdf1=document.querySelector('#pdf');
  let pdf2=null;
  if(pdf1&&desktop){
    pdf2=pdf1.cloneNode(true);pdf2.id='pdf2';pdf2.classList.add('hidden');
    const title=pdf2.querySelector('#pdfTitle');if(title){title.id='pdfTitle2';title.textContent='Willow_Label_print-ready-for-approval.pdf';}
    const artwork=pdf2.querySelector('#pdfArtwork');if(artwork){artwork.id='pdfArtwork2';artwork.src='./assets/willow-label-v2-exact.svg';}
    desktop.appendChild(pdf2);
  }

  /* Closing screen: no fake Meridian mark; orange chips reveal one by one. */
  document.querySelector('#packshot .pack-logo')?.remove();
  const pack=document.querySelector('#packshot .packshot-card');
  if(pack)pack.style.paddingTop='56px';

  const style=document.createElement('style');
  style.textContent=`
    #teams{display:none!important}
    #explorer{left:6.5%!important;top:38%!important;width:47%!important;height:45%!important;z-index:24!important}
    #pdf{right:19%!important;top:8.5%!important;width:36%!important;height:70%!important;z-index:30!important}
    #pdf2{right:4%!important;top:18%!important;width:36%!important;height:70%!important;z-index:38!important}
    .oldway-toast-stack{position:absolute;z-index:95;right:26px;top:72px;width:410px;display:flex;flex-direction:column;gap:9px;pointer-events:none}
    .oldway-toast-stack .toast{position:relative!important;top:auto!important;right:auto!important;left:auto!important;width:100%!important;min-height:72px;padding:11px 13px!important;display:grid;grid-template-columns:36px minmax(0,1fr);align-items:start;gap:10px;border-radius:11px;box-shadow:0 10px 28px rgba(21,34,56,.22);transform:none}
    .oldway-toast-stack .toast.hidden{display:none!important}
    .oldway-toast-stack .toast:not(.hidden){animation:oldwayToastIn .26s ease-out both}
    .oldway-toast-copy{min-width:0;display:flex;flex-direction:column;gap:4px}
    .oldway-toast-copy b{font-size:13px}.oldway-toast-copy span{font-size:13px;line-height:1.32;color:#334155}
    .oldway-app-icon{width:34px;height:34px;border-radius:7px;color:#fff;display:grid;place-items:center;font-weight:800;font-size:17px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.2)}
    .oldway-app-icon.outlook{background:#0a64c9}.oldway-app-icon.teamsapp{background:#5b4bb7}
    @keyframes oldwayToastIn{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:translateX(0)}}
    #packshot .pack-flow span{border:2px solid #e66000!important;background:#fff!important;color:#24364a;opacity:0;transform:translateY(10px) scale(.96)}
    #packshot .pack-flow i{color:#e66000!important;opacity:0;transform:translateX(-5px)}
    #packshot.active .pack-flow span:nth-of-type(1){animation:packChipIn .34s .18s ease-out forwards}
    #packshot.active .pack-flow i:nth-of-type(1){animation:packArrowIn .25s .50s ease-out forwards}
    #packshot.active .pack-flow span:nth-of-type(2){animation:packChipIn .34s .72s ease-out forwards}
    #packshot.active .pack-flow i:nth-of-type(2){animation:packArrowIn .25s 1.04s ease-out forwards}
    #packshot.active .pack-flow span:nth-of-type(3){animation:packChipIn .34s 1.26s ease-out forwards}
    #packshot.active .pack-flow i:nth-of-type(3){animation:packArrowIn .25s 1.58s ease-out forwards}
    #packshot.active .pack-flow span:nth-of-type(4){animation:packChipIn .34s 1.80s ease-out forwards}
    @keyframes packChipIn{to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes packArrowIn{to{opacity:1;transform:translateX(0)}}
  `;
  document.head.appendChild(style);

  /* Keep all old-way elements synchronized with the timeline and scrubber. */
  const baseApply=window.apply;
  if(typeof baseApply==='function')window.apply=function(t){
    baseApply(t);
    const q=s=>document.querySelector(s),set=(s,on)=>{const e=q(s);if(e)e.classList.toggle('hidden',!on)};

    if(t<37){
      set('#teams',false);
      const rewind=t>=33;
      set('#explorer',t>=8&&t<36.35);
      rows[1]?.classList.toggle('show',t>=18.8&&t<35.55);
      rows[2]?.classList.toggle('show',t>=21.8&&t<35.20);
      rows[3]?.classList.toggle('show',t>=25.2&&t<34.80);
      rows[4]?.classList.toggle('show',t>=29.0&&t<34.35);
      rows[5]?.classList.toggle('show',t>=31.15&&t<33.90);

      set('#reply1',t>=17.2&&t<36.05);
      set('#reply2',t>=20.5&&t<35.55);
      set('#prepressToast',t>=24.0&&t<35.00);
      set('#reply3',t>=27.8&&t<34.45);
      set('#productionToast',t>=30.8&&t<33.85);

      set('#pdf',t>=13.0&&t<36.05);
      if(pdf1){const title=pdf1.querySelector('#pdfTitle'),art=pdf1.querySelector('#pdfArtwork');if(title)title.textContent='Willow_Label_v1.pdf';if(art)art.src='./assets/willow-label-v1.svg';}
      set('#pdf2',t>=25.45&&t<34.75);

      /* The cursor follows the actual work instead of pointing at a removed Teams window. */
      if(t>=8.4&&t<11.5)feedback('#explorer','mouse',false);
      if(t>=12.6&&t<14.8)feedback('#fileV1','mouse',t>=13.45&&t<13.85);
      if(rewind){
        const target=t<33.9?'#productionToast':t<34.45?'#reply3':t<35.0?'#prepressToast':t<35.55?'#reply2':t<36.05?'#reply1':'#initialMail';
        feedback(target,'mouse',false);
      }
    }
  };
})();
