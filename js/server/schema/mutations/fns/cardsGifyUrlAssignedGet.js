'use strict';

import nodeFetch from 'node-fetch';

const GIPHY_API_KEY = 'aJT6CDc1W7E5g5S38tj6STaddrUa75Xx';

const queryUrlGet = (title, index) => {

  const queryText = `${title} cartoon`;

  return `https://api.giphy.com/v1/gifs/search?api_key=${
    GIPHY_API_KEY
  }&q=${
    encodeURIComponent(queryText)
  }&limit=1&offset=${
    index
  }&rating=g`;
};

const gifyUrlFromResponseGet = (json) =>
  json?.data?.[0]?.images?.downsized_still?.url ||
  json?.data?.[0]?.images?.original_still?.url ||
  null;

const cardGifyUrlGet = async (title, index) => {

  const url = queryUrlGet(title, index);

  const res = await nodeFetch(url).catch(() => null);

  return (!res?.ok)
    ? null
    : gifyUrlFromResponseGet(await res.json().catch(() => null));
};

export default async (_cards, title) => {

  const results = await Promise.all(
    _cards.map(
      (_, index) => cardGifyUrlGet(title, index)
    )
  );

  return _cards.reduce(
    (memo, card, index) => [
      ...memo,
      {
        ...card,
        gifyUrl: results[index]
      }
    ],
    []
  );
};
