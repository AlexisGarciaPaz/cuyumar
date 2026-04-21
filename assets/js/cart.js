// ─── CART ─────────────────────────────────────────────────────────────────────

function addToCart(productId) {
  if (!cart[productId]) cart[productId] = 0;
  cart[productId]++;
  updateCartBadge();

  const btn = event.target.closest('.product-add');
  if (btn) {
    const span = btn.querySelector('span');
    const orig = span.textContent;
    span.textContent = lang === 'es' ? '✓ Agregado' : '✓ Added';
    setTimeout(() => { span.textContent = orig; }, 1200);
  }
}

function updateCartBadge() {
  const total = Object.values(cart).reduce((a, b) => a + b, 0);
  document.getElementById('cartCount').textContent = total;
}

function toggleCart() {
  cartOpen = !cartOpen;
  const modal = document.getElementById('cart-modal');
  if (cartOpen) {
    renderCart();
    modal.classList.add('open');
  } else {
    modal.classList.remove('open');
  }
}

function closeCartOutside(e) {
  if (e.target === document.getElementById('cart-modal')) toggleCart();
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const keys = Object.keys(cart).filter(k => cart[k] > 0);

  if (keys.length === 0) {
    container.innerHTML = `<div class="empty-cart">${lang === 'es' ? 'Tu carrito está vacío.' : 'Your cart is empty.'}</div>`;
    document.getElementById('cartTotal').textContent = '$0 MXN';
    return;
  }

  let total = 0;
  container.innerHTML = keys.map(k => {
    const p        = products.find(x => x.id == k);
    const subtotal = p.price * cart[k];
    total += subtotal;
    return `
      <div class="cart-item">
        <div>
          <div class="cart-item-name">${lang === 'es' ? p.nameEs : p.nameEn}</div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${k}, -1)">−</button>
          <span class="qty-display">${cart[k]}</span>
          <button class="qty-btn" onclick="changeQty(${k}, 1)">+</button>
        </div>
        <div class="cart-item-price">$${subtotal}</div>
      </div>`;
  }).join('');

  document.getElementById('cartTotal').textContent = `$${total} MXN`;
}

function changeQty(id, delta) {
  cart[id] = Math.max(0, (cart[id] || 0) + delta);
  updateCartBadge();
  renderCart();
}

function checkout() {
  const keys = Object.keys(cart).filter(k => cart[k] > 0);
  if (keys.length === 0) return;

  const summary = keys.map(k => {
    const p = products.find(x => x.id == k);
    return `${cart[k]}x ${p.nameEs} (${p.weight})`;
  }).join(', ');

  toggleCart();
  openChat();

  const orderText = lang === 'es'
    ? `Hola, me gustaría hacer un pedido: ${summary}. Por favor ayúdame a completarlo.`
    : `Hello, I would like to place an order: ${summary}. Please help me complete it.`;

  setTimeout(() => sendSystemMessage(orderText), 600);
}
