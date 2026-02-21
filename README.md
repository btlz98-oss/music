<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1AZ7n_qVBZk_zJYkwhHx2uU6vuKfk-95z

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Tablet offline usage guide

You can use this app on a tablet **without internet after the first setup**, but there are a few conditions.

### Current limitations in this project
- The app currently loads Tailwind CSS from a CDN script (`https://cdn.tailwindcss.com`) in `index.html`.
- Instrument thumbnail images are now bundled as local SVG assets (`public/instrument-placeholder.svg`).

Because of these external resources, first load requires internet. Full guaranteed offline experience needs local bundling of those assets plus a service worker.

### Practical way (easy)
1. Build and deploy the app once (`npm run build` + host static files).
2. Open it on the tablet while online.
3. Keep the page/app installed in browser (Add to Home Screen).
4. After initial load, core data and edits are saved in localStorage and can often be used offline.

### Best way (recommended for true offline)
1. Replace external CDN/font/image assets with local files.
2. Add PWA support (manifest + service worker precache).
3. Install from tablet browser as a home-screen app.

Then the app can open reliably without network.

## Online/Offline mode (new)

- Header now provides **온라인 모드 / 오프라인 모드** toggle.
- In 오프라인 모드:
  - instrument thumbnail is switched to built-in SVG image (no external image request),
  - external resource links are disabled to avoid dead clicks,
- In 온라인 모드:
  - instrument thumbnail uses online-style artwork and falls back safely if image loading fails,
- Current mode is persisted in localStorage.
- Service worker (`public/sw.js`) is registered to cache app shell and visited local assets for repeat offline launches.
- Added **연간 오프라인 저장** export (header + settings modal) that downloads a single HTML package containing **3월~2월 전체 주차(1~4주)** lesson content, memos, and saved links as text.
- Downloaded HTML can be moved to tablet via AirDrop/파일 앱/메신저 and opened directly in browser offline.

> Note: this is a practical offline mode. Some third-party resources in `index.html` are still external, so first load/update still works best online.


### Deployment cache note
If a newly deployed screen looks identical to an old one, the browser may still be serving cached JS from a previous service worker.
This project now uses a network-first strategy for same-origin assets in `public/sw.js` and forces a service worker update check in `index.tsx` on load so new deployments apply more reliably.
