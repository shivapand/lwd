'use strict';

import plotNNPsGet from './plotNNPsGet';
import NNPsCrossMatchesGet from './NNPsCrossMatchesGet';

const _NNPsGet = (
  characters
) => {

  return characters.map(
    (
      {
        text
      },
      index
    ) => {

      return {
        text,
        index
      }; 
    }
  );
};

const cardGet = (
  sentence,
  characters
) => {

  const NNPs = plotNNPsGet(
    [
      sentence
    ]
  );

  const _NNPs = _NNPsGet(
    characters
  );

  const matches = NNPsCrossMatchesGet(
    NNPs,
    _NNPs,
    true
  );

  return matches.map(
    (
      match
    ) => {

      const NNP = NNPs[
        match.NNPIndex
      ];

      return {
        ...characters[
          match._NNPIndex
        ],
        distance: NNP.distance
      };
    }
  );
};

export default (
  plot,
  _characters
) => {

  const cards = plot.reduce(
    (
      memo,
      sentence
    ) => {

      const characters = cardGet(
        sentence,
        _characters
      );

      const card = {
        ...sentence,
        characters
      };

      return [
        ...memo,
        card
      ];
    },
    []
  );

  return (
    cards
  );
};
