"use strict";

const express = require("express");
const createError = require("http-errors");
const controller = require("../controllers/controller");
const { renderCard } = require("../utils/canvas-renderer");
const { renderHome } = require("../views/templates/home");
const { renderViewer } = require("../views/templates/viewer");

const router = express.Router();

const layouts = ["watched"];

// ── Helpers ──

// Home page
router.get("/", (req, res) => {
  res.set("Content-Type", "text/html");
  res.send(renderHome());
});

// /:slug/:layout.png  → returns PNG image
router.get("/:slug/:layout.:ext(png)", async (req, res, next) => {
  const { slug, layout } = req.params;
  const language = req.locale;
  const isHalf = layout.endsWith("_half");
  const baseLayout = isHalf ? layout.slice(0, -5) : layout;

  if (!layouts.includes(baseLayout))
    return next(createError(400, res.__("error.LAYOUT_NOT_FOUND")));

  try {
    const data = await controller[baseLayout](req, next, language);
    if (!data) return;

    const { buffer, mime } = await renderCard({
      data,
      format: "png",
      scale: isHalf ? 0.5 : 1,
    });

    res.set("Cache-Control", "no-cache");
    res.set("Content-Type", mime);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
});

// /:slug/:layout  → viewer page (HTML) or image (image/* accept header)
router.get("/:slug/:layout", async (req, res, next) => {
  const { slug, layout } = req.params;
  const language = req.locale;
  const isHalf = layout.endsWith("_half");
  const baseLayout = isHalf ? layout.slice(0, -5) : layout;

  if (!layouts.includes(baseLayout))
    return next(createError(400, res.__("error.LAYOUT_NOT_FOUND")));

  res.format({
    html: () => {
      res.set("Content-Type", "text/html");
      res.send(renderViewer({ slug, layout }));
    },
    "image/*": async () => {
      try {
        const data = await controller[baseLayout](req, next, language);
        if (!data) return;

        const { buffer, mime } = await renderCard({
          data,
          format: "png",
          scale: isHalf ? 0.5 : 1,
        });

        res.set("Cache-Control", "no-cache");
        res.set("Content-Type", mime);
        res.send(buffer);
      } catch (err) {
        next(err);
      }
    },
  });
});

module.exports = router;
