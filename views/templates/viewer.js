"use strict";

const { renderLayout } = require("./layouts/default");

/**
 * Renders the viewer page for a given user/layout.
 * @param {{ slug: string, layout: string }} params
 * @returns {string}
 */
const renderViewer = ({ slug, layout }) => {
  const title = `${slug} · ${layout}`;
  const layoutCapitalized = layout.charAt(0).toUpperCase() + layout.slice(1);

  const body = `<main>
  <div class="viewer">

    <a class="back-link" href="/">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      Back to home
    </a>

    <div class="viewer-header">
      <h1 class="viewer-title">${slug}</h1>
      <p class="viewer-subtitle">${layoutCapitalized} · card widget</p>
    </div>

    <div class="viewer-widget">
      <img src="/${slug}/${layout}.png" alt="trakt widget for ${slug}">
    </div>

    <div class="viewer-meta">
      <p class="viewer-meta-label">Embed code</p>
      <div class="code-block">
        <code id="embed-code"></code>
        <button class="copy-btn" id="copy-btn" onclick="copyEmbed()">Copy</button>
      </div>
    </div>

  </div>
</main>

<script>
  var imgUrl = location.origin + '/${slug}/${layout}.png';
  var el = document.getElementById('embed-code');
  if (el) el.textContent = '<img src="' + imgUrl + '" alt="trakt-widget" />';

  function copyEmbed() {
    var btn = document.getElementById('copy-btn');
    navigator.clipboard.writeText(document.getElementById('embed-code').textContent).then(function() {
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(function() { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1800);
    });
  }
</script>`;

  return renderLayout({ title, body });
};

module.exports = { renderViewer };
