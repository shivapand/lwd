'use strict';

import {
  movieFindOne
} from '~/js/server/data/movie';
import movieWrite from 
  '~/js/server/schema/mutations/fns/movieWrite';

export default async (
  db,
  req,
  res,
  next
) => {

  const gifFilename = req.params.gif;

  const [
    title,
    genre,
    hero
  ] = gifFilename.split(
    /_/
  )
    .slice(
      -3
    );

  const movie = await movieFindOne(
    {
      title,
      genre,
      hero
    },
    undefined,
    db
  );

  await movieWrite(
    movie
  );

  return next();
};
