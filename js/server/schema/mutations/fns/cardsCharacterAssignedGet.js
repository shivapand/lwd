'use strict';

const charactersPreviousGet = (
  cards
) => {

  return cards.reduce(
    (
      memo,
      {
        character
      }
    ) => {

      if (
        character
      ) {

        return [
          ...memo,
          character
        ];
      }

      return (
        memo
      );
    },
    []
  );
};

const charactersWeightedGetFn = (
  character,
  charactersPrevious
) => {

  return charactersPrevious.reduce(
    (
      memo,
      _charactersPrevious,
      index
    ) => {

      if (
        _charactersPrevious.actor.text ===
        character.actor.text
      ) {

        return {
          ...memo,
          count: memo.count + 1,
          nearest: charactersPrevious.length - (
            index + 1
          )
        };
      }

      return (
        memo
      );
    },
    {
      ...character,
      count: 0,
      nearest: charactersPrevious.length
    }
  );
};

const charactersWeightedGet = (
  characters,
  charactersPrevious
) => {

  return characters.reduce(
    (
      memo,
      character
    ) => {

      return [
        ...memo,
        charactersWeightedGetFn(
          character,
          charactersPrevious
        )
      ];
    },
    []
  );
};

const _characterAssignedGetFn = (
  charactersWeighted
) => {

  return charactersWeighted.sort(
    (
      a, b
    ) => {

      switch (
        true
      ) {

        case (
          a.nearest >
          b.nearest
        ) :

          return -1;

        case (
          b.nearest >
          a.nearest
        ) :

          return 1;

        case (
          a.count >
          b.count
        ) :

          return 1;

        case (
          b.count >
          a.count
        ) :

          return -1;

        case (
          a.castIndex >
          b.castIndex
        ) :

          return 1;

        case (
          b.castIndex >
          a.castIndex
        ) :

          return -1;
      }
    }
  )[
    0
  ];
};

const characterAssignedGetFn = (
  card,
  charactersPrevious
) => {

  const charactersWeighted = charactersWeightedGet(
    card.characters,
    charactersPrevious
  );

  let character = _characterAssignedGetFn(
    charactersWeighted
  );

  delete character?.count;

  delete character?.nearest;

  return {
    ...card,
    character
  };
};

export default (
  _cards
) => {

  const cards = _cards.reduce(
    (
      memo,
      _card
    ) => {

      const charactersPrevious = charactersPreviousGet(
        memo
      );

      const card = characterAssignedGetFn(
        _card,
        charactersPrevious
      );

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
