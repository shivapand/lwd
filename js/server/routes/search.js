'use strict';

import movieSearch from '../schema/mutations/movieSearch';

export default async (
  req,
  res
) => {

  const q = req.query.q || '';

  return movieSearch(
    q
  )
    .then(
      (
        results
      ) => {

        return res.json(
          {
            results
          }
        );
      }
    )
    .catch(
      (
        error
      ) => {

        return res.status(500).json(
          {
            error: error.message || 'search failed'
          }
        );
      }
    );
};
