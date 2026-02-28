'use strict';

import {
  ObjectID
} from 'mongodb';

import {
  listCollections,
  find,
  findOne,
  findOneAndUpdate,
  deleteMany
} from '~/js/server/data';

const collectionNamesMask = [
  'movies'
];

const collectionNamesFetch = (
  dbLocal
) => {

  return listCollections(
    undefined,
    undefined,
    dbLocal
  )
    .then(
      (
        res
      ) => {

        const collectionNames = res.reduce(
          (
            memo,
            _res
          ) => {

            const collectionName = _res.name;

            if (
              !collectionNamesMask.find(
                (
                  collectionNameMask
                ) => {

                  return (
                    collectionNameMask ===
                    collectionName
                  );
                }
              )
            ) {

              return [
                ...memo,
                collectionName
              ];
            }

            return (
              memo
            );
          },
          []
        );

        return (
          collectionNames
        );
      }
    );
};

const idsGet = (
  collectionName,
  db
) => {

  return find(
    {},
    {
      projection: {
        _id: true
      }
    },
    collectionName,
    db
  )
    .then(
      (
        res
      ) => {

        return res.map(
          (
            {
              _id
            }
          ) => {

            return (
              _id
            );
          }
        );
      }
    );
};

const idExistsGet = (
  id,
  ids
) => {

  return ids.find(
    (
      _id
    ) => {

      return (
        _id.toString() ===
        id.toString()
      );
    }
  );
};

const idsToRemoveGet = (
  idsLocal,
  idsRemote
) => {

  return idsRemote.reduce(
    (
      memo,
      idRemote
    ) => {

      const exists = idExistsGet(
        idRemote,
        idsLocal
      );

      if (
        !exists
      ) {

        return [
          ...memo,
          idRemote
        ];
      }

      return (
        memo
      );
    },
    []
  );
};

const removeRun = (
  idsLocal,
  idsRemote,
  collectionName,
  dbRemote
) => {

  const ids = idsToRemoveGet(
    idsLocal,
    idsRemote
  );

  return deleteMany(
    {
      _id: {
        $in: ids.map(
          (
            id
          ) => {

            return new ObjectID(
              id
            );
          }
        )
      }
    },
    undefined,
    collectionName,
    dbRemote
  );
};

const idsToCreateGet = (
  idsLocal,
  idsRemote
) => {

  return idsLocal.reduce(
    (
      memo,
      idLocal
    ) => {

      const exists = idExistsGet(
        idLocal,
        idsRemote
      );

      if (
        !exists
      ) {

        return [
          ...memo,
          idLocal
        ];
      }

      return (
        memo
      );
    },
    []
  );
};

const createRunFn = (
  id,
  collectionName,
  dbLocal,
  dbRemote
) => {

  return findOne(
    {
      _id: new ObjectID(
        id
      )
    },
    undefined,
    collectionName,
    dbLocal
  )
    .then(
      (
        {
          _id,
          ...res
        }
      ) => {

        return findOneAndUpdate(
          {
            _id: new ObjectID(
              _id
            )
          },
          {
            $set: res
          },
          {
            upsert: true
          },
          collectionName,
          dbRemote
        );
      }
    );
};

const createRun = (
  idsLocal,
  idsRemote,
  collectionName,
  dbLocal,
  dbRemote
) => {

  const ids = idsToCreateGet(
    idsLocal,
    idsRemote
  );

  return ids.reduce(
    (
      memo,
      id
    ) => {

      return memo.then(
        (
          res
        ) => {

          return createRunFn(
            id,
            collectionName,
            dbLocal,
            dbRemote
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
};

const syncRunFn = async (
  collectionName,
  dbLocal,
  dbRemote
) => {

  const idsLocal = await idsGet(
    collectionName,
    dbLocal
  );

  const idsRemote = await idsGet(
    collectionName,
    dbRemote
  );

  await removeRun(
    idsLocal,
    idsRemote,
    collectionName,
    dbRemote
  );

  await createRun(
    idsLocal,
    idsRemote,
    collectionName,
    dbLocal,
    dbRemote
  );
};

const syncRun = (
  collectionNames,
  dbLocal,
  dbRemote
) => {

  return collectionNames.reduce(
    (
      memo,
      collectionName
    ) => {

      return memo.then(
        (
          res
        ) => {

          return syncRunFn(
            collectionName,
            dbLocal,
            dbRemote
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
};

export default async (
  dbLocal,
  dbRemote
) => {

  const collectionNames = await collectionNamesFetch(
    dbLocal
  );

  await syncRun(
    collectionNames,
    dbLocal,
    dbRemote
  );
};
