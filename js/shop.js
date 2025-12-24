// Simple shop JS for Luxurious Graphics
const products = [
  {id:1,name:"Premium Logo Pack",price:49,desc:"5 vector logos + source files + 7-day revisions",img:"https://via.placeholder.com/400x300?text=Logo+Pack"},
  {id:2,name:"Social Media Kit",price:29,desc:"Templates for posts, stories & banners",img:"https://via.placeholder.com/400x300?text=Social+Kit"},
  {id:3,name:"Stream Overlay Set",price:34,desc:"Animated overlays, alerts and panels",img:"https://via.placeholder.com/400x300?text=Stream+Overlay"},
  {id:4,name:"Poster & Banner Pack",price:24,desc:"High-res posters for events & promos",img:"https://via.placeholder.com/400x300?text=Poster+Pack"},
  {id:5,name:"Icon & Emoji Set",price:9,desc:"Custom icon set, vector + PNG",img:"https://via.placeholder.com/400x300?text=Icons"},
  {id:6,name:"Brand Starter Kit",price:99,desc:"Logo + color palette + social kit + guide",img:"https://via.placeholder.com/400x300?text=Brand+Kit"}
];

const cart = {} // {id: qty}

function qs(sel){return document.querySelector(sel)}
function qsa(sel){return document.querySelectorAll(sel)}

function renderProducts(){
  const root = qs('#products');
  root.innerHTML = '';
  products.forEach(p=>{
    const el = document.createElement('div'); el.className = 'product card';
    el.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="meta">
        <h4>${p.name}</h4>
        <div class="muted small">${p.desc}</div>
        <div class="price">$${p.price.toFixed(2)}</div>
        <div class="btn-row">
          <button class="view" data-id="${p.id}">View</button>
          <button class="add" data-id="${p.id}">Add to cart</button>
        </div>
      </div>
    `;
    root.appendChild(el);
  });
}

function updateCartUI(){
  const itemsRoot = qs('#cart-items');
  const countRoot = qs('#cart-count');
  const totalRoot = qs('#cart-total');
  const checkoutBtn = qs('#checkout');
  const ids = Object.keys(cart);
  if(ids.length === 0){ itemsRoot.textContent = 'No items yet'; checkoutBtn.disabled = true; countRoot.textContent = '0'; totalRoot.textContent = '0.00'; return}
  itemsRoot.innerHTML = '';
  let total = 0; let count = 0;
  ids.forEach(id=>{
    const p = products.find(x=>x.id==id);
    const qty = cart[id];
    const row = document.createElement('div'); row.style.display='flex'; row.style.justifyContent='space-between'; row.style.marginBottom='8px';
    row.innerHTML = `<div>${p.name} <small class='muted'>x${qty}</small></div><div>$${(p.price*qty).toFixed(2)} <button data-remove="${id}" style='margin-left:8px'>Remove</button></div>`;
    itemsRoot.appendChild(row);
    total += p.price*qty; count += qty;
  });
  countRoot.textContent = String(count);
  totalRoot.textContent = total.toFixed(2);
  checkoutBtn.disabled = false;
}

function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;
  updateCartUI();
}

function removeFromCart(id){
  delete cart[id];
  updateCartUI();
}

function openModal(content){
  const modal = qs('#modal'); const root = qs('#modal-content');
  root.innerHTML = content; modal.hidden = false;
}

function closeModal(){ qs('#modal').hidden = true }

function attachHandlers(){
  qs('#products').addEventListener('click', (e)=>{
    const id = e.target.dataset.id;
    if(!id) return;
    if(e.target.classList.contains('add')){ addToCart(Number(id)); }
    if(e.target.classList.contains('view')){
      const p = products.find(x=>x.id==id);
      openModal(`
        <h3>${p.name}</h3>
        <img src="${p.img}" style='width:100%;height:220px;object-fit:cover;border-radius:6px;margin:8px 0'>
        <p>${p.desc}</p>
        <p class='price'>$${p.price.toFixed(2)}</p>
        <div style='display:flex;gap:8px'><button id='modalAdd' data-id='${p.id}' class='primary'>Add to cart</button> <button id='modalClose' class='muted'>Close</button></div>
      `);
    }
  });

  qs('#modal').addEventListener('click', (e)=>{
    if(e.target === qs('#modal')) closeModal();
  });

  qs('#modal').addEventListener('click', (e)=>{
    if(e.target.id === 'modalClose') closeModal();
    if(e.target.id === 'modalAdd'){
      addToCart(Number(e.target.dataset.id)); closeModal();
    }
  });

  qs('#closeModal').addEventListener('click', closeModal);
  qs('#viewProducts').addEventListener('click', ()=>{
    qs('#products-section').scrollIntoView({behavior:'smooth'});
  });
  qs('#checkout').addEventListener('click', ()=>{
    alert('Checkout demo: Your order total is $' + qs('#cart-total').textContent + '\n(This is a mock checkout)');
    // In a real shop this would redirect to payment/checkout flow
  });
  qs('#cart-items').addEventListener('click', (e)=>{
    const id = e.target.dataset.remove;
    if(id) removeFromCart(id);
  });
}

// Init
renderProducts(); attachHandlers(); updateCartUI();
