# Final audit — MiBank public website redesign

Audit date: 23 October 2026 (America/Chicago). This is a local, non-production informational redesign. No production website, DNS, protected branch or external hosting was modified.

## 1. Implemented

- Astro static website, TypeScript, Tailwind integration, reusable layouts/components and a project-specific responsive design system.
- 38 accessible HTML source URLs discovered; 37 unique informational pages recreated after deduplicating the homepage. Two support pages (404 and source-unavailable) are additional to the source inventory; build emits 39 HTML pages plus sitemap.xml.
- Complete discovered product pages, MiCash fee table, public forms, About Us, history, vision/mission/values, directors, executives, contact details, locations, news archive, report archive and eight legacy report fallback pages.
- 170 successfully captured source assets, including 64 PDFs, four MP4s and 19 hover-image variants. Source assets, full raster compositions and download labels are retained locally. WebP/AVIF derivatives and a licensed, self-hosted font reduce runtime requests.
- Desktop dropdowns, mobile menu, keyboard/Escape behavior, active links, breadcrumbs, local search/filter over 88 original map labels, native video controls, original report PDFs, and GSAP progressive enhancement with reduced-motion support.
- Deliverables: SITE_INVENTORY.md, CONTENT_AUDIT.md, ROUTE_MAPPING.md, ASSET_MANIFEST.md, FINAL_AUDIT.md, README.md, raw source snapshots, migrated data and reproducible audit scripts.

## 2. Design review

Original MiBank yellow, charcoal identity and unaltered logo anchor a warm editorial direction. Manrope, a restrained serif emphasis, wide margins and fine rules establish hierarchy. The homepage's authentic Hibiscus Card photograph and yellow contact band are the signature details. Product lists, bios, documents and news use different compositions suited to their content.

Desktop and mobile screenshots were inspected for homepage, product content, directors and open menus. Representative template screenshots are captured at 1440px, 768px and 390px. Mobile navigation becomes a scrollable full-width panel; product discovery becomes two columns, long-form content becomes one column, and related-page links scroll horizontally within their own navigation area. No document-wide overflow was found in the tested layouts. Refinements addressed route handling, source-table layout, adjacent title formatting, news target sizes, opacity-related contrast during animation and hero image transfer size.

## 3. Audit matrix

