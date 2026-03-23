'use strict';

import {
  wikiTextGet,
  textChunk
} from './wikiRagUtils';
import {
  embeddingsGet,
  cosineSimilarity
} from './hfRagUtils';
import { broadcastStatus } from '~/js/server/fns/statusEmitter';

/**
 * Main RAG logic: Fetch, Chunk, Embed, and Retrieve.
 */
const movieRagGet = async (title, queryText = '') => {

  try {
    // eslint-disable-next-line no-console
    console.log(`[RAG] Fetching Wikipedia for "${title}"...`);
    broadcastStatus(title, 'Fetching Wikipedia...');

    const wikiText = await wikiTextGet(title);

    if (!wikiText) {
      // eslint-disable-next-line no-console
      console.warn(`[RAG] No Wikipedia data found for "${title}"`);
      return [];
    }

    // eslint-disable-next-line no-console
    console.log(`[RAG] Extracting Plot section from (${wikiText.length} chars)...`);
    broadcastStatus(title, `Extracting plot details...`);

    // Robust plot extraction: look for "== Plot ==" and take everything until the next header
    const plotMatch = wikiText.match(/== Plot ==([\s\S]*?)(?=== [^=]+ ==|$)/i);
    const plotText = plotMatch ? plotMatch[1].trim() : wikiText;

    const chunks = textChunk(plotText, 300, 50);

    // eslint-disable-next-line no-console
    console.log(`[RAG] Generating embeddings for ${chunks.length} plot chunks...`);
    broadcastStatus(title, `Generating embeddings for ${chunks.length} chunks...`);

    const embeddings = await embeddingsGet(chunks);

    if (!Array.isArray(embeddings) || embeddings.length === 0) {
      console.error('[RAG] Failed to get valid embeddings for chunks');
      return [];
    }

    if (!queryText) {
      return chunks.slice(0, 3).map((text, i) => ({
        text,
        score: 1.0,
        index: i
      }));
    }

    // eslint-disable-next-line no-console
    console.log(`[RAG] Generating embedding for query: "${queryText}"`);
    broadcastStatus(title, 'Embedding query & calculating similarities...');

    const queryEmbeddings = await embeddingsGet([queryText]);
    
    if (!Array.isArray(queryEmbeddings) || !queryEmbeddings[0]) {
      console.error('[RAG] Failed to get valid embedding for query');
      return [];
    }

    const queryEmbedding = queryEmbeddings[0];

    // eslint-disable-next-line no-console
    console.log('[RAG] Calculating similarity and ranking chunks...');

    const results = chunks.map((text, i) => {

      const chunkEmbedding = embeddings[i];
      
      if (!Array.isArray(chunkEmbedding) || !Array.isArray(queryEmbedding)) {
        return { text, score: 0, index: i };
      }

      const similarity = cosineSimilarity(queryEmbedding, chunkEmbedding);

      return {
        text,
        score: isNaN(similarity) ? 0 : similarity,
        index: i
      };
    });

    // Sort by similarity descending
    results.sort((a, b) => b.score - a.score);

    const topResults = results.slice(0, 3);
    
    // eslint-disable-next-line no-console
    console.log(`[RAG] COMPLETED: Found ${topResults.length} relevant chunks.`);

    return topResults;

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[RAG] Critical Error:', error.message);
    return [];
  }
};

export default movieRagGet;
