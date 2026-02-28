'use strict';

import {
  ObjectID
} from 'mongodb';

import {
  genreRemove
} from '~/js/server/data/genre';

export default (
  genreId,
  dbLocal
) => {

  return genreRemove(
    {
      _id: new ObjectID(
        genreId
      )
    },
    undefined,
    dbLocal
  );
};
