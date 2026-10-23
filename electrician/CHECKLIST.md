# Verification checklist

Site: `electrician` · Checked: 2026-10-23 · Tool: tools/verify-site/verify.js

| Result | Check | Notes |
|---|---|---|
| PASS | No placeholder text, lorem ipsum or unfilled values | 3 pages scanned |
| PASS | Internal links and anchors resolve | 14 internal links/anchors checked |
| PASS | External links load | https://www.oaic.gov.au: ok |
| PASS | Phone / tablet / desktop: no horizontal scroll | screenshots saved in demos/electrician/checks/ (check them by eye) |
| PASS | Keyboard navigation and visible focus | 27 stops; skip link first: true; stops without visible focus: 0; n/a |
| PASS | Images have alt text | all images have alt text |
| PASS | Accessibility scan (axe, WCAG 2.1 AA): no serious/critical issues | 3 pages scanned, light and dark mode |
| PASS | No JavaScript errors | none |
| PASS | Privacy and terms pages exist | no "needs review" note (reviewed, or a demo) |
| PASS | Demo clearly labelled | demo banner present; noindex set |
| PASS | Lighthouse (mobile) scores recorded | performance 99, accessibility 100, best-practices 100, seo 66 (SEO is lowered on purpose: demo pages are set to noindex) |
| CHECK | No invented testimonials, reviews, logos, numbers or licence numbers | compare every fact on the page with the client intake / site.json |
| CHECK | Screenshots look right by eye (spacing, images, colours) | see demos/electrician/checks/ |

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
| `whyUs[0].text` | "We're owner-operated by a local sparky." (awkward: "operated by" a person) | "The owner, a local sparky, is on every job." (same facts as the intake: "Owner-operated by a local sparky" and "Owner on every job") | **Yes** |
| `whyUs[2].text` | "We explain what we found before we fix it, and we always clean up." | Fine as is (two intake facts in one line) | No change |

**Copy fixes applied: 1** (`whyUs[0].text`, listed above).

| PASS | Redesign (2026-10-18) | Own art direction per trade (see docs/design/demo-redesign-2026-10-18.md). Every new section uses only intake facts; no photos, stats or reviews invented. Checked by eye at 1440px and 390px in light and dark mode. |
