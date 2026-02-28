'use strict';

import nodeFetch from 'node-fetch';

import fnDelayRunFn from './fnDelayRun';

const cardsForGifyGet = (
  cards
) => {

  return cards.reduce(
    (
      cardMemo,
      card,
      cardIndex
    ) => {

      if (
        !card?.character?.text
      ) {

        return [
          ...cardMemo,
          {
            ...card,
            cardIndex
          }
        ];
      }

      return (
        cardMemo
      );
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
  text
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
    text
  );
};

const cardsFlatlistGifyUrlAssignedGetFn = (
  query
) => {

  return nodeFetch(
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

        const gifyUrl = json.data.images?.[
          'downsized_still'
        ]
          .url;

        if (
          !gifyUrl
        ) {

          return fnDelayRun(
            query
          );
        }

        return (
          gifyUrl
        );
      }
    )
    .catch(
      () => {

        return fnDelayRun(
          query
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
