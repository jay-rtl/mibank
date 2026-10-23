# GSAP ScrollTrigger cinematic scrolling — local review

Deployment update: the reviewed version is now published. See `CINEMATIC_DEPLOYMENT_AUDIT.md` for the successful workflow and 75 live checks. This document records the preceding local validation.

## 1. Implemented

- `src/lib/scroll-reveals.ts`: replaced the prior IntersectionObserver fade/lift implementation with GSAP timelines and ScrollTrigger. No opacity tween is used in the new scroll effects.
- `src/styles/scroll-motion.css`: existing image frames clip their contents during the reveal; an independent image scale composes with existing hover transforms.
- Homepage and informational pages use editorial heading masks, restrained vertical translation, framed photo reveals and sequenced card/image/caption timelines. Wide product rows animate in pairs; stacked mobile cards have separate timelines. Source article text remains fully opaque with a small scroll-linked translation.
- Existing GSAP dependency reused, with `gsap/ScrollTrigger` imported from the installed package. No dependencies or infrastructure added. No content, routes, page layout, branding or source asset files changed for this motion upgrade.
- The existing welcome and automatic slideshow are preserved. Scroll timelines initialize after welcome dismissal. Initially visible content and the hero are left static.
- Maps, live directory controls, search fields, sticky navigation and ordinary menus are excluded from animated masks. Keyboard focus reveals the affected scene immediately. Archive hash navigation reveals the first screen of its destination immediately, including during native smooth scrolling. Search results become static/readable when filtered, and expandable artwork refreshes trigger positions.
- Responsive and reduced-motion changes use `gsap.matchMedia()` context cleanup. Reduced motion removes the timelines, masks and animation classes. No-JS HTML/CSS remains visible. Unsupported clip-path receives transform-only enhancement.
- Local only. No Git push, deployment, DNS or hosting change performed.

## 2. Design review and motion specification

Two main treatments anchor the design: framed photographs that gently open and settle, and card sequences where artwork precedes captions. Heading masks complement these; longer prose retains legibility at full opacity. There is no pinning, snapping, custom scroller or scroll interception.

| Treatment | Trigger / range | Motion |
| --- | --- | --- |
| Editorial heading | Starts at `clamp(top 94%)`, usually ends at `clamp(top 48%)` | Vertical translation, bottom-to-top text mask, 0.13-unit sequencing |
| Photo / section pair | Ends between top 28–40% | Frame scale 0.965→1, restrained inset mask, vertical travel; image scale 1.065→1 |
| Product/report/video cards | Desktop/tablet group ends at top 32%; mobile card at top 40% | Card/image scale 0.985→1; artwork and captions sequence with 0.18/0.10-unit offsets |
| Short archive rows | Ends at top 60–65% | Smaller translation and image reveal, preserving fully opaque copy |
| Supporting/footer content | Ends at top 58%, clamped to page end | Small translation, fully opaque throughout |

