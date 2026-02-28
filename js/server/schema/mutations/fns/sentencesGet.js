'use strict';

import wordsTokenizedGet from './wordsTokenizedGet';
import wordsTaggedGet from './wordsTaggedGet';
import parenthesisPurgedGet from './parenthesisPurgedGet';

const sentenceNormalizeRegExp = /,\s(?![A-Z])/;

const sentencesParenthesisPurgedGet = (
  sentences 
) => {

  return sentences.map(
    (
      sentence
    ) => {

      return parenthesisPurgedGet(
        sentence
      );
    }
  );
};

const sentencesColonsReplacedGet = (
  sentences
) => {

  return sentences.map(
    (
      sentence
    ) => {

      return sentence.replace(
        /(;|:)+\s/g,
        ', '
      );
    }
  );
};

const sentenceIsNormalizableGet = (
  sentence,
  sentenceMaxLength
) => {

  const sentenceIsNormalizable = sentence.split(
    sentenceNormalizeRegExp
  )
    .reduce(
      (
        memo,
        _sentence
      ) => {

        if (
          memo &&
          (
            _sentence.length >
            sentenceMaxLength
          )
        ) {

          return (
            false
          );
        }

        return (
          memo
        );
      },
      true
    );

  return (
    sentenceIsNormalizable
  );
};

const fragmentWordCountGet = (
  fragment
) => {

  if (
    !fragment
  ) {

    return (
      null
    );
  }

  return fragment.split(
    /\s/
  )
    .length;
};

const wordPOSMatchConditionGet = (
  word,
  sentence,
  tagType,
  sentenceMaxLength
) => {

  if (
    sentenceIsNormalizableGet(
      sentence,
      sentenceMaxLength
    ) 
  ) {

    return (
      false
    );
  }

  switch (
    tagType
  ) {

    case (
      'CC'
    ) :

      return (
        word.tag === 
        'CC'
      );
  }
};

const wordPOSMatchedGet = (
  word,
  sentence,
  tagType,
  sentenceMaxLength
) => {

  const caseCondition = wordPOSMatchConditionGet(
    word,
    sentence,
    tagType,
    sentenceMaxLength
  );

  switch (
    true
  ) {

    case (
      caseCondition
    ) :

      return (
        word
      );

    default:

      return (
        null
      );
  }
};

const wordsPosMatchedGet = (
  words,
  sentence,
  tagType,
  sentenceMaxLength
) => {

  return words.reduce(
    (
      memo,
      _word
    ) => {

      const word = wordPOSMatchedGet(
        _word,
        sentence,
        tagType,
        sentenceMaxLength
      );

      if (
        word
      ) {

        return [
          ...memo,
          word
        ];
      }

      return (
        memo
      );
    },
    []
  );
};

const sentenceShortenedByPOSGet = (
  _sentence,
  tagType,
  sentenceMaxLength
) => {

  if (
    sentenceIsNormalizableGet(
      _sentence,
      sentenceMaxLength
    )
  ) {

    return (
      _sentence
    );
  }

  let words = wordsTokenizedGet(
    _sentence
  );

  words = wordsTaggedGet(
    words
  ); 

  words = wordsPosMatchedGet(
    words,
    _sentence,
    tagType,
    sentenceMaxLength
  );

  words = words.map(
    (
      word
    ) => {

      return {
        ...word,
        redundant: (
          !word.distance ||
          (
            !!_sentence.slice(
              0, word.distance
            )
              .trim()
              .match(
                /,$/
              )
          )
        )
      };
    }
  );

  words = words.filter(
    (
      word
    ) => {

      return (
        !word.redundant
      );
    }
  );

  const sentence = words.reduce(
    (
      memo,
      word
    ) => {

      const _distance = word.distance;

      const distanceOffset = memo.length - _sentence.length;

      const distance = _distance + distanceOffset;

      return [
        memo.slice(
          0, distance
        )
          .trim(),
        `, ${word.text} `,
        memo.slice(
          distance +
          word.text.length
        )
          .trim()
      ]
        .join(
          ''
        );
    },
    _sentence
  );

  return (
    sentence
  );
};

