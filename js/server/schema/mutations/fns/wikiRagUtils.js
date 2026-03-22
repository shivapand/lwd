'use strict';

import nodeFetch from 'node-fetch';

/**
 * Fetches the full plain text content of a Wikipedia page.
 */
const wikiTextGet = async (title) => {

  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext&titles=${encodeURIComponent(title)}&format=json&origin=*`;

  const res = await nodeFetch(
    url,
    {
      headers: { 'User-Agent': 'LWD-Demo-Bot (pyratin@gmail.com)' },
      timeout: 10000
    }
  ).catch(() => null);

  if (!res?.ok) return '';

  const json = await res.json().catch(() => null);
  const pages = json?.query?.pages;

  if (!pages) return '';

  const pageId = Object.keys(pages)[0];
  return pages[pageId]?.extract || '';
};

/**
 * Simple chunking function to split text into overlapping chunks.
 */
const textChunk = (text, size = 500, overlap = 50) => {

  const chunks = [];
  let start = 0;

  while (start < text.length) {

    const end = start + size;
    chunks.push(text.slice(start, end));
    start = end - overlap;
  }

  return chunks;
};

export {
  wikiTextGet,
  textChunk
};
