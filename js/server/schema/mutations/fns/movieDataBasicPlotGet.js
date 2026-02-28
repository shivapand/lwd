'use strict';

import cheerio from 'cheerio';

import sentencesTokenizedGet from './sentencesTokenizedGet';
import sentencesGet from './sentencesGet';

const sentencesTokenizedGetFn = (
  paragraphs
) => {

  let sentences = paragraphs.reduce(
    (
      memo,
      paragraph
    ) => {

      const _sentences = sentencesTokenizedGet(
        paragraph
      );

      return [
        ...memo,
        ..._sentences
      ];
    },
    []
  );

  return (
    sentences
  );
};

const sentencesIndexAssignedGet = (
  sentences
) => {

  return sentences.map(
    (
      text,
      sentenceIndex
    ) => {

      return {
        text,
        sentenceIndex
      };
    }
  );
};

const sentencesTerminatedGet = (
  sentences
) => {

  return (
    !sentences[
      sentences.length - 1
    ]?.text.match(
        /\s...,$/
      )
  );
};

const sentencesCulledByLimitGet = (
  _sentences,
  plotLimit
) => {

  const sentences = _sentences.reduce(
    (
      memo,
      _sentence
    ) => {

      switch (
        true
      ) {

        case (
          !!plotLimit &&
          (
            memo.length >=
            plotLimit
          ) &&
          sentencesTerminatedGet(
            memo
          )
        ) :

          return (
            memo
          );

        default :

          return [
            ...memo,
            _sentence
          ];
      }
    },
    []
  );

  return (
    sentences
  );
};

export default (
  plotText,
  plotLimit
) => {

  if (
    !plotText
  ) {

    return (
      null
    );
  }

  const $ = cheerio.load(
    plotText
  );

  const plotEl = $(
    'span.mw-reflink-text, sup'
  )
    .remove()
    .end();

  let paragraphs = plotEl
    .find(
      'p'
    )
    .toArray();

  if (
    !paragraphs.length
  ) {

    return (
      null
    );
  }

  paragraphs = paragraphs.reduce(
    (
      memo,
      p
    ) => {

      let paragraph = $(
        p
      )
        .text();

      return [
        ...memo ||
        [],
        paragraph
      ];
    },
    null
  );

  let sentences = sentencesTokenizedGetFn(
    paragraphs
  );

  sentences = sentences.slice(
    0,
    plotLimit
  );

  sentences = sentencesGet(
    sentences,
    75
  );

  sentences = sentencesIndexAssignedGet(
    sentences
  );

  sentences = sentencesCulledByLimitGet(
    sentences,
    plotLimit
  );

  return (
    sentences
  );
};
