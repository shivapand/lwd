'use strict';

import tmdbFetch from '../fns/tmdbFetch';

export default async (
  text,
  limit = 5
) => {

  const searchJson = await tmdbFetch(
    `/search/movie?query=${encodeURIComponent(text)}&language=en-US&page=1`
  );

  const results = (searchJson?.results || [])
    .slice(0, limit)
    .map(
      ({ title, overview }) => ({
        title,
        snippet: overview || ''
      })
    );

  return results;
};
