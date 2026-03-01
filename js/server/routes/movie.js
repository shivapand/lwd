'use strict';

import movieCreate from '../schema/mutations/movieCreate';

export default async (
  db,
  req,
  res
) => {

  const {
    title,
    genre,
    hero
  } = req.body;

  return movieCreate(
    title,
    {
      spoofInput: {
        hero
      },
      genre,
      outputType: 'movie',
      createFlag: true
    },
    db,
    req
  )
    .then(
      (
        movie
      ) => {

        return res.json(
          {
            base64: movie.base64,
            path: movie.path,
            url: movie.url
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
            error: error.message || 'movie creation failed'
          }
        );
      }
    );
};
