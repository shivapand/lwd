'use strict';

import tmdbFetch from './tmdbFetch';
import wikipediaPlotGet from './wikipediaPlotGet';
import sentencesTokenizedGet from './sentencesTokenizedGet';
import sentencesGet from './sentencesGet';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const PLACEHOLDER_POSTER =
  'https://via.placeholder.com/320x480?text=No+Poster';

const MIN_POPULARITY = 5;

const MAX_CANDIDATES = 3;

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

const candidateResultGet = async (movieResult, plotLimit) => {

  const detailJson = await tmdbFetch(
    `/movie/${movieResult.id}?append_to_response=credits&language=en-US`
  );

  return (!detailJson?.credits)
    ? null
    : await (async () => {

      const _title = detailJson.title;

      const poster = detailJson.poster_path
        ? `${TMDB_IMAGE_BASE}${detailJson.poster_path}`
        : PLACEHOLDER_POSTER;

      const cast = castGet(detailJson.credits);

      return (!cast.length)
        ? null
        : await (async () => {

          const plot = await wikipediaPlotGet(
            _title,
            plotLimit
          );

          const _plot = (plot?.length)
            ? plot
            : (detailJson.overview)
              ? overviewPlotGet(detailJson.overview, plotLimit)
              : null;

          return (!_plot)
            ? null
            : {
              title: _title,
              poster,
              cast,
              plot: _plot
            };
        })();
    })();
};

export default async (title, plotLimit) => {

  try {

    const searchJson = await tmdbFetch(
      `/search/movie?query=${encodeURIComponent(title)}&language=en-US&page=1`
    );

    const candidateCollection = (searchJson?.results || [])
      .filter(
        ({ popularity }) => popularity >= MIN_POPULARITY
      )
      .slice(0, MAX_CANDIDATES);

    return (!candidateCollection.length)
      ? null
      : await candidateCollection.reduce(
        async (memoPromise, movieResult) => {

          const memo = await memoPromise;

          return (memo)
            ? memo
            : await candidateResultGet(
              movieResult,
              plotLimit
            );
        },
        Promise.resolve(null)
      );
  } catch (error) {

    return null;
  }
};
