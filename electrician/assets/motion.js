// Motion for art-direction sites. Content is fully visible without this file (styles only hide or
// move things once <html> has the "js" class, which this script adds), and nothing runs when the
// visitor has asked their device to reduce motion.
//
// Scroll-linked, not one-shot: every effect is worked out from where things sit on screen right now,
// so scrolling back up plays it in reverse. Each frame we only read positions, then only write CSS
// variables, and CSS turns those into transform/opacity (cheap on phones). Timings follow UI/UX Pro
// Max: reveals ease out over ~a fifth of the screen with a small stagger.
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  if (reduce) return;
  root.classList.add('js');

  // Hero headline rises in word by word on load (screen readers get the plain text via aria-label).
  var h = document.querySelector('.hero-dir h1');
  if (h) {
    var text = h.textContent.trim();
    h.setAttribute('aria-label', text);
    h.innerHTML = text.split(/\s+/).map(function (w, i) {
      return '<span class="w" aria-hidden="true"><span style="--i:' + i + '">' + w + '</span></span>';
    }).join(' ');
    h.classList.add('words');
  }

  var all = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };
  all('[data-reveal-group]').forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (el, i) { el.setAttribute('data-reveal', ''); el.style.setProperty('--i', i); });
  });

  var reveals = all('[data-reveal]').map(function (el) { return { el: el, i: +el.style.getPropertyValue('--i') || 0, cur: 0, tgt: 0 }; });
  // --p: whole pass through the screen; --f: focus (top at 75% of the screen until bottom at 55%)
  var scrubs = all('[data-scrub]').map(function (el) { return { el: el, p: 0, tp: 0, f: 0, tf: 0 }; });
  var lamps = all('[data-lamp]');      // get .on once their middle passes 62% of the screen height
  var heroEl = document.querySelector('[data-hero]');
  var hero = heroEl && { el: heroEl, cur: 0, tgt: 0 };
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
  var SHIFT = 24;
  // Smoothing: values glide towards where the scroll says they should be instead of jumping with
  // every wheel notch or finger flick. Bigger = softer. Still fully reversible.
  var TAU = 170;
  var running = false, last = 0, first = true;

  function measure() {
    var vh = window.innerHeight, y = window.scrollY || window.pageYOffset;
    var maxY = Math.max(0, document.documentElement.scrollHeight - vh);
    // Read everything first (positions without our own transform)…
    var rTops = reveals.map(function (r) { return r.el.getBoundingClientRect().top - (1 - r.cur) * SHIFT; });
    var sRects = scrubs.map(function (s) { return s.el.getBoundingClientRect(); });
    var lRects = lamps.map(function (el) { return el.getBoundingClientRect(); });
    var hRect = hero && hero.el.getBoundingClientRect();
    reveals.forEach(function (r, k) {
      // Starts fading in just below the screen and is fully shown once its top reaches ~86% of the
      // screen height (later items in a group a touch later): solid well before you read it, but
      // spread over a longer stretch so it doesn't snap. Capped at the bottom of the page.
      var end = Math.min(rTops[k] + y - vh * 0.86 + r.i * 24, maxY);
      r.tgt = end <= 0 ? 1 : easeOut(clamp((y - (end - vh * 0.26)) / (vh * 0.26)));
    });
    scrubs.forEach(function (s, k) {
      var b = sRects[k];
      s.tp = clamp((vh - b.top) / (vh + b.height));
      s.tf = clamp((vh * 0.75 - b.top) / (b.height + vh * 0.2));
    });
    // …then class changes (CSS transitions animate these).
    lamps.forEach(function (el, k) {
      var b = lRects[k];
      el.classList.toggle('on', b.top + b.height / 2 < vh * 0.62 || y >= maxY - 2);
    });
    if (hero) hero.tgt = clamp(-hRect.top / Math.max(1, hRect.height));
  }

  function step(now) {
    var dt = last ? Math.min(64, now - last) : 16; last = now;
    var k = first ? 1 : 1 - Math.exp(-dt / TAU); first = false;
    measure();
    var moving = false;
    var ease = function (cur, tgt) { var v = cur + (tgt - cur) * k; if (Math.abs(tgt - v) < 0.001) v = tgt; else moving = true; return v; };
    reveals.forEach(function (r) { r.cur = ease(r.cur, r.tgt); r.el.style.setProperty('--e', r.cur.toFixed(4)); });
    scrubs.forEach(function (s) {
      s.p = ease(s.p, s.tp); s.f = ease(s.f, s.tf);
      s.el.style.setProperty('--p', s.p.toFixed(4)); s.el.style.setProperty('--f', s.f.toFixed(4));
    });
    if (hero) { hero.cur = ease(hero.cur, hero.tgt); hero.el.style.setProperty('--h', hero.cur.toFixed(4)); }
    if (moving) requestAnimationFrame(step); else { running = false; last = 0; }
  }
  function request() { if (!running) { running = true; requestAnimationFrame(step); } }
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  window.addEventListener('load', request);
  request();
})();

// Pause / play for the moving services strip (WCAG 2.2.2: moving content needs a pause control).
(function () {
  var btn = document.querySelector('.marquee-toggle');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var paused = btn.getAttribute('aria-pressed') === 'true';
    btn.setAttribute('aria-pressed', paused ? 'false' : 'true');
    btn.textContent = paused ? 'Pause scrolling text' : 'Play scrolling text';
    document.querySelector('.marquee').classList.toggle('paused', !paused);
  });
})();
