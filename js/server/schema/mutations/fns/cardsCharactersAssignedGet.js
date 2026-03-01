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

const characterNameVariantsGet = (character) => {

  const fullName = character.text;

  const firstName = fullName.split(/\s+/)[0];

  const variants = (firstName.length > 1 && firstName !== fullName)
    ? [fullName, firstName]
    : [fullName];

  return variants;
};

const sentenceCharactersGet = (sentence, characters) =>

  characters.reduce(
    (memo, character) => {

      const nameVariants = characterNameVariantsGet(character);

      const matchedName = nameVariants.find(
        (name) =>
          wordBoundaryMatchFlagGet(sentence.text, name)
      );

      return (!matchedName)
        ? memo
        : [
          ...memo,
          {
            ...character,
            distance: wordBoundaryIndexGet(
              sentence.text,
              matchedName
            )
          }
        ];
    },
    []
  );

export default (
  plot,
  _characters
) => {

  const cards = plot.reduce(
    (memo, sentence) => {

      const characters = sentenceCharactersGet(
        sentence,
        _characters
      );

      return [
        ...memo,
        {
          ...sentence,
          characters
        }
      ];
    },
    []
  );

  return cards;
};
