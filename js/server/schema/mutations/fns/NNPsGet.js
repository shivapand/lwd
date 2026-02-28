'use strict';

import wordsTokenizedGet from './wordsTokenizedGet';
import wordsTaggedGet from './wordsTaggedGet';
import NNPWhitelistGet from './NNPWhitelistGet';
import NNPBlacklistGet from './NNPBlacklistGet';
import NNPChunkedBlacklistGet 
  from './NNPChunkedBlacklistGet';

const NNPWhitelistIsMatchGet = (
  text
) => {

  return NNPWhitelistGet()
    .find(
      (
        _NNPWhitelist
      ) => {

        return (
          _NNPWhitelist ===
          text
        );
      }
    );
};

const NNPBlacklistIsMatchGet = (
  text
) => {

  return NNPBlacklistGet()
    .find(
      (
        _NNPBlacklist
      ) => {

        return (
          _NNPBlacklist ===
          text
        );
      }
    );
};

const wordsNNPOverridesAppliedGet = (
  _words
) => {

  const words = _words.reduce(
    (
      memo,
      _word
    ) => {

      switch (
        true
      ) {

        case (
          !!NNPWhitelistIsMatchGet(
            _word.text
          )
        ) :

          return [
            ...memo,
            {
              ..._word,
              tag: 'NNP'
            }
          ];

        case (
          !!NNPBlacklistIsMatchGet(
            _word.text
          )
        ) :

          return [
            ...memo,
            {
              ..._word,
              tag: 'blacklist'
            }
          ];

        default:

          return [
            ...memo,
            _word
          ];
      }
    },
    []
  );

  return (
    words
  );
};

const wordsChunkedGet = (
  words
) => {

  const wordsChunked = words.reduce(
    (
      memo,
      word
    ) => {

      const _word = memo.slice(
        -1
      )[
        0
      ];

      switch (
        true
      ) {

        case (
          !_word
        ) :

          return [
            ...memo,
            word
          ];

        case (
          (
            _word.tag === 
            'NNP'
          ) &&
          (
            word.tag === 
            'NNP'
          )
        ) :

          return [
            ...memo.slice(
              0, -1
            ),
            {
              ..._word,
              text: `
                ${
                  _word.text
                } ${
                  word.text
                }
              `
                .trim(),
              tag: 'NNP'
            }
          ];

        default:

          return [
            ...memo,
            word
          ];
      }
    },
    []
  );

  return (
    wordsChunked
  );
};

const wordsChunkedFilteredGet = (
  words
) => {

  return words.reduce(
    (
      memo,
      word
    ) => {

      const match = NNPChunkedBlacklistGet()
        .find(
          (
            _NNPChunkedBlacklist
          ) => {

            return (
              _NNPChunkedBlacklist ===
              word.text
            );
          }
        );

      if (
        !match
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

const NNPsGetFn = (
  words
) => {

  return words.reduce(
    (
      memo,
      word
    ) => {

      switch (
        true
      ) {

        case (
          word.tag === 
          'NNP'
        ) :

          return [
            ...memo,
            word
          ];

        default :

          return (
            memo
          );
      }
    },
    []
  );
};

const NNPsCleanedGet = (
  words
) => {

  return words.map(
    (
      word
    ) => {

      delete word.token;

      delete word.tag;

      return (
        word
      );
    }
  );
};

export default (
  sentence
) => {

  let words = wordsTokenizedGet(
    sentence
  );

  words = wordsTaggedGet(
    words
  );

  words = wordsNNPOverridesAppliedGet(
    words
  );

  words = wordsChunkedGet(
    words
  );

  words = wordsChunkedFilteredGet(
    words
  );

  words = NNPsGetFn(
    words
  );

  words = NNPsCleanedGet(
    words
  );

  return (
    words
  );
};
