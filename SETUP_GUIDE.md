# AXDORO — Step-by-Step Setup & Operational Runbook

This guide provides developers, DevOps, and project stakeholders with a step-by-step procedure to set up, run, test, and deploy the **AXDORO Architectural Heavyweight Apparel Platform**.

---

## 1. Prerequisites Checklist

Before proceeding, ensure your environment meets the minimum version requirements:

| Tool | Minimum Version | Recommended Version | Verification Command |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v18.0.0` | `v20.x` or `v22.x` (LTS) | `node --version` |
| **npm** | `v9.0.0` | `v10.x`+ | `npm --version` |
| **Operating System** | Windows 10/11, macOS 12+, or Ubuntu 20.04+ | Any 64-bit OS | - |
| **Browser** | Modern Chromium, Edge, Chrome, Safari, or Firefox | Latest evergreen | - |

*(Optional for automated E2E & video recording)*:
- **Python**: `3.10`+ with `playwright` and `imageio-ffmpeg` installed.

---

## 2. Step-by-Step Installation

### Step 1: Open Terminal / Shell
Navigate to the root directory where the repository is cloned:
```bash
cd D:\axdoro
```

### Step 2: Install Node Dependencies
Run `npm install` to download and link all required packages (`react`, `typescript`, `tailwindcss`, `vite`, `lucide-react`, `canvas-confetti`, `oxlint`):
```bash
npm install
```

> [!TIP]
> If you encounter permission or cache issues, run:
> ```bash
> npm cache clean --force
> npm install
> ```

---

## 3. Local Development Mode

To start the Vite live development server with instant Hot Module Replacement (HMR):

```bash
npm run dev
```

- Default Local URL: `http://localhost:5173/`
- Custom Port (e.g., port 3000):
  ```bash
  npx vite --port 3000
  ```
- Expose to Local Network (for mobile testing on same Wi-Fi):
  ```bash
  npm run dev -- --host
  ```

---

## 4. Code Quality & Linting

AXDORO uses **Oxlint** (the next-generation high-speed Rust-based linter) to ensure standard React hooks conventions and clean code:

```bash
npm run lint
```

---

## 5. Production Build & Compilation

To compile TypeScript and create a minified, tree-shaken production bundle:

```bash
npm run build
```

This runs:
1. `tsc -b`: Strict type checking across all components, hooks, and types.
2. `vite build`: Transpiles, minifies, and optimizes assets into `dist/`.

**Expected Build Output**:
```
✓ 1875 modules transformed.
dist/index.html                   1.04 kB │ gzip:   0.59 kB
dist/assets/index-DUj8qp6M.css   79.18 kB │ gzip:  12.51 kB
dist/assets/index-LtZ83eWW.js   529.93 kB │ gzip: 134.47 kB
✓ built in ~600ms
```

---

## 6. Previewing Production Build Locally

To test the exact production bundle (`dist/`) before deploying to hosting:

```bash
npm run preview -- --port 5173
```

Navigate to `http://localhost:5173/` in your browser.

---

## 7. Pre-Configured Test Credentials & Walkthrough URLs

To test or demo the platform without setting up databases or third-party SMS/WhatsApp credentials:

### A. Admin Staff Back-Office
- **Login Gate URL**: `http://localhost:5173/#admin`
- **Email**: `admin@axdoro.com`
- **Password**: `axdoroAdmin2026!`
- **Security PIN**: `9922`
- **1-Click Auto-Login**: `http://localhost:5173/?demoAdmin=true#admin`

### B. Customer VIP Member
- **Login Modal URL**: `http://localhost:5173/?login=true`
- **Mobile Number**: `9840123456`
- **Password**: `axdoro2026`
- **SMS / WhatsApp OTP**: `123456`
- **1-Click Auto-Login**: `http://localhost:5173/?demoUser=true&profile=true`

### C. Pre-Payment 3D 360° Fit & Climate Studio
- **Direct Link**: `http://localhost:5173/?demoUser=true&fitCheck=true#checkout`
- **Features to Test**:
  1. Front (`0°`), Side (`90°`), Back (`180°`), Left (`270°`) angle buttons.
  2. Touch/Mouse horizontal drag orbit.
  3. Regional weather selector (Chennai, Coimbatore, Madurai, Tiruppur, Salem, Trichy).
  4. Instant size switcher (`XS` to `XXL`) updating the bag.
  5. 1-Tap "Confirm Fit & Proceed to Pay" launching Razorpay simulator.

---

## 8. Deployment Runbook

AXDORO produces a pure static SPA in `dist/`. It can be deployed in minutes to any cloud provider:

### Option 1: Vercel (Recommended for Next-Gen Edge)
1. Install CLI: `npm i -g vercel`
2. Run in project directory: `vercel`
3. Framework preset: `Vite`
4. Root directory: `./`
5. Output directory: `dist`

### Option 2: Netlify
1. Create a `netlify.toml` file in the project root:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```
2. Run `netlify deploy --prod --dir=dist`.

### Option 3: Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase init hosting`
3. Set public directory to `dist`
4. Configure as single-page app: `Yes`
5. Run `npm run build && firebase deploy --only hosting`

### Option 4: AWS S3 + CloudFront
1. Build assets: `npm run build`
2. Sync `dist/` to your S3 bucket:
   ```bash
   aws s3 sync dist/ s3://your-axdoro-bucket --delete
   ```
3. Configure CloudFront custom error response:
   - HTTP Error Code: `404`
   - Response Page Path: `/index.html`
   - HTTP Response Code: `200`

---

## 9. Troubleshooting & FAQ

### Issue: Port 5173 is already in use
**Solution**: Specify a different port using:
```bash
npm run dev -- --port 5174
```

### Issue: Styles are not rendering or Tailwind classes missing
**Solution**: AXDORO uses Tailwind CSS v4 with the `@tailwindcss/vite` plugin. Ensure your Node.js is `>= 18.0.0` and run:
```bash
npm install @tailwindcss/vite tailwindcss
npm run build
```

### Issue: How do I reset test user data in my browser?
**Solution**: Clear local storage in browser DevTools (F12) -> Application -> Local Storage -> Clear `axdoro_user` and `axdoro_admin_auth`. Or launch the browser in Incognito mode.

---

## 10. Technical Support

For architecture, customization, or deployment questions:
- **Email**: dev@axdoro.com
- **WhatsApp Concierge**: Connect via the in-app WhatsApp help button in the header or footer.
