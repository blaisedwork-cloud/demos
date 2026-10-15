// FAQ-mode assistant. Answers ONLY from the business's published content (embedded as JSON).
// No network calls, nothing stored. If unsure, it says so and gives contact details.
(function () {
  var root = document.querySelector('[data-chat]');
  var dataEl = document.getElementById('chat-data');
  if (!root || !dataEl) return;
  var data = JSON.parse(dataEl.textContent);
  var openers = document.querySelectorAll('[data-chat-open]');
  var lastOpener = null;
  var panel = root.querySelector('.chat-panel');
  var closeBtn = root.querySelector('.chat-close');
  var log = root.querySelector('.chat-log');
  var form = root.querySelector('.chat-form');
  var input = form.querySelector('input');
  var greeted = false;

  var STOP = ('a an and are at be can could do does for from have how i if in is it me my of on or our please the there this to we what when where which who will with would you your').split(' ');

  function words(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9$ ]+/g, ' ').split(/\s+/).filter(function (w) {
      return w && STOP.indexOf(w) === -1;
    }).map(function (w) { return w.length > 4 ? w.replace(/(ing|s)$/, '') : w; });
  }

  function unique(arr) {
    return arr.filter(function (w, i) { return arr.indexOf(w) === i; });
  }

  // How many of the visitor's distinct words appear in `text`.
  function matched(qWords, text) {
    var t = words(text);
    return unique(qWords).filter(function (w) { return t.indexOf(w) !== -1; }).length;
  }

  function fallback() {
    return { text: "Sorry, I don't have an answer to that on this website. Please call " + data.phone + ' or email ' + data.email + ' and the team can help.' };
  }

  function answer(q) {
    var qw = unique(words(q));
    if (!qw.length) return fallback();
    var lower = q.toLowerCase();

    // 1. FAQs first. Strict: at least 2 of the visitor's words must appear in the FAQ question,
    //    covering at least 60% of what they asked. A wrong answer is worse than "I don't know".
    var best = null;
    var bestScore = 0;
    data.faqs.forEach(function (f) {
      var m = matched(qw, f.q);
      var score = m / qw.length;
      if (m >= 2 && score >= 0.6 && score > bestScore) { bestScore = score; best = f; }
    });
    if (best) return { text: best.a, src: 'From our FAQs: "' + best.q + '"' };

    // 2. Built-in answers drawn strictly from the site's own details.
    if (data.emergency && /\b(emergenc\w*|urgent|burst|after.?hours?|out of hours|night)\b/.test(lower)) {
      return { text: data.emergency.replace(/\.$/, '') + '. Call ' + data.phone + '.', src: 'Emergency service' };
    }
    if (/\b(price|prices|cost|costs|charge|quote|how much|fee|rate|rates)\b/.test(lower)) {
      var priced = data.services.filter(function (s) { return s.price; });
      var asked = priced.filter(function (s) { return matched(qw, s.name) > 0; });
      if (asked.length) priced = asked;
      if (priced.length) {
        return { text: priced.map(function (s) { return s.name + ': ' + s.price; }).join('\n') + '\nFor an exact quote, call ' + data.phone + '.', src: 'Prices listed on this website' };
      }
      return { text: 'Prices depend on the job. For a quote, call ' + data.phone + ' or email ' + data.email + '.' };
    }
    var suburb = data.area.filter(function (a) { return lower.indexOf(a.toLowerCase()) !== -1; })[0];
    if (suburb) {
      return { text: 'Yes, we service ' + suburb + '. Call ' + data.phone + ' to book.', src: 'Service area' };
    }
    if (/\b(hours|open|close|closing|opening|weekend|saturday|sunday)\b/.test(lower)) {
      return { text: 'Our hours:\n' + data.hours.map(function (h) { return h.days + ': ' + h.hours; }).join('\n'), src: 'Business hours' };
    }
    if (/\b(area|areas|suburb|suburbs|cover|travel|near|where are you)\b/.test(lower)) {
      return { text: 'We service: ' + data.area.join(', ') + '.\nIf your suburb isn\'t listed, call ' + data.phone + ' to check.', src: 'Service area' };
    }
    if (/\blicen[cs]/.test(lower) && data.licences.length) {
      return { text: data.licences.join('\n'), src: 'Licence details' };
    }
    if (/phone number|your number|contact you|contact details|email address|how (do|can) i (call|contact|reach)|reach you|get in touch/.test(lower)) {
      return { text: 'Call ' + data.phone + ' or email ' + data.email + '.', src: 'Contact details' };
    }

    return fallback();
  }

  function add(text, who, src) {
    var p = document.createElement('p');
    p.className = 'msg msg-' + who;
    p.textContent = text;
    if (src) {
      var s = document.createElement('span');
      s.className = 'msg-src';
      s.textContent = src;
      p.appendChild(s);
    }
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
  }

  function setExpanded(v) {
    openers.forEach(function (b) { b.setAttribute('aria-expanded', v); });
  }

  function open(opener) {
    lastOpener = opener || null;
    panel.hidden = false;
    setExpanded('true');
    if (!greeted) { add(data.greeting, 'bot'); greeted = true; }
    input.focus();
  }

  function close() {
    panel.hidden = true;
    setExpanded('false');
    if (lastOpener) lastOpener.focus();
  }

  openers.forEach(function (b) {
    b.addEventListener('click', function () { panel.hidden ? open(b) : close(); });
  });
  closeBtn.addEventListener('click', close);
  panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q) return;
    add(q, 'user');
    input.value = '';
    var a = answer(q);
    add(a.text, 'bot', a.src);
  });
})();
