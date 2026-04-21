# CUYUMAR — Sal Artesanal de Colima

Landing page para Cuyumar, marca de sal artesanal cosechada a mano en la Laguna de Cuyutlán, Colima, México.

## Estructura del proyecto

```
cuyumar/
├── index.html              # Página principal
├── assets/
│   ├── css/
│   │   ├── main.css        # Variables, reset, body, botones utilitarios
│   │   ├── animations.css  # Keyframes y clases de animación/reveal
│   │   └── components.css  # Estilos por componente + media queries
│   ├── js/
│   │   ├── main.js         # Datos de productos, estado global, scroll, cursor, crystals
│   │   ├── cart.js         # Carrito de compra
│   │   └── chat.js         # Chat IA con Marina (Claude API)
│   ├── images/
│   │   └── producto-flor-de-sal.jpg
│   └── fonts/              # (vacío — usa Google Fonts CDN)
├── components/             # Fragmentos HTML de referencia
│   ├── hero.html
│   ├── benefits.html
│   ├── products.html
│   └── chat.html
└── README.md
```

## Correr localmente

No requiere build. Abre `index.html` directamente en el navegador, o usa un servidor local para evitar restricciones CORS en el chat:

```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .

# VS Code
# Instala "Live Server" y haz clic en "Go Live"
```

Luego abre `http://localhost:8080`.

## Variables de entorno / configuración

El chat IA llama directamente a `https://api.anthropic.com/v1/messages` desde el frontend.

**Para producción**, reemplaza la llamada directa con un endpoint propio que proteja la API key:

1. Crea un endpoint en tu servidor (ej. `/api/chat`)
2. En `assets/js/chat.js`, cambia la URL del `fetch` a tu endpoint
3. El servidor inyecta el header `x-api-key: <tu_key>` y renvía la request a Anthropic

Modelo en uso: `claude-sonnet-4-20250514` (configurable en `main.js` → `ANTHROPIC_MODEL`).

## Tecnologías

- HTML5 + CSS3 + JavaScript vanilla (sin framework ni build step)
- Tipografías: Playfair Display, Cormorant Garamond, Space Mono (Google Fonts)
- Chat IA: Anthropic Claude API
- Listo para deploy en Vercel, Netlify o cualquier hosting estático

## Paleta de colores

| Token      | Valor     | Uso                          |
|------------|-----------|------------------------------|
| `--sand`   | `#F2E8D9` | Fondo principal              |
| `--salt`   | `#FAFAF7` | Fondo secundario / texto     |
| `--ocean`  | `#1A3A4A` | Primario oscuro              |
| `--deep`   | `#0D2030` | Footer / chat background     |
| `--coral`  | `#C4622D` | Acento / CTA                 |
| `--gold`   | `#B8860B` | Acento secundario            |
| `--foam`   | `#E8F0ED` | Sección order                |
| `--mist`   | `#8FA8B2` | Texto secundario             |

## Contacto

- Email: contacto@cuyumar.com.mx
- WhatsApp: +52 800 327 2512
- Instagram: @cuyumar.com.mx
