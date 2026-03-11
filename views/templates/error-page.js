"use strict";

const { renderLayout } = require("./layouts/default");

/**
 * Renders the HTML error page.
 * @param {{ error: { status: number, message: string } }} params
 * @returns {string}
 */
const renderErrorPage = ({ error }) => {
  const body = `
<div class="relative isolate flex flex-1 items-center justify-center overflow-hidden px-6 py-24">
  <div class="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-3xl" aria-hidden="true">
    <div class="mx-auto aspect-[1155/678] w-[72rem] bg-gradient-to-tr from-[#ed1c24] to-[#7f0006] opacity-[0.07]"
         style="clip-path:polygon(74.1% 44.1%,100% 61.6%,97.5% 26.9%,85.5% 0.1%,80.7% 2%,72.5% 32.5%,60.2% 62.4%,52.4% 68.1%,47.5% 58.3%,45.2% 34.5%,27.5% 76.7%,0.1% 64.9%,17.9% 100%,27.6% 76.8%,76.1% 97.7%,74.1% 44.1%)">
    </div>
  </div>
  <div class="text-center">
    <p class="text-[6rem] font-black leading-none tracking-tighter text-[#ed1c24]/20 sm:text-[10rem]">${error.status}</p>
    <div class="relative -mt-4">
      <div class="absolute inset-0 flex items-center" aria-hidden="true">
        <div class="w-full border-t border-white/10"></div>
      </div>
      <div class="relative flex justify-center">
        <span class="bg-[#080808] px-4 text-xs font-semibold uppercase tracking-widest text-gray-600">Error</span>
      </div>
    </div>
    <p class="mt-6 text-base font-medium text-white">${error.message}</p>
    <p class="mt-2 text-sm text-gray-500">Something went wrong. Please try again or go back home.</p>
    <div class="mt-8">
      <a href="/" class="inline-flex items-center gap-2 rounded-xl bg-[#ed1c24] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#c91920]">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Go home
      </a>
    </div>
  </div>
</div>`;

  return renderLayout({ title: String(error.status), body });
};

module.exports = { renderErrorPage };