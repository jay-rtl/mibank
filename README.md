# MiBank public website redesign

Non-production, local informational preview. No login, transaction, application submission, payment, customer storage, analytics or tracking is implemented. The original website is not modified.

## Run

Requires Node 22.12+ (development used Node 24.18.0 on Windows).

```powershell
npm ci
$env:ASTRO_TELEMETRY_DISABLED='1'
npm run dev
```

Production output:

```powershell
npm run build
npm run preview
```

Preview URL: http://127.0.0.1:4321. Static output is in `dist/`. A static host must support directory indexes and nested route refresh. Astro preview accepts both slashless and trailing-slash routes. All actual navigation uses new local routes. Original URLs are documented in ROUTE_MAPPING.md; host-level legacy redirects should be configured only for an approved production migration.

## Architecture

- Astro static pages and TypeScript; Tailwind Vite integration; project design tokens and responsive CSS in `src/styles/global.css`.
- Shared semantic header, keyboard dropdowns, mobile menu and footer in `src/layouts/Layout.astro`.
- Original response snapshots: `source/pages/`; migrated body content: `src/data/pages.json`; route mapping: `src/data/routes.json`.
- `scripts/crawl.mjs`, `scripts/assets.mjs` and `scripts/migrate.mjs` capture source content, download original files and rebuild local content. Re-crawling fetches the current source and may change the audited baseline: review generated diffs before replacing content.
- Original assets and WebP derivatives are local. Manrope is self-hosted under its included OFL license. Four videos retain original bytes and use `preload="none"`; the two largest are about 81 MB and 166 MB. A future streaming/compression pass needs client review.
- GSAP progressively enhances entrance/reveal movement; content is visible without JavaScript. Reduced motion bypasses animation. Native details menus work without JavaScript; mobile expanded navigation is enhanced with JavaScript.
- The location filter operates entirely in the browser. The original map's labels and coordinates are retained in `src/data/locations.json`; no map service or geolocation permissions are used.

## Checks

```powershell
npx astro check
npm run audit
npm test
```

Browser checks use the installed Windows Chrome path in `scripts/browser-audit.mjs`; adjust it for another machine. Screenshots and JSON evidence are in `audit/`. Static audit compares text segments from captured original HTML against rendered pages, ignoring whitespace only; it is not a legal/content-owner review or OCR of image lettering.

## Preview and launch policy

Every page is `noindex,nofollow`; robots.txt disallows crawling. Sitemap intentionally has no public URLs and canonical tags are intentionally absent to avoid assuming a production domain. Before launch, approve a domain, set canonicals and absolute social image URLs, populate the sitemap, and change indexing directives together. Add genuine structured data only after business details are approved.

`public/_headers` supplies a restrictive static-host header policy for compatible hosts. Astro preview does not apply that file; configure and verify equivalent headers on the chosen host. A non-indexing directive is not access control. The local preview is bound to loopback; any shared staging host must enforce private access separately.

Unreachable source downloads retain their labels and lead to `/source-unavailable`; no original-domain fallback is used. Source discrepancies, old dates and financial details are preserved for client review. Client approval of rights, content, jurisdiction-specific privacy/legal details and accessible media alternatives is required before public release.

See `SITE_INVENTORY.md`, `CONTENT_AUDIT.md`, `ROUTE_MAPPING.md`, `ASSET_MANIFEST.md` and `FINAL_AUDIT.md`.

## Hosted preview

https://jay-rtl.github.io/mibank/

The user-approved public preview deploys from main through GitHub Actions. See DEPLOYMENT.md for base-path handling and the optimized-video/original-backup policy. Source snapshot API keys are redacted before publication.
