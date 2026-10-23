# MiBank cinematic preview — published verification

Date: October 23, 2026. User explicitly requested deployment after local review.

Live preview: https://jay-rtl.github.io/mibank/

Published source commit: `15e7f184c1ff51757f28ee5d1dc50c14bf30c1cb`.

Successful GitHub Actions run: https://github.com/jay-rtl/mibank/actions/runs/39875088768

## 1. Implemented

Published the reviewed dark theme, typography-only welcome intro, automatic hero slideshow, newsroom refinements, responsive Media images and GSAP ScrollTrigger interaction upgrade through the existing GitHub Pages workflow. Both build and deployment jobs succeeded.

No DNS, repository visibility, banking backend or production credentials were changed. The website remains clearly labelled as an informational, non-production preview with indexing restrictions.

## 2. Design review

The reviewed dark palette, serif headings, original MiBank assets and existing page layouts are preserved. Live Chrome checks confirmed the welcome, seven-second hero autoplay, constant-opacity scroll masks/scale and dark nested pages at 1440px and 390px. Pre-deployment checks also covered 768px and compared 15 layout snapshots without dimension changes. No new visual design changes were made during deployment.

## 3. Audit matrix

| Category / scope | Status | Evidence / limits |
| --- | --- | --- |
| Functionality: published preview | PASS | 75 live checks passed on desktop/mobile. Covers automatic welcome dismissal, logo-free intro, hero autoplay, image loading, real scrubbed masks/scale, product navigation, nested refresh, 49 Media items, search/reset, map popup, original PDF download and playback of all four original video routes. |
| SEO: published preview restrictions/routes | PASS | All 37 original routes returned HTTP 200 and retained noindex and the shared theme. Deployment artifact audit checked 39 pages with zero broken/unprefixed paths, missing noindex or external runtime resources. |
| SEO: production indexing | NOT APPLICABLE | This remains a non-production preview, deliberately blocked from indexing. |
| Responsive/Visual: Chrome scope | PASS | Live 1440/390px viewport checks passed, including no horizontal overflow and functional navigation/motion. Prior 1440/768/390px visual review remains documented in `CINEMATIC_SCROLL_AUDIT.md`. |
| Responsive/Visual: other browsers/physical devices | NOT TESTED | No Safari, Firefox or physical-device deployment test. |
| Accessibility: tested live states/new motion | PASS | Two live Media axe scans reported zero violations. Keyboard navigation and motion fallbacks were verified in the pre-deployment suites. This does not constitute full WCAG certification. |
| Accessibility: existing sticky archive rail boundary | FAIL | The pre-deployment desktop target-size finding remains documented in `CINEMATIC_SCROLL_AUDIT.md`. It reproduces with motion disabled near the footer; keyboard focus exposes the full target. The live scans were different page states and do not resolve this known issue. |
| Security/Privacy: deployment scope | PASS | Existing HTTPS GitHub Pages publication used; no new data collection, tracking or dependencies. Deployment credentials remained in the existing credential manager/GitHub workflow and were not committed. |
| Security/Privacy: comprehensive/legal review | NOT TESTED | No full-system security or legal certification. Existing client/content review items remain. |
| Performance: reviewed local mobile lab | PASS | Final local Lighthouse: homepage 99/100, LCP 1.9s, CLS 0; Media 96/100, LCP 2.1s, CLS 0. These are the measured pre-deployment lab results. |
| Performance: hosted field/lab metrics | NOT TESTED | No new hosted Lighthouse or real-user INP run. Welcome intentionally covers the homepage for approximately 6.6s unless skipped. |
| Code/Regression | PASS | Local Astro check: 16 files, zero errors/warnings/hints. Build: 39 pages. GitHub CI install/check/build/artifact/deploy steps succeeded. Live suite captured zero runtime errors or failed requests. Local root preview was rebuilt after deployment preparation, and its 37-route static audit also passed. |

## 4. Tests run

Local Windows, Node.js 24.18.0, Google Chrome through Playwright; live GitHub Pages URL above. GitHub Actions used Ubuntu and Node 24. Astro telemetry was disabled.

```powershell
# Deployment artifact preparation and checks (DEPLOY_BASE=/mibank)
npm run check
npm run build
node scripts/prepare-deploy.mjs
node scripts/deployment-audit.mjs

# Published desktop/mobile verification
node scripts/cinematic-deployment-audit.mjs https://jay-rtl.github.io/mibank

# Restore the local root preview (DEPLOY_BASE=/)
npm run build
npm run audit
```

Evidence: `audit/deployment-static-results.json`, `audit/cinematic-deployed-results.json`, `audit/static-results.json` and the linked successful workflow. Earlier motion/performance evidence is listed in `CINEMATIC_SCROLL_AUDIT.md`.

## 5. Outstanding items

- Existing sticky year-rail target-size finding remains unresolved.
- Four original unavailable documents, historical content discrepancies, media captions/transcripts, PDF accessibility and client/legal content review remain existing pre-production items.
- Other browsers, physical devices, screen readers and hosted performance/field metrics remain unverified.

## 6. Launch readiness

**READY FOR REVIEW** — the requested public preview deployment succeeded and live smoke checks passed. This is not approval for production banking use or a claim of complete accessibility/legal compliance.

## 7. Next action

Open https://jay-rtl.github.io/mibank/ and refresh with Ctrl+Shift+R if the previous cached design appears. Review the published preview and the outstanding items before any production launch.
