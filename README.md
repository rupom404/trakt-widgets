# trakt-widgets

Dynamically generated PNG cards showing what a [Trakt.tv](https://trakt.tv) user last watched or is currently watching — embed them in any README, website, or profile.

> ⚠️ Your Trakt account must be set to **public**.

```html
<img
  src="https://trakt-widgets.vercel.app/{username}/watched"
  alt="trakt-widget"
/>
```

---

## Layouts

| Layout     | Description                            | Preview URL           |
| :--------- | :------------------------------------- | :-------------------- |
| `watched`  | Most recently watched movie or episode | `/foxbinner/watched`  |
| `watching` | Currently playing movie or episode     | `/foxbinner/watching` |

### Direct PNG embed (e.g. GitHub README)

```html
<!-- Watched -->
<img
  src="https://trakt-widgets.vercel.app/foxbinner/watched.png"
  alt="Last watched"
/>

<!-- Currently watching -->
<img
  src="https://trakt-widgets.vercel.app/foxbinner/watching.png"
  alt="Now watching"
/>
```

### Viewer page

Visiting the URL without `.png` opens an HTML viewer that auto-refreshes the card:

```
https://trakt-widgets.vercel.app/{username}/watched
```

---

## Query Parameters

| Parameter  | Default | Accepted values     | Description                 |
| :--------- | :-----: | :------------------ | :-------------------------- |
| `language` |  `en`   | `en` `fr` `it` `sv` | Preferred backdrop language |

```html
<img
  src="https://trakt-widgets.vercel.app/foxbinner/watched.png?language=fr"
  alt="trakt-widget"
/>
```

---

## Image sources

The card backdrop is resolved through the following fallback chain:

1. **TVmaze** — episode-specific still (TV shows only)
2. **TMDB** — high-resolution backdrop (movies & shows, requires API key)
3. **Metahub** — free backdrop via IMDB ID (no key needed)
4. **TVmaze** — show-level backdrop fallback

If no image is found the card renders on a dark background.

---

## Self-hosting

### Prerequisites

- Node.js 22+
- A [Trakt API](https://trakt.tv/oauth/applications) client ID
- _(Optional)_ A [TMDB API v3](https://www.themoviedb.org/settings/api) key for higher-quality backdrops

### Setup

```bash
git clone https://github.com/foxbinner/trakt-widgets
cd trakt-widgets
cp .env.sample .env        # then fill in your keys
yarn install
yarn start                 # or: yarn dev  (nodemon watch mode)
```

Open `http://localhost:3000` in your browser.

### Environment variables

| Variable          | Required | Description                            |
| :---------------- | :------: | :------------------------------------- |
| `TRAKT_CLIENT_ID` |    ✅    | Trakt API client ID                    |
| `TMDB`            |    ⬜    | TMDB API v3 key — enables HD backdrops |
| `PORT`            |    ⬜    | HTTP port (default: `3000`)            |

### Deploy to Vercel

```bash
vercel deploy
```

The included `vercel.json` routes everything through `app.js`.

---

## Project structure

```
trakt-widgets/
├── app.js                        # Express entry point
├── controllers/
│   └── controller.js             # Trakt API calls (watched / watching)
├── locales/
│   ├── en.json                   # English strings
│   ├── fr.json                   # French
│   ├── it.json                   # Italian
│   └── sv.json                   # Swedish
├── public/
│   └── styles/style.css          # Home page styles
├── routers/
│   └── index.js                  # Route definitions
├── utils/
│   ├── canvas-renderer.js        # PNG card renderer (@napi-rs/canvas)
│   └── image.js                  # Backdrop image fetching & fallback chain
├── views/templates/
│   ├── error-page.js             # HTML error page
│   ├── error-svg.js              # SVG error card
│   ├── home.js                   # Landing / demo page
│   ├── viewer.js                 # Widget viewer page
│   └── layouts/default.js        # Shared HTML layout
├── .env.sample                   # Environment variable template
├── vercel.json                   # Vercel deployment config
└── package.json
```

---

## Tech stack

| Layer          | Library / Service                                         |
| :------------- | :-------------------------------------------------------- |
| Server         | [Express](https://expressjs.com)                          |
| Card rendering | [@napi-rs/canvas](https://github.com/Brooooooklyn/canvas) |
| Trakt data     | [trakt.tv](https://www.npmjs.com/package/trakt.tv)        |
| Backdrops      | TMDB · TVmaze · Metahub                                   |
| i18n           | [i18n](https://www.npmjs.com/package/i18n)                |
| Deployment     | [Vercel](https://vercel.com)                              |

---

## Credits

- [Trakt.tv](https://trakt.tv) — watch history data
- [The Movie Database (TMDB)](https://www.themoviedb.org) — backdrop images
- [TVmaze](https://www.tvmaze.com) — episode stills & show backdrops
- [Metahub](https://metahub.spaces) — free IMDB-based backdrops

## License

MIT © [foxbinner](https://github.com/foxbinner)
