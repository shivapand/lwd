'use strict';

import {
  MongoClient
} from 'mongodb';

export default (
  mongoUri
) => {

  const client = new MongoClient(
    mongoUri,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true
    }
  );

  return client.connect()
    .then(
      (client) => {

        const dbName = client.s.options.dbName || 
          mongoUri.split(/\//).slice(-1)[0].split(/\?/)[0];

        // eslint-disable-next-line no-console
        console.log(
          `mongoClientConnect: connected to ${dbName}`
        );

        return client.db(dbName);
      }
    )
    .catch(
      (error) => {

        // eslint-disable-next-line no-console
        console.error(
          'mongoClientConnect error:',
          error
        );

        throw error;
      }
    );
};
