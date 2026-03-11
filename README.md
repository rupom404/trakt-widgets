<div align="center">

# 📺 trakt-widgets

**Dynamically generated cards showing what you last watched on [Trakt.tv](https://trakt.tv)**  
Embed them in any README, website, or profile as a PNG image.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-traktrack.vercel.app-red?style=for-the-badge&logo=vercel)](https://traktrack.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Built with Tailwind CSS](https://img.shields.io/badge/UI-Tailwind%20CSS-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

![Screenshot](public/pictures/screenshot.png)

</div>

---

## ✨ Usage

> ⚠️ Your Trakt profile must be set to **public**.

Drop this anywhere — GitHub README, personal site, anywhere you can render an image:

```html
<!-- Last watched -->
<img
  src="https://traktrack.vercel.app/{username}/watched.png"
  alt="Last watched"
/>
```

---

## 🚀 Self-hosting

**Prerequisites:** Node.js 22+, a [Trakt API](https://trakt.tv/oauth/applications) client ID, and optionally a [TMDB API key](https://www.themoviedb.org/settings/api) for HD backdrops.

```bash
git clone https://github.com/foxbinner/trakt-widgets
cd trakt-widgets
cp .env.sample .env   # fill in your keys
yarn install
yarn dev              # or: yarn start
```

| Variable          | Required | Description                |
| :---------------- | :------: | :------------------------- |
| `TRAKT_CLIENT_ID` |    ✅    | Trakt API client ID        |
| `TMDB`            |    ⬜    | TMDB key for HD backdrops  |
| `PORT`            |    ⬜    | HTTP port (default `3000`) |

To deploy on Vercel, just run `vercel deploy` — `vercel.json` is already configured.

---

## 🎨 UI

The web interface is built with **[Tailwind CSS](https://tailwindcss.com)** (loaded via CDN — no build step required) using components adapted from the **Tailwind CSS Premium UI Kit**:

| Page   | Components used                                                                           |
| :----- | :---------------------------------------------------------------------------------------- |
| Home   | Split hero with screenshot on dark, grid SVG background, glow blob, pill badge, step list |
| Error  | Ghost large error code, divider label, glow blob background                               |
| Layout | Glassmorphism sticky navbar, minimal dark footer                                          |

All pages share a dark `#080808` base with Trakt red (`#ed1c24`) as the accent. The old hand-rolled `style.css` is replaced by a ~30-line browser-reset shim — Tailwind handles everything else.

---

## 🛠 Stack

[Express](https://expressjs.com) · [@napi-rs/canvas](https://github.com/Brooooooklyn/canvas) · [trakt.tv](https://www.npmjs.com/package/trakt.tv) · [Tailwind CSS](https://tailwindcss.com) · TMDB · TVmaze · Metahub · [Vercel](https://vercel.com)

---

## License

MIT © [foxbinner](https://github.com/foxbinner)
