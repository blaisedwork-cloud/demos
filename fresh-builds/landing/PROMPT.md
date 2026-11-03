You are a fresh design session. Design and build one landing page, as well as you possibly can: it has to look like a top agency made it and, more than anything, get Australian tradies to pick up the phone.

Where to work: create the folder fresh-builds/landing/site/ and put everything in it (index.html, plus any CSS/JS/images you make; inline CSS/JS in index.html is fine). Do NOT open, read, list or copy anything else in this repository (the files at the top level are the old landing page and old sites we don't want you to be influenced by). Design from scratch.

## Who it's for
Owner-operator tradies in Australia (electricians first, then plumbers, landscapers, any trade), mostly 30–60, often reading on their phone in the ute between jobs, after a cold call or a text from the seller. Busy, sceptical of "web design" salespeople, been burned by agencies, lock-in contracts and SEO promises. Many get work by word of mouth and Facebook, and have no website or an old one. What they care about: more of the right jobs, looking as legit as the bigger firms, not wasting time, not being ripped off, no tech to learn.

## The one goal
Get them to **call or text Blaise** (or ask for the 15-minute video call by text). Every section should move them toward that. On phones: a sticky bottom bar with "Call Blaise" and "Text" that's always there.

## The seller and the offer (true facts only; use these, invent nothing)
- **Blaise Davis**, a local web builder in **Albury–Wodonga** (NSW/VIC border), building for tradies **Australia-wide**. Trading under his own name. ABN 16 593 428 787 (footer). Not registered for GST, so no GST is charged.
- Phone **0475 151 548** (tel:+61475151548, sms:+61475151548). Email blaisedwork@gmail.com.
- **Price: $990 all up.** **Nothing to pay until they've seen their site and they're happy with it** (no deposit). One invoice, then it goes live.
- **How it works:** (1) a **15-minute video call** (Google Meet): Blaise shares his screen and shows a site like theirs and what it costs; (2) a **5-minute form** on their phone, mostly tapping: jobs, suburbs, hours, licence, photos; (3) **a preview in about a week**, they check every word, **2 rounds of changes included**; (4) they say "approved", pay the $990, and it goes **live on their own web address, in their name** (a .com.au costs about $10 the first year, paid by them straight to the registrar; Blaise sets it up with them on a short call).
- **What they get:** a multi-page site made for their business: Home, Services, **its own page for each of their 3–4 main jobs**, About, the areas they cover, FAQ, and Contact with **a quote form that goes straight to their email**. **Tap-to-call on every page**, text, "save our number". **Their licence number and ABN** shown (many states require licence details in advertising). **Their own photos, their colours, their own words**, so it looks like their business, not a template. Their **Google reviews** quoted word for word (with their OK). Checked on phone, tablet and desktop, fast, with a privacy page and terms (drafts for them to check).
- **After it's live (optional):** a monthly plan where Blaise hosts it and makes their small changes: **Essentials $39/month** (1 small change a month) or **Standard $69/month** (3 a month), month to month, cancel any time by email. Or **no plan**: Blaise sets it up on their own free hosting so it runs without him. Later changes $90/hour, quoted first.
- **Not included and never promised:** Google rankings (SEO), ads, social media, logo design, photography. Never promise "more calls", "more leads", "page 1 of Google" or any number.
- **Sample sites** (made-up businesses, built to show what a site can look like; say so wherever they appear): **Tallowwood Electrical** (electrician, link `electrician/`), **Ironbark Plumbing Co.** (plumber, `plumber/`), **Greenline Garden Care** (garden care, `landscaper/`). For each, use a designed placeholder for a phone screenshot of that site: an element with `data-placeholder="shot-electrician"` (or `shot-plumber`, `shot-landscaper`) sized like a phone screen (about 390×844 ratio); the real screenshots go in afterwards.
- One true, sourced fact you may use: **3 in 4 Australians say they're more likely to trust an Australian business if its website ends in .au** (auDA). Credit the source in small text.
- **There are no client testimonials, logos, client counts or results yet. Never invent any.** Turn that into honesty, which tradies respect: he's new and local, these are his sample sites, and the risk is on him (nothing to pay until you're happy). A short, plain-spoken note from Blaise in first person works well here (no photo yet: use a simple designed monogram "BD", no fake headshot).

## What makes it convert (apply all of this)
- A hero that speaks to tradies in their words, with the offer and the risk reversal visible without scrolling on a phone: what it is, $990, "nothing to pay until you're happy", the primary CTA (Call or text Blaise) and a secondary "See a sample site". Show a sample site on a phone right in the hero.
- Make the visitor see themselves: let them pick their trade (electrician, plumber, garden care) and jump to the matching sample.
- Answer the objections they actually have, in plain words, in an FAQ: "I get enough work from word of mouth", "I've got a Facebook page", "What do I have to do?", "How long does it take?", "Who owns it?", "What if I don't like it?", "Are there ongoing costs?", "Will it get me to the top of Google?" (honest: no one can promise that; it gives you a proper, fast site with the basics Google looks for), "Why so cheap compared with agencies?" (honest: small and local, built for tradies, no account managers).
- A clear "What's included" and a simple price box. A short "how it works" in 4 steps. A final CTA band.
- Scannable: short sentences, big type, lots of contrast, plenty of tap targets, nothing that looks like corporate tech. Think building site, not startup. Looks premium and confident.
- Every CTA is a real link: tel:, sms: (with a prefilled body like "Hi Blaise, I'd like to see a website for my business"), mailto:, and a "save our number" link (make a small vCard file blaise-davis.vcf with his name, phone, email and "Websites for tradies").

## Technical
- One page, mobile-first, fast (Lighthouse 95+ on mobile), no frameworks, no external scripts, fonts self-hosted or a system stack (if you use web fonts, put the .woff2 files in the folder). Australian English. No em dashes in visible text.
- `<meta name="robots" content="noindex">` (for now), title, description, Open Graph and Twitter tags with og:image `https://blaisedwork-cloud.github.io/demos/share.jpg` and url `https://blaisedwork-cloud.github.io/demos/`. A favicon.
- Accessible: contrast 4.5:1, visible focus, labelled controls, works with reduced motion; subtle animation only, and everything shows even if an animation never runs.
- Mark anything you had to leave as `[PLACEHOLDER: …]` (text) or `data-placeholder` (images), and list them at the end.

When you're finished: check it yourself at 390px wide and on desktop (no horizontal scroll, all links valid, no console errors). Then git add fresh-builds/landing, commit, and push to the branch you're on. Your final message: the direction you chose and why, the section order, and every placeholder left.
