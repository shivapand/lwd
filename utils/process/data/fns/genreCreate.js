'use strict';

import {
  ObjectID
} from 'mongodb';

import {
  genreFindOne,
  genreCreate
} from '~/js/server/data/genre';

export default async (
  genreText,
  dbLocal
) => {

  if (
    !genreText
  ) {

    return Promise.reject(
      'required'
    );
  }

  const exists = await genreFindOne(
    {
      text: genreText
    },
    undefined,
    dbLocal
  );

  if (
    exists
  ) {

    return Promise.reject(
      'exists'
    );
  }

  return genreCreate(
    {
      _id: new ObjectID()
    },
    {
      $set: {
        text: genreText
      }
    },
    undefined,
    dbLocal
  );
};
