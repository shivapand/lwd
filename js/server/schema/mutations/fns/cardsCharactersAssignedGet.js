'use strict';

const sentenceCharactersGet = (sentence, characters) =>

  sentence.tokens.reduce(
    (memo, token) => {

      return (!token.role)
        ? memo
        : (() => {

      const character = characters.find(
        (c) => {

          const lowerToken = token.text.toLowerCase();

          const lowerName = (c.text || '').toLowerCase();

          const lowerNameFull = (c.characterNameFull || '').toLowerCase();

          return (
            (token.role !== 'other' && c.role === token.role) ||
            lowerName.includes(lowerToken) ||
            lowerToken.includes(lowerName) ||
            lowerNameFull.includes(lowerToken) ||
            lowerToken.includes(lowerNameFull)
          );
        }
      );

      return (!character)
        ? memo
        : [
          ...memo,
          {
            ...character,
            distance: sentence.text.toLowerCase().indexOf(
              token.text.toLowerCase()
            )
          }
        ];

      })();
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
