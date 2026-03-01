'use strict';

import wordsTokenizedGet from './wordsTokenizedGet';

const charactersRenderTextAssignedGetFn = (
  _text,
  lengthMax
) => {

  const tokens = wordsTokenizedGet(
    _text
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

  let text = tokens.reduce(
    (
      memo,
      token
    ) => {

      if (
        memo.length < 
        lengthMax
      ) {

        return `
          ${
            memo
          } ${
            token
          }
        `
          .trim();
      }

      return (
        memo
      );
    },
    ''
  );

  text = text.slice(
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

const charactersConcatedGet = (
  _characters
) => {

  let characters = _characters.reduce(
    (
      memo,
      character
    ) => {

      const dualRoleIndex = character.dualRoleIndex;

      if (
        dualRoleIndex >=
        0
      ) {

        const renderText = `
          ${
            memo[
              dualRoleIndex
            ]
              .renderText
          } / ${
            character.renderText
          }
        `
          .trim();

        return [
          ...memo.slice(
            0, dualRoleIndex
          ),
          {
            ...memo[
              dualRoleIndex
            ],
            renderText
          },
          ...memo.slice(
            dualRoleIndex + 1
          ),
          character
        ];
      }

      return [
        ...memo,
        character,
      ];
    },
    []
  );

  return (
    characters
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

  characters = charactersConcatedGet(
    characters
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
    text: _text,
    tokens
  }
) => {

  return (!tokens)
    ? _text
    : tokens.reduce(
      (memo, token) => {

        const html = (['hero', 'heroine', 'villain'].includes(token.role))
          ? `<b>${token.text}</b>`
          : token.text;

        const needsSpace = memo.length > 0 &&
          !memo.endsWith(' ') &&
          !token.text.startsWith(' ');

        return `${memo}${needsSpace ? ' ' : ''}${html}`;
      },
      ''
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
