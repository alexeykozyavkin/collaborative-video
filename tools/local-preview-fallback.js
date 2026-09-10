(()=>{
  const names=[
    'roll-label',
    'wraparound-label',
    'business-card',
    'flyer',
    'folding-carton-sleeve',
    'roll-up-banner'
  ];

  [...document.querySelectorAll('#wizardProduct .product-card .product-thumb img')].forEach((img,i)=>{
    if(!names[i])return;
    img.src=`./assets/product-previews-src/${names[i]}.svg`;
  });
})();
