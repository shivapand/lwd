'use strict';

import nodeFetch from 'node-fetch';
import groqFetch from './groqFetch';
import movieRagGet from './movieRagGet';

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
  `You are a cynical movie critic who hates everything and finds every plot point ridiculous. For the movie "${title}", provide the main cast and a devastatingly funny roast of the plot.

${ragContext ? `Here are some absurd plot points and critical feedback from Wikipedia to use as fodder for your roast:
---
${ragContext}
---
` : ''}

Style Guide for your Roast:
1. Be brutally honest about how silly the premise is.
2. Use creative, unexpected metaphors involving mundane, annoying modern life frustrations (e.g. bureaucracy, bad tech, awkward social situations).
3. Frame character motivations as incredibly poor life choices or professional incompetence.
4. Treat epic tropes (like "the prophecy" or "the mission") as if they are low-stakes office politics or retail shift drama.
5. Use deadpan sarcasm and dry humor.
6. VARIETY MANDATE: Never repeat the same joke or metaphor across different movies. Each roast must be uniquely tailored to the specific context provided.

MANDATORY ROLE TAGGING:
- You MUST identify exactly ONE "hero", exactly ONE "heroine", and exactly ONE "villain".
- The "hero" must be the primary male protagonist.
- The "heroine" must be the primary female lead.
- The "villain" must be the primary antagonist.
- In the JSON "sentences" array, the object representing their name MUST have the "role" property set to "hero", "heroine", or "villain".
- All other characters mentioned MUST have the "role": "other".

Return JSON:
{
  "cast": [
    { "actor": "Leonardo DiCaprio", "character": "Dom Cobb" }
  ],
  "sentences": [
    [{"text": "CharacterName", "role": "hero"}, {"text": " makes a series of questionable life choices."}]
  ]
}

Cast rules:
- Include the main cast members (up to 15)
- "actor" is the real actor's full name
- "character" is the character's full name
- Order by billing/importance

Token rules:
- Each sentence is an array of tokens (objects with "text" and optionally "role")
- Character name tokens MUST have "role": exactly one of "hero", "heroine", "villain", or "other"
- CRITICAL CONSTRAINT — role uniqueness:
  * Pick exactly ONE character as "hero" (the main male protagonist)
  * Pick exactly ONE character as "heroine" (the main female lead)
  * Pick exactly ONE character as "villain" (the main antagonist)
  * Every single other character MUST use "other" — no exceptions
  * A character's role is FIXED: if Dom is "hero" in sentence 1, he is "hero" in ALL sentences. No other character may ever be "hero".
  * This means across the ENTIRE response, only 3 distinct character names have non-"other" roles
- Non-character tokens only have "text" and MUST include leading/trailing spaces for proper spacing (e.g. " does something " not "does something")

Sentence rules:
- Exactly ${plotLimit} sentences, chronological order
- Max 75 characters per sentence (total of all token texts joined)
- Every sentence must mention at least one character by name
- Be cynical, sarcastic, and genuinely funny
- Never apologize for the movie; just roast it based on the facts provided in the context.`;

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

  console.log(`[Groq] START: Requesting roast and poster for "${title}"...`);
  const [poster, llmResult] = await Promise.all([
    posterGet(title).then(res => {
      console.log(`[Groq] Poster fetched for "${title}".`);
      return res;
    }),
    groqFetch(groqPromptGet(title, plotLimit, ragContext))
      .then(res => {
        console.log(`[Groq] LLM Result received for "${title}".`);
        return res;
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Groq Fetch Error:', error);
        return null;
      })
  ]);
  console.log(`[Groq] COMPLETED: Both tasks finished for "${title}".`);


  return (!llmResult?.cast?.length || !llmResult?.sentences?.length)
    ? null
    : (() => {

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
