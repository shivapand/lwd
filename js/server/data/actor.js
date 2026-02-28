'use strict';

import {
  ObjectID
} from 'mongodb';

import {
  find,
  findOneAndUpdate,
  findOneAndDelete
} from './index';
import {
  actorImagesByActorIdRemove
} from './actorImage';

const actorCollectionName = 'actors';

const actorsFind = (
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
    actorCollectionName,
    db
  );
};

const actorCreate = (
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
    actorCollectionName,
    db
  );
};

const actorRemove = (
  filter,
  options = {
    returnOriginal: true
  },
  db
) => {

  return findOneAndDelete(
    filter,
    options,
    actorCollectionName,
    db
  )
    .then(
      async (
        actor
      ) => {

        await actorImagesByActorIdRemove(
          actor._id,
          db
        );

        return (
          actor
        );
      }
    );
};

const actorsBySetIdRemove = (
  setId,
  db
) => {

  return actorsFind(
    {
      _setId: new ObjectID(
        setId
      )
    },
    undefined,
    db
  )
    .then(
      (
        actors
      ) => {

        return actors.reduce(
          (
            memo,
            {
              _id: actorId
            }
          ) => {

            return memo.then(
              (
                res
              ) => {

                return actorRemove(
                  {
                    _id: new ObjectID(
                      actorId
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
  actorsFind,
  actorCreate,
  actorRemove,
  actorsBySetIdRemove
};
