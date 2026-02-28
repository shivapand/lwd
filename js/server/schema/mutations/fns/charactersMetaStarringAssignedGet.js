'use strict';

const starringCharactersGet = (
  cards
) => {

  return cards.reduce(
    (
      memo,
      card,
      cardIndex
    ) => {

      const starringCardIndex = memo.findIndex(
        (
          _memo
        ) => {

          return (
            _memo.text ===
            card.character?.text
          );
        }
      );

      switch (
        true
      ) {

        case (
          !card.character
        ) :

          return (
            memo
          );

        case (
          starringCardIndex >=
          0
        ) :

          return [
            ...memo.slice(
              0, starringCardIndex
            ),
            {
              ...memo[
                starringCardIndex
              ],
              starringCardIndexes: [
                ...memo[
                  starringCardIndex
                ]
                  .starringCardIndexes,
                cardIndex
              ]
            },
            ...memo.slice(
              starringCardIndex + 
              1
            )
          ];

        default :

          return [
            ...memo,
            {
              ...card.character,
              starringCardIndexes: [
                cardIndex
              ]
            }
          ];
      }
    },
    []
  );
};

const charactersStarringCardIndexesAssignedGet = (
  characters,
  cards
) => {

  const starringCharacters = starringCharactersGet(
    cards
  );

  return characters.reduce(
    (
      memo,
      character
    ) => {

      const match = starringCharacters.find(
        (
          starringCharacter
        ) => {

          return (
            starringCharacter.text ===
            character.text
          );
        }
      );

      return [
        ...memo,
        {
          ...character,
          starringCardIndexes: (
            match
          ) ?
            match.starringCardIndexes :
            null
        }
      ];
    },
    []
  );
};

const charactersSortedByStarringCardIndexesGet = (
  characters
) => {

  return characters.sort(
    (
      a, b
    ) => {

      switch (
        true
      ) {

        case (
          a.starringCardIndexes &&
          !b.starringCardIndexes
        ) :

          return -1;

        case (
          b.starringCardIndexes &&
          !a.starringCardIndexes
        ) :

          return 1;

        case (
          a.starringCardIndexes?.[
            0
          ] >
          b.starringCardIndexes?.[
            0
          ]
        ) :

          return 1;

        case (
          b.starringCardIndexes?.[
            0
          ] >
          a.starringCardIndexes?.[
            0
          ]
        ) :

          return -1;
      }
    }
  );
};

const charactersStarringIndexAssignedGet = (
  characters
) => {

  return characters.map(
    (
      character,
      starringIndex
    ) => {

      return {
        ...character,
        starringIndex
      };
    }
  );
};

export default (
  _characters,
  cards
) => {

  let characters = charactersStarringCardIndexesAssignedGet(
    _characters,
    cards
  );

  characters = charactersSortedByStarringCardIndexesGet(
    characters
  );

  characters = charactersStarringIndexAssignedGet(
    characters
  );

  return (
    characters
  );
};
