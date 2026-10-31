// Enquiry form on the contact page. Without this file the form still works (the browser checks the
// fields and posts it to Web3Forms). With it: the job is picked when you arrive from a service page,
// the enquiry sends without leaving the page, and the result is announced to screen readers.
// Demo sites never send anything.
(function () {
  var form = document.querySelector('[data-quote-form]');
  if (!form) return;
  var status = form.querySelector('.form-status');
  var btn = form.querySelector('button[type="submit"]');
  var phone = form.getAttribute('data-phone');

  // contact.html?job=switchboard-upgrades → "Switchboard upgrades" already chosen
  var m = /[?&]job=([a-z0-9-]+)/.exec(location.search);
  if (m) {
    var opt = form.querySelector('option[data-slug="' + m[1] + '"]');
    if (opt) opt.selected = true;
  }

  function say(text, kind) {
    status.textContent = text;
    status.className = 'form-status' + (kind ? ' is-' + kind : '');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.hasAttribute('data-demo')) {
      say('Demo only: nothing was sent. On a real site, this enquiry goes straight to the business\'s email.', 'ok');
      return;
    }
    btn.disabled = true;
    btn.textContent = 'Sending…';
    say('');
    fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !d.success) throw new Error('not sent');
        var name = (form.elements.name.value || '').trim().split(/\s+/)[0];
        form.reset();
        say('Thanks' + (name ? ' ' + name : '') + ', we\'ve got your enquiry and will be in touch soon. If it\'s urgent, call ' + phone + '.', 'ok');
      })
      .catch(function () {
        say('Sorry, that didn\'t send. Please call or text ' + phone + ' instead.', 'error');
      })
      .then(function () {
        btn.disabled = false;
        btn.textContent = 'Send enquiry';
        status.focus();
      });
  });
  status.setAttribute('tabindex', '-1');
})();
