(()=>{
  const cards=[...document.querySelectorAll('#wizardProduct .product-card')];

  const round=(ctx,x,y,w,h,r,fill,stroke='#dfe3e8')=>{
    const rr=Math.min(r,w/2,h/2);
    ctx.beginPath();
    ctx.moveTo(x+rr,y);
    ctx.arcTo(x+w,y,x+w,y+h,rr);
    ctx.arcTo(x+w,y+h,x,y+h,rr);
    ctx.arcTo(x,y+h,x,y,rr);
    ctx.arcTo(x,y,x+w,y,rr);
    ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}
  };

  const text=(ctx,value,x,y,size=18,weight=700,color='#24364b',align='center')=>{
    ctx.font=`${weight} ${size}px Inter, Segoe UI, Arial, sans-serif`;
    ctx.textAlign=align;
    ctx.textBaseline='middle';
    ctx.fillStyle=color;
    ctx.fillText(value,x,y);
  };

  const line=(ctx,x1,y1,x2,y2,color='#98a2b3',width=3)=>{
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);
    ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
  };

  function preview(kind){
    const c=document.createElement('canvas');
    c.width=480;c.height=220;
    const ctx=c.getContext('2d');
    ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);
    round(ctx,7,7,466,206,10,'#fcfcfd','#e6e8ec');

    if(kind==='roll'){
      round(ctx,34,45,412,128,12,'#efe3c5','#cbb486');
      round(ctx,48,58,384,102,8,'#f5ecd6','#d7c49f');
      text(ctx,'WILLOW & CO.',240,94,30,800);
      text(ctx,'ARTISAN BAKERY',240,127,15,700,'#4b5c70');
    }

    if(kind==='wrap'){
      round(ctx,158,38,164,146,22,'#b98955','#9e7041');
      round(ctx,178,27,124,28,11,'#c89a66','#a97b49');
      round(ctx,148,91,184,55,8,'#f2e5c9','#d1b98d');
      text(ctx,'WILLOW & CO.',240,116,21,800);
      text(ctx,'COFFEE BLEND',240,139,12,700,'#4b5c70');
    }

    if(kind==='card'){
      ctx.save();ctx.translate(176,113);ctx.rotate(-0.11);
      round(ctx,-105,-58,180,108,8,'#fff','#d7dce3');
      round(ctx,-105,-58,180,20,8,'#efe3c5',null);
      text(ctx,'WILLOW & CO.',-15,-7,19,800);
      text(ctx,'Emma Cole',-90,33,13,700,'#334155','left');
      ctx.restore();
      ctx.save();ctx.translate(282,105);ctx.rotate(0.1);
      round(ctx,-76,-50,180,108,8,'#fff','#d7dce3');
      line(ctx,-58,-20,86,-20,'#e66000',4);
      text(ctx,'WILLOW & CO.',14,8,18,800);
      text(ctx,'Meridian account',14,32,10,600,'#667085');
      ctx.restore();
    }

    if(kind==='flyer'){
      ctx.save();ctx.translate(240,109);ctx.rotate(-0.055);
      round(ctx,-67,-82,134,164,6,'#fffef9','#d7dce3');
      round(ctx,-54,-68,108,36,4,'#efe3c5',null);
      text(ctx,'FRESHLY BAKED',0,-50,13,800);
      round(ctx,-54,-20,45,45,5,'#d6a462',null);
      round(ctx,2,-17,49,7,3,'#e7e9ee',null);
      round(ctx,2,-2,49,7,3,'#e7e9ee',null);
      round(ctx,2,13,40,7,3,'#e7e9ee',null);
      round(ctx,-54,42,108,18,4,'#24364b',null);
      text(ctx,'Weekend bakery offer',0,51,9,700,'#fff');
      ctx.restore();
    }

    if(kind==='carton'){
      ctx.save();ctx.translate(238,110);
      ctx.fillStyle='#d7b58c';ctx.strokeStyle='#b89162';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(-5,-52);ctx.lineTo(92,-33);ctx.lineTo(92,54);ctx.lineTo(-5,36);ctx.closePath();ctx.fill();ctx.stroke();
      round(ctx,-104,-58,108,104,5,'#efe3c5','#c9ae7c');
      text(ctx,'WILLOW & CO.',-50,-15,17,800);
      text(ctx,'BAKERY BOX',-50,13,12,700,'#4b5c70');
      line(ctx,-84,29,-18,29,'#4b5c70',2);
      ctx.restore();
    }

    if(kind==='rollup'){
      round(ctx,184,19,112,162,5,'#fffef9','#d7dce3');
      round(ctx,196,31,88,132,4,'#efe3c5','#cbb486');
      text(ctx,'WILLOW & CO.',240,67,17,800);
      text(ctx,'SOURDOUGH',240,101,21,800);
      text(ctx,'NOW IN STORE',240,126,11,700,'#4b5c70');
      line(ctx,198,177,282,177,'#697586',4);
      line(ctx,240,177,228,198,'#697586',3);
      line(ctx,240,177,252,198,'#697586',3);
    }

    return c.toDataURL('image/png');
  }

  const kinds=['roll','wrap','card','flyer','carton','rollup'];
  cards.forEach((card,i)=>{
    const thumb=card.querySelector('.product-thumb');
    if(!thumb)return;
    const img=document.createElement('img');
    img.alt=card.querySelector('b')?.textContent||'Product preview';
    img.src=preview(kinds[i]);
    img.style.cssText='width:100%;height:100%;object-fit:contain;padding:6px;display:block;background:#fff';
    thumb.replaceChildren(img);
  });

  document.querySelector('#packshot .pack-logo')?.remove();
  const pack=document.querySelector('#packshot .packshot-card');
  if(pack)pack.style.paddingTop='56px';

  ['#reply1','#reply2','#reply3'].forEach(sel=>{
    const author=document.querySelector(`${sel} b`);
    if(author)author.textContent='Emma Cole · Client';
  });
})();
