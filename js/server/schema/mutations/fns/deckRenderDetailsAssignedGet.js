'use strict';

const charactersRenderTextAssignedGetFn = (
  _text,
  lengthMax
) => {

  let text = _text.slice(
    0, lengthMax
  );

  if (
    text.length <
    _text.length
  ) {

    text = `
      ${
        text
      }..
    `
      .trim();
  }

  return (
    text
  );
};

const charactersRenderTextAssignedGet = (
  characters
) => {

  const lengthMax = 20;

  return characters.reduce(
    (
      memo,
      character
    ) => {

      const renderText = charactersRenderTextAssignedGetFn(
        character.text,
        lengthMax
      );

      return [
        ...memo,
        {
          ...character,
          renderText
        }
      ];
    },
    []
  );

};

const charactersSortedBySplashIndexGet = (
  _characters
) => {

  let characters = [
    ..._characters.filter(
      (
        _character
      ) => {

        return (
          _character.splashIndex >=
          0
        );
      }
    )
      .sort(
        (
          a, b
        ) => {

          switch (
            true
          ) {

            case (
              a.splashIndex >
              b.splashIndex
            ) :

              return 1;

            case (
              b.splashIndex >
              a.splashIndex
            ) :

              return -1;
          }
        }
      ),
    ..._characters.filter(
      (
        _character
      ) => {

        return (
          _character.splashIndex ===
          -1
        );
      }
    )
  ];

  return (
    characters
  );
};

const charactersRenderDetailAssignedGet = (
  _characters
) => {

  let characters = charactersRenderTextAssignedGet(
    _characters
  );

  characters = charactersSortedBySplashIndexGet(
    characters
  );

  return (
    characters
  );
};

const cardTextGet = (
  {
    text,
    characters: cardCharacters
  }
) => {

  return (!cardCharacters?.length)
    ? text
    : [...cardCharacters]
      .sort(
        (a, b) => b.text.length - a.text.length
      )
      .reduce(
        (memo, character) => {

          return (
            !['hero', 'heroine', 'villain']
              .includes(character.role)
          )
            ? memo
            : memo.replace(
              character.text,
              `<b>${character.text}</b>`
            );
        },
        text
      );
};

const cardGet = (
  card
) => {

  const renderText = cardTextGet(
    card
  );

  return {
    ...card,
    renderText
  };
};

const cardsRenderTextAssignedGet = (
  cards
) => {

  return cards.reduce(
    (
      memo,
      _card
    ) => {

      const card = cardGet(
        _card
      );

      return [
        ...memo,
        card
      ];
    },
    []
  );
};

export default (
  deck
) => {

  let characters = charactersRenderDetailAssignedGet(
    deck.splash.characters
  );

  let cards = cardsRenderTextAssignedGet(
    deck.cards
  );

  return {
    ...deck,
    cards,
    splash: {
      ...deck.splash,
      characters
    }
  };
};
