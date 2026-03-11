"use strict";

// Trakt white icon (inline base64 SVG)
const TRAKT_ICON_WHITE =
  "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNDggNDgiPgogIDxkZWZzPgogICAgPHN0eWxlPgogICAgICAuY2xzLTEgewogICAgICAgIGZpbGw6ICNmZmY7CiAgICAgIH0KICAgIDwvc3R5bGU+CiAgPC9kZWZzPgogIDxnIGlkPSJfeDJEXy1wcm9kdWN0aW9uIj4KICAgIDxwYXRoIGlkPSJsb2dvbWFyay5zcXVhcmUud2hpdGUiIGNsYXNzPSJjbHMtMSIgZD0iTTMwLjE3LDMwLjIybC0xLjQ2LTEuNDYsMTkuMTYtMTkuMTdjLS4wNS0uMzktLjEzLS43Ny0uMjMtMS4xNWwtMjAuMzEsMjAuMzMsMi4xNiwyLjE2LTEuNDYsMS40Ni0zLjYyLTMuNjJMNDYuODUsNi4yOWMtLjE1LS4zLS4zMS0uNi0uNS0uODhsLTIzLjMzLDIzLjM1LDQuMzEsNC4zMS0xLjQ2LDEuNDYtMTQuMzktMTQuNCwxLjQ2LTEuNDYsOC42Miw4LjYyTDQ1LjEsMy43MmMtMi4wNy0yLjI5LTUuMDUtMy43Mi04LjM3LTMuNzJIMTEuMjdDNS4wNSwwLDAsNS4wNSwwLDExLjI3djI1LjQ4YzAsNi4yMiw1LjA1LDExLjI2LDExLjI3LDExLjI2aDI1LjQ3YzYuMjIsMCwxMS4yNy01LjA0LDExLjI3LTExLjI2VjEyLjM4bC0xNy44MywxNy44NFpNMjEuNTQsMjUuOTFsLTcuOTEtNy45MywxLjQ2LTEuNDYsNy45MSw3LjkyLTEuNDYsMS40N1pNMjMuNjksMjMuNzRsLTcuOTEtNy45MiwxLjQ2LTEuNDYsNy45Miw3LjkyLTEuNDcsMS40NlpNNDMuNCwzNS4xMmMwLDQuNTctMy43MSw4LjI4LTguMjgsOC4yOEgxMi44OGMtNC41NiwwLTguMjgtMy43MS04LjI4LTguMjhWMTIuODhjMC00LjU3LDMuNzEtOC4yOCw4LjI4LTguMjhoMjAuNzh2Mi4wOEgxMi44OGMtMy40MiwwLTYuMiwyLjc4LTYuMiw2LjJ2MjIuMjNjMCwzLjQyLDIuNzgsNi4yMSw2LjIsNi4yMWgyMi4yNGMzLjQyLDAsNi4yLTIuNzksNi4yLTYuMjF2LTMuNTFoMi4wOHYzLjUxWiIvPgogIDwvZz4KPC9zdmc+";

/**
 * Wraps page content in the standard HTML layout.
 * @param {{ title?: string, body: string }} params
 * @returns {string}
 */
const renderLayout = ({ title = "", body }) => `<!DOCTYPE html>
<html lang="en" class="bg-[#080808]">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Embed your Trakt watch history as beautiful image cards.">
  <meta name="theme-color" content="#080808">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: { trakt: '#ed1c24' },
          fontFamily: { sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'] }
        }
      }
    }
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles/style.css">
  <title>${title ? `${title} — ` : ""}trakt-widgets</title>
</head>
<body class="bg-[#080808] text-white min-h-screen flex flex-col font-sans antialiased">

  <!-- ── Navbar ── -->
  <nav class="sticky top-0 z-50 border-b border-white/[0.07] bg-[#080808]/90 backdrop-blur-xl">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-14 items-center gap-3">
        <a href="/" class="flex items-center gap-2.5 text-white no-underline hover:no-underline">
          <img class="h-6 w-6 flex-shrink-0" src="${TRAKT_ICON_WHITE}" alt="Trakt">
          <span class="text-sm font-semibold tracking-tight">trakt-widgets</span>
        </a>
        <div class="flex-1"></div>
        <a
          href="https://github.com/foxbinner/trakt-widgets"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:border-white/20 hover:text-white no-underline hover:no-underline"
        >
          <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.775.42-1.305.763-1.605-2.665-.305-5.467-1.332-5.467-5.93 0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3-.405c1.02.005 2.047.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.652.242 2.873.12 3.176.77.84 1.232 1.91 1.232 3.22 0 4.61-2.807 5.623-5.48 5.92.43.37.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.697.825.578C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          GitHub
        </a>
      </div>
    </div>
  </nav>

  ${body}

  <!-- ── Footer ── -->
  <footer class="mt-auto border-t border-white/[0.07] py-8">
    <div class="mx-auto max-w-7xl px-6 text-center">
      <p class="text-xs text-gray-600">
        Made by
        <a href="https://github.com/foxbinner" target="_blank" rel="noopener" class="text-[#ed1c24] hover:underline">LittleFox</a>
      </p>
    </div>
  </footer>

</body>
</html>`;

module.exports = { renderLayout };