const sentenceShortenedByNNPGetFn = (
  _sentence,
  sentenceMaxLength
) => {

  if (
    sentenceIsNormalizableGet(
      _sentence,
      sentenceMaxLength
    )
  ) {

    return [
      _sentence
    ];
  }

  let matches = _sentence.matchAll(
    /(?<![,]\s)(?<![A-Z]+[a-z]*\s)(?<=\s)[A-Z]+[a-z]*(?=\s)/g
  );

  let NNPs = [
    ...matches
  ]
    .map(
      (
        match
      ) => {

        return {
          text: match[
            0
          ],
          distance: match.index
        };
      }
    );

  let fragments = NNPs.reduce(
    (
      memo,
      NNP,
      index
    ) => {

      const sliceStart = 0;

      const _NNP = (
        index
      ) ?
        NNPs[
          index -
          1
        ] :
        null;

      const distanceOffset = (
        _NNP
      ) ?
        (
          _NNP.distance
        ) :
        0;

      const sliceEnd = (
        NNP.distance -
        (
          distanceOffset
        )
      );

      const fragmentPrevious = memo[
        memo.length -
        1
      ];

      const fragment = fragmentPrevious.slice(
        sliceStart,
        sliceEnd
      );

      const rest = fragmentPrevious.slice(
        sliceEnd
      );

      return [
        ...memo.slice(
          0, -1
        ),
        fragment.trim(),
        rest.trim()
      ];
    },
    [
      _sentence
    ]
  );

  fragments = fragments.reduce(
    (
      memo,
      fragment,
      index
    ) => {

      const fragmentPrevious = (
        index
      ) ?
        memo[
          memo.length -
          1
        ] :
        '';

      const fragmentPreviousLength = 
        fragmentPrevious.length;

      if (
        (
          (
            fragmentPreviousLength +
            fragment.length
          ) >
          sentenceMaxLength
        ) &&
        (
          fragmentWordCountGet(
            fragment
          ) >=
          3
        )
      ) {

        return [
          ...memo,
          fragment
        ];
      }

      return [
        ...memo.slice(
          0, -1
        ),
        `
          ${
            fragmentPrevious
          } ${
            fragment
          }
        `
          .trim()
      ];
    },
    []
  );

  return (
    fragments
  );
};

const sentenceShortenedByNNPGet = (
  _sentence,
  sentenceMaxLength
) => {

  if (
    sentenceIsNormalizableGet(
      _sentence,
      sentenceMaxLength
    )
  ) {

    return (
      _sentence
    );
  }

  let fragments = _sentence.split(
    sentenceNormalizeRegExp
  );

  fragments = fragments.reduce(
    (
      memo,
      fragment,
      index
    ) => {

      if (
        index <
        (
          fragments.length -
          1
        )
      ) {

        return [
          ...memo,
          `
            ${
              fragment
            },
          `
            .trim()
        ];
      }

      return [
        ...memo,
        fragment
      ];
    },
    []
  );

  fragments = fragments.reduce(
    (
      memo,
      fragment
    ) => {

      const _fragments = sentenceShortenedByNNPGetFn(
        fragment,
        sentenceMaxLength
      );

      return [
        ...memo,
        ..._fragments
      ];
    },
    []
  );

  const sentence = fragments.reduce(
    (
      memo,
      fragment
    ) => {

      if (
        !memo ||
        (
          memo.match(
            /,$/
          )
        )
      ) {

        return `
          ${
            memo
          } ${
            fragment
          }
        `
          .trim();
      }

      return `
        ${
          memo
        }, ${
          fragment
        }
      `
        .trim();
    },
    ''
  );

  return (
    sentence
  );
};

