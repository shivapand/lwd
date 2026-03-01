'use strict';

const wordBoundaryMatchFlagGet = (
  text,
  name
) => {

  const escaped = name.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );

  return new RegExp(
    `\\b${escaped}\\b`,
    'i'
  )
    .test(text);
};

const wordBoundaryIndexGet = (
  text,
  name
) => {

  const escaped = name.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );

  const match = text.match(
    new RegExp(
      `\\b${escaped}\\b`,
      'i'
    )
  );

  return match
    ? match.index
    : -1;
};

const characterNameVariantsGet = (
  character
) => {

  const fullName = character.characterNameFull ||
    character._text;

  const parts = fullName.split(
    /\s*\/\s*/
  );

  return parts.reduce(
    (
      memo,
      part
    ) => {

      const trimmed = part.replace(
        /\(.*?\)/g,
        ''
      )
        .trim();

      const firstName = trimmed.split(
        /\s+/
      )[
        0
      ];

      return [
        ...memo,
        ...(
          (trimmed.length > 1)
            ? [trimmed]
            : []
        ),
        ...(
          (
            firstName.length > 1 &&
            firstName !== trimmed
          )
            ? [firstName]
            : []
        )
      ];
    },
    []
  )
    .reduce(
      (
        memo,
        name
      ) => {

        return (
          memo.find(
            (m) =>
              m.toLowerCase() === name.toLowerCase()
          )
        )
          ? memo
          : [
            ...memo,
            name
          ];
      },
      []
    );
};

const cardMatchesGet = (
  _card,
  characters
) => {

  return characters.reduce(
    (
      memo,
      character
    ) => {

      const nameVariants = characterNameVariantsGet(
        character
      );

      const baseText = _card._text || _card.text;

      const matchedVariant = nameVariants.find(
        (name) =>
          wordBoundaryMatchFlagGet(
            baseText,
            name
          )
      );

      return (
        !matchedVariant
      )
        ? memo
        : [
          ...memo,
          {
            character,
            originalName: matchedVariant,
            spoofName: character.text,
            distance: wordBoundaryIndexGet(
              baseText,
              matchedVariant
            )
          }
        ];
    },
    []
  )
    .sort(
      (
        a, b
      ) => {

        switch (true) {

          case (
            a.distance >
            b.distance
          ) :

            return 1;

          case (
            b.distance >
            a.distance
          ) :

            return -1;

          default:

            return 0;
        }
      }
    );
};

const cardsSpoofedGetFn = (
  _card,
  characters
) => {

  const baseText = _card._text || _card.text;

  const matches = cardMatchesGet(
    _card,
    characters
  );

  const card = matches.reduce(
    (
      memo,
      match
    ) => {

      const distanceOffset = (
        memo.text
          .length -
        baseText
          .length
      );

      const distance = match.distance + distanceOffset;

      const text = [
        memo.text
          .slice(
            0,
            distance
          ),
        match.spoofName,
        memo.text
          .slice(
            distance +
            match.originalName.length
          )
      ]
        .join('');

      return {
        ...memo,
        text,
        characters: [
          ...memo.characters,
          {
            ...match.character,
            distance
          }
        ]
      };
    },
    {
      ..._card,
      text: baseText,
      characters: [],
      character: _card.character,
      dualRoleIndex: _card.dualRoleIndex
    }
  );

  return {
    ...card,
    _text: baseText
  };
};

const cardsSpoofedGet = (
  _cards,
  _characters
) => {

  return _cards.reduce(
    (
      memo,
      _card
    ) => {

      const card = cardsSpoofedGetFn(
        _card,
        _characters
      );

      return [
        ...memo,
        card
      ];
    },
    []
  );
};

const cardsCharacterAssignedGet = (
  cards
) => {

  return cards.reduce(
    (
      memo,
      card
    ) => {

      const character = card.characters
        .find(
          (
            character
          ) => {

            return (
              character._text ===
              card.character?.text
            );
          }
        );

      return [
        ...memo,
        {
          ...card,
          character: character ||
            card.character
        }
      ];
    },
    []
  );
};

export default (
  _cards,
  _characters
) => {

  let cards = cardsSpoofedGet(
    _cards,
    _characters
  );

  cards = cardsCharacterAssignedGet(
    cards
  );

  return (
    cards
  );
};
