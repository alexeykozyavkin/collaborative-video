(()=>{
  /* Rebuild the mobile editor artwork as a real editable HTML design rather than text laid over a PDF/SVG proof. */
  const wrap=document.querySelector('#mobileEditor .editor-artwork-wrap');
  if(!wrap)return;

  wrap.innerHTML=`
    <div class="cc-label-editor" aria-label="Editable Willow & Co. label">
      <div class="cc-label-border cc-label-border-outer"></div>
      <div class="cc-label-border cc-label-border-inner"></div>
      <div class="cc-label-brand">WILLOW &amp; CO.</div>
      <div class="cc-label-subtitle">ARTISAN BAKERY</div>
      <div class="cc-label-flourish">❧ · ❧</div>
      <div id="editorProductLive" class="cc-label-editable cc-label-product">ORGANIC SOURDOUGH</div>
      <div class="cc-label-divider"></div>
      <div class="cc-label-description">Slow fermented for flavour</div>
      <div id="editorClaimLive" class="cc-label-editable cc-label-claim">MADE WITH SIMPLE INGREDIENTS</div>
    </div>`;

  const style=document.createElement('style');
  style.textContent=`
    #mobileEditor #editSelection{display:none!important}
    #mobileEditor .editor-canvas{height:440px;background:#f1f2f3;display:grid;place-items:center;padding:30px 0}
    #mobileEditor .editor-artwork-wrap{width:min(86%,340px)!important;margin:auto;display:block!important;position:relative!important}
    #mobileEditor .cc-label-editor{
      position:relative;width:100%;aspect-ratio:3/2;background:#f4ead1;color:#24364a;
      box-shadow:0 8px 24px rgba(15,23,42,.14);overflow:visible;font-family:Segoe UI,Arial,sans-serif;
    }
    #mobileEditor .cc-label-border{position:absolute;pointer-events:none;border-style:solid;border-color:#b9a679}
    #mobileEditor .cc-label-border-outer{left:4.8%;right:4.8%;top:6.5%;bottom:6.5%;border-width:1.3px;border-radius:7px}
    #mobileEditor .cc-label-border-inner{left:6.8%;right:6.8%;top:9.5%;bottom:9.5%;border-width:.8px;border-color:#cdbd96;border-radius:5px}
    #mobileEditor .cc-label-brand{position:absolute;left:8%;right:8%;top:16.5%;text-align:center;font-size:25px;font-weight:800;letter-spacing:-.02em}
    #mobileEditor .cc-label-subtitle{position:absolute;left:8%;right:8%;top:29%;text-align:center;font-size:9px;font-weight:700;letter-spacing:2.2px}
    #mobileEditor .cc-label-flourish{position:absolute;left:8%;right:8%;top:38.2%;text-align:center;font-size:8px}
    #mobileEditor .cc-label-editable{position:absolute;left:50%;transform:translateX(-50%);text-align:center;transition:box-shadow .16s ease,background .16s ease}
    #mobileEditor .cc-label-product{
      width:68%;top:48.5%;min-height:48px;display:flex;align-items:center;justify-content:center;
      font-size:21px;line-height:1.03;font-weight:800;text-transform:uppercase;padding:2px 6px;
    }
    #mobileEditor .cc-label-divider{position:absolute;left:21.7%;right:21.7%;top:67.5%;height:1px;background:#24364a;opacity:.75}
    #mobileEditor .cc-label-description{position:absolute;left:12%;right:12%;top:72.5%;text-align:center;font-size:7.5px;color:#455467}
    #mobileEditor .cc-label-claim{
      width:63.3%;bottom:9.8%;min-height:21px;display:flex;align-items:center;justify-content:center;
      border-radius:3px;background:#24364a;color:#fff;font-size:7.8px;line-height:1;font-weight:800;
      letter-spacing:.45px;text-transform:uppercase;padding:4px 8px;
    }
    #mobileEditor .cc-label-editable.editing{
      box-shadow:0 0 0 2px #1677ff,0 0 0 5px rgba(22,119,255,.14);z-index:4;
    }
    #mobileEditor .cc-label-product.editing{background:rgba(255,255,255,.34);border-radius:2px}
    #mobileEditor .cc-label-claim.editing{box-shadow:0 0 0 2px #1677ff,0 0 0 5px rgba(22,119,255,.14)}
  `;
  document.head.appendChild(style);

  const typeTo=(text,t,start,end)=>{
    if(t<=start)return'';
    if(t>=end)return text;
    return text.slice(0,Math.floor(((t-start)/(end-start))*text.length));
  };

  const previousApply=window.apply;
  if(typeof previousApply==='function')window.apply=function(t){
    previousApply(t);

    const productField=document.querySelector('#copyField');
    const claimField=document.querySelector('#claimField');
    const productLive=document.querySelector('#editorProductLive');
    const claimLive=document.querySelector('#editorClaimLive');

    let product='Organic Sourdough';
    if(t>=66.2&&t<69.4)product=typeTo('Sourdough Boule',t,66.2,69.4);
    else if(t>=69.4)product='Sourdough Boule';

    let claim='Made with simple ingredients';
    if(t>=70.3&&t<73.3)claim=typeTo('No artificial flavors',t,70.3,73.3);
    else if(t>=73.3)claim='No artificial flavors';

    if(productField)productField.value=product;
    if(claimField)claimField.value=claim;
    if(productLive)productLive.textContent=product||' ';
    if(claimLive)claimLive.textContent=claim||' ';

    productLive?.classList.toggle('editing',t>=65.7&&t<69.5);
    claimLive?.classList.toggle('editing',t>=69.8&&t<73.4);
  };

  /* Re-apply the current scrubber position after replacing the artwork DOM. */
  const current=Number(document.querySelector('#scrubber')?.value||0);
  if(typeof window.apply==='function')window.apply(current);
})();
