'use strict';

import path from 'path';
import {
  exec
} from 'child_process';
import shelljs from 'shelljs';

const grabThreshold = 0.25;

export default (
  videoName,
  sourceFolderName,
  videosFolderPathString,
  sourceFolderPathString
) => {

  const videoFilePath = path.join(
    process.cwd(),
    videosFolderPathString,
    videoName
  );

  const sourceFolderPath = path.join(
    process.cwd(),
    sourceFolderPathString,
    sourceFolderName
  );

  shelljs.mkdir(
    sourceFolderPath
  );

  const command = `
   ffmpeg -i "${
    videoFilePath
   }" -filter_complex "select='gt(scene,${
    grabThreshold
   })',metadata=print:file=time.txt" -vsync vfr "${
    sourceFolderPath
   }"/img%03d.jpeg 
  `
    .trim();

  return new Promise(
    (
      resolve,
      reject
    ) => {

      return exec(
        command,
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
  );
};
