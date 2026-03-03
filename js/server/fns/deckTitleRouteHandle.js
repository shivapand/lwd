'use strict';

import {
  genreGet,
  heroGet,
  fbAppIdGet,
  hostUrlGet
} from './variable';
import movieCreate 
  from '~/js/server/schema/mutations/movieCreate';

export default async (
  db,
  req,
  res
) => {

  const deckTitle = req.params.deckTitle;

  const genre = req.query.genre || 
    genreGet();

  const hero = req.query.hero ||
    heroGet();

  const movie = await movieCreate(
    deckTitle,
    {
      source: 'user',
      createFlag: true
    },
    db,
    req
  )
    .then(
      () => {

        return movieCreate(
          deckTitle,
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
        );
      }
    );

  const posterUrl = movie.path
    .replace(
      /^\/output\//,
      '/poster/'
    )
    .replace(
      /\.gif$/,
      '.jpg'
    );

  const posterAbsoluteUrl = `${
    hostUrlGet(req)
  }${
    posterUrl
  }`
    .replace(
      /\s/g,
      '%20'
    );

  const pageUrl = `${
    hostUrlGet(req)
  }${
    req.originalUrl
  }`;

  return res.render(
    'index',
    {
      fbAppId: fbAppIdGet(),
      title: `${movie.hero} in ${movie.title}`,
      description: movie.description,
      type: 'article',
      url: pageUrl,
      image: {
        url: posterAbsoluteUrl,
        type: 'image/jpeg',
        width: 1200,
        height: 627
      }
    }
  );
};
