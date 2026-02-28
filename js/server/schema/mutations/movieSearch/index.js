'use strict';

import mediawikiFetch from '../fns/mediawikiFetch';
import movieDataBasicGet from '../fns/movieDataBasicGet';

const movieSearchQueryGetFn = (
  _text,
  fuzzy
) => {

  const fuzzySuffix = (
    fuzzy
  ) ?
    '~' : 
    '';

  let text = _text.split(
    /\s+/g
  )
    .map(
      (
        __text
      ) => {

        return `
          ${
            __text
          }${
            fuzzySuffix
          }
        `
          .trim();
      }
    )
    .join(
      ' '
    );

  text = encodeURIComponent(
    text
  );

  return (
    text
  );
};

const movieSearchQueryGet = (
  text,
  limit,
  fuzzy
) => {

  return `
    https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=intitle:${
      movieSearchQueryGetFn(
        text,
        fuzzy
      )
    }&srlimit=${
      limit
    }&format=json
  `
    .trim();
};

const movieSearchResultsGet = async (
  text,
  limit,
  fuzzy
) => {

  const query = movieSearchQueryGet(
    text,
    limit,
    fuzzy
  );

  const json = await mediawikiFetch(
    query
  );

  let results = json.query.search
    .map(
      (
        {
          title,
          snippet
        }
      ) => {

        return {
          title,
          snippet
        };
      }
    );

  return (
    results
  );
};

const movieSearchResultCheck = async (
  result
) => {

  const movieDataBasic = await movieDataBasicGet(
    result.title,
    undefined,
    false
  );

  return (
    !!movieDataBasic?.castText &&
    !!movieDataBasic.plotText
  );
};

const movieSearchResultsFilteredGet = (
  results
) => {

  return results.reduce(
    (
      memo,
      _result
    ) => {

      return memo.then(
        (
          res
        ) => {

          return movieSearchResultCheck(
            _result
          )
            .then(
              (
                result
              ) => {

                if (
                  result
                ) {

                  return [
                    ...res,
                    _result
                  ];
                }

                return (
                  res
                );
              }
            );
        }
      );
    },
    Promise.resolve(
      []
    )
  );
};

export default async (
  text,
  limit = 5,
  fuzzy = false
) => {

  let results = await movieSearchResultsGet(
    text,
    limit,
    fuzzy
  );

  results = (
    !results.length
  ) ?
    await movieSearchResultsGet(
      text,
      limit,
      true
    ) :
    results;

  results = await movieSearchResultsFilteredGet(
    results
  );

  return (
    results
  );
};
