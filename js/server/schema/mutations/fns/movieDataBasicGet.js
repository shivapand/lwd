'use strict';

import nodeFetch from 'node-fetch';
import groqFetch from './groqFetch';
import openrouterFetch from './openrouterFetch';
import movieRagGet from './movieRagGet';
import { broadcastStatus } from '~/js/server/fns/statusEmitter';

const PLACEHOLDER_POSTER = '/poster-fallback.png';

const posterGet = async (title) => {

  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

  const res = await nodeFetch(url, {
    headers: { 'User-Agent': 'LWD-Demo-Bot (pyratin@gmail.com)' },
    timeout: 5000
  }).catch(() => null);

  const json = (res?.ok) ? await res.json().catch(() => null) : null;

  return json?.thumbnail?.source || PLACEHOLDER_POSTER;
};

const groqPromptGet = (title, plotLimit, ragContext = '') =>
  `You are a cynical movie critic who hates everything. For the movie "${title}", provide the main cast and a devastatingly funny roast of the plot.

${ragContext ? `Here are some absurd plot points and critical feedback from Wikipedia to use as fodder for your roast:
---
${ragContext}
---
` : ''}

Style Guide for your Roast:
1. Be brutally honest about how silly the premise is.
2. Use sharp, deadpan sarcasm and dry humor.
3. Treat epic movie tropes as if they are mundane, everyday annoyances.
4. VARIETY MANDATE: Ensure every sentence is unique and tailored strictly to the facts provided in the context.

MANDATORY ROLE TAGGING:
- You MUST identify exactly ONE "hero", exactly ONE "heroine", and exactly ONE "villain".
- In the JSON "sentences" array, the object representing their name MUST have the "role" property set to "hero", "heroine", or "villain".
- All other characters mentioned MUST have the "role": "other".
- A character's role is FIXED across all sentences.

CHARACTER LIMIT:
- CRITICAL: Each total sentence (sum of all tokens) MUST be less than 75 characters long.

Return JSON:
{
  "cast": [
    { "actor": "Leonardo DiCaprio", "character": "Dom Cobb" }
  ],
  "sentences": [
    [{"text": "CharacterName", "role": "hero"}, {"text": " makes a series of bad choices."}]
  ]
}

Cast rules:
- Include the main cast members (up to 15)
- Order by billing/importance

Token rules:
- Each sentence is an array of tokens (objects with "text" and optionally "role")
- Character name tokens MUST have "role": exactly one of "hero", "heroine", "villain", or "other"
- Non-character tokens only have "text" and MUST include leading/trailing spaces for proper spacing

Sentence rules:
- Exactly ${plotLimit} sentences, chronological order
- Every sentence must mention at least one character by name
- Never apologize for the movie; just roast it based on the facts provided.`;

const castFromGroqGet = (groqCast) =>
  groqCast.reduce(
    (memo, { actor, character }) => [
      ...memo,
      {
        actor: {
          text: actor,
          ud: null,
          gender: 'unknown'
        },
        characterName: character,
        characterNameFull: character,
        profileImage: null,
        role: `${actor} as ${character}`
      }
    ],
    []
  );

const castMemberMatchFromNameGet = (name, cast) =>
  (!name)
    ? null
    : cast.find(
      (member) => {

        const lowerName = name.toLowerCase();

        return [
          member.characterName,
          member.characterNameFull
        ]
          .filter(Boolean)
          .find(
            (variant) =>
              variant.toLowerCase().includes(lowerName) ||
              lowerName.includes(variant.toLowerCase())
          );
      }
    );

const castWithRolesGet = (cast, roles) => {

  const heroMember = castMemberMatchFromNameGet(roles.hero, cast);
  const heroineMember = castMemberMatchFromNameGet(roles.heroine, cast);
  const villainMember = castMemberMatchFromNameGet(roles.villain, cast);

  return cast.reduce(
    (memo, member) => [
      ...memo,
      (member === heroMember)
        ? { ...member, castRole: 'hero' }
        : (member === heroineMember)
          ? { ...member, castRole: 'heroine' }
          : (member === villainMember)
            ? { ...member, castRole: 'villain' }
            : member
    ],
    []
  );
};

