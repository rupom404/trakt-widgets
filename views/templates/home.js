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
  </div>

</main>

<script>
  var usernameInput = document.getElementById('username-input');
  var demoImg       = document.getElementById('demo-img');
  var hint          = document.getElementById('form-hint');
  var sublabel      = document.getElementById('home-card-sublabel');
  var cardUrl       = document.getElementById('home-card-url');

  function showCard(val) {
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
</script>`;

  return renderLayout({ body });
};

module.exports = { renderHome };
