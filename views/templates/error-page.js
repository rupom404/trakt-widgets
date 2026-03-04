"use strict";

const { renderLayout } = require("./layouts/default");

/**
 * Renders the HTML error page.
 * @param {{ error: { status: number, message: string } }} params
 * @returns {string}
 */
const renderErrorPage = ({ error }) => {
  const body = `<main>
  <div class="error-page">
    <div class="error-code">${error.status}</div>
    <p class="error-msg">${error.message}</p>
    <a href="/" class="btn btn-ghost mt-2">Go home</a>
  </div>
</main>`;

  return renderLayout({ title: String(error.status), body });
};

module.exports = { renderErrorPage };
