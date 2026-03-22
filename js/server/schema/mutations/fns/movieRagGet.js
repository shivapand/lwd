'use strict';

import {
  wikiTextGet,
  textChunk
} from './wikiRagUtils';
import {
  embeddingsGet,
  cosineSimilarity
} from './hfRagUtils';

/**
 * Main RAG logic: Fetch, Chunk, Embed, and Retrieve.
 */
const movieRagGet = async (title, queryText = '') => {

  // eslint-disable-next-line no-console
  console.log(`[RAG] Fetching Wikipedia for "${title}"...`);

  const wikiText = await wikiTextGet(title);

  if (!wikiText) {
    // eslint-disable-next-line no-console
    console.warn(`[RAG] No Wikipedia data found for "${title}"`);
    return [];
  }

  // eslint-disable-next-line no-console
  console.log(`[RAG] Chunking text (${wikiText.length} chars)...`);

  const chunks = textChunk(wikiText, 800, 100);

  // eslint-disable-next-line no-console
  console.log(`[RAG] Generating embeddings for ${chunks.length} chunks...`);

  // To avoid hitting API limits with too many chunks at once,
  // we could batch this, but for a single movie it should be fine.
  const embeddings = await embeddingsGet(chunks);

  if (!queryText) {

    // If no query, just return a few chunks to show it's working
    return chunks.slice(0, 3).map((text, i) => ({
      text,
      score: 1.0,
      index: i
    }));
  }

  // eslint-disable-next-line no-console
  console.log(`[RAG] Generating embedding for query: "${queryText}"`);

  const [queryEmbedding] = await embeddingsGet([queryText]);

  // eslint-disable-next-line no-console
  console.log('[RAG] Calculating similarity and ranking chunks...');

  const results = chunks.map((text, i) => {

    const similarity = cosineSimilarity(queryEmbedding, embeddings[i]);

    return {
      text,
      score: similarity,
      index: i
    };
  });

  // Sort by similarity descending
  results.sort((a, b) => b.score - a.score);

  // Return top 5 results
  return results.slice(0, 5);
};

export default movieRagGet;
