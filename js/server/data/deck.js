'use strict';

import {
  find,
  findOne,
  countDocuments,
  findOneAndUpdate,
  connectionGet
} from './index';

const deckCollectionName = 'decks';

const deckFind = (
  query,
  options,
  db
) => {

  return find(
    query,
    options,
    deckCollectionName,
    db
  );
};

const deckFindOne = (
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
    deckCollectionName,
    db
  );
};

const deckCountDocuments = (
  query,
  options,
  db
) => {

  return countDocuments(
    query,
    options,
    deckCollectionName,
    db
  );
};

const deckCreate = (
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
    deckCollectionName,
    db
  );
};

const deckConnectionGet = (
  deckId,
  connectionArgs,
  db
) => {

  return connectionGet(
    {},
    deckId,
    connectionArgs,
    undefined,
    deckCollectionName,
    db,
    undefined
  );
};

export {
  deckFind,
  deckFindOne,
  deckCountDocuments,
  deckCreate,
  deckConnectionGet
};
