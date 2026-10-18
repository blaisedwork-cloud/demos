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

  var reveals = all('[data-reveal]').map(function (el) { return { el: el, i: +el.style.getPropertyValue('--i') || 0, shift: 0 }; });
  var scrubs = all('[data-scrub]');   // get --p (whole pass through the screen) and --f (focus: top at 75% → bottom at 55%)
  var lamps = all('[data-lamp]');      // get .on once their middle passes 62% of the screen height
  var hero = document.querySelector('[data-hero]');
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
  var SHIFT = 32, queued = false;

  function frame() {
    queued = false;
    var vh = window.innerHeight, y = window.scrollY || window.pageYOffset;
    var maxY = Math.max(0, document.documentElement.scrollHeight - vh);
    // Read everything first…
    var rTops = reveals.map(function (r) { return r.el.getBoundingClientRect().top - r.shift; });
    var sRects = scrubs.map(function (el) { return el.getBoundingClientRect(); });
    var lRects = lamps.map(function (el) { return el.getBoundingClientRect(); });
    var hRect = hero && hero.getBoundingClientRect();
    // …then write.
    reveals.forEach(function (r, k) {
      // Fades in over the bottom slice of the screen and is fully shown once its top reaches ~86% of
      // the screen height (later items in a group a touch later), so text is solid well before you
      // read it. Capped at the bottom of the page so the last items always finish.
      var end = Math.min(rTops[k] + y - vh * 0.86 + r.i * 18, maxY);
      var e = end <= 0 ? 1 : easeOut(clamp((y - (end - vh * 0.14)) / (vh * 0.14)));
      r.shift = (1 - e) * SHIFT;
      r.el.style.setProperty('--e', e.toFixed(3));
    });
    scrubs.forEach(function (el, k) {
      var b = sRects[k];
      el.style.setProperty('--p', clamp((vh - b.top) / (vh + b.height)).toFixed(3));
      el.style.setProperty('--f', clamp((vh * 0.75 - b.top) / (b.height + vh * 0.2)).toFixed(3));
    });
    lamps.forEach(function (el, k) {
      var b = lRects[k];
      el.classList.toggle('on', b.top + b.height / 2 < vh * 0.62 || y >= maxY - 2);
    });
    if (hero) hero.style.setProperty('--h', clamp(-hRect.top / Math.max(1, hRect.height)).toFixed(3));
  }
  function request() { if (!queued) { queued = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  window.addEventListener('load', request);
  frame();
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
