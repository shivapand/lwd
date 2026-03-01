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

const STOP_WORDS = ['the', 'a', 'an', 'no', 'my', 'his', 'her', 'old', 'big'];

const characterNameVariantsGet = (character) => {

  const variants = (character.characterNameFull || character.text)
    .split('/')
    .map((name) => name.replace(/\(.*?\)/g, '').trim())
    .filter((name) => name.length > 1);

  const firstNames = variants
    .map((name) => name.split(/\s+/)[0])
    .filter((name) => name.length > 1)
    .filter((name) => !STOP_WORDS.includes(name.toLowerCase()));

  return [...variants, ...firstNames].reduce(
    (memo, name) =>
      memo.find((m) => m.toLowerCase() === name.toLowerCase())
        ? memo
        : [...memo, name],
    []
  );
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
