/* ---------- page basics: no dependencies, runs before the 3D loads ---------- */
(() => {
  const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const D = JSON.parse($('#site-data').textContent);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = v => Math.min(1, Math.max(0, v));
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  document.documentElement.classList.add('js');

  // headline word reveal (the real text stays in an sr-only copy)
  $$('.split').forEach(h => {
    const text = h.textContent.trim();
    h.textContent = '';
    const sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = text;
    const vis = document.createElement('span'); vis.setAttribute('aria-hidden', 'true');
    text.split(/\s+/).forEach((w, i) => { const o = document.createElement('span'), n = document.createElement('span'); o.className = 'w'; n.style.setProperty('--i', i); n.textContent = w; o.append(n); vis.append(o, ' '); });
    h.append(sr, vis);
  });

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('[data-reveal]').forEach(el => io.observe(el));

  const head = $('#head');
  const onScroll = () => head.classList.toggle('scrolled', scrollY > 12);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // live opening status in the business's own time zone
  if (D.hours) {
    const fmtParts = new Intl.DateTimeFormat('en-AU', { timeZone: D.tz, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    const fmtTime = new Intl.DateTimeFormat('en-AU', { timeZone: D.tz, hour: 'numeric', minute: '2-digit' });
    const mins = s => { const [h, m] = s.split(':').map(Number); return h * 60 + (m || 0); };
    // hours: one range for listed days, or a per-day schedule { "1": ["07:00", "17:00"], "6": ["08:00", "12:00"] }
    const sched = D.hours.schedule || Object.fromEntries((D.hours.days || [1, 2, 3, 4, 5]).map(d => [d, [D.hours.open, D.hours.close]]));
    const nextOpen = Object.values(sched)[0]?.[0] || D.hours.open || '07:00';
    const status = () => {
      const p = Object.fromEntries(fmtParts.formatToParts(new Date()).map(x => [x.type, x.value]));
      const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday), m = (+p.hour % 24) * 60 + +p.minute;
      const today = sched[day], open = !!today && m >= mins(today[0]) && m < mins(today[1]);
      const t = fmtTime.format(new Date()).replace(/\s/g, '').toLowerCase();
        $$('[data-open-dot]').forEach(d => d.classList.toggle('open', open));
      $$('[data-status]').forEach(s => s.textContent = open ? `Open now · ${t} in ${D.place}` : (D.emergency ? `${D.emergency} · ${t}` : `Closed · ${t} · back ${nextOpen.replace(/^0/, '')}`));
      $$('[data-status-plain]').forEach(s => s.textContent = open ? `We're on the tools now (${t}).` : `Closed right now (${t}).`);
    };
    status(); setInterval(status, 30000);
  }

  // count-up stats: the final value is already in the HTML
  const counters = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; counters.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, dec = (el.dataset.count.split('.')[1] || '').length, fmt = n => n.toLocaleString('en-AU', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    if (reduce) return;
    const t0 = performance.now();
    const tick = now => { const k = Math.min(1, (now - t0) / 1600); el.textContent = fmt(end * (1 - (1 - k) ** 3)); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }), { threshold: .5 });
  $$('[data-count]').forEach(el => counters.observe(el));

  // step progress: meters and the photo build-up follow each card toward the middle of the screen
  const cards = $$('.step-card');
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = innerHeight, line = vh * (innerWidth <= 820 ? .62 : .5);
    for (const c of cards) {
      const r = c.getBoundingClientRect(), p = clamp(1 - (r.top + r.height / 2 - line) / vh);
      c.style.setProperty('--p', p.toFixed(3));
      c.style.setProperty('--q', (reduce ? (p >= .5 ? 1 : 0) : smooth(.3, .8, p)).toFixed(3));
    }
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update); update();

  // inlined media (single-file builds) is stored once in #media and referenced as "m:N"
  const store = $('#media') ? JSON.parse($('#media').textContent) : [], blobs = {};
  const mediaUrl = s => {
    if (!s?.startsWith('m:')) return s;
    if (!blobs[s]) { const [h, b64] = store[+s.slice(2)].split(','), bin = atob(b64), a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); blobs[s] = URL.createObjectURL(new Blob([a], { type: h.slice(5, h.indexOf(';')) })); }
    return blobs[s];
  };
  $$('video[data-film]').forEach(v => { v.src = mediaUrl(v.dataset.film); });
  // silent clips load and play only while on screen; with reduced motion they wait for a tap
  const clips = $$('video[data-src]');
  const load = v => { if (!v.src) v.src = mediaUrl(v.dataset.src); };
  if (reduce) clips.forEach(v => { v.controls = true; load(v); });
  else { const vo = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting) { load(v); v.play().catch(() => {}); } else v.pause(); }), { threshold: .25 }); clips.forEach(v => vo.observe(v)); }

  // before/after: drag or arrow keys; tabs switch jobs
  const ba = $('.ba');
  if (ba) {
    const range = $('input', ba), data = JSON.parse($('#ba-data').textContent), cap = $('[data-ba-cap]');
    range.addEventListener('input', () => ba.style.setProperty('--pos', range.value + '%'));
    $$('[data-ba]').forEach(t => t.addEventListener('click', () => {
      const d = data[+t.dataset.ba];
      $$('[data-ba]').forEach(x => x.setAttribute('aria-selected', x === t));
      Object.assign($('.ba-before', ba), { src: d.b, alt: d.bAlt }); Object.assign($('.ba-after', ba), { src: d.a, alt: d.aAlt });
      if (cap) cap.textContent = d.cap;
      range.value = 50; ba.style.setProperty('--pos', '50%');
    }));
  }

  // gallery: filters, show all, and a lightbox through the photos currently shown
  const jobs = $$('.job'), lb = $('.lb');
  const shown = () => jobs.filter(j => !j.hidden && (!j.classList.contains('more') || j.classList.contains('shown')));
  $$('.chips button').forEach(b => b.addEventListener('click', () => {
    $$('.chips button').forEach(x => x.setAttribute('aria-pressed', x === b));
    const tag = b.dataset.tag;
    jobs.forEach(j => { j.hidden = !!tag && !j.dataset.tags.split('|').includes(tag); if (tag) j.classList.add('shown'); });
  }));
  $('.showmore')?.addEventListener('click', e => { jobs.forEach(j => j.classList.add('shown')); e.target.parentElement.remove(); });
  if (lb) {
    let cur = null;
    const show = j => { cur = j; const list = shown(); let img = $('img', lb); if (!img) { img = document.createElement('img'); $('p', lb).before(img); } img.src = j.dataset.full; img.alt = $('img', j).alt || $('span', j).textContent; $('p', lb).textContent = `${$('span', j).textContent} (${list.indexOf(j) + 1} of ${list.length})`; };
    const step = d => { const list = shown(); show(list[(list.indexOf(cur) + d + list.length) % list.length]); };
    jobs.forEach(j => j.addEventListener('click', () => { show(j); lb.showModal(); }));
    $$('[data-lb]', lb).forEach(b => b.addEventListener('click', () => { const d = +b.dataset.lb; d ? step(d) : lb.close(); }));
    lb.addEventListener('keydown', e => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });
    lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
    lb.addEventListener('close', () => cur?.focus());
  }

  // YouTube loads only when asked
  $$('.yt').forEach(b => b.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(b.dataset.yt)}?autoplay=1&rel=0`;
    f.title = b.getAttribute('aria-label').replace(/^Play video: /, '');
    f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen = true;
    f.style.cssText = 'width:100%;aspect-ratio:16/9;border:0;border-radius:var(--r);display:block';
    b.replaceWith(f);
  }));

  // quote form: visible labels, inline errors, clear success state
  const form = $('form.qf');
  // contact.html?job=Switchboard%20upgrades → that job is already chosen (multi-page sites)
  const jobPick = new URLSearchParams(location.search).get('job'), jobSel = form && $('select[name=job]', form);
  if (jobPick && jobSel) [...jobSel.options].forEach(o => { if (o.text === jobPick) o.selected = true; });
  const done = () => {
    $('[data-done-name]', form).textContent = $('[name=name]', form).value.trim().split(/\s+/)[0];
    $('[data-done-phone]', form).textContent = $('[name=phone]', form).value.trim();
    form.classList.add('sent'); $('.qf-done', form).focus();
  };
  form?.addEventListener('submit', e => {
    let firstBad = null;
    $$('.field', form).forEach(f => {
      const input = $('input:not([type=radio]),textarea,select', f), err = $('.err', f);
      if (!input || !input.required) return;   // optional boxes and choice chips need no message
      let msg = '';
      if (!input.value.trim()) msg = input.dataset.msg;
      else if (input.type === 'tel' && input.value.replace(/\D/g, '').length < 8) msg = 'That number looks short. Please check it.';
      f.classList.toggle('bad', !!msg); err.textContent = msg; input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg && !firstBad) firstBad = input;
    });
    if (firstBad) { e.preventDefault(); firstBad.focus(); return; }
    if (form.getAttribute('action') && !form.hasAttribute('data-ajax')) return;       // a real endpoint: let it submit
    e.preventDefault();
    if (!form.hasAttribute('data-ajax')) return done();
    // Web3Forms (multi-page sites): send without leaving the page; on failure, say so and give the number
    const btn = $('button[type=submit]', form), bad = $('.qf-error', form);
    btn.disabled = true; bad.textContent = '';
    fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
      .then(r => r.json()).then(d => { if (!d?.success) throw new Error(); done(); })
      .catch(() => { bad.textContent = `Sorry, that didn't send. Please call or text ${D.phone || 'us'} instead.`; })
      .finally(() => { btn.disabled = false; });
  });
})();
