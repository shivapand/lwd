'use strict';

import nodeFetch from 'node-fetch';

import { tmdbReadAccessTokenGet } from '~/js/server/fns/variable';

const MAX_RETRIES = 3;

const delayGet = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const tmdbFetch = async (path, retryCount = 0) => {

  try {

    const token = tmdbReadAccessTokenGet();

    const res = await nodeFetch(
      `https://api.themoviedb.org/3${path}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    return (res.status === 200)
      ? await res.json()
      : await (async () => {

        console.log(
          `tmdbFetch failed with status ${res.status} for path: ${path}`
        );

        return (retryCount < MAX_RETRIES)
          ? await delayGet(2000).then(
            () => tmdbFetch(path, retryCount + 1)
          )
          : null;
      })();
  } catch (error) {

    console.log(
      `tmdbFetch exception: ${error.message} for path: ${path}`
    );

    return (retryCount < MAX_RETRIES)
      ? await delayGet(2000).then(
        () => tmdbFetch(path, retryCount + 1)
      )
      : null;
  }
};

export default tmdbFetch;
