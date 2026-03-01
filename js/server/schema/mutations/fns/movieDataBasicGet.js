'use strict';

import cheerio from 'cheerio';
import mediawikiFetch from './mediawikiFetch';
import movieDataBasicCastGet from './movieDataBasicCastGet';
import geminiFetch from './geminiFetch';

const PLACEHOLDER_POSTER =
  'https://via.placeholder.com/320x480?text=No+Poster';

const CAST_SECTION_NAMES = [
  'cast',
  'cast and characters',
  'main cast',
  'cast and crew'
];

const NON_CHARACTER_NAMES = [
  'self',
  'himself',
  'herself',
  'themselves',
  'narrator',
  'uncredited',
  'extra',
  'background'
];

const nonCharacterFlag = (name) =>
  NON_CHARACTER_NAMES.find(
    (nc) => name.toLowerCase().includes(nc)
  ) || !name.length;

const posterSummaryUrlGet = (title) =>
  `https://en.wikipedia.org/api/rest_v1/page/summary/${
    encodeURIComponent(title)
  }`;

const sectionsQueryGet = (title) =>
  `https://en.wikipedia.org/w/api.php?action=parse&page=${
    encodeURIComponent(title)
  }&prop=sections&redirects=1&format=json&origin=*`;

const sectionTextQueryGet = (title, sectionIndex) =>
  `https://en.wikipedia.org/w/api.php?action=parse&page=${
    encodeURIComponent(title)
  }&prop=text&section=${sectionIndex}&redirects=1&format=json&origin=*`;

const actorSummaryUrlGet = (ud) =>
  `https://en.wikipedia.org/api/rest_v1/page/summary/${
    encodeURIComponent(ud)
  }`;

const posterGet = async (title) => {

  const res = await mediawikiFetch(
    posterSummaryUrlGet(title)
  );

  return res?.thumbnail?.source || PLACEHOLDER_POSTER;
};

const castSectionIndexGet = (sections) =>
  sections.reduce(
    (memo, section) =>
      memo ?? (
        CAST_SECTION_NAMES.find(
          (name) => section.line.toLowerCase() === name
        )
          ? Number(section.index)
          : null
      ),
    null
  );

const characterNameFromRoleGet = (role, actorName) => {

  const asPattern = new RegExp(
    `^${actorName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+as\\s+`,
    'i'
  );

  const characterNameFull = role.replace(asPattern, '').trim();

  const characterName = characterNameFull
    .split('/')[0]
    .replace(/\(.*?\)/g, '')
    .trim();

  return { characterName, characterNameFull };
};

const genderFromTextGet = (text) => {

  switch (true) {

    case !!text.match(/actress/i):
      return 'woman';

    case !!text.match(/(actor|comedian)/i):
      return 'man';

    default:
      return 'unknown';
  }
};

const actorEnrichedGet = async (actor) => {

  return (!actor.ud)
    ? { gender: 'unknown', profileImage: null }
    : await (async () => {

      const res = await mediawikiFetch(
        actorSummaryUrlGet(actor.ud)
      );

      return (!res)
        ? { gender: 'unknown', profileImage: null }
        : (() => {

          const extract = res.extract || '';

          const gender = genderFromTextGet(extract);

          const profileImage = res.thumbnail?.source || null;

          return { gender, profileImage };
        })();
    })();
};

const castEnrichedGet = async (rawCast) => {

  const enrichedCollection = await Promise.all(
    rawCast.map(
      async ({ actor, role }) => {

        const { characterName, characterNameFull } =
          characterNameFromRoleGet(role, actor.text);

        return (nonCharacterFlag(characterName))
          ? null
          : await (async () => {

            const { gender, profileImage } = await actorEnrichedGet(actor);

            return {
              actor: {
                text: actor.text,
                ud: actor.ud,
                gender
              },
              characterName,
              characterNameFull,
              profileImage,
              role
            };
          })();
      }
    )
  );

  return enrichedCollection.filter(Boolean);
};

