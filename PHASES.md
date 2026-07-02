# 🗺️ Development Phases — 3D Restaurant Menu App

> **Total Estimated Time**: 8–12 weeks (solo dev)  
> **Last Updated**: 2026-07-02

---

## Overview

```
Phase 0  → Project Setup & Foundation         (Week 1)
Phase 1  → Backend Core & Auth                (Week 2–3)
Phase 2  → Admin Dashboard                    (Week 3–4)
Phase 3  → QR Code System MVP                 (Week 5)      ← NEW
Phase 4  → Customer Menu & 3D Viewer          (Week 6–8)
Phase 5  → Polish, Testing & Deployment       (Week 9–12)
```

---

## Phase 0 — Project Setup & Foundation

**Duration**: 3–5 days  
**Goal**: Scaffold the project, set up tooling, and establish the design system.

### Tasks

#### Frontend Setup
- [ ] Initialize React + Vite project (`client/`)
- [ ] Install dependencies: react-router-dom, three, @react-three/fiber, @react-three/drei, qrcode
- [ ] Set up folder structure (`components/`, `pages/`, `hooks/`, `services/`, `styles/`)
- [ ] Import Google Fonts (Inter, Outfit) in index.html
- [ ] Create `index.css` with all CSS variables (design tokens)
- [ ] Create base component stubs: Button, Toast, Modal, Loader
- [ ] Set up React Router with all route paths

#### Backend Setup
- [ ] Initialize Node.js + Express project (`server/`)
- [ ] Install dependencies: express, mongoose, jsonwebtoken, bcryptjs, multer, qrcode, cors, dotenv
- [ ] Set up folder structure (`controllers/`, `models/`, `routes/`, `middleware/`, `utils/`)
- [ ] Connect to MongoDB (local dev + Atlas for prod)
- [ ] Create `.env` template

#### DevOps
- [ ] Create root `package.json` with `dev` script (concurrently runs client + server)
- [ ] Set up `.gitignore`
- [ ] Initialize git repository

### Deliverables
- Running dev environment (client + server)
- Design system CSS with all tokens
- Empty route structure

---

## Phase 1 — Backend Core & Authentication

**Duration**: 1 week  
**Goal**: Build all backend models, auth system, and core API endpoints.

### Tasks

#### Models
- [ ] `User` model (email, password, role)
- [ ] `Restaurant` model (name, slug, logo, description, phone, address, hours, owner)
- [ ] `Category` model (restaurant ref, name, order, icon)
- [ ] `MenuItem` model (restaurant ref, category ref, name, description, price, image, model3D, isAvailable, tags)

#### Auth
- [ ] `POST /api/auth/register` — Create restaurant owner account
- [ ] `POST /api/auth/login` — JWT token response
- [ ] `GET /api/auth/me` — Verify token
- [ ] JWT middleware for protected routes
- [ ] Password hashing with bcryptjs

#### Restaurant API
- [ ] `GET /api/restaurants/:slug` — Public endpoint (loads full menu)
- [ ] `GET /api/admin/restaurant` — Admin view own restaurant
- [ ] `PUT /api/admin/restaurant` — Update profile
- [ ] Auto-generate slug from restaurant name on registration

#### Category API
- [ ] `GET /api/admin/categories`
- [ ] `POST /api/admin/categories`
- [ ] `PUT /api/admin/categories/:id`
- [ ] `DELETE /api/admin/categories/:id`

#### Menu Item API
- [ ] `GET /api/admin/menu-items`
- [ ] `POST /api/admin/menu-items` (with image upload via Multer)
- [ ] `PUT /api/admin/menu-items/:id`
- [ ] `DELETE /api/admin/menu-items/:id`
- [ ] `PATCH /api/admin/menu-items/:id/toggle` (toggle availability)

#### Upload
- [ ] Multer middleware for image uploads
- [ ] Multer middleware for 3D model uploads (.glb, .gltf)
- [ ] File size and type validation

### Deliverables
- Complete REST API (Postman-testable)
- Working auth with JWT
- File upload system

---

## Phase 2 — Admin Dashboard

**Duration**: 1–2 weeks  
**Goal**: Build the full admin panel for restaurant management.

### Tasks

#### Admin Login Page (`/admin/login`)
- [ ] Email + password form
- [ ] JWT stored in localStorage/httpOnly cookie
- [ ] Redirect to dashboard on success
- [ ] Error handling with toast

#### Admin Dashboard (`/admin/dashboard`)
- [ ] Summary cards: total items, categories, QR scans
- [ ] Quick actions: Add item, View menu, Generate QR
- [ ] Dark luxury design with gold accents

