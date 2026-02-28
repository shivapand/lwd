'use strict';

import fs from 'fs';
import path from 'path';

export default () => {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      const mediaOutputFolderPath = path.join(
        process.cwd(),
        'media/output'
      );

      if (
        !fs.existsSync(
          mediaOutputFolderPath
        )
      ) {

        return fs.mkdir(
          mediaOutputFolderPath,
          {},
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
              res
            );
          }
        );
      }

      return resolve(
        null
      );
    }
  );
};
