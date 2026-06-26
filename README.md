# ⚙ PC Builder PWA — Manik Roy
© 2026 Manik Roy. All Rights Reserved.

## Files Included
```
pc-builder-pwa/
├── index.html          ← Main app (PWA-enabled)
├── manifest.json       ← Web App Manifest
├── sw.js               ← Service Worker (offline + caching + sync)
├── offline.html        ← Offline fallback page
├── favicon.ico         ← Multi-resolution favicon (16/32/48)
├── README.md           ← This file
└── icons/
    ├── icon-16x16.png
    ├── icon-32x32.png
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-180x180.png     ← Apple Touch Icon
    ├── icon-192x192.png     ← Android + Chrome
    ├── icon-192-maskable.png← Maskable (adaptive icon)
    ├── icon-384x384.png
    ├── icon-512x512.png     ← Splash screen
    └── apple-touch-icon.png ← iOS home screen
```

## Deploy Instructions

### Option 1 — GitHub Pages (Free)
1. Create a new GitHub repo (e.g. `pc-builder`)
2. Upload all files maintaining the folder structure
3. Go to Settings → Pages → Source: `main` branch → `/root`
4. Your app is live at `https://yourusername.github.io/pc-builder/`

### Option 2 — Netlify Drop (Free, instant)
1. Go to https://app.netlify.com/drop
2. Drag the entire `pc-builder-pwa` folder
3. Live instantly with HTTPS

### Option 3 — Local Dev Server
```bash
# Python
python3 -m http.server 8080
# Node
npx serve .
```
Then open http://localhost:8080

## PWA Features
- ✅ Installable on Android, iOS, Windows, macOS, Linux
- ✅ Offline support (cached app shell)
- ✅ Background rate sync via Service Worker
- ✅ Install prompt button (📲 Install App)
- ✅ Maskable icons (adaptive Android icons)
- ✅ Apple Touch icons (iOS home screen)
- ✅ Web Share / clipboard export
- ✅ localStorage build persistence
- ✅ Theme-color meta for browser chrome

## Note
- Service Workers require **HTTPS** in production (or localhost for dev)
- Live exchange rate uses free exchangerate-api.com (no API key needed)
