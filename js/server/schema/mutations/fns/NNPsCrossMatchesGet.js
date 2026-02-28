'use strict';

import NNPCrossMatchesGet from './NNPCrossMatchesGet';

export default (
  NNPs,
  _NNPs,
  strict
) => {

  const matches = NNPs.reduce(
    (
      memo,
      NNP
    ) => {

      let matches = NNPCrossMatchesGet(
        NNP,
        _NNPs,
        strict
      );

      if (
        matches
      ) {

        return [
          ...memo,
          ...matches
        ];
      }

      return (
        memo
      );
    },
    []
  );

  return (
    matches
  );
};
