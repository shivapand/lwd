'use strict';

import tmdbFetch from '../fns/tmdbFetch';

export default async (
  text,
  limit = 5
) => {

  const searchJson = await tmdbFetch(
    `/search/movie?query=${encodeURIComponent(text)}&language=en-US&page=1`
  );

  const MIN_POPULARITY = 5;

  const results = (searchJson?.results || [])
    .filter(
      ({ popularity }) => popularity >= MIN_POPULARITY
    )
    .slice(0, limit)
    .map(
      ({ title, overview, poster_path, release_date, vote_average }) => ({
        title,
        snippet: overview || '',
        year: (release_date || '').slice(0, 4) || null,
        poster: poster_path
          ? `https://image.tmdb.org/t/p/w92${poster_path}`
          : null,
        rating: (vote_average != null)
          ? vote_average.toFixed(1)
          : null
      })
    );

  return results;
};
