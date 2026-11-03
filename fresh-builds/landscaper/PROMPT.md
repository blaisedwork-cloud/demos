You are a fresh design session. Build one website from the brief below, as well as you possibly can.

Where to work: create the folder fresh-builds/landscaper/site/ and put the whole site in it. Do NOT open, read, list or copy anything else in this repository (the files at the top level are older sites we don't want you to be influenced by). Design from scratch.

This is a DEMO for a web designer who sells websites to Australian tradies: it shows tradies what their site could look like. So, on top of the brief:
- A slim, friendly banner at the top of every page: "Demo site: Greenline Garden Care is a made-up business, built to show what a tradie website can look like." (fill in the name). Its phone number is an ACMA fictional number; keep it.
- The quote form must never send on the demo: on submit, show a friendly message "This is a demo, so the form doesn't send. On a real site this goes straight to the tradie's email." Leave the Web3Forms code in place, switched off by a clear DEMO flag.
- Footer: one line "Photos on this demo site are AI-made." and a link back to https://blaisedwork-cloud.github.io/demos/ ("More sample sites").
- Meta robots noindex on every page (it's a demo). Canonical and Open Graph URLs use https://blaisedwork-cloud.github.io/demos/landscaper/ as the base.
- Australian English. No em dashes in visible text.

When you're finished: run a quick check yourself (every page opens, links work, no console errors, it looks great at 390px wide and on desktop). Then git add fresh-builds/landscaper, commit, and push to the branch you're on. Your final message: the palette, fonts and mood you chose, the page list, and every placeholder left (where and what).

---- THE BRIEF ----

Build a multi-page, SEO-optimised website for a landscaper business in Castle Hill, NSW, Australia. Use clean HTML, CSS, and vanilla JavaScript with a shared header and footer on every page. The site should be premium, mobile-first, and built to turn visitors into quote requests.

Business details:

* Name: Greenline Garden Care (a fictional business for a demo: label the site as a demo)
* Phone: 0491 570 158 | Email: hello@example.com
* Service area: Castle Hill, Baulkham Hills, Kellyville, Bella Vista and surrounds
* Services: Lawn mowing and edging (From $65 per visit): Regular or one-off mowing, edging and blowing.; Hedging and pruning; Garden clean-ups (From $280): Weeding, mulching and green waste removal.; Turf laying (Quote on inspection): Ground preparation and new turf.. Prices include GST. Hours: Mon–Fri 7am–5pm, Saturday 7am–1pm, Sunday Closed. Other facts from the client: Do I need to be home? No, as long as we can get into the yard. Leave side gates unlocked and pets inside. Do you take the green waste? Yes, all green waste is taken away and recycled. It's included in the price. How often should I book mowing? Every 2 weeks in spring and summer, and every 3–4 weeks in autumn and winter, suits most lawns.
* Proof points: Green waste taken away and recycled, Same two people every visit
* Licence and ABN: this is a made-up business, so it has none. Never invent a licence number or an ABN. In the footer, where they go, write: “Licence number and ABN shown here on a real site (this is a demo)”. GST registered: yes (all prices include GST)
* Google reviews: none (it's a made-up business). Never write fake reviews: where a testimonial would go, put a short designed note: “Your real Google reviews go here, word for word.”
* Primary keyword: landscaper Castle Hill
* Secondary keywords: lawn mowing and edging Castle Hill, hedging and pruning Castle Hill, garden clean-ups Castle Hill
* About them, in their own words: Two-person team. We do regular garden maintenance and small landscaping jobs. Green waste is taken away and recycled.
* Photos: this demo has these photos (made with AI for the demo; the footer says so in one line), swapped in afterwards. Design photo spots for them (you can use each more than once, but don't add spots that none of them fits). For every spot, use a designed placeholder card with data-placeholder="<photo name>" (one of the names below) and alt text starting “PLACEHOLDER:” followed by a real description of the photo, at the size the spot uses. No logo: use the business name as the wordmark.
  hero: a freshly mown, striped front lawn at golden hour (wide)
  edge: a freshly mown lawn with a crisp edge along a concrete driveway, a mower behind
  lilly: a tall, freshly squared lilly pilly hedge with clippings on a tarp
  cleanup: a weeded garden bed with fresh mulch going down and a wheelbarrow
  turf: rolls of new turf being laid on levelled soil, half the lawn already down
  hedge: a dense green clipped hedge
  mulch: a freshly mulched garden bed with native grasses
  band: a freshly mown backyard lawn with mowing stripes and a clipped hedge (wide)
  frontgarden: a front garden with a mown lawn, crisp edges and a curved bed of agapanthus
  buxus: round clipped shrubs and a low hedge along a brick path
  newlawn: an even green backyard lawn along a timber fence
  ute: a white ute towing a small cage trailer of garden waste on a leafy street

Design direction (adapt to the trade):
Choose a visual style that suits the trade and its customers. Before writing code, state the palette, fonts, and mood you chose and why. Examples of how this can vary:

* Trades with a rugged, outdoor feel (landscaping, fencing, concreting): earthy greens or sandstone, serif headings, large photography, organic shapes.
* Technical or urgent trades (plumbing, electrical, HVAC): navy or steel blue, white, a bright safety accent, bold sans-serif headings, strong contrast, clear emergency banners.
* Premium or detail-led trades (joinery, painting, tiling, interior work): charcoal, warm neutrals, refined typography, more whitespace, portfolio-led layout.
* Heavy or structural trades (builders, roofers, excavation): dark slate or charcoal with a bold yellow or orange accent, strong grid layouts, big stat blocks.
* Client-facing or lifestyle trades (cleaning, pool care, gardening services): fresh, light palettes, rounded corners, friendly icons.

Vary layout, not just colour: hero style, card style, and section order should suit the trade.
Pages:

1. Home: Hero with a photo that relates to the business, headline, short supporting line, “Get a Free Quote” and “Call 0491 570 158” buttons. Trust bar (licensed, insured, years, rating). Three service highlights. One short testimonial. Final call-to-action banner.
2. Services: A card for each service with a one-line benefit and a link to the quote page. 
3. Projects: Photo gallery of placeholder images with captions and suburb names: one or two before-and-after pairs, the rest single photos.
4. About: Short story, why choose us (three points, only from the business details above), and how it works (only steps the business details support).
5. Service Areas: One page listing every suburb and town served, with a short line about each main one. No separate page per suburb (near-identical suburb pages count as spam to Google).
6. Get a Quote: Form with name, phone, email, suburb, service dropdown, preferred contact time, and message. Reassurance line: “No obligation. Reply within 24 hours.” Friendly validation and a success message. The form sends through Web3Forms (free) to the business email, using an access-key placeholder; show the success message only once it has actually sent, and an error with the phone number if it fails.
7. Privacy: A short privacy page explaining what the quote form collects and why, marked “Draft, needs review”.
8. Terms: A short website terms page, marked “Draft, needs review”.

Don’t repeat the home page on other pages: Home gives a short taste and links out, and each other page says it in its own words with its own photos.

Footer on every page: business name, phone, email, licence number and the name on the licence, and ABN.

SEO requirements:

* Unique title tag (under 60 characters) and meta description (under 155 characters) on every page, with the primary keyword and town included naturally
* One H1 per page, logical H2/H3 hierarchy, and keywords in headings where they read naturally
* Clean, descriptive URLs (e.g. /services/blocked-drains.html)
* LocalBusiness schema (JSON-LD) on the home page with name, address, phone, service area and opening hours; Service schema on service pages. Add the rating (aggregateRating) only when a real Google rating is given in the business details, never a placeholder
* Open Graph and Twitter card tags on every page
* Canonical tags, a sitemap.xml, and a robots.txt file
* Descriptive alt text on every image, and compressed images with width and height set to avoid layout shift
* Internal links between related services, areas, and the quote page
* Semantic HTML (header, nav, main, section, footer) and a fast-loading page with no unnecessary scripts
* Google Business Profile reminder in the final notes

Conversion requirements:

* Phone number in the header on every page, click-to-call on mobile
* Sticky “Call” and “Quote” bar on mobile
* One clear primary button per section

Accessibility and performance:

* Subtle scroll animations that respect prefers-reduced-motion, and everything still shows if an animation never runs (reveal it all after 2 seconds anyway)
* Contrast of at least 4.5:1, labelled inputs, visible focus states
* Lighthouse target of 90+ for performance, accessibility, SEO, and best practices

Placeholders:

* Mark every placeholder the same way so none can slip through: text as `[PLACEHOLDER: what goes here]`, images with `data-placeholder` and alt text starting “PLACEHOLDER:”. This includes proof points, promises (like the 24-hour reply, upfront pricing or a warranty), testimonials and photos that the business details don't give. Use real details from above wherever they're given, and Google reviews word for word with the reviewer's first name and “Google review”.
* In the final notes, list every placeholder left and where it is. The site doesn't go live until a search for `PLACEHOLDER` finds nothing; each one is swapped for the client's real answer from the form, or taken out.

Output: One folder with separate HTML pages, a shared stylesheet and script, sitemap.xml, and robots.txt. Use clearly marked placeholder text and images so I can swap in real content.
