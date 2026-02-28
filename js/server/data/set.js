'use strict';

import {
  ObjectID
} from 'mongodb';

import {
  find,
  findOne,
  countDocuments,
  findOneAndUpdate,
  findOneAndDelete
} from './index';
import {
  actorsBySetIdRemove
} from './actor';

const setCollectionName = 'sets';

const setsFind = (
  query,
  options = {
    projection: {},
    sort: {},
    skip: 0,
    limit: 0
  },
  db
) => {

  return find(
    query,
    options,
    setCollectionName,
    db
  );
};

const setFindOne = (
  query,
  options = {
    projection: {},
    sort: {}
  },
  db
) => {

  return findOne(
    query,
    options,
    setCollectionName,
    db
  );
};

const setCountDocuments = (
  query,
  options,
  db
) => {

  return countDocuments(
    query,
    options,
    setCollectionName,
    db
  );
};

const setCreate = (
  filter,
  update,
  options = {
    upsert: true,
    returnOriginal: false
  },
  db
) => {

  return findOneAndUpdate(
    filter,
    update,
    options,
    setCollectionName,
    db
  );
};

const setRemove = (
  filter,
  options = {
    returnOriginal: true
  },
  db
) => {

  return findOneAndDelete(
    filter,
    options,
    setCollectionName,
    db
  )
    .then(
      async (
        set
      ) => {

        await actorsBySetIdRemove(
          set._id,
          db
        );

        return (
          set
        );
      }
    );
};

const setsByGenreIdRemove = (
  genreId,
  db
) => {

  return setsFind(
    {
      _genreId: new ObjectID(
        genreId
      )
    },
    undefined,
    db
  )
    .then(
      (
        sets
      ) => {

        return sets.reduce(
          (
            memo,
            {
              _id: setId
            }
          ) => {

            return memo.then(
              (
                res
              ) => {

                return setRemove(
                  {
                    _id: new ObjectID(
                      setId
                    )
                  },
                  undefined,
                  db
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
      }
    );
};

export {
  setsFind,
  setFindOne,
  setCountDocuments,
  setCreate,
  setRemove,
  setsByGenreIdRemove
};
