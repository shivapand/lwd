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
  setsByGenreIdRemove
} from './set';

const genreCollectionName = 'genres';

const genresFind = (
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
    genreCollectionName,
    db
  );
};

const genreFindOne = (
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
    genreCollectionName,
    db
  );
};

const genreCountDocuments = (
  query,
  options,
  db
) => {

  return countDocuments(
    query,
    options,
    genreCollectionName,
    db
  );
};

const genreCreate = (
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
    genreCollectionName,
    db
  );
};

const genreRemove = (
  filter,
  options = {
    returnOriginal: true
  },
  db
) => {

  return findOneAndDelete(
    filter,
    options,
    genreCollectionName,
    db
  )
    .then(
      async (
        genre
      ) => {

        await setsByGenreIdRemove(
          genre._id,
          db
        );

        return (
          genre
        );
      }
    );
};

const genresRemove = (
  db
) => {

  return genresFind(
    undefined,
    undefined,
    db
  )
    .then(
      (
        genres
      ) => {

        return genres.reduce(
          (
            memo,
            {
              _id: genreId
            }
          ) => {

            return memo.then(
              (
                res
              ) => {

                return genreRemove(
                  {
                    _id: new ObjectID(
                      genreId
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
  genresFind,
  genreFindOne,
  genreCountDocuments,
  genreCreate,
  genreRemove,
  genresRemove
};
