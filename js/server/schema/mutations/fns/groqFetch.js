'use strict';

import nodeFetch from 'node-fetch';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const GROQ_MODEL = 'llama-3.3-70b-versatile';

const MAX_RETRIES = 3;

const groqFetch = async (prompt, attempt = 0) => {

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    // eslint-disable-next-line no-console
    console.error('[Groq] API Key missing!');
    return null;
  }

  try {
    const res = await nodeFetch(
      GROQ_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3,
          max_tokens: 1024
        }),
        timeout: 30000
      }
    );

    if (res.status === 429) {
      // eslint-disable-next-line no-console
      console.warn(`[Groq] Rate limited for "${GROQ_MODEL}". Skipping retry to prevent clogging.`);
      return null;
    }

    if (!res.ok) {
      const errorText = await res.text();
      // eslint-disable-next-line no-console
      console.error(`[Groq] API Error (${res.status}):`, errorText);
      return null;
    }

    const json = await res.json();

    const text = json?.choices?.[0]?.message?.content;

    if (!text) {
      // eslint-disable-next-line no-console
      console.error('[Groq] No content in response');
      return null;
    }

    try {

      return JSON.parse(text);

    } catch (parseError) {

      // eslint-disable-next-line no-console
      console.error('[Groq] JSON Parse Error:', parseError.message);
      // eslint-disable-next-line no-console
      console.error('[Groq] Raw text:', text);
      return null;
    }

  } catch (error) {

    // eslint-disable-next-line no-console
    console.error('[Groq] Fetch Error:', error.message);
    return null;
  }
};

export default groqFetch;
