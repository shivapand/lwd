'use strict';

import nodeFetch from 'node-fetch';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const GROQ_MODEL = 'llama-3.3-70b-versatile';

const MAX_RETRIES = 3;

const groqFetch = async (prompt, attempt = 0) => {

  const apiKey = process.env.GROQ_API_KEY;

  return (!apiKey)
    ? null
    : await (async () => {

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
            temperature: 0.3
          }),
          timeout: 30000
        }
      );

      return (res.status === 429 && attempt < MAX_RETRIES)
        ? await (async () => {

          const retryAfter = res.headers.get('retry-after');

          const delay = (retryAfter && parseInt(retryAfter) * 1000) ||
            (Math.pow(2, attempt) * 2000);

          await new Promise(
            (resolve) => setTimeout(resolve, delay)
          );

          return groqFetch(prompt, attempt + 1);
        })()
        : (!res.ok)
          ? null
          : await (async () => {

            const json = await res.json();

            const text = json?.choices?.[0]?.message?.content;

            const parsed = (!text)
              ? null
              : JSON.parse(text);

            return parsed;
          })();
    })();
};

export default groqFetch;
