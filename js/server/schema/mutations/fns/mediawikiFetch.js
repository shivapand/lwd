'use strict';

import nodeFetch from 'node-fetch';

const MAX_RETRIES = 3;

const mediawikiFetch = async (query, retryCount = 0) => {
  try {
    const res = await nodeFetch(query, {
      headers: {
        'User-Agent': 'LWD-Demo-Bot (pyratin@gmail.com)'
      },
      timeout: 10000
    });

    if (res.status === 200) {
      return await res.json();
    }

    if (res.status === 404) {
      return null;
    }

    if (retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return mediawikiFetch(query, retryCount + 1);
    }

    return null;
  } catch (error) {
    console.log(`mediawikiFetch exception: ${error.message} for query: ${query}`);
    if (retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return mediawikiFetch(query, retryCount + 1);
    }
    return null;
  }
};

export default mediawikiFetch;
