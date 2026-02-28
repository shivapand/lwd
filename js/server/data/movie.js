'use strict';

import {
  findOne,
  findOneAndUpdate
} from './index';

const movieCollectionName = 'movies';

const movieFindOne = (
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
    movieCollectionName,
    db
  );
};

const movieCreate = (
  filter,
  update,
  options = {
    upsert: true,
    returnOriginal: false
  },
  db,
) => {

  return findOneAndUpdate(
    filter,
    update,
    options,
    movieCollectionName,
    db
  );
};

export {
  movieFindOne,
  movieCreate
};
