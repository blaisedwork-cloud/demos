# Verification checklist

Site: `landscaper` · Checked: 2026-10-18 · Tool: tools/verify-site/verify.js

| Result | Check | Notes |
|---|---|---|
| PASS | No placeholder text, lorem ipsum or unfilled values | 3 pages scanned |
| PASS | Internal links and anchors resolve | 13 internal links/anchors checked |
| CHECK | External links load | https://www.oaic.gov.au: unreachable from this machine (ENOTFOUND) |
| PASS | Phone / tablet / desktop: no horizontal scroll | screenshots saved in demos/landscaper/checks/ (check them by eye) |
| PASS | Keyboard navigation and visible focus | 21 stops; skip link first: true; stops without visible focus: 0; n/a |
| PASS | Images have alt text | all images have alt text |
| PASS | Accessibility scan (axe, WCAG 2.1 AA): no serious/critical issues | 3 pages scanned, light and dark mode |
| PASS | No JavaScript errors | none |
| PASS | Privacy and terms pages exist | marked "needs review": privacy.html, terms.html |
| PASS | Demo clearly labelled | demo banner present; noindex set |
| PASS | Lighthouse (mobile) scores recorded | performance 99, accessibility 100, best-practices 100, seo 63 (SEO is lowered on purpose: demo pages are set to noindex) |
| CHECK | No invented testimonials, reviews, logos, numbers or licence numbers | compare every fact on the page with the client intake / site.json |
| CHECK | Screenshots look right by eye (spacing, images, colours) | see demos/landscaper/checks/ |

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
| Whole page | "Green waste ... recycled" appears 5 times (subheadline, trust point, why-us title and text, FAQ) | Drop the last sentence of `hero.subheadline` ("Green waste is taken away and recycled.") so the hero is shorter; the trust point right below already says it | No: style call, your choice |
| `faqs[2].a` | "Every 2 weeks in spring and summer, and every 3–4 weeks in autumn and winter, suits most lawns." | Fine (grammatical; the intake's wording) | No change |
| `services[0].icon` | "clock" for mowing | Not copy; a "leaf" or a mower icon would fit better (template has no mower icon) | No |

No grammar or spelling errors found. **Copy fixes applied: none.**
