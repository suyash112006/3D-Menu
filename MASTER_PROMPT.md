# 🍽️ 3D Restaurant Menu App — Master Claude Prompt

> **Version**: 1.0  
> **Last Updated**: 2026-07-02  
> **Status**: Planning Phase

---

## 🎯 Project Overview

Build a premium, full-stack **3D Interactive Restaurant Menu Application** with a complete admin dashboard, QR code management system, and immersive 3D food viewer. The app is designed for restaurant owners to create, manage, and share their menus digitally — and for customers to experience food items in interactive 3D before ordering.

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite |
| Styling | Vanilla CSS + CSS Variables |
| 3D Rendering | Three.js / React Three Fiber |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT (Admin) |
| QR Code | `qrcode` (open-source, free) |
| Image Upload | Multer + Cloudinary (or local) |
| Deployment | Vercel (frontend) + Railway/Render (backend) |

---

## 📱 Application Sections

1. **Landing Page** — Marketing homepage
2. **Restaurant Registration** — Onboarding flow
3. **Admin Dashboard** — Full restaurant management panel
4. **QR Code System** — Generate, preview, download, print QR codes *(NEW)*
5. **Customer Menu Page** — Public-facing 3D interactive menu
6. **3D Viewer** — Full-screen 3D food model viewer

---

## 🔐 Admin Dashboard

### Features
- Secure login (JWT)
- Restaurant profile management
- Menu category management (Add / Edit / Delete)
- Menu item management (Add / Edit / Delete)
- 3D model upload per menu item
- Image upload per menu item
- Toggle item availability
- Analytics overview (views, scans)
- QR Code management panel

### Admin Dashboard Pages
```
/admin/login
/admin/dashboard
/admin/profile
/admin/categories
/admin/menu-items
/admin/qr-code        ← QR Code Management
/admin/analytics
/admin/settings
```

---

## 📱 QR CODE SYSTEM (MVP)

### Overview
Design a completely **free** QR Code Management System.

- ❌ Do NOT use any paid QR code API or third-party QR code service
- ✅ Use the free open-source `qrcode` library to generate QR codes **directly inside the application**
- ✅ QR code contains **only** the restaurant menu URL
- ✅ The website loads everything dynamically after opening the URL

### QR URL Structure
```
https://yourdomain.com/menu/{restaurant-slug}
```

**Example:**
```
https://yourdomain.com/menu/bella-italia-restaurant
```

- Every restaurant has a **unique slug**
- Every generated QR always opens the **latest menu automatically**
- Restaurant owners **never need to regenerate** QR codes after editing menu items

---

### Admin QR Code Features

| Feature | Description |
|---------|-------------|
| **Generate QR Code** | One-click generation from restaurant slug |
| **Preview QR Code** | Live preview with premium styling |
| **Download PNG** | High-resolution PNG export |
| **Download SVG** | Scalable SVG for print |
| **Print QR Code** | Print-ready layout with restaurant name |
| **Regenerate QR Code** | Re-generate without breaking existing URL |
| **Copy Menu URL** | Copy URL to clipboard with toast |
| **Share Menu URL** | Native share API or clipboard fallback |

---

### QR Generation Flow

```
Restaurant Profile
       ↓
Restaurant Slug Created
       ↓
Menu URL Generated
  (https://yourdomain.com/menu/{slug})
       ↓
Generate QR Code (locally, no API)
       ↓
Preview (with luxury gold styling)
       ↓
Download PNG / SVG
       ↓
Print
```

---

### Customer Scan Flow

```
Customer opens Phone Camera
       ↓
Scans QR Code
       ↓
Browser Opens
       ↓
Restaurant Menu Loads
       ↓
Categories
       ↓
Food List
       ↓
Interactive 3D Viewer
```

---

### Technical Requirements

- ✅ Generate QR **locally** (client-side or server-side)
- ✅ No paid API
- ✅ No usage limits
- ✅ Support **high-resolution** QR codes (512x512 minimum)
- ✅ Support **PNG** export
- ✅ Support **SVG** export
- ✅ Print-ready quality
- ✅ Fast generation (< 500ms)
- ✅ Works **offline**

---

### QR Design Specifications

