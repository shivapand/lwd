'use strict';

import fs from 'fs';
import path from 'path';

export default (
  (
    movie
  ) => {

    const outputPath = path.join(
      process.cwd(),
      `
        media${
          movie.path
        }
      `
        .trim()
    );

    return new Promise(
      (
        resolve,
        reject
      ) => {

        return fs.writeFile(
          outputPath,
          movie.base64.replace(
            /^data:image\/gif;base64,/,
            ''
          ),
          'base64',
          (
            error
          ) => {

            if (
              error
            ) {

              return reject(
                error
              );
            }

            return resolve(
              movie
            );
          }
        );
      }
    );
  }
);
