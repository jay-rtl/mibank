# Content audit

Captured 38 accessible HTML URLs; 37 unique local informational pages after deduplicating the homepage. Body text, images, tables, downloads and video sources are captured in src/data/pages.json. Shared navigation/footer is rebuilt once; the shared slogan is retained in the new footer. Only HTML whitespace and entities are normalized for automated comparison. No original rates, eligibility text, paragraphs or news dates are intentionally corrected.

## Content discrepancies requiring client review
- Homepage says 16 branches; About Us says 12. Both preserved.
- History ends with “more than Agents”; preserved exactly.
- Contact details include “TEL: 321 381 /7999 9129”; preserved exactly.
- Media has inconsistent image/title/date destinations, including digital ID linking to innovation award and some dates pointing to unrelated PDFs. Destinations are preserved where available; no editorial fixes inferred.
- Eight report viewers require obsolete Flash. Their original fallback wording is preserved and original PDFs offered locally; Flash is not executed.
- No standalone current insurance page was discovered. Insurance references and the BIMA MiLife release remain available.
- robots.txt, sitemap.xml and logo destination index.htm return 404. Logo maps to local home.

## Missing source references
- https://www.mibank.com.pg/about_us/media_release/FINAL%20MiBank%20Press%20Release%20-%20Kina%20Bank%20takes%2015%%20stake%20in%20MiBank.pdf
- https://www.mibank.com.pg/about_us/media_release/ASX-PNGX%20Announcement_Kina%20Bank%20takes%2015%%20stake%20in%20Nationwide%20Microbank%20Limited.pdf
- https://www.mibank.com.pg/about_us/about_us/MiBank_AR2019.pdf
- https://www.mibank.com.pg/about_us/about_us/media_release/Notice%20to%20Customers_COVID-19.pdf

## Coverage limits
No content is fabricated for unavailable files. The original source site was crawled via public HTML links. Unlinked pages, historical archive versions and content behind authentication are outside verifiable coverage. Final comparison and rendered checks are recorded in FINAL_AUDIT.md.

## Final comparison evidence
- Captured original HTML text nodes, after excluding shared source navigation/footer and executable scripts, are compared against rendered local body text. Whitespace is ignored; wording, numbers and punctuation are retained. All 37 unique source pages have zero missing text segments. This verifies inclusion, not OCR, semantic correctness, editorial currency or the absence of extra duplicated source labels. Shared labels, slogan and original copyright are rebuilt in reusable components.
- 64 local PDFs retain original downloaded bytes and passed PDF header-signature checks; their internal text and PDF accessibility were not independently audited.
- Four original MP4s were retained and muted playback passed in installed Chrome. Captions/transcripts were not supplied and remain a release gap.
- Nineteen mouseover image variants were discovered and migrated in addition to primary images, with all 19 decoding successfully at desktop and mobile widths. Image lettering is preserved in the original raster assets; OCR parity and comprehensive text alternatives for every graphical banner remain NOT TESTED.
- Source-unavailable links retain original labels and do not imply a successful download.
