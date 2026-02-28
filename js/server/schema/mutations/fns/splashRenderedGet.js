'use strict';

import fs from 'fs';
import path from 'path';
import nodeFetch from 'node-fetch';
import {
  exec
} from 'child_process';

import {
  outputResGet
} from '~/js/server/fns/variable';
import base64TextCompositedGet from './base64TextCompositedGet';
import base64MiffStreamsConcatedGet from 
  './base64MiffStreamsConcatedGet';
import charactersMontageGet from './charactersMontageGet';
import base64FilterAppliedGet 
  from './base64FilterAppliedGet';

const base64BlankGet = () => {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      return fs.readFile(
        path.join(
          process.cwd(),
          'media/blank.jpeg'
        ),
        'base64',
        (
          error,
          res
        ) => {

          if (
            error
          ) {

            return reject(
              error
            );
          }

          return resolve(
            `
              data:image/jpeg;base64,${
                res
              }
            `
              .trim()
          );
        }
      );
    }
  );
};

const moviePosterBase64GetFn = (
  buffer
) => {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      const res = outputResGet();

      const proc = exec(
        `
          convert 
          \\(
            -size ${
              res
            }x${
              res
            }
            xc:"#000" 
          \\)
          \\(
            -
            -resize ${
              res
            }x${
              res
            }
          \\)
          -gravity center
          -compose blend
          -define compose:args=50
          -composite
          jpeg:-
        `
          .split(
            /\s/
          )
          .reduce(
            (
              memo,
              _command
            ) => {

              return `
                ${
                  memo
                } ${
                  _command
                }
              `
                .trim();
            },
            ''
          ),
        {
          encoding: 'base64'
        },
        (
          error,
          stdout
        ) => {

          if (
            error
          ) {

            return reject(
              error
            );
          }

          return resolve(
            `
              data:image/jpeg;base64,${
                stdout
              }
            `
              .trim()
          );
        }
      );

      proc.stdin.write(
        buffer
      );

      proc.stdin.end();
    }
  );
};

const moviePosterBase64Get = (
  moviePoster
) => {

  if (
    !moviePoster
  ) {

    return base64BlankGet();
  }

  return nodeFetch(
    moviePoster
  )
    .then(
      (
        res
      ) => {

        return res.buffer();
      }
    )
    .then(
      (
        buffer
      ) => {

        return moviePosterBase64GetFn(
          buffer
        );
      }
    );
};

const moviePosterFilterAppliedGet = (
  moviePosterBase64
) => {

  return base64FilterAppliedGet(
    {
      base64: moviePosterBase64,
      filterType: 'giphy'
    }
  );
};

const finalCompositedGetFn = (
  finalCompositeMiffStreamsConcated
) => {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      const proc = exec(
        'convert miff:- -gravity north -composite jpeg:-',
        {
          encoding: 'base64'
        },
        (
          error,
          stdout
        ) => {

          if (
            error
          ) {

            return reject(
              error
            );
          }

          return resolve(
            `
              data:image/jpeg;base64,${
                stdout
              }
            `
              .trim()
          );
        }
      );

      finalCompositeMiffStreamsConcated.pipe(
        proc.stdin
      );
    }
  );
};

const finalCompositedGet = async (
  hero,
  movieTitle,
  moviePosterBase64,
  charactersMontageBase64
) => {

  const res = outputResGet();

  const pointsize = 20;

  const border = 10;

  const text = `
    <b>${
      hero.toUpperCase()
    }</b>\\n<small>in</small>\\n${
      movieTitle
    }
  `
    .trim();

  if (
    !charactersMontageBase64
  ) {

    return base64TextCompositedGet(
      moviePosterBase64,
      text,
      res,
      pointsize,
      border
    );
  }

  const finalCompositeMiffStreamsConcated = 
    await base64MiffStreamsConcatedGet(
      [
        moviePosterBase64,
        charactersMontageBase64
      ]
    );

  let splash = await finalCompositedGetFn(
    finalCompositeMiffStreamsConcated
  );

  splash = await base64TextCompositedGet(
    splash,
    text,
    res,
    pointsize,
    border
  );

  return (
    splash
  );
};

export default async (
  {
    title,
    poster,
    characters: _characters
  },
  hero,
  db
) => {

  let moviePosterBase64 = await moviePosterBase64Get(
    poster
  );

  moviePosterBase64 = await moviePosterFilterAppliedGet(
    moviePosterBase64
  );

  const charactersMontageBase64 = 
    await charactersMontageGet(
      _characters,
      db
    );

  const splash = await finalCompositedGet(
    hero,
    title,
    moviePosterBase64,
    charactersMontageBase64
  );

  return (
    splash
  );
};
