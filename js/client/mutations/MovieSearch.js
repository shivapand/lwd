'use strict';

import {
  commitMutation,
  graphql
} from 'react-relay';

const mutation = graphql`
  mutation MovieSearchMutation(
    $input: MovieSearchInput!
  ) {
    movieSearch(
      input: $input
    ) {
      viewer {
        id
      },
      results {
        title
      }
    }
  }
`;

const commit = (
  variables,
  environment,
  onErrorHandle,
  onCompletedHandle
) => {

  return new Promise(
    (
      resolve
    ) => {

      return commitMutation(
        environment,
        {
          mutation,
          variables,
          onError(
            json
          ) {

            return resolve(
              onErrorHandle(
                json
              )
            );
          },
          onCompleted(
            json
          ) {

            return resolve(
              onCompletedHandle(
                json
              )
            );
          }
        }
      );
    }
  );
};

export default {
  commit
};
