'use strict';

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

      const matchFlag = !!nameVariants.find(
        (name) =>
          sentence.text.toLowerCase().includes(name.toLowerCase())
      );

      return (!matchFlag)
        ? memo
        : [
          ...memo,
          {
            ...character,
            distance: 0
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
