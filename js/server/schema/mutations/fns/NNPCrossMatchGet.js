'use strict';

import combinations from 'combinations';

import wordsTokenizedGet from './wordsTokenizedGet';

const characterStringMatchedGet = (
  character,
  _character
) => {

  return (
    character ===
    _character
  ) ?
    '0' :
    null;
};

const characterTokenizedGet = (
  character
) => {

  return wordsTokenizedGet(
    character
  )
    .map(
      (
        {
          text
        }
      ) => {

        return (
          text
        );
      }
    );
};

const characterTokensMatchedGet = (
  character,
  _character
) => {

  const characterTokenCombinations = combinations(
    characterTokenizedGet(
      character
    )
  )
    .reduce(
      (
        memo,
        characterTokenCombination
      ) => {

        return [
          ...memo,
          characterTokenCombination.join(
            ' '
          )
        ];
      },
      []
    );

  const _characterTokenCombinations = combinations(
    characterTokenizedGet(
      _character
    )
  )
    .reduce(
      (
        memo,
        _characterTokenCombination
      ) => {

        return [
          ...memo,
          _characterTokenCombination.join(
            ' '
          )
        ];
      },
      []
    );

  const characterToken = _characterTokenCombinations.find(
    (
      _characterToken
    ) => {

      return characterTokenCombinations.find(
        (
          characterToken
        ) => {

          return (
            characterToken ===
            _characterToken
          );
        }
      );
    }
  );

  return (
    characterToken
  ) ?
    '1' :
    null;
};

export default (
  character,
  _character,
  strict = false
) => {

  if (
    !character ||
    !_character
  ) {

    return (
      null
    );
  }

  let NNPmatchIndexString;

  switch (
    true
  ) {

    case (
      (
        NNPmatchIndexString = characterStringMatchedGet(
          character,
          _character
        )
      ) &&
      !!NNPmatchIndexString
    ) :
    case (
      !strict &&
      (
        NNPmatchIndexString = characterTokensMatchedGet(
          character,
          _character
        )
      ) &&
      !!NNPmatchIndexString
    ) :

      return (
        {
          text: character,
          NNPmatchIndex: parseInt(
            NNPmatchIndexString
          )
        }
      );
  }
};