| Category / scope | Status | Evidence and limits |
| --- | --- | --- |
| Functionality — local navigation/content | PASS | Static audit: 0 unresolved local href/src destinations and 0 MiBank-domain navigation links. Browser response and heading checks passed on all 37 source routes. Mobile product navigation, refresh, skip link, keyboard/Escape, location search/type/empty state, and all four local muted video playback checks passed. 64 PDF signatures valid. |
| Functionality — unavailable source downloads | FAIL | Four source document URLs return HTTP 400/404. Their original labels lead to a clear local unavailability page. They are not counted as successfully migrated downloads. Full source parity cannot include these inaccessible files. |
| Functionality — transactions/login/submissions | NOT APPLICABLE | Informational scope only; no credentials, payments, accounts or submission endpoints. |
| SEO — staging configuration | PASS | 37 unique titles for 37 informational pages; descriptions, OG title/description/type, headings and crawlable local content present. All templates use noindex/nofollow; robots.txt disallows crawling. Empty staging sitemap and no assumed canonical/production domain avoid conflicts. |
| SEO — production/deployed validation | NOT TESTED | No approved domain or deployment. Production canonicals, absolute social image metadata, populated sitemap, redirects and indexability must be configured and validated at release. No structured data invents current business details. |
| Responsive/Visual — representative Chrome templates | PASS | 27 route/viewport combinations across 1440/768/390px found no horizontal overflow. Additional 320px fee-table reflow, expanded desktop/mobile menus and all 19 expanded artwork images passed. Actual screenshot review covered homepage, product, people and menus. |
| Responsive/Visual — other browsers/devices | NOT TESTED | Physical devices, Safari and Firefox were unavailable for this audit. Not every page received individual manual visual inspection. |
| Accessibility — automated/UI behavior | PASS | 18 template axe scans at desktop/mobile plus two expanded-artwork scans reported zero applicable violations in the final evidence. Browser keyboard navigation, Escape/focus restoration, reduced-motion visibility and mobile navigation without JavaScript passed. Native labels, headings, landmarks and focus styles reviewed. This is not full WCAG certification. |
| Accessibility — media/text alternatives | FAIL | Original videos lack supplied captions/transcripts and are not claimed WCAG-conformant. Informative graphical banners retain their original image wording, but comprehensive equivalent text alternatives require content-owner review. |
| Accessibility — assistive technology and PDFs | NOT TESTED | Screen-reader review, actual browser zoom, full PDF reading order/tagging and OCR parity were not performed. The 320px test verifies limited reflow, not all zoom scenarios. |
| Security/Privacy — static implementation | PASS | No backend, authentication, personal-data submission/storage or optional tracking. Browser runtime had zero external-origin resource requests in supplemental audit. Source scripts are not executed; the imported HTML removes script/event/style attributes and unsafe protocols. Dependency audit reported zero known vulnerabilities. Scope is limited to inspected static code and tested interactions. |
| Security/Privacy — deployment/legal | NOT TESTED | Static-host security headers supplied in public/_headers but not enforced by Astro preview. HTTPS, host access control, header enforcement and deployment settings need host verification. PNG is the source business jurisdiction; client-approved legal/privacy review and asset authorization are outstanding. No legal certification is claimed. |
| Performance — homepage mobile lab | PASS | Lighthouse 13.5.0, installed Chrome, local production preview, simulated mobile 412×823, 4× CPU slowdown and simulated network throttling. Performance 100/100; FCP 0.9 s; LCP 1.8 s; TBT 0 ms; CLS 0.004. Hero uses responsive AVIF; original videos preload none. |
| Performance — field/device data | NOT TESTED | No real-user 75th-percentile CWV or INP data; TBT is a lab metric and is not INP. Full-site real-network video/download performance is unmeasured. Two originals are approximately 81 MB and 166 MB, loaded on demand. |
| Code/Regression — build/checks | PASS | Final Astro static build produced 39 pages; astro check: zero errors/warnings/hints. Static audit: zero missing captured source text segments, zero broken local references, zero external assets. Browser audit: zero runtime errors or failed requests; all recorded functional checks passed. |
| Code/Regression — lint | NOT APPLICABLE | No pre-existing codebase or lint configuration; Astro template/type checks and migration/navigation/browser checks cover the implementation. |

## 4. Tests run

Environment: Windows, PowerShell, Node 24.18.0, installed Google Chrome, Astro production preview bound to 127.0.0.1:4321. Some early browser attempts failed because of sandbox process restrictions, browser-context setup and legacy redirect collisions; these were corrected before final passing evidence. No failed attempt is treated as a pass.

- node scripts/crawl.mjs — recursively captured publicly linked HTML; robots/sitemap/index.htm returned 404. A site-specific web search found no additional results.
- node scripts/discover-variants.mjs and node scripts/assets.mjs — captured primary and mouseover files with source referrer; four document failures recorded.
- node scripts/migrate.mjs — 37 local source-content pages, route map and inventory/asset/content documents.
- node scripts/font.mjs and node scripts/optimize-hero.mjs — self-hosted licensed Manrope and generated responsive AVIFs.
- ASTRO_TELEMETRY_DISABLED=1 npm run build — PASS; 39 pages built. In PowerShell set the environment variable before the command as shown in README.
- npm run check (also npx astro check earlier) — PASS; 11 Astro/TypeScript files checked, zero diagnostics.
- npm run audit — PASS; 37 pages, 410 local asset references checked, zero missing source text segments, broken local references, original-domain links or external runtime assets.
- npm test — PASS; Playwright/axe, 27 layout combinations, 18 axe template scans, 56 passing route/functional/media checks, zero runtime errors/failed requests.
- node scripts/supplemental-audit.mjs — PASS; original artwork disclosure and menus at 1440/390px, two axe scans, 19/19 decoded images, 64/64 PDF signatures and zero external runtime requests.
- node scripts/performance.mjs — PASS for measured homepage mobile lab targets; final report above. First run was 96/100, LCP 2.8s; responsive AVIF reduced measured LCP to 1.8s. Results are specific to these runs.
- npm audit --json — PASS; zero reported known vulnerabilities at audit time. This is not a complete security assessment.

