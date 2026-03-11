"use strict";

const { renderLayout } = require("./layouts/default");

/**
 * Renders the home/landing page as an HTML string.
 * Split layout: left = form/info, right = live card preview.
 * @returns {string}
 */
const renderHome = () => {
  const body = `
<div class="relative isolate flex flex-1 overflow-hidden">
  <svg class="absolute inset-0 -z-10 h-full w-full stroke-white/[0.05] [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" aria-hidden="true">
    <defs>
      <pattern id="hero-grid" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
        <path d="M.5 200V.5H200" fill="none"/>
      </pattern>
    </defs>
    <svg x="50%" y="-1" class="overflow-visible fill-white/[0.015]">
      <path d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z" stroke-width="0"/>
    </svg>
    <rect width="100%" height="100%" stroke-width="0" fill="url(#hero-grid)"/>
  </svg>
  <div class="absolute left-[calc(50%-18rem)] top-[calc(50%-22rem)] -z-10 transform-gpu blur-3xl" aria-hidden="true">
    <div class="aspect-[1108/632] w-[60rem] bg-gradient-to-r from-[#ed1c24] to-[#7f0006] opacity-[0.09]"
         style="clip-path:polygon(73.6% 51.7%,91.7% 11.8%,100% 46.4%,97.4% 82.2%,92.5% 84.9%,75.7% 64%,55.3% 47.5%,46.5% 49.4%,45% 62.9%,50.3% 87.2%,21.3% 64.1%,0.1% 100%,5.4% 51.1%,21.4% 63.9%,58.9% 0.2%,73.6% 51.7%)"></div>
  </div>
  <div class="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-6 py-20 lg:flex-row lg:gap-20 lg:px-8 lg:py-24">
    <div class="mx-auto w-full max-w-xl flex-shrink-0 lg:mx-0 lg:max-w-lg">
      <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium text-gray-400">
        <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <circle cx="5" cy="5" r="4" stroke="#ed1c24" stroke-width="1.5"/>
          <circle cx="5" cy="5" r="2" fill="#ed1c24"/>
        </svg>
        Live &middot; always up-to-date
      </div>
      <h1 class="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl leading-[1.1]">
        Your Trakt history,<br>
        <span class="text-[#ed1c24]">beautifully embedded.</span>
      </h1>
      <p class="mt-5 max-w-md text-base leading-7 text-gray-400">
        Real-time image cards showing what you are watching on Trakt. Drop the link into any README, website, or profile.
      </p>
      <form class="mt-8 flex items-start gap-3" id="hero-form" onsubmit="goToCard(event)">
        <div class="relative flex-1">
          <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <input
            id="username-input"
            type="text"
            placeholder="Trakt username"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            class="tw-input w-full h-11 rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 text-sm text-white placeholder-gray-500 outline-none transition focus:border-[#ed1c24] focus:ring-2"
          />
        </div>
        <button type="submit" class="inline-flex h-11 flex-shrink-0 items-center gap-2 rounded-xl bg-[#ed1c24] px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#c91920]">
          View
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </form>
      <p class="mt-2 min-h-[1.1em] text-xs text-[#ed1c24]" id="form-hint">&nbsp;</p>
      <div class="mt-6 space-y-3 border-t border-white/[0.07] pt-6">
        <div class="flex items-center gap-3 text-sm text-gray-400">
          <span class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-[#ed1c24]/30 bg-[#ed1c24]/10 text-[0.6rem] font-bold text-[#ed1c24]">1</span>
          Enter your public Trakt username above
        </div>
        <div class="flex items-center gap-3 text-sm text-gray-400">
          <span class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-[#ed1c24]/30 bg-[#ed1c24]/10 text-[0.6rem] font-bold text-[#ed1c24]">2</span>
          Preview your live card on the right
        </div>
        <div class="flex items-center gap-3 text-sm text-gray-400">
          <span class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-[#ed1c24]/30 bg-[#ed1c24]/10 text-[0.6rem] font-bold text-[#ed1c24]">3</span>
          Copy and paste the link anywhere
        </div>
      </div>
    </div>
    <div class="flex w-full flex-col items-center gap-3 lg:flex-1 lg:min-w-0">
      <p class="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-gray-600" id="home-card-sublabel">foxbinner &middot; demo</p>
      <div class="w-full max-w-[640px] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] ring-1 ring-white/[0.04]" style="aspect-ratio:16/9;box-shadow:0 20px 80px rgba(0,0,0,0.7)">
        <img id="demo-img" class="block h-full w-full object-cover" src="/foxbinner/watched.png" alt="Trakt card preview">
      </div>
      <p class="min-h-[1em] font-mono text-[0.65rem] text-gray-600" id="home-card-url">&nbsp;</p>
      <div class="flex gap-2">
        <button id="btn-copy-full" onclick="copyUrl('full')" class="copy-action-btn inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 text-xs font-medium text-gray-400 transition-colors hover:border-white/20 hover:text-white">
          <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          Copy Full
        </button>
        <button id="btn-copy-half" onclick="copyUrl('half')" class="copy-action-btn inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 text-xs font-medium text-gray-400 transition-colors hover:border-white/20 hover:text-white">
          <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          Copy Half
        </button>
      </div>
    </div>
  </div>
</div>

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
      btn.style.color = '#4ade80';
      btn.style.borderColor = 'rgba(74,222,128,0.3)';
      btn.innerHTML = '<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
      setTimeout(function() {
        btn.style.color = '';
        btn.style.borderColor = '';
        btn.innerHTML = orig;
      }, 2000);
    });
  }
</script>`;

  return renderLayout({ body });
};

module.exports = { renderHome };
