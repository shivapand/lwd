'use strict';

import path from 'path';
import {
  exec
} from 'child_process';

const filtersGet = (
  filterType
) => {

  switch (
    filterType
  ) {

    case (
      'giphy'
    ) :

      return [
        'saturation 0.0'
      ];

    case (
      'dualRole'
    ) :

      return [
        'huemap -h 0,20 -t 60,60'
      ];
  }
};

const base64FilterAppliedGetFn = (
  base64,
  filter
) => {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      const buffer = new Buffer.from(
        base64.replace(
          /^data:image\/(jpeg|png);base64,/,
          ''
        ),
        'base64'
      );

      const filterPath = path.join(
        process.cwd(),
        'js/server/schema/mutations/fns',
        filter
      );

      const proc = exec(
        `
          ${
            filterPath
          } - jpeg:-
        `
          .trim(),
        {
          encoding: 'base64'
        },
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

      proc.stdin.write(
        buffer
      );

      proc.stdin.end();
    }
  );
};

export default async (
  {
    base64: _base64,
    filterType
  }
) => {

  const filters = filtersGet(
    filterType
  );

  const base64 = filters.reduce(
    (
      memo,
      filter
    ) => {

      return memo.then(
        (
          res
        ) => {

          return base64FilterAppliedGetFn(
            res,
            filter
          )
            .then(
              (
                result
              ) => {

                return (
                  result
                );
              }
            );
        }
      );
    },
    Promise.resolve(
      _base64
    )
  );

  return (
    base64
  );
};
