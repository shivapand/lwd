'use strict';

import nodeFetch from 'node-fetch';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Use the guaranteed free version of Gemini 2.0 Flash
const OPENROUTER_MODEL = 'google/gemini-2.0-flash-001:free';

const MAX_RETRIES = 3;

const openrouterFetch = async (prompt, attempt = 0) => {

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    // eslint-disable-next-line no-console
    console.error('[OpenRouter] API Key missing!');
    return null;
  }

  try {
    const res = await nodeFetch(
      OPENROUTER_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://pyratin-lwd.hf.space', // Required by OpenRouter
          'X-Title': 'LWD Cinematic Roasts' // Optional but good practice
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3
        }),
        timeout: 30000
      }
    );

    if (res.status === 429 && attempt < MAX_RETRIES) {
      const retryAfter = res.headers.get('retry-after');
      const delay = (retryAfter && parseInt(retryAfter) * 1000) ||
        (Math.pow(2, attempt) * 2000);

      // eslint-disable-next-line no-console
      console.warn(`[OpenRouter] Rate limited, retrying in ${delay}ms...`);

      await new Promise(
        (resolve) => setTimeout(resolve, delay)
      );

      return openrouterFetch(prompt, attempt + 1);
    }

    if (!res.ok) {
      const errorText = await res.text();
      // eslint-disable-next-line no-console
      console.error(`[OpenRouter] API Error (${res.status}):`, errorText);
      return null;
    }

    const json = await res.json();

    const text = json?.choices?.[0]?.message?.content;

    if (!text) {
      // eslint-disable-next-line no-console
      console.error('[OpenRouter] No content in response');
      return null;
    }

    try {
      // OpenRouter sometimes wraps JSON in markdown blocks
      const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanJson);

    } catch (parseError) {
      // eslint-disable-next-line no-console
      console.error('[OpenRouter] JSON Parse Error:', parseError.message);
      // eslint-disable-next-line no-console
      console.error('[OpenRouter] Raw text:', text);
      return null;
    }

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[OpenRouter] Fetch Error:', error.message);
    return null;
  }
};

export default openrouterFetch;
