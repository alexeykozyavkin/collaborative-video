(()=>{
  const replaceDomains=()=>{
    document.querySelectorAll('body *').forEach(el=>{
      if(el.children.length===0 && el.textContent && el.textContent.includes('collaborative-order.local')){
        el.textContent=el.textContent.replaceAll('collaborative-order.local','customerscanvas.com');
      }
    });
    const tab=document.querySelector('.browser-tab');
    const address=document.querySelector('.browser-bar .address');
    if(tab) tab.childNodes[tab.childNodes.length-1].textContent='Customer’s Canvas';
    if(address) address.textContent='🔒 customerscanvas.com';
  };

  const pinChats=()=>{
    ['designerThread','prepressThread','directorThread'].forEach(id=>{
      const el=document.getElementById(id);
      if(el) el.scrollTop=el.scrollHeight;
    });
  };

  const observe=()=>{
    const observer=new MutationObserver(()=>{
      replaceDomains();
      pinChats();
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
  };

  const wireAction=()=>{
    const action=document.getElementById('action');
    if(!action) return;
    action.addEventListener('click',()=>{
      document.body.classList.add('recording');
      document.getElementById('restart')?.click();
      setTimeout(()=>document.getElementById('play')?.click(),1000);
    });
  };

  replaceDomains();
  pinChats();
  observe();
  wireAction();
})();
