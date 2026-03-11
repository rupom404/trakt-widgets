"use strict";

const express = require("express");
const createError = require("http-errors");
const controller = require("../controllers/controller");
const { renderCard } = require("../utils/canvas-renderer");
const { renderHome } = require("../views/templates/home");

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
  const isHalf = layout.endsWith("_half");
  const is261 = layout.endsWith("_261");
  const suffix = isHalf ? 5 : is261 ? 4 : 0;
  const baseLayout = suffix ? layout.slice(0, -suffix) : layout;

  if (!layouts.includes(baseLayout))
    return next(createError(400, "Layout not found"));

  try {
    const data = await controller[baseLayout](req, next);
    if (!data) return;

    const { buffer, mime } = await renderCard({
      data,
      format: "png",
      scale: isHalf ? 0.5 : is261 ? 261 / 846 : 1,
    });

    res.set("Cache-Control", "no-cache");
    res.set("Content-Type", mime);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
});

// /:slug/:layout  → image only (image/* accept header), HTML requests get 404
router.get("/:slug/:layout", async (req, res, next) => {
  const { slug, layout } = req.params;
  const isHalf = layout.endsWith("_half");
  const is261 = layout.endsWith("_261");
  const suffix = isHalf ? 5 : is261 ? 4 : 0;
  const baseLayout = suffix ? layout.slice(0, -suffix) : layout;

  if (!layouts.includes(baseLayout))
    return next(createError(400, "Layout not found"));

  res.format({
    "image/*": async () => {
      try {
        const data = await controller[baseLayout](req, next);
        if (!data) return;

        const { buffer, mime } = await renderCard({
          data,
          format: "png",
          scale: isHalf ? 0.5 : is261 ? 261 / 846 : 1,
        });

        res.set("Cache-Control", "no-cache");
        res.set("Content-Type", mime);
        res.send(buffer);
      } catch (err) {
        next(err);
      }
    },
    default: () => next(createError(404, "Not found")),
  });
});

module.exports = router;
