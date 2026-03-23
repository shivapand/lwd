'use strict';

import nodeFetch from 'node-fetch';

/**
 * Fetches the full plain text content of a Wikipedia page.
 * Improved to handle ambiguous titles by searching for film-related versions.
 */
const wikiTextGet = async (title) => {

  // Step 1: Try to find the best title using the search API first
  // This is better than guessing the title directly (e.g., "Shiva (1989 film)")
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(`${title} film`)}&format=json&origin=*`;

  const searchRes = await nodeFetch(
    searchUrl,
    {
      headers: { 'User-Agent': 'LWD-Demo-Bot (pyratin@gmail.com)' },
      timeout: 5000
    }
  ).catch(() => null);

  let targetTitle = title;

  if (searchRes?.ok) {
    const searchJson = await searchRes.json().catch(() => null);
    const topResult = searchJson?.query?.search?.[0];
    
    // If the top search result title contains the original title, use it
    if (topResult && topResult.title.toLowerCase().includes(title.toLowerCase())) {
      targetTitle = topResult.title;
    }
  }

  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext&titles=${encodeURIComponent(targetTitle)}&format=json&origin=*`;

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
  const extract = pages[pageId]?.extract || '';

  // If the extract is too short or doesn't mention film/movie, it might still be the wrong page
  if (extract.length < 500 && !extract.toLowerCase().includes('film') && !extract.toLowerCase().includes('movie')) {
    // Fallback: try title + " (film)" directly if search was weak
    const fallbackUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext&titles=${encodeURIComponent(`${title} (film)`)}&format=json&origin=*`;
    const fallbackRes = await nodeFetch(fallbackUrl, { timeout: 5000 }).catch(() => null);
    if (fallbackRes?.ok) {
      const fallbackJson = await fallbackRes.json().catch(() => null);
      const fallbackPages = fallbackJson?.query?.pages;
      const fallbackId = fallbackPages ? Object.keys(fallbackPages)[0] : null;
      if (fallbackId && fallbackId !== '-1') {
        return fallbackPages[fallbackId]?.extract || extract;
      }
    }
  }

  return extract;
};

/**
 * Simple chunking function to split text into overlapping chunks.
 */
const textChunk = (text, size = 250, overlap = 50) => {

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
