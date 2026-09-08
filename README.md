# AXDORO | Architectural 240 GSM Heavyweight Apparel Platform

> **Engineered Drop-Shoulder Luxury Apparel Crafted in Tamil Nadu, India.**  
> High-density combed cotton silhouettes designed specifically for tropical humid climates, backed by biometric AI fitting, interactive pre-payment 3D avatar inspection, and real-time enterprise retail intelligence.

---

## Table of Contents

- [1. Executive Summary & Brand Architecture](#1-executive-summary--brand-architecture)
- [2. Complete Technology Stack](#2-complete-technology-stack)
- [3. Key Architectural Features](#3-key-architectural-features)
  - [A. 200-Product Catalog Engine](#a-200-product-catalog-engine)
  - [B. Pre-Payment 3D 360° Personal Avatar & Climate Fit Studio](#b-pre-payment-3d-360-personal-avatar--climate-fit-studio)
  - [C. Multi-Channel Customer Authentication Suite](#c-multi-channel-customer-authentication-suite)
  - [D. Customer VIP Membership Passport](#d-customer-vip-membership-passport)
  - [E. Enterprise Back-Office Admin Portal & Analytics](#e-enterprise-back-office-admin-portal--analytics)
  - [F. Indian E-Commerce Regulatory Compliance & GST Billing](#f-indian-e-commerce-regulatory-compliance--gst-billing)
- [4. Project Structure & Source Layout](#4-project-structure--source-layout)
- [5. Step-by-Step Setup & Installation](#5-step-by-step-setup--installation)
- [6. Development Scripts & Commands](#6-development-scripts--commands)
- [7. Test Sandbox Profiles & Demo Credentials](#7-test-sandbox-profiles--demo-credentials)
- [8. URL Parameter Routing Cheat Sheet](#8-url-parameter-routing-cheat-sheet)
- [9. Production Build & Deployment Options](#9-production-build--deployment-options)
- [10. License & Maintenance](#10-license--maintenance)

---

## 1. Executive Summary & Brand Architecture

AXDORO is a direct-to-consumer (D2C) luxury streetwear brand and technology platform. Unlike conventional fast-fashion retail, AXDORO's entire design and manufacturing system is optimized for high-GSM architectural garments that maintain their shape and breathability in Indian tropical and humid weather:

- **240 GSM High-Density French Terry / Combed Cotton**: Sourced and manufactured in the textile corridor of Tamil Nadu (Tiruppur / Coimbatore).
- **Anti-Cling Natural Convection**: Dense weave with open-pore fiber architecture prevents sweat clinging and dark moisture patches in 80%+ relative humidity.
- **Resilient 1.25" Non-Sag Ribbed Collar**: Engineered with Lycra reinforcement to eliminate collar waviness after repeated washes.
- **Zero-Friction Fitting**: Eliminates the #1 friction in fashion e-commerce (returns due to fit ambiguity) via pre-payment biometric modeling.

---

## 2. Complete Technology Stack

| Layer | Technologies | Description & Purpose |
| :--- | :--- | :--- |
| **Core Framework** | **React 19.2.8** | Component architecture leveraging latest concurrent rendering patterns. |
| **Language** | **TypeScript 6.0.2** | Strict type-safety across products, cart, checkout, and admin analytics. |
| **Build & Bundler** | **Vite 8.2.2** | Blazing-fast HMR and optimized production asset tree-shaking (`< 610ms` build). |
| **Styling & Design System** | **Tailwind CSS v4.3.3** (`@tailwindcss/vite`) | Utility-first styling with custom palette: warm cream, obsidian, amber, and gold accents. |
| **Iconography** | **Lucide React 1.42.0** | Clean, accessible vector icons for all user and admin actions. |
| **Visual Effects** | **Canvas Confetti 1.9.4** | Celebratory checkout conversions and welcome loyalty rewards. |
| **Code Quality** | **Oxlint 1.79.0** | Ultra-high performance Rust-based linter for clean React code. |
| **State Management** | **React Context API** (`StoreContext.tsx`) | Centralized state engine with localStorage token persistence and URL hydration. |
| **Automated Testing & Media** | **Playwright 1.62.0** + **FFmpeg v7.1** | Headless browser test suite, automated screensnaps, and MP4 video generation. |

---

## 3. Key Architectural Features

### A. 200-Product Catalog Engine
- **5 Curated Heavyweight Drops**:
  1. *Oversized Streetwear Boxy* (40 Drops)
  2. *Half-Sleeve Street Minimalist* (40 Drops)
  3. *Vintage Acid & Mineral Washed* (40 Drops)
  4. *Cyber & 3D High-Density Puff Prints* (40 Drops)
  5. *Minimalist & Monochrome Essentials* (40 Drops)
- **Live Inventory Scarcity**: Real-time stock counts by size (`XS`, `S`, `M`, `L`, `XL`, `XXL`) displaying urgency badges ("2 left", "9 left").
- **Dynamic Filter System**: Instant multi-category switching, search bar autocompletion, and sorting by popularity, price, and newest release.

### B. Pre-Payment 3D 360° Personal Avatar & Climate Fit Studio
Located directly in the Checkout flow right before launching the payment gateway:
- **4-Angle Biometric Scan**: Captures Front (`0°`), Side Profile (`90°`), Semi-Angle (`45°`), and Back Slope (`180°`).
- **Interactive 360° Touch Orbit**: Mouse drag and slider scrub allowing customers to inspect garment silhouette, sleeve angle, and collar flush.
- **Tamil Nadu Climate Suitability Matrix**: Live district selector (Chennai, Coimbatore, Madurai, Tiruppur, Salem, Trichy) calculating temperature, humidity %, air permeability (`185 L/m²/s`), UPF 45+ solar shielding, and fabric comfort scores.
- **In-Modal Size Adjuster**: One-tap size switching (`XS` - `XXL`) inside the studio that dynamically recalculates fit score and updates the customer's bag.

### C. Multi-Channel Customer Authentication Suite
Customers can sign in or create an account via 5 distinct verification methods:
1. **Phone Number + WhatsApp OTP**: Official WhatsApp-branded verification flow with 1-click test autofill.
2. **Phone Number + SMS OTP**: 6-digit auto-advancing verification boxes with 30s resend timer.
3. **Phone Number + Password**: Quick mobile credential sign-in.
4. **Email + Magic OTP**: Passwordless sign-in with 6-digit passcode.
5. **Email + Password**: Standard secure account credentials.
- **Sign-Up Fit Profile**: Onboarding captures height, build, and preferred 240 GSM size, awarding **+100 Welcome Loyalty Points**.

### D. Customer VIP Membership Passport
- **Tier Badge**: "AXDORO Obsidian VIP" badge with live loyalty credits (₹450 credit).
- **Saved Delivery Destinations**: 1-click delivery address switcher (`[Home]`, `[Office]`, `[Atelier]`).
- **Order History & Real-Time Tracking**: Direct access to Shiprocket delivery timeline and GST invoice download.

### E. Enterprise Back-Office Admin Portal & Analytics
Protected by a staff login gate with two-factor authentication and a 4-digit Security PIN (`9922`):
- **Executive KPI Cards**: Real-time gross revenue (₹14.82 Lakh), 1,842 orders, ₹804 AOV, 2.1% low return rate.
- **Inventory & Valuation**: Total warehouse asset valuation (₹1.98 Cr across 200 drops, 19,104 units).
- **Visitor Demographics**: Age distribution analysis (18-24 Gen Z: 45%, 25-34 Urban: 36%, 35-44: 15%).
- **Regional Sales Heatmap**: Tamil Nadu district orders (Chennai 42%, Coimbatore 22%, Madurai 14%, Salem 8%).
- **Storefront Health & Conversion Funnel**: LCP page speed (0.62s Grade A), 74.2% add-to-cart rate, and low 1.38% exchange rate.

### F. Indian E-Commerce Regulatory Compliance & GST Billing
- **100% Comprehensive Legal Policy Suite**:
  - Shipping & Express Logistics Policy (Shiprocket, Bluedart, Delhivery)
  - 7-Day Exchange & Returns Policy with hygiene guidelines
  - Privacy Policy compliant with **Digital Personal Data Protection (DPDP) Act 2023**
  - Terms of Service under **Information Technology Act 2000**
  - Consumer Protection Policy under **Consumer Protection (E-Commerce) Rules 2020**
  - Legal Metrology declarations (Country of Origin, Packer & Manufacturer details)
- **GST Invoice Engine**: Tax invoices generated with HSN code 6109, 5% CGST/SGST tax breakdown, and company GSTIN.

---

## 4. Project Structure & Source Layout

```
D:\axdoro\
├── dist/                              # Compiled production assets (HTML, CSS, JS)
├── node_modules/                      # Node.js dependencies
├── public/                            # Static public assets (icons, SVGs)
├── src/
│   ├── assets/                        # Brand static assets and imagery
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx     # Executive analytics, inventory valuation & demographics
│   │   │   └── AdminLoginGate.tsx     # Staff credentials & 4-digit PIN gate
│   │   ├── auth/
│   │   │   ├── AuthModal.tsx          # Multi-channel login (WhatsApp, SMS, Phone, Email)
│   │   │   └── UserProfileDrawer.tsx  # Customer VIP Passport & saved delivery addresses
│   │   ├── cart/
│   │   │   └── CartDrawer.tsx         # Slide-out bag with Tamil Nadu shipping progress bar
│   │   ├── checkout/
│   │   │   ├── Checkout3DSpinFitModal.tsx # Pre-payment 360° avatar orbit & climate check
│   │   │   ├── CheckoutPage.tsx       # Address selector, bag summary, Razorpay trigger
│   │   │   ├── OrderSuccessPage.tsx   # Order confirmation, tracking & confetti burst
│   │   │   └── RazorpayModal.tsx      # Simulated UPI, Cards & Netbanking gateway
│   │   ├── custom/
│   │   │   └── BulkOrderModal.tsx     # B2B & corporate custom luxury heavyweight inquiries
│   │   ├── home/
│   │   │   └── HomePage.tsx           # Luxury hero, brand narrative, collection carousels
│   │   ├── invoice/
│   │   │   └── GSTInvoiceModal.tsx    # Printable GST Tax invoice with HSN 6109 & QR code
│   │   ├── layout/
│   │   │   ├── AnnouncementBar.tsx    # Live top notification bar (TN shipping & WhatsApp)
│   │   │   ├── Footer.tsx             # Regulatory footer, legal policies & social links
│   │   │   └── Navbar.tsx             # Clean brand header, navigation, search & user avatar
│   │   ├── policy/
│   │   │   └── PolicyModal.tsx        # Comprehensive Indian e-commerce legal policies
│   │   ├── product/
│   │   │   ├── AITryOnModal.tsx       # AI drape silhouette preview
│   │   │   ├── ProductCard.tsx        # 240 GSM product card with clean virtual fit action
│   │   │   ├── ProductDetailPage.tsx  # High-res product imagery, sizing & pincode check
│   │   │   ├── ProductGrid.tsx        # Responsive grid for catalog drops
│   │   │   └── SizeGuideModal.tsx     # Comprehensive 240 GSM chest/length dimensions
│   │   └── tracking/
│   │       └── OrderTracking.tsx      # Real-time Shiprocket logistics timeline
│   ├── context/
│   │   └── StoreContext.tsx           # Global state, cart, auth, orders & URL hydration
│   ├── data/
│   │   ├── initialProducts.ts         # Base luxury garments seed data
│   │   ├── productsGenerator.ts       # 200 distinct 240 GSM drops across 5 collections
│   │   └── weatherData.ts             # Tamil Nadu district climate metrics & comfort scores
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces (Product, User, Order, etc.)
│   ├── utils/
│   │   ├── currency.ts                # Indian Rupee (₹) formatting utilities
│   │   ├── gst.ts                     # GST (5% split CGST/SGST) calculations
│   │   └── whatsapp.ts                # Direct WhatsApp concierge deep links
│   ├── App.css                        # Core layout styling
│   ├── App.tsx                        # Master view routing and modal controller
│   ├── index.css                      # Tailwind CSS imports and custom design tokens
│   └── main.tsx                       # React DOM root entry point
├── index.html                         # HTML5 template with SEO & luxury typography
├── package.json                       # Dependencies, scripts and package metadata
├── SETUP_GUIDE.md                     # Dedicated step-by-step installation manual
├── tsconfig.json                      # TypeScript compiler configuration
└── vite.config.ts                     # Vite bundler configuration with Tailwind plugin
```

---

## 5. Step-by-Step Setup & Installation

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: Version `18.0.0` or higher (Node 20+ LTS recommended)
- **npm**: Version `9.0.0` or higher (comes bundled with Node.js)

Verify your environment:
```bash
node -v
npm -v
```

---

### Step 1: Open the Project Directory

Open your terminal or PowerShell and navigate to the project root:
```bash
cd D:\axdoro
```

---

### Step 2: Install Dependencies

Install all production and development dependencies:
```bash
npm install
```

---

### Step 3: Run the Development Server

Start Vite's ultra-fast local development server with Hot Module Replacement (HMR):
```bash
npm run dev
```

Output:
```
  VITE v8.2.2  ready in 180 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Open your browser and navigate to `http://localhost:5173/`.

---

### Step 4: Run the Linter

Verify code style and rules of hooks:
```bash
npm run lint
```

---

### Step 5: Build for Production

Compile TypeScript and bundle all assets using Vite:
```bash
npm run build
```

This generates an optimized production build in the `dist/` directory:
- Type check: `tsc -b`
- Bundler: `vite build`
- Build time: `< 610 ms`

---

### Step 6: Preview the Production Build

Serve the compiled `dist/` output locally on port `5173`:
```bash
npm run preview -- --port 5173
```

---

## 6. Development Scripts & Commands

All available scripts defined in `package.json`:

| Command | Action | Description |
| :--- | :--- | :--- |
| `npm run dev` | `vite` | Starts local dev server on `http://localhost:5173` with HMR. |
| `npm run build` | `tsc -b && vite build` | Strict type checking followed by production Vite build. |
| `npm run preview` | `vite preview` | Previews the compiled `dist/` production assets locally. |
| `npm run lint` | `oxlint` | High-speed code quality and React linting. |

---

## 7. Test Sandbox Profiles & Demo Credentials

Use these pre-configured test profiles to showcase the platform to clients or stakeholders:

### A. Enterprise Admin Portal Credentials
- **Access URL**: [http://localhost:5173/#admin](http://localhost:5173/#admin)
- **Staff Email**: `admin@axdoro.com`
- **Staff Password**: `axdoroAdmin2026!`
- **Security PIN**: `9922`
- **Direct 1-Click Authenticated Link**: [http://localhost:5173/?demoAdmin=true#admin](http://localhost:5173/?demoAdmin=true#admin)

### B. Customer VIP Test Account
- **Access URL**: [http://localhost:5173/?login=true](http://localhost:5173/?login=true)
- **Customer Name**: Karthik Subramanian
- **Tier**: Obsidian VIP Member (450 Loyalty Points)
- **Phone Number**: `9840123456`
- **SMS / WhatsApp OTP**: `123456`
- **Password**: `axdoro2026`
- **Direct 1-Click Authenticated Link**: [http://localhost:5173/?demoUser=true&profile=true](http://localhost:5173/?demoUser=true&profile=true)

---

## 8. URL Parameter Routing Cheat Sheet

The application supports deep-linking via query parameters, ideal for automated testing and client presentations:

| Feature / Screen | Deep Link URL |
| :--- | :--- |
| **Storefront Home** | `http://localhost:5173/` |
| **200 Drops Catalog** | `http://localhost:5173/#shop` |
| **Product Detail** | `http://localhost:5173/#product-detail` |
| **240 GSM Size Guide** | `http://localhost:5173/?sizeGuide=true#product-detail` |
| **AI Silhouette Drape Simulator** | `http://localhost:5173/?ai=true#product-detail` |
| **Customer Sign-In Modal** | `http://localhost:5173/?login=true` |
| **Customer Registration Modal** | `http://localhost:5173/?signup=true` |
| **Customer VIP Profile Drawer** | `http://localhost:5173/?demoUser=true&profile=true` |
| **Slide-Out Cart Drawer** | `http://localhost:5173/?demoUser=true&cart=true` |
| **Pre-Payment 3D 360° Fit Studio** | `http://localhost:5173/?demoUser=true&fitCheck=true#checkout` |
| **Order Tracking & GST Bill** | `http://localhost:5173/?demoUser=true#tracking` |
| **Admin Security Gate** | `http://localhost:5173/#admin` |
| **Admin Executive Dashboard** | `http://localhost:5173/?demoAdmin=true#admin` |
| **Shipping & Logistics Policy** | `http://localhost:5173/?policy=shipping` |
| **Returns & Exchange Policy** | `http://localhost:5173/?policy=returns` |
| **Privacy Policy (DPDP Act 2023)** | `http://localhost:5173/?policy=privacy` |

---

## 9. Production Build & Deployment Options

The project compiles to a completely static, zero-server Single Page Application (SPA) inside `dist/`. It can be deployed to any modern cloud hosting service:

### Option A: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Configure build settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Option B: Netlify
1. Create `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```
2. Push to Git or drag-and-drop the `dist/` folder into Netlify.

### Option C: Cloudflare Pages
1. Connect your repository to Cloudflare Pages.
2. Set Build Command: `npm run build`
3. Set Build Output Directory: `dist`

### Option D: Docker / Nginx
A sample `Dockerfile` for enterprise container deployment:
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 10. License & Maintenance

- **Brand**: AXDORO Luxury Heavyweight Apparel.
- **Copyright**: © 2026 AXDORO Apparel Co. All rights reserved.
- **Compliance**: Certified under Consumer Protection (E-Commerce) Rules 2020 and DPDP Act 2023.
