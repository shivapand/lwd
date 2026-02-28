'use strict';

import natural from 'natural';
import escapeStringRegexp from 'escape-string-regexp';

const tokenizerGet = (
  tokenizerType
) => {

  switch (
    tokenizerType
  ) {

    case (
      'wordPunct'
    ) :

      return new natural.WordPunctTokenizer();

    default:

      return new natural.TreebankWordTokenizer();
  }
};

export default (
  _sentence,
  tokenizerType = 'treebank'
) => {

  const tokenizer = tokenizerGet(
    tokenizerType
  );

  const sentence = _sentence
    .replace(
      /(\S)\/(\S)/g,
      '$1 / $2'
    );

  let words = tokenizer.tokenize(
    sentence
  )
    .reduce(
      (
        memo,
        word,
        tokenIndex
      ) => {

        return [
          ...memo,
          {
            text: word,
            tokenIndex
          }
        ];
      },
      []
    );

  words = words.reduce(
    (
      memo,
      word
    ) => {

      let regExpString = memo.reduce(
        (
          regExpStringMemo,
          {
            text
          }
        ) => {

          return `
            ${
              regExpStringMemo
            }\\s*${
              escapeStringRegexp(
                text
              )
            }
          `
            .trim();
        },
        ''
      );

      regExpString = `
        ^${
          regExpString
        }\\s*
      `
        .trim();

      const regExp = new RegExp(
        regExpString
      );

      const match = _sentence.match(
        regExp
      );

      return [
        ...memo,
        {
          ...word,
          distance: match?.[
            0
          ]
            .length
        }
      ];
    },
    []
  );

  return (
    words
  );
};

