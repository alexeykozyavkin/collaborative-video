(()=>{
  const panel=document.querySelector('#sellerCreate');
  if(!panel)return;
  panel.classList.add('wizard-panel');
  panel.innerHTML=`
              <div class="wizard-steps">
                <div id="stepCustomer" class="wizard-step active"><span>1</span><div><b>Customer</b><small id="stepCustomerValue">In progress</small></div></div>
                <div id="stepProduct" class="wizard-step"><span>2</span><div><b>Product</b><small id="stepProductValue">Not started</small></div></div>
                <div id="stepOptions" class="wizard-step"><span>3</span><div><b>Options</b><small id="stepOptionsValue">Not started</small></div></div>
                <div id="stepSummary" class="wizard-step"><span>4</span><div><b>Summary</b><small id="stepSummaryValue">Not started</small></div></div>
              </div>

              <section id="wizardCustomer" class="wizard-screen">
                <div class="wizard-maincol">
                  <h3>Customer</h3>
                  <label class="wizard-label">Find an existing customer by name or email
                    <input id="customerSearch" value="Willow & Co." readonly>
                  </label>
                  <div id="customerPick" class="customer-pick selected">
                    <span class="customer-avatar">EC</span><div><b>Emma Cole</b><small>emma@willowandco.example.com · Willow & Co.</small></div><span class="selected-check">✓</span>
                  </div>
                </div>
                <aside class="order-so-far"><b>ORDER SO FAR</b><div><small>Customer</small><strong>Emma Cole · Willow & Co.</strong></div></aside>
                <footer class="wizard-footer"><span>Creating the order does not notify anyone. Inviting the customer is a separate step.</span><button id="continueProductBtn" class="primary">Continue to product</button></footer>
              </section>

              <section id="wizardProduct" class="wizard-screen hidden">
                <div class="wizard-maincol">
                  <div class="wizard-title-row"><h3>Choose a product</h3><div class="catalog-search">⌕ <span>Search catalog</span></div></div>
                  <div class="product-grid">
                    <div id="rollLabelProduct" class="product-card selected"><div class="product-thumb"><img src="./assets/willow-label-v1.svg"></div><b>Roll label</b><small>Kraft / BOPP · 20–120 mm</small><span class="selected-check">✓</span></div>
                    <div class="product-card"><div class="product-thumb">▧</div><b>Wraparound label</b><small>Coffee & retail bags</small></div>
                    <div class="product-card"><div class="product-thumb">▤</div><b>Business card</b><small>350–400 g</small></div>
                    <div class="product-card"><div class="product-thumb">▱</div><b>Flyer A5 / A4</b><small>115–250 g · 4/4</small></div>
                    <div class="product-card"><div class="product-thumb">◇</div><b>Folding carton sleeve</b><small>FSC board · die-cut</small></div>
                    <div class="product-card"><div class="product-thumb">▥</div><b>Roll-up banner</b><small>850 × 2000 mm</small></div>
                  </div>
                </div>
                <aside class="order-so-far"><b>ORDER SO FAR</b><div><small>Customer</small><strong>Emma Cole · Willow & Co.</strong></div><div><small>Product</small><strong>Roll label</strong></div></aside>
                <footer class="wizard-footer"><span>Catalog and versions come from the connected Customer's Canvas Hub tenant.</span><button id="continueOptionsBtn" class="primary">Continue to options</button></footer>
              </section>

              <section id="wizardOptions" class="wizard-screen hidden">
                <div class="wizard-maincol options-main">
                  <h3>Options</h3><p class="wizard-sub">Roll label · options and values come from the product in PIM.</p>
                  <div class="option-grid">
                    <div class="option-group"><small>Size</small><div><button class="choice selected">60 × 40 mm</button><button class="choice">76 × 51 mm</button><button class="choice">100 × 150 mm</button></div></div>
                    <div class="option-group"><small>Stock</small><div><button class="choice selected">Kraft uncoated</button><button class="choice">White BOPP</button><button class="choice">Thermal top</button></div></div>
                    <div class="option-group"><small>Finish</small><div><button class="choice selected">None</button><button class="choice disabled">Matte lamination</button><button class="choice disabled">Gloss varnish</button></div></div>
                    <div class="option-group"><small>Adhesive</small><div><button class="choice selected">Permanent</button><button class="choice">Removable</button><button class="choice">Freezer-grade</button></div></div>
                    <div class="option-group"><small>Winding</small><div><button class="choice selected">Outside</button><button class="choice">Inside</button></div></div>
                    <div class="option-group"><small>Core</small><div><button class="choice selected">40 mm</button><button class="choice">76 mm</button></div></div>
                  </div>
                  <div class="variant-card"><div><small>PRODUCT VARIANT</small><b>60 × 40 mm · Kraft uncoated · No finish · Permanent adhesive · Outside wound · 40 mm core</b><code>RL-6040-KRAFT-NF-5000</code></div><img src="./assets/willow-label-v1.svg"></div>
                  <div class="quantity-row"><b>Quantity</b><button class="choice">1,000 pcs</button><button class="choice selected">5,000 pcs</button><button class="choice">10,000 pcs</button></div>
                </div>
                <aside class="order-so-far"><b>ORDER SO FAR</b><div><small>Customer</small><strong>Emma Cole · Willow & Co.</strong></div><div><small>Product</small><strong>Roll label</strong></div><div><small>Options</small><strong>60 × 40 mm · Kraft uncoated</strong></div></aside>
                <footer class="wizard-footer"><span>Print requirements and deadline stay editable per order.</span><button id="continueSummaryBtn" class="primary">Continue to summary</button></footer>
              </section>

              <section id="wizardSummary" class="wizard-screen hidden">
                <div class="summary-layout">
                  <div class="summary-list">
                    <h3>Summary</h3><p class="wizard-sub">Review everything below, then create the order as a Draft.</p>
                    <div class="summary-row"><small>Customer</small><b>Emma Cole · Willow & Co.</b></div>
                    <div class="summary-row"><small>Product</small><b>Roll label</b></div>
                    <div class="summary-row"><small>Product variant</small><b>60 × 40 mm · Kraft uncoated · No finish · Permanent adhesive · Outside wound · 40 mm core</b></div>
                    <div class="summary-row"><small>Quantity</small><b>5,000 pcs</b></div>
                    <div class="summary-row"><small>Due</small><b>Jun 18, 2026</b></div>
                    <div class="summary-row"><small>Workflow</small><b>Tenant default</b></div>
                  </div>
                  <div class="summary-art"><small>INITIAL ARTWORK</small><img src="./assets/willow-label-v1.svg"><b>Willow_Label_v1.pdf</b></div>
                </div>
                <footer class="wizard-footer"><span>Creating the draft keeps the customer unnotified until Dana sends the invitation.</span><button id="createOrderBtn" class="primary">Create order as Draft</button></footer>
              </section>
`;
})();
