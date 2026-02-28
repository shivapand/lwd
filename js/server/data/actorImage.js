'use strict';

import {
  ObjectID
} from 'mongodb';

import {
  find,
  findOne,
  findOneAndUpdate,
  findOneAndDelete
} from './index';

const actorImageCollectionName = 'actorImages';

const actorImagesFind = (
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
    actorImageCollectionName,
    db
  );
};

const actorImageFindOne = (
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
    actorImageCollectionName,
    db
  );
};

const actorImageCreate = (
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
    actorImageCollectionName,
    db
  );
};

const actorImageRemove = (
  filter,
  options = {
    returnOriginal: true
  },
  db
) => {

  return findOneAndDelete(
    filter,
    options,
    actorImageCollectionName,
    db
  );
};

const actorImagesByActorIdRemove = (
  actorId,
  db
) => {

  return actorImagesFind(
    {
      _actorId: new ObjectID(
        actorId
      )
    },
    {
      projection: {
        _id: 1
      },
      sort: {},
      skip: 0,
      limit: 0
    },
    db
  )
    .then(
      (
        actorImages
      ) => {

        return actorImages.reduce(
          (
            memo,
            {
              _id: actorImageId
            }
          ) => {

            return memo.then(
              (
                res
              ) => {

                return actorImageRemove(
                  {
                    _id: new ObjectID(
                      actorImageId
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
  actorImagesFind,
  actorImageFindOne,
  actorImageCreate,
  actorImageRemove,
  actorImagesByActorIdRemove
};
