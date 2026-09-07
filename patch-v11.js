(()=>{
  const OLD='collaborative-order.local';
  const NEW='customerscanvas.com';

  function replaceTextNodes(root){
    if(!root) return;
    if(root.nodeType===Node.TEXT_NODE){
      if(root.data && root.data.includes(OLD)) root.data=root.data.replaceAll(OLD,NEW);
      return;
    }
    if(root.nodeType!==Node.ELEMENT_NODE && root.nodeType!==Node.DOCUMENT_FRAGMENT_NODE) return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){
      if(node.data && node.data.includes(OLD)) node.data=node.data.replaceAll(OLD,NEW);
    }
  }

  let chatScrollScheduled=false;
  function pinChats(){
    if(chatScrollScheduled) return;
    chatScrollScheduled=true;
    requestAnimationFrame(()=>{
      chatScrollScheduled=false;
      ['designerThread','prepressThread','directorThread'].forEach(id=>{
        const el=document.getElementById(id);
        if(el) el.scrollTop=el.scrollHeight;
      });
    });
  }

  function observe(){
    const observer=new MutationObserver(records=>{
      for(const record of records){
        for(const node of record.addedNodes) replaceTextNodes(node);
      }
      pinChats();
    });
    observer.observe(document.body,{subtree:true,childList:true});
  }

  function wireAction(){
    const action=document.getElementById('action');
    if(!action) return;
    action.addEventListener('click',()=>{
      document.body.classList.add('recording');
      document.getElementById('restart')?.click();
      setTimeout(()=>document.getElementById('play')?.click(),1000);
    });
  }

  replaceTextNodes(document.body);
  pinChats();
  observe();
  wireAction();
})();