Evidence: audit/static-results.json, audit/browser-results.json, audit/supplemental-results.json, audit/lighthouse-mobile.json, audit/summary.json and audit/screenshots/.

## 5. Outstanding items

1. Four unavailable source files (see CONTENT_AUDIT.md and ASSET_MANIFEST.md): two malformed percentage-sign URLs return 400; two duplicated about_us paths return 404. Obtain approved original documents or approve corrections. No financial/legal text was fabricated.
2. Approve/review source discrepancies: homepage 16 branches vs About Us 12; incomplete “more than Agents”; contact phone typo; inconsistent news dates/PDF destinations. Original wording is preserved.
3. Provide approved video captions/transcripts, review image-based text alternatives and PDF accessibility. A passing axe scan does not resolve these gaps.
4. Client approval for content currency, MiBank-owned assets, legal/privacy wording and any future public release. No analytics or personal data collection exists in this preview.
5. Test Safari/Firefox, physical devices, screen readers, actual text zoom and deployed hosting behavior. Third-party destination availability and full video viewing/seeking were not exhaustively tested.
6. Configure approved-domain canonical/social/sitemap/redirect policy, HTTPS, private staging access and host security headers before any hosted release. Legacy aliases are documented, not live redirect promises.
7. Review optional video transcodes/streaming for the large original files. Original files are retained and not preloaded.

## 6. Launch readiness

READY FOR REVIEW — The local implementation and captured content are reviewable. It is not ready for public launch until missing source documents, media accessibility, client/legal approvals and deployment verification are resolved. No deployment or production changes were performed.

## 7. Next action

Run npm run dev locally and review the redesign alongside CONTENT_AUDIT.md. Prioritize supplying the four missing documents and approved accessible media alternatives, then approve any source content corrections before preparing a hosted launch.


## GitHub Pages deployment addendum — 23 October 2026

This addendum supersedes earlier statements that no deployment was performed. The user explicitly approved GitHub Pages. This is a public, independent non-production preview, not a deployment to MiBank's official domain.

- Live URL: https://jay-rtl.github.io/mibank/
- Repository: https://github.com/jay-rtl/mibank
- Deployed source commit: 924683d00323c89b1f15105ff79921b04ccd1696
- Successful workflow: https://github.com/jay-rtl/mibank/actions/runs/39817497085
- Implemented: Pages workflow, /mibank path preparation, active-navigation base handling, source-key redaction and web video derivatives. Original MP4s remain locally in ignored .local-original-media/. See DEPLOYMENT.md and source/video-derivatives.json.
- Design review: established design retained; desktop/mobile navigation and media verified on the hosted site.

| Category | Status | Deployment evidence |
| --- | --- | --- |
| Functionality | PASS | All 37 informational routes return HTTP 200 with primary headings. 14 hosted Chrome checks passed: imagery, desktop/mobile product navigation, active states, refresh, filters and four video playback checks. Zero runtime errors/failed requests. |
| SEO | PASS | noindex present on all 37 hosted informational pages. No production canonical/domain assumptions introduced. Project robots.txt is served beneath /mibank; meta noindex is the page-level indexing instruction. |
| Responsive/Visual | PASS | Hosted controls verified in installed Chrome at 1440px and 390px; prior representative screenshot review remains applicable. No redesign introduced during deployment. |
| Accessibility | NOT TESTED | Full hosted axe/screen-reader audit not repeated; prior UI results and known missing-caption/graphical-text gaps remain. |
| Security/Privacy | PASS | HTTPS hosting enabled; no credentials included in source. The source site's embedded public Maps key was redacted from repository-bound raw HTML and is not used. No banking backend or data collection was added. Scope is deployment/source checks, not security certification; GitHub Pages does not apply _headers. |
| Performance | NOT TESTED | Hosted Lighthouse/field CWV were not measured. Earlier mobile lab metrics apply only to the local build. Optimized videos are loaded on demand; no new preload added. |
| Code/Regression | PASS | GitHub Actions npm ci, type checks, static build and Pages publish succeeded. Local deployment-path audit checked 39 HTML pages with zero broken or unprefixed local references, production-domain links or external resources. |

