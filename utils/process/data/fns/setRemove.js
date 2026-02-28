'use strict';

import {
  ObjectID
} from 'mongodb';

import {
  setRemove
} from '~/js/server/data/set';

export default (
  setId,
  dbLocal
) => {

  return setRemove(
    {
      _id: new ObjectID(
        setId
      )
    },
    undefined,
    dbLocal
  );
};
