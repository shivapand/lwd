'use strict';

import natural from 'natural';

export default (
  words
) => {

  const language = 'EN';

  const defaultCategory = 'N';

  const defaultCategoryCapitalized = 'NNP';

  const lexicon = new natural.Lexicon(
    language,
    defaultCategory,
    defaultCategoryCapitalized
  );

  const ruleSet = new natural.RuleSet(
    language
  );

  const tagger = new natural.BrillPOSTagger(
    lexicon,
    ruleSet
  );

  const wordsTagged = tagger.tag(
    words.map(
      (
        word
      ) => {

        return (
          word.text
        );
      }
    )
  )
    .taggedWords
    .reduce(
      (
        memo,
        wordtagged,
        index
      ) => {

        return [
          ...memo,
          {
            ...wordtagged,
            ...words[
              index
            ]
          }
        ];
      },
      []
    );

  return (
    wordsTagged
  );
};
