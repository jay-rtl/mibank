# Locations map repair — 23 October 2026

## 1. Implemented

The redesign had retained the original map's labels and coordinates but omitted the interactive map, and the old legend's presentation table expanded its icons. The Locations page now places an interactive regional map before the original contact information, uses compact MiBank marker artwork, and preserves all 88 original coordinates and names.

Files: `src/components/Locations.astro`, `src/pages/[...slug].astro`, `src/styles/locations.css`, `src/data/map-geography.json`, `source/map-geography.json`, package manifests, map audit scripts and a local font preload in `src/layouts/Layout.astro`.

Features: drag/pan, zoom, marker popups, keyboard-accessible list-to-marker selection, Escape dismissal, synchronized text/type filtering, reset, reduced-motion settings and a no-JavaScript location list. Original branch/contact wording remains available below the map and directory.

## 2. Design review

The oversized legend is replaced with compact original icons. Map land/water colors support the existing restrained MiBank palette. Actual screenshots were inspected at 1440px and 390px, with a rendered 768px layout checked automatically. Location controls and the list remain usable on small screens.

## 3. Audit matrix

| Category | Status | Scope and evidence |
| --- | --- | --- |
| Functionality | PASS | 44 browser checks passed under /mibank at 1440/768/390px: 88 markers, geographic shapes, filters, reset/empty state, list keyboard selection, popups/Escape, actual view-changing zoom and drag/pan, reduced motion, no-JS list and three unaffected pages. |
| SEO | PASS | Existing page heading/metadata/noindex retained; full 37-page captured-text/static-link audit passes. Source contact and legend words remain present. |
| Responsive/Visual | PASS | No overflow at all three tested widths; legend icons fit within 73×27px. Desktop/mobile screenshots inspected. Physical-device testing was not performed. |
| Accessibility | PASS | Three axe scans report zero applicable violations. Keyboard list selection/Escape and no-JS fallback checked. This is scoped UI verification, not a full screen-reader/WCAG certification. |
| Security/Privacy | PASS | No API key, external map tiles, geolocation permission, tracking, customer data or external runtime requests. npm audit reports zero known vulnerabilities. |
| Performance | PASS | Mobile local Lighthouse: 100/100; FCP 1.3s, LCP 1.6s, TBT 0ms, CLS 0. Map code/geography loads after the initial paint; self-hosted font is preloaded. These are simulated local lab results, not hosted field CWV. |
| Code/Regression | PASS | Astro check: zero errors/warnings/hints; static build succeeds; local content comparison has zero missing source text segments; /mibank deployment-path audit checks 39 HTML pages with zero unresolved/unprefixed references. |

## 4. Tests run

- `npm run check`
- `npm run build` (normal root and `DEPLOY_BASE=/mibank` builds)
- `npm run audit` — 37 pages, zero missing text/broken local links/original-domain navigation/external assets
- `node scripts/prepare-deploy.mjs`
- `node scripts/deployment-audit.mjs` — 39 HTML pages
- `node scripts/map-browser-audit.mjs` and `node scripts/map-browser-audit.mjs http://127.0.0.1:4322/mibank` — final 44 checks, three clean axe scans, zero runtime failures/external requests
- `node scripts/performance.mjs http://127.0.0.1:4321/about/locations/ audit/lighthouse-map-mobile.json`
- `npm audit --json` — zero reported vulnerabilities

Environment: Windows, installed Chrome, Playwright/axe, local static production build. Lighthouse uses its simulated mobile/network/4× CPU settings. Initial map lab run was 87/100 with LCP 3.1s; deferred module loading and font preload improved the final measured result above.

## 5. Outstanding items and limits

This is a regional geographic map using locally bundled Natural Earth boundaries, not Google street/satellite imagery. It supports location exploration but does not supply road routing, satellite layers or navigation directions. Original point coordinates have not been independently re-surveyed. Physical touch devices, Safari/Firefox and screen readers remain untested. Existing site-wide missing documents and media accessibility/content-approval gaps remain as documented in FINAL_AUDIT.md.

Map data: [Natural Earth source GeoJSON](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson), selected regional country boundaries; [public-domain terms](https://www.naturalearthdata.com/about/terms-of-use/). Leaflet 1.9.4 is bundled locally under its included BSD license (`public/assets/Leaflet-LICENSE.txt`); [API reference](https://leafletjs.com/reference.html). Source site API keys are not reused.

## 6. Launch readiness

READY FOR REVIEW — repair verified locally and prepared for the existing GitHub Pages preview. Hosted verification is recorded below when available; this is not approval to replace MiBank's official website.

## 7. Next action

Review the updated Locations page on the existing preview after deployment. Verify that the regional map meets the desired map-detail level.

## Hosted verification

Published repair: https://jay-rtl.github.io/mibank/about/locations/

Source commit: 68de40ca84bad6643504e6ae7f0b07f753fe29da. [GitHub Pages workflow](https://github.com/jay-rtl/mibank/actions/runs/39820586286) succeeded.

`node scripts/map-browser-audit.mjs https://jay-rtl.github.io/mibank` passed all 44 checks and three axe scans at 1440/768/390px, with zero browser errors, failed resources or external runtime requests. Live desktop/mobile screenshots were inspected. Evidence: `audit/map-live-results.json`.

An additional delayed-geography test confirms that a search typed while the map loads is retained: both the list and map show the same two Goroka locations. Evidence: `audit/map-loading-filter-result.json`; command: `node scripts/map-load-filter-audit.mjs`.

READY FOR REVIEW — the repair is published and verified on the preview.
