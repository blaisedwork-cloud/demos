# Verification checklist

Site: `plumber` · Checked: 2026-10-17 · Tool: tools/verify-site/verify.js

| Result | Check | Notes |
|---|---|---|
| PASS | No placeholder text, lorem ipsum or unfilled values | 3 pages scanned |
| PASS | Internal links and anchors resolve | 13 internal links/anchors checked |
| CHECK | External links load | https://www.oaic.gov.au: unreachable from this machine (ENOTFOUND) |
| PASS | Phone / tablet / desktop: no horizontal scroll | screenshots saved in demos/plumber/checks/ (check them by eye) |
| PASS | Keyboard navigation and visible focus | 25 stops; skip link first: true; stops without visible focus: 0; assistant opens with Enter, closes with Esc |
| PASS | Images have alt text | all images have alt text |
| PASS | Accessibility scan (axe, WCAG 2.1 AA): no serious/critical issues | 3 pages scanned, light and dark mode |
| PASS | No JavaScript errors | none |
| PASS | Privacy and terms pages exist | marked "needs review": privacy.html, terms.html |
| PASS | Demo clearly labelled | demo banner present; noindex set |
| PASS | Lighthouse (mobile) scores recorded | performance 95, accessibility 100, best-practices 100, seo 63 (SEO is lowered on purpose: demo pages are set to noindex) |
| CHECK | No invented testimonials, reviews, logos, numbers or licence numbers | compare every fact on the page with the client intake / site.json |
| CHECK | Screenshots look right by eye (spacing, images, colours) | see demos/plumber/checks/ |

PASS = automated check passed. CHECK = needs a human look. FAIL = must be fixed before the site counts as done.

## Assistant test (FAQ mode)

| Question | Expected | Answer | Result |
|---|---|---|---|
| Do you charge a call out fee? | contains "$120" | Yes. Our call-out fee is $120 and includes the first 30 minutes on site. From our FAQs: "Do you charge a call-out fee?" | PASS |
| What are your hours? | contains "7am–5pm" | Our hours: Mon–Fri: 7am–5pm Saturday: 8am–12pm Sunday: Closed Business hours | PASS |
| Can you come after hours for a burst pipe? | contains "After-hours emergency" | After-hours emergency call-outs available. Call 0491 570 156. Emergency service | PASS |
| Do you work on hot water systems? | contains "heat-pump" | Yes, we repair and replace electric, gas and heat-pump hot water systems. We'll quote after inspecting your system. From our FAQs: "Do you work on hot water systems?" | PASS |
| Do you service Westmead? | contains "Yes, we service Westmead" | Yes, we service Westmead. Call 0491 570 156 to book. Service area | PASS |
| How much to clear a blocked drain? | contains "From $180" | Blocked drains: From $180 For an exact quote, call 0491 570 156. Prices listed on this website | PASS |
| Do you offer a warranty? | says it does not know, gives contact | Sorry, I don't have an answer to that on this website. Please call 0491 570 156 or email hello@example.com and the team can help. | PASS |
| Can you come today? | says it does not know, gives contact | Sorry, I don't have an answer to that on this website. Please call 0491 570 156 or email hello@example.com and the team can help. | PASS |
| Is my tap water safe to drink? | says it does not know, gives contact | Sorry, I don't have an answer to that on this website. Please call 0491 570 156 or email hello@example.com and the team can help. | PASS |
| Do you do roofing? | says it does not know, gives contact | Sorry, I don't have an answer to that on this website. Please call 0491 570 156 or email hello@example.com and the team can help. | PASS |
| qwerty | says it does not know, gives contact | Sorry, I don't have an answer to that on this website. Please call 0491 570 156 or email hello@example.com and the team can help. | PASS |
| Do you take credit card? | contains "card, bank transfer and cash" | We accept card, bank transfer and cash. Payment is due when the job is finished. From our FAQs: "How do I pay?" | PASS |
| Can I pay with EFTPOS? | contains "card, bank transfer and cash" | We accept card, bank transfer and cash. Payment is due when the job is finished. From our FAQs: "How do I pay?" | PASS |
| Is there a callout charge? | contains "$120" | Yes. Our call-out fee is $120 and includes the first 30 minutes on site. From our FAQs: "Do you charge a call-out fee?" | PASS |
| Can you come out today? | says it does not know, gives contact | Sorry, I don't have an answer to that on this website. Please call 0491 570 156 or email hello@example.com and the team can help. | PASS |
| Do you take Afterpay? | says it does not know, gives contact | Sorry, I don't have an answer to that on this website. Please call 0491 570 156 or email hello@example.com and the team can help. | PASS |
| Can I pay by the hour? | says it does not know, gives contact | Sorry, I don't have an answer to that on this website. Please call 0491 570 156 or email hello@example.com and the team can help. | PASS |

17/17 passed.

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
