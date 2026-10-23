# Media newsroom layout — 23 October 2026

## 1. Implemented

Replaced the Media page's legacy nested table presentation and unrelated About sidebar with a dedicated newsroom component: a wide featured story, compact illustrated news rows, chronological year groups, year navigation, and a browser-local search with reset/empty states. All 49 original news/report items remain available, including their original text, dates, image links and title/date destinations.

Files: `src/components/MediaArchive.astro`, `src/lib/media.ts`, `src/styles/media.css`, the Media branch of `src/pages/[...slug].astro`, and `scripts/media-layout-audit.mjs`. The source snapshots and migrated content JSON remain unchanged.

## 2. Design review

The featured original photograph and headline share one editorial composition. Subsequent items use image/text rows and fine dividers, with a compact year rail instead of the About navigation. Empty legacy anchors and spacer markup no longer create isolated arrows or excessive blank gaps. Original images are displayed with their full composition. The layout stacks intentionally on mobile, and year navigation becomes a wrapping horizontal row.

Fresh page-load screenshots were visually inspected at 1440px and 390px. Rendered full-page output was also reviewed at 768px. Automated interaction screenshots can retain focus/scroll states, so separate fresh-load captures were used for the initial-viewport design review.

## 3. Audit matrix

| Category | Status | Evidence and scope |
| --- | --- | --- |
| Functionality | PASS | 45 local Chrome checks pass: 49 items, source links/images retained, search by title/year, reset/empty state, year navigation, keyboard focus, no-JS content and three unaffected routes. No runtime errors or failed resources. |
| Functionality — existing unavailable documents | FAIL | The four previously inaccessible source document URLs remain explanatory local destinations; this layout update does not recover missing source files. Original link associations remain intact, including documented inconsistent source title/date destinations. |
| SEO | PASS | Existing title/description/noindex/breadcrumbs retained. Semantic page/archive/year headings and crawlable static content remain. Full 37-page content inclusion and local-link audit passes. |
| Responsive/Visual | PASS | 1440/768/390px checked with no horizontal overflow. Fresh desktop/mobile screenshots inspected; original image compositions retained. |
| Accessibility | PASS | Three scoped-page axe scans report zero applicable violations. Labeled search, visible focus, keyboard title focus, native year links and no-JS content checked. Not a full assistive-technology/WCAG certification. |
| Security/Privacy | PASS | Search filters existing public DOM content locally; no collection, storage, query-string submission, tracking, backend or new integration. Original external news links remain user-initiated navigation. |
| Performance | PASS | Local mobile Lighthouse: 98/100, FCP 1.2s, LCP 2.3s, TBT 0ms, CLS 0. First feature image is eager/high-priority; archive images lazy-load. These are simulated local lab results, not field or hosted CWV. |
| Code/Regression | PASS | Astro check: zero errors/warnings/hints in 13 files; static build succeeds; 37-page static audit has zero missing source text segments or broken local references. Product, Hibiscus video and Locations routes checked for regression. |
| Other browsers/assistive technology | NOT TESTED | Physical devices, Safari/Firefox and screen readers were not available for this scoped verification. |

## 4. Tests run

- `npm run check` — zero diagnostics.
- `npm run build` — 39 HTML pages plus sitemap generated successfully.
- `npm run audit` — all 37 source-content routes pass captured-text inclusion, local destinations and original-domain/external-asset checks.
- `node scripts/media-layout-audit.mjs` — 45 checks and three axe scans at 1440/768/390px; zero failures, runtime errors or failed resource responses. Checks compare the new page against all source image/link destinations.
- `node scripts/performance.mjs http://127.0.0.1:4321/media/ audit/lighthouse-media-layout.json` — measured mobile lab results above.
- Fresh-load Playwright screenshot inspection in installed Windows Chrome at 1440/390px.

Environment: Windows, Node 24, installed Chrome, Playwright/axe, local Astro production preview. Evidence: `audit/media-layout-results.json`, `audit/lighthouse-media-layout.json`, `audit/static-results.json`, and local `audit/screenshots/`.

## 5. Outstanding items

Existing missing documents, old content dates, source title/date link inconsistencies and site-wide client/legal/media-accessibility review gaps remain. No source wording, financial facts or news dates were corrected. Year grouping uses the last year in each original item (publication year when given, otherwise the report/title year); item wording is preserved. Hosting verification is recorded below after publishing.

## 6. Launch readiness

READY FOR REVIEW — layout implemented and locally verified for the existing non-production preview. This is not approval to replace the official banking site.

## 7. Next action

Review the redesigned Media page on the existing GitHub Pages preview after deployment, including the featured story, search and year archive.

## Hosted verification

Published: https://jay-rtl.github.io/mibank/media/

Deployed source: 0221d68733f5078bba404e6827a49fd5b5d6b2ed. Workflow https://github.com/jay-rtl/mibank/actions/runs/39840527624 succeeded.

`node scripts/media-layout-audit.mjs https://jay-rtl.github.io/mibank` passed all 45 hosted checks and three axe scans at 1440/768/390px. All 49 items, all source image/link destinations, search/reset/empty state, year navigation, no-JS content and unaffected routes passed. Zero browser errors or failed resources. Evidence: `audit/media-layout-live-results.json`.

READY FOR REVIEW — the redesigned Media page is live on the existing preview.
