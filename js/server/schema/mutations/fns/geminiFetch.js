'use strict';

import nodeFetch from 'node-fetch';

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const geminiFetch = async (prompt) => {

  const apiKey = process.env.GEMINI_API_KEY;

  return (!apiKey)
    ? null
    : await (async () => {

      const res = await nodeFetch(
        `${GEMINI_URL}?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: 'application/json'
            }
          }),
          timeout: 30000
        }
      );

      return (!res.ok)
        ? null
        : await (async () => {

          const json = await res.json();

          const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;

          return (!text)
            ? null
            : JSON.parse(text);
        })();
    })();
};

export default geminiFetch;