#### Restaurant Profile (`/admin/profile`)
- [ ] Edit restaurant name, description, phone, address
- [ ] Upload restaurant logo
- [ ] Operating hours editor
- [ ] Slug display (read-only, auto-generated)

#### Category Manager (`/admin/categories`)
- [ ] List all categories (drag-to-reorder optional)
- [ ] Add category (name, icon)
- [ ] Edit category inline
- [ ] Delete with confirmation modal

#### Menu Item Manager (`/admin/menu-items`)
- [ ] Grid view of all menu items
- [ ] Add item form: name, price, description, category, image, 3D model upload
- [ ] Edit item modal
- [ ] Delete item with confirmation
- [ ] Toggle availability (available/unavailable badge)
- [ ] Filter by category

#### Admin Navigation
- [ ] Sidebar (desktop) / Bottom nav (mobile)
- [ ] Active route highlighting
- [ ] Logout button

### Deliverables
- Fully functional admin CRUD panel
- Mobile-responsive layout
- Premium dark UI

---

## Phase 3 — QR Code System MVP

**Duration**: 3–5 days  
**Goal**: Build the complete free QR code generation, preview, download, and print system.

> ✅ Uses `qrcode` npm library only — zero cost, no third-party API

### Tasks

#### Backend QR Controller (`server/controllers/qrController.js`)
- [ ] `GET /api/admin/qr-code/url` — Return the restaurant's menu URL
- [ ] `POST /api/admin/qr-code/generate` — Generate and return QR as PNG buffer
- [ ] `GET /api/admin/qr-code/download/png` — Stream PNG download (1024x1024)
- [ ] `GET /api/admin/qr-code/download/svg` — Stream SVG download

#### QR Utility (`server/utils/qrGenerator.js`)
- [ ] `generateQRBuffer(url)` — Returns PNG buffer using `qrcode`
- [ ] `generateQRSVG(url)` — Returns SVG string using `qrcode`
- [ ] High-resolution: minimum 1024x1024px for PNG
- [ ] High contrast: dark: `#000000`, light: `#FFFFFF`
- [ ] Add margin: 2 modules

#### Frontend QR Service (`client/src/services/qrService.js`)
- [ ] `getMenuUrl()` — Fetch restaurant menu URL from API
- [ ] `generateQR()` — Request QR generation
- [ ] `downloadPNG()` — Trigger PNG download
- [ ] `downloadSVG()` — Trigger SVG download

#### Frontend QR Hook (`client/src/hooks/useQRCode.js`)
- [ ] State: `{ qrDataUrl, menuUrl, isLoading, error, generated }`
- [ ] `generate()` — Generate QR using `qrcode` client-side
- [ ] `copyUrl()` — Copy menu URL to clipboard
- [ ] `share()` — Use Web Share API with clipboard fallback
- [ ] `downloadPNG()` — Download PNG via anchor click
- [ ] `downloadSVG()` — Download SVG via server endpoint

#### QR Code Manager Component (`client/src/components/admin/QRCodeManager.jsx`)
- [ ] **Empty State**: Illustration + "Generate Your QR Code" CTA
- [ ] **Loading State**: Spinner + "Generating QR Code..." text with pulse animation
- [ ] **Success State**: Full QR preview + all action buttons
- [ ] **Error State**: Error message + Retry button

**QR Preview Component:**
- [ ] Canvas-rendered QR code (via `qrcode` library)
- [ ] Gold gradient border frame around QR
- [ ] Optional restaurant logo overlay in center
- [ ] Responsive sizing (256px preview, 1024px export)

**Action Buttons:**
- [ ] `[✨ Generate QR Code]` — Primary gold button
- [ ] `[⬇ Download PNG]` — Download high-res PNG
- [ ] `[⬇ Download SVG]` — Download scalable SVG
- [ ] `[🖨️ Print]` — Open print dialog with print-ready layout
- [ ] `[🔄 Regenerate]` — Re-generate (URL stays the same)
- [ ] `[📋 Copy URL]` — Copy to clipboard with success toast
- [ ] `[📤 Share]` — Web Share API / clipboard fallback

**URL Display:**
- [ ] Truncated URL display with full text on tap
- [ ] Copy icon next to URL

#### Print Functionality
- [ ] Print-only CSS (`@media print`)
- [ ] Show: QR code (large), restaurant name, URL text, "Scan to view menu"
- [ ] Hide: all navigation, buttons, other UI elements
- [ ] Black & white print version
- [ ] QR at minimum 300 DPI equivalent resolution

#### QR Styles (`client/src/styles/qr.css`)
- [ ] Gold border animation (pulse on loading, static on success)
- [ ] Fade-in animation for QR appearance
- [ ] Scale-in for success state
- [ ] Toast slide-up animation
- [ ] Hover lift on action buttons
- [ ] Print media styles

