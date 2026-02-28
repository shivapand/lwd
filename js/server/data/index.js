'use strict';

import {
  ObjectID
} from 'mongodb';

const listCollections = (
  query = {},
  options = {},
  db
) => {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      return db.listCollections(
        query,
        options
      )
        .toArray(
          (
            error,
            res
          ) => {

            if (
              error
            ) {

              return reject(
                error
              );
            }

            return resolve(
              res
            );
          }
        );
    }
  );
};

const find = (
  query = {},
  options = {},
  collectionName,
  db
) => {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      return db.collection(
        collectionName
      )
        .find(
          query,
          options
        )
        .toArray(
          (
            error,
            res
          ) => {

            if (
              error
            ) {

              return reject(
                error
              );
            }

            return resolve(
              res
            );
          }
        );
    }
  );
};

const findOne = (
  query,
  options,
  collectionName,
  db
) => {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      return db.collection(
        collectionName
      )
        .findOne(
          query,
          options,
          (
            error,
            res
          ) => {

            if (
              error
            ) {

              return reject(
                error
              );
            }

            return resolve(
              res
            );
          }
        );
    }
  );
};

const countDocuments = (
  query = {},
  options = {},
  collectionName,
  db
) => {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      return db.collection(
        collectionName
      )
        .countDocuments(
          query,
          options,
          (
            error,
            res
          ) => {

            if (
              error
            ) {

              return reject(
                error
              );
            }

            return resolve(
              res
            );
          }
        );
    }
  );
};

const findOneAndUpdate = (
  filter,
  update,
  options,
  collectionName,
  db
) => {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      return db.collection(
        collectionName
      )
        .findOneAndUpdate(
          filter,
          update,
          options,
          (
            error,
            {
              value: res
            }
          ) => {

            if (
              error
            ) {

              return reject(
                error
              );
            }

            return resolve(
              res
            );
          }
        );
    }
  );
};

const findOneAndDelete = (
  filter,
  options,
  collectionName,
  db
) => {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      return db.collection(
        collectionName
      )
        .findOneAndDelete(
          filter,
          options,
          (
            error,
            {
              value: res
            }
          ) => {

            if (
              error
            ) {

              return reject(
                error
              );
            }

            return resolve(
              res
            );
          }
        );
    }
  );
};

const deleteMany = (
  filter = {},
  options = {},
  collectionName,
  db
) => {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      return db.collection(
        collectionName
      )
        .deleteMany(
          filter,
          options,
          (
            error,
            res
          ) => {

            if (
              error
            ) {

              return reject(
                error
              );
            }

            return resolve(
              res
            );
          }
        );
    }
  );
};

const connectionNodesRefetch = (
  _slice,
  collectionName,
  db
) => {

  return find(
    {
      _id: {
        $in: _slice.map(
          (
            {
              _id: _sliceId
            }
          ) => {

            return new ObjectID(
              _sliceId
            );
          }
        )
      }
    },
    {
      projection: {},
      sort: {
        _id: 1
      },
      skip: 0,
      limit: 0
    },
    collectionName,
    db
  )
    .then(
      (
        slice
      ) => {

        return _slice.reduce(
          (
            memo,
            {
              _id: _sliceId
            }
          ) => {

            return [
              ...memo,
              slice.find(
                (
                  {
                    _id: sliceId
                  }
                ) => {

                  return (
                    sliceId.toString() ===
                    _sliceId.toString()
                  );
                }
              )
            ];
          },
          []
        );
      }
    );
};

const connectionFromArrayGet = async (
  array,
  argId,
  connectionArgs,
  collectionName,
  db,
  refetch
) => {

  const connectionEmpty = {
    edges: [],
    pageInfo: {
      hasNextPage: false,
      endCursor: null,
      hasPreviousPage: false,
      startCursor: null
    }
  };

  if (
    !array.length
  ) {

    return (
      connectionEmpty
    );
  }

  const {
    first,
    after,
    last,
    before
  } = connectionArgs;

  const afterOffset = (
    after
  ) ?
    array.findIndex(
      (
        _array
      ) => {

        return (
          _array._id
            .toString() ===
          after.toString()
        );
      }
    ) : 
    -1;

  const beforeOffset = (
    before
  ) ?
    array.findIndex(
      (
        _array
      ) => {

        return (
          _array._id.toString() ===
          before.toString()
        );
      }
    ) :
    array.length;

  let startOffset = afterOffset + 1;

  let endOffset = beforeOffset;

  if (
    argId
  ) {

    startOffset = array.findIndex(
      (
        _array
      ) => {

        return (
          _array._id
            .toString() ===
          argId.toString()
        );
      }
    );

    endOffset = startOffset + 1;
  }

  else if (
    first
  ) {

    endOffset = startOffset +
      first;
  }

  else if (
    last
  ) {

    startOffset = Math.max(
      endOffset - last,
      0
    );
  }

  const slice = array.slice(
    startOffset,
    endOffset
  );

  const nodes = (
    refetch
  ) ?
    await connectionNodesRefetch(
      slice,
      collectionName,
      db
    ) :
    slice;

  if (
    !nodes.length
  ) {

    return (
      connectionEmpty
    );
  }

  const edges = nodes.map(
    (
      node
    ) => {

      return {
        cursor: node._id
          .toString(),
        node
      };
    }
  );

  const pageInfo = {
    hasNextPage: (
      endOffset < array.length
    ),
    endCursor: edges[
      edges.length -
      1
    ]
      .cursor,
    hasPreviousPage: (
      startOffset > 0
    ),
    startOffset: edges[
      0
    ]
      .cursor
  };

  return {
    edges,
    pageInfo
  };
};

const connectionGet = (
  query,
  argId,
  connectionArgs,
  sort = {
    _id: 1
  },
  collectionName,
  db,
  refetch = true
) => {

  const projection = (
    refetch
  ) ?
    {
      _id: 1
    } :
    null;

  return find(
    query,
    {
      projection,
      sort,
      skip: 0,
      limit: 0
    },
    collectionName,
    db
  )
    .then(
      (
        array
      ) => {

        return connectionFromArrayGet(
          array,
          argId,
          connectionArgs,
          collectionName,
          db,
          refetch
        );
      }
    );
};

export {
  listCollections,
  find,
  findOne,
  countDocuments,
  findOneAndUpdate,
  findOneAndDelete,
  deleteMany,
  connectionGet
};
