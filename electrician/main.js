/* Tallowwood Electrical: shared script (no libraries) */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile nav */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  if (toggle && header) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('nav-open')) {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* Hero headline word reveal */
  if (!reduce) {
    document.querySelectorAll('.split').forEach(function (h) {
      var html = h.innerHTML.trim();
      var i = 0;
      h.setAttribute('aria-label', h.textContent.trim().replace(/\s+/g, ' '));
      // keep <em> wrappers: split on words but preserve emphasis markup
      var tmp = document.createElement('div');
      tmp.innerHTML = html;
      var out = [];
      tmp.childNodes.forEach(function (node) {
        var isEm = node.nodeType === 1;
        var text = node.textContent;
        text.split(/\s+/).filter(Boolean).forEach(function (w) {
          var inner = isEm ? '<em>' + w + '</em>' : w;
          out.push('<span class="w" aria-hidden="true"><span style="--i:' + (i++) + '">' + inner + '</span></span>');
        });
      });
      h.innerHTML = out.join(' ');
    });
  }

  /* Reveal on scroll: hidden only while the watcher runs; everything shows if it never fires, with reduced motion, or when printing */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {

    var fired = false;
    document.documentElement.classList.add('reveal-on');
    setTimeout(function () { if (!fired) root.classList.add('reveal-all'); }, 2500); // the watcher never ran: show everything
    window.addEventListener('beforeprint', function () { root.classList.add('reveal-all'); });
    var io = new IntersectionObserver(function (entries) {
      fired = true;
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* Before / after slider */
  document.querySelectorAll('.ba input[type=range]').forEach(function (r) {
    var set = function () { r.parentNode.style.setProperty('--pos', r.value + '%'); };
    r.addEventListener('input', set);
    set();
  });

  /* Quote form */
  var form = document.getElementById('quote-form');
  if (form) {
    // DEMO flag: while true, the form never sends. Set to false on the real site
    // (and put the real Web3Forms access key in the hidden access_key field).
    var DEMO = true;
    var ENDPOINT = 'https://api.web3forms.com/submit';
    var status = document.getElementById('form-status');
    var btn = form.querySelector('button[type=submit]');
    var btnText = btn ? btn.innerHTML : '';

    // Pre-select a service from ?service=
    var params = new URLSearchParams(location.search);
    var svc = params.get('service');
    var sel = form.querySelector('#service');
    if (svc && sel) {
      Array.prototype.forEach.call(sel.options, function (o) { if (o.dataset.key === svc) sel.value = o.value; });
    }

    var rules = {
      name: function (v) { return v.trim().length >= 2 ? '' : 'Please tell us your name.'; },
      phone: function (v) { var d = v.replace(/[^\d]/g, ''); return d.length >= 8 && d.length <= 12 ? '' : 'Please add a phone number we can call, like 0400 000 000.'; },
      email: function (v) { return !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'That email doesn’t look quite right. Leave it blank if you prefer a call.'; },
      suburb: function (v) { return v.trim().length >= 2 ? '' : 'Which suburb is the job in?'; },
      service: function (v) { return v ? '' : 'Pick the closest service (or “Something else”).'; }
    };

    function check(field) {
      var rule = rules[field.name];
      if (!rule) return true;
      var msg = rule(field.value);
      var wrap = field.closest('.field');
      var err = wrap && wrap.querySelector('.err');
      if (wrap) wrap.classList.toggle('invalid', !!msg);
      if (err) err.textContent = msg;
      field.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    }

    Object.keys(rules).forEach(function (name) {
      var f = form.elements[name];
      if (!f) return;
      f.addEventListener('blur', function () { if (f.value) check(f); });
      f.addEventListener('input', function () { if (f.closest('.field').classList.contains('invalid')) check(f); });
    });

    function show(kind, html) {
      status.className = 'form-status show ' + kind;
      status.innerHTML = html;
      status.setAttribute('tabindex', '-1');
      status.focus({ preventScroll: true });
      status.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      Object.keys(rules).forEach(function (name) {
        var f = form.elements[name];
        if (f && !check(f) && !firstBad) firstBad = f;
      });
      if (firstBad) { firstBad.focus(); return; }

      if (DEMO) {
        show('demo', '<strong>Thanks! Nothing was sent.</strong>This is a demo, so the form doesn’t send. On a real site this goes straight to the tradie’s email.');
        return;
      }

      if (form.elements.botcheck && form.elements.botcheck.checked) return;
      btn.disabled = true;
      btn.innerHTML = 'Sending…';
      var data = Object.fromEntries(new FormData(form));
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok && j.success, j: j }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error('send failed');
          form.reset();
          show('success', '<strong>Got it, thanks!</strong>Your request is on its way. We’ll be in touch soon. Urgent? Call <a href="tel:+61491570157">0491 570 157</a>.');
        })
        .catch(function () {
          show('error', '<strong>Sorry, that didn’t send.</strong>Please try again, or call us on <a href="tel:+61491570157">0491 570 157</a>.');
        })
        .then(function () { btn.disabled = false; btn.innerHTML = btnText; });
    });
  }
})();
