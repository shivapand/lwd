'use strict';

import {
  ObjectID
} from 'mongodb';
import nodeFetch from 'node-fetch';

import {
  actorImageFindOne
} from '~/js/server/data/actorImage';

const actorImageGet = (
  actorImageId,
  db
) => {

  return actorImageFindOne(
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
        {
          base64
        }
      ) => {

        return (
          base64
        );
      }
    );
};

const gifyImageGet = (
  gifyUrl
) => {

  return nodeFetch(
    gifyUrl
  )
    .then(
      (
        res
      ) => {

        return res.buffer();
      }
    )
    .then(
      (
        buffer
      ) => {

        return `
          data:image/jpeg;base64,${
            buffer.toString(
              'base64'
            )
          }
        `
          .trim();
      }
    );
};

const cardsBase64AssignedGetFn = (
  {
    actorImageId,
    gifyUrl
  },
  db
) => {

  return (
    actorImageId
  ) ?
    actorImageGet(
      actorImageId,
      db
    ) :
    gifyImageGet(
      gifyUrl
    );
};

export default (
  _cards,
  db
) => {

  return _cards.reduce(
    (
      memo,
      _card
    ) => {

      return memo.then(
        (
          res
        ) => {

          return cardsBase64AssignedGetFn(
            _card,
            db
          )
            .then(
              (
                result
              ) => {

                return [
                  ...res,
                  {
                    ..._card,
                    base64: result
                  }
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