All timelines use **`scrub: 1.5`** and linear tween easing for direct scroll progression with catch-up smoothing. These are timeline-relative durations, not independent timed entrance animations. Progress reverses naturally when scrolling back. The numeric scrub behavior and responsive cleanup follow the [official ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) and [GSAP matchMedia documentation](https://gsap.com/docs/v3/GSAP/gsap.matchMedia/).

Desktop travel is capped at 46px; mobile travel at 28px. Active nodes receive temporary will-change hints. Lazy-image/font loads and source artwork expansion refresh measurements. End positions clamp to maximum scroll so footer content can complete without extra whitespace.

Actual intermediate and completed card screenshots were inspected at 1440px and 390px. Behavioral checks also cover 768px. Fifteen major-layout snapshots—five page types at three widths—were compared between a reduced-motion static baseline and the enabled version: **zero dimension/position changes** in the measured layout containers.

## 3. Audit matrix

| Category / scope | Status | Evidence / limits |
| --- | --- | --- |
| Functionality: new motion and integration | PASS | 70 cinematic checks and 17 interaction checks passed. Verified actual masks/scale/translation, constant opacity, scroll progression, holding at partial progress, reverse movement, stagger, focus escape, footer completion, responsive cleanup, search/reset, archive jump, expanding artwork and map popup. |
| Functionality: existing flows | PASS | Homepage suite: 82 checks. Welcome suite: 43 checks. Media suite: 45 checks, retaining all 49 items and original image/link destinations. No captured runtime errors or failed requests in these suites. |
| Functionality: banking transactions | NOT APPLICABLE | This remains an informational preview with no transaction backend. |
| SEO: local static preview | PASS | Static audit of 37 original routes: zero missing original text, broken local references, missing required metadata or external runtime assets. Preview indexing restrictions retained. |
| SEO: deployed revision | NOT TESTED | This version has not been deployed. |
| Responsive/Visual: Chrome local | PASS | Actual screenshots reviewed and behavior checked at 1440/768/390px; 15 layout comparisons produced zero measured changes. Existing product offset and native page height preserved. No pin spacers or horizontal overflow. |
| Responsive/Visual: other browsers/devices | NOT TESTED | No Safari, Firefox or physical-device run. |
| Accessibility: new motion behavior | PASS | Reduced-motion fallback and live preference changes verified. Keyboard focus immediately removes masks, including the second item in a paired row. No-JS content remains visible. Three cinematic fallback scans and the existing homepage/welcome/Media scans were clean. Normal-motion scans were run after settling. |
| Accessibility: existing Media rail at footer boundary | FAIL | One normal-motion axe `target-size` finding at 1440×900: the sticky year rail's 2018 link is mostly behind the existing fixed header as the rail leaves its section. Reproduced with motion disabled. Focusing the link brings its full 51px target into view. The finding is retained in the evidence, classified as an existing issue and not suppressed. Eight other normal-motion page/viewport scans were clean. This visual task preserves the existing rail layout; its boundary behavior needs separate review. |
| Accessibility: screen reader/document review | NOT TESTED | No assistive-technology or PDF/caption audit; no full WCAG conformance claim. |
| Security/Privacy: changed code | PASS | Reviewed local animation/event behavior. No credentials, storage, analytics, forms or new collection. Malformed fragment decoding is handled safely; no source HTML is inserted by the motion code. |
| Security/Privacy: comprehensive audit/legal review | NOT TESTED | No new full-system vulnerability or legal review for this interaction upgrade. |
| Performance: local mobile lab | PASS | Homepage: Lighthouse **99/100**, FCP 1.5s, LCP 1.9s, Speed Index 1.5s, TBT 0ms, CLS 0. Media: **96/100**, FCP 1.7s, LCP 2.1s, Speed Index 2.9s, TBT 150ms, CLS 0. The requested welcome still intentionally covers the homepage for approximately 6.6s unless skipped; LCP does not describe that visible hold. |
| Performance: field/FPS data | NOT TESTED | No live field INP or physical-device frame-rate measurement. |
| Code/Regression | PASS | Astro check: 16 files, zero errors/warnings/hints. Production build: 39 pages. Content/reference audit and existing suites passed. MatchMedia cleanup, responsive regrouping and source-artwork refresh tested. |

## 4. Tests run

Environment: Windows, Node.js 24.18.0, installed Google Chrome through Playwright, local Astro production preview at 127.0.0.1:4321. Astro commands used `ASTRO_TELEMETRY_DISABLED=1`. Lighthouse used simulated mobile throttling; these are lab results.

```powershell
npm run check
npm run build
npm run audit
node scripts/cinematic-scroll-audit.mjs
node scripts/cinematic-interaction-audit.mjs
node scripts/cinematic-layout-snapshot.mjs before
node scripts/cinematic-layout-snapshot.mjs after
node scripts/home-cinematic-audit.mjs
node scripts/welcome-intro-audit.mjs
node scripts/media-layout-audit.mjs
node scripts/performance.mjs http://127.0.0.1:4321/ audit/lighthouse-cinematic-home.json
node scripts/performance.mjs http://127.0.0.1:4321/media/ audit/lighthouse-cinematic-media.json
```

The `before` layout snapshot is the static reduced-motion baseline; `after` enables animation. Both use the same source layout. The old `scripts/scroll-reveal-audit.mjs` command now delegates to the new cinematic suite instead of asserting obsolete timed fade behavior.

Evidence: `audit/cinematic-scroll-results.json`, `audit/cinematic-interaction-results.json` (including the existing rail finding), `audit/cinematic-layout-before.json`, `audit/cinematic-layout-after.json`, the homepage/welcome/Media/static results, and the two Lighthouse files above. Local screenshots are ignored files in `audit/screenshots/cinematic-*`.

## 5. Outstanding items

- User visual review of the new scroll pacing is pending.
- Existing Media sticky-rail target-size finding remains documented above. Keyboard access was verified; the pointer/occlusion boundary needs refinement before a full accessibility acceptance claim.
- Other browser engines, physical devices and screen readers remain unverified.
- Existing four unavailable source documents, historical content discrepancies, PDF/video accessibility and client/legal review remain documented in prior project reports.

## 6. Launch readiness

**READY FOR REVIEW** — the requested interaction upgrade is implemented locally and verified within the recorded scope. This is not a full launch or WCAG sign-off. No deployment performed.

## 7. Next action

Open http://127.0.0.1:4321/, refresh with Ctrl+Shift+R, and scroll slowly through Products, the community photograph, Reports and Media. Scroll backward to inspect reversible unfolding. Review before deployment.
