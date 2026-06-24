/* Aithernet public-site account awareness.
 *
 * Performs a lightweight, non-blocking, read-only session check against the portal's
 * cross-origin status endpoint (same-site cookie, credentials included). When a valid portal
 * session exists, the header account action becomes "Open portal"; otherwise it stays "Sign in".
 *
 * No tokens are read or stored. The session cookie is HttpOnly and never visible to this script —
 * we only learn a boolean + display name/email from the portal's own response.
 *
 * Robust fallback: if the check is unavailable (offline, blocked, error), the action falls back to
 * "Sign in". An inline failsafe in each page also reveals the action if this script never loads.
 */
(function () {
  'use strict';
  var PORTAL = 'https://app.aithernet.online/';
  var STATUS = 'https://app.aithernet.online/api/v1/auth/session-status';

  function reveal() {
    document.documentElement.classList.remove('acct-pending');
  }

  function signinUrl() {
    return PORTAL + '#/signin?return_to=' + encodeURIComponent(window.location.href);
  }

  function asSignedOut(el) {
    el.textContent = 'Sign in';
    el.setAttribute('href', signinUrl());
    el.removeAttribute('title');
    el.removeAttribute('aria-label');
    reveal();
  }

  function asSignedIn(el, account) {
    el.textContent = 'Open portal';
    el.setAttribute('href', PORTAL);
    if (account && (account.display_name || account.email)) {
      var who = account.display_name || account.email;
      el.setAttribute('title', 'Signed in as ' + who);
      el.setAttribute('aria-label', 'Open portal — signed in as ' + who);
    }
    reveal();
  }

  function init() {
    var el = document.getElementById('acct-action');
    if (!el) { reveal(); return; }
    // Default the sign-in link to carry a return_to even before the check resolves.
    el.setAttribute('href', signinUrl());

    var settled = false;
    // Network failsafe: if the status check stalls, fall back to "Sign in".
    var timer = window.setTimeout(function () {
      if (!settled) { settled = true; asSignedOut(el); }
    }, 2500);

    try {
      fetch(STATUS, { method: 'GET', credentials: 'include', cache: 'no-store' })
        .then(function (r) { return r && r.ok ? r.json() : null; })
        .then(function (data) {
          if (settled) return;
          settled = true; window.clearTimeout(timer);
          if (data && data.authenticated) { asSignedIn(el, data.account); }
          else { asSignedOut(el); }
        })
        .catch(function () {
          if (settled) return;
          settled = true; window.clearTimeout(timer); asSignedOut(el);
        });
    } catch (e) {
      if (!settled) { settled = true; window.clearTimeout(timer); asSignedOut(el); }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