### Deliverables
- ✅ Admin can generate QR code with one click
- ✅ QR preview with gold luxury styling
- ✅ PNG download (1024x1024)
- ✅ SVG download (scalable)
- ✅ Print-ready layout
- ✅ Copy URL with toast
- ✅ Share via Web Share API
- ✅ All states handled (empty, loading, success, error)
- ✅ Zero paid API used

---

## Phase 4 — Customer Menu & 3D Viewer

**Duration**: 2–3 weeks  
**Goal**: Build the public-facing customer menu page with 3D viewer.

### Tasks

#### Customer Menu Page (`/menu/:restaurantSlug`)
- [ ] Fetch restaurant data from public API `/api/restaurants/:slug`
- [ ] Restaurant header: logo, name, description, hours
- [ ] Category tabs (horizontal scroll, mobile-first)
- [ ] Menu item cards: image, name, price, description, 3D badge
- [ ] List/Grid toggle
- [ ] Loading skeleton state
- [ ] 404 page for invalid slugs
- [ ] SEO meta tags (restaurant name, description)

#### Food Item Modal / Detail View
- [ ] Item image (full width)
- [ ] Name, price, description
- [ ] Tags (veg, spicy, chef's special, etc.)
- [ ] "View in 3D" button (if model available)
- [ ] Add to cart (optional, Phase 5)

#### 3D Viewer Component (`ThreeDViewer.jsx`)
- [ ] Load `.glb` / `.gltf` models
- [ ] OrbitControls (rotate, zoom, pan)
- [ ] Auto-rotate animation
- [ ] Ambient + directional lighting
- [ ] Loading progress bar
- [ ] Fallback: 2D image if no 3D model
- [ ] Full-screen mode
- [ ] Reset view button

#### Performance
- [ ] Lazy load 3D viewer (code split)
- [ ] Image optimization (WebP where possible)
- [ ] Suspense + loading boundaries

### Deliverables
- Public menu page accessible via QR scan
- Interactive 3D viewer for food items
- Mobile-optimized layout
- SEO-ready

---

## Phase 5 — Polish, Testing & Deployment

**Duration**: 2–3 weeks  
**Goal**: Production-ready, tested, deployed application.

### Tasks

#### QA & Testing
- [ ] Test QR generation on multiple devices
- [ ] Test QR scanning with iOS camera
- [ ] Test QR scanning with Android camera
- [ ] Test QR print quality on A4 / thermal printer
- [ ] Test PNG download resolution (1024x1024)
- [ ] Test SVG scalability
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Mobile responsiveness audit

#### Performance
- [ ] Lighthouse score > 90 on customer menu page
- [ ] 3D model loading < 3 seconds (optimized .glb)
- [ ] QR generation < 500ms
- [ ] Image lazy loading
- [ ] Code splitting for 3D viewer

#### Error Handling
- [ ] Global error boundary
- [ ] API error handling with user-friendly messages
- [ ] Offline fallback for menu page
- [ ] 404 and 500 error pages

#### Security
- [ ] Rate limiting on auth endpoints
- [ ] File type validation for uploads
- [ ] JWT expiry and refresh
- [ ] CORS configuration for production

#### Deployment
- [ ] Frontend: Deploy to Vercel
- [ ] Backend: Deploy to Railway or Render
- [ ] MongoDB: Atlas (free tier)
- [ ] Environment variables configured
- [ ] Custom domain setup (optional)
- [ ] SSL certificate (automatic via Vercel/Render)

#### Documentation
- [ ] Update MASTER_PROMPT.md with final decisions
- [ ] Update PROJECT_MEMORY.md with change log
- [ ] README.md with setup instructions
- [ ] API documentation (Postman collection or Swagger)

### Deliverables
- Production-deployed application
- Passing Lighthouse audit
- Tested QR flow end-to-end
- Documentation complete

---

## 📊 Phase Progress Tracker

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 0 | Project Setup & Foundation | ✅ Completed | 100% |
| 1 | Backend Core & Auth | ✅ Completed | 100% |
| 2 | Admin Dashboard | ✅ Completed | 100% |
| 3 | QR Code System MVP | ✅ Completed | 100% |
| 4 | Customer Menu & 3D Viewer | ✅ Completed | 100% |
| 5 | Polish, Testing & Deployment | ✅ Completed | 100% |

---

## 🔗 Quick References

- **Master Prompt**: [MASTER_PROMPT.md](MASTER_PROMPT.md)
- **Project Memory**: [PROJECT_MEMORY.md](PROJECT_MEMORY.md)
- **QR Library Docs**: https://github.com/soldair/node-qrcode
- **React Three Fiber**: https://docs.pmnd.rs/react-three-fiber
- **MongoDB Atlas**: https://cloud.mongodb.com
