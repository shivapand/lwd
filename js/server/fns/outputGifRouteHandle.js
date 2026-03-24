'use strict';

import fs from 'fs';
import path from 'path';

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

  const outputPath = path.join(
    process.cwd(),
    `media/output/${gifFilename}.gif`
  );

  if (
    fs.existsSync(
      outputPath
    )
  ) {

    return next();
  }

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
