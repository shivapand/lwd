'use strict';

import {
  genreGet,
  heroGet,
  outputResGet,
  fbAppIdGet
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

  const imageUrl = movie.url.replace(
    /\s/g,
    '%20'
  );

  return res.render(
    'index',
    {
      fbAppId: fbAppIdGet(),
      title: `
        ${
          movie.hero
        } in ${
          movie.title
        }
      `,
      description: movie.description,
      type: 'article',
      url: imageUrl,
      image: {
        url: imageUrl,
        type: 'video.other',
        width: outputResGet(),
        height: outputResGet()
      }
    }
  );
};
