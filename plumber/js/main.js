/* Ironbark Plumbing Co. demo site: shared script */
(function () {
  'use strict';

  // DEMO flag: while true, the quote form never sends. Set to false on the
  // real site once the Web3Forms access key is in quote.html.
  var DEMO = true;
  var PHONE = '0491 570 156';
  var TEL = 'tel:+61491570156';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); toggle.focus();
      }
    });
  }

  // Reveal on scroll, with a 2 second "show everything anyway" fallback
  var items = document.querySelectorAll('[data-reveal]');
  function showAll() { items.forEach(function (el) { el.classList.add('in'); }); }
  if (reduce || !('IntersectionObserver' in window)) { showAll(); }
  else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
    setTimeout(showAll, 2000);
  }

  // Before / after slider
  document.querySelectorAll('.ba input[type="range"]').forEach(function (r) {
    var set = function () { r.parentNode.style.setProperty('--pos', r.value + '%'); };
    r.addEventListener('input', set); set();
  });

  // Pipe line that fills down the "how it works" steps
  var proc = document.querySelector('.process');
  if (proc && !reduce) {
    var ticking = false;
    var update = function () {
      var r = proc.getBoundingClientRect(), vh = window.innerHeight;
      var p = (vh * 0.7 - r.top) / r.height;
      proc.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
      ticking = false;
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // Quote form
  var form = document.getElementById('quote-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var select = document.getElementById('f-service');

  // Preselect a service from ?service=slug
  var m = /[?&]service=([a-z-]+)/.exec(location.search);
  if (m && select) {
    Array.prototype.forEach.call(select.options, function (o) { if (o.dataset.slug === m[1]) select.value = o.value; });
  }

  var rules = {
    name: function (v) { return v.trim().length >= 2 ? '' : 'Please tell us your name.'; },
    phone: function (v) { return v.replace(/[^\d]/g, '').length >= 8 ? '' : 'Please add a phone number we can call you on.'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'That email does not look quite right. Can you check it?'; },
    suburb: function (v) { return v.trim().length >= 2 ? '' : 'Which suburb is the job in?'; },
    service: function (v) { return v ? '' : 'Pick the closest service. "Something else" is fine too.'; },
    message: function (v) { return v.trim().length >= 5 ? '' : 'A few words about the problem helps us give you a price.'; }
  };

  function check(field) {
    var rule = rules[field.name];
    if (!rule) return true;
    var msg = rule(field.value);
    var err = document.getElementById('e-' + field.name);
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) { err.textContent = msg; if (msg) field.setAttribute('aria-describedby', err.id); else field.removeAttribute('aria-describedby'); }
    return !msg;
  }

  Object.keys(rules).forEach(function (n) {
    var f = form.elements[n];
    if (!f) return;
    f.addEventListener('blur', function () { if (f.value) check(f); });
    f.addEventListener('input', function () { if (f.getAttribute('aria-invalid') === 'true') check(f); });
  });

  function show(cls, html) {
    status.className = 'form-status ' + cls;
    status.innerHTML = html;
    status.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstBad = null;
    Object.keys(rules).forEach(function (n) {
      var f = form.elements[n];
      if (f && !check(f) && !firstBad) firstBad = f;
    });
    if (firstBad) { firstBad.focus(); return; }

    if (DEMO) {
      show('demo', '<strong>Thanks! Nearly there.</strong>This is a demo, so the form doesn\'t send. On a real site this goes straight to the tradie\'s email.');
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    var label = btn.textContent;
    btn.disabled = true; btn.textContent = 'Sending...';
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    }).then(function (res) { return res.json().then(function (j) { return { ok: res.ok && j.success, j: j }; }); })
      .then(function (r) {
        if (!r.ok) throw new Error('send failed');
        form.reset();
        show('ok', '<strong>Thanks, your request is in.</strong>We will be in touch soon to confirm a price. Urgent? Call <a href="' + TEL + '">' + PHONE + '</a>.');
      })
      .catch(function () {
        show('fail', '<strong>Sorry, that did not send.</strong>Please try again, or call us on <a href="' + TEL + '">' + PHONE + '</a> and we will sort it out over the phone.');
      })
      .finally(function () { btn.disabled = false; btn.textContent = label; });
  });
})();
