"use strict";

/**
 * Renders an SVG error card (used when the client requests image/*).
 * @param {{ error: { status: number, message: string } }} params
 * @returns {string}
 */
const renderErrorSvg = ({ error }) =>
  `<svg id="${error.status}" width="720" height="461" viewBox="0 0 720 461" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<defs>
  <style>
    text, tspan {
      font-family: 'Exo 2', sans-serif;
    }
    tspan {
      fill: #bfbfbf;
      font-size: 80%;
    }
    .cls-1 {
      fill: #f3f3f3;
      fill-rule: evenodd;
    }
  </style>

  <filter id="shadow" x="0" y="0" width="100%" height="150%">
    <feOffset result="offOut" in="SourceAlpha" dx="0" dy="-1" />
    <feGaussianBlur result="blurOut" in="offOut" stdDeviation="4" />
    <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
  </filter>
</defs>

  <!-- Background -->
  <rect id="sfondo" x="0" y="0" width="100%" height="100%" fill="#f1f2f6" />

  <text x="50%" y="45%" fill="#262626" font-size="30" dominant-baseline="middle" text-anchor="middle">${error.status}</text>
  <text x="50%" y="50%" fill="#262626" font-size="22" dominant-baseline="middle" text-anchor="middle">${error.message}</text>

</svg>`;

module.exports = { renderErrorSvg };
