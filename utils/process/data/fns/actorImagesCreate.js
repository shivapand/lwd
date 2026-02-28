'use strict';

import fs from 'fs';
import path from 'path';
import shelljs from 'shelljs';
import {
  ObjectID
} from 'mongodb';
import {
  exec
} from 'child_process';

import {
  actorImageCreate
} from '~/js/server/data/actorImage';

const imageResize = (
  base64
) => {

  const buffer = new Buffer.from(
    base64,
    'base64'
  );

  return new Promise(
    (
      resolve,
      reject
    ) => {

      const res = 480;

      const proc = exec(
        `
          convert - -resize ${
            res
          }x${
            res
          }^ -gravity center -crop ${
            res
          }x${
            res
          }+0+0 -background "#fff" jpeg:-
        `
          .trim(),
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
            stdout
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

const actorImagesGetFn = (
  actorImagePath
) => {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      return fs.readFile(
        actorImagePath,
        'base64',
        async (
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

          let _base64 = res;

          _base64 = await imageResize(
            _base64
          );

          const base64 = `
            data:image/jpeg;base64,${
              _base64
            }
          `
            .trim();

          return resolve(
            base64
          );
        }
      );
    }
  );
};

const actorImagesGet = (
  actorImagePaths
) => {

  return actorImagePaths.reduce(
    (
      memo,
      actorImagePath
    ) => {

      return memo.then(
        (
          res
        ) => {

          return actorImagesGetFn(
            actorImagePath
          )
            .then(
              (
                result
              ) => {

                return [
                  ...res,
                  result
                ];
              }
            );
        }
      );
    },
    Promise.resolve(
      []
    )
  );
};

const _actorImagesCreateFn = (
  actorImages,
  actorId,
  dbLocal
) => {

  return actorImages.reduce(
    (
      memo,
      base64
    ) => {

      return memo.then(
        (
          res
        ) => {

          return actorImageCreate(
            {
              _id: new ObjectID()
            },
            {
              $set: {
                _actorId: new ObjectID(
                  actorId
                ),
                base64
              }
            },
            undefined,
            dbLocal
          )
            .then(
              (
                result
              ) => {

                return [
                  ...res,
                  result
                ];
              }
            );
        }
      );
    },
    Promise.resolve(
      []
    )
  );
};

const actorImagesCreateFn = async (
  actorId,
  setFolderPath,
  dbLocal
) => {

  const actorImagePaths = [
    ...shelljs.ls(
      setFolderPath
    )
  ]
    .map(
      (
        actorImage
      ) => {

        return path.join(
          setFolderPath,
          actorImage
        );
      }
    );

  const actorImages = await actorImagesGet(
    actorImagePaths
  );

  return _actorImagesCreateFn(
    actorImages,
    actorId,
    dbLocal
  );
};

export default (
  actors,
  setFolderPathString,
  dbLocal
) => {

  return actors.reduce(
    (
      memo,
      {
        _id: actorId,
        text: actorText
      }
    ) => {

      return memo.then(
        (
          res
        ) => {

          const setFolderPath = path.join(
            process.cwd(),
            setFolderPathString,
            actorText
          );

          return actorImagesCreateFn(
            actorId,
            setFolderPath,
            dbLocal
          )
            .then(
              (
                result
              ) => {

                return [
                  ...res,
                  ...result
                ];
              }
            );
        }
      );
    },
    Promise.resolve(
      []
    )
  );
};
