# MiBank shared dark theme — local preview

The later homepage welcome animation and its verification are documented in `WELCOME_INTRO_AUDIT.md`.

This report supersedes the homepage-only scope in `LOCAL_PREVIEW_AUDIT.md`. This revision is local only: no Git push or deployment was performed.

## 1. Implemented

- `src/styles/theme.css` and `src/layouts/Layout.astro`: shared charcoal surfaces, cream typography, serif headings, yellow links, visible focus states, dark navigation, inputs, tables, newsroom and directory. This applies to all page templates, including fallback/error pages.
- `src/styles/home.css`: existing cinematic homepage design retained; its dropdown styling now uses the shared dark palette.
- `src/components/HomeSlideshow.astro`: automatic seven-second rotation continues while the pointer rests over the photograph. Pause/play, hidden-tab pause, keyboard focus pause and reduced-motion defaults remain available.
- `src/pages/index.astro`: removed the old “Latest News” bitmap button from the homepage. An original news photograph and descriptive “News archive” link replace it. The archived article and its original date remain intact; it is not presented as newly published news.
- `src/pages/[...slug].astro`: corrected the Products overview section label from About us to Products.
- `src/components/MediaArchive.astro`, `src/data/media-images.json`, `scripts/optimize-media-images.mjs` and generated display assets: responsive sizes for seven original Media images. Original files, fallback sources, alt text, article links and full-resolution destinations remain available.
- Existing static routes, source text, 49 Media items, map functionality, products, reports and video links retained. No new dependencies, forms, analytics or storage.

## 2. Design review

The homepage and informational pages now use the same charcoal/cream/yellow visual language. Serif headings extend to interior page titles and article headings. The geographic map, original promotional artwork, document covers and cream contact callout retain appropriate light surfaces rather than applying a dark filter to informative imagery.

Actual loaded-page screenshots of Products, About, Media, Locations and Annual Reports were captured at 1440, 768 and 390px. Representative screenshots were visually reviewed. The original logo proportions and artwork are retained. The existing inner-page information architecture remains intact.

## 3. Audit matrix

| Category / scope | Status | Evidence and limits |
| --- | --- | --- |
| Functionality: homepage | PASS | 82 Playwright checks, including auto-rotation with the pointer over the hero, manual selection, pause/play, keyboard behavior, navigation, report signatures and no-JS content. |
| Functionality: Media and directory | PASS | 45 Media checks passed; all 49 items and original image/link destinations preserved. Additional checks verified search empty/reset states and a filtered Locations popup. |
| SEO: local static preview | PASS | Audit of 37 original routes found zero missing original text, broken references, missing required metadata or external runtime assets. Preview noindex/nofollow, robots disallow and staging sitemap policy retained. |
| SEO: deployment/indexing | NOT TESTED | This revision has not been deployed. |
| Responsive/Visual: local Chrome | PASS | Shared theme and no-overflow checks passed on 38 desktop routes and 10 representative mobile routes. Screenshots captured for five page families at 1440/768/390px; representative screenshots reviewed. |
| Responsive/Visual: other browsers/devices | NOT TESTED | No physical-device, Safari or Firefox run. |
| Accessibility: automated and keyboard scope | PASS | Shared-theme checks include 48 page scans and two interaction-state scans with zero axe violations. Homepage and Media each add three clean scans. WCAG 2 A/AA, 2.1 AA and 2.2 AA rule tags used. Keyboard/Escape, inactive-slide inert handling and reduced-motion checks passed. |
| Accessibility: screen readers and original documents/media | NOT TESTED | No screen-reader or PDF-tagging audit. Existing captions/transcript and artwork-text gaps remain. Automated results are not a full WCAG certification. |
| Security/Privacy: changed code | PASS | Changes reviewed: local styling, image derivatives and slideshow behavior only. No credentials, tracking, new data collection or dependencies introduced. |
| Security/Privacy: legal/dependency review | NOT TESTED | No new comprehensive legal or vulnerability audit performed for this visual revision. |
| Performance: local simulated mobile | PASS | Homepage: Lighthouse 99/100, FCP 1.3s, LCP 1.9s, TBT 0ms, CLS 0. Media: 99/100, FCP 1.2s, LCP 1.8s, TBT 0ms, CLS 0. The first Media measurement was 88/100 with oversized images; responsive image derivatives resolved that measured issue. |
| Performance: live field data | NOT TESTED | No deployment or real-user INP measurement. |
| Code/Regression | PASS | Astro check: 14 files, zero errors/warnings/hints. Production build: 39 pages. Static content audit passed on 37 original routes. Browser suites captured no runtime errors or failed requests. |

## 4. Tests run

Windows, Node.js 24.18.0, installed Google Chrome driven by Playwright, Astro production preview at http://127.0.0.1:4321/. Astro commands used `ASTRO_TELEMETRY_DISABLED=1`.

```powershell
npm run check
npm run build
npm run audit
node scripts/dark-theme-audit.mjs
node scripts/home-cinematic-audit.mjs
node scripts/optimize-media-images.mjs
node scripts/media-layout-audit.mjs
node scripts/performance.mjs http://127.0.0.1:4321/ audit/lighthouse-home-cinematic.json
node scripts/performance.mjs http://127.0.0.1:4321/media/ audit/lighthouse-dark-media.json
```

Evidence: `audit/dark-theme-results.json`, `audit/home-cinematic-results.json`, `audit/media-layout-results.json`, `audit/static-results.json` and the two Lighthouse files above. Screenshots are local ignored artifacts under `audit/screenshots/`.

## 5. Outstanding items

- Visual review of the updated local version is pending. Current GitHub Pages remains on its previously deployed version.
- Existing four unavailable original documents, historical content discrepancies, original PDF/media accessibility and client/legal content review remain documented in `FINAL_AUDIT.md`.
- Full post-deployment checks and other-browser/physical-device checks remain unperformed.

## 6. Launch readiness

**READY FOR REVIEW** — local implementation and scoped checks complete. Deployment awaits the user's approval, as requested.

## 7. Next action

Open http://127.0.0.1:4321/ and refresh with Ctrl+Shift+R. Review the hero, news archive entry and dark interior pages before deployment.
