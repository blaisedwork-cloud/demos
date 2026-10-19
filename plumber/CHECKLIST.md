# Verification checklist

Site: `plumber` · Checked: 2026-10-19 · Tool: tools/verify-site/verify.js

| Result | Check | Notes |
|---|---|---|
| PASS | No placeholder text, lorem ipsum or unfilled values | 3 pages scanned |
| PASS | Internal links and anchors resolve | 13 internal links/anchors checked |
| PASS | External links load | https://www.oaic.gov.au: ok |
| PASS | Phone / tablet / desktop: no horizontal scroll | screenshots saved in demos/plumber/checks/ (check them by eye) |
| PASS | Keyboard navigation and visible focus | 25 stops; skip link first: true; stops without visible focus: 0; n/a |
| PASS | Images have alt text | all images have alt text |
| PASS | Accessibility scan (axe, WCAG 2.1 AA): no serious/critical issues | 3 pages scanned, light and dark mode |
| PASS | No JavaScript errors | none |
| PASS | Privacy and terms pages exist | marked "needs review": privacy.html, terms.html |
| PASS | Demo clearly labelled | demo banner present; noindex set |
| PASS | Lighthouse (mobile) scores recorded | performance 99, accessibility 100, best-practices 100, seo 66 (SEO is lowered on purpose: demo pages are set to noindex) |
| CHECK | No invented testimonials, reviews, logos, numbers or licence numbers | compare every fact on the page with the client intake / site.json |
| CHECK | Screenshots look right by eye (spacing, images, colours) | see demos/plumber/checks/ |

PASS = automated check passed. CHECK = needs a human look. FAIL = must be fixed before the site counts as done.

## Manual review (2026-10-15, Claude Code)

| Result | Check | Notes |
|---|---|---|
| PASS | No invented testimonials, reviews, logos, numbers or licence numbers | Every fact on the page comes from `intake.json`. No reviews, logos or licence numbers are shown. Prices and fees are fictional demo values, and the demo banner says so. |
| PASS | Copy written by Claude Code uses only intake facts | Headline, subheadline, trust points, empty service descriptions, "why us" sentences and pricing intro were checked line by line against the intake. |
| PASS | Screenshots look right by eye | Phone, tablet and desktop in `checks/`. Header, hero card, cards, pricing table, FAQ and footer all render cleanly. |
| CHECK | External link oaic.gov.au | Unreachable from the build sandbox (network policy); it's a government site. Re-check on the live demo. |
| PASS | Visual polish pass (2026-10-17) | Visual direction set; checked at 375, 768 and 1280px (no horizontal scroll) in light and dark mode; skill checklist run (see LOG 2026-10-17). |

## Copy review (overnight run 1, 2026-10-17, Claude): awaiting owner review

Checked every string in `site.json` and the built page for wording, grammar and Australian spelling (en-AU). No US spellings found. Facts (phone, prices, hours, licence) were checked against `intake.json` and **none were changed**.

| Where | Now | Proposed | Applied? |
|---|---|---|---|
| Whole page | "Price before we start" appears 4 times (trust point, why-us title and text, pricing intro, FAQ) | Keep the headline, trust point and FAQ; change why-us text to "You get the price before any work starts, so you can decide first." | No: style call, your choice |
| `business.hours[1]` | "8am–12pm" | "8am–noon" (12pm is fine in Australia; "noon" is just unambiguous) | No: hours are an intake fact; change in intake first if wanted |
| Unused intake fact | The intake says customers can email a photo of the problem | Could become an FAQ ("Can I send a photo?"), using the intake's own words | No: adds content, not a copy fix |

No grammar or spelling errors found. **Copy fixes applied: none.**

| PASS | Redesign (2026-10-18) | Own art direction per trade (see docs/design/demo-redesign-2026-10-18.md). Every new section uses only intake facts; no photos, stats or reviews invented. Checked by eye at 1440px and 390px in light and dark mode. |
