"use strict";

const { renderLayout } = require("./layouts/default");

/**
 * Renders the home/landing page as an HTML string.
 * Two-column: left = form/info, right = live card preview (752×423).
 * @returns {string}
 */
const renderHome = () => {
  const body = `<main class="home-page">

  <!-- ── Left panel ── -->
  <div class="home-left">
    <div class="home-left-inner">

      <div class="hero-badge">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" stroke="#ed1c24" stroke-width="1.5"/><circle cx="5" cy="5" r="2" fill="#ed1c24"/></svg>
        Live · always up-to-date
      </div>

      <h1 class="hero-title">
        Your Trakt history,<br>
        <span class="hero-accent">beautifully embedded.</span>
      </h1>

      <p class="hero-desc">
        Real-time image cards of what you're watching on Trakt —
        copy the link to anywhere</code>.
      </p>

      <form class="hero-form" id="hero-form" onsubmit="goToCard(event)">
        <div class="hero-input-group">
          <svg class="hero-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <input
            class="hero-input"
            id="username-input"
            type="text"
            placeholder="Trakt username"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
          />
        </div>
        <button class="hero-btn" type="submit">
          View
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </form>
      <p class="hero-form-hint" id="form-hint">&nbsp;</p>

      <div class="home-steps">
        <div class="home-step-item">
          <span class="home-step-num">1</span>
          <span>Enter your Trakt username above</span>
        </div>
        <div class="home-step-item">
          <span class="home-step-num">2</span>
          <span>Preview your card live on the right</span>
        </div>

      </div>

    </div>
  </div>

  <!-- ── Right panel ── -->
  <div class="home-right">
    <p class="home-card-sublabel" id="home-card-sublabel">foxbinner · demo</p>
    <div class="home-card-box">
      <img id="demo-img" src="/foxbinner/watched.png" alt="Trakt card preview">
    </div>
    <p class="home-card-url" id="home-card-url">&nbsp;</p>
    <div class="home-card-actions">
      <button class="copy-btn" id="btn-copy-full" onclick="copyUrl('full')">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        Copy Full
      </button>
      <button class="copy-btn" id="btn-copy-half" onclick="copyUrl('half')">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        Copy Half
      </button>
    </div>
  </div>

</main>

<script>
  var usernameInput = document.getElementById('username-input');
  var demoImg       = document.getElementById('demo-img');
  var hint          = document.getElementById('form-hint');
  var sublabel      = document.getElementById('home-card-sublabel');
  var cardUrl       = document.getElementById('home-card-url');
  var currentSlug   = 'foxbinner';

  function showCard(val) {
    currentSlug = val;
    var imgUrl = location.origin + '/' + encodeURIComponent(val) + '/watched.png';
    demoImg.src = imgUrl + '?_=' + Date.now();
    sublabel.textContent = val + ' \xb7 watched';
    cardUrl.textContent = '/' + val + '/watched.png';
  }

  function goToCard(e) {
    e.preventDefault();
    var val = usernameInput.value.trim();
    if (!val) {
      hint.textContent = 'Please enter a Trakt username.';
      usernameInput.focus();
      return;
    }
    hint.textContent = '\u00a0';
    showCard(val);
  }

  function copyUrl(type) {
    var suffix = type === 'half' ? '_half' : '';
    var url = location.origin + '/' + encodeURIComponent(currentSlug) + '/watched' + suffix + '.png';
    var btnId = type === 'half' ? 'btn-copy-half' : 'btn-copy-full';
    var btn = document.getElementById(btnId);
    navigator.clipboard.writeText(url).then(function() {
      var orig = btn.innerHTML;
      btn.classList.add('copied');
      btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
      setTimeout(function() { btn.classList.remove('copied'); btn.innerHTML = orig; }, 2000);
    });
  }
</script>`;

  return renderLayout({ body });
};

module.exports = { renderHome };