const sentenceShortenedByPossesiveGet = (
  _sentence,
  sentenceMaxLength
) => {

  if (
    sentenceIsNormalizableGet(
      _sentence,
      sentenceMaxLength
    )
  ) {

    return (
      _sentence
    );
  }

  const sentence = _sentence.replace(
    /(?<='s\s\w+\b)./g,
    ', '
  );

  return (
    sentence
  );
};

const sentenceShortenedByLengthGetFn = (
  _sentence,
  sentenceMaxLength
) => {

  if (
    sentenceIsNormalizableGet(
      _sentence,
      sentenceMaxLength
    )
  ) {

    return [
      _sentence
    ];
  }

  const fragments = _sentence
    .split(
      /\s/
    )
    .reduce(
      (
        memo,
        word,
        index
      ) => {

        const fragmentPrevious = (
          index
        ) ?
          memo[
            memo.length - 1
          ] :
          '';

        if (
          (
            (
              fragmentPrevious.length +
              word.length
            ) <
            (
              sentenceMaxLength *
              1.5
            )
          ) ||
          (
            word.match(
              /^\W/
            )
          ) ||
          (
            word.match(
              /\W$/
            )
          )
        ) {

          return [
            ...memo.slice(
              0, -1
            ),
            `
              ${
                fragmentPrevious
              } ${
                word
              }
            `
              .trim()
          ];
        }

        return [
          ...memo,
          word
        ];
      },
      []
    );

  return (
    fragments
  );
};

const sentenceShortenedByLengthGet = (
  _sentence,
  sentenceMaxLength
) => {

  if (
    sentenceIsNormalizableGet(
      _sentence,
      sentenceMaxLength
    )
  ) {

    return (
      _sentence
    );
  }

  let fragments = _sentence.split(
    sentenceNormalizeRegExp
  );

  fragments = fragments.reduce(
    (
      memo,
      fragment
    ) => {

      const _fragment = sentenceShortenedByLengthGetFn(
        fragment,
        sentenceMaxLength
      );

      return [
        ...memo,
        ..._fragment
      ];
    },
    []
  );

  const sentence = fragments.reduce(
    (
      memo,
      fragment
    ) => {

      if (
        !memo ||
        (
          memo.match(
            /[,.]$/
          )
        )
      ) {

        return `
          ${
            memo
          } ${
            fragment
          }
        `
          .trim();
      }

      return `
        ${
          memo
        }, ${
          fragment
        }
      `
        .trim();
    },
    ''
  );

  return (
    sentence
  );
};

const sentenceProcessedGet = (
  _sentence,
  sentenceMaxLength
) => {

  let sentence = _sentence.replace(
    /(?<!,\s)(?<=\s)which(?=\s)/g,
    ', which'
  );

  sentence = sentenceShortenedByPOSGet(
    sentence,
    'CC',
    sentenceMaxLength
  );

  sentence = sentenceShortenedByNNPGet(
    sentence,
    sentenceMaxLength
  );

  sentence = sentenceShortenedByPossesiveGet(
    sentence,
    sentenceMaxLength
  );

  sentence = sentenceShortenedByLengthGet(
    sentence,
    sentenceMaxLength
  );

  return (
    sentence
  );
};

const fragmentsShortHandledGetFn = (
  index,
  memo,
  fragments
) => {

  const fragment = fragments[
    index
  ];
    
  const fragmentWordCount = fragmentWordCountGet(
    fragment
  );

  const fragmentPrevious = (
    index
  ) &&
    fragments[
      index - 1
    ];

  const fragmentPreviousWordCount = fragmentWordCountGet(
    fragmentPrevious
  );

  const fragmentNext = (
    fragments.length >
    index + 1
  ) &&
    fragments[
      index + 1
    ];

  const fragmentNextWordCount = fragmentWordCountGet(
    fragmentNext
  );

  switch (
    true
  ) {

    case (
      fragmentPrevious &&
      (
        fragmentPreviousWordCount <=
        3
      ) &&
      (
        fragmentWordCount <=
        3
      )
    ) :
    case (
      fragmentPrevious &&
      fragmentNext &&
      (
        fragmentPreviousWordCount >
        3
      ) &&
      (
        fragmentWordCount <=
        3
      ) &&
      (
        fragmentNextWordCount >
        3
      )
    ) :

      return [
        ...memo.slice(
          0,
          memo.length - 1
        ),
        `
          ${
            memo[
              memo.length - 1
            ]
          }, ${
            fragment
          }
        `
          .trim()
      ];

    default :

      return [
        ...memo,
        fragment
      ];
  }
};

const fragmentsShortHandledGet = (
  _fragments
) => {

  return _fragments.reduce(
    (
      memo,
      fragment,
      index
    ) => {

      const fragments = fragmentsShortHandledGetFn(
        index,
        memo,
        _fragments
      );

      return (
        fragments
      );
    },
    []
  );
};

const sentencesNormalizedGetFn = (
  _sentence,
  sentenceMaxLength
) => {

  const sentence = (
    !sentenceIsNormalizableGet(
      _sentence,
      sentenceMaxLength
    )
  ) ?
    sentenceProcessedGet(
      _sentence,
      sentenceMaxLength
    ) :
    _sentence;

  let fragments = sentence.split(
    sentenceNormalizeRegExp
  );

  fragments = fragmentsShortHandledGet(
    fragments
  );

  fragments = fragments.reduce(
    (
      memo,
      fragment
    ) => {

      const fragmentPrevious = memo[
        memo.length - 1
      ];

      switch (
        true
      ) {

        case (
          !!fragmentPrevious &&
          (
            fragmentPrevious.length +
            fragment.length
          ) <
          sentenceMaxLength
        ) :

          return [
            ...memo.slice(
              0, -1
            ),
            `
              ${
                fragmentPrevious
              }, ${
                fragment
              }
            `
              .trim()
          ];

        case (
          !!fragmentPrevious
        ) :

          return [
            ...memo.slice(
              0, -1
            ),
            `
              ${
                fragmentPrevious
              } ...,
            `
              .trim(),
            fragment
          ];

        default :

          return [
            ...memo,
            fragment
          ];
      }
    },
    []
  );

  return (
    fragments
  );
};

const sentencesNormalizedGet = (
  sentences,
  sentenceMaxLength
) => {

  return sentences.reduce(
    (
      memo,
      _sentence
    ) => {

      const sentence = sentencesNormalizedGetFn(
        _sentence,
        sentenceMaxLength
      );

      return [
        ...memo,
        ...sentence
      ];
    },
    []
  );
};

export default (
  _sentences,
  sentenceMaxLength
) => {

  let sentences = sentencesParenthesisPurgedGet(
    _sentences
  );

  sentences = sentencesColonsReplacedGet(
    sentences
  );

  sentences = sentencesNormalizedGet(
    sentences,
    sentenceMaxLength
  );

  return (
    sentences
  );
};
