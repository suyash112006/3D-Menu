# 🧠 Project Memory — 3D Restaurant Menu App

> **Purpose**: This is a living document. Update it after every major decision.  
> **Last Updated**: 2026-07-02

---

## 🔑 Key Decisions Log

| # | Decision | Reason | Date |
|---|----------|--------|------|
| 1 | Use `qrcode` npm package (free, open-source) | Zero cost, no API limits, works offline, client-side capable | 2026-07-02 |
| 2 | QR code contains ONLY the menu URL | Simpler, future-proof — menu data loads from server dynamically | 2026-07-02 |
| 3 | Restaurant owners never need to regenerate QR after menu edits | URL stays static, content is always fresh from DB | 2026-07-02 |
| 4 | Dark luxury design with gold (#D4AF37) accents | Premium restaurant feel, matches high-end branding expectations | 2026-07-02 |
| 5 | React + Vite for frontend | Fast HMR, modern tooling, great Three.js compatibility | 2026-07-02 |
| 6 | Node.js + Express backend | Familiar, fast, great QR generation support | 2026-07-02 |
| 7 | MongoDB for database | Flexible schema for varied menu structures | 2026-07-02 |

---

## 📌 Critical Constraints

### QR Code System
- ❌ **NEVER** use paid QR code APIs (Unitag, QR Code Monkey, etc.)
- ❌ **NEVER** embed menu data inside the QR code itself
- ✅ **ALWAYS** generate QR codes locally using the `qrcode` npm library
- ✅ **ALWAYS** use the URL-only approach: `https://domain.com/menu/{slug}`

### Design
- ❌ No TailwindCSS (use Vanilla CSS + CSS Variables)
- ❌ No light theme — dark mode only
- ✅ Gold accent color: `#D4AF37`
- ✅ Glassmorphism cards throughout

### Architecture
- ❌ No monolith — keep client and server separate
- ✅ JWT for admin authentication
- ✅ Public menu page requires NO authentication

---

## 🔗 URL Conventions

```
Admin Panel:    /admin/*
Customer Menu:  /menu/:restaurantSlug
QR Code Admin:  /admin/qr-code
```

### Restaurant Slug Rules
- Lowercase only
- Hyphens instead of spaces
- No special characters
- Unique per restaurant
- Generated from restaurant name on registration

**Example:**
```
"Bella Italia Restaurant" → "bella-italia-restaurant"
"The Golden Fork"         → "the-golden-fork"
```

---

## 📦 Package Decisions

### Frontend Packages
```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "three": "^0.x",
  "@react-three/fiber": "^8.x",
  "@react-three/drei": "^9.x",
  "qrcode": "^1.5.x"
}
```

### Backend Packages
```json
{
  "express": "^4.x",
  "mongoose": "^7.x",
  "jsonwebtoken": "^9.x",
  "bcryptjs": "^2.x",
  "multer": "^1.x",
  "qrcode": "^1.5.x",
  "cors": "^2.x",
  "dotenv": "^16.x"
}
```

---

## 🗃️ Database Schema (Key Models)

### Restaurant
```javascript
{
  name: String,
  slug: String (unique, indexed),
  logo: String (URL),
  description: String,
  phone: String,
  address: String,
  hours: Object,
  owner: ObjectId (ref: User),
  createdAt: Date
}
```

### MenuItem
```javascript
{
  restaurant: ObjectId (ref: Restaurant),
  category: ObjectId (ref: Category),
  name: String,
  description: String,
  price: Number,
  image: String (URL),
  model3D: String (URL, .glb/.gltf),
  isAvailable: Boolean,
  tags: [String]
}
```

### Category
```javascript
{
  restaurant: ObjectId (ref: Restaurant),
  name: String,
  order: Number,
  icon: String
}
```

---

## 🎨 Design Tokens (Lock These In)

```css
/* Colors */
--color-gold:          #D4AF37;
--color-gold-light:    #F4D03F;
--color-dark:          #0A0A0A;
--color-dark-surface:  #1A1A1A;
--color-dark-card:     #242424;
--color-text-primary:  #FFFFFF;
--color-text-secondary:#A0A0A0;
--color-accent:        #FF6B35;
--color-success:       #22C55E;
--color-error:         #EF4444;
--color-border:        rgba(255, 255, 255, 0.08);

/* Typography */
--font-primary: 'Inter', 'Outfit', sans-serif;
--font-size-xs:  0.75rem;
--font-size-sm:  0.875rem;
--font-size-md:  1rem;
--font-size-lg:  1.125rem;
--font-size-xl:  1.25rem;
--font-size-2xl: 1.5rem;
--font-size-3xl: 1.875rem;

/* Spacing */
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-6:  24px;
--space-8:  32px;
--space-12: 48px;
--space-16: 64px;

/* Border Radius */
--radius-sm:  6px;
--radius-md:  12px;
--radius-lg:  16px;
--radius-xl:  24px;
--radius-full:9999px;

/* Shadows */
--shadow-gold: 0 0 30px rgba(212, 175, 55, 0.2);
--shadow-card: 0 8px 32px rgba(0, 0, 0, 0.4);
```

---

## ❓ Open Questions

| # | Question | Status |
|---|----------|--------|
| 1 | Use Cloudinary or local storage for images/3D models? | ⏳ TBD |
| 2 | Add cart/ordering feature in MVP or later? | ⏳ TBD |
| 3 | Multi-language support needed? | ⏳ TBD |
| 4 | Analytics: track QR scans separately per restaurant? | ⏳ TBD |
| 5 | Restaurant logo in QR center: optional toggle or default? | ⏳ TBD |
| 6 | Deploy to custom domain or subdomain per restaurant? | ⏳ TBD |

---

## 📝 Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-07-02 | Initial project memory created | Claude |
| 2026-07-02 | QR Code System section added to master prompt | Claude |
| 2026-07-02 | Project phases defined | Claude |
