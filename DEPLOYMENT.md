# GitHub Pages preview deployment

Latest verified version: cinematic dark theme, welcome intro and scroll-linked motion, deployed from `15e7f184c1ff51757f28ee5d1dc50c14bf30c1cb`. [Live preview](https://jay-rtl.github.io/mibank/) · [Successful workflow](https://github.com/jay-rtl/mibank/actions/runs/39875088768). All 75 live checks passed. See `CINEMATIC_DEPLOYMENT_AUDIT.md` for scoped results and outstanding items.

User approved GitHub Pages on 23 October 2026. Destination repository: https://github.com/jay-rtl/mibank. This is an independent, non-production preview; index blocking and the preview banner are retained. The official MiBank website is not modified.

## Build and publish

The workflow in `.github/workflows/deploy.yml` checks and builds on pushes to main, applies the `/mibank` repository base, uploads the generated static artifact and deploys with GitHub Pages. The repository's Pages build type is configured as `workflow` via the GitHub API.

For a local deployment build in PowerShell:

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'
$env:DEPLOY_BASE='/mibank'
npm run check
npm run build
node scripts/prepare-deploy.mjs
node scripts/deployment-audit.mjs
```

Do not run `prepare-deploy.mjs` repeatedly on the same output; rebuild first. For the normal localhost preview, clear DEPLOY_BASE and rebuild. GitHub Pages has no support for the `_headers` policy file; the previous report's hosting-header caveat remains applicable. The browser and static checks cover repository-base navigation separately from localhost root navigation.

## Media preservation and optimization

The original MP4s are retained locally in `.local-original-media/`, excluded from Git. Served copies at the existing video paths are H.264/AAC derivatives, 25 fps, at original or smaller dimensions (maximum 1280×720), with fast-start playback. Audio and full duration are retained. Original source URLs, original byte counts, local backup paths and deployed sizes are recorded in `source/video-derivatives.json`.

This supersedes earlier statements that the deployed MP4 files retain byte-identical original encodings. The local originals remain intact. PDFs and original raster files are unchanged. The asset manifest's original byte counts describe captured originals; the video-derivatives manifest describes the deployed copies. Do not rerun the source downloader during a deployment build, because it would restore the original oversized MP4s.

The captured Locations HTML contained a public source Google Maps API key. Its raw snapshot was backed up locally under `.local-original-source/` (ignored) and only the key string was redacted from the repository-bound snapshot. Visible source content is unaffected. The redesign uses no Google Maps service or key.

## Existing review gaps

Four unavailable source PDFs, caption/transcript and graphical-text accessibility gaps, source business-content inconsistencies, and client/legal review remain documented in FINAL_AUDIT.md. Deployment as a preview does not resolve these release gaps or certify regulatory, privacy, security or WCAG compliance.

## Verified result

Published: https://jay-rtl.github.io/mibank/

Workflow https://github.com/jay-rtl/mibank/actions/runs/39817497085 succeeded. All 37 hosted route checks and 14 hosted browser checks passed. See audit/deployed-route-results.json and audit/deployed-browser-results.json.
