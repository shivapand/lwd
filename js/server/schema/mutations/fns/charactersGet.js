'use strict';

import plotNNPsGet from './plotNNPsGet';
import castNNPsGet from './castNNPsGet';
import NNPsCrossMatchesGet from './NNPsCrossMatchesGet';
import charactersCulledByCategoryGet
  from './charactersCulledByCategoryGet';

const matchesDataAssignedGet = (
  matches,
  _NNPs,
  __NNPs
) => {

  const fullMatches = matches.filter(
    (
      match
    ) => {

      return (
        !match.NNPmatchIndex
      );
    }
  );

  return matches.reduce(
    (
      memo,
      _cross
    ) => {

      const NNP = _NNPs[
        _cross.NNPIndex
      ];

      const _NNP = __NNPs[
        _cross._NNPIndex
      ];

      const fullMatchExists = !!(
        fullMatches.find(
          (
            fullMatch
          ) => {

            return (
              fullMatch.text ===
              _NNP.text
            );
          }
        )
      );

      return [
        ...memo,
        {
          _cross,
          NNP,
          _NNP,
          fullMatchExists
        }
      ];
    },
    []
  );
};

const matchesSortedGet = (
  matches
) => {

  return matches.sort(
    (
      a, b
    ) => {

      switch (
        true
      ) {

        case (
          a._NNP.possessive &&
          !b._NNP.possessive
        ) :

          return 1;

        case (
          b._NNP.possessive &&
          !a._NNP.possessive
        ) :

          return -1;

        case (
          a.fullMatchExists &&
          !b.fullMatchExists
        ) :

          return -1;

        case (
          b.fullMatchExists &&
          !a.fullMatchExists
        ) :

          return 1;

        case (
          a._NNP._distance >
          b._NNP._distance
        ) :

          return 1;

        case (
          b._NNP._distance >
          a._NNP._distance
        ) :

          return -1;

        case(
          a._cross.NNPmatchIndex >
          b._cross.NNPmatchIndex
        ) :

          return 1;

        case (
          b._cross.NNPmatchIndex >
          a._cross.NNPmatchIndex
        ) :

          return -1;

        case (
          a._NNP.castIndex >
          b._NNP.castIndex
        ) :

          return 1;

        case (
          b._NNP.castIndex >
          a._NNP.castIndex
        ) :

          return -1;
      }
    }
  );
};

const matchExistsGet = (
  match,
  _matches
) => {

  return _matches.find(
    (
      _match
    ) => {

      const matchText = match._cross.text;

      const _matchText = _match._cross.text;

      return (
        (
          _matchText ===
          matchText
        )
      );
    }
  );
};

const matchesUniqueGet = (
  matches
) => {

  return matches.reduce(
    (
      memo,
      match
    ) => {

      const exists = matchExistsGet(
        match,
        memo
      );

      if (
        !exists
      ) {

        return [
          ...memo,
          match
        ];
      }

      return (
        memo
      );
    },
    []
  );
};

const charactersGet = (
  matches,
  cast
) => {

  return matches.reduce(
    (
      memo,
      {
        _cross: {
          text
        },
        _NNP: {
          castIndex
        }
      }
    ) => {

      const character = {
        text,
        actor: cast[
          castIndex
        ]
          .actor,
        castIndex
      };

      return [
        ...memo,
        character
      ];
    },
    []
  );
};

export default async (
  cast,
  plot,
  plotText
) => {

  const NNPs = plotNNPsGet(
    plot
  );

  const _NNPs = castNNPsGet(
    cast
  );

  let matches = NNPsCrossMatchesGet(
    NNPs,
    _NNPs,
    false
  );

  matches = matchesDataAssignedGet(
    matches,
    NNPs,
    _NNPs
  );

  matches = matchesSortedGet(
    matches
  );

  matches = matchesUniqueGet(
    matches
  );

  let characters = charactersGet(
    matches,
    cast
  );

  characters = await charactersCulledByCategoryGet(
    characters,
    plotText
  );

  return (
    characters
  );
};
