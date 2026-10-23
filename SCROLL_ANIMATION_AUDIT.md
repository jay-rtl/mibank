# Scroll animation restoration — local review

Historical report for the earlier timed reveal. The current GSAP ScrollTrigger implementation and audit are documented in `CINEMATIC_SCROLL_AUDIT.md`.

## 1. Implemented

The replacement homepage no longer contained the old `data-reveal` attributes, so the prior observer had no sections to animate. `src/lib/scroll-reveals.ts` now registers the current homepage and interior-page content blocks. `src/layouts/Layout.astro` initializes the shared implementation instead of the obsolete selector/observer block.

Headings, photographs, product artwork, report cards, newsroom rows and appropriate text blocks fade in while lifting 30px over 0.95s (`power2.out`). Simultaneously entering blocks use a restrained 70ms stagger, capped at 210ms. The trigger is at least 8% intersection with a 32px bottom inset. Leaving the viewport rearms the target, so returning by scrolling replays the entrance. Targets are not hidden or reset while being read.

Initial visible content and the hero are left static. Homepage reveals wait until welcome dismissal. Nested content blocks are deduplicated. Interactive map elements are excluded. Keyboard focus cancels an active reveal immediately. Reduced-motion preference changes disconnect the observer, cancel tweens and restore normal presentation. Content stays visible without JavaScript or IntersectionObserver support. Existing GSAP is reused; no dependencies added.

No Git push or deployment performed.

## 2. Design review

Restored the gentle fade/lift behavior across the dark design without introducing scroll hijacking, pinning or continual movement. Product-card staggered layout remains intact because the artwork animates independently of the offset parent. Actual intermediate/settled screenshots were captured at 1440px and 390px; mobile frames were inspected. Functional rendering checks covered 1440, 768 and 390px.

## 3. Audit matrix

| Category / scope | Status | Evidence and limits |
| --- | --- | --- |
| Functionality | PASS | 34 scroll checks passed: real opacity/transform changes, replay, completed cleanup, keyboard cancellation, preserved product layout, inner Products/Media targets, map exclusion, reduced motion and no-JS visibility. 82 homepage regression checks also passed. Zero captured runtime errors/failed requests. |
| SEO: local content/configuration | PASS | Static audit: 37 original routes, zero missing original text, broken references or missing required metadata. Preview indexing restrictions unchanged. |
| SEO: deployed version | NOT TESTED | No deployment of this revision. |
| Responsive/Visual: Chrome | PASS | Scroll behavior and overflow checks passed at 1440/768/390px. Intermediate/settled screenshots captured at desktop/mobile; mobile frames inspected. |
| Responsive/Visual: other devices/browsers | NOT TESTED | No physical-device, Firefox or Safari run. |
| Accessibility: scoped checks | PASS | Three scroll and three homepage axe scans reported zero violations in settled reading states. Keyboard focus makes animated content immediately opaque/static. Reduced-motion and no-JS checks passed. Fade frames temporarily interpolate opacity; scans were run after motion settled. This is not a complete WCAG certification. |
| Accessibility: assistive technologies | NOT TESTED | No screen-reader run. Existing original-media/document accessibility gaps remain. |
| Security/Privacy: changed code | PASS | Reviewed local observer, animation and event behavior; no data collection, storage, credentials, external services or new dependencies. |
| Security/Privacy: full system audit | NOT TESTED | No additional comprehensive vulnerability/legal audit in this animation fix. |
| Performance: local mobile simulation | PASS | Lighthouse 97/100; FCP 1.2s, LCP 2.1s, Speed Index 4.1s, TBT 0ms, CLS 0. Uses transform/opacity and IntersectionObserver instead of a per-scroll layout loop. The requested welcome still intentionally covers the page for approximately 6.6s unless skipped; the LCP metric does not describe that visible hold. |
| Performance: field/FPS measurement | NOT TESTED | No live field INP or physical-device frame-rate measurement. |
| Code/Regression | PASS | Astro check: 16 files, zero errors/warnings/hints. Production build: 39 pages. Static content audit and 82-check homepage suite passed. |

## 4. Tests run

Windows, Node.js 24.18.0, installed Google Chrome driven by Playwright, local production preview. Astro commands used `ASTRO_TELEMETRY_DISABLED=1`.

```powershell
npm run check
npm run build
npm run audit
node scripts/scroll-reveal-audit.mjs
node scripts/home-cinematic-audit.mjs
node scripts/performance.mjs http://127.0.0.1:4321/ audit/lighthouse-scroll-reveal.json
```

Evidence: `audit/scroll-reveal-results.json`, `audit/home-cinematic-results.json`, `audit/static-results.json`, `audit/lighthouse-scroll-reveal.json`. Ignored local screenshots: `audit/screenshots/scroll-reveal-*`.

## 5. Outstanding items

User visual review, other browsers/physical devices and existing source-content/document/legal review items remain. See `WELCOME_INTRO_AUDIT.md` and `DARK_THEME_AUDIT.md` for earlier scope and existing limitations.

## 6. Launch readiness

**READY FOR REVIEW** — local fix and scoped verification complete. Deployment remains pending user approval.

## 7. Next action

Refresh http://127.0.0.1:4321/ with Ctrl+Shift+R, then scroll down and back to a previous section to review the restored entrances.
