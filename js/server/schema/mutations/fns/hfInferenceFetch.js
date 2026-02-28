'use strict';

import nodeFetch from 'node-fetch';

import { hfAccessTokenGet } from '~/js/server/fns/variable';

const MAX_RETRIES = 3;

const delayGet = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const hfInferenceFetch = async (model, body, retryCount = 0) => {

  try {

    const token = hfAccessTokenGet();

    const res = await nodeFetch(
      `https://router.huggingface.co/hf-inference/models/${model}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        timeout: 30000
      }
    );

    return (res.status === 200)
      ? await res.json()
      : await (async () => {

        await res.text().catch(() => '');

        const modelLoadingFlag = res.status === 503;

        console.log(
          `hfInferenceFetch ${modelLoadingFlag ? 'model loading' : `failed with status ${res.status}`} for model: ${model}`
        );

        const retryDelay = modelLoadingFlag ? 10000 : 2000;

        return (retryCount < MAX_RETRIES)
          ? await delayGet(retryDelay).then(
            () => hfInferenceFetch(model, body, retryCount + 1)
          )
          : null;
      })();
  } catch (error) {

    console.log(
      `hfInferenceFetch exception: ${error.message} for model: ${model}`
    );

    return (retryCount < MAX_RETRIES)
      ? await delayGet(2000).then(
        () => hfInferenceFetch(model, body, retryCount + 1)
      )
      : null;
  }
};

export default hfInferenceFetch;
