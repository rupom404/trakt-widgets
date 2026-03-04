require("dotenv").config();
const Trakt = require("trakt.tv");
const createError = require("http-errors");

const Image = require("../utils/image");

const trakt = new Trakt({
  client_id: process.env.TRAKT_CLIENT_ID,
});

const watched = async (req, next) => {
  const { slug } = req.params;

  return await trakt.users
    .history({
      username: slug,
    })
    .then(async (response) => {
      if (!response.length)
        return {
          username: slug,
          element: null,
          image: null,
        };

      const element = response[0];
      const type = element.type === "movie" ? "movie" : "show";
      const { tmdb, imdb, tvdb } = element[type].ids;

      const data = {
        type: type,
        title: element[type].title.substring(0, 45),
        year: element[type].year,
      };
      if (type === "show") {
        data.season = element.episode.season;
        data.episode = element.episode.number;
        data.episode_title = element.episode.title;
      }

      const image = await Image.get({
        tmdb_id: tmdb,
        imdb_id: imdb,
        tvdb_id: tvdb,
        type: type,
        season: type === "show" ? element.episode.season : null,
        episode: type === "show" ? element.episode.number : null,
      });

      return {
        username: slug,
        element: data,
        image: image,
      };
    })
    .catch((err) => {
      if (err.message.includes("401"))
        return next(createError(401, "Account private"));
      return next(err);
    });
};

const watching = async (req, next) => {
  const { slug } = req.params;

  return await trakt.users
    .watching({
      username: slug,
    })
    .then(async (response) => {
      if (!response)
        return {
          username: slug,
          element: null,
          image: null,
        };

      const element = response;
      const type = element.type === "movie" ? "movie" : "show";
      const { tmdb, imdb, tvdb } = element[type].ids;

      const data = {
        type: type,
        title: element[type].title.substring(0, 45),
        year: element[type].year,
      };
      if (type === "show") {
        data.season = element.episode.season;
        data.episode = element.episode.number;
        data.episode_title = element.episode.title;
      }

      const image = await Image.get({
        tmdb_id: tmdb,
        imdb_id: imdb,
        tvdb_id: tvdb,
        type: type,
        season: type === "show" ? element.episode.season : null,
        episode: type === "show" ? element.episode.number : null,
      });

      return {
        username: slug,
        element: data,
        image: image,
      };
    })
    .catch((err) => {
      if (err.message.includes("401"))
        return next(createError(401, "Account private"));
      return next(err);
    });
};

module.exports = {
  watched,
  watching,
};
