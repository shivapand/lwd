'use strict';

import nodeFetch from 'node-fetch';

const HF_MODEL = 'BAAI/bge-small-en-v1.5';

/**
 * Gets embeddings for an array of texts using Hugging Face.
 */
const embeddingsGet = async (texts) => {

  const token = process.env.HF_ACCESS_TOKEN;

  if (!token) {
    throw new Error('HF_ACCESS_TOKEN not found in environment');
  }

  const res = await nodeFetch(
    `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: texts
      })
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`HF API error: ${error}`);
  }

  return await res.json();
};

/**
 * Simple cosine similarity calculation.
 */
const cosineSimilarity = (vecA, vecB) => {

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {

    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

export {
  embeddingsGet,
  cosineSimilarity
};
