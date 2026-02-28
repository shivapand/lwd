'use strict';

import {
  ObjectID
} from 'mongodb';

import {
  setCreate
} from '~/js/server/data/set';
import actorsCreate from './actorsCreate';
import actorImagesCreate from './actorImagesCreate';

export default async (
  genreId,
  setText,
  dbLocal,
  sourceFolderPathString
) => {

  const set = await setCreate(
    {
      _id: new ObjectID()
    },
    {
      $set: {
        _genreId: new ObjectID(
          genreId
        ),
        text: setText
      }
    },
    undefined,
    dbLocal
  );

  const setFolderPathString = `
            ${
              sourceFolderPathString
            }/${
              set.text
            }
          `
    .trim();

  const actors = await actorsCreate(
    set._id,
    setFolderPathString,
    dbLocal
  );

  await actorImagesCreate(
    actors,
    setFolderPathString,
    dbLocal
  );

  return (
    null
  );
};
