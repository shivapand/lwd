'use strict';

import {
  MongoClient
} from 'mongodb';

export default (
  mongoUri
) => {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      const dbName = mongoUri.split(
        /\//
      )
        .slice(
          -1
        )[
          0
        ];

      return new MongoClient.connect(
        mongoUri,
        {
          useUnifiedTopology: true
        },
        (
          error,
          client
        ) => {

          if (
            error
          ) {

            return reject(
              error
            );
          }

          // eslint-disable-next-line no-console
          console.log(
            `
              mongoClientConnect: ${
                mongoUri
              }
            `
              .trim()
          );

          return resolve(
            client.db(
              dbName
            )
          );
        }
      );
    }
  );
};
