You are a fresh design session. Build one website from the brief below, as well as you possibly can.

Where to work: create the folder fresh-builds/electrician/site/ and put the whole site in it. Do NOT open, read, list or copy anything else in this repository (the files at the top level are older sites we don't want you to be influenced by). Design from scratch.

This is a DEMO for a web designer who sells websites to Australian tradies: it shows tradies what their site could look like. So, on top of the brief:
- A slim, friendly banner at the top of every page: "Demo site: Tallowwood Electrical is a made-up business, built to show what a tradie website can look like." (fill in the name). Its phone number is an ACMA fictional number; keep it.
- The quote form must never send on the demo: on submit, show a friendly message "This is a demo, so the form doesn't send. On a real site this goes straight to the tradie's email." Leave the Web3Forms code in place, switched off by a clear DEMO flag.
- Footer: one line "Photos on this demo site are AI-made." and a link back to https://blaisedwork-cloud.github.io/demos/ ("More sample sites").
- Meta robots noindex on every page (it's a demo). Canonical and Open Graph URLs use https://blaisedwork-cloud.github.io/demos/electrician/ as the base.
- Australian English. No em dashes in visible text.

When you're finished: run a quick check yourself (every page opens, links work, no console errors, it looks great at 390px wide and on desktop). Then git add fresh-builds/electrician, commit, and push to the branch you're on. Your final message: the palette, fonts and mood you chose, the page list, and every placeholder left (where and what).

---- THE BRIEF ----

Build a multi-page, SEO-optimised website for an electrician business in Penrith, NSW, Australia. Use clean HTML, CSS, and vanilla JavaScript with a shared header and footer on every page. The site should be premium, mobile-first, and built to turn visitors into quote requests and emergency call-outs.

Business details:

* Name: Tallowwood Electrical (a fictional business for a demo: label the site as a demo)
* Phone: 0491 570 157 | Email: jobs@example.com
* Service area: Penrith, St Marys, Kingswood, Emu Plains, Glenmore Park and surrounds
* Services: Switchboard upgrades (Quote on inspection): Replacing old ceramic-fuse switchboards with modern boards and safety switches.; Safety switch installation (From $250); Lighting and downlights: New lighting, LED downlight swaps and outdoor lights.; Power points (From $150): Extra power points and USB outlets inside or outside.; Fault finding: Tracking down tripping safety switches and dead circuits.. Prices include GST. Hours: Mon–Fri 7am–4pm, Saturday By appointment, Sunday Closed. Emergency call-outs for power loss and electrical hazards. Other facts from the client: Do you charge a call-out fee? Yes, our call-out fee is $110 including GST, which covers travel and the first 20 minutes. My safety switch keeps tripping. What should I do? Unplug appliances on that circuit and try resetting it. If it still trips, call us. Don't keep resetting it or open the switchboard yourself. Do you do commercial work? No, we only do residential work. How do I pay? Card or bank transfer on completion. We send the invoice by email. Do you install EV chargers? Not at the moment. We can recommend someone who does.
* Proof points: Owner on every job, Residential specialists, We explain before we fix
* Licence and ABN: this is a made-up business, so it has none. Never invent a licence number or an ABN. In the footer, where they go, write: “Licence number and ABN shown here on a real site (this is a demo)”. GST registered: yes (all prices include GST)
* Google reviews: none (it's a made-up business). Never write fake reviews: where a testimonial would go, put a short designed note: “Your real Google reviews go here, word for word.”
* Primary keyword: electrician Penrith
* Secondary keywords: switchboard upgrades Penrith, safety switch installation Penrith, lighting and downlights Penrith
* About them, in their own words: Owner-operated by a local sparky. We do residential work only, mostly older homes in the Penrith area. We always clean up and we explain what we found before we fix it.
* Brand colours (from their logo or van): #1f2933, #ffc400. Build the palette around these.
* Photos: this demo has these photos (made with AI for the demo; the footer says so in one line), swapped in afterwards. Design photo spots for them (you can use each more than once, but don't add spots that none of them fits). For every spot, use a designed placeholder card with data-placeholder="<photo name>" (one of the names below) and alt text starting “PLACEHOLDER:” followed by a real description of the photo, at the size the spot uses. No logo: use the business name as the wordmark.
  hero: a brick home at dusk with warm light in every window (wide)
  oldboard: an old fuse board in a rusted meter box
  newboard: safety switches going onto a new switchboard
  testercard: an electrician testing circuits in a switchboard with a clamp meter
  rcd: a row of safety switches and circuit breakers in a switchboard
  rcdcard: a neat row of safety switches in a home switchboard
  band: close-up of a residential switchboard with rows of circuit breakers (wide)
  roomnight: a dining room at night with pendant lights on
  lights: a living room at dusk lit by warm LED downlights
  outdoor: an outdoor wall light and a garden path at dusk (wide)
  ute: a white work ute with a canopy and ladder rack outside a brick home
  street: a quiet suburban street of brick homes at golden hour (wide)

Design direction (adapt to the trade):
Choose a visual style that suits the trade and its customers. Before writing code, state the palette, fonts, and mood you chose and why. Examples of how this can vary:

* Trades with a rugged, outdoor feel (landscaping, fencing, concreting): earthy greens or sandstone, serif headings, large photography, organic shapes.
* Technical or urgent trades (plumbing, electrical, HVAC): navy or steel blue, white, a bright safety accent, bold sans-serif headings, strong contrast, clear emergency banners.
* Premium or detail-led trades (joinery, painting, tiling, interior work): charcoal, warm neutrals, refined typography, more whitespace, portfolio-led layout.
* Heavy or structural trades (builders, roofers, excavation): dark slate or charcoal with a bold yellow or orange accent, strong grid layouts, big stat blocks.
* Client-facing or lifestyle trades (cleaning, pool care, gardening services): fresh, light palettes, rounded corners, friendly icons.

Vary layout, not just colour: hero style, card style, and section order should suit the trade.
Pages:

1. Home: Hero with a photo that relates to the business, headline, short supporting line, “Get a Free Quote” and “Call 0491 570 157” buttons. Trust bar (licensed, insured, years, rating). Three service highlights. One short testimonial. Final call-to-action banner.
2. Services: A card for each service with a one-line benefit and a link to the quote page. Flag urgent or emergency services clearly.
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
