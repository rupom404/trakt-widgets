const to_base64 = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.arrayBuffer();
    const contentType = response.headers.get("content-type");
    return `data:${contentType};base64,${Buffer.from(blob).toString("base64")}`;
  } catch {
    return null;
  }
};

/**
 * Metahub — free, no API key, works for movies & shows via IMDB ID.
 * https://metahub.spaces/background/{imdb_id}/1000x562/img.jpg
 */
const getMetahubImage = async (imdb_id) => {
  if (!imdb_id) return null;
  return await to_base64(
    `https://metahub.spaces/background/${imdb_id}/1000x562/img.jpg`,
  );
};

/**
 * TVmaze — episode-specific still image via TVDB ID + season/episode number.
 */
const getTvmazeEpisodeImage = async (tvdb_id, season, episode) => {
  if (!tvdb_id || season == null || episode == null) return null;
  try {
    const lookupRes = await fetch(
      `https://api.tvmaze.com/lookup/shows?thetvdb=${tvdb_id}`,
    );
    if (!lookupRes.ok) return null;
    const show = await lookupRes.json();

    const epRes = await fetch(
      `https://api.tvmaze.com/shows/${show.id}/episodebynumber?season=${season}&number=${episode}`,
    );
    if (!epRes.ok) return null;
    const ep = await epRes.json();

    const imageUrl = ep?.image?.original || ep?.image?.medium;
    if (!imageUrl) return null;
    return await to_base64(imageUrl);
  } catch {
    return null;
  }
};

/**
 * TVmaze — show backdrop fallback via TVDB ID.
 */
const getTvmazeImage = async (tvdb_id) => {
  if (!tvdb_id) return null;
  try {
    const lookupRes = await fetch(
      `https://api.tvmaze.com/lookup/shows?thetvdb=${tvdb_id}`,
    );
    if (!lookupRes.ok) return null;
    const show = await lookupRes.json();

    const imagesRes = await fetch(
      `https://api.tvmaze.com/shows/${show.id}/images`,
    );
    if (!imagesRes.ok) return null;
    const images = await imagesRes.json();

    const background = images.find((img) => img.type === "background");
    const imageUrl =
      background?.resolutions?.original?.url ||
      background?.resolutions?.medium?.url ||
      show?.image?.original ||
      show?.image?.medium;

    if (!imageUrl) return null;
    return await to_base64(imageUrl);
  } catch {
    return null;
  }
};

/**
 * TMDB — backdrop via TMDB ID. Works for movies & TV.
 * Uses original quality for HD cards.
 */
const getTmdbImage = async (tmdb_id, type) => {
  if (!tmdb_id) return null;
  const apiKey = process.env.TMDB;
  if (!apiKey) return null;
  try {
    const mediaType = type === "movie" ? "movie" : "tv";
    const res = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${tmdb_id}/images?api_key=${apiKey}`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    const backdrop = data.backdrops?.[0]?.file_path;
    if (!backdrop) return null;
    return await to_base64(`https://image.tmdb.org/t/p/original${backdrop}`);
  } catch {
    return null;
  }
};

const get = async (options) => {
  // For shows: try TVmaze episode still first
  if (options.type === "show") {
    const epImage = await getTvmazeEpisodeImage(
      options.tvdb_id,
      options.season,
      options.episode,
    );
    if (epImage) return epImage;
  }

  // Try TMDB backdrop (works for both movies & shows)
  const tmdbImage = await getTmdbImage(options.tmdb_id, options.type);
  if (tmdbImage) return tmdbImage;

  // Try Metahub backdrop
  const metahub = await getMetahubImage(options.imdb_id);
  if (metahub) return metahub;

  // Final fallback: TVmaze show backdrop
  if (options.type === "show") {
    console.log(
      `[image] falling back to TVmaze backdrop for tvdb:${options.tvdb_id}`,
    );
    return await getTvmazeImage(options.tvdb_id);
  }

  return null;
};

module.exports = {
  get,
  to_base64,
};