const tokensTextJoinedGet = (tokens) =>
  tokens.reduce(
    (memo, t) => {

      const needsSpace = memo.length > 0 &&
        !memo.endsWith(' ') &&
        !t.text.startsWith(' ');

      return `${memo}${needsSpace ? ' ' : ''}${t.text}`;
    },
    ''
  );

const roleNameFromSentencesGet = (sentences, role) =>
  sentences.reduce(
    (memo, tokens) =>
      memo || (tokens.find((t) => t.role === role)?.text || null),
    null
  );

export default async (title, plotLimit) => {

  // Fetch "Roastable" RAG context with a timeout
  console.log(`[RAG] START: Extracting roast material for "${title}"...`);
  broadcastStatus(title, 'Reading Wikipedia archives...');
  const ragResults = await Promise.race([
    movieRagGet(
      title,
      `What are the most ridiculous, logic-defying, or heavily criticized plot points and character motivations in ${title}?`
    ),
    new Promise((_, reject) => setTimeout(() => reject(new Error('RAG Timeout')), 15000))
  ]).catch((error) => {
    // eslint-disable-next-line no-console
    console.error('RAG Error or Timeout:', error.message);
    return [];
  });

  const ragContext = ragResults.length > 0
    ? ragResults.map((r) => r.text).join('\n\n')
    : `No specific Wikipedia data found for "${title}", use your general knowledge.`;

  console.log(`[LLM] START: Requesting roast and poster for "${title}"...`);
  broadcastStatus(title, 'Consulting AI for the perfect roast...');
  
  const [poster, llmResult] = await Promise.all([
    posterGet(title).then(res => {
      console.log(`[LLM] Poster fetched for "${title}".`);
      return res;
    }),
    // Try OpenRouter first, fallback to Groq
    openrouterFetch(groqPromptGet(title, plotLimit, ragContext))
      .then(async (res) => {
        if (res) {
          console.log(`[LLM] OpenRouter Result received for "${title}".`);
          return res;
        }
        
        console.warn(`[LLM] OpenRouter failed or rate limited, falling back to Groq for "${title}"...`);
        return groqFetch(groqPromptGet(title, plotLimit, ragContext))
          .then(groqRes => {
            if (groqRes) console.log(`[LLM] Groq Fallback successful for "${title}".`);
            return groqRes;
          });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('LLM Fetch Error:', error);
        return null;
      })
  ]);
  console.log(`[LLM] COMPLETED: Both tasks finished for "${title}".`);

  // Handle case where BOTH failed (rate limited or error)
  if (!llmResult?.cast?.length || !llmResult?.sentences?.length) {
    console.warn(`[LLM] CRITICAL: All providers failed for "${title}". Providing fallback data.`);
    return {
      title,
      poster,
      cast: [
        {
          actor: { text: "The Entire Cast", ud: null, gender: 'unknown' },
          characterName: "Themselves",
          characterNameFull: "Themselves",
          profileImage: null,
          role: "The Entire Cast"
        }
      ],
      plot: [
        {
          text: "Both Groq and OpenRouter are taking a coffee break.",
          tokens: [{ text: "Both Groq and OpenRouter are taking a coffee break." }],
          sentenceIndex: 0
        },
        {
          text: "Please wait a few minutes before trying this movie again.",
          tokens: [{ text: "Please wait a few minutes before trying this movie again." }],
          sentenceIndex: 1
        },
        {
          text: "Our AI brain is currently overloaded with requests.",
          tokens: [{ text: "Our AI brain is currently overloaded with requests." }],
          sentenceIndex: 2
        }
      ]
    };
  }

  return (() => {

      const cast = castFromGroqGet(llmResult.cast);

      const roles = {
        hero: roleNameFromSentencesGet(llmResult.sentences, 'hero'),
        heroine: roleNameFromSentencesGet(llmResult.sentences, 'heroine'),
        villain: roleNameFromSentencesGet(llmResult.sentences, 'villain')
      };

      return {
        title,
        poster,
        cast: castWithRolesGet(cast, roles),
        plot: llmResult.sentences.map(
          (tokens, sentenceIndex) => ({
            text: tokensTextJoinedGet(tokens),
            tokens,
            sentenceIndex
          })
        )
      };
    })();
};
