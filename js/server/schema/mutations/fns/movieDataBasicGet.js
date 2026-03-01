'use strict';

import tmdbFetch from './tmdbFetch';
import wikipediaPlotGet from './wikipediaPlotGet';
import sentencesTokenizedGet from './sentencesTokenizedGet';
import sentencesGet from './sentencesGet';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const PLACEHOLDER_POSTER =
  'https://via.placeholder.com/320x480?text=No+Poster';

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

const genderMapGet = (genderCode) =>

  ({
    1: 'woman',
    2: 'man'
  })[genderCode] || 'unknown';

const characterNameCleanedGet = (character) =>
  character
    .split('/')[0]
    .replace(/\(.*?\)/g, '')
    .trim();

const nonCharacterFlag = (name) =>
  NON_CHARACTER_NAMES.find(
    (nc) => name.toLowerCase().includes(nc)
  ) || !name.length;

const castGet = (credits) =>

  credits.cast.reduce(
    (memo, member) => {

      const characterName = characterNameCleanedGet(
        member.character || ''
      );

      return nonCharacterFlag(characterName)
        ? memo
        : [
          ...memo,
          {
            actor: {
              text: member.name,
              ud: null,
              gender: genderMapGet(member.gender)
            },
            characterName,
            characterNameFull: member.character || '',
            profileImage: member.profile_path
              ? `${TMDB_IMAGE_BASE}${member.profile_path}`
              : null,
            role: `${member.name} as ${characterName}`
          }
        ];
    },
    []
  );

const overviewPlotGet = (overview, plotLimit) => {

  const sentences = sentencesTokenizedGet(overview);

  const _sentences = sentencesGet(
    sentences.slice(0, plotLimit),
    75
  );

  return _sentences.map(
    (text, sentenceIndex) => ({
      text,
      sentenceIndex
    })
  );
};

export default async (title, plotLimit) => {

  console.log(`movieDataBasicGet start: ${title}`);

  try {

    const searchJson = await tmdbFetch(
      `/search/movie?query=${encodeURIComponent(title)}&language=en-US&page=1`
    );

    const movieResult = searchJson?.results?.[0];

    return (!movieResult)
      ? (() => {

        console.log(`TMDB search returned no results for: ${title}`);

        return null;
      })()
      : await (async () => {

        const detailJson = await tmdbFetch(
          `/movie/${movieResult.id}?append_to_response=credits&language=en-US`
        );

        return (!detailJson?.credits)
          ? (() => {

            console.log(`TMDB detail fetch failed for: ${title}`);

            return null;
          })()
          : await (async () => {

            const _title = detailJson.title;

            const poster = detailJson.poster_path
              ? `${TMDB_IMAGE_BASE}${detailJson.poster_path}`
              : PLACEHOLDER_POSTER;

            const cast = castGet(detailJson.credits);

            const plot = await wikipediaPlotGet(
              _title,
              plotLimit
            );

            const _plot = (plot?.length)
              ? plot
              : (detailJson.overview)
                ? overviewPlotGet(detailJson.overview, plotLimit)
                : null;

            return (!_plot || !cast.length)
              ? (() => {

                console.log(
                  `movieDataBasicGet incomplete for ${_title}. Plot: ${!!_plot}, Cast: ${cast.length}`
                );

                return null;
              })()
              : (() => {

                console.log(
                  `movieDataBasicGet success for ${_title}. Cast: ${cast.length}, Plot sentences: ${_plot.length}`
                );

                return {
                  title: _title,
                  poster,
                  cast,
                  plot: _plot
                };
              })();
          })();
      })();
  } catch (error) {

    console.log(`movieDataBasicGet error: ${error.message}`);

    return null;
  }
};
