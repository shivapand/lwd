'use strict';

import mediawikiFetch from './mediawikiFetch';
import geminiFetch from './geminiFetch';

const PLACEHOLDER_POSTER =
  'https://via.placeholder.com/320x480?text=No+Poster';

const posterSummaryUrlGet = (title) =>
  `https://en.wikipedia.org/api/rest_v1/page/summary/${
    encodeURIComponent(title)
  }`;

const posterGet = async (title) => {

  const res = await mediawikiFetch(
    posterSummaryUrlGet(title)
  );

  return res?.thumbnail?.source || PLACEHOLDER_POSTER;
};

const groqPromptGet = (title, plotLimit) =>
  `You are a movie expert. For the movie "${title}", provide the main cast and a funny plot retelling.

Return JSON:
{
  "cast": [
    { "actor": "Leonardo DiCaprio", "character": "Dom Cobb" }
  ],
  "sentences": [
    [{"text": "Dom", "role": "hero"}, {"text": " steals dreams like WiFi."}]
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
- Be cheeky, entertaining, and genuinely funny — like a friend roasting the plot over drinks
- Use humor: sarcasm, understatement, absurd observations`;

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

  const [poster, groqResult] = await Promise.all([
    posterGet(title),
    geminiFetch(groqPromptGet(title, plotLimit))
      .catch(() => null)
  ]);

  return (!groqResult?.cast?.length || !groqResult?.sentences?.length)
    ? null
    : (() => {

      const cast = castFromGroqGet(groqResult.cast);

      const roles = {
        hero: roleNameFromSentencesGet(groqResult.sentences, 'hero'),
        heroine: roleNameFromSentencesGet(groqResult.sentences, 'heroine'),
        villain: roleNameFromSentencesGet(groqResult.sentences, 'villain')
      };

      return {
        title,
        poster,
        cast: castWithRolesGet(cast, roles),
        plot: groqResult.sentences.map(
          (tokens, sentenceIndex) => ({
            text: tokensTextJoinedGet(tokens),
            tokens,
            sentenceIndex
          })
        )
      };
    })();
};
