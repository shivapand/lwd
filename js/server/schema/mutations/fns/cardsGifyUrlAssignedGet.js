'use strict';

import nodeFetch from 'node-fetch';

import fnDelayRunFn from './fnDelayRun';

const MAX_RETRIES = 3;

const cardsForGifyGet = (
  cards
) => {

  return cards.reduce(
    (
      cardMemo,
      card,
      cardIndex
    ) => {

      return [
        ...cardMemo,
        {
          ...card,
          cardIndex
        }
      ];
    },
    []
  );
};

const queryGet = (
  text,
  title,
  index
) => {

  const queryText = `
    ${
      text
    } : ${
      title
    }
  `
    .trim();

  const gifyApiKey = 
    process.env.npm_package_config_GIFY_API_KEY;

  return `
    https://api.giphy.com/v1/gifs/translate?api_key=${
      gifyApiKey
    }&weirdness=${
      index
    }&s=${
      encodeURIComponent(
        queryText
      )
    }
  `
    .trim();
};

const fnDelayRun = (
  text,
  retries
) => {

  return fnDelayRunFn(
    cardsFlatlistGifyUrlAssignedGetFn,
    100,
    `
      deckCardsGifyUrlAssignedGet: ${
        text
      }
    `
      .trim(),
    text,
    retries
  );
};

const cardsFlatlistGifyUrlAssignedGetFn = (
  query,
  retries = 0
) => {

  return (
    retries >= MAX_RETRIES
  )
    ? Promise.resolve(
      null
    )
    : nodeFetch(
      query
    )
      .then(
        (
          res
        ) => {

          return res.json();
        }
      )
      .then(
        (
          json
        ) => {

          const gifyUrl = json.data?.images?.[
            'original_still'
          ]
            ?.url;

          return (
            !gifyUrl
          )
            ? fnDelayRun(
              query,
              retries + 1
            )
            : gifyUrl;
        }
      )
      .catch(
        () => {

          return fnDelayRun(
            query,
            retries + 1
          );
        }
      );
};

const cardsFlatlistGifyUrlAssignedGet = (
  cards,
  title
) => {

  return cards.reduce(
    (
      memo,
      card,
      index
    ) => {

      return memo.then(
        (
          res
        ) => {

          const query = queryGet(
            card.text,
            title,
            index
          );

          return cardsFlatlistGifyUrlAssignedGetFn(
            query
          )
            .then(
              (
                result
              ) => {

                return [
                  ...res,
                  {
                    ...card,
                    gifyUrl: result
                  }
                ];
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

const cardByIndexGet = (
  cards,
  cardIndex
) => {

  return cards.find(
    (
      card
    ) => {

      return (
        card.cardIndex ===
        cardIndex
      );
    }
  );
};

const cardsGifyUrlAssignedGet = (
  cardsFlatlist,
  cards
) => {

  return cards.reduce(
    (
      memo,
      card,
      cardIndex
    ) => {

      const _cardsFlatlist = cardByIndexGet(
        cardsFlatlist,
        cardIndex
      );

      if (
        _cardsFlatlist
      ) {

        return [
          ...memo,
          {
            ...card,
            gifyUrl: _cardsFlatlist.gifyUrl
          }
        ];
      }

      return [
        ...memo,
        card
      ];
    },
    []
  );
};

export default async (
  _cards,
  title
) => {

  let cardsFlatlist = cardsForGifyGet(
    _cards
  );

  cardsFlatlist = await cardsFlatlistGifyUrlAssignedGet(
    cardsFlatlist,
    title
  );

  const cards = cardsGifyUrlAssignedGet(
    cardsFlatlist,
    _cards
  );

  return (
    cards
  );
};
