# MiBank reference-video homepage — local review

Historical first-preview report. The current local version extends the theme across the site; see `DARK_THEME_AUDIT.md` for the updated scope and verification.

## 1. Implemented

- Local-only homepage redesign inspired by the client's supplied `4293.mp4`. No push, deployment, hosting, repository visibility or DNS change was performed.
- `src/pages/index.astro`: dark mission/product composition, original full introductory copy, community image, original 2023/2022/2021 report links, Hibiscus feature, original videos and newsroom entry.
- `src/components/HomeSlideshow.astro`: four photo slides, previous/next, direct selection, counter, manual announcements and pause/play. Seven-second rotation stops on hover, keyboard interaction or hidden tab. Keyboard interaction requires an explicit Play action to resume. Reduced motion starts paused; the first slide and all main content remain available without JavaScript.
- `src/styles/home.css`: homepage tokens and scoped styling. `src/layouts/Layout.astro`: optional `homeTheme` prop; existing informational pages retain their current styling.
- Existing original assets, source content and routes retained. No dependencies added. Original homepage promotional destinations remain available. Existing Media and Locations implementations are unchanged.
- Review URL: http://127.0.0.1:4321/ (existing local production-preview server).

## 2. Design review

Concept: authentic MiBank photography in a dark editorial homepage, with cream serif headlines and restrained yellow details. The slideshow and staggered product composition are the main signature moments. Original logo proportions are retained; original product artwork is shown contained rather than cropped. No blocking preloader or scroll hijacking was added.

Actual full-page screenshots were inspected at 1440, 768 and 390 CSS pixels, including loaded report covers and original promotional images. The product section stacks on mobile; report links become compact cover/text rows. The first headline keeps “hassle-free” together. Secondary pages retain their working design, so this is a homepage design preview rather than a site-wide dark-theme conversion.

## 3. Audit matrix

| Category / scope | Status | Evidence and limits |
| --- | --- | --- |
| Functionality: homepage, carousel, navigation, report PDFs | PASS | 82 automated Chrome/Playwright checks passed. Includes manual-selection buttons, wraparound, Enter activation, automatic rotation, pause/resume, focus pause, mobile navigation/Escape, anchor/sticky header, three PDF signatures and no-JS fallback. Zero captured runtime errors or HTTP failures. |
| Functionality: remote app store, phone/email services | NOT TESTED | Existing destinations retained; no external transaction or communication was executed. |
| SEO: local preview configuration/content | PASS | Static audit covers all 37 migrated routes: no missing original text, broken local references or missing required metadata. Preview noindex/nofollow, robots disallow and staging sitemap policy preserved. |
| SEO: post-deployment verification | NOT TESTED | This version has not been deployed; production domain/canonical/indexing decisions remain outside this local preview. |
| Responsive/Visual: Chrome local rendering | PASS | Screenshots inspected at 1440/768/390px. Additional automated overflow/control checks passed at 320px, 844×390 landscape and 200% CSS zoom on a 1440px viewport. |
| Responsive/Visual: physical devices and other browser engines | NOT TESTED | No Safari/Firefox or physical-device run was performed. |
| Accessibility: automated scan and keyboard scenarios | PASS | Three axe scans using WCAG 2 A/AA, 2.1 AA and 2.2 AA tags reported zero violations. Scripted keyboard navigation, Escape, inactive-slide inert handling, reduced-motion pause and no-JS content were verified. Scoped checks do not certify complete WCAG conformance. |
| Accessibility: screen readers and embedded artwork/PDF text | NOT TESTED | No screen-reader or document-tagging audit was performed. Existing text embedded in original promotional images has not been fully transcribed. Existing video captions/transcripts remain a content gap. |
| Security/Privacy: changed code | PASS | Reviewed changes add local slideshow behavior only: no forms, storage, tracking, credential handling, remote runtime assets or new dependencies. Static reference audit found no external runtime assets. |
| Security/Privacy: legal review and comprehensive dependency audit | NOT TESTED | No new legal or vulnerability assessment was performed for this layout task. Existing content/client review requirements still apply. |
| Performance: local simulated mobile lab run | PASS | Lighthouse performance 99/100; FCP 1.3s, LCP 1.9s, Speed Index 1.3s, TBT 0ms, CLS 0. First image uses existing responsive AVIF; below-fold images lazy-load. |
| Performance: live field metrics | NOT TESTED | Local preview only; no real-user INP/Core Web Vitals measurement. |
| Code/Regression: types, build, original content, route smoke checks | PASS | Astro check: 14 files, zero errors/warnings/hints. Build: 39 pages. Static audit: 37 original routes, zero missing text/broken references, 453 local asset references. Media, Locations, MiCash and Hibiscus routes return 200 and retain their original theme. |

## 4. Tests run

Environment: Windows, Node.js 24.18.0, installed Google Chrome controlled by Playwright, local Astro production preview at 127.0.0.1:4321. `ASTRO_TELEMETRY_DISABLED=1` was set for Astro commands.

```powershell
npm run check
npm run build
npm run audit
node scripts/home-cinematic-audit.mjs
node scripts/performance.mjs http://127.0.0.1:4321/ audit/lighthouse-home-cinematic.json
```

Results: `audit/home-cinematic-results.json`, `audit/static-results.json`, `audit/lighthouse-home-cinematic.json`. Additional Playwright inline checks saved `audit/home-cinematic-edge-layouts.json`. Screenshots are local, ignored files in `audit/screenshots/home-cinematic-*`.

## 5. Outstanding items

- User/client visual review is pending. The supplied recording is a visual reference; its exact source typography, assets and implementation were not supplied.
- Existing four unavailable source documents remain unavailable. This change does not replace them with invented documents.
- Source content includes old dates and previously documented branch-count inconsistencies. Client verification, media captions/transcripts, PDF accessibility and legal review remain existing pre-launch items; see `FINAL_AUDIT.md`.
- No deployment-specific verification was performed for this unapproved version. Existing GitHub Pages continues to show the previously deployed design.

## 6. Launch readiness

**READY FOR REVIEW** — functioning local homepage preview. Deployment awaits the user's review, as explicitly requested.

## 7. Next action

Open http://127.0.0.1:4321/ on this computer, review the homepage and slideshow, and provide design feedback before deployment.
