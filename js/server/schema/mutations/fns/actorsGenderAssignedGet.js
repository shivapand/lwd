'use strict';

import actorGenderGet 
  from './actorGenderGet';

export default (
  actors
) => {

  return actors.reduce(
    (
      memo,
      actor
    ) => {

      return memo.then(
        (
          res
        ) => {

          return actorGenderGet(
            actor
          )
            .then(
              (
                result
              ) => {

                return [
                  ...res,
                  {
                    ...actor,
                    gender: result
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
