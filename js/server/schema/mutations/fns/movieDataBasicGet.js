'use strict';

import nodeFetch from 'node-fetch';
import groqFetch from './groqFetch';
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
  `Film: "${title}"
Context:
${ragContext}

Return JSON with exactly this structure:
{
  "cast": [{"actor":"Name","character":"Name"}],
  "sentences": [
    [{"text":"Name","role":"hero"},{"text":" did something."}],
    [{"text":"Name","role":"heroine"},{"text":" did something else."}]
  ]
}

Rules:
- ${plotLimit} to 8 sentences (<125 chars each) with proper grammar.
- "sentences" is an array of arrays.
- Each inner array contains token objects: {"text": "...", "role": "..."}.
- Roles: pick exactly 1 hero, 1 heroine, 1 villain. others "other".
- Use the provided Context to mock the movie's actual plot.
- Try to be creative and funny.`;

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

const tokensTextJoinedGet = (tokens) => {
  if (!Array.isArray(tokens)) {
    // eslint-disable-next-line no-console
    console.warn('[LLM] tokens is not an array:', tokens);
    return typeof tokens === 'string' ? tokens : '';
  }

  return tokens.reduce(
    (memo, t) => {

      const needsSpace = memo.length > 0 &&
        !memo.endsWith(' ') &&
        !t.text.startsWith(' ') &&
        !t.text.match(/^['.,!?;:]/);

      return `${memo}${needsSpace ? ' ' : ''}${t.text}`;
    },
    ''
  );
};

const roleNameFromSentencesGet = (sentences, role) =>
  sentences.reduce(
    (memo, tokens) => {
      if (memo) return memo;
      
      if (!Array.isArray(tokens)) return null;

      const token = tokens.find((t) => t.role === role);
      return token ? token.text : null;
    },
    null
  );

export default async (title, plotLimit) => {

  // Fetch plot-focused RAG context
  console.log(`[RAG] START: Extracting plot details for "${title}"...`);
  broadcastStatus(title, 'Reading Wikipedia archives...');
  const ragResults = await Promise.race([
    movieRagGet(
      title,
      `What are the most important and most absurd plot points and key scenes in the movie ${title}?`
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

  console.log(`[LLM] START: Requesting summary and poster for "${title}"...`);
  broadcastStatus(title, 'Consulting AI for the plot summary...');
  
  const [poster, llmResult] = await Promise.all([
    posterGet(title).then(res => {
      console.log(`[LLM] Poster fetched for "${title}".`);
      return res;
    }),
    groqFetch(groqPromptGet(title, plotLimit, ragContext))
      .then(res => {
        if (res) {
          console.log(`[LLM] Groq Result received for "${title}".`);
          // eslint-disable-next-line no-console
          console.log('[LLM] Sample sentence structure:', JSON.stringify(res.sentences?.[0]));
        }
        return res;
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('LLM Fetch Error:', error);
        return null;
      })
  ]);
  console.log(`[LLM] COMPLETED: Both tasks finished for "${title}".`);

  // Handle case where LLM failed (rate limited or error)
  if (!llmResult?.cast?.length || !llmResult?.sentences?.length) {
    console.warn(`[LLM] CRITICAL: Groq failed for "${title}". Providing fallback data.`);
    
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
          text: "Groq is currently taking a coffee break (Rate Limited).",
          tokens: [{ text: "Groq is currently taking a coffee break (Rate Limited)." }],
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