const PLOT_SECTION_NAMES = [
  'plot',
  'synopsis',
  'premise',
  'plot summary',
  'story'
];

const plotSectionIndexGet = (sections) =>
  sections.reduce(
    (memo, section) =>
      memo ?? (
        PLOT_SECTION_NAMES.find(
          (name) => section.line.toLowerCase() === name
        )
          ? Number(section.index)
          : null
      ),
    null
  );

const rawPlotTextGet = async (title) => {

  const sectionsJson = await mediawikiFetch(
    sectionsQueryGet(title)
  );

  const sections = sectionsJson?.parse?.sections;

  return (!sections)
    ? null
    : await (async () => {

      const sectionIndex = plotSectionIndexGet(sections);

      return (sectionIndex === null)
        ? null
        : await (async () => {

          const sectionJson = await mediawikiFetch(
            sectionTextQueryGet(title, sectionIndex)
          );

          const html = sectionJson?.parse?.text?.['*'];

          return (!html)
            ? null
            : (() => {

              const $ = cheerio.load(html);

              $('span.mw-reflink-text, sup').remove();

              return $('p')
                .toArray()
                .map((p) => $(p).text().trim())
                .filter((text) => text.length > 0)
                .join(' ');
            })();
        })();
    })();
};

const geminiPromptGet = (rawPlotText, castNames, plotLimit) =>
  `Analyze this movie plot. Return JSON with this exact structure:
{
  "sentences": ["...", "..."],
  "hero": "CharacterName or null",
  "heroine": "CharacterName or null",
  "villain": "CharacterName or null"
}

Rules for sentences:
- Exactly ${plotLimit} short sentences (max 75 characters each)
- Tell the story in chronological order
- Use character first names from the cast list
- Each sentence should be a complete thought

Rules for roles:
- hero: the main male protagonist from the cast list, or null
- heroine: the main female lead from the cast list, or null
- villain: the main antagonist from the cast list, or null
- Use the character names exactly as they appear in the cast list

Cast: ${castNames}
Plot: ${rawPlotText}`;

const geminiPlotAndRolesGet = async (rawPlotText, cast, plotLimit) => {

  const castNames = cast
    .map(({ characterName, actor }) =>
      `${characterName} (${actor.text})`
    )
    .join(', ');

  const prompt = geminiPromptGet(rawPlotText, castNames, plotLimit);

  const result = await geminiFetch(prompt)
    .catch(() => null);

  return (!result?.sentences?.length)
    ? null
    : {
      plot: result.sentences.map(
        (text, sentenceIndex) => ({ text, sentenceIndex })
      ),
      roles: {
        hero: result.hero || null,
        heroine: result.heroine || null,
        villain: result.villain || null
      }
    };
};

const castGet = async (title) => {

  const sectionsJson = await mediawikiFetch(
    sectionsQueryGet(title)
  );

  const sections = sectionsJson?.parse?.sections;

  return (!sections)
    ? null
    : await (async () => {

      const sectionIndex = castSectionIndexGet(sections);

      return (sectionIndex === null)
        ? null
        : await (async () => {

          const sectionJson = await mediawikiFetch(
            sectionTextQueryGet(title, sectionIndex)
          );

          const html = sectionJson?.parse?.text?.['*'];

          const rawCast = (!html)
            ? null
            : movieDataBasicCastGet(html);

          return (!rawCast?.length)
            ? null
            : await castEnrichedGet(rawCast);
        })();
    })();
};

export default async (title, plotLimit) => {

  const [poster, cast, rawPlotText] = await Promise.all([
    posterGet(title),
    castGet(title),
    rawPlotTextGet(title)
  ]);

  const geminiResult = (!cast?.length || !rawPlotText)
    ? null
    : await geminiPlotAndRolesGet(rawPlotText, cast, plotLimit);

  return (!geminiResult)
    ? null
    : {
      title,
      poster,
      cast,
      plot: geminiResult.plot,
      roles: geminiResult.roles
    };
};