| Property | Specification |
|----------|---------------|
| Style | Premium luxury |
| Corners | Rounded (border-radius on wrapper) |
| Center Logo | Restaurant logo (optional) |
| Accent Color | Gold (#D4AF37) preview border |
| Printable Version | Black and white, high contrast |
| Mobile Optimization | Responsive, touch-friendly |
| Size (preview) | 256x256px |
| Size (export) | 1024x1024px (PNG), scalable (SVG) |

---

### QR Management Screen — Mobile UI Specification

#### States

| State | Description |
|-------|-------------|
| **Empty State** | "No QR code generated yet" with a generate button and illustration |
| **Loading State** | Spinning loader with "Generating QR Code..." text |
| **Success State** | QR preview + all action buttons |
| **Error State** | Error message with retry button |

#### UI Components

```
+---------------------------------+
|  Restaurant Name                |
|  QR Code Management             |
+---------------------------------+
|                                 |
|  +-------------------------+    |
|  |  [Gold border frame]    |    |
|  |                         |    |
|  |    [QR CODE IMAGE]      |    |
|  |                         |    |
|  +-------------------------+    |
|                                 |
|  https://domain.com/menu/..     |
|  [Copy URL]     [Share]         |
|                                 |
|  [Download PNG]                 |
|  [Download SVG]                 |
|  [Print]                        |
|  [Regenerate]                   |
|  [Generate QR Code] (primary)   |
|                                 |
+---------------------------------+
```

#### Animations
- Fade-in on QR generation
- Scale-in on success state
- Pulse effect on gold border during generation
- Smooth toast slide-up for copy/share success
- Hover lift effect on action buttons

#### UX Best Practices
- Single-tap to copy URL
- Clear visual hierarchy: preview → URL → actions
- Accessible contrast ratios (WCAG AA)
- Touch targets minimum 44x44px
- Error messages with actionable retry
- Success toast auto-dismisses after 3 seconds

---

### Recommended Library

```bash
npm install qrcode
```

**Usage (Node.js / server-side):**
```javascript
const QRCode = require('qrcode');

// Generate PNG buffer
const pngBuffer = await QRCode.toBuffer(menuUrl, {
  type: 'png',
  width: 1024,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
});

// Generate SVG string
const svgString = await QRCode.toString(menuUrl, {
  type: 'svg',
  width: 1024,
  margin: 2
});
```

**Usage (React / client-side):**
```javascript
import QRCode from 'qrcode';

// Render to canvas
await QRCode.toCanvas(canvasRef.current, menuUrl, {
  width: 256,
  margin: 2
});

// Render to data URL (for PNG download)
const dataUrl = await QRCode.toDataURL(menuUrl, {
  width: 1024,
  type: 'image/png'
});
```

---

## 🌐 Customer Menu Page

### Route
```
/menu/:restaurantSlug
```

### Features
- Auto-load restaurant data from slug
- Category tabs (horizontal scroll)
- Food item grid/list toggle
- Item detail modal with 3D viewer trigger
- Add to cart (optional MVP feature)
- Restaurant info header (name, logo, hours)
- Mobile-first responsive design
- SEO optimized (meta tags from restaurant data)

---

## 🎮 3D Viewer

### Features
- Full-screen 3D model viewer
- Orbit controls (rotate, zoom, pan)
- Auto-rotate animation
- Model loading progress indicator
- Supported formats: `.glb`, `.gltf`
- Fallback to 2D image if no 3D model
- Share/screenshot 3D view

---

## 🎨 Design System

### Color Palette
```css
:root {
  --color-gold: #D4AF37;
  --color-gold-light: #F4D03F;
  --color-dark: #0A0A0A;
  --color-dark-surface: #1A1A1A;
  --color-dark-card: #242424;
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #A0A0A0;
  --color-accent: #FF6B35;
  --color-success: #22C55E;
  --color-error: #EF4444;
  --color-border: rgba(255, 255, 255, 0.08);
}
```

### Typography
```css
font-family: 'Inter', 'Outfit', sans-serif;
```

### Glassmorphism
```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}
```

---

## 📡 API Endpoints

### Auth
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
GET    /api/auth/me
```

### Restaurant
```
GET    /api/restaurants/:slug          ← Public (customer)
GET    /api/admin/restaurant           ← Admin (own restaurant)
PUT    /api/admin/restaurant           ← Update profile
```

### Categories
```
GET    /api/admin/categories
POST   /api/admin/categories
PUT    /api/admin/categories/:id
DELETE /api/admin/categories/:id
```

### Menu Items
```
GET    /api/admin/menu-items
POST   /api/admin/menu-items
PUT    /api/admin/menu-items/:id
DELETE /api/admin/menu-items/:id
PATCH  /api/admin/menu-items/:id/toggle
```

### QR Code
```
GET    /api/admin/qr-code              ← Get current QR data
POST   /api/admin/qr-code/generate    ← Generate QR (returns PNG buffer)
GET    /api/admin/qr-code/download/png ← Download PNG
GET    /api/admin/qr-code/download/svg ← Download SVG
GET    /api/admin/qr-code/url         ← Get menu URL
```

---

## 🗂️ Folder Structure

```
3D-menu-app/
├── client/                    # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── MenuManager.jsx
│   │   │   │   ├── CategoryManager.jsx
│   │   │   │   ├── QRCodeManager.jsx   ← QR Code System
│   │   │   │   └── Analytics.jsx
│   │   │   ├── menu/
│   │   │   │   ├── MenuPage.jsx
│   │   │   │   ├── CategoryTabs.jsx
│   │   │   │   ├── FoodCard.jsx
│   │   │   │   └── ItemModal.jsx
│   │   │   ├── viewer/
│   │   │   │   └── ThreeDViewer.jsx
│   │   │   └── ui/
│   │   │       ├── Toast.jsx
│   │   │       ├── Button.jsx
│   │   │       ├── Modal.jsx
│   │   │       └── Loader.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── MenuPage.jsx
│   │   ├── hooks/
│   │   │   ├── useQRCode.js            ← QR hook
│   │   │   └── useAuth.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── qrService.js            ← QR service
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── admin.css
│   │   │   └── qr.css                  ← QR styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                    # Node.js Backend
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── restaurantController.js
│   │   ├── menuController.js
│   │   └── qrController.js             ← QR controller
│   ├── models/
│   │   ├── Restaurant.js
│   │   ├── Category.js
│   │   └── MenuItem.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   └── public.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── utils/
│   │   └── qrGenerator.js              ← QR utility
│   ├── app.js
│   └── package.json
│
├── MASTER_PROMPT.md
├── PROJECT_MEMORY.md
└── PHASES.md
```

---

## ✅ Definition of Done

- [ ] Restaurant owner can register and log in
- [ ] Admin can create/edit/delete categories
- [ ] Admin can create/edit/delete menu items with images
- [ ] Admin can upload 3D models per item
- [ ] Admin can generate QR code (free, local, no API)
- [ ] Admin can download QR as PNG and SVG
- [ ] Admin can print QR code
- [ ] Customer can scan QR and view menu
- [ ] Customer can view food items in 3D
- [ ] All pages are mobile-responsive
- [ ] Dark luxury design throughout
- [ ] Zero paid external services for core features
