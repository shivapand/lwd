'use strict';

import {
  spawn
} from 'child_process';

import {
  movieFindOne
} from '~/js/server/data/movie';

const posterGet = (
  gifBase64
) => {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      const buffer = Buffer.from(
        gifBase64.replace(
          /^data:image\/gif;base64,/,
          ''
        ),
        'base64'
      );

      const proc = spawn(
        'convert',
        [
          'gif:-[0]',
          '-resize', '1200x627^',
          '-gravity', 'center',
          '-crop', '1200x627+0+0',
          '+repage',
          'jpeg:-'
        ]
      );

      const chunks = [];

      proc.stdout.on(
        'data',
        (chunk) => {

          chunks.push(chunk);
        }
      );

      proc.on(
        'close',
        (code) => {

          return (!code)
            ? resolve(
              Buffer.concat(chunks)
            )
            : reject(
              new Error(`convert exited with code ${code}`)
            );
        }
      );

      proc.stdin.on(
        'error',
        () => {}
      );

      proc.stdin.write(buffer);
      proc.stdin.end();
    }
  );
};

export default async (
  db,
  req,
  res
) => {

  const posterFilename = req.params.poster;

  const movie = await movieFindOne(
    {
      path: `/output/${posterFilename}.gif`
    },
    undefined,
    db
  );

  if (
    !movie
  ) {

    return res.status(404).end();
  }

  const posterBuffer = await posterGet(
    movie.base64
  );

  res.set(
    'Content-Type',
    'image/jpeg'
  );

  return res.send(
    posterBuffer
  );
};
