'use strict';

import nodeFetch from 'node-fetch';

let retryCount = 0;
const MAX_RETRIES = 3;

const mediawikiFetch = async (query) => {
  try {
    const res = await nodeFetch(query, {
      headers: {
        'User-Agent': 'LWD-Demo-Bot (pyratin@gmail.com)'
      }
    });

    if (res.status === 200) {
      retryCount = 0; // Reset count on success
      return await res.json();
    }

    console.log(`mediawikiFetch failed with status ${res.status} for query: ${query}`);
    
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`Retrying (${retryCount}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return mediawikiFetch(query);
    }

    retryCount = 0;
    return null;
  } catch (error) {
    console.log(`mediawikiFetch exception: ${error.message}`);
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      await new Promise(resolve => setTimeout(resolve, 2000));
      return mediawikiFetch(query);
    }
    retryCount = 0;
    return null;
  }
};

export default mediawikiFetch;
