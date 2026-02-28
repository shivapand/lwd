'use strict';

import NNPCrossMatchGet from './NNPCrossMatchGet';

export default (
  NNP,
  _NNPs,
  strict
) => {

  const matches = _NNPs.reduce(
    (
      memo,
      _NNP
    ) => {

      const match = NNPCrossMatchGet(
        NNP.text,
        _NNP.text,
        strict
      );

      if (
        match
      ) {

        return [
          ...memo ||
          [],
          {
            ...match,
            NNPIndex: NNP.index,
            _NNPIndex: _NNP.index
          }
        ];
      }

      return (
        memo
      );
    },
    null
  );

  return (
    matches
  );
};

