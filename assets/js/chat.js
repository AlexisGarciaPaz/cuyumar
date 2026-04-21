// ─── CHAT ─────────────────────────────────────────────────────────────────────

function toggleChat() {
  chatOpen = !chatOpen;
  const panel = document.getElementById('chat-panel');
  const btn   = document.getElementById('chat-btn');
  if (chatOpen) {
    panel.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    if (chatHistory.length === 0) initChat();
    setTimeout(() => document.getElementById('chatInput').focus(), 300);
  } else {
    panel.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }
}

function openChat() {
  chatOpen = true;
  const panel = document.getElementById('chat-panel');
  const btn   = document.getElementById('chat-btn');
  panel.classList.add('open');
  btn.setAttribute('aria-expanded', 'true');
  if (chatHistory.length === 0) initChat();
  setTimeout(() => document.getElementById('chatInput').focus(), 300);
}

function initChat() {
  const welcome = lang === 'es'
    ? '¡Hola! Soy Marina, tu asistente de Cuyumar 🧂 ¿En qué puedo ayudarte hoy? Puedo informarte sobre nuestros productos, hacer un pedido o resolver tus dudas.'
    : 'Hello! I\'m Marina, your Cuyumar assistant 🧂 I can help you learn about our products, place an order, or answer any questions. How can I help you today?';

  addBotMessage(welcome);

  showQuickReplies(lang === 'es'
    ? ['¿Qué productos tienen?', 'Quiero hacer un pedido', '¿Hacen envíos?', 'Precios al mayoreo']
    : ['What products do you have?', 'I want to place an order', 'Do you ship?', 'Wholesale prices']);
}

function addBotMessage(text) {
  const msgs = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className  = 'msg bot';
  div.innerHTML  = `<div class="msg-avatar">🧂</div><div class="msg-bubble">${text}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function addUserMessage(text) {
  const msgs = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className  = 'msg user';
  div.innerHTML  = `<div class="msg-avatar">👤</div><div class="msg-bubble">${text}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className = 'msg bot';
  div.id        = 'typingIndicator';
  div.innerHTML = `
    <div class="msg-avatar">🧂</div>
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typingIndicator');
  if (t) t.remove();
}

function showQuickReplies(replies) {
  const container = document.getElementById('quickReplies');
  container.innerHTML = replies.map(r =>
    `<button class="quick-reply" onclick="quickReply('${r}')">${r}</button>`
  ).join('');
}

function quickReply(text) {
  document.getElementById('chatInput').value = text;
  sendMessage();
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const text  = input.value.trim();
  if (!text) return;

  input.value = '';
  addUserMessage(text);
  document.getElementById('quickReplies').innerHTML = '';

  const productList = products.map(p =>
    `- ${p.nameEs} / ${p.nameEn}: $${p.price} MXN por ${p.weight}`
  ).join('\n');

  chatHistory.push({ role: 'user', content: text });
  showTyping();

  const systemPrompt = `Eres Marina, la asistente virtual de Cuyumar, una marca de sal artesanal de Colima, México.

PRODUCTOS DISPONIBLES:
${productList}

INFORMACIÓN CLAVE:
- Envíos a toda la República Mexicana en 24-72 horas hábiles
- Pedidos mínimos desde 250g
- Precios especiales para mayoreo (10+ unidades: 15% descuento)
- Pago por transferencia bancaria, OXXO o tarjeta
- WhatsApp: +52 1 XXX XXX XXXX
- Email: contacto@cuyumar.com.mx
- Instagram: @cuyumar.com.mx

PERSONALIDAD:
- Cálida, profesional y apasionada por el producto
- Conoces la historia y propiedades de la sal de Colima
- Ayudas a tomar pedidos recogiendo: producto(s), cantidad, nombre, dirección completa, método de pago preferido
- Idioma: responde en el mismo idioma que el usuario (español o inglés)
- Respuestas concisas, máximo 3-4 líneas

CUANDO TOMEN UN PEDIDO:
1. Confirma los productos y cantidades
2. Pide nombre completo
3. Pide dirección de envío con código postal
4. Confirma método de pago
5. Da el total y tiempo estimado de entrega
6. Proporciona el número de WhatsApp para seguimiento`;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 1000,
        system: systemPrompt,
        messages: chatHistory
      })
    });

    const data = await response.json();
    removeTyping();

    const reply = data.content?.[0]?.text
      || (lang === 'es' ? 'Lo siento, hubo un error. Por favor escríbenos al WhatsApp.' : 'Sorry, there was an error. Please contact us on WhatsApp.');

    chatHistory.push({ role: 'assistant', content: reply });
    addBotMessage(reply);

    if (text.toLowerCase().includes('precio') || text.toLowerCase().includes('price') || text.toLowerCase().includes('product')) {
      showQuickReplies(lang === 'es'
        ? ['Agregar al carrito', 'Precio al mayoreo', 'Hacer un pedido']
        : ['Add to cart', 'Wholesale price', 'Place an order']);
    } else if (text.toLowerCase().includes('envío') || text.toLowerCase().includes('ship')) {
      showQuickReplies(lang === 'es'
        ? ['Hacer un pedido', 'Métodos de pago', '¿Cuánto tarda?']
        : ['Place an order', 'Payment methods', 'How long does it take?']);
    }

  } catch {
    removeTyping();
    addBotMessage(lang === 'es'
      ? 'Lo siento, hubo un error de conexión. Contáctanos por WhatsApp o al email contacto@cuyumar.com.mx'
      : 'Sorry, there was a connection error. Contact us on WhatsApp or at contacto@cuyumar.com.mx');
  }
}

async function sendSystemMessage(systemText) {
  chatHistory.push({ role: 'user', content: systemText });
  showTyping();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 1000,
        messages: chatHistory
      })
    });

    const data  = await response.json();
    removeTyping();
    const reply = data.content?.[0]?.text || 'Perfecto, confirmemos tu pedido.';
    chatHistory.push({ role: 'assistant', content: reply });
    addBotMessage(reply);
  } catch {
    removeTyping();
    addBotMessage('Confirmemos tu pedido. ¿Puedes darme tu nombre y dirección de envío?');
  }
}
