// Motion for art-direction sites. Content is fully visible without this file (styles only hide
// things once <html> has the "js" class, which this script adds). Timings follow UI/UX Pro Max's
// motion presets: reveals 500ms ease-out with an 80ms stagger, hovers 150–250ms.
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  if (reduce) return;
  root.classList.add('js');

  // Hero headline rises in word by word (screen readers get the plain text via aria-label).
  var h = document.querySelector('.hero-dir h1');
  if (h) {
    var text = h.textContent.trim();
    h.setAttribute('aria-label', text);
    h.innerHTML = text.split(/\s+/).map(function (w, i) {
      return '<span class="w" aria-hidden="true"><span style="--i:' + i + '">' + w + '</span></span>';
    }).join(' ');
    h.classList.add('split');
  }

  // Reveal on scroll, staggered within each group.
  var groups = document.querySelectorAll('[data-reveal-group]');
  groups.forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (el, i) { el.setAttribute('data-reveal', ''); el.style.setProperty('--i', i); });
  });
  var items = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) { items.forEach(function (el) { el.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  items.forEach(function (el) { io.observe(el); });
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
