'use strict';

import path from 'path';
import fs from 'fs';
import {
  graphql
} from 'graphql';
import {
  getIntrospectionQuery
} from 'graphql/utilities';

import schema from '~/js/server/schema';

export default () => {

  return graphql(
    schema,
    getIntrospectionQuery()
  )
    .then(
      (
        json
      ) => {

        return new Promise(
          (
            resolve,
            reject
          ) => {

            return fs.writeFile(
              path.join(
                process.cwd(),
                'schema.json'
              ),
              JSON.stringify(
                json,
                null,
                2
              ),
              (
                error
              ) => {

                if (
                  error
                ) {

                  return reject(
                    error
                  );
                }

                return resolve(
                  null
                );
              }
            );
          }
        );
      }
    );
};