Tests run: npm run check; DEPLOY_BASE=/mibank npm run build; node scripts/prepare-deploy.mjs; node scripts/deployment-audit.mjs; node scripts/deployment-browser.mjs; node scripts/deployed-routes.mjs; node scripts/deployment-browser.mjs https://jay-rtl.github.io/mibank; node scripts/verify-video-derivatives.mjs. Browser environment: installed Windows Chrome controlled with Playwright. Workflow environment: GitHub-hosted Ubuntu, Node 24. All four video duration comparisons passed within 0.02 seconds of their originals.

Outstanding items: the earlier four unavailable documents, media accessibility, source-content currency, legal/client review and broader browser/device checks are unresolved. GitHub Pages is public hosting; no access-control guarantee is made.

Launch readiness: READY FOR REVIEW — deployed preview is available. This is not clearance to replace the official banking website. Next action: review the live preview and address the existing content/accessibility items before a production launch.


## Locations map repair — 23 October 2026
The omitted interactive map and oversized legend have been repaired. See MAP_FIX_AUDIT.md for the scoped verification matrix, local performance results and regional-map limitations. All 88 original point coordinates and labels remain intact; original contact wording remains available.

The repair is published at https://jay-rtl.github.io/mibank/about/locations/. Workflow 39820586286 succeeded. Hosted verification passed 44 map checks and three axe scans with zero browser errors, failed resources or external runtime requests. See MAP_FIX_AUDIT.md and audit/map-live-results.json.

## Hibiscus video caption update — 23 October 2026

**Implemented:** Replaced the technical note below the Hibiscus video with the user-requested source wording, “Simple hassle-free banking for everyone”. The title/download utility remains beneath it. Scope: src/pages/[...slug].astro, Hibiscus page only.

**Design review:** Responsive heading, inspected in rendered Chrome screenshots at 1440px and 390px; no horizontal overflow.

| Category | Status | Evidence |
| --- | --- | --- |
| Functionality | PASS | Caption matches requested text; technical note removed on Hibiscus; original video/download path retained; complete static-link audit passes. |
| SEO | PASS | Existing title/metadata/noindex retained; caption uses a semantic H2; source text inclusion passes across 37 pages. |
| Responsive/Visual | PASS | Actual desktop/mobile caption screenshots inspected, no overflow. |
| Accessibility — changed caption | PASS | Scoped axe checks on the new heading found no applicable violations at both widths. |
| Accessibility — video alternatives | NOT TESTED | No caption track or transcript was added; the previous known media accessibility gap remains. This change concerns visible page text. |
| Security/Privacy | NOT APPLICABLE | Static text/style change adds no data collection, integration or permissions. |
| Performance | NOT TESTED | No new media/scripts or animation; Lighthouse not repeated for this text-only update. |
| Code/Regression | PASS | npm run check: zero diagnostics; npm run build succeeds; npm run audit: zero missing source text/broken local references. |

**Tests run:** npm run check, npm run build, npm run audit; ad hoc Playwright/axe in installed Windows Chrome at 1440/390px. Evidence: audit/hibiscus-caption-results.json and local screenshots.

**Outstanding:** Existing site-wide review gaps remain; actual video captions/transcripts are not supplied by this visible-text edit.

**Launch readiness:** READY FOR REVIEW — caption update prepared for the existing preview deployment.

**Next action:** Review the updated Hibiscus preview after the Pages workflow completes.
