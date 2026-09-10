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
    const thumb=card.querySelector('.product-thumb');
    const preview=productPreviews[i];
    if(!thumb||!preview)return;
    const img=document.createElement('img');
    img.src=preview[0];
    img.alt=preview[1];
    img.width=900;
    img.height=525;
    img.style.cssText='width:100%;height:100%;object-fit:contain;padding:8px;display:block;background:#f7f8fa';
    thumb.replaceChildren(img);
  });

  /* The customer sends an editable InDesign source alongside the PDF proof. */
  const initialSource=document.querySelector('.attachments div:first-child');
  if(initialSource)initialSource.textContent='📄 Willow_Label_v1.idml';

  /* Make the external actor explicit in old-way notifications. */
  ['#reply1','#reply2','#reply3'].forEach(sel=>{
    const author=document.querySelector(`${sel} b`);
    if(author)author.textContent='Emma Cole · Client';
  });

  /* Closing screen: no fake Meridian mark; orange chips reveal one by one. */
  document.querySelector('#packshot .pack-logo')?.remove();
  const pack=document.querySelector('#packshot .packshot-card');
  if(pack)pack.style.paddingTop='56px';

  const style=document.createElement('style');
  style.textContent=`
    #packshot .pack-flow span{
      border:2px solid #e66000!important;
      background:#fff!important;
      color:#24364a;
      opacity:0;
      transform:translateY(10px) scale(.96);
    }
    #packshot .pack-flow i{
      color:#e66000!important;
      opacity:0;
      transform:translateX(-5px);
    }
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
})();
