'use strict';

const NNPExistsGet = (
  {
    text
  },
  _NNPs
) => {

  return _NNPs.find(
    (
      {
        text: _text
      }
    ) => {

      return (
        _text ===
        text
      );
    }
  );
};

export default (
  NNPs
) => {

  return NNPs.reduce(
    (
      memo,
      NNP
    ) => {

      const exists = NNPExistsGet(
        NNP,
        memo
      );

      if (
        !exists
      ) {

        return [
          ...memo,
          NNP
        ];
      }

      return (
        memo
      );
    },
    []
  );
};
