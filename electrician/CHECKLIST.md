# Verification checklist

Site: `electrician` · Checked: 2026-10-17 · Tool: tools/verify-site/verify.js

| Result | Check | Notes |
|---|---|---|
| PASS | No placeholder text, lorem ipsum or unfilled values | 3 pages scanned |
| PASS | Internal links and anchors resolve | 13 internal links/anchors checked |
| CHECK | External links load | https://www.oaic.gov.au: unreachable from this machine (ENOTFOUND) |
| PASS | Phone / tablet / desktop: no horizontal scroll | screenshots saved in demos/electrician/checks/ (check them by eye) |
| PASS | Keyboard navigation and visible focus | 25 stops; skip link first: true; stops without visible focus: 0; assistant opens with Enter, closes with Esc |
| PASS | Images have alt text | all images have alt text |
| PASS | Accessibility scan (axe, WCAG 2.1 AA): no serious/critical issues | 3 pages scanned, light and dark mode |
| PASS | No JavaScript errors | none |
| PASS | Privacy and terms pages exist | marked "needs review": privacy.html, terms.html |
| PASS | Demo clearly labelled | demo banner present; noindex set |
| PASS | Lighthouse (mobile) scores recorded | performance 96, accessibility 100, best-practices 100, seo 63 (SEO is lowered on purpose: demo pages are set to noindex) |
| CHECK | No invented testimonials, reviews, logos, numbers or licence numbers | compare every fact on the page with the client intake / site.json |
| CHECK | Screenshots look right by eye (spacing, images, colours) | see demos/electrician/checks/ |

PASS = automated check passed. CHECK = needs a human look. FAIL = must be fixed before the site counts as done.

## Assistant test (FAQ mode)

| Question | Expected | Answer | Result |
|---|---|---|---|
| What's your call-out fee? | contains "$110" | Yes, our call-out fee is $110 including GST, which covers travel and the first 20 minutes. From our FAQs: "Do you charge a call-out fee?" | PASS |
| My safety switch keeps tripping | contains "Unplug appliances" | Unplug appliances on that circuit and try resetting it. If it still trips, call us. Don't keep resetting it or open the switchboard yourself. From our FAQs: "My safety switch keeps tripping. What should I do?" | PASS |
| Do you do commercial work? | contains "only do residential" | No, we only do residential work. From our FAQs: "Do you do commercial work?" | PASS |
| Do you install EV chargers? | contains "Not at the moment" | Not at the moment. We can recommend someone who does. From our FAQs: "Do you install EV chargers?" | PASS |
| Are you open Saturday? | contains "By appointment" | Our hours: Mon–Fri: 7am–4pm Saturday: By appointment Sunday: Closed Business hours | PASS |
| Do you do emergency call outs? | contains "power loss" | Emergency call-outs for power loss and electrical hazards. Call 0491 570 157. Emergency service | PASS |
| How much for an extra power point in Penrith? | contains "From $150" | Power points: From $150 For an exact quote, call 0491 570 157. Prices listed on this website | PASS |
| Can you fix my wiring myself over the phone? | says it does not know, gives contact | Sorry, I don't have an answer to that on this website. Please call 0491 570 157 or email jobs@example.com and the team can help. | PASS |
| Are you licensed? | says it does not know, gives contact | Sorry, I don't have an answer to that on this website. Please call 0491 570 157 or email jobs@example.com and the team can help. | PASS |
| Do you offer a warranty? | says it does not know, gives contact | Sorry, I don't have an answer to that on this website. Please call 0491 570 157 or email jobs@example.com and the team can help. | PASS |
| Can you install solar panels? | says it does not know, gives contact | Sorry, I don't have an answer to that on this website. Please call 0491 570 157 or email jobs@example.com and the team can help. | PASS |
| asdf | says it does not know, gives contact | Sorry, I don't have an answer to that on this website. Please call 0491 570 157 or email jobs@example.com and the team can help. | PASS |

12/12 passed.

## Manual review (2026-10-15, Claude Code)

| Result | Check | Notes |
|---|---|---|
| PASS | No invented testimonials, reviews, logos, numbers or licence numbers | Every fact on the page comes from `intake.json`. No reviews, logos or licence numbers are shown. Prices and fees are fictional demo values, and the demo banner says so. |
| PASS | Copy written by Claude Code uses only intake facts | Headline, subheadline, trust points, empty service descriptions, "why us" sentences and pricing intro were checked line by line against the intake. |
| PASS | Screenshots look right by eye | Phone, tablet and desktop in `checks/`. Header, hero card, cards, pricing table, FAQ and footer all render cleanly. |
| CHECK | External link oaic.gov.au | Unreachable from the build sandbox (network policy); it's a government site. Re-check on the live demo. |
| PASS | Visual polish pass (2026-10-17) | Visual direction set; checked at 375, 768 and 1280px (no horizontal scroll) in light and dark mode; skill checklist run (see LOG 2026-10-17). |
