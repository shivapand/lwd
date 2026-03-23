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

  const movie = await movieFindOne(
    {
      path: `/output/${gifFilename}.gif`
    },
    undefined,
    db
  );

  if (
    !movie
  ) {

    return next();
  }

  await movieWrite(
    movie
  );

  return next();
};
