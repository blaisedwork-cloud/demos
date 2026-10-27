// Motion for art-direction sites. Content is fully visible without this file (styles only hide or
// move things once <html> has the "js" class, which this script adds), and nothing runs when the
// visitor has asked their device to reduce motion.
//
// Kept light for phones (rewritten 27 Oct after the owner found a test site laggy):
// - Reveals are one-shot: an IntersectionObserver adds .in once, and a CSS transition does the rest.
//   Nothing is measured or restyled on every scroll frame for them.
// - "Lamps" (service icons, process steps) light up through an IntersectionObserver too.
// - Only the scroll-linked effects (hero drift, photo bands, process line, showcase tiles) run in the
//   per-frame loop, and only while they are on screen. Each frame reads positions first, then writes
//   CSS variables that CSS turns into transform/opacity.
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  var root = document.documentElement;
  root.classList.add('js', 'motion'); // 'js' is normally set already by the inline script in <head>

  var all = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };

  // Hero headline rises in word by word on load (screen readers get the plain text via aria-label).
  var h = document.querySelector('.hero-dir h1');
  if (h) {
    var text = h.textContent.trim();
    h.setAttribute('aria-label', text);
    h.innerHTML = text.split(/\s+/).map(function (w, i) {
      return '<span class="w" aria-hidden="true"><span style="--i:' + i + '">' + w + '</span></span>';
    }).join(' ');
    h.classList.add('words');
    // Rise only once the heading font is in, so the words don't re-wrap mid-animation (max 700 ms wait).
    var go = function () { h.classList.add('go'); };
    if (document.fonts && document.fonts.ready) Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 700); })]).then(go);
    else go();
  }

  // Lazy photos fade in once loaded instead of popping in (a blank box flashed on fast scrolls).
  all('img[loading="lazy"]').forEach(function (img) {
    if (img.complete && img.naturalWidth) return;
    img.classList.add('pending');
    var done = function () { img.classList.remove('pending'); };
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  });

  all('[data-reveal-group]').forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (el, i) { el.setAttribute('data-reveal', ''); el.style.setProperty('--i', i); });
  });

  // One-shot reveals: fade and rise in the first time they come on screen.
  var revealIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } });
  }, { rootMargin: '0px 0px 12% 0px', threshold: 0 }); // starts just before it scrolls into view
  all('[data-reveal]').forEach(function (el) { revealIO.observe(el); });

  // Lamps: on once their middle passes 62% of the screen height (and stay on above it).
  var lamps = all('[data-lamp]');
  var lampIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) { var r = e.boundingClientRect; e.target.classList.toggle('on', r.top + r.height / 2 < window.innerHeight * 0.62); });
  }, { rootMargin: '0px 0px -38% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
  lamps.forEach(function (el) { lampIO.observe(el); });

  // Scroll-linked effects, only while visible.
  // --p: whole pass through the screen; --f: focus (top at 75% of the screen until bottom at 55%); --h: hero scrolled away
  var heroEl = document.querySelector('[data-hero]');
  var items = all('[data-scrub]').map(function (el) { return { el: el, p: 0, tp: 0, f: 0, tf: 0 }; });
  var hero = heroEl && { el: heroEl, cur: 0, tgt: 0, hero: true };
  if (hero) items.push(hero);
  var active = [];
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  // Smoothing: values glide towards where the scroll says they should be. Bigger = softer.
  var TAU = 140;
  var running = false, last = 0;

  function step(now) {
    var dt = last ? Math.min(64, now - last) : 16; last = now;
    var k = 1 - Math.exp(-dt / TAU);
    var vh = window.innerHeight, moving = false;
    var rects = active.map(function (s) { return s.el.getBoundingClientRect(); }); // all reads first…
    var ease = function (cur, tgt) { var v = cur + (tgt - cur) * k; if (Math.abs(tgt - v) < 0.002) v = tgt; else moving = true; return v; };
    active.forEach(function (s, i) {                                                  // …then writes
      var b = rects[i];
      if (s.hero) {
        s.tgt = clamp(-b.top / Math.max(1, b.height));
        s.cur = ease(s.cur, s.tgt); s.el.style.setProperty('--h', s.cur.toFixed(3));
        return;
      }
      s.tp = clamp((vh - b.top) / (vh + b.height));
      s.tf = clamp((vh * 0.75 - b.top) / (b.height + vh * 0.2));
      s.p = ease(s.p, s.tp); s.f = ease(s.f, s.tf);
      s.el.style.setProperty('--p', s.p.toFixed(3)); s.el.style.setProperty('--f', s.f.toFixed(3));
    });
    if (moving) requestAnimationFrame(step); else { running = false; last = 0; }
  }
  function request() { if (!running && active.length) { running = true; requestAnimationFrame(step); } }

  var visIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var s = items.filter(function (x) { return x.el === e.target; })[0];
      var at = active.indexOf(s);
      if (e.isIntersecting && at < 0) active.push(s);
      if (!e.isIntersecting && at >= 0) active.splice(at, 1);
    });
    request();
  }, { rootMargin: '10% 0px 10% 0px' });
  items.forEach(function (s) { visIO.observe(s.el); });

  // At the very bottom of the page, light any lamps that never reached the 62% line.
  function bottom() { if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) lamps.forEach(function (el) { el.classList.add('on'); }); }
  window.addEventListener('scroll', function () { request(); bottom(); }, { passive: true });
  window.addEventListener('resize', request);
  window.addEventListener('load', request);
})();
