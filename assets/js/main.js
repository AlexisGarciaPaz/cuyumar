// ─── PRODUCTS DATA ───────────────────────────────────────────────────────────

const products = [
  {
    id: 1,
    nameEs: "Flor de Sal Artesanal",
    nameEn: "Artisan Fleur de Sel",
    descEs: "Cosechada a mano en la Laguna de Cuyutlán. Textura crujiente, sabor puro y gran riqueza mineral. 100% natural, sin aditivos.",
    descEn: "Hand-harvested at Laguna de Cuyutlán. Crunchy texture, pure flavor and rich minerals. 100% natural, no additives.",
    price: 85,
    weight: "250g",
    img: "assets/images/producto-flor-de-sal.jpg",
    tag: "FLOR DE SAL"
  },
  {
    id: 2,
    nameEs: "Flor de Sal — Pack Doble",
    nameEn: "Fleur de Sel — Double Pack",
    descEs: "Dos bolsas de nuestra Flor de Sal. Ideal para regalo o para siempre tener en casa.",
    descEn: "Two bags of our Fleur de Sel. Perfect as a gift or to always have at home.",
    price: 160,
    weight: "2 × 250g",
    img: "assets/images/producto-pack-doble.jpg",
    tag: "MEJOR PRECIO"
  },
  {
    id: 3,
    nameEs: "Flor de Sal — Caja de 6",
    nameEn: "Fleur de Sel — Box of 6",
    descEs: "Para chefs y restaurantes. Precio especial de mayoreo. La Laguna de Cuyutlán en cada platillo.",
    descEn: "For chefs and restaurants. Special wholesale price. Laguna de Cuyutlán in every dish.",
    price: 450,
    weight: "6 × 250g",
    img: "assets/images/producto-caja-seis.jpg",
    tag: "MAYOREO"
  }
];

// ─── GLOBAL STATE ─────────────────────────────────────────────────────────────

let lang = 'es';
let cart = {};
let chatOpen = false;
let cartOpen = false;
let chatHistory = [];
const ANTHROPIC_MODEL = "claude-sonnet-4-20250514";

// ─── RENDER PRODUCTS ──────────────────────────────────────────────────────────

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = products.map(p => `
    <div class="product-card reveal" data-delay="${p.id * 0.1}">
      <div class="product-img">
        <img src="${p.img}"
             alt="${lang === 'es' ? p.nameEs + ' — Flor de sal artesanal de Colima' : p.nameEn + ' — Artisan fleur de sel from Colima'}"
             loading="lazy" width="400" height="260"
             style="width:100%;height:260px;object-fit:cover;object-position:center top;">
        <div class="product-img-label">${p.tag}</div>
      </div>
      <div class="product-info">
        <div class="product-name">${lang === 'es' ? p.nameEs : p.nameEn}</div>
        <div class="product-name-en">${p.weight}</div>
        <p class="product-desc">${lang === 'es' ? p.descEs : p.descEn}</p>
        <div class="product-price">$${p.price} <span>MXN</span></div>
        <button class="product-add" onclick="addToCart(${p.id})">
          <span>${lang === 'es' ? 'Agregar al Carrito' : 'Add to Cart'}</span>
        </button>
      </div>
      <!-- Reveal overlay on hover (pattern: 21st.dev ProductRevealCard) -->
      <div class="product-card-overlay">
        <div class="product-name">${lang === 'es' ? p.nameEs : p.nameEn}</div>
        <p class="product-desc">${lang === 'es' ? p.descEs : p.descEn}</p>
        <button class="product-add" onclick="addToCart(${p.id})">
          <span>${lang === 'es' ? 'Agregar al Carrito' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  `).join('');
  observeReveal();
}

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────

function observeReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}

// ─── LANGUAGE TOGGLE ─────────────────────────────────────────────────────────

document.getElementById('langToggle').addEventListener('click', () => {
  lang = lang === 'es' ? 'en' : 'es';
  document.getElementById('langToggle').textContent = lang === 'es' ? 'EN' : 'ES';

  document.querySelectorAll('[data-es][data-en]').forEach(el => {
    const key = `data-${lang}`;
    if (el.tagName === 'INPUT') {
      el.placeholder = el.getAttribute(key);
    } else {
      el.innerHTML = el.getAttribute(key);
    }
  });

  document.getElementById('chatInput').placeholder =
    lang === 'es' ? 'Escribe tu mensaje...' : 'Type your message...';

  renderProducts();
});

// ─── SCROLL EFFECTS ───────────────────────────────────────────────────────────

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById('progressBar').style.width = (scrolled / max * 100) + '%';

  const nav = document.getElementById('nav');
  nav.classList.toggle('scrolled', scrolled > 80);

  const heroCrystal = document.querySelector('.hero-salt-crystal');
  if (heroCrystal) {
    heroCrystal.style.transform = `translateY(calc(-50% + ${scrolled * 0.15}px))`;
  }

  const bgText = document.querySelector('.origin-bg-text');
  if (bgText) {
    const relScroll = scrolled - document.getElementById('origin').offsetTop;
    bgText.style.transform = `translate(calc(-50% + ${relScroll * 0.05}px), -50%)`;
  }
});

// ─── CUSTOM CURSOR ────────────────────────────────────────────────────────────

const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
  setTimeout(() => {
    ring.style.left = e.clientX + 'px';
    ring.style.top  = e.clientY + 'px';
  }, 80);
});

document.addEventListener('mousedown', () => {
  cursor.classList.add('expanded');
  ring.classList.add('expanded');
});

document.addEventListener('mouseup', () => {
  cursor.classList.remove('expanded');
  ring.classList.remove('expanded');
});

document.querySelectorAll('a, button, [onclick]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('expanded');
    ring.classList.add('expanded');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('expanded');
    ring.classList.remove('expanded');
  });
});

// ─── FLOATING CRYSTALS ───────────────────────────────────────────────────────

function spawnCrystal() {
  const hero    = document.getElementById('hero');
  const crystal = document.createElement('div');
  crystal.className = 'crystal';
  const size = Math.random() * 6 + 2;
  crystal.style.width            = size + 'px';
  crystal.style.height           = size * (Math.random() * 2 + 1) + 'px';
  crystal.style.left             = Math.random() * 100 + '%';
  crystal.style.bottom           = '0';
  crystal.style.animationDuration = (Math.random() * 8 + 6) + 's';
  crystal.style.animationDelay   = (Math.random() * 3) + 's';
  hero.appendChild(crystal);
  setTimeout(() => crystal.remove(), 14000);
}

setInterval(spawnCrystal, 800);

// ─── INIT ─────────────────────────────────────────────────────────────────────

renderProducts();
observeReveal();
