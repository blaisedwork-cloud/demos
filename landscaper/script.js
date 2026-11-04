/* Greenline Garden Care: shared script (no libraries) */
(function () {
  'use strict';

  // ---------------------------------------------------------------
  // DEMO FLAG: true on the demo site, so the quote form never sends.
  // On a real site set DEMO = false and put the Web3Forms access key
  // in the hidden "access_key" field on quote.html.
  // ---------------------------------------------------------------
  var DEMO = true;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile menu
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Open menu');
        btn.focus();
      }
    });
  }

  // Hero headline word reveal
  if (!reduce) {
    document.querySelectorAll('.split').forEach(function (h) {
      var words = h.textContent.trim().split(/\s+/);
      h.setAttribute('aria-label', h.textContent.trim().replace(/\s+/g, ' '));
      h.innerHTML = words.map(function (w, i) {
        return '<span class="w" aria-hidden="true"><span style="--i:' + i + '">' + w + '</span></span>';
      }).join(' ');
    });
  }

  // Scroll reveal: hidden only while the watcher runs; everything shows if it never fires, with reduced motion, or when printing
  var items = document.querySelectorAll('[data-reveal]');
  function showAll() { items.forEach(function (el) { el.classList.add('in'); }); }
  if (reduce || !('IntersectionObserver' in window)) {
    showAll();
  } else {

    var fired = false;
    document.documentElement.classList.add('reveal-on');
    setTimeout(function () { if (!fired) showAll(); }, 2500); // the watcher never ran: show everything
    window.addEventListener('beforeprint', function () { showAll(); });
    var io = new IntersectionObserver(function (entries) {
      fired = true;
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  // Before / after sliders
  document.querySelectorAll('.ba input[type="range"]').forEach(function (r) {
    var set = function () { r.parentNode.style.setProperty('--pos', r.value + '%'); };
    r.addEventListener('input', set);
    set();
  });

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Quote form
  var form = document.getElementById('quote-form');
  if (!form) return;

  // Preselect a service from ?service=
  var sel = form.querySelector('#service');
  var want = new URLSearchParams(location.search).get('service');
  if (sel && want) {
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].dataset.key === want) { sel.selectedIndex = i; break; }
    }
  }

  var msg = document.getElementById('form-msg');
  var submit = form.querySelector('button[type="submit"]');
  var rules = {
    name: function (v) { return v.trim().length >= 2 || 'Please pop your name in so we know who to ask for.'; },
    phone: function (v) {
      var d = v.replace(/[^\d+]/g, '');
      return /^(\+?61|0)\d{9}$/.test(d) || 'That number looks a bit short. Try a mobile like 0491 570 158.';
    },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please check your email address, something looks off.'; },
    suburb: function (v) { return v.trim().length >= 2 || 'Which suburb is the garden in?'; },
    service: function (v) { return v !== '' || 'Pick the service that fits best (or "Not sure").'; }
  };

  function check(field) {
    var rule = rules[field.name];
    if (!rule) return true;
    var res = rule(field.value);
    var wrap = field.closest('.field');
    var err = wrap.querySelector('.err');
    if (res === true) {
      wrap.classList.remove('invalid');
      field.removeAttribute('aria-invalid');
      return true;
    }
    wrap.classList.add('invalid');
    field.setAttribute('aria-invalid', 'true');
    err.textContent = res;
    return false;
  }

  Object.keys(rules).forEach(function (n) {
    var f = form.elements[n];
    if (!f) return;
    f.addEventListener('blur', function () { if (f.value) check(f); });
    f.addEventListener('input', function () { if (f.closest('.field').classList.contains('invalid')) check(f); });
  });

  function show(type, title, text) {
    msg.className = 'form-msg show ' + type;
    msg.innerHTML = '<b>' + title + '</b>' + text;
    msg.focus();
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
      show('demo', 'Thanks! Nothing was sent.', "This is a demo, so the form doesn't send. On a real site this goes straight to the tradie's email.");
      return;
    }

    // Real sending through Web3Forms (runs only when DEMO is false)
    submit.disabled = true;
    var label = submit.textContent;
    submit.textContent = 'Sending...';
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok && res.j.success) {
          form.reset();
          show('ok', 'Thanks, your quote request is in.', "We've got your details and we'll be in touch soon.");
        } else { throw new Error('send failed'); }
      })
      .catch(function () {
        show('bad', "Sorry, that didn't go through.", 'Please try again, or give us a call on <a href="tel:+61491570158">0491 570 158</a>.');
      })
      .finally(function () { submit.disabled = false; submit.textContent = label; });
  });
})();
