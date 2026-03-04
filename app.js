"use strict";

require("dotenv").config();
const express = require("express");
const createError = require("http-errors");
const i18n = require("i18n");
const path = require("path");

const routers = require("./routers/index");
const { renderErrorPage } = require("./views/templates/error-page");
const { renderErrorSvg } = require("./views/templates/error-svg");

const PORT = process.env.PORT || 3000;
const app = express();

i18n.configure({
  locales: ["en", "fr", "it", "sv"],
  localePath: path.join(__dirname, "locales"),
  defaultLocale: "en",
  retryInDefaultLocale: true,
  queryParameter: "language",
  directory: path.join(__dirname, "locales"),
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(i18n.init);

app.use("/", routers);

app.use((req, res, next) => {
  next(createError(404, res.__("error.PAGE_NOT_FOUND")));
});

app.use((err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || res.__("error.INTERNAL_ERROR");

  res.status(err.status);
  res.format({
    html: () => {
      res.set("Content-Type", "text/html");
      res.send(renderErrorPage({ error: err }));
    },
    "image/*": () => {
      res.set("Content-Type", "image/svg+xml");
      res.send(renderErrorSvg({ error: err }));
    },
    default: () => {
      res.send(`${err.status} | ${err.message}`);
    },
  });
});

app.listen(PORT, () => {
  console.log(`App running on PORT ${PORT}`);
});

module.exports = app;
